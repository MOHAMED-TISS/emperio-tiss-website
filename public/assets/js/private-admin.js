(() => {
  'use strict';

  const keyInput=document.querySelector('#adminKey'),
    unlock=document.querySelector('#unlockAdmin'),
    authStatus=document.querySelector('#adminAuthStatus'),
    panel=document.querySelector('#adminPanel');
  if(!keyInput || !unlock || !panel) return;

  let adminKey='',selectedCampaign=null,emailConfigured=false,sending=false,generation=0;
  let dashboard={clients:[],offers:[],subscribers:[],campaigns:[],inquiries:[]};
  let editingOfferId=null;

  const byId=id=>document.getElementById(id);
  const number=value=>Number.isFinite(Number(value)) ? Number(value) : 0;
  const date=value=>value ? new Date(Number(value)*1000).toLocaleString() : 'Never';
  const localDateTime=value=>{
    if(!value) return '';
    const d=new Date(Number(value)*1000);
    return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16);
  };
  const categoryName=value=>({seafood:'Seafood',fruits:'Fruits',vegetables:'Vegetables'}[value] || value || '—');
  const set=(el,msg,ok=false)=>{
    if(!el) return;
    el.textContent=msg;
    el.dataset.state=ok?'success':'notice';
  };
  const call=async(url,body,method='POST')=>{
    const options={method,headers:{Authorization:`Bearer ${adminKey}`,Accept:'application/json'},cache:'no-store'};
    if(body!==undefined){
      options.headers['content-type']='application/json';
      options.body=JSON.stringify(body);
    }
    const response=await fetch(url,options);
    const type=response.headers.get('content-type') || '';
    const data=type.includes('application/json') ? await response.json() : {};
    if(!response.ok || !data.ok) throw new Error(data.error || `Request failed (${response.status})`);
    return data;
  };

  const unlockAdmin=async()=>{
    const candidate=keyInput.value.trim();
    if(!candidate){set(authStatus,'Enter your admin key.');return;}
    adminKey=candidate; unlock.disabled=true; set(authStatus,'Checking access…');
    try{
      const data=await call('/api/private/admin/status',undefined,'GET');
      set(authStatus,data.message || 'Admin access verified.',true);
      panel.hidden=false; keyInput.value=''; keyInput.disabled=true;
      await refresh();
    }catch(error){
      adminKey=''; unlock.disabled=false; set(authStatus,error.message || 'Unauthorized');
    }
  };
  unlock.addEventListener('click',unlockAdmin);
  keyInput.addEventListener('keydown',event=>{if(event.key==='Enter') unlockAdmin();});

  const row=(host,title,detail,action,handler)=>{
    const item=document.createElement('div'); item.className='admin-record';
    const text=document.createElement('div'),strong=document.createElement('strong'),small=document.createElement('p');
    strong.textContent=title; small.textContent=detail; text.append(strong,small); item.append(text);
    if(action){
      const button=document.createElement('button'); button.type='button'; button.textContent=action;
      button.addEventListener('click',handler); item.append(button);
    }
    host.append(item);
  };

  const inquiryStatuses=['new','qualified','studying','offered','won','lost'];
  const renderInquiryPipeline=pipeline=>{
    for(const status of inquiryStatuses){
      const id='inquiry'+status.charAt(0).toUpperCase()+status.slice(1);
      const el=byId(id); if(el) el.textContent=String(number(pipeline?.[status]));
    }
  };
  const renderInquiry=inquiry=>{
    const host=byId('inquiryList'); if(!host) return;
    const item=document.createElement('div'); item.className='admin-record admin-inquiry-record';
    const text=document.createElement('div'),strong=document.createElement('strong'),detail=document.createElement('p');
    strong.textContent=`${inquiry.id} — ${inquiry.company || inquiry.email}`;
    detail.textContent=[
      `${String(inquiry.status || 'new').toUpperCase()} · ${inquiry.product_reference ? `REF. ${inquiry.product_reference} · ` : ''}${inquiry.product_name || inquiry.product_category || 'General enquiry'} · ${inquiry.destination || 'No destination'}`,
      `${inquiry.email} · ${inquiry.phone || 'No phone'} · ${String(inquiry.language || 'en').toUpperCase()} · ${inquiry.source || 'contact'}`,
      inquiry.origin ? `Origin: ${inquiry.origin}` : '',
      inquiry.specification ? `Specification: ${inquiry.specification}` : '',
      inquiry.message ? `Requirement: ${inquiry.message}` : '',
      `Created: ${date(inquiry.created_at)} · email: ${inquiry.notification_status || 'unknown'}`
    ].filter(Boolean).join('\n');
    text.append(strong,detail);
    const select=document.createElement('select'); select.className='admin-inquiry-status';
    select.setAttribute('aria-label',`Pipeline status for ${inquiry.id}`);
    for(const status of inquiryStatuses) select.add(new Option(status.toUpperCase(),status,false,status===inquiry.status));
    select.addEventListener('change',async()=>{
      select.disabled=true;
      try{await call('/api/private/admin/inquiries/status',{id:inquiry.id,status:select.value});await refresh();}
      catch(error){set(byId('serviceStatus'),error.message);select.value=inquiry.status;}
      finally{select.disabled=false;}
    });
    item.append(text,select); host.append(item);
  };

  const renderBars=(host,rows,label)=>{
    if(!host) return;
    host.replaceChildren();
    if(!rows.length){const empty=document.createElement('p');empty.className='admin-empty';empty.textContent=`No ${label} data yet.`;host.append(empty);return;}
    const max=Math.max(...rows.map(row=>number(row.count)),1);
    for(const rowData of rows){
      const item=document.createElement('div'),head=document.createElement('div'),name=document.createElement('span'),
        value=document.createElement('strong'),progress=document.createElement('progress');
      name.textContent=label==='category'?categoryName(rowData.label):rowData.label;
      value.textContent=String(number(rowData.count)); head.append(name,value);
      progress.max=max; progress.value=number(rowData.count);
      progress.setAttribute('aria-label',`${name.textContent}: ${value.textContent} requests`);
      item.append(head,progress);host.append(item);
    }
  };
  const renderTrend=rows=>{
    const host=byId('requestTrend'),table=byId('requestTrendTable');
    if(!host || !table) return;
    const body=table.tBodies[0];host.replaceChildren();body.replaceChildren();
    const values=rows.map(row=>number(row.count)),max=Math.max(...values,1),width=600,height=180,pad=18;
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
    svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.setAttribute('aria-hidden','true');
    const points=rows.map((rowData,index)=>{
      const x=pad+(index/Math.max(rows.length-1,1))*(width-pad*2);
      const y=height-pad-(number(rowData.count)/max)*(height-pad*2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    const line=document.createElementNS(ns,'polyline');line.setAttribute('points',points);line.setAttribute('class','admin-trend-line');
    svg.append(line);host.append(svg);
    const total=values.reduce((sum,value)=>sum+value,0);
    host.setAttribute('aria-label',`${total} SIGNATURE access requests during the last 30 days; peak ${Math.max(...values,0)} in one day.`);
    for(const rowData of rows){
      const tr=document.createElement('tr'),day=document.createElement('th'),count=document.createElement('td');
      day.scope='row';day.textContent=rowData.day;count.textContent=String(number(rowData.count));tr.append(day,count);body.append(tr);
    }
  };
  const renderAnalytics=data=>{
    const summary=data?.analytics?.summary || {},signature=data?.signature || {};
    byId('metricTotal').textContent=String(number(summary.total));
    byId('metricPending').textContent=String(number(summary.pending));
    byId('metricApproved').textContent=String(number(summary.approved));
    byId('metricRejected').textContent=String(number(summary.rejected));
    byId('metricActiveOffers').textContent=String(number(signature.offers?.active));
    byId('metricOfferViews').textContent=String(number(signature.engagement?.views));
    byId('metricConnected').textContent=String(number(signature.clients?.connected));
    byId('metricNeverConnected').textContent=String(number(signature.clients?.neverConnected));
    byId('metricActiveSessions').textContent=String(number(signature.clients?.activeSessions));
    renderTrend(Array.isArray(data?.analytics?.daily)?data.analytics.daily:[]);
    renderBars(byId('countryChart'),Array.isArray(data?.analytics?.countries)?data.analytics.countries:[],'country');
    renderBars(byId('categoryChart'),Array.isArray(data?.analytics?.categories)?data.analytics.categories:[],'category');
  };

  const clientFilters=()=>({
    search:(byId('clientSearch')?.value || '').trim().toLowerCase(),
    status:byId('clientStatusFilter')?.value || '',
    connection:byId('clientConnectionFilter')?.value || '',
    language:byId('clientLanguageFilter')?.value || '',
    country:(byId('clientCountryFilter')?.value || '').trim().toUpperCase()
  });
  const clientMatches=(client,filters)=>{
    const haystack=[client.company,client.email,client.name,client.contact_name,client.mobile,client.whatsapp].filter(Boolean).join(' ').toLowerCase();
    if(filters.search && !haystack.includes(filters.search)) return false;
    if(filters.status && client.status!==filters.status) return false;
    if(filters.language && client.language!==filters.language) return false;
    if(filters.country && String(client.country || '').toUpperCase()!==filters.country) return false;
    if(filters.connection==='connected' && !client.last_login_at) return false;
    if(filters.connection==='never' && client.last_login_at) return false;
    if(filters.connection==='active' && number(client.active_sessions)<1) return false;
    return true;
  };
  const renderClients=()=>{
    const host=byId('clientList'); if(!host) return;
    host.replaceChildren();
    const filters=clientFilters();
    const clients=(dashboard.clients || []).filter(client=>clientMatches(client,filters));
    byId('clientResultCount').textContent=`${clients.length} record${clients.length===1?'':'s'}`;
    for(const client of clients){
      const categories=(client.interest_categories || '').split(',').filter(Boolean).map(categoryName).join(', ') || 'No categories';
      const connected=client.last_login_at ? `Connected · ${number(client.login_count)} login${number(client.login_count)===1?'':'s'}` : 'Never connected';
      const active=number(client.active_sessions)>0 ? `Active session (${number(client.active_sessions)})` : 'No active session';
      const detail=[
        `${String(client.status || 'pending').toUpperCase()} · ${client.country || 'No country'} · ${String(client.language || 'en').toUpperCase()} · ${connected} · ${active}`,
        `Last login: ${date(client.last_login_at)} · Last seen: ${date(client.last_seen_at)}`,
        `Offer engagement: ${number(client.offers_viewed)} unique · ${number(client.offer_view_count)} view${number(client.offer_view_count)===1?'':'s'}`,
        `CIF / Tax ID: ${client.tax_id || '—'} · Contact: ${client.contact_name || client.name || '—'}`,
        `${client.email} · Mobile: ${client.mobile || '—'} · WhatsApp: ${client.whatsapp || '—'}`,
        `Interests: ${categories}${client.products_interest ? ` · ${client.products_interest}` : ''}`,
        `Address: ${client.address || '—'} · First request: ${date(client.created_at)}${client.updated_at ? ` · Updated: ${date(client.updated_at)}` : ''}`
      ].join('\n');
      row(host,client.company || client.email,detail,client.status==='pending'?'Review / approve':'Edit approval',()=>{
        const form=document.querySelector('[data-client-form]');
        for(const field of ['email','name','company','language']) if(form.elements[field]) form.elements[field].value=client[field] || '';
        form.elements.company?.focus();
      });
    }
    if(!clients.length) host.textContent='No clients match these filters.';
  };

  const offerState=offer=>{
    if(offer.deleted_at || offer.status==='deleted') return 'deleted';
    if(offer.status==='cancelled') return 'cancelled';
    if(offer.status==='draft') return 'draft';
    if(number(offer.valid_until)<=Date.now()/1000) return 'expired';
    return offer.status==='published' ? 'active' : offer.status || 'inactive';
  };
  const audienceLabel=offer=>{
    const scope=offer.visibility_scope || 'all',value=offer.visibility_value || '';
    if(scope==='language') return `Language: ${value.toUpperCase()}`;
    if(scope==='country') return `Country: ${value.toUpperCase()}`;
    if(scope==='client') return `Client: ${value}`;
    return 'All approved clients';
  };
  const offerFilters=()=>({
    search:(byId('offerSearch')?.value || '').trim().toLowerCase(),
    status:byId('offerStatusFilter')?.value || '',
    category:(byId('offerCategoryFilter')?.value || '').trim().toLowerCase(),
    audience:byId('offerAudienceFilter')?.value || ''
  });
  const offerMatches=(offer,filters)=>{
    const state=offerState(offer),haystack=[offer.title,offer.category,offer.origin,offer.destination,offer.availability,offer.description].filter(Boolean).join(' ').toLowerCase();
    if(filters.search && !haystack.includes(filters.search)) return false;
    if(filters.status && state!==filters.status) return false;
    if(filters.category && !String(offer.category || '').toLowerCase().includes(filters.category)) return false;
    if(filters.audience && (offer.visibility_scope || 'all')!==filters.audience) return false;
    return true;
  };
  const previewOffer=offer=>{
    const dialog=byId('offerPreviewDialog'),host=byId('offerClientPreview');
    if(!dialog || !host) return;
    host.replaceChildren();
    const card=document.createElement('article');card.className='news-card admin-preview-card';
    const idx=document.createElement('span');idx.className='news-card-index';idx.textContent=`#${offer.id}`;
    const tag=document.createElement('span');tag.className='news-tag';tag.textContent=offer.category || 'SIGNATURE';
    const title=document.createElement('h3');title.textContent=offer.title;
    const facts=document.createElement('p');
    facts.innerHTML=`<strong>Origin:</strong> ${escapeText(offer.origin || '—')}<br><strong>Destination:</strong> ${escapeText(offer.destination || '—')}<br><strong>Availability:</strong> ${escapeText(offer.availability || '—')}`;
    const description=document.createElement('p');description.textContent=offer.description || '';
    const meta=document.createElement('p');meta.className='admin-preview-meta';
    meta.textContent=`Valid until ${date(offer.valid_until)} · ${audienceLabel(offer)}`;
    card.append(idx,tag,title,facts,description,meta);host.append(card);
    if(typeof dialog.showModal==='function') dialog.showModal(); else dialog.setAttribute('open','');
  };
  const escapeText=value=>String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');

  const resetOfferForm=()=>{
    const form=document.querySelector('[data-offer-form]'); if(!form) return;
    form.reset(); editingOfferId=null;
    form.elements.offer_id.value='';
    form.elements.priority.value='0';
    form.elements.status.value='published';
    form.elements.visibility_scope.value='all';
    form.elements.visibility_value.value='';form.elements.visibility_value.disabled=true;
    byId('offerSubmitLabel').textContent='Save opportunity ↗';
    byId('cancelOfferEdit').hidden=true;
    set(form.querySelector('[data-status]'),'');
  };
  const editOffer=offer=>{
    const form=document.querySelector('[data-offer-form]'); if(!form) return;
    editingOfferId=Number(offer.id);
    const values={
      offer_id:offer.id,title:offer.title,category:offer.category,origin:offer.origin,destination:offer.destination,
      availability:offer.availability,valid_until:localDateTime(offer.valid_until),description:offer.description,
      status:offer.status==='published'?'published':'draft',priority:number(offer.priority),
      visibility_scope:offer.visibility_scope || 'all',visibility_value:offer.visibility_value || ''
    };
    for(const [key,value] of Object.entries(values)) if(form.elements[key]) form.elements[key].value=value ?? '';
    form.elements.visibility_value.disabled=form.elements.visibility_scope.value==='all';
    byId('offerSubmitLabel').textContent=`Update opportunity #${offer.id} ↗`;
    byId('cancelOfferEdit').hidden=false;
    form.scrollIntoView({behavior:'smooth',block:'center'});form.elements.title.focus();
  };
  const changeOfferStatus=async(offer,status)=>{
    await call('/api/private/admin/offers/status',{id:Number(offer.id),status});
    await refresh();
  };
  const deleteOffer=async offer=>{
    const views=number(offer.views),deliveries=number(offer.deliveries);
    const warning=`Delete opportunity #${offer.id} from all client views?\n\nAudit history will be retained. Current engagement: ${views} view(s), ${deliveries} delivered email(s).`;
    if(!window.confirm(warning)) return;
    await call(`/api/private/admin/offers?id=${encodeURIComponent(offer.id)}`,undefined,'DELETE');
    if(editingOfferId===Number(offer.id)) resetOfferForm();
    await refresh();
  };
  const renderOfferRecord=(host,offer)=>{
    const item=document.createElement('div');item.className='admin-record admin-offer-record';
    item.dataset.state=offerState(offer);
    const text=document.createElement('div'),strong=document.createElement('strong'),detail=document.createElement('p');
    strong.textContent=`#${offer.id} — ${offer.title}`;
    detail.textContent=[
      `${offerState(offer).toUpperCase()} · Priority ${number(offer.priority)} · ${audienceLabel(offer)}`,
      `${offer.category || 'No category'} · ${offer.origin || 'No origin'} → ${offer.destination || 'No destination'} · ${offer.availability || 'No availability'}`,
      `Valid until: ${date(offer.valid_until)} · Updated: ${date(offer.updated_at || offer.created_at)}`,
      `Engagement: ${number(offer.unique_viewers)} unique viewer(s) · ${number(offer.views)} view(s) · ${number(offer.deliveries)} delivered email(s) · last view: ${date(offer.latest_view_at)}`
    ].join('\n');
    text.append(strong,detail);
    const actions=document.createElement('div');actions.className='admin-record-actions';
    const add=(label,handler,className='')=>{const button=document.createElement('button');button.type='button';button.textContent=label;if(className)button.className=className;button.addEventListener('click',()=>Promise.resolve(handler()).catch(error=>set(byId('serviceStatus'),error.message)));actions.append(button);};
    add('Client preview',()=>previewOffer(offer));
    if(offerState(offer)!=='deleted'){
      add('Edit',()=>editOffer(offer));
      if(['active','draft'].includes(offerState(offer))) add('Cancel',()=>changeOfferStatus(offer,'cancelled'),'admin-button-warning');
      if(['draft','cancelled'].includes(offerState(offer)) && number(offer.valid_until)>Date.now()/1000) add('Publish',()=>changeOfferStatus(offer,'published'));
      if(offerState(offer)==='active') add('Move to draft',()=>changeOfferStatus(offer,'draft'),'admin-button-secondary');
      add('Delete',()=>deleteOffer(offer),'admin-button-danger');
    }
    item.append(text,actions);host.append(item);
  };
  const renderOffers=()=>{
    const host=byId('offerOpsList'); if(!host) return;
    host.replaceChildren();
    const filters=offerFilters();
    const offers=(dashboard.offers || []).filter(offer=>offerMatches(offer,filters));
    byId('offerResultCount').textContent=`${offers.length} offer${offers.length===1?'':'s'}`;
    for(const offer of offers) renderOfferRecord(host,offer);
    if(!offers.length) host.textContent='No offers match these filters.';

    const select=byId('offerSelect');
    if(select){
      select.replaceChildren(new Option('Choose an active offer',''));
      for(const offer of dashboard.offers || []){
        if(offerState(offer)==='active') select.add(new Option(`#${offer.id} — ${offer.title} · ${audienceLabel(offer)}`,offer.id));
      }
    }
  };

  const renderSubscribers=()=>{
    const host=byId('subscriberList');if(!host)return;host.replaceChildren();
    for(const subscriber of dashboard.subscribers || []){
      row(host,subscriber.email,`${String(subscriber.language || 'en').toUpperCase()} · ${subscriber.unsubscribed_at?'Unsubscribed':subscriber.confirmed_at?'Confirmed':'Awaiting confirmation'}`);
    }
    if(!host.children.length) host.textContent='No records yet.';
  };
  const renderCampaigns=()=>{
    const host=byId('campaignList');if(!host)return;host.replaceChildren();
    for(const campaign of dashboard.campaigns || []){
      row(host,campaign.subject,`${campaign.kind} · ${campaign.language || 'all languages'} · ${campaign.status} · accepted: ${campaign.sent} · pending: ${campaign.pending} · failed / uncertain: ${campaign.failed}`,'Preview / details',()=>preview(campaign.id).catch(error=>set(byId('serviceStatus'),error.message)));
    }
    if(!host.children.length) host.textContent='No records yet.';
  };

  async function refresh(){
    const current=generation;
    const data=await call('/api/private/admin/overview',undefined,'GET');
    if(current!==generation || !adminKey) return;
    dashboard=data; emailConfigured=data.emailConfigured;
    renderAnalytics(data);renderInquiryPipeline(data.inquiryPipeline || {});
    set(byId('serviceStatus'),emailConfigured?'Database connected · email secret configured. SIGNATURE activity tracking is active.':'Database connected · email sending disabled: RESEND_API_KEY is missing.',emailConfigured);
    byId('inquiryList')?.replaceChildren();
    for(const inquiry of data.inquiries || []) renderInquiry(inquiry);
    renderClients();renderOffers();renderSubscribers();renderCampaigns();
  }

  async function preview(id){
    if(sending) return;
    const current=generation;
    const data=await call(`/api/private/admin/campaigns/preview?id=${encodeURIComponent(id)}`,undefined,'GET');
    if(current!==generation || !adminKey) return;
    selectedCampaign={...data.campaign,audienceFingerprint:data.audienceFingerprint};emailConfigured=data.emailConfigured;
    byId('previewSubject').textContent=data.campaign.subject;
    byId('previewAudience').textContent=`${data.recipients} ${data.campaign.status==='draft'?'eligible':'saved'} recipient(s) · ${data.campaign.language || 'All languages'} · ${data.campaign.status}. Limit: 200 per campaign.`;
    byId('previewFrame').srcdoc=`<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src https: data:"><body>${data.campaign.html}</body>`;
    byId('confirmCampaign').checked=false;
    byId('confirmCampaign').disabled=!emailConfigured || !['draft','sending'].includes(data.campaign.status) || data.recipients===0 || data.recipients>200;
    byId('sendCampaign').disabled=true;byId('campaignPreview').hidden=false;
    set(byId('campaignStatus'),emailConfigured?'Review the draft above. Failed or uncertain deliveries are not retried automatically.':'Sending unavailable until RESEND_API_KEY is configured.');
  }

  byId('confirmCampaign')?.addEventListener('change',()=>{byId('sendCampaign').disabled=!byId('confirmCampaign').checked || sending;});
  byId('sendCampaign')?.addEventListener('click',async()=>{
    if(!selectedCampaign || !byId('confirmCampaign').checked || !emailConfigured || sending) return;
    sending=true;byId('sendCampaign').disabled=true;byId('confirmCampaign').disabled=true;
    const campaign=selectedCampaign,current=generation;
    try{
      let result;
      do{
        result=await call(campaign.kind==='offer'?'/api/private/admin/send-offer':'/api/admin/newsletter/send',{campaign_id:campaign.id,confirm:true,audience_fingerprint:campaign.audienceFingerprint});
        if(current!==generation) return;
        set(byId('campaignStatus'),`Accepted: ${result.sent} · failed: ${result.failed} · pending: ${result.pending} · in progress / uncertain: ${result.uncertain}`,!result.failed);
        if(!result.pending) break;
        await new Promise(resolve=>setTimeout(resolve,750));
      }while(adminKey && current===generation);
      await refresh();
    }catch(error){if(current===generation)set(byId('campaignStatus'),`${error.message} Distribution stopped. Refresh history before resuming.`);}
    finally{sending=false;}
  });

  byId('refreshAdmin')?.addEventListener('click',()=>refresh().catch(error=>set(byId('serviceStatus'),error.message)));
  byId('lockAdmin')?.addEventListener('click',()=>{
    generation++;adminKey='';selectedCampaign=null;dashboard={clients:[],offers:[],subscribers:[],campaigns:[],inquiries:[]};
    panel.hidden=true;keyInput.disabled=false;unlock.disabled=false;
    if(byId('previewFrame')) byId('previewFrame').srcdoc='';
    if(byId('campaignPreview')) byId('campaignPreview').hidden=true;
    document.querySelectorAll('#adminPanel form').forEach(form=>form.reset());
    resetOfferForm();set(authStatus,'Panel locked.');keyInput.focus();
  });

  for(const id of ['clientSearch','clientStatusFilter','clientConnectionFilter','clientLanguageFilter','clientCountryFilter']){
    byId(id)?.addEventListener('input',renderClients);byId(id)?.addEventListener('change',renderClients);
  }
  for(const id of ['offerSearch','offerStatusFilter','offerCategoryFilter','offerAudienceFilter']){
    byId(id)?.addEventListener('input',renderOffers);byId(id)?.addEventListener('change',renderOffers);
  }

  byId('offerVisibilityScope')?.addEventListener('change',event=>{
    const input=byId('offerVisibilityValue'),scope=event.target.value;
    input.disabled=scope==='all';if(scope==='all')input.value='';
    input.placeholder=scope==='language'?'es / en / fr / it / ar':scope==='country'?'ES / FR / MA':scope==='client'?'client@company.com':'Not required';
  });
  byId('cancelOfferEdit')?.addEventListener('click',resetOfferForm);
  byId('closeOfferPreview')?.addEventListener('click',()=>byId('offerPreviewDialog')?.close());
  byId('offerPreviewDialog')?.addEventListener('click',event=>{if(event.target===event.currentTarget)event.currentTarget.close();});

  const bind=(selector,handler)=>{
    const form=document.querySelector(selector);if(!form)return;
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      const btn=form.querySelector('button[type="submit"]'),status=form.querySelector('[data-status]');
      if(btn){btn.disabled=true;btn.setAttribute('aria-busy','true');}
      set(status,'');
      try{
        const message=await handler(form);
        set(status,message || 'Done.',true);
        if(message!==false && selector!=='[data-offer-form]') form.reset();
        await refresh();
      }catch(error){set(status,error?.message || 'Request failed.');}
      finally{if(btn){btn.disabled=false;btn.removeAttribute('aria-busy');}}
    });
  };

  bind('[data-client-form]',async form=>{
    const fd=new FormData(form);
    await call('/api/private/admin/approve',{
      email:String(fd.get('email') || '').trim().toLowerCase(),
      name:String(fd.get('name') || '').trim(),
      company:String(fd.get('company') || '').trim(),
      language:String(fd.get('language') || 'en')
    });
    return 'Client approved.';
  });

  bind('[data-offer-form]',async form=>{
    const fd=new FormData(form),dt=String(fd.get('valid_until') || ''),ts=dt?Math.floor(new Date(dt).getTime()/1000):0;
    if(!ts) throw new Error('Choose a valid expiry date.');
    const payload={
      title:String(fd.get('title') || '').trim(),
      category:String(fd.get('category') || '').trim(),
      origin:String(fd.get('origin') || '').trim(),
      destination:String(fd.get('destination') || '').trim(),
      availability:String(fd.get('availability') || '').trim(),
      valid_until:ts,
      description:String(fd.get('description') || '').trim(),
      status:String(fd.get('status') || 'published'),
      priority:Number(fd.get('priority') || 0),
      visibility_scope:String(fd.get('visibility_scope') || 'all'),
      visibility_value:String(fd.get('visibility_value') || '').trim()
    };
    const id=Number(fd.get('offer_id'));
    if(Number.isInteger(id) && id>0){
      await call('/api/private/admin/offers/update',{id,...payload});
      resetOfferForm();
      return `Opportunity #${id} updated.`;
    }
    const result=await call('/api/private/admin/offers',payload);
    resetOfferForm();
    return `Opportunity #${result.id} saved as ${result.status}.`;
  });

  bind('[data-send-offer-form]',async form=>{
    const fd=new FormData(form),id=Number(fd.get('offer_id'));
    if(!Number.isInteger(id) || id<1) throw new Error('Choose a valid active offer.');
    const data=await call('/api/private/admin/campaigns',{offer_id:id,kind:'offer',language:String(fd.get('language') || '')});
    await preview(data.id);return 'Offer distribution draft saved. Review before sending.';
  });

  bind('[data-newsletter-form]',async form=>{
    const fd=new FormData(form);
    const data=await call('/api/private/admin/campaigns',{
      subject:String(fd.get('subject') || '').trim(),html:String(fd.get('html') || ''),language:String(fd.get('language') || '')
    });
    await preview(data.id);return 'Market Signals draft saved. Review before sending.';
  });
})();