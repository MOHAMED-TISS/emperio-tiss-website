/* EMPERIO TISS — Fruits catalogue, image-led editorial layout. */
(() => {
  'use strict';

  const DATA_URL = '/assets/data/fruit-catalog-v1.json';

  const I18N = {
    es: {
      kicker: 'CATÁLOGO DE FRUTAS',
      title: 'Selección profesional',
      subtitle: 'por origen y campaña.',
      intro: 'Frutas seleccionadas para compradores profesionales. Variedad, origen, calibre y programa de suministro según mercado.',
      citrus: 'Cítricos',
      other: 'Otras frutas',
      origin: 'Origen',
      varieties: 'Variedades',
      campaign: 'Campaña',
      availability: 'Según campaña y programa',
      consult: 'Consultar producto',
      selection: 'Explorar catálogo',
      citrusCopy: 'Clementinas, mandarinas y naranjas seleccionadas para programas profesionales.',
      otherCopy: 'Fruta mediterránea, tropical y de temporada para distintos mercados y programas de suministro.',
      datesOrigin: 'Túnez / Oriente Medio'
    },
    en: {
      kicker: 'FRUIT CATALOGUE',
      title: 'Professional selection',
      subtitle: 'by origin and season.',
      intro: 'Fruit selected for professional buyers. Variety, origin, sizing and supply programme according to market.',
      citrus: 'Citrus',
      other: 'Other fruit',
      origin: 'Origin',
      varieties: 'Varieties',
      campaign: 'Season',
      availability: 'According to season and programme',
      consult: 'Request product',
      selection: 'Explore catalogue',
      citrusCopy: 'Clementines, mandarins and oranges selected for professional programmes.',
      otherCopy: 'Mediterranean, tropical and seasonal fruit for different markets and supply programmes.',
      datesOrigin: 'Tunisia / Middle East'
    },
    fr: {
      kicker: 'CATALOGUE FRUITS',
      title: 'Sélection professionnelle',
      subtitle: 'par origine et campagne.',
      intro: 'Fruits sélectionnés pour les acheteurs professionnels. Variété, origine, calibre et programme selon le marché.',
      citrus: 'Agrumes',
      other: 'Autres fruits',
      origin: 'Origine',
      varieties: 'Variétés',
      campaign: 'Campagne',
      availability: 'Selon campagne et programme',
      consult: 'Consulter le produit',
      selection: 'Explorer le catalogue',
      citrusCopy: 'Clémentines, mandarines et oranges sélectionnées pour les programmes professionnels.',
      otherCopy: 'Fruits méditerranéens, tropicaux et saisonniers pour différents marchés et programmes.',
      datesOrigin: 'Tunisie / Moyen-Orient'
    },
    it: {
      kicker: 'CATALOGO FRUTTA',
      title: 'Selezione professionale',
      subtitle: 'per origine e stagione.',
      intro: 'Frutta selezionata per acquirenti professionali. Varietà, origine, calibro e programma secondo il mercato.',
      citrus: 'Agrumi',
      other: 'Altra frutta',
      origin: 'Origine',
      varieties: 'Varietà',
      campaign: 'Stagione',
      availability: 'Secondo stagione e programma',
      consult: 'Richiedi prodotto',
      selection: 'Esplora il catalogo',
      citrusCopy: 'Clementine, mandarini e arance selezionati per programmi professionali.',
      otherCopy: 'Frutta mediterranea, tropicale e stagionale per diversi mercati e programmi.',
      datesOrigin: 'Tunisia / Medio Oriente'
    },
    ar: {
      kicker: 'دليل الفواكه',
      title: 'اختيار احترافي',
      subtitle: 'حسب المنشأ والموسم.',
      intro: 'فواكه مختارة للمشترين المحترفين حسب الصنف والمنشأ والحجم وبرنامج التوريد.',
      citrus: 'الحمضيات',
      other: 'فواكه أخرى',
      origin: 'المنشأ',
      varieties: 'الأصناف',
      campaign: 'الموسم',
      availability: 'حسب الموسم والبرنامج',
      consult: 'استفسر عن المنتج',
      selection: 'استكشف الدليل',
      citrusCopy: 'كلمنتينا ويوسفي وبرتقال مختار لبرامج التوريد المهنية.',
      otherCopy: 'فواكه متوسطية واستوائية وموسمية لأسواق وبرامج توريد مختلفة.',
      datesOrigin: 'تونس / الشرق الأوسط'
    }
  };

  const lang = document.documentElement.lang?.toLowerCase().slice(0, 2) || 'es';
  const t = I18N[lang] || I18N.es;

  const PRODUCT_NAMES = {
    es: { clementina:'Clementina', mandarina:'Mandarina', orange:'Naranja', mango:'Mango', pineapple:'Piña', avocado:'Aguacate', dates:'Dátiles', melon:'Melón', watermelon:'Sandía', apple:'Manzana', granada:'Granada' },
    en: { clementina:'Clementine', mandarina:'Mandarin', orange:'Orange', mango:'Mango', pineapple:'Pineapple', avocado:'Avocado', dates:'Dates', melon:'Melon', watermelon:'Watermelon', apple:'Apple', granada:'Pomegranate' },
    fr: { clementina:'Clémentine', mandarina:'Mandarine', orange:'Orange', mango:'Mangue', pineapple:'Ananas', avocado:'Avocat', dates:'Dattes', melon:'Melon', watermelon:'Pastèque', apple:'Pomme', granada:'Grenade' },
    it: { clementina:'Clementina', mandarina:'Mandarino', orange:'Arancia', mango:'Mango', pineapple:'Ananas', avocado:'Avocado', dates:'Datteri', melon:'Melone', watermelon:'Anguria', apple:'Mela', granada:'Melagrana' },
    ar: { clementina:'كلمنتينا', mandarina:'يوسفي', orange:'برتقال', mango:'مانجو', pineapple:'أناناس', avocado:'أفوكادو', dates:'تمور', melon:'شمام', watermelon:'بطيخ', apple:'تفاح', granada:'رمان' }
  };

  const ORIGINS = {
    es: {
      clementina:'España / Marruecos según campaña', mandarina:'España / Marruecos según campaña', orange:'España / Marruecos según campaña',
      mango:'España / Marruecos / según temporada', pineapple:'Según temporada y programa de suministro', avocado:'España / Marruecos / según programa',
      dates:'Túnez / Oriente Medio', melon:'España / Marruecos según temporada', watermelon:'España / Marruecos según temporada',
      apple:'Según programa de suministro', granada:'España / Marruecos según campaña'
    },
    en: {
      clementina:'Spain / Morocco depending on season', mandarina:'Spain / Morocco depending on season', orange:'Spain / Morocco depending on season',
      mango:'Spain / Morocco / depending on season', pineapple:'According to season and supply programme', avocado:'Spain / Morocco / according to programme',
      dates:'Tunisia / Middle East', melon:'Spain / Morocco depending on season', watermelon:'Spain / Morocco depending on season',
      apple:'According to supply programme', granada:'Spain / Morocco depending on season'
    },
    fr: {
      clementina:'Espagne / Maroc selon campagne', mandarina:'Espagne / Maroc selon campagne', orange:'Espagne / Maroc selon campagne',
      mango:'Espagne / Maroc / selon saison', pineapple:'Selon saison et programme d’approvisionnement', avocado:'Espagne / Maroc / selon programme',
      dates:'Tunisie / Moyen-Orient', melon:'Espagne / Maroc selon saison', watermelon:'Espagne / Maroc selon saison',
      apple:'Selon programme d’approvisionnement', granada:'Espagne / Maroc selon campagne'
    },
    it: {
      clementina:'Spagna / Marocco secondo stagione', mandarina:'Spagna / Marocco secondo stagione', orange:'Spagna / Marocco secondo stagione',
      mango:'Spagna / Marocco / secondo stagione', pineapple:'Secondo stagione e programma di fornitura', avocado:'Spagna / Marocco / secondo programma',
      dates:'Tunisia / Medio Oriente', melon:'Spagna / Marocco secondo stagione', watermelon:'Spagna / Marocco secondo stagione',
      apple:'Secondo programma di fornitura', granada:'Spagna / Marocco secondo stagione'
    },
    ar: {
      clementina:'إسبانيا / المغرب حسب الموسم', mandarina:'إسبانيا / المغرب حسب الموسم', orange:'إسبانيا / المغرب حسب الموسم',
      mango:'إسبانيا / المغرب / حسب الموسم', pineapple:'حسب الموسم وبرنامج التوريد', avocado:'إسبانيا / المغرب / حسب البرنامج',
      dates:'تونس / الشرق الأوسط', melon:'إسبانيا / المغرب حسب الموسم', watermelon:'إسبانيا / المغرب حسب الموسم',
      apple:'حسب برنامج التوريد', granada:'إسبانيا / المغرب حسب الموسم'
    }
  };

  const VARIETY_TRANSLATIONS = {
    en: {'Sin semillas':'Seedless','Con semillas':'Seeded'},
    fr: {'Sin semillas':'Sans pépins','Con semillas':'Avec pépins'},
    it: {'Sin semillas':'Senza semi','Con semillas':'Con semi'},
    ar: {'Sin semillas':'بدون بذور','Con semillas':'ببذور'}
  };

  const CONTACT_PREFIX = { es:'/contact/', en:'/en/contact/', fr:'/fr/contact/', it:'/it/contact/', ar:'/ar/contact/' };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
  const first = value => Array.isArray(value) ? value[0] : value;
  const unique = value => [...new Set((value || []).filter(Boolean))];

  function productCard(p, i, featured = false) {
    const displayName = PRODUCT_NAMES[lang]?.[p.id] || p.commercialName;
    const varieties = unique(p.varieties).map(v => VARIETY_TRANSLATIONS[lang]?.[v] || v);
    const href = `${CONTACT_PREFIX[lang] || CONTACT_PREFIX.es}?product=${encodeURIComponent(p.id)}`;
    const displayOrigin = ORIGINS[lang]?.[p.id] || first(p.origin);
    return `<article class="fruit-catalog-card${featured ? ' is-featured' : ''}" data-product-id="${esc(p.id)}">
      <a class="fruit-catalog-media${featured && !p.image ? ' is-placeholder' : ''}" href="${href}" aria-label="${esc(t.consult)}: ${esc(displayName)}">
        ${p.image ? `<img src="${esc(p.image)}" alt="${esc(displayName)}" loading="${featured ? 'eager' : 'lazy'}" decoding="async">` : `<div class="fruit-catalog-photo-placeholder" aria-hidden="true"><span>PHOTO</span><strong>${esc(displayName)}</strong></div>`}
        <span class="fruit-catalog-index">${String(i + 1).padStart(2, '0')}</span>
      </a>
      <div class="fruit-catalog-body">
        <div class="fruit-catalog-heading">
          <div>
            <h3>${esc(displayName)}</h3>
            <p><em>${esc(first(p.scientificName) || '')}</em></p>
          </div>
          <span class="fruit-catalog-status">${esc(t.availability)}</span>
        </div>
        <dl class="fruit-catalog-meta">
          <div><dt>${esc(t.origin)}</dt><dd>${esc(displayOrigin || '—')}</dd></div>
          <div><dt>${esc(t.varieties)}</dt><dd>${varieties.map(v => `<span>${esc(v)}</span>`).join('')}</dd></div>
        </dl>
        <a class="fruit-catalog-cta" href="${href}">${esc(t.consult)} <span aria-hidden="true">↗</span></a>
      </div>
    </article>`;
  }

  function sectionMarkup(title, copy, products, featured = false) {
    return `<section class="fruit-catalog-group" id="${featured ? 'citrusSelection' : 'fruitOtherSelection'}">
      <header class="fruit-catalog-group-head">
        <h2>${esc(title)}</h2>
        <p>${esc(copy)}</p>
      </header>
      <div class="fruit-catalog-grid${featured ? ' is-featured-grid' : ''}">
        ${products.map((p, i) => productCard(p, i, featured)).join('')}
      </div>
    </section>`;
  }

  function render(root, otherTarget, products) {
    const citrusIds = ['clementina', 'mandarina', 'orange'];
    const citrus = citrusIds.map(id => products.find(p => p.id === id)).filter(Boolean);
    const others = products
      .filter(p => !citrusIds.includes(p.id))
      .sort((a, b) => String(PRODUCT_NAMES[lang]?.[a.id] || a.commercialName || '').localeCompare(String(PRODUCT_NAMES[lang]?.[b.id] || b.commercialName || ''), lang, { sensitivity: 'base' }));

    root.innerHTML = `
      <div class="fruit-catalog-shell">
        <header class="fruit-catalog-intro">
          <div>
            <span class="fruit-catalog-kicker">${esc(t.kicker)}</span>
            <h2>${esc(t.title)}<br><em>${esc(t.subtitle)}</em></h2>
          </div>
          <p>${esc(t.intro)}</p>
        </header>
        <nav class="fruit-catalog-nav" aria-label="${esc(t.selection)}">
          <a href="#citrusSelection">${esc(t.citrus)}</a>
          <a href="#fruitOther">${esc(t.other)}</a>
        </nav>
        ${sectionMarkup(t.citrus, t.citrusCopy, citrus, true)}
      </div>`;

    if (otherTarget) {
      otherTarget.innerHTML = sectionMarkup(t.other, t.otherCopy, others, false);
    }
  }

  async function init() {
    const root = document.getElementById('fruitCatalog');
    const otherTarget = document.getElementById('fruitOther');
    if (!root) return;

    try {
      const response = await fetch(DATA_URL, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Fruit catalogue request failed: ${response.status}`);
      const data = await response.json();
      const products = Array.isArray(data.products) ? data.products.filter(p => p.status === 'active') : [];
      if (!products.length) throw new Error('Fruit catalogue is empty');
      window.__ET_CATALOG_PRODUCTS = products;
      render(root, otherTarget, products);
    } catch (error) {
      console.error('[fruit-catalog]', error);
      root.innerHTML = '<p class="catalog-error">No se pudo cargar el catálogo. <a href="/contact/?product=frutas">Contactar con el equipo</a></p>';
      if (otherTarget) otherTarget.innerHTML = '';
    }
  }

  window.ETFruitCatalog = { init };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();