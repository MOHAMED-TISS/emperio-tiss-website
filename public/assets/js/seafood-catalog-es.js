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
  const spec = (label,v) => `<div class="seafood-catalog-card__detail"><span>${esc(label)}</span><strong>${esc(first(v))}</strong></div>`;
  const labels = {group:'Familia',type:'Tipo',condition:'Estado',origin:'Origen',fao:'Zona FAO',calibre:'Calibre',quality:'Calidad',format:'Presentación',packaging:'Embalaje',availability:'Disponibilidad'};
  const state = v => (v || []).map(x => x === 'fresh' ? 'Fresco' : x === 'frozen' ? 'Congelado' : x).join(' · ');

  const style = document.createElement('style');
  style.textContent = `
    .seafood-catalog-card__media{position:relative;cursor:zoom-in;overflow:hidden;}
    .seafood-catalog-card__media img{display:block;width:100%;height:100%;object-fit:cover;user-select:none;-webkit-user-drag:none;}
    .seafood-catalog-card__media::after{content:'EMPERIO TISS';position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:600 12px/1 'DM Sans',sans-serif;letter-spacing:.22em;color:rgba(255,255,255,.72);text-shadow:0 1px 4px rgba(0,0,0,.45);transform:rotate(-18deg);pointer-events:none;}
    .catalog-image-modal{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;padding:32px;background:rgba(7,20,27,.94);}
    .catalog-image-modal.is-open{display:flex;}
    .catalog-image-modal__panel{position:relative;max-width:min(92vw,1200px);max-height:90vh;}
    .catalog-image-modal__image{display:block;max-width:92vw;max-height:84vh;width:auto;height:auto;object-fit:contain;user-select:none;-webkit-user-drag:none;}
    .catalog-image-modal__watermark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;font:600 clamp(18px,3vw,42px)/1 'DM Sans',sans-serif;letter-spacing:.24em;color:rgba(255,255,255,.68);text-shadow:0 2px 8px rgba(0,0,0,.55);transform:rotate(-18deg);}
    .catalog-image-modal__close{position:fixed;top:20px;right:24px;width:48px;height:48px;border:1px solid rgba(255,255,255,.45);background:rgba(7,20,27,.55);color:#fff;font-size:28px;line-height:1;cursor:pointer;}
    .catalog-image-modal__label{position:fixed;left:24px;bottom:20px;color:rgba(255,255,255,.85);font:500 13px/1.3 'DM Sans',sans-serif;letter-spacing:.08em;text-transform:uppercase;}
  `;
  document.head.appendChild(style);

  const modal = document.createElement('div');
  modal.className = 'catalog-image-modal';
  modal.setAttribute('aria-hidden','true');
  modal.innerHTML = `<div class="catalog-image-modal__panel"><img class="catalog-image-modal__image" alt="" draggable="false"><span class="catalog-image-modal__watermark">EMPERIO TISS</span></div><button class="catalog-image-modal__close" type="button" aria-label="Cerrar">×</button><span class="catalog-image-modal__label"></span>`;
  document.body.appendChild(modal);
  const modalImage = modal.querySelector('.catalog-image-modal__image');
  const modalLabel = modal.querySelector('.catalog-image-modal__label');
  const closeModal = () => { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true'); modalImage.removeAttribute('src'); document.body.style.overflow=''; };
  const openModal = (src, alt) => { modalImage.src=src; modalImage.alt=alt; modalLabel.textContent=alt; modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; };
  modal.querySelector('.catalog-image-modal__close').addEventListener('click',closeModal);
  modal.addEventListener('click',e => { if(e.target===modal) closeModal(); });
  document.addEventListener('keydown',e => { if(e.key==='Escape' && modal.classList.contains('is-open')) closeModal(); });
  modal.addEventListener('contextmenu',e=>e.preventDefault());
  modalImage.addEventListener('dragstart',e=>e.preventDefault());

  const card = p => `<article class="seafood-catalog-card"><div class="seafood-catalog-card__media" data-image-src="${esc(p.image||'')}" data-image-alt="${esc(p.commercialName)}">${p.image?`<img src="${esc(p.image)}" alt="${esc(p.commercialName)}" loading="lazy" draggable="false">`:'<span>EMPERIO TISS</span>'}</div><div class="seafood-catalog-card__body"><p class="seafood-catalog-card__meta">${esc(p.group)}</p><h3>${esc(p.commercialName)}</h3><p class="seafood-catalog-card__scientific"><em>${esc(p.scientificName)}</em></p><div class="seafood-catalog-card__details">${spec(labels.group,p.group)}${spec(labels.type,p.type)}${spec(labels.condition,state(p.condition))}${spec(labels.origin,p.origin)}${spec(labels.fao,p.faoZone)}${spec(labels.calibre,'Según disponibilidad')}${spec(labels.quality,p.quality)}${spec(labels.format,p.format)}${spec(labels.packaging,p.packaging)}${spec(labels.availability,p.availability)}</div></div></article>`;

  let products=[];
  const render=()=>{
    const q=(search.value||'').trim().toLowerCase();
    const visible=products.filter(p=>!q || JSON.stringify(p).toLowerCase().includes(q));
    count.textContent=`${visible.length} ${visible.length===1?'referencia':'referencias'}`;
    grid.innerHTML=visible.map(card).join('') || '<p class="seafood-catalog-empty">No hay referencias que coincidan con la búsqueda.</p>';
  };
  grid.addEventListener('click',e=>{
    const media=e.target.closest('.seafood-catalog-card__media[data-image-src]');
    if(!media || !media.dataset.imageSrc) return;
    openModal(media.dataset.imageSrc,media.dataset.imageAlt||'EMPERIO TISS');
  });
  grid.addEventListener('contextmenu',e=>{if(e.target.closest('.seafood-catalog-card__media')) e.preventDefault();});
  grid.addEventListener('dragstart',e=>{if(e.target.closest('.seafood-catalog-card__media')) e.preventDefault();});

  fetch(url,{cache:'no-cache'}).then(r=>{if(!r.ok) throw Error(r.status); return r.json();}).then(d=>{products=d.products||[];render();}).catch(()=>{count.textContent='No disponible';grid.innerHTML='<p class="seafood-catalog-empty">Catálogo no disponible.</p>';});
  search.addEventListener('input',render);
})();
