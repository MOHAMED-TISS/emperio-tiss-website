(() => {
  'use strict';

  const root = document.documentElement;
  const lang = (root.lang || 'es').slice(0, 2).toLowerCase();
  const grid = document.getElementById('fishCatalogGrid');
  const search = document.getElementById('fishCatalogSearch');
  const count = document.getElementById('fishCatalogCount');
  if (!grid || !search || !count) return;

  const labels = {
    es:{all:'Todos',fresh:'Fresco',frozen:'Congelado',white:'Pez blanco',blue:'Pez azul',special:'Pescados especiales',refs:'referencias',ref:'referencia',none:'No hay referencias que coincidan con la búsqueda.',family:'Familia',type:'Tipo',state:'Estado',origin:'Origen',fao:'Zona FAO',calibre:'Calibre',quality:'Calidad',presentation:'Presentación',packaging:'Embalaje',availability:'Disponibilidad',according:'Según disponibilidad',destination:'Según destino',market:'Según mercado',professional:'Especificación profesional'},
    en:{all:'All',fresh:'Fresh',frozen:'Frozen',white:'White fish',blue:'Blue fish',special:'Special fish',refs:'references',ref:'reference',none:'No references match your search.',family:'Family',type:'Type',state:'Condition',origin:'Origin',fao:'FAO area',calibre:'Calibre',quality:'Quality',presentation:'Presentation',packaging:'Packaging',availability:'Availability',according:'According to availability',destination:'According to destination',market:'According to market',professional:'Professional specification'},
    fr:{all:'Toutes',fresh:'Frais',frozen:'Congelé',white:'Poisson blanc',blue:'Poisson bleu',special:'Poissons spéciaux',refs:'références',ref:'référence',none:'Aucune référence ne correspond à votre recherche.',family:'Famille',type:'Type',state:'État',origin:'Origine',fao:'Zone FAO',calibre:'Calibre',quality:'Qualité',presentation:'Présentation',packaging:'Conditionnement',availability:'Disponibilité',according:'Selon disponibilité',destination:'Selon destination',market:'Selon marché',professional:'Spécification professionnelle'},
    it:{all:'Tutte',fresh:'Fresco',frozen:'Surgelato',white:'Pesce bianco',blue:'Pesce azzurro',special:'Pesci speciali',refs:'referenze',ref:'referenza',none:'Nessuna referenza corrisponde alla ricerca.',family:'Famiglia',type:'Tipo',state:'Stato',origin:'Origine',fao:'Zona FAO',calibre:'Calibro',quality:'Qualità',presentation:'Presentazione',packaging:'Imballaggio',availability:'Disponibilità',according:'Secondo disponibilità',destination:'Secondo destinazione',market:'Secondo mercato',professional:'Specificazione professionale'},
    ar:{all:'الكل',fresh:'طازج',frozen:'مجمد',white:'سمك أبيض',blue:'سمك أزرق',special:'أسماك خاصة',refs:'مراجع',ref:'مرجع',none:'لا توجد مراجع مطابقة للبحث.',family:'الفئة',type:'النوع',state:'الحالة',origin:'المنشأ',fao:'منطقة FAO',calibre:'المقاس',quality:'الجودة',presentation:'التقديم',packaging:'التعبئة',availability:'التوفر',according:'حسب التوفر',destination:'حسب الوجهة',market:'حسب السوق',professional:'مواصفة مهنية'}
  }[lang] || {};

  const names = {
    dorada:{es:'Dorada',en:'Sea bream',fr:'Daurade royale',it:'Orata',ar:'الدنيس'},
    lubina:{es:'Lubina',en:'Sea bass',fr:'Bar',it:'Branzino',ar:'القاروص'},
    'merluza-pijota':{es:'Merluza / Pijota',en:'Hake',fr:'Merlu',it:'Nasello',ar:'النازلي'},
    rape:{es:'Rape',en:'Monkfish',fr:'Baudroie',it:'Rana pescatrice',ar:'سمك الراهب'},
    caballa:{es:'Caballa',en:'Mackerel',fr:'Maquereau',it:'Sgombro',ar:'الماكريل'},
    sardina:{es:'Sardina',en:'European sardine',fr:'Sardine',it:'Sardina',ar:'السردين'},
    boqueron:{es:'Boquerón',en:'European anchovy',fr:'Anchois',it:'Acciuga',ar:'الأنشوفة'},
    salmonete:{es:'Salmonete',en:'Red mullet',fr:'Rouget',it:'Triglia',ar:'البربوني'},
    atun:{es:'Atún rojo',en:'Bluefin tuna',fr:'Thon rouge',it:'Tonno rosso',ar:'التونة زرقاء الزعانف'},
    'pez-espada':{es:'Pez espada',en:'Swordfish',fr:'Espadon',it:'Pesce spada',ar:'أبو سيف'},
    'san-pedro':{es:'San Pedro',en:'John Dory',fr:'Saint-Pierre',it:'San Pietro',ar:'سمك القديس بطرس'},
    denton:{es:'Dentón',en:'Dentex',fr:'Dentex',it:'Dentice',ar:'السنغاري'},
    sargo:{es:'Sargo',en:'White seabream',fr:'Sar commun',it:'Sarago',ar:'السارغو'},
    sole:{es:'Lenguado',en:'Common sole',fr:'Sole commune',it:'Sogliola',ar:'سمك موسى'},
    'pez-limon':{es:'Pez limón / Seriola',en:'Greater amberjack',fr:'Sériole couronnée',it:'Ricciola',ar:'الكنعد'},
    mujol:{es:'Mújol',en:'Mullet',fr:'Mulet',it:'Cefalo',ar:'البوري'},
    pargo:{es:'Pargo',en:'Common seabream / red porgy',fr:'Pagrus commun',it:'Pagro',ar:'المرجان'},
    mero:{es:'Mero',en:'Dusky grouper',fr:'Mérou brun',it:'Cernia bruna',ar:'الهامور'},
    sama:{es:'Sama',en:'Dentex',fr:'Dentex',it:'Dentice',ar:'السما'},
    rascacio:{es:'Rascacio',en:'Scorpionfish',fr:'Rascasse',it:'Scorfano',ar:'سمك العقرب'},
    salmon:{es:'Salmón',en:'Atlantic salmon',fr:'Saumon atlantique',it:'Salmone atlantico',ar:'السلمون الأطلسي'}
  };

  const products = [
    ['dorada','Sparus aurata','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['lubina','Dicentrarchus labrax','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['merluza-pijota','Merluccius merluccius','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico','FAO 27 / FAO 37'],
    ['rape','Lophius spp.','Pez de escama','Blanco / semigraso','Fresco','Atlántico / Mediterráneo','FAO 27 / FAO 37'],
    ['caballa','Scomber colias','Pez de escama','Azul / graso','Fresco / Congelado','Mediterráneo / Atlántico','FAO 27 / FAO 37'],
    ['sardina','Sardina pilchardus','Pez de escama','Azul / graso','Fresco / Congelado','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['boqueron','Engraulis encrasicolus','Pez de escama','Azul / graso','Fresco / Congelado','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['salmonete','Mullus surmuletus','Pez de escama','Azul / graso','Fresco / Congelado','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['atun','Thunnus thynnus','Pez de escama','Azul / graso','Fresco','Mediterráneo / Atlántico','FAO 27 / FAO 37'],
    ['pez-espada','Xiphias gladius','Pescados especiales','Especial','Fresco / Congelado','Mediterráneo / Atlántico','FAO 27 / FAO 37'],
    ['san-pedro','Zeus faber','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico','FAO 27 / FAO 37'],
    ['denton','Dentex dentex','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['sargo','Diplodus sargus','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['sole','Solea solea','Pez de escama','Blanco / semigraso','Fresco / Congelado','Mediterráneo / Atlántico','FAO 27 / FAO 37'],
    ['pez-limon','Seriola dumerili','Pez de escama','Azul / graso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['mujol','Mugil cephalus','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['pargo','Pagrus pagrus','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['mero','Epinephelus marginatus','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['sama','Dentex gibbosus','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['rascacio','Scorpaena scrofa','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['salmon','Salmo salar','Pez de escama','Azul / graso','Fresco / Congelado','Noruega','FAO 27']
  ];

  // Technical values are written in Spanish; Arabic pages translate them in ar/es-normalizer.js.
  const values = {
    'Blanco / semigraso':{en:'White / semi-oily',fr:'Blanc / demi-gras',it:'Bianco / semigrasso'},
    'Azul / graso':{en:'Blue / oily',fr:'Bleu / gras',it:'Azzurro / grasso'},
    'Especial':{en:'Special',fr:'Spécial',it:'Speciale'},
    'Mediterráneo / Atlántico oriental':{en:'Mediterranean / Eastern Atlantic',fr:'Méditerranée / Atlantique Est',it:'Mediterraneo / Atlantico orientale'},
    'Mediterráneo / Atlántico':{en:'Mediterranean / Atlantic',fr:'Méditerranée / Atlantique',it:'Mediterraneo / Atlantico'},
    'Atlántico / Mediterráneo':{en:'Atlantic / Mediterranean',fr:'Atlantique / Méditerranée',it:'Atlantico / Mediterraneo'},
    'Noruega':{en:'Norway',fr:'Norvège',it:'Norvegia',ar:'النرويج'}
  };
  const localize = value => (values[value] || {})[lang] || value;
  const viewImages = {es:'Ver imágenes de',en:'View images of',fr:'Voir les images :',it:'Vedi le immagini di',ar:'عرض صور'}[lang] || 'View images of';

  // The Spanish catalogue is the product authority for every language.
  const allProducts = products.map(([id,scientificName,group,type,condition,origin,faoZone]) => ({
    id, scientificName, group, type, condition, origin, faoZone,
    name: (names[id] || {})[lang] || (names[id] || {}).es || id
  }));

  // Fresh/Frozen only makes sense when the Spanish set carries frozen references.
  if (!allProducts.some(p => p.condition.includes('Congelado'))) {
    document.querySelectorAll('[data-fish-filter="frozen"]').forEach(button => {
      button.hidden = true;
      button.disabled = true;
      button.setAttribute('aria-hidden', 'true');
    });
  }

  const categoryOf = p => p.group === 'Pescados especiales' ? 'special' : p.type.startsWith('Azul') ? 'blue' : 'white';
  const esc = value => String(value ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

  let imageMap = {};
  let condition = 'all';
  let category = 'all';
  let gallery = [];
  let galleryIndex = 0;

  const viewer = document.createElement('div');
  viewer.className = 'fish-gallery';
  viewer.hidden = true;
  viewer.innerHTML = '<div class="fish-gallery__panel"><img class="fish-gallery__image" alt=""><button class="fish-gallery__prev" type="button" aria-label="Previous">‹</button><button class="fish-gallery__next" type="button" aria-label="Next">›</button><button class="fish-gallery__close" type="button" aria-label="Close">×</button><span class="fish-gallery__counter"></span></div>';
  document.body.appendChild(viewer);

  const viewerPanel = viewer.querySelector('.fish-gallery__panel');
  const viewerImage = viewer.querySelector('.fish-gallery__image');
  const viewerCounter = viewer.querySelector('.fish-gallery__counter');
  const viewerPrev = viewer.querySelector('.fish-gallery__prev');
  const viewerNext = viewer.querySelector('.fish-gallery__next');

  const paintViewer = () => {
    if (!gallery.length) return;
    viewerImage.src = gallery[galleryIndex];
    viewerCounter.textContent = `${galleryIndex + 1} / ${gallery.length}`;
    viewerPrev.hidden = gallery.length < 2;
    viewerNext.hidden = gallery.length < 2;
  };

  const openViewer = images => {
    const cleanImages = Array.isArray(images) ? images.filter(Boolean) : [];
    if (!cleanImages.length) return;
    gallery = cleanImages;
    galleryIndex = 0;
    viewer.hidden = false;
    document.body.style.overflow = 'hidden';
    paintViewer();
  };

  const closeViewer = () => {
    viewer.hidden = true;
    gallery = [];
    galleryIndex = 0;
    document.body.style.overflow = '';
    viewerImage.removeAttribute('src');
  };

  viewerPrev.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    if (gallery.length < 2) return;
    galleryIndex = (galleryIndex - 1 + gallery.length) % gallery.length;
    paintViewer();
  });
  viewerNext.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    if (gallery.length < 2) return;
    galleryIndex = (galleryIndex + 1) % gallery.length;
    paintViewer();
  });
  viewer.querySelector('.fish-gallery__close').addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); closeViewer(); });
  viewer.addEventListener('click', event => {
    if (event.target === viewer || event.target === viewerPanel) closeViewer();
  });
  document.addEventListener('keydown', event => {
    if (viewer.hidden) return;
    if (event.key === 'Escape') closeViewer();
    if (event.key === 'ArrowLeft' && gallery.length > 1) viewerPrev.click();
    if (event.key === 'ArrowRight' && gallery.length > 1) viewerNext.click();
  });

  const readImages = media => {
    try { return JSON.parse(media.dataset.images || '[]'); } catch { return []; }
  };

  // Book layout (trial, Spanish page): one species per double-page spread — photo page and technical page.
  if (!document.querySelector('link[data-fish-premium]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '/assets/css/fish-catalog-premium.css?v=20261010-book-2';
    css.dataset.fishPremium = 'true';
    document.head.appendChild(css);
  }
  const book = {
    es:{name:'Catálogo de pescados',sheet:'Ficha técnica',prev:'Página anterior',next:'Página siguiente',index:'Índice de especies'},
    en:{name:'Fish catalogue',sheet:'Technical sheet',prev:'Previous page',next:'Next page',index:'Species index'}
  }[lang] || {name:'Catálogo de pescados',sheet:'Ficha técnica',prev:'Página anterior',next:'Página siguiente',index:'Índice de especies'};

  let referenceMap = {};
  let deck = [];
  let page = 0;
  let turn = '';

  const pad = n => String(n).padStart(2, '0');
  const familyOf = product => { const cat = categoryOf(product); return cat === 'white' ? labels.white : cat === 'blue' ? labels.blue : labels.special; };
  const stateOf = product => [product.condition.includes('Fresco') && labels.fresh, product.condition.includes('Congelado') && labels.frozen].filter(Boolean).join(' · ');
  const rows = pairs => pairs.map(([key,value]) => `<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('');

  const spread = (product, i) => {
    const images = Array.isArray(imageMap[product.id]) ? imageMap[product.id] : [];
    const image = images[0] || '';
    const reference = referenceMap[product.id] || '';
    const number = pad(i + 1);
    const nav = images.length > 1 ? `<button class="et-fish-card__nav et-fish-card__nav--prev" type="button" aria-label="Previous image">‹</button><button class="et-fish-card__nav et-fish-card__nav--next" type="button" aria-label="Next image">›</button><span class="et-fish-card__counter">1 / ${images.length}</span>` : '';
    return `<article class="fish-catalog-card et-spread ${turn}" data-product-id="${esc(product.id)}"${reference ? ` data-product-reference="${esc(reference)}"` : ''}>`
      + `<div class="et-spread__page et-spread__page--photo"><div class="et-fish-card__media" data-images='${esc(JSON.stringify(images))}' data-image-index="0" tabindex="0" role="button" aria-label="${esc(`${viewImages} ${product.name}`)}">${image ? `<img src="${esc(image)}" alt="${esc(product.name)}" draggable="false">` : '<span class="et-spread__placeholder">EMPERIO TISS</span>'}${nav}</div>`
      + `<div class="et-spread__cover"><p class="et-spread__eyebrow">${esc(stateOf(product))}</p><p class="et-spread__display"><span>${number}</span>${esc(product.name)}</p><p class="et-spread__tagline">${esc(localize(product.origin))}</p></div></div>`
      + `<div class="et-spread__page et-spread__page--text"><div class="et-spread__head"><span>EMPERIO TISS</span><span>${esc(book.name)}</span></div>`
      + `<p class="et-spread__kicker">${esc(familyOf(product))}</p><div class="et-fish-card__name et-spread__name" role="heading" aria-level="3">${esc(product.name)}</div><p class="et-spread__latin">${esc(product.scientificName)}</p>`
      + `<dl class="et-spread__facts">${rows([[labels.state, stateOf(product)], [labels.origin, localize(product.origin)], [labels.fao, product.faoZone], [labels.type, localize(product.type)]])}</dl>`
      + `<p class="et-spread__section">${esc(book.sheet)}</p><dl class="et-fish-card__specs et-spread__specs">${rows([[labels.calibre, labels.according], [labels.quality, labels.professional], [labels.presentation, labels.destination], [labels.packaging, labels.market], [labels.availability, labels.according]])}</dl>`
      + `<div class="et-fish-card__sheet et-spread__actions"></div>`
      + `<div class="et-spread__foot">${reference ? `<span class="et-product-reference">REF. ${esc(reference)}</span>` : '<span></span>'}<span>${number} / ${pad(deck.length)}</span></div>`
      + `<button class="et-spread__curl" type="button" aria-label="${esc(book.next)}"></button></div></article>`;
  };

  const arrowIcon = dir => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">${dir < 0 ? '<path d="M19 12H5M11 6l-6 6 6 6"/>' : '<path d="M5 12h14M13 6l6 6-6 6"/>'}</svg>`;

  // full: rebuild the whole book (new filter or search); otherwise only the spread, counter and index state change,
  // so the page never jumps while turning
  const paint = (full = false) => {
    if (!deck.length) { grid.innerHTML = `<p class="fish-catalog__empty">${labels.none}</p>`; return; }
    page = Math.min(Math.max(page, 0), deck.length - 1);
    const stage = grid.querySelector('.et-book__stage');
    if (full || !stage) {
      grid.innerHTML = `<div class="et-book"><div class="et-book__stage">${spread(deck[page], page)}</div>`
        + `<div class="et-book__bar"><button class="et-book__arrow" type="button" data-dir="-1" aria-label="${esc(book.prev)}">${arrowIcon(-1)}</button><span class="et-book__count"></span><button class="et-book__arrow" type="button" data-dir="1" aria-label="${esc(book.next)}">${arrowIcon(1)}</button></div>`
        + `<nav class="et-book__index" aria-label="${esc(book.index)}">${deck.map((p, i) => `<button class="et-book__tab" type="button" data-page="${i}"><span>${pad(i + 1)}</span>${esc(p.name)}</button>`).join('')}</nav></div>`;
    } else {
      stage.innerHTML = spread(deck[page], page);
    }
    grid.querySelector('.et-book__count').innerHTML = `<b>${pad(page + 1)}</b> / ${pad(deck.length)}`;
    grid.querySelectorAll('.et-book__arrow').forEach(arrow => { arrow.disabled = arrow.dataset.dir === '-1' ? page === 0 : page === deck.length - 1; });
    const tabs = grid.querySelector('.et-book__index');
    tabs.querySelectorAll('.et-book__tab').forEach((tab, i) => { tab.classList.toggle('is-active', i === page); if (i === page) tab.setAttribute('aria-current', 'page'); else tab.removeAttribute('aria-current'); });
    const active = tabs.querySelector('.is-active');
    if (active) tabs.scrollTo({left: active.offsetLeft - (tabs.clientWidth - active.offsetWidth) / 2, behavior: full ? 'auto' : 'smooth'});
    turn = '';
  };

  // flipbook turn on wide screens: the leaf turns over the spine while the old page stays underneath until it lands
  let busy = false;
  const flips = () => matchMedia('(min-width: 821px)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const flip = (dir, oldPhoto, oldText) => {
    const stage = grid.querySelector('.et-book__stage');
    const fresh = stage?.querySelector('.et-spread');
    if (!stage || !fresh) return;
    const newPhoto = fresh.querySelector('.et-spread__page--photo').outerHTML;
    const newText = fresh.querySelector('.et-spread__page--text').outerHTML;
    const under = dir > 0 ? `<div class="et-under et-under--left">${oldPhoto}</div>` : `<div class="et-under et-under--right">${oldText}</div>`;
    const leaf = dir > 0
      ? `<div class="et-leaf et-leaf--next"><div class="et-leaf__face et-leaf__front">${oldText}</div><div class="et-leaf__face et-leaf__back">${newPhoto}</div></div>`
      : `<div class="et-leaf et-leaf--prev"><div class="et-leaf__face et-leaf__front">${oldPhoto}</div><div class="et-leaf__face et-leaf__back">${newText}</div></div>`;
    stage.insertAdjacentHTML('beforeend', under + leaf);
    busy = true;
    const done = () => { stage.querySelectorAll('.et-under,.et-leaf').forEach(el => el.remove()); busy = false; };
    stage.querySelector('.et-leaf').addEventListener('animationend', done, {once:true});
    setTimeout(() => { if (busy) done(); }, 1500);
  };

  const go = next => {
    if (busy || next < 0 || next >= deck.length || next === page) return;
    const dir = next > page ? 1 : -1;
    const old = grid.querySelector('.et-spread');
    const oldPhoto = old?.querySelector('.et-spread__page--photo')?.outerHTML;
    const oldText = old?.querySelector('.et-spread__page--text')?.outerHTML;
    const book3d = flips() && oldPhoto && oldText;
    turn = book3d ? '' : (dir > 0 ? 'is-turn-next' : 'is-turn-prev');
    page = next;
    paint();
    if (book3d) flip(dir, oldPhoto, oldText);
  };

  const render = () => {
    const query = String(search.value || '').trim().toLowerCase();
    deck = allProducts.filter(product => {
      const cat = categoryOf(product);
      const inCondition = condition === 'all' || (condition === 'fresh' ? product.condition.includes('Fresco') : product.condition.includes('Congelado'));
      const inCategory = category === 'all' || cat === category;
      const haystack = [product.name,product.id,product.scientificName,product.group,product.type,product.origin,product.faoZone].join(' ').toLowerCase();
      return inCondition && inCategory && (!query || haystack.includes(query));
    });
    count.textContent = `${deck.length} ${deck.length === 1 ? labels.ref : labels.refs}`;
    page = 0;
    paint(true);
  };

  grid.addEventListener('click', event => {
    const arrow = event.target.closest('.et-book__arrow');
    if (arrow) { go(page + Number(arrow.dataset.dir || 0)); return; }
    if (event.target.closest('.et-spread__curl')) { go(page + 1); return; }
    const tab = event.target.closest('.et-book__tab');
    if (tab) { go(Number(tab.dataset.page)); return; }
    const nav = event.target.closest('.et-fish-card__nav');
    if (nav) {
      const media = nav.closest('.et-fish-card__media');
      const images = readImages(media);
      const image = media.querySelector('img');
      if (!images.length || !image) return;
      const current = Number.parseInt(media.dataset.imageIndex || '0', 10) || 0;
      const next = (current + (nav.classList.contains('et-fish-card__nav--next') ? 1 : -1) + images.length) % images.length;
      media.dataset.imageIndex = String(next);
      image.src = images[next];
      const counter = media.querySelector('.et-fish-card__counter');
      if (counter) counter.textContent = `${next + 1} / ${images.length}`;
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const media = event.target.closest('.et-fish-card__media');
    if (!media) return;
    const images = readImages(media);
    if (!images.length) return;
    event.preventDefault();
    openViewer(images);
  }, true);

  grid.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      if (!viewer.hidden || event.target.closest('input')) return;
      event.preventDefault();
      go(page + (event.key === 'ArrowRight' ? 1 : -1));
      return;
    }
    if (!['Enter',' '].includes(event.key)) return;
    const media = event.target.closest('.et-fish-card__media');
    if (!media) return;
    const images = readImages(media);
    if (!images.length) return;
    event.preventDefault();
    openViewer(images);
  });

  // swipe between spreads on touch screens
  let touchX = null;
  grid.addEventListener('touchstart', event => { touchX = event.touches[0]?.clientX ?? null; }, {passive:true});
  grid.addEventListener('touchend', event => {
    if (touchX === null || !event.target.closest('.et-book__stage')) { touchX = null; return; }
    const dx = (event.changedTouches[0]?.clientX ?? touchX) - touchX;
    touchX = null;
    if (Math.abs(dx) > 60) go(page + (dx < 0 ? 1 : -1));
  }, {passive:true});

  document.querySelectorAll('[data-fish-filter]').forEach(button => button.addEventListener('click', () => {
    if (button.hidden || button.disabled) return;
    condition = button.dataset.fishFilter || 'all';
    document.querySelectorAll('[data-fish-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    render();
  }));

  document.querySelectorAll('[data-fish-category]').forEach(button => button.addEventListener('click', () => {
    category = button.dataset.fishCategory || 'all';
    document.querySelectorAll('[data-fish-category]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    render();
  }));

  search.addEventListener('input', render);

  const json = url => fetch(url, {cache:'no-cache'}).then(response => response.ok ? response.json() : {}).catch(() => ({}));
  Promise.all([json('/assets/data/product-images.json'), json('/assets/data/catalogue-market-priority.json'), json('/assets/data/product-references.json')])
    .then(([images, priority, references]) => {
      imageMap = images || {};
      // catalogue ids may differ from registry ids (e.g. sole → lenguado)
      const registry = references?.references || {}, aliases = references?.aliases || {};
      referenceMap = Object.fromEntries(allProducts.map(p => [p.id, registry[p.id] || registry[aliases[p.id]] || '']));
      // products follow consumption in this language's market
      const order = priority?.priority?.['seafood/fish']?.[lang] || [];
      const rank = id => { const index = order.indexOf(id); return index < 0 ? order.length : index; };
      allProducts.sort((a, b) => rank(a.id) - rank(b.id));
      render();
    });
})();
