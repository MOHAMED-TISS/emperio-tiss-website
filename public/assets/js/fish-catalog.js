(() => {
  'use strict';
  const root = document.documentElement,
    lang = (root.lang || 'es').slice(0, 2).toLowerCase();
  const grid = document.getElementById('fishCatalogGrid'),
    search = document.getElementById('fishCatalogSearch'),
    count = document.getElementById('fishCatalogCount');
  if (!grid || !search || !count) return;
  const labels = {
    es: {
      all: 'Todos',
      fresh: 'Fresco',
      frozen: 'Congelado',
      allCats: 'Todas las categorías',
      white: 'Pez blanco',
      blue: 'Pez azul',
      special: 'Pescados especiales',
      refs: 'referencias',
      ref: 'referencia',
      none: 'No hay referencias que coincidan con la búsqueda.',
      family: 'Familia',
      type: 'Tipo',
      state: 'Estado',
      origin: 'Origen',
      fao: 'Zona FAO',
      calibre: 'Calibre',
      quality: 'Calidad',
      presentation: 'Presentación',
      packaging: 'Embalaje',
      availability: 'Disponibilidad',
      according: 'Según disponibilidad',
      destination: 'Según destino',
      market: 'Según mercado',
      professional: 'Especificación profesional'
    },
    en: {
      all: 'All',
      fresh: 'Fresh',
      frozen: 'Frozen',
      allCats: 'All categories',
      white: 'White fish',
      blue: 'Blue fish',
      special: 'Special fish',
      refs: 'references',
      ref: 'reference',
      none: 'No references match your search.',
      family: 'Family',
      type: 'Type',
      state: 'Condition',
      origin: 'Origin',
      fao: 'FAO area',
      calibre: 'Calibre',
      quality: 'Quality',
      presentation: 'Presentation',
      packaging: 'Packaging',
      availability: 'Availability',
      according: 'According to availability',
      destination: 'According to destination',
      market: 'According to market',
      professional: 'Professional specification'
    },
    fr: {
      all: 'Toutes',
      fresh: 'Frais',
      frozen: 'Congelé',
      allCats: 'Toutes les catégories',
      white: 'Poisson blanc',
      blue: 'Poisson bleu',
      special: 'Poissons spéciaux',
      refs: 'références',
      ref: 'référence',
      none: 'Aucune référence ne correspond à votre recherche.',
      family: 'Famille',
      type: 'Type',
      state: 'État',
      origin: 'Origine',
      fao: 'Zone FAO',
      calibre: 'Calibre',
      quality: 'Qualité',
      presentation: 'Présentation',
      packaging: 'Conditionnement',
      availability: 'Disponibilité',
      according: 'Selon disponibilité',
      destination: 'Selon destination',
      market: 'Selon marché',
      professional: 'Spécification professionnelle'
    },
    it: {
      all: 'Tutte',
      fresh: 'Fresco',
      frozen: 'Surgelato',
      allCats: 'Tutte le categorie',
      white: 'Pesce bianco',
      blue: 'Pesce azzurro',
      special: 'Pesci speciali',
      refs: 'referenze',
      ref: 'referenza',
      none: 'Nessuna referenza corrisponde alla ricerca.',
      family: 'Famiglia',
      type: 'Tipo',
      state: 'Stato',
      origin: 'Origine',
      fao: 'Zona FAO',
      calibre: 'Calibro',
      quality: 'Qualità',
      presentation: 'Presentazione',
      packaging: 'Imballaggio',
      availability: 'Disponibilità',
      according: 'Secondo disponibilità',
      destination: 'Secondo destinazione',
      market: 'Secondo mercato',
      professional: 'Specificazione professionale'
    }
  } [lang] || {};
  const names = {
    dorada: {
      es: 'Dorada',
      en: 'Sea bream',
      fr: 'Daurade royale',
      it: 'Orata'
    },
    lubina: {
      es: 'Lubina',
      en: 'Sea bass',
      fr: 'Bar',
      it: 'Branzino'
    },
    'merluza-pijota': {
      es: 'Merluza / Pijota',
      en: 'Hake',
      fr: 'Merlu',
      it: 'Nasello / Merluzzo'
    },
    mujol: {
      es: 'Mújol',
      en: 'Mullet',
      fr: 'Mulet',
      it: 'Cefalo'
    },
    rape: {
      es: 'Rape',
      en: 'Monkfish',
      fr: 'Baudroie',
      it: 'Rana pescatrice'
    },
    'san-pedro': {
      es: 'San Pedro',
      en: 'John Dory',
      fr: 'Saint-Pierre',
      it: 'San Pietro'
    },
    'mero-amarillo': {
      es: 'Mero amarillo',
      en: 'Yellow grouper',
      fr: 'Mérou jaune',
      it: 'Cernia gialla'
    },
    pargo: {
      es: 'Pargo',
      en: 'Snapper',
      fr: 'Vivaneau',
      it: 'Dentice tropicale'
    },
    denton: {
      es: 'Dentón',
      en: 'Dentex',
      fr: 'Denté',
      it: 'Dentice'
    },
    sama: {
      es: 'Sama',
      en: 'Sama',
      fr: 'Sama',
      it: 'Sama'
    },
    sargo: {
      es: 'Sargo',
      en: 'White seabream',
      fr: 'Sar commun',
      it: 'Sarago'
    },
    rascacio: {
      es: 'Rascacio',
      en: 'Scorpionfish',
      fr: 'Rascasse',
      it: 'Scorfano'
    },
    caballa: {
      es: 'Caballa',
      en: 'Mackerel',
      fr: 'Maquereau',
      it: 'Sgombro'
    },
    salmonete: {
      es: 'Salmonete',
      en: 'Red mullet',
      fr: 'Rouget',
      it: 'Triglia'
    },
    atun: {
      es: 'Atún',
      en: 'Tuna',
      fr: 'Thon',
      it: 'Tonno'
    },
    salmon: {
      es: 'Salmón',
      en: 'Salmon',
      fr: 'Saumon',
      it: 'Salmone'
    },
    'pez-limon': {
      es: 'Pez limón',
      en: 'Greater amberjack',
      fr: 'Sériole couronnée',
      it: 'Ricciola'
    },
    boqueron: {
      es: 'Boquerón',
      en: 'Anchovy',
      fr: 'Anchois',
      it: 'Acciuga'
    },
    'pez-sable': {
      es: 'Pez sable',
      en: 'Cutlassfish',
      fr: 'Sabre',
      it: 'Pesce sciabola'
    },
    'pez-espada': {
      es: 'Pez espada',
      en: 'Swordfish',
      fr: 'Espadon',
      it: 'Pesce spada'
    }
  };
  const products = [
    ['dorada', 'Sparus aurata', 'Pez de escama', 'Blanco / semigraso', 'Fresco',
      'Mediterráneo / según disponibilidad', 'FAO 37'
    ],
    ['lubina', 'Dicentrarchus labrax', 'Pez de escama', 'Blanco / semigraso', 'Fresco',
      'Mediterráneo / Atlántico según disponibilidad', 'FAO 27 / FAO 37 según origen'
    ],
    ['merluza-pijota', 'Merluccius spp.', 'Pez de escama', 'Blanco / semigraso', 'Fresco',
      'Según programa de suministro', 'Según origen'
    ],
    ['mujol', 'Mugil cephalus', 'Pez de escama', 'Blanco / semigraso', 'Fresco',
      'Mediterráneo / según disponibilidad', 'FAO 37 según origen'
    ],
    ['rape', 'Lophius spp.', 'Pez de escama', 'Blanco / semigraso', 'Fresco',
      'Atlántico / Mediterráneo según disponibilidad', 'FAO 27 / FAO 37 según origen'
    ],
    ['san-pedro', 'Zeus faber', 'Pez de escama', 'Blanco / semigraso', 'Fresco',
      'Mediterráneo / Atlántico según disponibilidad', 'FAO 27 / FAO 37 según origen'
    ],
    ['mero-amarillo', 'Epinephelus spp.', 'Pez de escama', 'Blanco / semigraso', 'Fresco',
      'Según origen disponible', 'Según origen'
    ],
    ['pargo', 'Lutjanus spp.', 'Pez de escama', 'Blanco / semigraso', 'Fresco',
      'Según programa de suministro', 'Según origen'
    ],
    ['denton', 'Dentex dentex', 'Pez de escama', 'Blanco / semigraso', 'Fresco',
      'Mediterráneo / según disponibilidad', 'FAO 37'
    ],
    ['sama', 'Dentex spp.', 'Pez de escama', 'Blanco / semigraso', 'Fresco',
      'Mediterráneo / según disponibilidad', 'FAO 37'
    ],
    ['sargo', 'Diplodus spp.', 'Pez de escama', 'Blanco / semigraso', 'Fresco',
      'Mediterráneo / Atlántico según disponibilidad', 'FAO 27 / FAO 37 según origen'
    ],
    ['rascacio', 'Scorpaena spp.', 'Pez de escama', 'Blanco / semigraso', 'Fresco',
      'Mediterráneo / según disponibilidad', 'FAO 37'
    ],
    ['caballa', 'Scomber spp.', 'Pez de escama', 'Azul / graso', 'Fresco / Congelado',
      'Atlántico / Mediterráneo según disponibilidad', 'FAO 27 / FAO 37 según origen'
    ],
    ['salmonete', 'Mullus spp.', 'Pez de escama', 'Azul / graso', 'Fresco',
      'Mediterráneo / Atlántico según disponibilidad', 'FAO 27 / FAO 37 según origen'
    ],
    ['atun', 'Thunnus spp.', 'Pez de escama', 'Azul / graso', 'Fresco',
      'Según especie y programa de suministro', 'Según origen'
    ],
    ['salmon', 'Salmo salar', 'Pez de escama', 'Azul / graso', 'Fresco / Congelado', 'Noruega',
      'FAO 27'
    ],
    ['pez-limon', 'Seriola dumerili', 'Pez de escama', 'Azul / graso', 'Fresco',
      'Mediterráneo / según disponibilidad', 'FAO 37'
    ],
    ['boqueron', 'Engraulis encrasicolus', 'Pez de escama', 'Azul / graso', 'Fresco',
      'Mediterráneo / Atlántico según disponibilidad', 'FAO 27 / FAO 37 según origen'
    ],
    ['pez-sable', 'Trichiurus spp.', 'Pescados especiales', 'Especial', 'Fresco',
      'Según programa de suministro', 'Según origen'
    ],
    ['pez-espada', 'Xiphias gladius', 'Pescados especiales', 'Especial', 'Fresco',
      'Según programa de suministro', 'Según origen'
    ]
  ].map(([id, scientificName, group, type, condition, origin, faoZone]) => ({
    id,
    scientificName,
    group,
    type,
    condition,
    origin,
    faoZone,
    name: (names[id] || {})[lang] || (names[id] || {}).es || id
  }));
  const categoryOf = p => p.group === 'Pescados especiales' ? 'special' : p.type.startsWith(
    'Azul') ? 'blue' : 'white';
  const conditions = v => String(v).toLowerCase().split('/').map(x => x.trim()).map(x => x ===
    'fresco' ? 'fresh' : x === 'congelado' ? 'frozen' : x);
  const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '\"': '&quot;',
    "'": '&#39;'
  } [c]));
  let imageMap = {};
  let condition = 'all';
  let category = 'all';
  const details = p => {
    const cat = categoryOf(p),
      vals = [
        [labels.family, cat === 'white' ? labels.white : cat === 'blue' ? labels.blue : labels
          .special
        ],
        [labels.type, p.type],
        [labels.state, p.condition.split(' / ').map(x => x === 'Fresco' ? labels.fresh : x ===
          'Congelado' ? labels.frozen : x).join(' / ')],
        [labels.origin, p.origin],
        [labels.fao, p.faoZone],
        [labels.calibre, labels.according],
        [labels.quality, labels.professional],
        [labels.presentation, labels.destination],
        [labels.packaging, labels.market],
        [labels.availability, labels.according]
      ];
    return vals.map(([k, v]) =>
      `<div class="fish-catalog-card__detail"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`
      ).join('')
  };
  const viewer = document.createElement('div');
  viewer.className = 'fish-gallery';
  viewer.hidden = true;
  viewer.innerHTML =
    '<div class="fish-gallery__panel"><img class="fish-gallery__image" alt=""><button class="fish-gallery__prev" type="button">‹</button><button class="fish-gallery__next" type="button">›</button><button class="fish-gallery__close" type="button">×</button><span class="fish-gallery__counter"></span></div>';
  document.body.appendChild(viewer);
  const vimg = viewer.querySelector('.fish-gallery__image'),
    vc = viewer.querySelector('.fish-gallery__counter');
  let gallery = [],
    gi = 0;
  const updateViewer = () => {
    vimg.src = gallery[gi];
    vc.textContent = `${gi+1} / ${gallery.length}`;
    viewer.querySelector('.fish-gallery__prev').hidden = gallery.length < 2;
    viewer.querySelector('.fish-gallery__next').hidden = gallery.length < 2
  };
  const openViewer = imgs => {
    if (!imgs.length) return;
    gallery = imgs;
    gi = 0;
    viewer.hidden = false;
    document.body.style.overflow = 'hidden';
    updateViewer()
  };
  const closeViewer = () => {
    viewer.hidden = true;
    document.body.style.overflow = '';
    vimg.removeAttribute('src')
  };
  viewer.querySelector('.fish-gallery__prev').onclick = () => {
    gi = (gi - 1 + gallery.length) % gallery.length;
    updateViewer()
  };
  viewer.querySelector('.fish-gallery__next').onclick = () => {
    gi = (gi + 1) % gallery.length;
    updateViewer()
  };
  viewer.querySelector('.fish-gallery__close').onclick = closeViewer;
  viewer.onclick = e => {
    if (e.target === viewer) closeViewer()
  };
  const bindMedia = media => {
    const imgs = JSON.parse(media.dataset.images || '[]'),
      img = media.querySelector('.fish-card-image'),
      counter = media.querySelector('.fish-card-counter');
    if (!imgs.length) return;
    let current = 0;
    const show = i => {
      current = (i + imgs.length) % imgs.length;
      if (img) img.src = imgs[current];
      if (counter) counter.textContent = `${current+1} / ${imgs.length}`
    };
    media.querySelector('.fish-card-nav--prev')?.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      show(current - 1)
    });
    media.querySelector('.fish-card-nav--next')?.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      show(current + 1)
    });
    media.addEventListener('click', e => {
      if (e.target.closest('.fish-card-nav')) return;
      openViewer(imgs)
    })
  };
  const render = () => {
    const q = String(search.value || '').trim().toLowerCase();
    const visible = products.filter(p => {
      const cat = categoryOf(p),
        okC = condition === 'all' || conditions(p.condition).includes(condition),
        okCat = category === 'all' || cat === category,
        hay = [p.name, p.id, p.scientificName, p.group, p.type, p.origin, p.faoZone].join(
          ' ').toLowerCase();
      return okC && okCat && (!q || hay.includes(q))
    });
    count.textContent = `${visible.length} ${visible.length===1?labels.ref:labels.refs}`;
    grid.innerHTML = visible.length ? visible.map(p => {
      const imgs = imageMap[p.id] || [],
        img = imgs[0] || '';
      return `<article class="fish-catalog-card" data-product-id="${esc(p.id)}"><div class="fish-catalog-card__media" data-images='${esc(JSON.stringify(imgs))}'>${img?`<img class="fish-card-image" src="${esc(img)}" alt="${esc(p.name)}" loading="lazy" draggable="false">`:'<span class="fish-catalog-card__placeholder">EMPERIO TISS</span>'}${imgs.length>1?`<button class="fish-card-nav fish-card-nav--prev" type="button">‹</button><button class="fish-card-nav fish-card-nav--next" type="button">›</button><span class="fish-card-counter">1 / ${imgs.length}</span>`:''}</div><div class="fish-catalog-card__body"><p class="fish-catalog-card__meta">${esc(categoryOf(p)==='white'?labels.white:categoryOf(p)==='blue'?labels.blue:labels.special)}</p><h3 class="fish-catalog-card__title">${esc(p.name)}</h3><p class="fish-catalog-card__scientific"><em>${esc(p.scientificName)}</em></p><div class="fish-catalog-card__details">${details(p)}</div></div></article>`
    }).join('') : `<p class="fish-catalog__empty">${labels.none}</p>`;
    grid.querySelectorAll('.fish-catalog-card__media').forEach(bindMedia)
  };
  document.querySelectorAll('[data-fish-filter]').forEach(b => b.addEventListener('click', () => {
    condition = b.dataset.fishFilter || 'all';
    document.querySelectorAll('[data-fish-filter]').forEach(x => x.setAttribute(
      'aria-pressed', String(x === b)));
    render()
  }));
  document.querySelectorAll('[data-fish-category]').forEach(b => b.addEventListener('click',
() => {
    category = b.dataset.fishCategory || 'all';
    document.querySelectorAll('[data-fish-category]').forEach(x => x.setAttribute(
      'aria-pressed', String(x === b)));
    render()
  }));
  search.addEventListener('input', render);
  fetch('/assets/data/product-images.json', {
    cache: 'no-cache'
  }).then(r => r.ok ? r.json() : {}).then(images => {
    imageMap = images || {};
    render()
  }).catch(() => render());
})();
