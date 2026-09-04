(() => {
  'use strict';

  const DATA_URL = '/assets/data/fruit-catalog-v1.json';
  const labels = {
    es: {catalogue:'CATÁLOGO',title:'Frutas',subtitle:'Por familia.',detail:'Ver ficha',fresh:'Fresco',request:'Solicitar referencia',citrus:'Cítricos',exotics:'Exóticos','core-produce':'Fruta seleccionada'},
    en: {catalogue:'CATALOGUE',title:'Fruit',subtitle:'By family.',detail:'View specification',fresh:'Fresh',request:'Request reference',citrus:'Citrus',exotics:'Exotics','core-produce':'Selected fruit'},
    fr: {catalogue:'CATALOGUE',title:'Fruits',subtitle:'Par famille.',detail:'Voir la fiche',fresh:'Frais',request:'Demander la référence',citrus:'Agrumes',exotics:'Exotiques','core-produce':'Fruits sélectionnés'},
    ar: {catalogue:'الكتالوج',title:'الفواكه',subtitle:'حسب الفئة.',detail:'عرض المواصفات',fresh:'طازج',request:'طلب المرجع',citrus:'حمضيات',exotics:'فواكه استوائية','core-produce':'فواكه مختارة'},
    it: {catalogue:'CATALOGO',title:'Frutta',subtitle:'Per famiglia.',detail:'Vedi scheda',fresh:'Fresco',request:'Richiedi referenza',citrus:'Agrumi',exotics:'Esotici','core-produce':'Frutta selezionata'}
  };
  const lang = (document.documentElement.lang || 'es').slice(0,2).toLowerCase();
  const t = labels[lang] || labels.es;
  const esc = value => String(value ?? '').replace(/[&<>\"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[char]));
  const imageOverrides = {
    clementina:'https://images.pexels.com/photos/16155998/pexels-photo-16155998.jpeg?auto=compress&cs=tinysrgb&w=1200',
    mandarina:'https://images.pexels.com/photos/16155998/pexels-photo-16155998.jpeg?auto=compress&cs=tinysrgb&w=1200',
    orange:'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=1200',
    mango:'https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?auto=compress&cs=tinysrgb&w=1200',
    pineapple:'https://images.pexels.com/photos/947879/pexels-photo-947879.jpeg?auto=compress&cs=tinysrgb&w=1200',
    avocado:'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=1200',
    dates:'https://images.pexels.com/photos/1450846/pexels-photo-1450846.jpeg?auto=compress&cs=tinysrgb&w=1200',
    melon:'https://images.pexels.com/photos/1174253/pexels-photo-1174253.jpeg?auto=compress&cs=tinysrgb&w=1200',
    watermelon:'https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg?auto=compress&cs=tinysrgb&w=1200',
    apple:'https://images.pexels.com/photos/572952/pexels-photo-572952.jpeg?auto=compress&cs=tinysrgb&w=1200'
  };

  function ensureStyles() {
    if (document.getElementById('etFruitCatalogStyles')) return;
    const style = document.createElement('style');
    style.id = 'etFruitCatalogStyles';
    style.textContent = `
      .produce-fruits-page .fruit-special-catalog{padding-block:clamp(4rem,8vw,7rem)}
      .produce-fruits-page .fruit-special-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,.7fr);gap:3rem;align-items:end;margin-bottom:2.6rem}
      .produce-fruits-page .fruit-special-head h2{font-family:var(--et-serif,Georgia,serif);font-weight:400;font-size:clamp(2.7rem,6vw,5rem);line-height:.95;margin:.35rem 0 0}
      .produce-fruits-page .fruit-special-head h2 em{font-style:italic}
      .produce-fruits-page .fruit-special-note{margin:0;color:var(--et-muted,#6d756f);line-height:1.7;max-width:34rem}
      .produce-fruits-page .fruit-special-group{margin-top:4rem}
      .produce-fruits-page .fruit-special-group:first-of-type{margin-top:0}
      .produce-fruits-page .fruit-special-group-title{display:flex;align-items:baseline;gap:1rem;border-bottom:1px solid rgba(16,37,28,.15);padding-bottom:.8rem;margin-bottom:1.25rem}
      .produce-fruits-page .fruit-special-group-title span{font:600 .62rem/1 var(--et-sans,Arial,sans-serif);letter-spacing:.14em;text-transform:uppercase;color:var(--et-gold,#c9a35f)}
      .produce-fruits-page .fruit-special-group-title h3{margin:0;font-family:var(--et-serif,Georgia,serif);font-weight:400;font-size:1.8rem}
      .produce-fruits-page .fruit-special-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.35rem}
      .produce-fruits-page .fruit-special-grid .product-card{height:100%}
      @media(max-width:980px){.produce-fruits-page .fruit-special-head{grid-template-columns:1fr}.produce-fruits-page .fruit-special-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:640px){.produce-fruits-page .fruit-special-catalog{padding-block:3.25rem}.produce-fruits-page .fruit-special-grid{grid-template-columns:1fr}.produce-fruits-page .fruit-special-group{margin-top:3rem}}
    `;
    document.head.appendChild(style);
  }

  function getCard(product) {
    if (!window.EMPERIO_TISS_CATALOG?.card) return '';
    const enriched = { ...product };
    if (imageOverrides[product.id]) {
      enriched.image = imageOverrides[product.id];
      enriched.images = [imageOverrides[product.id]];
    }
    return window.EMPERIO_TISS_CATALOG.card(enriched);
  }

  async function init() {
    const target = document.getElementById('fruitCatalog');
    if (!target) return;
    ensureStyles();
    try {
      const response = await fetch(DATA_URL, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Fruit catalog request failed: ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.products)) throw new Error('Invalid fruit catalog');
      const groups = ['citrus','exotics','core-produce'];
      target.className = 'fruit-special-catalog';
      target.innerHTML = `<div class="fruit-special-head"><div><span class="eyebrow">${esc(t.catalogue)}</span><h2>${esc(t.title)}<br><em>${esc(t.subtitle)}</em></h2></div><p class="fruit-special-note">${lang==='en'?'A focused selection defined by origin, variety, calibre, quality and supply programme.':lang==='fr'?'Une sélection ciblée définie par l’origine, la variété, le calibre, la qualité et le programme d’approvisionnement.':lang==='ar'?'مجموعة مختارة بعناية وفق المنشأ والصنف والمقاس والجودة وبرنامج التوريد.':lang==='it'?'Una selezione mirata definita da origine, varietà, calibro, qualità e programma di fornitura.':'Una selección enfocada, definida por origen, variedad, calibre, calidad y programa de suministro.'}</p></div>`;
      groups.forEach(group => {
        const products = data.products.filter(product => product.subcategory === group && product.status === 'active');
        if (!products.length) return;
        const section = document.createElement('section');
        section.className = 'fruit-special-group';
        section.innerHTML = `<div class="fruit-special-group-title"><span>0${groups.indexOf(group)+1}</span><h3>${esc(t[group])}</h3></div><div class="fruit-special-grid"></div>`;
        section.querySelector('.fruit-special-grid').innerHTML = products.map(getCard).join('');
        target.appendChild(section);
      });
      document.documentElement.dataset.fruitCatalogReady = 'true';
    } catch (error) {
      console.error('[EMPERIO TISS] Fruit catalog failed:', error);
      document.documentElement.dataset.fruitCatalogReady = 'false';
    }
  }

  function boot() {
    if (window.EMPERIO_TISS_CATALOG) init();
    else setTimeout(boot, 80);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();
