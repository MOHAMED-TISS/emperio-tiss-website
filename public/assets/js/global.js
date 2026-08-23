(() => {
  'use strict';
  const doc = document;
  const loadCss = (href, key) => {
    if (doc.querySelector(`link[data-${key}]`)) return;
    const link = doc.createElement('link');
    link.rel = 'stylesheet'; link.href = href; link.dataset[key] = 'true';
    doc.head.appendChild(link);
  };
  const loadScript = (src, key) => {
    if (doc.querySelector(`script[data-${key}]`)) return;
    const script = doc.createElement('script');
    script.src = src; script.async = false; script.dataset[key] = 'true';
    doc.head.appendChild(script);
  };
  loadCss('/assets/css/site-pages.css?v=20260821-3', 'etSitePages');
  loadCss('/assets/css/site-pages-unified.css?v=20260821-1', 'etUnifiedPages');
  loadCss('/assets/css/canonical-nav.css?v=20260823-taxonomy-5', 'etCanonicalNav');
  loadCss('/assets/css/catalogue-taxonomy.css?v=20260823-catalogue-1', 'etCatalogueTaxonomy');
  loadCss('/assets/css/nav-consistency.css?v=20260823-nav-1', 'etNavConsistency');

  // Catalogue image protection. This is intentionally scoped to catalogue
  // imagery only; navigation, text, forms and the rest of the site remain
  // fully interactive.
  const catalogueImageSelector = [
    '.fish-catalog-card img',
    '.catalog-card img',
    '.catalog-product img',
    '.fish-gallery__image',
    '.fish-lightbox__image',
    '[data-catalog] img',
    '.compact-catalog img',
    '.seafood-catalog img',
    '.fish-emblematic-card img'
  ].join(',');

  const protectCatalogueImages = (root = doc) => {
    root.querySelectorAll(catalogueImageSelector).forEach((img) => {
      img.setAttribute('draggable', 'false');
      img.setAttribute('oncontextmenu', 'return false');
      img.setAttribute('ondragstart', 'return false');
      img.setAttribute('onselectstart', 'return false');
      img.style.userSelect = 'none';
      img.style.webkitUserDrag = 'none';
      img.style.webkitTouchCallout = 'none';
    });
  };

  protectCatalogueImages();

  doc.addEventListener('contextmenu', (event) => {
    if (event.target.closest(catalogueImageSelector)) event.preventDefault();
  }, true);

  doc.addEventListener('dragstart', (event) => {
    const image = event.target.closest('img');
    if (image && image.matches(catalogueImageSelector)) event.preventDefault();
  }, true);

  doc.addEventListener('selectstart', (event) => {
    if (event.target.closest(catalogueImageSelector)) event.preventDefault();
  }, true);

  const protectionObserver = new MutationObserver(() => protectCatalogueImages());
  protectionObserver.observe(doc.documentElement, { childList: true, subtree: true });

  if ((doc.documentElement.lang || '').toLowerCase().startsWith('es') && doc.body?.classList.contains('fish-catalog-pilot')) {
    const fallback = [
      ['dorada','Dorada','Sparus aurata','Pez de escama','Blanco / semigraso','fresh'],['lubina','Lubina','Dicentrarchus labrax','Pez de escama','Blanco / semigraso','fresh'],['merluza-pijota','Merluza / Pijota','Merluccius spp.','Pez de escama','Blanco / semigraso','fresh'],['mujol','Mújol','Mugil cephalus','Pez de escama','Blanco / semigraso','fresh'],['rape','Rape','Lophius spp.','Pez de escama','Blanco / semigraso','fresh'],['san-pedro','San Pedro','Zeus faber','Pez de escama','Blanco / semigraso','fresh'],['mero-amarillo','Mero amarillo','Epinephelus spp.','Pez de escama','Blanco / semigraso','fresh'],['pargo','Pargo','Lutjanus spp.','Pez de escama','Blanco / semigraso','fresh'],['denton','Dentón','Dentex dentex','Pez de escama','Blanco / semigraso','fresh'],['sama','Sama','Dentex spp.','Pez de escama','Blanco / semigraso','fresh'],['sargo','Sargo','Diplodus spp.','Pez de escama','Blanco / semigraso','fresh'],['rascacio','Rascacio','Scorpaena spp.','Pez de escama','Blanco / semigraso','fresh'],['caballa','Caballa','Scomber spp.','Pez de escama','Azul / graso','fresh|frozen'],['salmonete','Salmonete','Mullus spp.','Pez de escama','Azul / graso','fresh'],['atun','Atún','Thunnus spp.','Pez de escama','Azul / graso','fresh'],['pez-limon','Pez limón','Seriola dumerili','Pez de escama','Azul / graso','fresh'],['boqueron','Boquerón','Engraulis encrasicolus','Pez de escama','Azul / graso','fresh'],['pez-sable','Pez sable','Trichiurus spp.','Pescados especiales','Especial','fresh'],['pez-espada','Pez espada','Xiphias gladius','Pescados especiales','Especial','fresh']
    ].map(([id, commercialName, scientificName, group, type, condition]) => ({id,commercialName,scientificName,group,type,condition:condition.split('|'),origin:['Según disponibilidad'],faoZone:['Según origen'],calibre:['Según disponibilidad'],quality:['Especificación profesional'],format:['Según destino'],packaging:['Según mercado'],availability:['Según disponibilidad']}));
    const nativeFetch = window.fetch.bind(window);
    window.fetch = (...args) => nativeFetch(...args).then(response => {
      if (String(args[0] || '').includes('/assets/data/fish-catalog-es.json') && !response.ok) return new Response(JSON.stringify({schemaVersion:'1.0',language:'es',products:fallback}), {status:200,headers:{'Content-Type':'application/json'}});
      return response;
    }).catch(error => {
      if (String(args[0] || '').includes('/assets/data/fish-catalog-es.json')) return new Response(JSON.stringify({schemaVersion:'1.0',language:'es',products:fallback}), {status:200,headers:{'Content-Type':'application/json'}});
      throw error;
    });
  }

  loadScript('/assets/js/global-core.js?v=20260823-taxonomy-5', 'etGlobalCore');
  loadScript('/assets/js/catalog-polish.js?v=20260823-catalogue-polish-1', 'etCatalogPolish');
  loadScript('/assets/js/site-polish.js?v=20260823-site-polish-1', 'etSitePolish');
})();
