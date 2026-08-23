(() => {
  'use strict';
  const root = document.querySelector('[data-seafood-catalog]');
  if (!root) return;
  const url = root.dataset.catalogUrl;
  const grid = root.querySelector('.seafood-catalog-grid');
  const search = root.querySelector('.seafood-catalog-search');
  const count = root.querySelector('.seafood-catalog-count');
  if (!grid || !search || !count) return;

  const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const first = v => Array.isArray(v) ? v.filter(Boolean).join(' · ') : (v || '');
  const imageList = p => [...new Set((Array.isArray(p.images) ? p.images : (p.image ? [p.image] : [])).filter(Boolean))];
  const spec = (label,v) => `<div class="seafood-catalog-card__detail"><span>${esc(label)}</span><strong>${esc(first(v))}</strong></div>`;
  const labels = {group:'Familia',type:'Tipo',condition:'Estado',origin:'Origen',fao:'Zona FAO',calibre:'Calibre',quality:'Calidad',format:'Presentación',packaging:'Embalaje',availability:'Disponibilidad'};
  const state = v => (v || []).map(x => x === 'fresh' ? 'Fresco' : x === 'frozen' ? 'Congelado' : x).join(' · ');

  const style = document.createElement('style');
  style.textContent = `
    .seafood-catalog-card__media{position:relative;cursor:zoom-in;overflow:hidden;}
    .seafood-catalog-card__media img{display:block;width:100%;height:100%;object-fit:cover;user-select:none;-webkit-user-drag:none;}
    .seafood-catalog-card__image-button{display:block;width:100%;height:100%;padding:0;border:0;background:none;cursor:zoom-in;position:relative;}
    .seafood-catalog-card__image-count{position:absolute;right:10px;bottom:10px;padding:6px 8px;background:rgba(4,29,49,.78);color:#fff;font:500 10px/1 'DM Sans',sans-serif;letter-spacing:.08em;}
    .catalog-image-modal{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;padding:32px;background:rgba(7,20,27,.94);}
    .catalog-image-modal.is-open{display:flex;}
    .catalog-image-modal__panel{position:relative;max-width:min(92vw,1400px);max-height:90vh;}
    .catalog-image-modal__image{display:block;max-width:92vw;max-height:84vh;width:auto;height:auto;object-fit:contain;user-select:none;-webkit-user-drag:none;}
    .catalog-image-modal__close,.catalog-image-modal__prev,.catalog-image-modal__next{position:fixed;width:48px;height:48px;border:1px solid rgba(255,255,255,.45);background:rgba(7,20,27,.55);color:#fff;cursor:pointer;}
    .catalog-image-modal__close{top:20px;right:24px;font-size:28px;line-height:1;}
    .catalog-image-modal__prev{left:24px;top:50%;transform:translateY(-50%);font-size:32px;}
    .catalog-image-modal__next{right:24px;top:50%;transform:translateY(-50%);font-size:32px;}
    .catalog-image-modal__label{position:fixed;left:24px;bottom:20px;color:rgba(255,255,255,.85);font:500 13px/1.3 'DM Sans',sans-serif;letter-spacing:.08em;text-transform:uppercase;}
    .catalog-image-modal__count{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);color:rgba(255,255,255,.75);font:500 12px/1 'DM Sans',sans-serif;}
    @media(max-width:700px){.catalog-image-modal__prev{left:8px}.catalog-image-modal__next{right:8px}}
  `;
  document.head.appendChild(style);

  const modal = document.createElement('div');
  modal.className = 'catalog-image-modal';
  modal.setAttribute('aria-hidden','true');
  modal.innerHTML = `<div class="catalog-image-modal__panel"><img class="catalog-image-modal__image" alt="" draggable="false"></div><button class="catalog-image-modal__prev" type="button" aria-label="Imagen anterior">‹</button><button class="catalog-image-modal__next" type="button" aria-label="Imagen siguiente">›</button><button class="catalog-image-modal__close" type="button" aria-label="Cerrar">×</button><span class="catalog-image-modal__label"></span><span class="catalog-image-modal__count"></span>`;
  document.body.appendChild(modal);
  const modalImage = modal.querySelector('.catalog-image-modal__image');
  const modalLabel = modal.querySelector('.catalog-image-modal__label');
  const modalCount = modal.querySelector('.catalog-image-modal__count');
  let gallery=[]; let galleryIndex=0;
  const show = i => {if(!gallery.length)return;galleryIndex=(i+gallery.length)%gallery.length;modalImage.src=gallery[galleryIndex];modalCount.textContent=`${galleryIndex+1} / ${gallery.length}`;modal.querySelector('.catalog-image-modal__prev').hidden=gallery.length<2;modal.querySelector('.catalog-image-modal__next').hidden=gallery.length<2;};
  const closeModal = () => { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true'); modalImage.removeAttribute('src'); gallery=[]; document.body.style.overflow=''; };
  const openModal = (images, alt) => { gallery=images; galleryIndex=0; modalImage.alt=alt; modalLabel.textContent=alt; modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; show(0); };
  modal.querySelector('.catalog-image-modal__close').addEventListener('click',closeModal);
  modal.querySelector('.catalog-image-modal__prev').addEventListener('click',()=>show(galleryIndex-1));
  modal.querySelector('.catalog-image-modal__next').addEventListener('click',()=>show(galleryIndex+1));
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
  document.addEventListener('keydown',e=>{if(!modal.classList.contains('is-open'))return;if(e.key==='Escape')closeModal();if(e.key==='ArrowLeft')show(galleryIndex-1);if(e.key==='ArrowRight')show(galleryIndex+1);});
  modal.addEventListener('contextmenu',e=>e.preventDefault());
  modalImage.addEventListener('dragstart',e=>e.preventDefault());

  const card = p => {const imgs=imageList(p);return `<article class="seafood-catalog-card"><div class="seafood-catalog-card__media" data-image-list="${esc(JSON.stringify(imgs))}" data-image-alt="${esc(p.commercialName)}">${imgs.length?`<button class="seafood-catalog-card__image-button" type="button" aria-label="Ver imágenes de ${esc(p.commercialName)}"><img src="${esc(imgs[0])}" alt="${esc(p.commercialName)}" loading="lazy" draggable="false">${imgs.length>1?`<span class="seafood-catalog-card__image-count">${imgs.length} imágenes</span>`:''}</button>`:'<span>EMPERIO TISS</span>'}</div><div class="seafood-catalog-card__body"><p class="seafood-catalog-card__meta">${esc(p.group)}</p><h3>${esc(p.commercialName)}</h3><p class="seafood-catalog-card__scientific"><em>${esc(p.scientificName)}</em></p><div class="seafood-catalog-card__details">${spec(labels.group,p.group)}${spec(labels.type,p.type)}${spec(labels.condition,state(p.condition))}${spec(labels.origin,p.origin)}${spec(labels.fao,p.faoZone)}${spec(labels.calibre,'Según disponibilidad')}${spec(labels.quality,p.quality)}${spec(labels.format,p.format)}${spec(labels.packaging,p.packaging)}${spec(labels.availability,p.availability)}</div></div></article>`;};

  let products=[];
  const render=()=>{const q=(search.value||'').trim().toLowerCase();const visible=products.filter(p=>!q||JSON.stringify(p).toLowerCase().includes(q));count.textContent=`${visible.length} ${visible.length===1?'referencia':'referencias'}`;grid.innerHTML=visible.map(card).join('')||'<p class="seafood-catalog-empty">No hay referencias que coincidan con la búsqueda.</p>';};
  grid.addEventListener('click',e=>{const media=e.target.closest('.seafood-catalog-card__media[data-image-list]');if(!media)return;try{const imgs=JSON.parse(media.dataset.imageList||'[]');if(imgs.length)openModal(imgs,media.dataset.imageAlt||'');}catch(_){}});
  grid.addEventListener('contextmenu',e=>{if(e.target.closest('.seafood-catalog-card__media'))e.preventDefault();});
  grid.addEventListener('dragstart',e=>{if(e.target.closest('.seafood-catalog-card__media'))e.preventDefault();});

  fetch(url,{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error(r.status);return r.json();}).then(d=>{products=d.products||[];render();}).catch(()=>{count.textContent='No disponible';grid.innerHTML='<p class="seafood-catalog-empty">Catálogo no disponible.</p>';});
  search.addEventListener('input',render);
})();