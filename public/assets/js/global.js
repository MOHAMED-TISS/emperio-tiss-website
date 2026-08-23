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

  // Spanish Fish catalogue: keep the page operational even if the catalogue JSON is temporarily unavailable.
  if ((doc.documentElement.lang || '').toLowerCase().startsWith('es') && doc.body?.classList.contains('fish-catalog-pilot')) {
    const fallback = [
      ['dorada','Dorada','Sparus aurata','Pez de escama','Blanco / semigraso','fresh'],['lubina','Lubina','Dicentrarchus labrax','Pez de escama','Blanco / semigraso','fresh'],['merluza-pijota','Merluza / Pijota','Merluccius spp.','Pez de escama','Blanco / semigraso','fresh|frozen'],['mujol','Mújol','Mugil cephalus','Pez de escama','Blanco / semigraso','fresh'],['rape','Rape','Lophius spp.','Pez de escama','Blanco / semigraso','fresh|frozen'],['san-pedro','San Pedro','Zeus faber','Pez de escama','Blanco / semigraso','fresh'],['mero-amarillo','Mero amarillo','Epinephelus spp.','Pez de escama','Blanco / semigraso','fresh|frozen'],['pargo','Pargo','Lutjanus spp.','Pez de escama','Blanco / semigraso','fresh|frozen'],['denton','Dentón','Dentex dentex','Pez de escama','Blanco / semigraso','fresh'],['sama','Sama','Dentex spp.','Pez de escama','Blanco / semigraso','fresh'],['sargo','Sargo','Diplodus spp.','Pez de escama','Blanco / semigraso','fresh'],['rascacio','Rascacio','Scorpaena spp.','Pez de escama','Blanco / semigraso','fresh'],['caballa','Caballa','Scomber spp.','Pez de escama','Azul / graso','fresh|frozen'],['salmonete','Salmonete','Mullus spp.','Pez de escama','Azul / graso','fresh'],['atun','Atún','Thunnus spp.','Pez de escama','Azul / graso','fresh|frozen'],['pez-limon','Pez limón','Seriola dumerili','Pez de escama','Azul / graso','fresh'],['boqueron','Boquerón','Engraulis encrasicolus','Pez de escama','Azul / graso','fresh'],['pez-sable','Pez sable','Trichiurus spp.','Pescados especiales','Especial','fresh|frozen'],['pez-espada','Pez espada','Xiphias gladius','Pescados especiales','Especial','fresh|frozen']
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
})();
