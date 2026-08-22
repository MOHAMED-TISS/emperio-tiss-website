(() => {
  'use strict';
  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;

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

  /* Legacy dynamic styles first; canonical components last so they own the final cascade. */
  loadCss('/assets/css/site-pages.css?v=20260821-3', 'etSitePages');
  loadCss('/assets/css/site-pages-unified.css?v=20260821-1', 'etUnifiedPages');
  loadCss('/assets/css/components/tokens.css?v=architecture-tokens-2', 'etTokens');
  loadCss('/assets/css/components/nav.css?v=architecture-nav-4', 'etNavigation');
  loadScript('/assets/js/seo.js?v=architecture-seo-1', 'etSeo');

  const path = window.location.pathname.replace(/\/+$/, '/') || '/';
  const productPath = /^\/(?:en\/|fr\/|ar\/)?products\//.test(path);
  const fishPilotPath = /^\/(?:en\/|fr\/|ar\/)?products\/seafood\/fish\/$/.test(path);
  const compactCatalog = body?.dataset.compactCatalog === 'true';

  if (compactCatalog) {
    loadCss('/assets/css/compact-catalog.css?v=20260822-1', 'etCompactCatalog');
    loadScript('/assets/js/compact-catalog.js?v=20260822-1', 'etCompactCatalogScript');
  } else if (productPath && !fishPilotPath) {
    loadCss('/assets/css/catalog.css?v=20260822-2', 'etCatalog');
    loadScript('/assets/js/products-catalog.js?v=20260822-1', 'etCatalogScript');
  }

  const qs = selector => doc.querySelector(selector);
  const menuConfigs = [
    { button: '#menuToggleBtn,.mobile-menu,.es-menu,.intl-menu', overlay: '#navOverlay,.nav-overlay,.intl-overlay' },
    { button: '#productsMenu,.p-menu', overlay: '#productsOverlay,.p-overlay' }
  ];

  const bindMenu = ({ button: buttonSelector, overlay: overlaySelector }) => {
    const button = qs(buttonSelector);
    const overlay = qs(overlaySelector);
    if (!button || !overlay || button.dataset.etMenuBound === 'true') return;

    const setOpen = open => {
      body.classList.toggle('nav-open', open);
      body.classList.toggle('menu-open', open);
      body.classList.toggle('menu-is-open', open);
      button.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      overlay.setAttribute('aria-hidden', String(!open));
    };

    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const open = body.classList.contains('nav-open') || body.classList.contains('menu-open');
      setOpen(!open);
    }, true);

    overlay.addEventListener('click', event => {
      if (event.target === overlay) setOpen(false);
    });

    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setOpen(false));
    });

    button.dataset.etMenuBound = 'true';
  };

  menuConfigs.forEach(bindMenu);

  doc.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      body.classList.remove('nav-open', 'menu-open', 'menu-is-open');
      doc.querySelectorAll('#menuToggleBtn,.mobile-menu,.es-menu,.intl-menu').forEach(button => {
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'Open menu');
      });
      doc.querySelectorAll('#navOverlay,.nav-overlay,.intl-overlay').forEach(overlay => {
        overlay.setAttribute('aria-hidden', 'true');
      });
    }
  });
})();
