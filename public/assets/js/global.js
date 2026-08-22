(() => {
  'use strict';
  const doc = document;
  const loadCss = (href, key) => {
    if (doc.querySelector(`link[data-${key}]`)) return;
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset[key] = 'true';
    doc.head.appendChild(link);
  };
  const loadScript = (src, key) => {
    if (doc.querySelector(`script[data-${key}]`)) return;
    const script = doc.createElement('script');
    script.src = src;
    script.defer = true;
    script.dataset[key] = 'true';
    doc.head.appendChild(script);
  };

  loadCss('/assets/css/components/nav.css?v=architecture-nav-1', 'etNavigation');
  loadCss('/assets/css/site-pages.css?v=20260821-3', 'etSitePages');
  loadCss('/assets/css/site-pages-unified.css?v=20260821-1', 'etUnifiedPages');

  const path = window.location.pathname.replace(/\/+$/, '/') || '/';
  const productPath = /^\/(?:en\/|fr\/|ar\/)?products\//.test(path);
  const fishPilotPath = /^\/(?:en\/|fr\/|ar\/)?products\/seafood\/fish\/$/.test(path);
  const compactCatalog = doc.body?.dataset.compactCatalog === 'true';

  if (compactCatalog) {
    loadCss('/assets/css/compact-catalog.css?v=20260822-1', 'etCompactCatalog');
    loadScript('/assets/js/compact-catalog.js?v=20260822-1', 'etCompactCatalogScript');
  } else if (productPath && !fishPilotPath) {
    loadCss('/assets/css/catalog.css?v=20260822-2', 'etCatalog');
    loadScript('/assets/js/products-catalog.js?v=20260822-1', 'etCatalogScript');
  }
})();
