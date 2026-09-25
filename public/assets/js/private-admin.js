(() => {
  'use strict';
  const keyInput = document.querySelector('#adminKey'),
    unlock = document.querySelector('#unlockAdmin'),
    authStatus = document.querySelector('#adminAuthStatus'),
    panel = document.querySelector('#adminPanel');
  if (!keyInput || !unlock || !panel) return;
  let adminKey = '';
  let selectedCampaign = null, emailConfigured = false, sending = false, generation = 0;
  const byId = id => document.getElementById(id);
  const set = (el, msg, ok = false) => {
    if (!el) return;
    el.textContent = msg;
    el.dataset.state = ok ? 'success' : 'notice';
  };
  const call = async (url, body, method = 'POST') => {
    const options = {
      method,
      headers: {
        Authorization: `Bearer ${adminKey}`,
        Accept: 'application/json'
      }
    };
    if (body !== undefined) {
      options.headers['content-type'] = 'application/json';
      options.body = JSON.stringify(body)
    }
    options.cache = 'no-store';
    const r = await fetch(url, options);
    const type = r.headers.get('content-type') || '';
    const data = type.includes('application/json') ? await r.json() : {};
    if (!r.ok || !data.ok) throw new Error(data.error || `Request failed (${r.status})`);
    return data
  };
  const unlockAdmin = async () => {
    const candidate = keyInput.value.trim();
    if (!candidate) {
      set(authStatus, 'Enter your admin key.');
      return
    }
    adminKey = candidate;
    unlock.disabled = true;
    set(authStatus, 'Checking access…');
    try {
      const d = await call('/api/private/admin/status', undefined, 'GET');
      set(authStatus, d.message || 'Admin access verified.', true);
      panel.hidden = false;
      keyInput.value = '';
      keyInput.disabled = true
      await refresh();
    } catch (e) {
      adminKey = '';
      unlock.disabled = false;
      set(authStatus, e.message || 'Unauthorized')
    }
  };
  unlock.addEventListener('click', unlockAdmin);
  keyInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') unlockAdmin()
  });
  const row = (host, title, detail, action, handler) => {
    const item = document.createElement('div'); item.className = 'admin-record';
    const text = document.createElement('div'), strong = document.createElement('strong'), small = document.createElement('p');
    strong.textContent = title; small.textContent = detail; text.append(strong,small); item.append(text);
    if (action) { const button = document.createElement('button'); button.type='button'; button.textContent=action; button.addEventListener('click',handler); item.append(button); }
    host.append(item);
  };
  const date = value => new Date(value*1000).toLocaleString();
  async function refresh() {
    const current = generation;
    const d = await call('/api/private/admin/overview',undefined,'GET');
    if (current!==generation || !adminKey) return;
    emailConfigured=d.emailConfigured;
    set(byId('serviceStatus'), emailConfigured ? 'Database connected · email secret configured. Confirm the sender domain is verified in Resend before sending.' : 'Database connected · email sending disabled: RESEND_API_KEY is missing.',emailConfigured);
    for (const id of ['clientList','subscriberList','offerList','campaignList']) byId(id).replaceChildren();
    for (const c of d.clients) row(byId('clientList'),c.company || c.email,`${c.email} · ${c.language.toUpperCase()} · ${c.status}`,'Edit approval',()=>{
      const form=document.querySelector('[data-client-form]');
      for(const field of ['email','name','company','language']) form.elements[field].value=c[field]||'';
      form.elements.company.focus();
    });
    for(const s of d.subscribers) row(byId('subscriberList'),s.email,`${s.language.toUpperCase()} · ${s.unsubscribed_at ? 'Unsubscribed' : s.confirmed_at ? 'Confirmed' : 'Awaiting confirmation'}`);
    const select=byId('offerSelect'); select.replaceChildren(new Option('Choose an active offer',''));
    for(const o of d.offers) {
      const active=o.status==='published' && o.valid_until>Date.now()/1000;
      row(byId('offerList'),`#${o.id} — ${o.title}`,`${active?'Active':'Expired / inactive'} · until ${date(o.valid_until)}`);
      if(active) select.add(new Option(`#${o.id} — ${o.title}`,o.id));
    }
    for(const c of d.campaigns) row(byId('campaignList'),c.subject,`${c.kind} · ${c.language || 'all languages'} · ${c.status} · accepted: ${c.sent} · pending: ${c.pending} · failed / uncertain: ${c.failed}`,'Preview / details',()=>preview(c.id).catch(e=>set(byId('serviceStatus'),e.message)));
    for(const id of ['clientList','subscriberList','offerList','campaignList']) if(!byId(id).children.length) byId(id).textContent='No records yet.';
  }
  async function preview(id) {
    if(sending) return;
    const current=generation;
    const d=await call(`/api/private/admin/campaigns/preview?id=${encodeURIComponent(id)}`,undefined,'GET');
    if(current!==generation || !adminKey) return;
    selectedCampaign={...d.campaign,audienceFingerprint:d.audienceFingerprint}; emailConfigured=d.emailConfigured;
    byId('previewSubject').textContent=d.campaign.subject;
    byId('previewAudience').textContent=`${d.recipients} ${d.campaign.status==='draft'?'eligible':'saved'} recipient(s) · ${d.campaign.language || 'All languages'} · ${d.campaign.status}. Limit: 200 per campaign.`;
    byId('previewFrame').srcdoc=`<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src https: data:"><body>${d.campaign.html}</body>`;
    byId('confirmCampaign').checked=false;
    byId('confirmCampaign').disabled=!emailConfigured || !['draft','sending'].includes(d.campaign.status) || d.recipients===0 || d.recipients>200;
    byId('sendCampaign').disabled=true;
    byId('campaignPreview').hidden=false;
    set(byId('campaignStatus'),emailConfigured ? 'Review the draft above. Failed or uncertain deliveries are not retried automatically.' : 'Sending unavailable until RESEND_API_KEY is configured.');
  }
  byId('confirmCampaign').addEventListener('change',()=>{byId('sendCampaign').disabled=!byId('confirmCampaign').checked || sending;});
  byId('sendCampaign').addEventListener('click',async()=>{
    if(!selectedCampaign || !byId('confirmCampaign').checked || !emailConfigured || sending) return;
    sending=true; byId('sendCampaign').disabled=true; byId('confirmCampaign').disabled=true;
    const campaign=selectedCampaign, current=generation;
    try {
      let result;
      do {
        result=await call(campaign.kind==='offer'?'/api/private/admin/send-offer':'/api/admin/newsletter/send',{campaign_id:campaign.id,confirm:true,audience_fingerprint:campaign.audienceFingerprint});
        if(current!==generation) return;
        set(byId('campaignStatus'),`Accepted: ${result.sent} · failed: ${result.failed} · pending: ${result.pending} · in progress / uncertain: ${result.uncertain}`, !result.failed);
        if(!result.pending) break;
        await new Promise(resolve=>setTimeout(resolve,750));
      } while(adminKey && current===generation);
      await refresh();
    } catch(e) { if(current===generation) set(byId('campaignStatus'),`${e.message} Distribution stopped. Refresh history before resuming.`); }
    finally {sending=false;}
  });
  byId('refreshAdmin').addEventListener('click',()=>refresh().catch(e=>set(byId('serviceStatus'),e.message)));
  byId('lockAdmin').addEventListener('click',()=>{
    generation++; adminKey=''; selectedCampaign=null; panel.hidden=true;
    keyInput.disabled=false; unlock.disabled=false; byId('previewFrame').srcdoc=''; byId('campaignPreview').hidden=true;
    for(const id of ['clientList','subscriberList','offerList','campaignList']) byId(id).replaceChildren();
    document.querySelectorAll('#adminPanel form').forEach(form=>form.reset());
    set(authStatus,'Panel locked.'); keyInput.focus();
  });
  const bind = (selector, handler) => {
    const form = document.querySelector(selector);
    if (!form) return;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]'),
        status = form.querySelector('[data-status]');
      if (btn) {
        btn.disabled = true;
        btn.setAttribute('aria-busy', 'true')
      }
      set(status, '');
      try {
        const message = await handler(form);
        set(status, message || 'Done.', true);
        if (message !== false) form.reset()
        await refresh();
      } catch (err) {
        set(status, err?.message || 'Request failed.')
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.removeAttribute('aria-busy')
        }
      }
    })
  };
  bind('[data-client-form]', async form => {
    const fd = new FormData(form);
    await call('/api/private/admin/approve', {
      email: String(fd.get('email') || '').trim().toLowerCase(),
      name: String(fd.get('name') || '').trim(),
      company: String(fd.get('company') || '').trim(),
      language: String(fd.get('language') || 'en')
    });
    return 'Client approved.'
  });
  bind('[data-offer-form]', async form => {
    const fd = new FormData(form),
      dt = String(fd.get('valid_until') || ''),
      ts = dt ? Math.floor(new Date(dt).getTime() / 1000) : 0;
    if (!ts) throw new Error('Choose a valid expiry date.');
    const result = await call('/api/private/admin/offers', {
      title: String(fd.get('title') || '').trim(),
      category: String(fd.get('category') || '').trim(),
      origin: String(fd.get('origin') || '').trim(),
      destination: String(fd.get('destination') || '').trim(),
      availability: String(fd.get('availability') || '').trim(),
      valid_until: ts,
      description: String(fd.get('description') || '').trim()
    });
    return `Private offer #${result.id} published.`
  });
  bind('[data-send-offer-form]', async form => {
    const fd = new FormData(form);
    const id = Number(fd.get('offer_id'));
    if (!Number.isInteger(id) || id < 1) throw new Error('Enter a valid offer ID.');
    const d = await call('/api/private/admin/campaigns', {
      offer_id: id, kind:'offer', language:String(fd.get('language') || '')
    });
    await preview(d.id);
    return 'Offer distribution draft saved. Review before sending.'
  });
  bind('[data-newsletter-form]', async form => {
    const fd = new FormData(form);
    const d = await call('/api/private/admin/campaigns', {
      subject: String(fd.get('subject') || '').trim(),
      html: String(fd.get('html') || ''),
      language: String(fd.get('language') || '')
    });
    await preview(d.id);
    return 'Market Signals draft saved. Review before sending.'
  });
})();
