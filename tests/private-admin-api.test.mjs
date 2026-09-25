import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import worker from '../src/index.js';

function setup(mail = false) {
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
  }, async batch(statements) { return Promise.all(statements.map(s => s.run())); } };
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

const validApplication = {
  tax_id:'B12345678', company:'Atlantic Foods SL', address:'Calle del Mar 8', country:'ES',
  contact_name:'Ana López', mobile:'+34 600 111 222', email:'ana@example.com',
  whatsapp:'+34 600 111 222', categories:['seafood','fruits'], products_interest:'Tuna and citrus',
  language:'es', privacy:'yes'
};

test('private applications require complete company details and an allowed category', async () => {
  const {access} = setup();
  assert.equal((await access({email:'ana@example.com'})).status,400);
  assert.equal((await access({...validApplication,categories:['seafood','seasonal']})).status,400);
});

test('private applications persist before notification and escape applicant content', async () => {
  const {access,sql} = setup(true);
  const originalFetch=globalThis.fetch; let payload;
  globalThis.fetch=async (_url,options)=>{payload=JSON.parse(options.body);return new Response('{}');};
  try {
    const response=await access({...validApplication,company:'Atlantic <Foods> SL'});
    assert.equal(response.status,200);
    const row=sql.prepare('SELECT tax_id,company,country,contact_name,mobile,whatsapp,products_interest,notification_status FROM clients WHERE email=?').get(validApplication.email);
    assert.deepEqual({...row},{tax_id:'B12345678',company:'Atlantic <Foods> SL',country:'ES',contact_name:'Ana López',mobile:'+34 600 111 222',whatsapp:'+34 600 111 222',products_interest:'Tuna and citrus',notification_status:'sent'});
    assert.deepEqual(sql.prepare('SELECT category FROM client_interests WHERE email=? ORDER BY category').all(validApplication.email).map(row=>({...row})),[{category:'fruits'},{category:'seafood'}]);
    assert.equal(payload.reply_to,validApplication.email);
    assert.match(payload.html,/Atlantic &lt;Foods&gt; SL/);
    assert.doesNotMatch(payload.html,/Atlantic <Foods> SL/);
  } finally {globalThis.fetch=originalFetch;}
});

test('notification failure keeps the application and records delivery state', async () => {
  const {access,sql}=setup(true);
  const originalFetch=globalThis.fetch;
  globalThis.fetch=async()=>new Response('{}',{status:503});
  try {
    const response=await access(validApplication);
    assert.equal(response.status,200);
    assert.equal((await response.json()).ok,true);
    assert.deepEqual({...sql.prepare('SELECT status,notification_status FROM clients WHERE email=?').get(validApplication.email)},{status:'pending',notification_status:'failed'});
  } finally {globalThis.fetch=originalFetch;}
});

test('admin lists require authentication and report database/mail health', async () => {
  const {call} = setup();
  assert.equal((await call('/api/private/admin/overview',undefined,false)).status,401);
  const data = await (await call('/api/private/admin/overview')).json();
  assert.equal(data.ok,true); assert.equal(data.emailConfigured,false);
  assert.deepEqual(data.clients,[]); assert.deepEqual(data.offers,[]);
  assert.deepEqual(data.analytics.summary,{total:0,pending:0,approved:0,rejected:0});
  assert.equal(data.analytics.daily.length,30);
  assert.deepEqual(data.analytics.countries,[]);
  assert.deepEqual(data.analytics.categories,[]);
});
test('admin overview aggregates requests by status, date, country, category and language', async () => {
  const {call,sql}=setup();
  const current=Math.floor(Date.now()/1000), yesterday=current-86400;
  sql.prepare("INSERT INTO clients(email,company,language,status,created_at,country) VALUES(?,?,?,?,?,?)").run('one@example.com','One','es','pending',current,'ES');
  sql.prepare("INSERT INTO clients(email,company,language,status,created_at,country,approved_at) VALUES(?,?,?,?,?,?,?)").run('two@example.com','Two','fr','approved',yesterday,'MA',current);
  sql.prepare("INSERT INTO clients(email,company,language,status,created_at,country) VALUES(?,?,?,?,?,?)").run('three@example.com','Three','es','rejected',current,'ES');
  sql.exec("INSERT INTO client_interests(email,category) VALUES('one@example.com','seafood'),('one@example.com','fruits'),('two@example.com','seafood')");
  const data=await (await call('/api/private/admin/overview')).json();
  assert.deepEqual(data.analytics.summary,{total:3,pending:1,approved:1,rejected:1});
  assert.equal(data.analytics.daily.length,30);
  assert.equal(data.analytics.daily.at(-1).count,2);
  assert.deepEqual(data.analytics.countries.map(row=>({...row})),[{label:'ES',count:2},{label:'MA',count:1}]);
  assert.deepEqual(data.analytics.categories.map(row=>({...row})),[{label:'seafood',count:2},{label:'fruits',count:1}]);
  assert.deepEqual(data.analytics.languages.map(row=>({...row})),[{label:'es',count:2},{label:'fr',count:1}]);
});
test('offers reject blank titles and expired dates, then return their ID', async () => {
  const {call} = setup();
  assert.equal((await call('/api/private/admin/offers',{title:'',valid_until:1})).status,400);
  const r = await (await call('/api/private/admin/offers',{title:'Availability',valid_until:Math.floor(Date.now()/1000)+600})).json();
  assert.ok(r.id > 0);
});
test('drafts persist without mail, sending fails closed without mail', async () => {
  const {call,sql} = setup();
  const r = await (await call('/api/private/admin/campaigns',{subject:'Signals',html:'<p>Hello</p>',language:'it'})).json();
  assert.ok(r.id);
  assert.equal((await call('/api/admin/newsletter/send',{campaign_id:r.id,confirm:true})).status,503);
  assert.equal(sql.prepare('SELECT status FROM campaigns WHERE id=?').get(r.id).status,'draft');
});
test('malformed JSON returns 400 without internal details', async () => {
  const {env} = setup();
  const r = await worker.fetch(new Request('https://emperio-tiss.com/api/private/admin/offers',{method:'POST',headers:{authorization:'Bearer test-secret','content-type':'application/json'},body:'{'}),env);
  assert.equal(r.status,400); assert.equal((await r.json()).detail,undefined);
});

test('unsubscribe needs confirmation and invalidates pending confirmation tokens', async () => {
  const {sql,call} = setup();
  sql.prepare('INSERT INTO subscribers(email,consent_at,confirmed_at,unsubscribe_token) VALUES(?,1,1,?)').run('a@example.com','token');
  sql.prepare('INSERT INTO auth_tokens VALUES(?,?,?,?)').run('hash','newsletter','a@example.com',9999999999);
  assert.equal((await call('/api/newsletter/unsubscribe?token=token')).status,200);
  assert.equal(sql.prepare('SELECT confirmed_at FROM subscribers').get().confirmed_at,1);
  assert.equal((await call('/api/newsletter/unsubscribe?token=token',{})).status,200);
  assert.equal(sql.prepare('SELECT confirmed_at FROM subscribers').get().confirmed_at,null);
  assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM auth_tokens').get().n,0);
});

test('campaigns segment consented recipients and never dispatch a recipient twice', async () => {
  const {sql,call} = setup(true);
  sql.exec("INSERT INTO subscribers(email,language,consent_at,confirmed_at,unsubscribe_token) VALUES('it@example.com','it',1,1,'u'),('en@example.com','en',1,1,'v'),('pending@example.com','it',1,NULL,'w')");
  const draft = await (await call('/api/private/admin/campaigns',{subject:'Signals',html:'<p>Content</p>',language:'it'})).json();
  const preview = await (await call(`/api/private/admin/campaigns/preview?id=${draft.id}`)).json();
  assert.equal(preview.recipients,1);
  assert.equal((await call('/api/admin/newsletter/send',{campaign_id:draft.id})).status,400);
  const originalFetch=globalThis.fetch; let sent=0;
  globalThis.fetch=async (url,options)=>{
    assert.equal(url,'https://api.resend.com/emails'); sent++;
    const payload=JSON.parse(options.body);
    assert.deepEqual(payload.to,['it@example.com']);
    assert.match(payload.html,/unsubscribe\?token=u/);
    assert.ok(options.headers['Idempotency-Key']);
    return new Response('{}');
  };
  try {
    await Promise.all([1,2].map(()=>call('/api/admin/newsletter/send',{campaign_id:draft.id,confirm:true,audience_fingerprint:preview.audienceFingerprint})));
    await call('/api/admin/newsletter/send',{campaign_id:draft.id,confirm:true});
    assert.equal(sent,1);
    assert.equal(sql.prepare('SELECT status FROM campaigns').get().status,'completed');
  } finally {globalThis.fetch=originalFetch;}
});

test('provider errors remain visible and are not automatically retried', async () => {
  const {sql,call} = setup(true);
  sql.exec("INSERT INTO subscribers(email,consent_at,confirmed_at,unsubscribe_token) VALUES('a@example.com',1,1,'x')");
  const draft=await (await call('/api/private/admin/campaigns',{subject:'Signals',html:'Hello'})).json();
  const preview=await (await call(`/api/private/admin/campaigns/preview?id=${draft.id}`)).json();
  const originalFetch=globalThis.fetch; let attempts=0;
  globalThis.fetch=async ()=>{attempts++;return new Response('{}',{status:429});};
  try {
    const result=await (await call('/api/admin/newsletter/send',{campaign_id:draft.id,confirm:true,audience_fingerprint:preview.audienceFingerprint})).json();
    assert.equal(result.failed,1); assert.equal(result.sent,0);
    await call('/api/admin/newsletter/send',{campaign_id:draft.id,confirm:true});
    assert.equal(attempts,1);
    assert.equal(sql.prepare('SELECT status FROM campaigns').get().status,'completed_with_errors');
  } finally {globalThis.fetch=originalFetch;}
});

test('missing mail configuration does not store subscription or confirmation tokens', async () => {
  const {env,sql}=setup(); const form=new FormData(); form.set('email','a@example.com');form.set('consent','on');
  const response=await worker.fetch(new Request('https://emperio-tiss.com/api/newsletter/subscribe',{method:'POST',headers:{origin:'https://emperio-tiss.com'},body:form}),env);
  assert.equal(response.status,503);
  assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM subscribers').get().n,0);
});

test('double opt-in confirms only with the mailed token and does not reset confirmed subscribers',async()=>{
  const {env,sql}=setup(true); let url;
  const originalFetch=globalThis.fetch;
  globalThis.fetch=async (_url,options)=>{url=JSON.parse(options.body).html.match(/href="([^"]+)"/)[1];return new Response('{}');};
  const subscribe=()=>{const form=new FormData();form.set('email','a@example.com');form.set('language','it');form.set('consent','on');return worker.fetch(new Request('https://emperio-tiss.com/api/newsletter/subscribe',{method:'POST',headers:{origin:'https://emperio-tiss.com'},body:form}),env);};
  try {
    assert.equal((await subscribe()).status,200);
    assert.equal(sql.prepare('SELECT confirmed_at FROM subscribers').get().confirmed_at,null);
    assert.equal((await worker.fetch(new Request(url),env)).status,200);
    assert.ok(sql.prepare('SELECT confirmed_at FROM subscribers').get().confirmed_at);
    assert.equal((await worker.fetch(new Request(url),env)).status,400);
    assert.equal((await subscribe()).status,200);
    assert.ok(sql.prepare('SELECT confirmed_at FROM subscribers').get().confirmed_at);
  } finally {globalThis.fetch=originalFetch;}
});

test('revoked client cannot reuse an existing private session',async()=>{
  const {env,sql}=setup(); const raw='session';
  const hash=Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw))).toString('hex');
  sql.exec("INSERT INTO clients(email,status,created_at) VALUES('a@example.com','pending',1)");
  sql.prepare('INSERT INTO private_sessions VALUES(?,?,?)').run(hash,'a@example.com',9999999999);
  const r=await worker.fetch(new Request('https://emperio-tiss.com/api/private/offers',{headers:{cookie:`et_private_session=${raw}`}}),env);
  assert.equal(r.status,401);
});

test('a changed audience requires renewed confirmation',async()=>{
  const {sql,call}=setup(true);
  sql.exec("INSERT INTO subscribers(email,consent_at,confirmed_at) VALUES('a@example.com',1,1)");
  const draft=await (await call('/api/private/admin/campaigns',{subject:'Signals',html:'Hello'})).json();
  const preview=await (await call(`/api/private/admin/campaigns/preview?id=${draft.id}`)).json();
  sql.exec("INSERT INTO subscribers(email,consent_at,confirmed_at) VALUES('b@example.com',1,1)");
  assert.equal((await call('/api/admin/newsletter/send',{campaign_id:draft.id,confirm:true,audience_fingerprint:preview.audienceFingerprint})).status,409);
  assert.equal(sql.prepare('SELECT status FROM campaigns').get().status,'draft');
});
test('started campaign preview uses saved recipients after audience changes',async()=>{
  const {sql,call}=setup(true);
  const draft=await (await call('/api/private/admin/campaigns',{subject:'Signals',html:'Hello'})).json();
  sql.prepare("UPDATE campaigns SET status='sending' WHERE id=?").run(draft.id);
  sql.prepare('INSERT INTO campaign_deliveries(campaign_id,email,updated_at) VALUES(?,?,1)').run(draft.id,'a@example.com');
  const preview=await (await call(`/api/private/admin/campaigns/preview?id=${draft.id}`)).json();
  assert.equal(preview.recipients,1);
  const result=await (await call('/api/admin/newsletter/send',{campaign_id:draft.id,confirm:true})).json();
  assert.equal(result.done,true); assert.equal(result.sent,0);
  assert.equal(sql.prepare('SELECT status FROM campaign_deliveries').get().status,'skipped');
});
