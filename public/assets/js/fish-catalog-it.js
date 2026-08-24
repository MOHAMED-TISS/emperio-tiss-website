(() => {
  'use strict';
  const grid = document.getElementById('fishCatalogGrid');
  const search = document.getElementById('fishCatalogSearch');
  const count = document.getElementById('fishCatalogCount');
  if (!grid || !search || !count) return;

  const products = [
    ['dorada','Orata','Sparus aurata','white','Pesce di scaglia','Bianco / semigrasso','Fresco','Mediterraneo / secondo disponibilità','FAO 37'],
    ['lubina','Spigola','Dicentrarchus labrax','white','Pesce di scaglia','Bianco / semigrasso','Fresco','Mediterraneo / Atlantico secondo disponibilità','FAO 27 / FAO 37'],
    ['merluza-pijota','Nasello / Merluzzo','Merluccius spp.','white','Pesce di scaglia','Bianco / semigrasso','Fresco','Secondo programma di fornitura','Secondo origine'],
    ['mujol','Cefalo','Mugil cephalus','white','Pesce di scaglia','Bianco / semigrasso','Fresco','Mediterraneo / secondo disponibilità','FAO 37'],
    ['rape','Rana pescatrice','Lophius spp.','white','Pesce di scaglia','Bianco / semigrasso','Fresco','Atlantico / Mediterraneo secondo disponibilità','FAO 27 / FAO 37'],
    ['san-pedro','San Pietro','Zeus faber','white','Pesce di scaglia','Bianco / semigrasso','Fresco','Mediterraneo / Atlantico secondo disponibilità','FAO 27 / FAO 37'],
    ['mero-amarillo','Cernia gialla','Epinephelus spp.','white','Pesce di scaglia','Bianco / semigrasso','Fresco','Secondo origine disponibile','Secondo origine'],
    ['pargo','Dentice tropicale','Lutjanus spp.','white','Pesce di scaglia','Bianco / semigrasso','Fresco','Secondo programma di fornitura','Secondo origine'],
    ['denton','Dentice','Dentex dentex','white','Pesce di scaglia','Bianco / semigrasso','Fresco','Mediterraneo / secondo disponibilità','FAO 37'],
    ['sama','Sama','Dentex spp.','white','Pesce di scaglia','Bianco / semigrasso','Fresco','Mediterraneo / secondo disponibilità','FAO 37'],
    ['sargo','Sarago','Diplodus spp.','white','Pesce di scaglia','Bianco / semigrasso','Fresco','Mediterraneo / Atlantico secondo disponibilità','FAO 27 / FAO 37'],
    ['rascacio','Scorfano','Scorpaena spp.','white','Pesce di scaglia','Bianco / semigrasso','Fresco','Mediterraneo / secondo disponibilità','FAO 37'],
    ['caballa','Sgombro','Scomber spp.','blue','Pesce di scaglia','Azzurro / grasso','Fresco / Surgelato','Atlantico / Mediterraneo secondo disponibilità','FAO 27 / FAO 37'],
    ['salmonete','Triglia','Mullus spp.','blue','Pesce di scaglia','Azzurro / grasso','Fresco','Mediterraneo / Atlantico secondo disponibilità','FAO 27 / FAO 37'],
    ['atun','Tonno','Thunnus spp.','blue','Pesce di scaglia','Azzurro / grasso','Fresco','Secondo specie e programma di fornitura','Secondo origine'],
    ['salmon','Salmone','Salmo salar','blue','Pesce di scaglia','Azzurro / grasso','Fresco / Surgelato','Norvegia','FAO 27'],
    ['pez-limon','Ricciola','Seriola dumerili','blue','Pesce di scaglia','Azzurro / grasso','Fresco','Mediterraneo / secondo disponibilità','FAO 37'],
    ['boqueron','Acciuga','Engraulis encrasicolus','blue','Pesce di scaglia','Azzurro / grasso','Fresco','Mediterraneo / Atlantico secondo disponibilità','FAO 27 / FAO 37'],
    ['pez-sable','Pesce sciabola','Trichiurus spp.','special','Pesci speciali','Speciale','Fresco','Secondo programma di fornitura','Secondo origine'],
    ['pez-espada','Pesce spada','Xiphias gladius','special','Pesci speciali','Speciale','Fresco','Secondo programma di fornitura','Secondo origine'],
    ['bottarga','Bottarga congelata','Secondo specifica del prodotto','special','Pescados speciali','Speciale','Surgelato','Secondo origine','Secondo zona FAO']
  ].map(([id,name,scientific,category,family,type,state,origin,fao]) => ({id,name,scientific,category,family,type,state,origin,fao}));

  const labels = { all:'Tutte', fresh:'Fresco', frozen:'Surgelato', allCats:'Tutte le categorie', white:'Pesce bianco', blue:'Pesce azzurro', special:'Pesci speciali', refs:'referenze', ref:'referenza', none:'Nessuna referenza corrisponde alla ricerca.', previous:'Precedente', next:'Successiva', close:'Chiudi' };
  let activeCondition = 'all';
  let activeCategory = 'all';
  let imageMap = {};
  let gallery = [];
  let galleryIndex = 0;

  const esc = value => String(value ?? '').replace(/[&<>\"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[char]));
  const categoryName = key => ({white:labels.white,blue:labels.blue,special:labels.special}[key] || key);

  const style = document.createElement('style');
  style.textContent = `
    html[lang="it"] .fish-catalog,.fish-emblematic{font-family:var(--et-sans,"DM Sans",Arial,sans-serif)}
    html[lang="it"] .fish-catalog h2,html[lang="it"] .fish-catalog-card__title{font-family:var(--et-serif,"Cormorant Garamond",Georgia,serif)!important;font-weight:400!important}
    html[lang="it"] .fish-catalog-card{background:#fff!important;color:#102331!important;border:1px solid rgba(16,35,49,.08)!important;box-shadow:0 8px 30px rgba(16,35,49,.08)!important;border-radius:14px!important;overflow:hidden!important}
    html[lang="it"] .fish-catalog-card__body{background:#fff!important;color:#102331!important;padding:1.15rem 1.15rem 1.3rem!important}
    html[lang="it"] .fish-catalog-card__meta{font:600 .58rem/1.25 var(--et-sans,"DM Sans",Arial,sans-serif)!important;letter-spacing:.12em!important;text-transform:uppercase!important;color:#8a683c!important}
    html[lang="it"] .fish-catalog-card__scientific,html[lang="it"] .fish-catalog-card__detail{font-family:var(--et-sans,"DM Sans",Arial,sans-serif)!important}
    html[lang="it"] .fish-catalog-card__media{position:relative!important;cursor:zoom-in!important;overflow:hidden!important;background:#edf0eb!important;aspect-ratio:4/3!important}
    html[lang="it"] .fish-catalog-card__media img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important;transition:transform .35s ease,opacity .2s ease!important}
    html[lang="it"] .fish-catalog-card__media:hover img{transform:scale(1.02)!important}
    html[lang="it"] .fish-card-nav{position:absolute;top:50%;transform:translateY(-50%);z-index:2;width:34px;height:34px;border:1px solid rgba(255,255,255,.28);border-radius:50%;background:rgba(10,24,31,.42);backdrop-filter:blur(6px);color:#fff;font-size:22px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s ease}
    html[lang="it"] .fish-catalog-card__media:hover .fish-card-nav{opacity:1}
    html[lang="it"] .fish-card-nav--prev{left:12px} html[lang="it"] .fish-card-nav--next{right:12px}
    html[lang="it"] .fish-card-counter{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);z-index:2;padding:4px 9px;border-radius:999px;background:rgba(10,24,31,.46);backdrop-filter:blur(5px);color:#fff;font:500 11px/1.2 "DM Sans",sans-serif;pointer-events:none}
    .it-fish-gallery{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:30px;background:rgba(7,16,22,.94)}
    .it-fish-gallery[hidden]{display:none}
    .it-fish-gallery__panel{position:relative;width:min(92vw,1200px);height:min(88vh,850px);display:flex;align-items:center;justify-content:center}
    .it-fish-gallery__image{max-width:100%;max-height:100%;object-fit:contain;user-select:none;-webkit-user-drag:none}
    .it-fish-gallery button{position:absolute;border:0;background:rgba(255,255,255,.13);color:#fff;width:48px;height:48px;border-radius:50%;font-size:30px;cursor:pointer}
    .it-fish-gallery__prev{left:8px}.it-fish-gallery__next{right:8px}.it-fish-gallery__close{right:8px;top:8px}
    .it-fish-gallery__counter{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);color:#fff;font:500 13px/1 "DM Sans",sans-serif;letter-spacing:.08em}
  `;
  document.head.appendChild(style);

  const lightbox = document.createElement('div');
  lightbox.className = 'it-fish-gallery';
  lightbox.hidden = true;
  lightbox.innerHTML = `<div class="it-fish-gallery__panel"><img class="it-fish-gallery__image" alt=""><button class="it-fish-gallery__prev" type="button" aria-label="${labels.previous}">‹</button><button class="it-fish-gallery__next" type="button" aria-label="${labels.next}">›</button><button class="it-fish-gallery__close" type="button" aria-label="${labels.close}">×</button><span class="it-fish-gallery__counter"></span></div>`;
  document.body.appendChild(lightbox);
  const lbImage = lightbox.querySelector('.it-fish-gallery__image');
  const lbPrev = lightbox.querySelector('.it-fish-gallery__prev');
  const lbNext = lightbox.querySelector('.it-fish-gallery__next');
  const lbClose = lightbox.querySelector('.it-fish-gallery__close');
  const lbCounter = lightbox.querySelector('.it-fish-gallery__counter');

  const closeGallery = () => { lightbox.hidden = true; document.body.style.overflow = ''; lbImage.removeAttribute('src'); };
  const updateGallery = () => { lbImage.src = gallery[galleryIndex]; lbCounter.textContent = `${galleryIndex + 1} / ${gallery.length}`; const multi = gallery.length > 1; lbPrev.hidden = !multi; lbNext.hidden = !multi; };
  const openGallery = images => { if (!images.length) return; gallery = images.slice(); galleryIndex = 0; lightbox.hidden = false; document.body.style.overflow = 'hidden'; updateGallery(); };
  const moveGallery = step => { if (gallery.length < 2) return; galleryIndex = (galleryIndex + step + gallery.length) % gallery.length; updateGallery(); };
  lbPrev.onclick = () => moveGallery(-1); lbNext.onclick = () => moveGallery(1); lbClose.onclick = closeGallery;
  lightbox.onclick = event => { if (event.target === lightbox) closeGallery(); };
  document.addEventListener('keydown', event => { if (lightbox.hidden) return; if (event.key === 'Escape') closeGallery(); if (event.key === 'ArrowLeft') moveGallery(-1); if (event.key === 'ArrowRight') moveGallery(1); });

  const cardHtml = product => {
    const images = imageMap[product.id] || [];
    const image = images[0] || '';
    return `<article class="fish-catalog-card" data-product-id="${esc(product.id)}"><div class="fish-catalog-card__media" data-images='${esc(JSON.stringify(images))}' aria-label="${esc(product.name)}">${image ? `<img class="fish-card-image" src="${esc(image)}" alt="${esc(product.name)}" loading="lazy" draggable="false">` : '<span class="fish-catalog-card__placeholder">EMPERIO TISS</span>'}${images.length > 1 ? `<button class="fish-card-nav fish-card-nav--prev" type="button" aria-label="${labels.previous}">‹</button><button class="fish-card-nav fish-card-nav--next" type="button" aria-label="${labels.next}">›</button><span class="fish-card-counter">1 / ${images.length}</span>` : ''}</div><div class="fish-catalog-card__body"><p class="fish-catalog-card__meta">${esc(categoryName(product.category))}</p><h3 class="fish-catalog-card__title">${esc(product.name)}</h3><p class="fish-catalog-card__scientific"><em>${esc(product.scientific)}</em></p><div class="fish-catalog-card__details"><div class="fish-catalog-card__detail"><span>Famiglia</span><strong>${esc(product.family)}</strong></div><div class="fish-catalog-card__detail"><span>Tipo</span><strong>${esc(product.type)}</strong></div><div class="fish-catalog-card__detail"><span>Stato</span><strong>${esc(product.state)}</strong></div><div class="fish-catalog-card__detail"><span>Origine</span><strong>${esc(product.origin)}</strong></div><div class="fish-catalog-card__detail"><span>Zona FAO</span><strong>${esc(product.fao)}</strong></div><div class="fish-catalog-card__detail"><span>Calibro</span><strong>Secondo disponibilità</strong></div><div class="fish-catalog-card__detail"><span>Qualità</span><strong>Specifica professionale</strong></div><div class="fish-catalog-card__detail"><span>Presentazione</span><strong>Secondo destinazione</strong></div><div class="fish-catalog-card__detail"><span>Imballaggio</span><strong>Secondo mercato</strong></div><div class="fish-catalog-card__detail"><span>Disponibilità</span><strong>Secondo disponibilità</strong></div></div></div></article>`;
  };

  const bindCards = () => {
    grid.querySelectorAll('.fish-catalog-card__media').forEach(media => {
      const images = JSON.parse(media.dataset.images || '[]');
      if (!images.length) return;
      let current = 0;
      const image = media.querySelector('.fish-card-image');
      const counter = media.querySelector('.fish-card-counter');
      const show = nextIndex => { current = (nextIndex + images.length) % images.length; if (image) { image.style.opacity = '.25'; window.setTimeout(() => { image.src = images[current]; image.style.opacity = '1'; }, 90); } if (counter) counter.textContent = `${current + 1} / ${images.length}`; };
      media.querySelector('.fish-card-nav--prev')?.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); show(current - 1); });
      media.querySelector('.fish-card-nav--next')?.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); show(current + 1); });
      media.addEventListener('click', event => { if (event.target.closest('.fish-card-nav')) return; openGallery(images); });
    });
  };

  const render = () => {
    const q = String(search.value || '').trim().toLowerCase();
    const visible = products.filter(product => {
      const conditionOk = activeCondition === 'all' || product.state.toLowerCase().includes(activeCondition === 'fresh' ? 'fresco' : 'surgelato');
      const categoryOk = activeCategory === 'all' || product.category === activeCategory;
      const hay = [product.name, product.scientific, product.family, product.type, product.state, product.origin, product.fao].join(' ').toLowerCase();
      return conditionOk && categoryOk && (!q || hay.includes(q));
    });
    count.textContent = `${visible.length} ${visible.length === 1 ? labels.ref : labels.refs}`;
    grid.innerHTML = visible.length ? visible.map(cardHtml).join('') : `<p class="fish-catalog__empty">${labels.none}</p>`;
    bindCards();
  };

  const conditionFilters = Array.from(document.querySelectorAll('.fish-catalog__filters--condition [data-fish-filter]'));
  const categoryFilters = Array.from(document.querySelectorAll('.fish-catalog__filters--category [data-fish-category]'));
  const setPressed = (buttons, attr, value) => buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset[attr] === value)));
  conditionFilters.forEach(button => button.addEventListener('click', event => { event.preventDefault(); activeCondition = button.dataset.fishFilter || 'all'; setPressed(conditionFilters, 'fishFilter', activeCondition); render(); }));
  categoryFilters.forEach(button => button.addEventListener('click', event => { event.preventDefault(); activeCategory = button.dataset.fishCategory || 'all'; setPressed(categoryFilters, 'fishCategory', activeCategory); render(); }));
  search.addEventListener('input', render);

  fetch('/assets/data/product-images.json',{cache:'no-cache'}).then(response => response.ok ? response.json() : {}).then(data => { imageMap = data || {}; render(); }).catch(() => render());
})();