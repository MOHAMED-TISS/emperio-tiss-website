(() => {
  'use strict';
  const root = document.querySelector('[data-seafood-catalog]');
  if (!root) return;
  const url = root.dataset.catalogUrl;
  const grid = root.querySelector('.seafood-catalog-grid');
  const search = root.querySelector('.seafood-catalog-search');
  const count = root.querySelector('.seafood-catalog-count');
  if (!grid || !search || !count) return;

  const labels = {
    group:'Categoria', type:'Tipo', condition:'Stato', origin:'Origine', fao:'Zona FAO', calibre:'Calibro',
    quality:'Qualità', format:'Presentazione', packaging:'Imballaggio', availability:'Disponibilità',
    fresh:'Fresco', frozen:'Surgelato', ref:'referenza', refs:'referenze', empty:'Nessuna referenza corrisponde alla ricerca.',
    prev:'Immagine precedente', next:'Immagine successiva', close:'Chiudi', view:'Vedi immagine'
  };
  const esc = v => String(v ?? '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const first = v => Array.isArray(v) ? v.filter(Boolean).join(' · ') : String(v || '');
  const state = v => (Array.isArray(v)?v:[]).map(x=>x==='fresh'?labels.fresh:x==='frozen'?labels.frozen:x).join(' · ');
  const imgs = p => [...new Set(Array.isArray(p.images)?p.images.filter(Boolean):[])];

  const style = document.createElement('style');
  style.textContent = `
    html[lang="it"] .seafood-catalog{font-family:var(--et-sans,"DM Sans",Arial,sans-serif)}
    html[lang="it"] .seafood-catalog__head h2,html[lang="it"] .seafood-catalog-card h3{font-family:var(--et-serif,"Cormorant Garamond",Georgia,serif);font-weight:400}
    html[lang="it"] .seafood-catalog-card{cursor:default}
    html[lang="it"] .seafood-catalog-card__media{position:relative;overflow:hidden;cursor:zoom-in}
    html[lang="it"] .seafood-catalog-card__image-button{display:block;width:100%;height:100%;padding:0;border:0;background:none;cursor:zoom-in}
    html[lang="it"] .seafood-catalog-card__media img{display:block;width:100%;height:100%;object-fit:cover;user-select:none;-webkit-user-drag:none;-webkit-touch-callout:none;transition:transform .5s ease}
    html[lang="it"] .seafood-catalog-card__media:hover img{transform:scale(1.02)}
    .it-seafood-gallery{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:28px;background:rgba(7,16,22,.94)}
    .it-seafood-gallery[hidden]{display:none}
    .it-seafood-gallery__panel{position:relative;width:min(92vw,1200px);height:min(88vh,850px);display:flex;align-items:center;justify-content:center}
    .it-seafood-gallery__image{max-width:100%;max-height:100%;object-fit:contain;user-select:none;-webkit-user-drag:none}
    .it-seafood-gallery button{position:absolute;width:46px;height:46px;border:1px solid rgba(255,255,255,.22);border-radius:50%;background:rgba(0,0,0,.28);color:#fff;font-size:28px;cursor:pointer;backdrop-filter:blur(10px)}
    .it-seafood-gallery__prev{left:8px}.it-seafood-gallery__next{right:8px}.it-seafood-gallery__close{right:8px;top:8px}
    .it-seafood-gallery__count{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);padding:4px 9px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(0,0,0,.28);color:rgba(255,255,255,.84);font:500 11px/1 var(--et-sans,"DM Sans",Arial,sans-serif);letter-spacing:.08em}
  `;
  document.head.appendChild(style);

  const viewer = document.createElement('div');
  viewer.className='it-seafood-gallery'; viewer.hidden=true;
  viewer.innerHTML='<div class="it-seafood-gallery__panel"><img class="it-seafood-gallery__image" alt="" draggable="false"><button class="it-seafood-gallery__prev" type="button" aria-label="'+labels.prev+'">‹</button><button class="it-seafood-gallery__next" type="button" aria-label="'+labels.next+'">›</button><button class="it-seafood-gallery__close" type="button" aria-label="'+labels.close+'">×</button><span class="it-seafood-gallery__count"></span></div>';
  document.body.appendChild(viewer);
  const vImg=viewer.querySelector('.it-seafood-gallery__image'), vCount=viewer.querySelector('.it-seafood-gallery__count');
  let gallery=[], gi=0;
  const show=()=>{vImg.src=gallery[gi];vCount.textContent=`${gi+1} / ${gallery.length}`;viewer.querySelector('.it-seafood-gallery__prev').hidden=gallery.length<2;viewer.querySelector('.it-seafood-gallery__next').hidden=gallery.length<2};
  const close=()=>{viewer.hidden=true;vImg.removeAttribute('src');gallery=[];document.body.style.overflow=''};
  const open=images=>{if(!images.length)return;gallery=images;gi=0;viewer.hidden=false;document.body.style.overflow='hidden';show()};
  viewer.querySelector('.it-seafood-gallery__prev').onclick=()=>{gi=(gi-1+gallery.length)%gallery.length;show()};
  viewer.querySelector('.it-seafood-gallery__next').onclick=()=>{gi=(gi+1)%gallery.length;show()};
  viewer.querySelector('.it-seafood-gallery__close').onclick=close;
  viewer.onclick=e=>{if(e.target===viewer)close()};
  viewer.addEventListener('contextmenu',e=>e.preventDefault(),true);
  viewer.addEventListener('dragstart',e=>e.preventDefault(),true);
  viewer.addEventListener('selectstart',e=>e.preventDefault(),true);
  document.addEventListener('keydown',e=>{if(viewer.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft'&&gallery.length>1){gi=(gi-1+gallery.length)%gallery.length;show()}if(e.key==='ArrowRight'&&gallery.length>1){gi=(gi+1)%gallery.length;show()}});

  const card=p=>{const images=imgs(p);return `<article class="seafood-catalog-card"><div class="seafood-catalog-card__media" data-images='${esc(JSON.stringify(images))}'><button class="seafood-catalog-card__image-button" type="button" aria-label="${labels.view} — ${esc(p.commercialName)}">${images[0]?`<img src="${esc(images[0])}" alt="${esc(p.commercialName)}" loading="lazy" draggable="false">`:'<span>EMPERIO TISS</span>'}${images.length>1?`<span class="seafood-catalog-card__image-count">${images.length}</span>`:''}</button></div><div class="seafood-catalog-card__body"><p class="seafood-catalog-card__meta">${esc(p.group||'')}</p><h3>${esc(p.commercialName||'')}</h3><p class="seafood-catalog-card__scientific"><em>${esc(p.scientificName||'')}</em></p><div class="seafood-catalog-card__details"><div class="seafood-catalog-card__detail"><span>${labels.group}</span><strong>${esc(first(p.group))}</strong></div><div class="seafood-catalog-card__detail"><span>${labels.type}</span><strong>${esc(first(p.type))}</strong></div><div class="seafood-catalog-card__detail"><span>${labels.condition}</span><strong>${esc(state(p.condition))}</strong></div><div class="seafood-catalog-card__detail"><span>${labels.origin}</span><strong>${esc(first(p.origin))}</strong></div><div class="seafood-catalog-card__detail"><span>${labels.fao}</span><strong>${esc(first(p.faoZone))}</strong></div><div class="seafood-catalog-card__detail"><span>${labels.calibre}</span><strong>${esc(first(p.calibre))}</strong></div><div class="seafood-catalog-card__detail"><span>${labels.quality}</span><strong>${esc(first(p.quality))}</strong></div><div class="seafood-catalog-card__detail"><span>${labels.format}</span><strong>${esc(first(p.format))}</strong></div><div class="seafood-catalog-card__detail"><span>${labels.packaging}</span><strong>${esc(first(p.packaging))}</strong></div><div class="seafood-catalog-card__detail"><span>${labels.availability}</span><strong>${esc(first(p.availability))}</strong></div></div></div></article>`};

  let products=[];
  const render=()=>{const q=(search.value||'').trim().toLowerCase();const visible=products.filter(p=>!q||JSON.stringify(p).toLowerCase().includes(q));count.textContent=`${visible.length} ${visible.length===1?labels.ref:labels.refs}`;grid.innerHTML=visible.length?visible.map(card).join(''):`<p class="seafood-catalog-empty">${labels.empty}</p>`};
  grid.addEventListener('click',e=>{const media=e.target.closest('.seafood-catalog-card__media');if(!media)return;try{open(JSON.parse(media.dataset.images||'[]'))}catch(_){}});
  grid.addEventListener('contextmenu',e=>{if(e.target.closest('.seafood-catalog-card__media'))e.preventDefault()},true);
  grid.addEventListener('dragstart',e=>{if(e.target.closest('.seafood-catalog-card__media'))e.preventDefault()},true);
  grid.addEventListener('selectstart',e=>{if(e.target.closest('.seafood-catalog-card__media'))e.preventDefault()},true);
  search.addEventListener('input',render);
  fetch(url,{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(d=>{products=Array.isArray(d.products)?d.products:[];render()}).catch(()=>{count.textContent='0 '+labels.refs;grid.innerHTML=`<p class="seafood-catalog-empty">${labels.empty}</p>`});
})();
