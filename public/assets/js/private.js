(() => {
  'use strict';
  const host=document.querySelector('#private-offers'),
    status=document.querySelector('#private-status');
  if(!host) return;

  const escape=value=>String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
  const set=(text,ok=false)=>{
    if(!status) return;
    status.textContent=text;
    status.dataset.state=ok?'success':'notice';
  };
  const viewed=new Set();
  const recordView=async id=>{
    if(viewed.has(id)) return;
    viewed.add(id);
    try{
      await fetch('/api/private/offers/view',{
        method:'POST',
        credentials:'include',
        headers:{Accept:'application/json','content-type':'application/json'},
        body:JSON.stringify({id})
      });
    }catch{}
  };
  const observeCards=()=>{
    const cards=[...host.querySelectorAll('[data-offer-id]')];
    if(!('IntersectionObserver' in window)){
      cards.forEach(card=>recordView(Number(card.dataset.offerId)));
      return;
    }
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(entry.isIntersecting && entry.intersectionRatio>=0.55){
          const id=Number(entry.target.dataset.offerId);
          if(id) recordView(id);
          observer.unobserve(entry.target);
        }
      }
    },{threshold:[0.55]});
    cards.forEach(card=>observer.observe(card));
  };
  const date=value=>value ? new Date(Number(value)*1000).toLocaleString() : '—';

  const load=async()=>{
    try{
      const response=await fetch('/api/private/offers',{
        credentials:'include',
        cache:'no-store',
        headers:{Accept:'application/json'}
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok || !data.ok){
        set('SIGNATURE access is not active for this session. Use the access request on News.');
        return;
      }
      set(`SIGNATURE access verified${data.company ? ` for ${data.company}` : ''}.`,true);
      const offers=(data.offers || []).map(offer=>Object.fromEntries(Object.entries(offer).map(([key,value])=>[key,escape(value)])));
      host.innerHTML=offers.length ? offers.map((offer,index)=>`
        <article class="news-card signature-offer-card" data-offer-id="${offer.id}">
          <span class="news-card-index">${String(index+1).padStart(2,'0')}</span>
          <span class="news-tag">${offer.category || 'SIGNATURE'}</span>
          <h3>${offer.title}</h3>
          <p class="signature-offer-facts"><strong>Origin:</strong> ${offer.origin || '—'}<br><strong>Destination:</strong> ${offer.destination || '—'}<br><strong>Availability:</strong> ${offer.availability || '—'}</p>
          <p>${offer.description || ''}</p>
          <p class="signature-offer-validity">Available until ${date(offer.valid_until)}</p>
          <a href="/en/contact/">Discuss this opportunity ↗</a>
        </article>`).join('') : '<p>No active SIGNATURE opportunities are available for your profile at the moment.</p>';
      observeCards();
    }catch{
      set('Unable to load SIGNATURE opportunities.');
    }
  };
  load();
})();