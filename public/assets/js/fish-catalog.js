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
    bacalao:{es:'Bacalao',en:'Atlantic cod',fr:'Cabillaud',it:'Merluzzo',ar:'سمك القد الأطلسي'},
    abadejo:{es:'Abadejo / Pollock',en:'Saithe',fr:'Lieu noir',it:'Carbonaro',ar:'سايث / بولوك الأطلسي'},
    eglefino:{es:'Eglefino',en:'Haddock',fr:'Églefin',it:'Eglefino',ar:'الإيغليفين'},
    'pollock-alaska':{es:'Abadejo de Alaska',en:'Alaska pollock',fr:'Colin d’Alaska',it:'Pollock d’Alaska',ar:'بولوك ألاسكا'},
    bacaladilla:{es:'Bacaladilla',en:'Blue whiting',fr:'Merlan bleu',it:'Potassolo',ar:'السمك الأزرق الصغير'},
    'caballa-atlantica':{es:'Caballa atlántica',en:'Atlantic mackerel',fr:'Maquereau de l’Atlantique',it:'Sgombro atlantico',ar:'الماكريل الأطلسي'},
    jurel:{es:'Jurel atlántico',en:'Atlantic horse mackerel',fr:'Chinchard d’Europe',it:'Suro',ar:'سمك الحصان الأطلسي'},
    'merluza-argentina':{es:'Merluza argentina',en:'Argentine hake',fr:'Merlu austral / argentine',it:'Nasello argentino',ar:'النازلي الأرجنتيني'},
    'merluza-cabo':{es:'Merluza del Cabo',en:'Cape hake',fr:'Merlu du Cap',it:'Nasello del Capo',ar:'نازلي الرأس'},
    'pez-rojo':{es:'Pez rojo',en:'Redfish',fr:'Poisson rouge',it:'Pesce rosso',ar:'سمك أحمر'},
    salmon:{es:'Salmón',en:'Atlantic salmon',fr:'Saumon atlantique',it:'Salmone atlantico',ar:'السلمون الأطلسي'},
    'atun-amarillo':{es:'Atún de aleta amarilla',en:'Yellowfin tuna',fr:'Thon albacore jaune',it:'Tonno a pinne gialle',ar:'التونة صفراء الزعانف'},
    'atun-blanco':{es:'Atún blanco',en:'Albacore tuna',fr:'Thon germon',it:'Alalunga',ar:'التونة البيضاء'},
    'pez-espada-congelado':{es:'Pez espada congelado',en:'Frozen swordfish',fr:'Espadon congelé',it:'Pesce spada congelato',ar:'أبو سيف مجمد'}
  };

  const products = [
    ['dorada','Sparus aurata','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['lubina','Dicentrarchus labrax','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['merluza-pijota','Merluccius merluccius','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico','FAO 27 / FAO 37'],
    ['rape','Lophius spp.','Pez de escama','Blanco / semigraso','Fresco','Atlántico / Mediterráneo','FAO 27 / FAO 37'],
    ['caballa','Scomber colias','Pez de escama','Azul / graso','Fresco','Mediterráneo / Atlántico','FAO 27 / FAO 37'],
    ['sardina','Sardina pilchardus','Pez de escama','Azul / graso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['boqueron','Engraulis encrasicolus','Pez de escama','Azul / graso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['salmonete','Mullus surmuletus','Pez de escama','Azul / graso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['atun','Thunnus thynnus','Pez de escama','Azul / graso','Fresco','Mediterráneo / Atlántico','FAO 27 / FAO 37'],
    ['pez-espada','Xiphias gladius','Pescados especiales','Especial','Fresco','Mediterráneo / Atlántico','FAO 27 / FAO 37'],
    ['san-pedro','Zeus faber','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico','FAO 27 / FAO 37'],
    ['denton','Dentex dentex','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['sargo','Diplodus sargus','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['sole','Solea solea','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico','FAO 27 / FAO 37'],
    ['pez-limon','Seriola dumerili','Pez de escama','Azul / graso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['mujol','Mugil cephalus','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['pargo','Pagrus pagrus','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['mero','Epinephelus marginatus','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['sama','Dentex gibbosus','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37'],
    ['rascacio','Scorpaena scrofa','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico oriental','FAO 27 / FAO 37']
  ];

  const frozenArProducts = [
    ['bacalao','Gadus morhua','Pez de escama','Blanco / semigraso','Congelado','Atlántico / abastecimiento español','FAO 21 / FAO 27'],
    ['abadejo','Pollachius virens','Pez de escama','Blanco / semigraso','Congelado','Atlántico / abastecimiento español','FAO 27'],
    ['eglefino','Melanogrammus aeglefinus','Pez de escama','Blanco / semigraso','Congelado','Atlántico / abastecimiento español','FAO 27'],
    ['pollock-alaska','Gadus chalcogrammus','Pez de escama','Blanco / semigraso','Congelado','Abastecimiento internacional vía España','FAO 61 / FAO 67'],
    ['bacaladilla','Micromesistius poutassou','Pez de escama','Blanco / semigraso','Congelado','Atlántico / abastecimiento español','FAO 27'],
    ['caballa-atlantica','Scomber scombrus','Pez de escama','Azul / graso','Congelado','Atlántico / abastecimiento español','FAO 27'],
    ['jurel','Trachurus trachurus','Pez de escama','Azul / graso','Congelado','Atlántico / abastecimiento español','FAO 27'],
    ['merluza-argentina','Merluccius hubbsi','Pez de escama','Blanco / semigraso','Congelado','Abastecimiento internacional vía España','FAO 41'],
    ['merluza-cabo','Merluccius capensis / Merluccius paradoxus','Pez de escama','Blanco / semigraso','Congelado','Abastecimiento internacional vía España','FAO 47'],
    ['pez-rojo','Sebastes spp.','Pez de escama','Blanco / semigraso','Congelado','Atlántico / abastecimiento español','FAO 21 / FAO 27'],
    ['salmon','Salmo salar','Pez de escama','Azul / graso','Congelado','Abastecimiento internacional vía España','FAO 27'],
    ['atun-amarillo','Thunnus albacares','Pez de escama','Azul / graso','Congelado','Abastecimiento internacional vía España','FAO 34 / FAO 37 / FAO 51'],
    ['atun-blanco','Thunnus alalunga','Pez de escama','Azul / graso','Congelado','Atlántico / abastecimiento español','FAO 27'],
    ['pez-espada-congelado','Xiphias gladius','Pescados especiales','Especial','Congelado','Atlántico / Mediterráneo','FAO 27 / FAO 37']
  ];

  const allProducts = [...products, ...(lang === 'ar' ? frozenArProducts : [])].map(([id,scientificName,group,type,condition,origin,faoZone]) => ({
    id, scientificName, group, type, condition, origin, faoZone,
    name: (names[id] || {})[lang] || (names[id] || {}).es || id
  }));

  const categoryOf = p => p.group === 'Pescados especiales' ? 'special' : p.type.startsWith('Azul') ? 'blue' : 'white';
  const esc = value => String(value ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

  if (lang !== 'ar') {
    document.querySelectorAll('[data-fish-filter="frozen"]').forEach(button => {
      button.hidden = true;
      button.disabled = true;
      button.setAttribute('aria-hidden', 'true');
    });
  }

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

  const details = product => {
    const cat = categoryOf(product);
    const vals = [
      [labels.family, cat === 'white' ? labels.white : cat === 'blue' ? labels.blue : labels.special],
      [labels.type, product.type],
      [labels.state, product.condition === 'Congelado' ? labels.frozen : labels.fresh],
      [labels.origin, product.origin],
      [labels.fao, product.faoZone],
      [labels.calibre, labels.according],
      [labels.quality, labels.professional],
      [labels.presentation, labels.destination],
      [labels.packaging, labels.market],
      [labels.availability, labels.according]
    ];
    return vals.map(([key,value]) => `<div class="fish-catalog-card__detail"><span>${esc(key)}</span><strong>${esc(value)}</strong></div>`).join('');
  };

  const render = () => {
    const query = String(search.value || '').trim().toLowerCase();
    const visible = allProducts.filter(product => {
      const cat = categoryOf(product);
      const inCondition = condition === 'all' || (condition === 'fresh' ? product.condition.includes('Fresco') : product.condition.includes('Congelado'));
      const inCategory = category === 'all' || cat === category;
      const haystack = [product.name,product.id,product.scientificName,product.group,product.type,product.origin,product.faoZone].join(' ').toLowerCase();
      return inCondition && inCategory && (!query || haystack.includes(query));
    });

    count.textContent = `${visible.length} ${visible.length === 1 ? labels.ref : labels.refs}`;
    grid.innerHTML = visible.length ? visible.map(product => {
      const images = Array.isArray(imageMap[product.id]) ? imageMap[product.id] : [];
      const image = images[0] || '';
      const mediaData = esc(JSON.stringify(images));
      const cat = categoryOf(product);
      return `<article class="fish-catalog-card" data-product-id="${esc(product.id)}"><div class="fish-catalog-card__media" data-images='${mediaData}' data-image-index="0" tabindex="0" role="button" aria-label="${esc(labels.all === 'Todos' ? `Ver imágenes de ${product.name}` : `View images of ${product.name}`)}">${image ? `<img class="fish-card-image" src="${esc(image)}" alt="${esc(product.name)}" loading="lazy" draggable="false">` : '<span class="fish-catalog-card__placeholder">EMPERIO TISS</span>'}${images.length > 1 ? `<button class="fish-card-nav fish-card-nav--prev" type="button" aria-label="Previous image">‹</button><button class="fish-card-nav fish-card-nav--next" type="button" aria-label="Next image">›</button><span class="fish-card-counter">1 / ${images.length}</span>` : ''}</div><div class="fish-catalog-card__body"><p class="fish-catalog-card__meta">${esc(cat === 'white' ? labels.white : cat === 'blue' ? labels.blue : labels.special)}</p><h3 class="fish-catalog-card__title">${esc(product.name)}</h3><p class="fish-catalog-card__scientific"><em>${esc(product.scientificName)}</em></p><div class="fish-catalog-card__details">${details(product)}</div></div></article>`;
    }).join('') : `<p class="fish-catalog__empty">${labels.none}</p>`;
  };

  grid.addEventListener('click', event => {
    const nav = event.target.closest('.fish-card-nav');
    if (nav) {
      const media = nav.closest('.fish-catalog-card__media');
      if (!media) return;
      const images = readImages(media);
      const image = media.querySelector('.fish-card-image');
      if (!images.length || !image) return;
      const direction = nav.classList.contains('fish-card-nav--next') ? 1 : -1;
      const current = Number.parseInt(media.dataset.imageIndex || '0', 10);
      const safeCurrent = Number.isInteger(current) && current >= 0 && current < images.length ? current : 0;
      const next = (safeCurrent + direction + images.length) % images.length;
      media.dataset.imageIndex = String(next);
      image.src = images[next];
      const counter = media.querySelector('.fish-card-counter');
      if (counter) counter.textContent = `${next + 1} / ${images.length}`;
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const media = event.target.closest('.fish-catalog-card__media');
    if (!media) return;
    const images = readImages(media);
    if (!images.length) return;
    event.preventDefault();
    openViewer(images);
  }, true);

  grid.addEventListener('keydown', event => {
    if (!['Enter',' '].includes(event.key)) return;
    const media = event.target.closest('.fish-catalog-card__media');
    if (!media) return;
    const images = readImages(media);
    if (!images.length) return;
    event.preventDefault();
    openViewer(images);
  });

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

  fetch('/assets/data/product-images.json', {cache:'no-cache'})
    .then(response => response.ok ? response.json() : {})
    .then(images => { imageMap = images || {}; render(); })
    .catch(() => render());
})();