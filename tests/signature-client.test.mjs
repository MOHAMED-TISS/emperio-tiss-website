import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import worker from '../src/index.js';

function setup(mail = false, beforeBatch) {
  const sql = new DatabaseSync(':memory:');
  for (const f of fs.readdirSync('migrations').sort()) sql.exec(fs.readFileSync(`migrations/${f}`, 'utf8'));
  const db = { prepare(query) {
    let values = [];
    const statement = {
      bind(...args) { values = args; return statement; },
      async first() { return sql.prepare(query).get(...values) || null; },
      async all() { return { results: sql.prepare(query).all(...values) }; },
      async run() { const r = sql.prepare(query).run(...values); return {meta:{changes:Number(r.changes),last_row_id:Number(r.lastInsertRowid)}}; }
    }; return statement;
  }, async batch(statements) {
    if (beforeBatch) { const hook=beforeBatch; beforeBatch=null; hook(sql); }
    return Promise.all(statements.map(s => s.run()));
  } };
  const env = {NEWS_DB:db, ADMIN_API_KEY:'test-secret', ...(mail ? {RESEND_API_KEY:'fake'} : {})};
  const call = (path, body, authenticated = true) => worker.fetch(new Request(`https://emperio-tiss.com${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers:{...(authenticated ? {authorization:'Bearer test-secret'} : {}), origin:'https://emperio-tiss.com','content-type':'application/json'},
    ...(body === undefined ? {} : {body:JSON.stringify(body)})
  }),env);
  const access = values => {
    const form = new FormData();
    for (const [key,value] of Object.entries(values)) {
      for (const item of Array.isArray(value) ? value : [value]) form.append(key,item);
    }
    return worker.fetch(new Request('https://emperio-tiss.com/api/private/request-access', {
      method:'POST', headers:{origin:'https://emperio-tiss.com'}, body:form
    }),env);
  };
  return {sql,env,call,access};
}


test('Signature requests enforce approval, visibility, ownership, validation and logout',async()=>{
 const {sql,env}=setup();const stamp=Math.floor(Date.now()/1000);
 const hash=Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode('client-token'))).toString('hex');
 sql.prepare("INSERT INTO clients(email,name,company,status,created_at,language,country) VALUES('client@example.com','Ana','Client SL','approved',?,'es','ES')").run(stamp);
 sql.prepare('INSERT INTO private_sessions(token_hash,email,expires_at) VALUES(?,?,?)').run(hash,'client@example.com',stamp+3600);
 const call=(path,body,cookie=true,origin='https://emperio-tiss.com')=>worker.fetch(new Request('https://emperio-tiss.com'+path,{method:body===undefined?'GET':'POST',headers:{origin,'content-type':'application/json',...(cookie?{cookie:'et_private_session=client-token'}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})}),env);
 assert.equal((await call('/api/private/requests',undefined,false)).status,401);
 sql.prepare("INSERT INTO private_offers(id,title,category,origin,valid_until,status,created_at,visibility_scope) VALUES(1,'Selected tuna','seafood','ES',?,'published',?,'all')").run(stamp+3600,stamp);
 const body={offer_id:1,kind:'order',quantity:200,unit:'kg',destination:'Madrid, ES',date:new Date(Date.now()+86400000).toISOString().slice(0,10),notes:'Fresh',email:'spoof@example.com'};
 assert.equal((await call('/api/private/requests',body,true,'https://evil.example')).status,403);
 assert.equal((await call('/api/private/requests',{...body,quantity:-1})).status,400);
 assert.equal((await call('/api/private/requests',null)).status,400);
 sql.prepare("UPDATE private_offers SET visibility_scope='client',visibility_value='other@example.com'").run();
 assert.equal((await call('/api/private/requests',body)).status,404);
 sql.prepare("UPDATE private_offers SET visibility_scope='all',valid_until=?").run(stamp-1);
 assert.equal((await call('/api/private/requests',body)).status,404);
 sql.prepare('UPDATE private_offers SET valid_until=?').run(stamp+3600);
 const response=await call('/api/private/requests',body);assert.equal(response.status,201,await response.clone().text());
 const row=sql.prepare('SELECT email,company,source,status,product_name FROM inquiries').get();
 assert.deepEqual({...row},{email:'client@example.com',company:'Client SL',source:'signature-order',status:'new',product_name:'Selected tuna'});
 assert.equal((await (await call('/api/private/requests')).json()).requests.length,1);
 sql.prepare("UPDATE inquiries SET email='other@example.com'").run();assert.equal((await (await call('/api/private/requests')).json()).requests.length,0);
 sql.prepare("UPDATE clients SET status='pending'").run();assert.equal((await call('/api/private/requests',body)).status,401);
 sql.prepare("UPDATE clients SET status='approved'").run();
 const logout=await call('/api/private/logout',{});assert.equal(logout.status,200);assert.match(logout.headers.get('set-cookie'),/Max-Age=0/);
 assert.equal((await call('/api/private/requests')).status,401);
});

test('access links preserve portal language and expired links return to localized login',async()=>{
 const {sql,env,access}=setup(true);let sent;const original=globalThis.fetch;
 sql.prepare("INSERT INTO clients(email,company,status,created_at,language) VALUES('fr@example.com','Client','approved',1,'fr')").run();
 globalThis.fetch=async(_u,options)=>{sent=JSON.parse(options.body);return Response.json({id:'mock'});};
 try{assert.equal((await access({email:'fr@example.com',language:'fr'})).status,200);assert.match(sent.html,/lang=fr/);assert.match(sent.subject,/Accès clients/);
 const link=sent.html.match(/href="([^"]+)"/)[1];const valid=await worker.fetch(new Request(link),env);assert.equal(valid.headers.get('location'),'/fr/private/');
 const expired=await worker.fetch(new Request(link),env);assert.match(expired.headers.get('location'),/\/fr\/private\/\?access_error=expired$/);
 }finally{globalThis.fetch=original;}
});
