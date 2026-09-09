(() => {
  'use strict';

  const path = location.pathname.replace(/\/+/g, '/');
  const lang = (document.documentElement.lang || 'en').toLowerCase().slice(0, 2);
  if (lang === 'es') return;

  const targets = [
    ['seafood', 'fish'],
    ['seafood', 'shellfish'],
    ['seafood', 'cephalopods'],
    ['produce', 'fruits'],
    ['produce', 'vegetables']
  ];
  const match = path.match(
    /\/products\/(?:seafood\/(fish|shellfish|cephalopods)|fruits|vegetables)(?:\/|$)/);
  if (!match) return;
  const subcategory = match[1] || (path.includes('/vegetables') ? 'vegetables' : 'fruits');
  const family = subcategory === 'fruits' || subcategory === 'vegetables' ? 'produce' : 'seafood';
  if (!targets.some(([f, s]) => f === family && s === subcategory)) return;

  const CATALOG_URL = '/assets/data/catalog.json';
  const PRIORITY_URL = '/assets/data/catalogue-market-priority.json';
  const IMAGES_URL = '/assets/data/product-images.json';

  const labels = {
    en: {
      eyebrow: 'CATALOGUE',
      title: {
        fish: 'Fish',
        shellfish: 'Shellfish',
        cephalopods: 'Cephalopods',
        fruits: 'Fruits',
        vegetables: 'Vegetables'
      },
      suffix: 'by market priority.',
      intro: 'Technical and commercial references presented for professional sourcing, ordered for this market.',
      search: 'Search species or product...',
      all: 'All',
      fresh: 'Fresh',
      frozen: 'Frozen',
      references: 'references',
      reference: 'reference',
      family: 'Family',
      condition: 'Condition',
      origin: 'Origin',
      calibre: 'Calibre',
      quality: 'Quality',
      format: 'Format',
      packaging: 'Packaging',
      availability: 'Availability',
      according: 'According to availability',
      zoom: 'View image'
    },
    fr: {
      eyebrow: 'CATALOGUE',
      title: {
        fish: 'Poissons',
        shellfish: 'Crustacés',
        cephalopods: 'Céphalopodes',
        fruits: 'Fruits',
        vegetables: 'Légumes'
      },
      suffix: 'par priorité marché.',
      intro: 'Références techniques et commerciales pour le sourcing professionnel, ordonnées selon le marché français.',
      search: 'Rechercher une espèce ou un produit...',
      all: 'Tous',
      fresh: 'Frais',
      frozen: 'Surgelé',
      references: 'références',
      reference: 'référence',
      family: 'Famille',
      condition: 'État',
      origin: 'Origine',
      calibre: 'Calibre',
      quality: 'Qualité',
      format: 'Format',
      packaging: 'Conditionnement',
      availability: 'Disponibilité',
      according: 'Selon disponibilité',
      zoom: 'Voir l’image'
    },
    it: {
      eyebrow: 'CATALOGO',
      title: {
        fish: 'Pesce',
        shellfish: 'Crostacei',
        cephalopods: 'Cefalopodi',
        fruits: 'Frutta',
        vegetables: 'Ortaggi'
      },
      suffix: 'per priorità di mercato.',
      intro: 'Riferimenti tecnici e commerciali per il sourcing professionale, ordinati secondo il mercato italiano.',
      search: 'Cerca specie o prodotto...',
      all: 'Tutti',
      fresh: 'Fresco',
      frozen: 'Surgelato',
      references: 'referenze',
      reference: 'referenza',
      family: 'Famiglia',
      condition: 'Stato',
      origin: 'Origine',
      calibre: 'Calibro',
      quality: 'Qualità',
      format: 'Formato',
      packaging: 'Imballaggio',
      availability: 'Disponibilità',
      according: 'Secondo disponibilità',
      zoom: 'Vedi immagine'
    },
    ar: {
      eyebrow: 'كتالوج المنتجات',
      title: {
        fish: 'الأسماك',
        shellfish: 'القشريات',
        cephalopods: 'الرخويات',
        fruits: 'الفواكه',
        vegetables: 'الخضروات'
      },
      suffix: 'حسب أولوية السوق.',
      intro: 'مراجع فنية وتجارية للمشترين المحترفين، مرتبة وفق أولوية سوق الشرق الأوسط.',
      search: 'ابحث عن نوع أو منتج...',
      all: 'الكل',
      fresh: 'طازج',
      frozen: 'مجمد',
      references: 'مراجع',
      reference: 'مرجع',
      family: 'الفئة',
      condition: 'الحالة',
      origin: 'المنشأ',
      calibre: 'العيار',
      quality: 'الجودة',
      format: 'الشكل',
      packaging: 'التعبئة',
      availability: 'التوفر',
      according: 'حسب التوفر',
      zoom: 'عرض الصورة'
    }
  }[lang] || null;
  if (!labels) return;

  const title = labels.title[subcategory];
  const esc = value => String(value ?? '').replace(/[&<>\"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '\"': '&quot;',
    "'": '&#39;'
  }[c]));
  const norm = value => String(value || '').trim().toLowerCase();
  const getImages = (map, id) => {
    const value = map?.[id];
    if (Array.isArray(value)) return naturalImages(value);
    if (value && Array.isArray(value.images)) return naturalImages(value.images);
    if (value && value.image) return naturalImages([value.image]);
    return [];
  };
  const naturalImages = values => [...values].sort((a, b) => {
    const file = v => String(v).split('/').pop().replace(/\.[^.]+$/, '').trim();
    const parse = v => {
      const f = file(v);
      const m = f.match(/^(.*?)(?:\s*[-_ ]?\(?\s*(\d+)\s*\)?)?$/);
      return {
        base: (m?.[1] || f).trim(),
        n: m?.[2] ? Number(m[2]) : 0,
        numbered: !!m?.[2],
        raw: f
      };
    };
    const x = parse(a), y = parse(b);
    const base = x.base.localeCompare(y.base, undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    if (base) return base;
    if (x.numbered !== y.numbered) return x.numbered ? 1 : -1;
    if (x.n !== y.n) return x.n - y.n;
    return x.raw.localeCompare(y.raw, undefined, {
      numeric: true,
      sensitivity: 'base'
    });
  });

  const itTechnicalTranslations = {
    'Túnez': 'Tunisia',
    'Según disponibilidad': 'Secondo disponibilità',
    'Según mercado': 'Secondo mercato',
    'Especificación profesional': 'Specifica professionale',
    'Según campaña y disponibilidad': 'Secondo campagna e disponibilità',
    'Según programa de suministro': 'Secondo programma di fornitura',
    'Según especie y programa de suministro': 'Secondo specie e programma di fornitura',
    'Según origen': 'Secondo origine',
    'Mediterráneo / según disponibilidad': 'Mediterraneo / secondo disponibilità',
    'Mediterráneo / Atlántico según disponibilidad': 'Mediterraneo / Atlantico secondo disponibilità',
    'Atlántico / Mediterráneo según disponibilidad': 'Atlantico / Mediterraneo secondo disponibilità',
    'FAO 27 / FAO 37 según origen': 'FAO 27 / FAO 37 secondo origine',
    'Entero / según destino': 'Intero / secondo destinazione',
    'Entera / según destino': 'Intera / secondo destinazione',
    'Entero / cola / según destino': 'Intero / coda / secondo destinazione',
    'Según requisitos del destino': 'Secondo requisiti della destinazione',
    'Según mercado': 'Secondo mercato'
  };

  const translateItValue = value => {
    const translateOne = item => {
      const raw = String(item ?? '');
      if (itTechnicalTranslations[raw]) return itTechnicalTranslations[raw];
      return raw
        .replace(/\bTúnez\b/g, 'Tunisia')
        .replace(/Según campaña y disponibilidad/g, 'Secondo campagna e disponibilità')
        .replace(/Según disponibilidad/g, 'Secondo disponibilità')
        .replace(/Según mercado/g, 'Secondo mercato')
        .replace(/Especificación profesional/g, 'Specifica professionale')
        .replace(/Según programa de suministro/g, 'Secondo programma di fornitura')
        .replace(/Según especie y programma di suministro/g, 'Secondo specie e programma di fornitura')
        .replace(/Según especie y programa de suministro/g, 'Secondo specie e programma di fornitura')
        .replace(/Según origen/g, 'Secondo origine')
        .replace(/Mediterráneo/g, 'Mediterraneo')
        .replace(/Atlántico/g, 'Atlantico')
        .replace(/Entero/g, 'Intero')
        .replace(/Entera/g, 'Intera');
    };
    return Array.isArray(value) ? value.filter(Boolean).map(translateOne).join(' / ') : translateOne(value);
  };

  Promise.all([fetch(CATALOG_URL, {
    cache: 'no-cache'
  }).then(r => r.json()), fetch(PRIORITY_URL, {
    cache: 'no-cache'
  }).then(r => r.json()), fetch(IMAGES_URL, {
    cache: 'no-cache'
  }).then(r => r.ok ? r.json() : {})])
    .then(([catalog, priority, imageMap]) => {
      const marketOrder = priority?.priority?.[`${family}/${subcategory}`]?.[lang] || [];
      const orderIndex = new Map(marketOrder.map((id, i) => [id, i]));
      const allowedSubcategories = subcategory === 'fruits' ?
        new Set(['fruits', 'citrus', 'exotics', 'core-produce']) : new Set([subcategory]);
      const products = (catalog.products || []).filter(p => p.status !== 'inactive' && p
        .family === family && allowedSubcategories.has(p.subcategory));
      if (!products.length) return;
      products.sort((a, b) => {
        const ai = orderIndex.has(a.id) ? orderIndex.get(a.id) : 99999,
          bi = orderIndex.has(b.id) ? orderIndex.get(b.id) : 99999;
        if (ai !== bi) return ai - bi;
        return String(a.commercialName || a.id).localeCompare(String(b.commercialName || b.id), undefined, {
          numeric: true,
          sensitivity: 'base'
        });
      });
      render(products, priority, imageMap, orderIndex);
    }).catch(err => console.warn('[EMPERIO TISS] market catalogue unavailable', err));

  function render(products, priority, imageMap, orderIndex) {
    const existing = document.querySelector('.market-catalogue');
    if (existing) return;
    document.documentElement.classList.add('market-catalogue-active');
    if (!document.querySelector('link[data-market-catalogue-css]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/css/catalogue-market-unified.css?v=20260909.2';
      link.dataset.marketCatalogueCss = 'true';
      document.head.appendChild(link);
    }
    document.querySelectorAll('.compact-catalog').forEach(el => {
      el.hidden = true;
      el.setAttribute('aria-hidden', 'true');
    });
    document.querySelectorAll('.fish-catalog').forEach(el => {
      el.hidden = true;
      el.setAttribute('aria-hidden', 'true');
    });
    const section = document.createElement('section');
    section.className = 'market-catalogue';
    section.id = 'marketCatalogue';
    const marketName = priority?.locales?.[lang]?.market || lang.toUpperCase();
    section.innerHTML =
      `<div class="market-catalogue__inner"><div class="market-catalogue__head"><div><p class="market-catalogue__eyebrow">${labels.eyebrow} / ${String(orderIndex.size || 0).padStart(2, '0')}</p><h2 class="market-catalogue__title">${esc(title)}<br><em>${esc(labels.suffix)}</em></h2></div><p class="market-catalogue__intro">${esc(labels.intro)}</p></div><div class="market-catalogue__context"><span class="market-catalogue__tag">${esc(marketName)}</span><span class="market-catalogue__tag">${esc(subcategory)}</span></div><div class="market-catalogue__toolbar"><input class="market-catalogue__search" type="search" placeholder="${esc(labels.search)}" aria-label="${esc(labels.search)}"><p class="market-catalogue__count"></p></div><div class="market-catalogue__filters"><button class="market-catalogue__filter" data-state="all" aria-pressed="true">${labels.all}</button><button class="market-catalogue__filter" data-state="fresh" aria-pressed="false">${labels.fresh}</button><button class="market-catalogue__filter" data-state="frozen" aria-pressed="false">${labels.frozen}</button></div><div class="market-catalogue__grid" aria-live="polite"></div></div>`;
    const main = document.querySelector('main');
    const anchor = main?.querySelector('.fish-emblematic,.cta,.ar-cta') || null;
    if (anchor) anchor.insertAdjacentElement('afterend', section);
    else main?.appendChild(section);
    if (!main) return;
    const grid = section.querySelector('.market-catalogue__grid'),
      search = section.querySelector('.market-catalogue__search'),
      count = section.querySelector('.market-catalogue__count');
    let state = 'all';
    const translatedName = p => priority?.names?.[p.id]?.[lang] || p.commercialName || p.id;
    const translateValue = value => lang === 'it' ? translateItValue(value) : value;
    const capitalizeCatalogueLabel = value => String(value ?? '').replace(/(^|[\s/-])([a-zà-ÿ])/giu, (_, prefix, letter) => `${prefix}${letter.toLocaleUpperCase()}`);
    const categoryLabel = p => capitalizeCatalogueLabel(translateValue(p.catalogGroup || p.category || p.subcategory || subcategory));
    const conditionLabel = p => (p.condition || []).map(c => norm(c) === 'fresh' ? labels.fresh :
      norm(c) === 'frozen' ? labels.frozen : translateValue(c)).join(' / ') || labels.according;
    const details = p => [
      [labels.family, categoryLabel(p)],
      [labels.condition, conditionLabel(p)],
      [labels.origin, translateValue((p.origin || []).join(' / ') || labels.according)],
      [labels.calibre, translateValue((p.calibre || []).join(' / ') || labels.according)],
      [labels.quality, translateValue((p.quality || []).join(' / ') || labels.according)],
      [labels.format, translateValue((p.format || []).join(' / ') || labels.according)],
      [labels.packaging, translateValue((p.packaging || []).join(' / ') || labels.according)],
      [labels.availability, translateValue((p.availability || []).join(' / ') || labels.according)]
    ].map(([k, v]) =>
      `<div class="market-catalogue-card__detail"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`
    ).join('');
    const renderCards = () => {
      const q = norm(search.value);
      const visible = products.filter(p => {
        const cOk = state === 'all' || (p.condition || []).map(norm).includes(state);
        const hay = [translatedName(p), p.commercialName, p.scientificName, ...(p.origin || []), ...(p.quality || [])]
          .join(' ').toLowerCase();
        return cOk && (!q || hay.includes(q));
      });
      count.textContent = `${visible.length} ${visible.length === 1 ? labels.reference : labels.references}`;
      grid.innerHTML = visible.length ? visible.map(p => {
        const images = getImages(imageMap, p.id);
        const img = images[0] || p.image || '';
        const priorityBadge = orderIndex.has(p.id) && lang !== 'it' ?
          `<span class="market-catalogue-card__priority">${lang === 'ar' ? 'أولوية السوق' : 'Market priority'}</span>` : '';
        return `<article class="market-catalogue-card" data-product-id="${esc(p.id)}"><div class="market-catalogue-card__media" data-images='${esc(JSON.stringify(images))}'>${img ? `<img src="${esc(img)}" alt="${esc(translatedName(p))}" loading="lazy" draggable="false">` : '<span class="market-catalogue-card__placeholder">EMPERIO TISS</span>'}${priorityBadge}</div><div class="market-catalogue-card__body"><p class="market-catalogue-card__meta">${esc(categoryLabel(p))}</p><h3 class="market-catalogue-card__name">${esc(translatedName(p))}</h3>${p.scientificName ? `<p class="market-catalogue-card__scientific"><em>${esc(p.scientificName)}</em></p>` : ''}<div class="market-catalogue-card__details">${details(p)}</div></div></article>`;
      }).join('') : `<p class="market-catalogue__empty">${lang === 'ar' ? 'لا توجد مراجع مطابقة.' : lang === 'fr' ? 'Aucune référence ne correspond.' : lang === 'it' ? 'Nessuna referenza corrisponde.' : 'No references match your search.'}`;
      bindLightboxes();
    };
    const bindLightboxes = () => grid.querySelectorAll('.market-catalogue-card__media').forEach(media => {
      const images = JSON.parse(media.dataset.images || '[]');
      if (!images.length) return;
      media.addEventListener('click', () => openLightbox(images));
    });
    const openLightbox = images => {
      let i = 0;
      const box = document.createElement('div');
      box.className = 'market-catalogue__lightbox';
      box.innerHTML = `<img src="${esc(images[0])}" alt=""><button class="market-catalogue__lb-close" type="button">×</button><button class="market-catalogue__lb-prev" type="button">‹</button><button class="market-catalogue__lb-next" type="button">›</button><span class="market-catalogue__lb-counter">1 / ${images.length}</span>`;
      document.body.appendChild(box);
      document.body.style.overflow = 'hidden';
      const img = box.querySelector('img'), counter = box.querySelector('.market-catalogue__lb-counter');
      const update = () => {
        img.src = images[i];
        counter.textContent = `${i + 1} / ${images.length}`;
      };
      const close = () => {
        box.remove();
        document.body.style.overflow = '';
      };
      box.querySelector('.market-catalogue__lb-close').onclick = close;
      box.onclick = e => {
        if (e.target === box) close();
      };
      box.querySelector('.market-catalogue__lb-prev').onclick = () => {
        i = (i - 1 + images.length) % images.length;
        update();
      };
      box.querySelector('.market-catalogue__lb-next').onclick = () => {
        i = (i + 1) % images.length;
        update();
      };
      if (images.length < 2) {
        box.querySelector('.market-catalogue__lb-prev').hidden = true;
        box.querySelector('.market-catalogue__lb-next').hidden = true;
      }
      const key = e => {
        if (e.key === 'Escape') {
          close();
          document.removeEventListener('keydown', key);
        }
        if (e.key === 'ArrowLeft') {
          i = (i - 1 + images.length) % images.length;
          update();
        }
        if (e.key === 'ArrowRight') {
          i = (i + 1) % images.length;
          update();
        }
      };
      document.addEventListener('keydown', key);
    };
    section.querySelectorAll('.market-catalogue__filter').forEach(button => button.addEventListener('click', () => {
      state = button.dataset.state || 'all';
      section.querySelectorAll('.market-catalogue__filter').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      renderCards();
    }));
    search.addEventListener('input', renderCards);
    renderCards();
  }
})();
