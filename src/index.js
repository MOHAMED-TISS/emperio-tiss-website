const ALLOWED_ORIGINS = new Set(['https://emperio-tiss.com', 'https://www.emperio-tiss.com']);
const RESEND = 'https://api.resend.com/emails';
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff'
  }
});
const clean = (v, n = 4000) => String(v ?? '').trim().slice(0, n);
const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const originOk = r => {
  const o = r.headers.get('origin');
  return o && ALLOWED_ORIGINS.has(o)
};
const dbOk = e => e && e.NEWS_DB;
const now = () => Math.floor(Date.now() / 1000);
const enc = new TextEncoder();
async function sha(v) {
  const b = await crypto.subtle.digest('SHA-256', enc.encode(v));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('')
}

function token() {
  return crypto.randomUUID().replaceAll('-', '') + crypto.randomUUID().replaceAll('-', '')
}
async function resend(env, to, subject, html, replyTo, idempotencyKey) {
  if (!env.RESEND_API_KEY) throw new Error('RESEND_API_KEY_MISSING');
  const r = await fetch(RESEND, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
      ...(idempotencyKey ? {'Idempotency-Key': idempotencyKey} : {})
    },
    body: JSON.stringify({
      from: 'EMPERIO TISS <no-reply@emperio-tiss.com>',
      to: [to],
      reply_to: replyTo,
      subject,
      html
    }),
    signal: AbortSignal.timeout(15000)
  });
  if (!r.ok) throw new Error(`RESEND_${r.status}`)
}
async function authAdmin(r, env) {
  if (!env.ADMIN_API_KEY) return false;
  const origin = r.headers.get('origin');
  if (origin && !ALLOWED_ORIGINS.has(origin)) return false;
  const actual = await sha(r.headers.get('authorization') || '');
  const expected = await sha(`Bearer ${env.ADMIN_API_KEY}`);
  let difference = 0;
  for (let i = 0; i < actual.length; i++) difference |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
  return difference === 0;
}
async function confirmNewsletter(request, env) {
  const raw = clean(new URL(request.url).searchParams.get('token'), 200),
    hash = await sha(raw);
  if (!dbOk(env) || !raw) return new Response('Invalid confirmation link.', {
    status: 400
  });
  const row = await env.NEWS_DB.prepare(
      "SELECT email FROM auth_tokens WHERE token_hash=? AND type='newsletter' AND expires_at>?")
    .bind(hash, now()).first();
  if (!row) return new Response('This confirmation link is invalid or expired.', {
    status: 400
  });
  await env.NEWS_DB.batch([env.NEWS_DB.prepare(
      "UPDATE subscribers SET confirmed_at=?,unsubscribed_at=NULL WHERE email=?").bind(now(), row.email), env
    .NEWS_DB.prepare("DELETE FROM auth_tokens WHERE token_hash=?").bind(hash)
  ]);
  return new Response(
    '<!doctype html><meta charset="utf-8"><title>EMPERIO TISS</title><body style="font-family:Arial;background:#f4efe5;padding:60px;color:#173028"><h1>You’re in.</h1><p>Your Market Signals subscription is confirmed.</p><p><a href="/news/">Back to News</a></p></body>'
    , {headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','referrer-policy':'no-referrer'}})
}
async function subscribe(request, env) {
  if (!originOk(request)) return json({
    ok: false,
    error: 'Origen no autorizado.'
  }, 403);
  if (!dbOk(env)) return json({
    ok: false,
    error: 'Newsletter service is being configured.'
  }, 503);
  if (!env.RESEND_API_KEY) return json({ok:false,error:'Email service is not configured.'},503);
  const f = await request.formData(),
    email = clean(f.get('email'), 254).toLowerCase(),
    language = ['es', 'en', 'fr', 'it', 'ar'].includes(clean(f.get('language'), 2)) ? clean(f.get(
      'language'), 2) : 'en';
  if (clean(f.get('_honey'), 200)) return json({
    ok: false,
    error: 'Solicitud rechazada.'
  }, 400);
  if (!emailOk(email) || !f.get('consent')) return json({
    ok: false,
    error: 'Introduce un email válido y acepta las comunicaciones.'
  }, 400);
  if (!(await allowRequest(request, env, email))) return json({ok:false,error:'Please wait before requesting another email.'},429);
  const existing = await env.NEWS_DB.prepare('SELECT confirmed_at,unsubscribed_at FROM subscribers WHERE email=?').bind(email).first();
  if (existing?.confirmed_at && !existing.unsubscribed_at) return json({ok:true,message:'Subscription request received.'});
  const raw = token(),
    hash = await sha(raw),
    exp = now() + 86400;
  await env.NEWS_DB.batch([
    env.NEWS_DB.prepare("INSERT INTO subscribers(email,language,consent_at,confirmed_at,unsubscribe_token) VALUES(?,?,?,NULL,?) ON CONFLICT(email) DO UPDATE SET language=excluded.language,consent_at=excluded.consent_at").bind(email,language,now(),token()),
    env.NEWS_DB.prepare("DELETE FROM auth_tokens WHERE email=? AND type='newsletter'").bind(email)
  ]);
  await env.NEWS_DB.prepare(
      "INSERT OR REPLACE INTO auth_tokens(token_hash,type,email,expires_at) VALUES(?,?,?,?)")
    .bind(hash, 'newsletter', email, exp).run();
  const link = `https://emperio-tiss.com/api/newsletter/confirm?token=${encodeURIComponent(raw)}`;
  try {
    await resend(env, email, 'Confirm your EMPERIO TISS Market Signals subscription',
      `<p>Thank you for subscribing to EMPERIO TISS Market Signals.</p><p><a href="${link}">Confirm subscription</a></p><p>This link expires in 24 hours.</p>`
      )
  } catch (e) {
    return json({
      ok: false,
      error: 'No se pudo enviar el email de confirmación.'
    }, 502)
  }
  return json({
    ok: true,
    message: 'Revisa tu email para confirmar la suscripción.'
  })
}
const PRIVATE_MESSAGES = {
  es:{invalidEmail:'Introduce un email válido.',validation:'Completa todos los datos de empresa obligatorios.',received:'Solicitud recibida. Nuestro equipo revisará tu acceso.',linkSent:'Te hemos enviado un enlace seguro de acceso privado.',mailMissing:'El servicio de email no está disponible.',linkFailed:'No se pudo enviar el enlace privado.'},
  en:{invalidEmail:'Enter a valid email address.',validation:'Complete all required company details.',received:'Request received. Our team will review your access.',linkSent:'We sent your secure private access link.',mailMissing:'The email service is unavailable.',linkFailed:'We could not send the private access link.'},
  fr:{invalidEmail:'Saisissez une adresse email valide.',validation:"Complétez toutes les informations obligatoires de l'entreprise.",received:"Demande reçue. Notre équipe examinera votre accès.",linkSent:"Nous avons envoyé votre lien sécurisé d'accès privé.",mailMissing:"Le service d'email est indisponible.",linkFailed:"Le lien d'accès privé n'a pas pu être envoyé."},
  it:{invalidEmail:'Inserisci un indirizzo email valido.',validation:"Completa tutti i dati aziendali obbligatori.",received:"Richiesta ricevuta. Il nostro team esaminerà il tuo accesso.",linkSent:"Abbiamo inviato il link sicuro per l'accesso privato.",mailMissing:"Il servizio email non è disponibile.",linkFailed:"Non è stato possibile inviare il link di accesso privato."},
  ar:{invalidEmail:'أدخل بريداً إلكترونياً صالحاً.',validation:'أكمل جميع بيانات الشركة المطلوبة.',received:'تم استلام الطلب. سيراجع فريقنا طلب الوصول.',linkSent:'أرسلنا رابط الوصول الخاص الآمن.',mailMissing:'خدمة البريد الإلكتروني غير متاحة.',linkFailed:'تعذر إرسال رابط الوصول الخاص.'}
};
async function sendPrivateAccessLink(env,email,language) {
  const copy=PRIVATE_MESSAGES[language] || PRIVATE_MESSAGES.en;
  if (!env.RESEND_API_KEY) return json({ok:false,error:copy.mailMissing,code:'EMAIL_UNAVAILABLE'},503);
  const raw = token(), hash = await sha(raw), exp = now() + 1800;
  await env.NEWS_DB.prepare(
      "INSERT OR REPLACE INTO auth_tokens(token_hash,type,email,expires_at) VALUES(?,?,?,?)")
    .bind(hash, 'private', email, exp).run();
  const link = `https://emperio-tiss.com/api/private/verify?token=${encodeURIComponent(raw)}`;
  try {
    await resend(env, email, 'Your EMPERIO PRIVATE access link',
      `<p>Your EMPERIO PRIVATE access is ready.</p><p><a href="${link}">Enter EMPERIO PRIVATE</a></p><p>This link expires in 30 minutes.</p>`)
  } catch (e) {
    return json({ok:false,error:copy.linkFailed,code:'ACCESS_EMAIL_FAILED'},502)
  }
  return json({ok:true,message:copy.linkSent,code:'ACCESS_LINK_SENT'})
}
async function requestAccess(request, env) {
  if (!originOk(request)) return json({
    ok: false,
    error: 'Origen no autorizado.'
  }, 403);
  if (!dbOk(env)) return json({
    ok: false,
    error: 'Private access is being configured.'
  }, 503);
  const f = await request.formData(),
    email = clean(f.get('email'), 254).toLowerCase(),
    language = ['es','en','fr','it','ar'].includes(clean(f.get('language'),2)) ? clean(f.get('language'),2) : 'en';
  const copy = PRIVATE_MESSAGES[language];
  if (clean(f.get('_honey'), 200)) return json({
    ok: false,
    error: 'Solicitud rechazada.'
  }, 400);
  if (!emailOk(email)) return json({
    ok: false,
    error: copy.invalidEmail,
    code: 'INVALID_EMAIL'
  }, 400);
  if (!(await allowRequest(request, env, email))) return json({ok:false,error:'Please wait before requesting access again.'},429);
  let client = await env.NEWS_DB.prepare("SELECT email,company,status FROM clients WHERE email=?")
    .bind(email).first();
  if (client?.status === 'approved') {
    return sendPrivateAccessLink(env,email,language)
  }
  const application = {
    taxId: clean(f.get('tax_id'),80),
    company: clean(f.get('company'),160),
    address: clean(f.get('address'),300),
    country: clean(f.get('country'),2).toUpperCase(),
    contactName: clean(f.get('contact_name'),160),
    mobile: clean(f.get('mobile'),40),
    whatsapp: clean(f.get('whatsapp'),40),
    productsInterest: clean(f.get('products_interest'),1000)
  };
  const categories = [...new Set(f.getAll('categories').map(v => clean(v,20)))].sort();
  const categorySet = new Set(['seafood','fruits','vegetables']);
  const required = [application.taxId,application.company,application.address,application.country,
    application.contactName,application.mobile,application.whatsapp];
  if (required.some(v => !v) || !f.get('privacy') || !/^[A-Z]{2}$/.test(application.country) ||
      application.mobile.replace(/\D/g,'').length < 7 || application.whatsapp.replace(/\D/g,'').length < 7 ||
      !categories.length || categories.some(category => !categorySet.has(category))) {
    return json({ok:false,error:copy.validation,code:'VALIDATION_FAILED'},400)
  }
  const requestedAt = now(), categoryList = categories.join(',');
  const writes = await env.NEWS_DB.batch([
    env.NEWS_DB.prepare(`INSERT INTO clients(email,name,company,language,status,created_at,updated_at,tax_id,address,country,contact_name,mobile,whatsapp,interest_categories,products_interest,privacy_accepted_at,notification_status,notification_error)
      VALUES(?,?,?,?,'pending',?,?,?,?,?,?,?,?,?,?,?,'pending',NULL)
      ON CONFLICT(email) DO UPDATE SET name=excluded.name,company=excluded.company,language=excluded.language,status='pending',updated_at=excluded.updated_at,tax_id=excluded.tax_id,address=excluded.address,country=excluded.country,contact_name=excluded.contact_name,mobile=excluded.mobile,whatsapp=excluded.whatsapp,interest_categories=excluded.interest_categories,products_interest=excluded.products_interest,privacy_accepted_at=excluded.privacy_accepted_at,notification_status='pending',notification_error=NULL WHERE clients.status<>'approved'`)
      .bind(email,application.contactName,application.company,language,requestedAt,requestedAt,application.taxId,application.address,
        application.country,application.contactName,application.mobile,application.whatsapp,categoryList,
        application.productsInterest,requestedAt),
    env.NEWS_DB.prepare("DELETE FROM client_interests WHERE email=? AND EXISTS(SELECT 1 FROM clients WHERE email=? AND status<>'approved')").bind(email,email),
    ...categories.map(category => env.NEWS_DB.prepare("INSERT INTO client_interests(email,category) SELECT ?,? WHERE EXISTS(SELECT 1 FROM clients WHERE email=? AND status<>'approved') ON CONFLICT(email,category) DO NOTHING").bind(email,category,email))
  ]);
  if (!Number(writes[0]?.meta?.changes)) {
    const current = await env.NEWS_DB.prepare('SELECT status FROM clients WHERE email=?').bind(email).first();
    if (current?.status==='approved') return sendPrivateAccessLink(env,email,language)
  }
  const labels = {seafood:'Productos del mar',fruits:'Frutas',vegetables:'Hortalizas'};
  const notification = `<h2>Nueva solicitud — EMPERIO PRIVATE</h2>
    <p><strong>Empresa:</strong> ${escapeHtml(application.company)}</p>
    <p><strong>CIF / Tax ID:</strong> ${escapeHtml(application.taxId)}</p>
    <p><strong>Dirección:</strong> ${escapeHtml(application.address)}</p>
    <p><strong>País:</strong> ${escapeHtml(application.country)}</p>
    <p><strong>Persona de contacto:</strong> ${escapeHtml(application.contactName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Móvil:</strong> ${escapeHtml(application.mobile)}</p>
    <p><strong>WhatsApp:</strong> ${escapeHtml(application.whatsapp)}</p>
    <p><strong>Categorías:</strong> ${categories.map(category => labels[category]).join(', ')}</p>
    <p><strong>Productos concretos:</strong> ${escapeHtml(application.productsInterest || 'No indicado')}</p>
    <p><a href="https://emperio-tiss.com/private/admin/">Revisar en Operations Desk</a></p>`;
  try {
    await resend(env,'info@emperio-tiss.com',`Nueva solicitud privada — ${application.company}`,notification,email,`private-request-${await sha(`${email}:${requestedAt}`)}`);
    await env.NEWS_DB.prepare("UPDATE clients SET notification_status='sent',notification_error=NULL WHERE email=?").bind(email).run()
  } catch (error) {
    await env.NEWS_DB.prepare("UPDATE clients SET notification_status='failed',notification_error=? WHERE email=?")
      .bind(clean(error?.message || 'EMAIL_FAILED',120),email).run()
  }
  return json({ok:true,message:copy.received,code:'APPLICATION_RECEIVED'})
}
async function privateVerify(request, env) {
  if (!dbOk(env)) return new Response('Private access is not configured.', {
    status: 503
  });
  const raw = clean(new URL(request.url).searchParams.get('token'), 200),
    hash = await sha(raw),
    row = await env.NEWS_DB.prepare(
      "SELECT t.email FROM auth_tokens t JOIN clients c ON c.email=t.email WHERE t.token_hash=? AND t.type='private' AND t.expires_at>? AND c.status='approved'")
    .bind(hash, now()).first();
  if (!row) return new Response('Invalid or expired access link.', {
    status: 400
  });
  const sessionRaw = token(),
    sessionHash = await sha(sessionRaw),
    exp = now() + 604800;
  await env.NEWS_DB.batch([env.NEWS_DB.prepare(
    "INSERT INTO private_sessions(token_hash,email,expires_at) VALUES(?,?,?)").bind(
    sessionHash, row.email, exp), env.NEWS_DB.prepare(
    "DELETE FROM auth_tokens WHERE token_hash=?").bind(hash)]);
  return new Response(null, {
    status: 302,
    headers: {
      location: '/private/',
      'set-cookie': `et_private_session=${sessionRaw}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`
    }
  })
}
async function privateOffers(request, env) {
  const cookie = request.headers.get('cookie') || '',
    m = cookie.match(/(?:^|;\s*)et_private_session=([^;]+)/);
  if (!m || !dbOk(env)) return json({
    ok: false,
    error: 'Unauthorized'
  }, 401);
  const hash = await sha(m[1]),
    s = await env.NEWS_DB.prepare(
      "SELECT s.email FROM private_sessions s JOIN clients c ON c.email=s.email WHERE s.token_hash=? AND s.expires_at>? AND c.status='approved'").bind(hash, now())
    .first();
  if (!s) return json({
    ok: false,
    error: 'Unauthorized'
  }, 401);
  const rows = await env.NEWS_DB.prepare(
    "SELECT id,title,category,origin,destination,availability,valid_until,description,created_at FROM private_offers WHERE status='published' AND valid_until>? ORDER BY created_at DESC"
    ).bind(now()).all();
  return json({
    ok: true,
    client: s.email,
    offers: rows.results || []
  })
}
async function adminStatus(request, env) {
  if (!(await authAdmin(request, env))) return json({
    ok: false,
    error: 'Unauthorized'
  }, 401);
  return json({
    ok: true,
    message: 'Admin access verified.'
  })
}
async function adminApprove(request, env) {
  if (!(await authAdmin(request, env))) return json({
    ok: false,
    error: 'Unauthorized'
  }, 401);
  if (!dbOk(env)) return json({
    ok: false,
    error: 'NEWS_DB missing'
  }, 503);
  const b = await request.json(),
    email = clean(b.email, 254).toLowerCase(),
    company = clean(b.company, 160),
    name = clean(b.name, 160),
    language = clean(b.language, 2) || 'en';
  if (!['es','en','fr','it','ar'].includes(language)) return json({ok:false,error:'Invalid language.'},400);
  if (!emailOk(email) || !company) return json({
    ok: false,
    error: 'email and company required'
  }, 400);
  await env.NEWS_DB.prepare(
    "INSERT INTO clients(email,name,company,language,status,created_at,approved_at) VALUES(?,?,?,?, 'approved',?,?) ON CONFLICT(email) DO UPDATE SET name=excluded.name,company=excluded.company,language=excluded.language,status='approved',approved_at=excluded.approved_at"
    ).bind(email, name, company, language, now(), now()).run();
  return json({
    ok: true
  })
}
async function adminOffer(request, env) {
  if (!(await authAdmin(request, env))) return json({
    ok: false,
    error: 'Unauthorized'
  }, 401);
  if (!dbOk(env)) return json({
    ok: false,
    error: 'NEWS_DB missing'
  }, 503);
  const b = await request.json();
  if (!clean(b.title,200) || !Number.isInteger(Number(b.valid_until)) || Number(b.valid_until)<=now()) return json({ok:false,error:'Title and future expiry date are required.'},400);
  const result = await env.NEWS_DB.prepare(
    "INSERT INTO private_offers(title,category,origin,destination,availability,valid_until,description,status,created_at) VALUES(?,?,?,?,?,?,?,'published',?)"
    ).bind(clean(b.title, 200), clean(b.category, 80), clean(b.origin, 120), clean(b
    .destination, 120), clean(b.availability, 120), Number(b.valid_until), clean(b
    .description, 2000), now()).run();
  return json({
    ok: true,
    id: result.meta.last_row_id
  })
}
async function adminSendOffer(request, env) {
  return sendCampaign(request, env, 'offer');
}
async function adminNewsletter(request, env) {
  return sendCampaign(request, env, 'newsletter');
}
async function allowRequest(request, env, email) {
  const period = Math.floor(now()/600);
  const address = request.headers.get('cf-connecting-ip') || 'local';
  const buckets = [[`email:${await sha(email)}:${period}`,3],[`ip:${await sha(address)}:${period}`,20]];
  await env.NEWS_DB.prepare('DELETE FROM request_limits WHERE expires_at<?').bind(now()).run();
  for (const [bucket,limit] of buckets) {
    const r = await env.NEWS_DB.prepare('INSERT INTO request_limits(bucket,count,expires_at) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1 RETURNING count').bind(bucket,now()+600).first();
    if (r.count>limit) return false;
  }
  return true;
}
async function adminGuard(request,env) {
  if (!(await authAdmin(request,env))) return json({ok:false,error:'Unauthorized'},401);
  if (!dbOk(env)) return json({ok:false,error:'Database is not configured.'},503);
}
async function adminOverview(request,env) {
  const denied = await adminGuard(request,env); if (denied) return denied;
  const [clients,offers,subscribers,campaigns,summary,dailyRows,countries,categories,languages] = await Promise.all([
    env.NEWS_DB.prepare('SELECT email,name,company,language,status,created_at,updated_at,tax_id,address,country,contact_name,mobile,whatsapp,interest_categories,products_interest,notification_status FROM clients ORDER BY created_at DESC LIMIT 200').all(),
    env.NEWS_DB.prepare('SELECT * FROM private_offers ORDER BY created_at DESC LIMIT 200').all(),
    env.NEWS_DB.prepare('SELECT email,language,consent_at,confirmed_at,unsubscribed_at FROM subscribers ORDER BY consent_at DESC LIMIT 200').all(),
    env.NEWS_DB.prepare(`SELECT c.*, (SELECT COUNT(*) FROM campaign_deliveries d WHERE d.campaign_id=c.id AND d.status='sent') AS sent,
      (SELECT COUNT(*) FROM campaign_deliveries d WHERE d.campaign_id=c.id AND d.status IN ('failed','sending')) AS failed,
      (SELECT COUNT(*) FROM campaign_deliveries d WHERE d.campaign_id=c.id AND d.status='pending') AS pending
      FROM campaigns c ORDER BY created_at DESC LIMIT 50`).all(),
    env.NEWS_DB.prepare(`SELECT COUNT(*) AS total,
      COALESCE(SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END),0) AS pending,
      COALESCE(SUM(CASE WHEN status='approved' THEN 1 ELSE 0 END),0) AS approved,
      COALESCE(SUM(CASE WHEN status='rejected' THEN 1 ELSE 0 END),0) AS rejected FROM clients`).first(),
    env.NEWS_DB.prepare("SELECT strftime('%Y-%m-%d',created_at,'unixepoch') AS day,COUNT(*) AS count FROM clients WHERE created_at>=unixepoch('now','-29 days','start of day') GROUP BY day ORDER BY day").all(),
    env.NEWS_DB.prepare("SELECT country AS label,COUNT(*) AS count FROM clients WHERE country IS NOT NULL AND country<>'' GROUP BY country ORDER BY count DESC,label LIMIT 12").all(),
    env.NEWS_DB.prepare("SELECT category AS label,COUNT(*) AS count FROM client_interests GROUP BY category ORDER BY count DESC,label").all(),
    env.NEWS_DB.prepare("SELECT language AS label,COUNT(*) AS count FROM clients GROUP BY language ORDER BY count DESC,label").all()
  ]);
  const dailyMap = new Map(dailyRows.results.map(row => [row.day,Number(row.count)]));
  const daily = [];
  const today = new Date();
  today.setUTCHours(0,0,0,0);
  for (let offset=29; offset>=0; offset--) {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate()-offset);
    const day = date.toISOString().slice(0,10);
    daily.push({day,count:dailyMap.get(day) || 0})
  }
  const countRows = result => result.results.map(row => ({label:row.label,count:Number(row.count)}));
  return json({
    ok:true,emailConfigured:Boolean(env.RESEND_API_KEY),clients:clients.results,offers:offers.results,
    subscribers:subscribers.results,campaigns:campaigns.results,
    analytics:{
      summary:{total:Number(summary.total),pending:Number(summary.pending),approved:Number(summary.approved),rejected:Number(summary.rejected)},
      daily,countries:countRows(countries),categories:countRows(categories),languages:countRows(languages)
    }
  });
}
async function saveCampaign(request,env) {
  const denied = await adminGuard(request,env); if (denied) return denied;
  const b = await request.json(), kind = b.kind || 'newsletter', language = b.language || '';
  if (!['newsletter','offer'].includes(kind) || !['','es','en','fr','it','ar'].includes(language)) return json({ok:false,error:'Invalid campaign audience.'},400);
  let subject = clean(b.subject,200), html = clean(b.html,20000), offerId = null;
  if (kind==='offer') {
    offerId = Number(b.offer_id);
    if (!Number.isInteger(offerId) || offerId<1) return json({ok:false,error:'Choose a valid offer.'},400);
    const o = await env.NEWS_DB.prepare("SELECT * FROM private_offers WHERE id=? AND status='published' AND valid_until>?").bind(offerId,now()).first();
    if (!o) return json({ok:false,error:'Offer is unavailable or expired.'},400);
    subject = `EMPERIO PRIVATE — ${o.title}`;
    html = `<h2>${escapeHtml(o.title)}</h2><p>${escapeHtml(o.category)}</p><p>Origin: ${escapeHtml(o.origin)}<br>Destination: ${escapeHtml(o.destination)}<br>Availability: ${escapeHtml(o.availability)}</p><p>${escapeHtml(o.description)}</p><p><a href="https://emperio-tiss.com/private/">View EMPERIO PRIVATE</a></p>`;
  }
  if (!subject || !html) return json({ok:false,error:'Subject and content are required.'},400);
  const id = crypto.randomUUID();
  await env.NEWS_DB.prepare('INSERT INTO campaigns(id,kind,offer_id,subject,html,language,created_at) VALUES(?,?,?,?,?,?,?)').bind(id,kind,offerId,subject,html,language,now()).run();
  return json({ok:true,id});
}
async function campaignAudience(env,campaign) {
  const base = campaign.kind==='offer' ? "SELECT email FROM clients WHERE status='approved'" : 'SELECT email FROM subscribers WHERE confirmed_at IS NOT NULL AND unsubscribed_at IS NULL';
  const query = base + (campaign.language ? ' AND language=?' : '') + ' ORDER BY email LIMIT 201';
  return (await (campaign.language ? env.NEWS_DB.prepare(query).bind(campaign.language) : env.NEWS_DB.prepare(query)).all()).results;
}
async function campaignPreview(request,env) {
  const denied = await adminGuard(request,env); if (denied) return denied;
  const id = new URL(request.url).searchParams.get('id');
  const campaign = await env.NEWS_DB.prepare('SELECT * FROM campaigns WHERE id=?').bind(id).first();
  if (!campaign) return json({ok:false,error:'Campaign not found.'},404);
  const audience = campaign.status==='draft' ? await campaignAudience(env,campaign) : (await env.NEWS_DB.prepare('SELECT email FROM campaign_deliveries WHERE campaign_id=? ORDER BY email').bind(campaign.id).all()).results;
  return json({ok:true,campaign,recipients:audience.length,audienceFingerprint:await sha(JSON.stringify(audience.map(r=>r.email))),emailConfigured:Boolean(env.RESEND_API_KEY)});
}
async function sendCampaign(request,env,kind) {
  const denied = await adminGuard(request,env); if (denied) return denied;
  if (!env.RESEND_API_KEY) return json({ok:false,error:'Configure RESEND_API_KEY before sending.'},503);
  const b = await request.json();
  if (b.confirm!==true || !b.campaign_id) return json({ok:false,error:'Preview and confirm a saved campaign first.'},400);
  const campaign = await env.NEWS_DB.prepare('SELECT * FROM campaigns WHERE id=? AND kind=?').bind(b.campaign_id,kind).first();
  if (!campaign) return json({ok:false,error:'Campaign not found.'},404);
  if (kind==='offer') {
    const offer = await env.NEWS_DB.prepare("SELECT id FROM private_offers WHERE id=? AND status='published' AND valid_until>?").bind(campaign.offer_id,now()).first();
    if (!offer) return json({ok:false,error:'Offer is unavailable or expired.'},409);
  }
  if (campaign.status==='draft') {
    const audience = await campaignAudience(env,campaign);
    if (b.audience_fingerprint!==await sha(JSON.stringify(audience.map(r=>r.email)))) return json({ok:false,error:'Audience changed. Preview the campaign again before sending.'},409);
    if (!audience.length || audience.length>200) return json({ok:false,error:'Audience must contain 1–200 eligible recipients. Segment by language.'},400);
    // D1 batch is transactional. The conditional insert freezes the audience only once.
    await env.NEWS_DB.batch([
      ...audience.map(({email})=>env.NEWS_DB.prepare("INSERT OR IGNORE INTO campaign_deliveries(campaign_id,email,updated_at) SELECT ?,?,? WHERE EXISTS(SELECT 1 FROM campaigns WHERE id=? AND status='draft')").bind(campaign.id,email,now(),campaign.id)),
      env.NEWS_DB.prepare("UPDATE campaigns SET status='sending',started_at=? WHERE id=? AND status='draft'").bind(now(),campaign.id)
    ]);
  }
  // One recipient per request keeps work bounded. A claim is never resent automatically.
  const delivery = await env.NEWS_DB.prepare("UPDATE campaign_deliveries SET status='sending',updated_at=? WHERE campaign_id=? AND email=(SELECT email FROM campaign_deliveries WHERE campaign_id=? AND status='pending' ORDER BY email LIMIT 1) AND status='pending' RETURNING email").bind(now(),campaign.id,campaign.id).first();
  if (delivery) {
    const eligible = kind==='offer'
      ? await env.NEWS_DB.prepare("SELECT email FROM clients WHERE email=? AND status='approved'").bind(delivery.email).first()
      : await env.NEWS_DB.prepare('SELECT email,unsubscribe_token FROM subscribers WHERE email=? AND confirmed_at IS NOT NULL AND unsubscribed_at IS NULL').bind(delivery.email).first();
    let state = 'skipped';
    if (eligible) {
      let html = campaign.html;
      if (kind==='newsletter') {
        if (!eligible.unsubscribe_token) {
          await env.NEWS_DB.prepare('UPDATE subscribers SET unsubscribe_token=? WHERE email=? AND unsubscribe_token IS NULL').bind(token(),delivery.email).run();
          eligible.unsubscribe_token = (await env.NEWS_DB.prepare('SELECT unsubscribe_token FROM subscribers WHERE email=?').bind(delivery.email).first()).unsubscribe_token;
        }
        const label = {es:'Darse de baja',en:'Unsubscribe',fr:'Se désinscrire',it:'Annulla iscrizione',ar:'إلغاء الاشتراك'}[campaign.language] || 'Unsubscribe';
        html += `<hr><p>EMPERIO TISS S.L. · <a href="https://emperio-tiss.com/api/newsletter/unsubscribe?token=${encodeURIComponent(eligible.unsubscribe_token)}">${label}</a></p>`;
      }
      try { await resend(env,delivery.email,campaign.subject,html,undefined,`campaign-${campaign.id}-${await sha(delivery.email)}`); state='sent'; }
      catch { state='failed'; }
    }
    await env.NEWS_DB.prepare('UPDATE campaign_deliveries SET status=?,updated_at=? WHERE campaign_id=? AND email=?').bind(state,now(),campaign.id,delivery.email).run();
  }
  const rows = (await env.NEWS_DB.prepare('SELECT status,COUNT(*) AS total FROM campaign_deliveries WHERE campaign_id=? GROUP BY status').bind(campaign.id).all()).results;
  const counts = Object.fromEntries(rows.map(r=>[r.status,r.total]));
  const done = !counts.pending && !counts.sending;
  if (done) await env.NEWS_DB.prepare('UPDATE campaigns SET status=? WHERE id=?').bind(counts.failed ? 'completed_with_errors' : 'completed',campaign.id).run();
  return json({ok:true,done,sent:counts.sent||0,failed:counts.failed||0,pending:counts.pending||0,uncertain:counts.sending||0});
}
async function unsubscribe(request,env) {
  if (!dbOk(env)) return json({ok:false,error:'Service unavailable.'},503);
  const raw = clean(new URL(request.url).searchParams.get('token'),200);
  const row = raw ? await env.NEWS_DB.prepare('SELECT email FROM subscribers WHERE unsubscribe_token=?').bind(raw).first() : null;
  if (!row) return new Response('Invalid unsubscribe link.',{status:400});
  const headers = {'content-type':'text/html; charset=utf-8','cache-control':'no-store','referrer-policy':'no-referrer','content-security-policy':"default-src 'none'; form-action 'self'; frame-ancestors 'none'"};
  if (request.method==='GET') return new Response('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Market Signals</title><h1>Unsubscribe from Market Signals</h1><form method="post"><button>Confirm unsubscribe / Confirmar baja</button></form></html>',{headers});
  await env.NEWS_DB.batch([
    env.NEWS_DB.prepare('UPDATE subscribers SET confirmed_at=NULL,unsubscribed_at=? WHERE email=?').bind(now(),row.email),
    env.NEWS_DB.prepare("DELETE FROM auth_tokens WHERE email=? AND type='newsletter'").bind(row.email)
  ]);
  return new Response('<!doctype html><html lang="en"><meta charset="utf-8"><title>Unsubscribed</title><h1>You are unsubscribed. Baja confirmada.</h1></html>',{headers});
}
const escapeHtml = value => clean(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
async function handleContact(request, env) {
  if (!originOk(request)) return json({
    ok: false,
    error: 'Origen no autorizado.'
  }, 403);
  const form = await request.formData();
  if (clean(form.get('_honey'), 200)) return json({
    ok: false,
    error: 'Solicitud rechazada.'
  }, 400);
  const nombre = clean(form.get('nombre'), 120),
    empresa = clean(form.get('empresa'), 160),
    email = clean(form.get('email'), 254),
    telefono = clean(form.get('telefono'), 80),
    producto = clean(form.get('producto'), 120),
    destino = clean(form.get('destino'), 160),
    mensaje = clean(form.get('mensaje'), 4000);
  if (!nombre || !empresa || !email || !telefono || !producto || !destino || !mensaje)
  return json({
      ok: false,
      error: 'Completa todos los campos obligatorios.',
      code: 'VALIDATION_FAILED'
    }, 400);
  if (!emailOk(email)) return json({
    ok: false,
    error: 'Introduce un email válido.',
    code: 'INVALID_EMAIL'
  }, 400);
  const html =
    `<h2>Nueva consulta B2B — EMPERIO TISS</h2><p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p><p><strong>Empresa:</strong> ${escapeHtml(empresa)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Teléfono:</strong> ${escapeHtml(telefono)}</p><p><strong>Producto:</strong> ${escapeHtml(producto)}</p><p><strong>Destino:</strong> ${escapeHtml(destino)}</p><p><strong>Necesidad:</strong></p><p>${escapeHtml(mensaje).replaceAll('\n','<br>')}</p>`;
  try {
    await resend(env, 'info@emperio-tiss.com', `Nueva consulta B2B — ${empresa} — ${producto}`,
      html, email)
  } catch (e) {
    return json({
      ok: false,
      error: 'No se pudo enviar la consulta. Inténtalo de nuevo.'
    }, 502)
  }
  return json({
    ok: true
  })
}
async function fetchHandler(request, env) {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/') && request.method==='POST' && Number(request.headers.get('content-length'))>32768) return json({ok:false,error:'Request too large.'},413);
  if (url.pathname==='/api/private/admin/overview' && request.method==='GET') return adminOverview(request,env);
  if (url.pathname==='/api/private/admin/campaigns' && request.method==='POST') return saveCampaign(request,env);
  if (url.pathname==='/api/private/admin/campaigns/preview' && request.method==='GET') return campaignPreview(request,env);
  if (url.pathname==='/api/newsletter/unsubscribe' && ['GET','POST'].includes(request.method)) return unsubscribe(request,env);
  if (url.pathname === '/api/newsletter/subscribe' && request.method === 'POST') return subscribe(
    request, env);
  if (url.pathname === '/api/newsletter/confirm' && request.method === 'GET')
  return confirmNewsletter(request, env);
  if (url.pathname === '/api/private/request-access' && request.method === 'POST')
  return requestAccess(request, env);
  if (url.pathname === '/api/private/verify' && request.method === 'GET') return privateVerify(
    request, env);
  if (url.pathname === '/api/private/offers' && request.method === 'GET') return privateOffers(
    request, env);
  if (url.pathname === '/api/private/admin/status' && request.method === 'GET')
  return adminStatus(request, env);
  if (url.pathname === '/api/private/admin/approve' && request.method === 'POST')
  return adminApprove(request, env);
  if (url.pathname === '/api/private/admin/offers' && request.method === 'POST')
  return adminOffer(request, env);
  if (url.pathname === '/api/private/admin/send-offer' && request.method === 'POST')
  return adminSendOffer(request, env);
  if (url.pathname === '/api/admin/newsletter/send' && request.method === 'POST')
  return adminNewsletter(request, env);
  if (url.pathname === '/api/contact' && request.method === 'POST') return handleContact(request,
    env);
  return env.ASSETS.fetch(request)
}
export default {
  async fetch(request, env) {
    try {
      return await fetchHandler(request, env)
    } catch (e) {
      return json({
        ok: false,
        error: e instanceof SyntaxError ? 'Invalid request body.' : 'Request could not be completed.'
      }, e instanceof SyntaxError ? 400 : 500)
    }
  }
};
