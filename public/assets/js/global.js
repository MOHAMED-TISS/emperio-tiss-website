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
  const lang = (doc.documentElement.lang || '').slice(0,2).toLowerCase();

  loadCss('/assets/css/site-pages.css?v=20260821-3', 'etSitePages');
  loadCss('/assets/css/site-pages-unified.css?v=20260821-1', 'etUnifiedPages');
  loadCss('/assets/css/canonical-nav.css?v=20260823-taxonomy-5', 'etCanonicalNav');
  loadCss('/assets/css/catalogue-taxonomy.css?v=20260823-catalogue-1', 'etCatalogueTaxonomy');
  loadCss('/assets/css/nav-consistency.css?v=20260823-nav-1', 'etNavConsistency');
  loadCss('/assets/css/catalogue-type-scale-unified.css?v=20260823-es-baseline-2', 'etCatalogueTypeScale');
  loadCss('/assets/css/catalogue-filter-contrast-en-fr.css?v=20260823-filter-contrast-1', 'etCatalogueFilterContrast');

  if (['en','fr','ar'].includes(lang)) {
    loadScript('/assets/js/international-shell.js?v=20260823-intl-shell-1', 'etInternationalShell');
  }

  const catalogueImageSelector = ['.fish-catalog-card img','.catalog-card img','.catalog-product img','.fish-gallery__image','.fish-lightbox__image','[data-catalog] img','.compact-catalog img','.seafood-catalog img','.fish-emblematic-card img'].join(',');
  const protectCatalogueImages = (root = doc) => { root.querySelectorAll(catalogueImageSelector).forEach((img) => { img.setAttribute('draggable','false'); img.setAttribute('oncontextmenu','return false'); img.setAttribute('ondragstart','return false'); img.setAttribute('onselectstart','return false'); img.style.userSelect='none'; img.style.webkitUserDrag='none'; img.style.webkitTouchCallout='none'; }); };
  protectCatalogueImages();
  doc.addEventListener('contextmenu',(event)=>{if(event.target.closest(catalogueImageSelector))event.preventDefault();},true);
  doc.addEventListener('dragstart',(event)=>{const image=event.target.closest('img');if(image&&image.matches(catalogueImageSelector))event.preventDefault();},true);
  doc.addEventListener('selectstart',(event)=>{if(event.target.closest(catalogueImageSelector))event.preventDefault();},true);
  const protectionObserver=new MutationObserver(()=>protectCatalogueImages());
  protectionObserver.observe(doc.documentElement,{childList:true,subtree:true});

  loadScript('/assets/js/global-core.js?v=20260823-taxonomy-5','etGlobalCore');
  loadScript('/assets/js/catalog-polish.js?v=20260823-catalogue-polish-1','etCatalogPolish');
  loadScript('/assets/js/site-polish.js?v=20260823-site-polish-1','etSitePolish');
  loadScript('/assets/js/fish-filter-crossing.js?v=20260823-fish-filter-2','etFishFilterCrossing');
  loadScript('/assets/js/en-catalog-filter-fix.js?v=20260823-en-filter-2','etEnCatalogFilterFix');
})();