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


  // Marquee layout (Spanish page): species glide by in elegant lines; choosing one opens its plate.
  let marqueeCss = document.querySelector('link[data-fish-marquee]');
  if (!marqueeCss) {
    marqueeCss = document.createElement('link');
    marqueeCss.rel = 'stylesheet';
    marqueeCss.href = '/assets/css/fish-catalog-marquee.css?v=20261010-4';
    marqueeCss.dataset.fishMarquee = 'true';
    document.head.appendChild(marqueeCss);
  }
  const ui = {sheet:'Ficha técnica completa',kitchen:'En cocina',prev:'Especie anterior',next:'Especie siguiente',close:'Cerrar',no:'Nº'};
  // editorial copy per species: general culinary knowledge only, no commercial data
  const notes = {
    dorada:['Pez blanco de carne firme, jugosa y de sabor delicado. Un imprescindible de la cocina mediterránea.',['A la sal','Horno','Brasa']],
    lubina:['Carne blanca, fina y de lasca tersa, con muy poca espina. Elegante en cualquier preparación.',['Parrilla','Horno','Crudo']],
    'merluza-pijota':['El pescado blanco más apreciado en España: carne suave, lascas tiernas y sabor limpio.',['Plancha','Horno','Salsa verde']],
    rape:['Carne prieta, sin espinas y de textura casi de marisco. Protagonista de guisos y arroces.',['Guiso','Arroz','Brocheta']],
    caballa:['Pez azul de sabor intenso y rico en omega-3. Carácter marino en estado puro.',['Brasa','Escabeche','Marinado']],
    sardina:['Icono del pescado azul: sabrosa, nutritiva y profundamente mediterránea.',['Brasa','Escabeche','Plancha']],
    boqueron:['Pequeño pez azul de carne fina y sabor marino, emblema de la cocina española.',['En vinagre','Frito','Marinado']],
    salmonete:['Carne fina y sabrosa de color rosado, muy valorada por la alta cocina.',['Plancha','Frito','Fumet']],
    atun:['La gran especie del pescado azul: carne roja, densa y de sabor profundo.',['Tataki','Tartar','Plancha']],
    'pez-espada':['Carne compacta, sin espinas y de sabor suave, ideal en rodajas y lomos.',['Plancha','Brasa','Lomos']],
    'san-pedro':['Pescado de roca de carne blanca y fina, muy apreciado por la alta cocina.',['Horno','Filetes','Caldos']],
    denton:['Pez de roca mediterráneo de carne blanca, firme y sabrosa.',['Horno','A la sal','Brasa']],
    sargo:['Espárido de carne blanca y textura firme, de sabor marcado y limpio.',['Brasa','Horno','Plancha']],
    sole:['Pescado plano de carne fina y delicada, referencia de la cocina clásica.',['Meunière','Plancha','Filetes']],
    'pez-limon':['Carne firme con grasa equilibrada, muy apreciada en crudo.',['Sashimi','Tiradito','Brasa']],
    mujol:['Pescado de carne blanca y sabor marcado; de su hueva nace la bottarga.',['Brasa','Horno','Salazón']],
    pargo:['Espárido de gran porte y carne blanca, firme y sabrosa.',['Horno','A la sal','Lomos']],
    mero:['Pescado noble de carne blanca, gelatinosa y untuosa.',['Guiso','Horno','Lomos']],
    sama:['Pez de la familia del dentón, de carne blanca y firme.',['Horno','A la sal','Parrilla']],
    rascacio:['Pez de roca de sabor intenso, base clásica de sopas y calderos.',['Sopa','Caldero','Suquet']],
    salmon:['Carne anaranjada, untuosa y rica en omega-3. De una versatilidad excepcional.',['Crudo','Ahumado','Horno']]
  };

  let referenceMap = {};
  let deck = [];
  let current = 0;

  const pad = n => String(n).padStart(2, '0');
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const familyOf = product => { const cat = categoryOf(product); return cat === 'white' ? labels.white : cat === 'blue' ? labels.blue : labels.special; };
  const stateOf = product => [product.condition.includes('Fresco') && labels.fresh, product.condition.includes('Congelado') && labels.frozen].filter(Boolean).join(' · ');
  const rows = pairs => pairs.map(([key,value]) => `<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('');
  const arrowIcon = dir => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">${dir < 0 ? '<path d="M19 12H5M11 6l-6 6 6 6"/>' : '<path d="M5 12h14M13 6l6 6-6 6"/>'}</svg>`;

  // ---- marquee
  const tile = (product, i) => {
    const thumb = (imageMap[product.id] || [])[0];
    return `<button class="et-mq__card" type="button" data-index="${i}" aria-label="${esc(product.name)}">`
      + (thumb ? `<img src="${esc(thumb)}" alt="" loading="lazy" draggable="false">` : '<span class="et-mq__ph">EMPERIO TISS</span>')
      + `<span class="et-mq__state">${esc(stateOf(product))}</span>`
      + `<span class="et-mq__meta"><em>${pad(i + 1)}</em><b>${esc(product.name)}</b><i>${esc(product.scientificName)}</i></span></button>`;
  };
  const word = (product, i) => `<button class="et-mq__word${i % 2 ? ' is-outline' : ''}" type="button" data-index="${i}">${esc(product.name)}</button><span class="et-mq__dot" aria-hidden="true">◆</span>`;
  // each line holds its content twice so the loop is seamless; the copy is hidden from assistive tech
  const line = (html, mod, still) => `<div class="et-mq__line et-mq__line--${mod}${still ? ' is-still' : ''}" data-line="${mod}"><div class="et-mq__track"><div class="et-mq__set">${html}</div>`
    + (still ? '' : `<div class="et-mq__set" aria-hidden="true">${html.replaceAll('<button ', '<button tabindex="-1" ')}</div>`) + `</div></div>`;

  const paintMarquee = () => {
    if (!deck.length) { grid.innerHTML = `<p class="fish-catalog__empty">${labels.none}</p>`; return; }
    const still = reduced() || deck.length < 6;
    const indexed = deck.map((p, i) => [p, i]);
    const words = indexed.map(([p, i]) => word(p, i)).join('');
    const rowA = indexed.filter((_, k) => k % 2 === 0).map(([p, i]) => tile(p, i)).join('');
    const rowB = indexed.filter((_, k) => k % 2 === 1).map(([p, i]) => tile(p, i)).join('');
    grid.innerHTML = `<div class="et-mq">${line(words, 'names', still)}${line(rowA, 'cards', still)}${rowB ? line(rowB, 'cards-reverse', still) : ''}</div>`;
    tune();
  };

  // an unhurried, constant speed whatever the length of each line (pixels per second);
  // measured again once the stylesheet and fonts are in, and when the window changes size
  // lines are driven frame by frame: they glide on their own, ease to a stop under the pointer,
  // follow the hand when dragged and carry their momentum when released, then return to their pace
  const speed = {names: -42, cards: -30, 'cards-reverse': 26};
  let lines = [];
  const tune = () => {
    lines = [];
    grid.querySelectorAll('.et-mq__line:not(.is-still)').forEach(el => {
      const [set, copy] = el.querySelectorAll('.et-mq__set');
      if (!set.dataset.base) set.dataset.base = set.innerHTML;
      if (set.scrollWidth < 600) return; // styles not applied yet
      // short lines (few references after filtering) repeat until they cover the screen, so the loop never shows a gap
      const repeat = set.dataset.base.replaceAll('<button ', '<button tabindex="-1" ');
      for (let guard = 0; set.scrollWidth < el.clientWidth + 120 && guard < 8; guard++) set.insertAdjacentHTML('beforeend', repeat);
      if (copy) copy.innerHTML = set.innerHTML.replaceAll('<button ', '<button tabindex="-1" ').replaceAll('tabindex="-1" tabindex="-1" ', 'tabindex="-1" ');
      const pace = reduced() ? 0 : (speed[el.dataset.line] ?? -30);
      const old = el.etLine;
      el.etLine = {el, track: el.querySelector('.et-mq__track'), width: set.getBoundingClientRect().width, x: old?.x ?? 0, v: old?.v ?? pace, pace, hover: false, drag: null};
      lines.push(el.etLine);
    });
    startLoop();
  };

  let looping = false, lastTime = 0;
  const frame = now => {
    const dt = Math.min(.05, (now - lastTime) / 1000 || 0);
    lastTime = now;
    for (const line of lines) {
      if (!line.drag) {
        // ease towards the line's own pace (or to rest under the pointer); this also bleeds off throw momentum
        const target = line.hover ? 0 : line.pace;
        line.v += (target - line.v) * Math.min(1, dt * (Math.abs(line.v - target) > 200 ? 1.6 : 2.4));
        line.x += line.v * dt;
      }
      if (line.width > 0) line.x = ((line.x % line.width) - line.width) % line.width; // keep within one loop: (-width, 0]
      line.track.style.transform = `translate3d(${line.x.toFixed(2)}px,0,0)`;
    }
    if (lines.length) requestAnimationFrame(frame); else looping = false;
  };
  const startLoop = () => { if (!looping && lines.length) { looping = true; lastTime = performance.now(); requestAnimationFrame(frame); } };

  // drag with mouse, pen or finger; vertical page scroll stays native (touch-action: pan-y)
  const lineOf = event => event.target.closest?.('.et-mq__line')?.etLine;
  grid.addEventListener('pointerdown', event => {
    const line = lineOf(event);
    if (!line || (event.pointerType === 'mouse' && event.button !== 0)) return;
    line.drag = null;
    line.press = {id: event.pointerId, x: event.clientX, y: event.clientY, startX: line.x, samples: [[performance.now(), event.clientX]]};
  });
  grid.addEventListener('pointermove', event => {
    const line = lineOf(event) || lines.find(l => l.press?.id === event.pointerId);
    if (!line?.press || line.press.id !== event.pointerId) return;
    const dx = event.clientX - line.press.x;
    if (!line.drag) {
      if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(event.clientY - line.press.y)) return;
      line.drag = true;
      line.el.classList.add('is-dragging');
      line.el.setPointerCapture?.(event.pointerId);
    }
    line.x = line.press.startX + dx;
    line.press.samples.push([performance.now(), event.clientX]);
    if (line.press.samples.length > 6) line.press.samples.shift();
  });
  const release = event => {
    const line = lines.find(l => l.press?.id === event.pointerId);
    if (!line) return;
    if (line.drag) {
      // throw: speed of the last few moves, kept within a calm range
      const samples = line.press.samples, [t0, x0] = samples[0], [t1, x1] = samples[samples.length - 1];
      const throwSpeed = t1 > t0 ? (x1 - x0) / ((t1 - t0) / 1000) : 0;
      line.v = Math.max(-2400, Math.min(2400, throwSpeed));
      line.el.classList.remove('is-dragging');
      line.justDragged = true;
      setTimeout(() => { line.justDragged = false; }, 0);
    }
    line.drag = null;
    line.press = null;
  };
  grid.addEventListener('pointerup', release);
  grid.addEventListener('pointercancel', release);
  // a drag must not open the species it started on
  grid.addEventListener('click', event => { if (lineOf(event)?.justDragged) { event.preventDefault(); event.stopImmediatePropagation(); } }, true);
  grid.addEventListener('pointerover', event => { if (event.pointerType === 'mouse') { const line = lineOf(event); if (line) line.hover = true; } });
  grid.addEventListener('pointerout', event => { if (event.pointerType === 'mouse') { const line = lineOf(event); if (line && !line.el.contains(event.relatedTarget)) line.hover = false; } });
  grid.addEventListener('focusin', event => { const line = lineOf(event); if (line) line.hover = true; });
  grid.addEventListener('focusout', event => { const line = lineOf(event); if (line && !line.el.contains(event.relatedTarget)) line.hover = false; });

  marqueeCss.addEventListener('load', tune);
  document.fonts?.ready.then(tune);
  let resizeTimer = 0;
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(tune, 200); });

  // ---- plate: one species at a time over the page
  const plate = document.createElement('div');
  plate.className = 'et-plate';
  plate.hidden = true;
  plate.setAttribute('role', 'dialog');
  plate.setAttribute('aria-modal', 'true');
  plate.innerHTML = `<div class="et-plate__backdrop"></div><div class="et-plate__panel">`
    + `<button class="et-plate__close" type="button" aria-label="${esc(ui.close)}">×</button>`
    + `<button class="et-plate__arrow et-plate__arrow--prev" type="button" data-dir="-1" aria-label="${esc(ui.prev)}">${arrowIcon(-1)}</button>`
    + `<button class="et-plate__arrow et-plate__arrow--next" type="button" data-dir="1" aria-label="${esc(ui.next)}">${arrowIcon(1)}</button>`
    + `<div class="et-plate__body"></div></div>`;
  // inside the catalogue section so the shared catalogue hooks apply; position: fixed keeps it over the page
  (document.getElementById('fishCatalog') || document.body).appendChild(plate);
  const plateBody = plate.querySelector('.et-plate__body');
  let lastFocus = null;

  const plateHtml = (product, i) => {
    const images = Array.isArray(imageMap[product.id]) ? imageMap[product.id] : [];
    const reference = referenceMap[product.id] || '';
    const note = notes[product.id];
    return `<article class="fish-catalog-card et-plate__card" data-product-id="${esc(product.id)}"${reference ? ` data-product-reference="${esc(reference)}"` : ''}>`
      + `<div class="et-plate__photo" data-images='${esc(JSON.stringify(images))}' role="button" tabindex="0" aria-label="${esc(`${viewImages} ${product.name}`)}">`
      + (images[0] ? `<img src="${esc(images[0])}" alt="${esc(product.name)}" draggable="false">` : '<span class="et-mq__ph">EMPERIO TISS</span>')
      + `<span class="et-plate__frame" aria-hidden="true"></span><span class="et-plate__numeral" aria-hidden="true">${pad(i + 1)}</span><span class="et-mq__state">${esc(stateOf(product))}</span></div>`
      + `<div class="et-plate__info"><div class="et-plate__lead"><p class="et-plate__kicker">${esc(ui.no)} ${pad(i + 1)} — ${esc(familyOf(product))}</p>`
      + `<div class="et-fish-card__name et-plate__name" role="heading" aria-level="3">${esc(product.name)}</div><p class="et-plate__latin">${esc(product.scientificName)}</p>`
      + (note ? `<p class="et-plate__story">${esc(note[0])}</p><p class="et-plate__uses"><span>${esc(ui.kitchen)}</span>${note[1].map(u => `<em>${esc(u)}</em>`).join('')}</p>` : '')
      + `</div><div class="et-plate__side"><dl class="et-plate__facts">${rows([[labels.state, stateOf(product)], [labels.origin, localize(product.origin)], [labels.fao, product.faoZone]])}</dl>`
      + `<div class="et-fish-card__sheet et-plate__actions"></div>`
      + `<details class="et-plate__more"><summary>${esc(ui.sheet)}</summary><dl class="et-fish-card__specs et-plate__specs">${rows([[labels.type, localize(product.type)], [labels.calibre, labels.according], [labels.quality, labels.professional], [labels.presentation, labels.destination], [labels.packaging, labels.market], [labels.availability, labels.according]])}</dl></details>`
      + (reference ? `<p class="et-plate__ref et-product-reference">REF. ${esc(reference)}</p>` : '') + `</div></div></article>`;
  };

  const show = (index, animate) => {
    current = (index + deck.length) % deck.length;
    const swap = () => {
      plateBody.innerHTML = plateHtml(deck[current], current);
      plate.setAttribute('aria-label', deck[current].name);
      plate.querySelectorAll('.et-plate__arrow').forEach(arrow => { arrow.hidden = deck.length < 2; });
      plateBody.classList.remove('is-leaving');
    };
    if (animate && !reduced()) { plateBody.classList.add('is-leaving'); setTimeout(swap, 260); } else swap();
  };
  const openPlate = index => {
    lastFocus = document.activeElement;
    show(index, false);
    plate.hidden = false;
    document.documentElement.classList.add('et-plate-open');
    requestAnimationFrame(() => plate.classList.add('is-open'));
    plate.querySelector('.et-plate__close').focus({preventScroll: true});
  };
  const closePlate = () => {
    plate.classList.remove('is-open');
    document.documentElement.classList.remove('et-plate-open');
    setTimeout(() => { plate.hidden = true; plateBody.innerHTML = ''; }, 380);
    lastFocus?.focus?.({preventScroll: true});
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
    paintMarquee();
  };

  grid.addEventListener('click', event => {
    const pick = event.target.closest('[data-index]');
    if (pick) openPlate(Number(pick.dataset.index));
  });
  plate.addEventListener('click', event => {
    if (event.target.closest('.et-plate__close') || event.target.classList.contains('et-plate__backdrop')) { closePlate(); return; }
    const arrow = event.target.closest('.et-plate__arrow');
    if (arrow) { show(current + Number(arrow.dataset.dir), true); return; }
    const photo = event.target.closest('.et-plate__photo');
    if (photo) { const images = readImages(photo); if (images.length) openViewer(images); }
  });
  document.addEventListener('keydown', event => {
    if (plate.hidden || !viewer.hidden) return;
    if (event.key === 'Escape') closePlate();
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1), true); }
  });
  let touchX = null;
  plate.addEventListener('touchstart', event => { touchX = event.touches[0]?.clientX ?? null; }, {passive:true});
  plate.addEventListener('touchend', event => {
    if (touchX === null) return;
    const dx = (event.changedTouches[0]?.clientX ?? touchX) - touchX;
    touchX = null;
    if (Math.abs(dx) > 60 && event.target.closest('.et-plate__photo')) show(current + (dx < 0 ? 1 : -1), true);
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
