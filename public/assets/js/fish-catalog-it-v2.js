(() => {
  'use strict';
  const grid = document.getElementById('fishCatalogGrid');
  const search = document.getElementById('fishCatalogSearch');
  const count = document.getElementById('fishCatalogCount');
  if (!grid || !search || !count) return;

  const names = {
    'salmon':'Salmone','dorada':'Orata','lubina':'Spigola','merluza-pijota':'Nasello / Merluzzo','mujol':'Cefalo','rape':'Rana pescatrice','san-pedro':'San Pietro','mero-amarillo':'Cernia gialla','pargo':'Dentice tropicale','denton':'Dentice','sama':'Sama','sargo':'Sarago','rascacio':'Scorfano','caballa':'Sgombro','salmonete':'Triglia','atun':'Tonno','pez-limon':'Ricciola','boqueron':'Acciuga','pez-sable':'Pesce sciabola','pez-espada':'Pesce spada'
  };
  const labels = {all:'Tutte',fresh:'Fresco',frozen:'Surgelato',white:'Pesce bianco',blue:'Pesce azzurro',special:'Pesci speciali',refs:'referenze',ref:'referenza',none:'Nessuna referenza corrisponde alla ricerca.',previous:'Precedente',next:'Successiva',close:'Chiudi'};
  const categoryNames = {white:labels.white,blue:labels.blue,special:labels.special};
  let products = [];
  let imageMap = {};
  let condition = 'all';
  let category = 'all';
  let gallery = [];
  let galleryIndex = 0;

  const esc = v => String(v ?? '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

  const style = document.createElement('style');
  style.textContent = `html[lang="it"] .fish-catalog,html[lang="it"] .fish-emblematic{font-family:"DM Sans",Arial,sans-serif}html[lang="it"] .fish-catalog h2,html[lang="it"] .fish-catalog-card__title{font-family:"Cormorant Garamond",Georgia,serif;font-weight:400}.it-fish-viewer{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:rgba(7,16,22,.94);padding:28px}.it-fish-viewer[hidden]{display:none}.it-fish-viewer__panel{position:relative;width:min(92vw,1200px);height:min(88vh,850px);display:flex;align-items:center;justify-content:center}.it-fish-viewer img{max-width:100%;max-height:100%;object-fit:contain;user-select:none;-webkit-user-drag:none}.it-fish-viewer button{position:absolute;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.12);color:#fff}.it-fish-viewer__prev{left:10px}.it-fish-viewer__next{right:10px}.it-fish-viewer__close{right:10px;top:10px}.it-fish-viewer__counter{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);color:#fff;font:500 12px/1 "DM Sans",sans-serif;letter-spacing:.08em}`;
  document.head.appendChild(style);

  const viewer = document.createElement('div');
  viewer.className = 'it-fish-viewer';
  viewer.hidden = true;
  viewer.innerHTML = '<div class="it-fish-viewer__panel"><img draggable="false" alt=""><button class="it-fish-viewer__prev" type="button">‹</button><button class="it-fish-viewer__next" type="button">›</button><button class="it-fish-viewer__close" type="button">×</button><span class="it-fish-viewer__counter"></span></div>';
  document.body.appendChild(viewer);
  const viewerImg = viewer.querySelector('img');
  const viewerCounter = viewer.querySelector('.it-fish-viewer__counter');
  const closeViewer = () => { viewer.hidden = true; document.body.style.overflow = ''; };
  const showViewer = step => { if (!gallery.length) return; galleryIndex = (galleryIndex + step + gallery.length) % gallery.length; viewerImg.src = gallery[galleryIndex]; viewerCounter.textContent = `${galleryIndex + 1} / ${gallery.length}`; };
  const openViewer = images => { if (!images.length) return; gallery = images.slice(); galleryIndex = 0; viewer.hidden = false; document.body.style.overflow = 'hidden'; viewerImg.src = gallery[0]; viewerCounter.textContent = `1 / ${gallery.length}`; viewer.querySelector('.it-fish-viewer__prev').hidden = gallery.length < 2; viewer.querySelector('.it-fish-viewer__next').hidden = gallery.length < 2; };
  viewer.querySelector('.it-fish-viewer__prev').onclick = () => showViewer(-1);
  viewer.querySelector('.it-fish-viewer__next').onclick = () => showViewer(1);
  viewer.querySelector('.it-fish-viewer__close').onclick = closeViewer;
  viewer.onclick = e => { if (e.target === viewer) closeViewer(); };
  document.addEventListener('keydown', e => { if (viewer.hidden) return; if (e.key === 'Escape') closeViewer(); if (e.key === 'ArrowLeft') showViewer(-1); if (e.key === 'ArrowRight') showViewer(1); });

  const render = () => {
    const q = search.value.trim().toLowerCase();
    const visible = products.filter(p => {
      const conditionOk = condition === 'all' || p.condition.includes(condition);
      const catOk = category === 'all' || (category === 'white' ? p.tags?.includes('blanco') : category === 'blue' ? p.tags?.includes('azul') : p.group === 'Pescados especiales');
      const hay = [p.commercialName,p.scientificName,p.group,p.type,(p.origin||[]).join(' '),(p.faoZone||[]).join(' ')].join(' ').toLowerCase();
      return conditionOk && catOk && (!q || hay.includes(q));
    });
    count.textContent = `${visible.length} ${visible.length === 1 ? labels.ref : labels.refs}`;
    grid.innerHTML = visible.map(p => {
      const images = imageMap[p.id] || [];
      return `<article class="fish-catalog-card" data-product-id="${esc(p.id)}"><div class="fish-catalog-card__media" data-images='${esc(JSON.stringify(images))}'>${images[0] ? `<img class="fish-card-image" draggable="false" src="${esc(images[0])}" alt="${esc(names[p.id] || p.commercialName)}" loading="lazy">` : '<span>EMPERIO TISS</span>'}${images.length > 1 ? `<span class="fish-card-counter">1 / ${images.length}</span>` : ''}</div><div class="fish-catalog-card__body"><p class="fish-catalog-card__meta">${esc(categoryNames[p.tags?.includes('blanco')?'white':p.tags?.includes('azul')?'blue':'special'])}</p><h3 class="fish-catalog-card__title">${esc(names[p.id] || p.commercialName)}</h3><p class="fish-catalog-card__scientific"><em>${esc(p.scientificName)}</em></p><div class="fish-catalog-card__details"><div class="fish-catalog-card__detail"><span>Stato</span><strong>${esc((p.condition||[]).map(x=>x==='fresh'?labels.fresh:labels.frozen).join(' / '))}</strong></div><div class="fish-catalog-card__detail"><span>Origine</span><strong>${esc((p.origin||[]).join(' / '))}</strong></div><div class="fish-catalog-card__detail"><span>Zona FAO</span><strong>${esc((p.faoZone||[]).join(' / '))}</strong></div><div class="fish-catalog-card__detail"><span>Calibro</span><strong>${esc((p.calibre||[]).join(' / '))}</strong></div><div class="fish-catalog-card__detail"><span>Qualità</span><strong>${esc((p.quality||[]).join(' / '))}</strong></div><div class="fish-catalog-card__detail"><span>Presentazione</span><strong>${esc((p.format||[]).join(' / '))}</strong></div><div class="fish-catalog-card__detail"><span>Imballaggio</span><strong>${esc((p.packaging||[]).join(' / '))}</strong></div><div class="fish-catalog-card__detail"><span>Disponibilità</span><strong>${esc((p.availability||[]).join(' / '))}</strong></div></div></div></article>`;
    }).join('') || `<p class="fish-catalog__empty">${labels.none}</p>`;
    grid.querySelectorAll('.fish-catalog-card__media').forEach(media => { const images = JSON.parse(media.dataset.images || '[]'); if (!images.length) return; media.onclick = e => { if (e.target.closest('button')) return; openViewer(images); }; media.querySelector('.fish-card-counter')?.setAttribute('aria-hidden','true'); });
  };

  document.querySelectorAll('[data-fish-filter]').forEach(b => b.addEventListener('click',()=>{condition=b.dataset.fishFilter||'all';document.querySelectorAll('[data-fish-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}));
  document.querySelectorAll('[data-fish-category]').forEach(b => b.addEventListener('click',()=>{category=b.dataset.fishCategory||'all';document.querySelectorAll('[data-fish-category]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}));
  search.addEventListener('input',render);

  Promise.all([
    fetch('/assets/data/fish-catalog-es.json',{cache:'no-cache'}).then(r=>r.json()),
    fetch('/assets/data/product-images.json',{cache:'no-cache'}).then(r=>r.ok?r.json():{})
  ]).then(([catalog,images])=>{ products=(catalog.products||[]).filter(p=>p.id!=='bottarga'); imageMap=images||{}; render(); }).catch(()=>{products=[];imageMap={};render();});
})();
