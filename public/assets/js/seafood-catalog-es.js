(() => {
  'use strict';
  const root = document.querySelector('[data-seafood-catalog]');
  if (!root) return;
  const url = root.dataset.catalogUrl;
  const grid = root.querySelector('.seafood-catalog-grid');
  const search = root.querySelector('.seafood-catalog-search');
  const count = root.querySelector('.seafood-catalog-count');
  const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const first = v => Array.isArray(v) ? v.filter(Boolean).join(' · ') : (v || '');
  const spec = (label,v) => `<div class="seafood-catalog-card__detail"><span>${esc(label)}</span><strong>${esc(first(v))}</strong></div>`;
  const labels = {group:'Familia',type:'Tipo',condition:'Estado',origin:'Origen',fao:'Zona FAO',calibre:'Calibre',quality:'Calidad',format:'Presentación',packaging:'Embalaje',availability:'Disponibilidad'};
  const state = v => (v || []).map(x => x === 'fresh' ? 'Fresco' : x === 'frozen' ? 'Congelado' : x).join(' · ');
  const card = p => `<article class="seafood-catalog-card"><div class="seafood-catalog-card__media"><span>EMPERIO TISS</span></div><div class="seafood-catalog-card__body"><p class="seafood-catalog-card__meta">${esc(p.group)}</p><h3>${esc(p.commercialName)}</h3><p class="seafood-catalog-card__scientific"><em>${esc(p.scientificName)}</em></p><div class="seafood-catalog-card__details">${spec(labels.group,p.group)}${spec(labels.type,p.type)}${spec(labels.condition,state(p.condition))}${spec(labels.origin,p.origin)}${spec(labels.fao,p.faoZone)}${spec(labels.calibre,'Según disponibilidad')}${spec(labels.quality,p.quality)}${spec(labels.format,p.format)}${spec(labels.packaging,p.packaging)}${spec(labels.availability,p.availability)}</div></div></article>`;
  let products=[];
  const render=()=>{const q=(search.value||'').trim().toLowerCase(); const visible=products.filter(p=>!q || JSON.stringify(p).toLowerCase().includes(q)); count.textContent=`${visible.length} ${visible.length===1?'referencia':'referencias'}`; grid.innerHTML=visible.map(card).join('') || '<p class="seafood-catalog-empty">No hay referencias que coincidan con la búsqueda.</p>';};
  fetch(url,{cache:'no-cache'}).then(r=>{if(!r.ok) throw Error(r.status); return r.json();}).then(d=>{products=d.products||[];render();}).catch(()=>{count.textContent='No disponible'; grid.innerHTML='<p class="seafood-catalog-empty">Catálogo no disponible.</p>';});
  search.addEventListener('input',render);
})();
