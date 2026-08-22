(() => {
  'use strict';
  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const get = (s, scope = doc) => scope.querySelector(s);
  root.classList.remove('et-pointer-ready');
  get('.et-pointer')?.remove();

  const header = get('.site-header,.p-header');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const lang = (root.lang || 'es').slice(0, 2).toLowerCase();
  const nav = {
    es: { prefix: '', seafood: 'Productos del mar', fish: 'Pescados', shellfish: 'Mariscos', cephalopods: 'Cefalópodos', fruits: 'Frutas', vegetables: 'Hortalizas', seasonal: 'Temporada' },
    en: { prefix: '/en', seafood: 'Seafood', fish: 'Fish', shellfish: 'Shellfish', cephalopods: 'Cephalopods', fruits: 'Fruits', vegetables: 'Vegetables', seasonal: 'Seasonal' },
    fr: { prefix: '/fr', seafood: 'Produits de la mer', fish: 'Poissons', shellfish: 'Coquillages', cephalopods: 'Céphalopodes', fruits: 'Fruits', vegetables: 'Légumes', seasonal: 'Produits de saison' },
    ar: { prefix: '/ar', seafood: 'المأكولات البحرية', fish: 'الأسماك', shellfish: 'المحاريات', cephalopods: 'رأسيات الأرجل', fruits: 'الفواكه', vegetables: 'الخضروات', seasonal: 'المنتجات الموسمية' }
  }[lang] || null;

  const path = window.location.pathname.replace(/\/+$/, '/') || '/';
  const prefix = nav?.prefix || '';
  const href = suffix => `${prefix}${suffix}`;
  const current = suffix => path === href(suffix);

  const load = (kind, src, key) => {
    if (doc.querySelector(`[data-${key}]`)) return;
    const node = doc.createElement(kind === 'css' ? 'link' : 'script');
    if (kind === 'css') { node.rel = 'stylesheet'; node.href = src; }
    else { node.src = src; node.defer = true; }
    node.dataset[key] = 'true';
    doc.head.appendChild(node);
  };

  load('css', '/assets/css/canonical-nav.css?v=20260822-canonical-2', 'etCanonicalNav');

  const productPath = /^\/(?:en\/|fr\/|ar\/)?products\//.test(path);
  const fishPilotPath = /^\/(?:en\/|fr\/|ar\/)?products\/seafood\/fish\/$/.test(path);
  const compactCatalog = body?.dataset.compactCatalog === 'true';
  if (compactCatalog) {
    load('css', '/assets/css/compact-catalog.css?v=20260822-1', 'etCompactCatalog');
    load('js', '/assets/js/compact-catalog.js?v=20260822-1', 'etCompactCatalogScript');
  } else if (productPath && !fishPilotPath) {
    load('css', '/assets/css/catalog.css?v=20260822-2', 'etCatalog');
    load('js', '/assets/js/products-catalog.js?v=20260822-1', 'etCatalogScript');
  }

  const makeLink = (label, suffix) => {
    const a = doc.createElement('a');
    a.href = href(suffix);
    a.textContent = label;
    if (current(suffix)) a.setAttribute('aria-current', 'page');
    return a;
  };

  const normalizeProducts = links => {
    if (!links || links.dataset.canonicalNav === 'true' || !nav) return;
    links.dataset.canonicalNav = 'true';
    links.innerHTML = '';

    const seafood = doc.createElement('details');
    seafood.className = 'nav-seafood';
    if (/\/products\/seafood\/(fish|shellfish|cephalopods)\/$/.test(path)) seafood.open = true;

    const summary = doc.createElement('summary');
    summary.textContent = nav.seafood;
    seafood.appendChild(summary);

    const seafoodLinks = doc.createElement('div');
    seafoodLinks.className = 'nav-products-links nav-seafood-links';
    seafoodLinks.appendChild(makeLink(nav.fish, '/products/seafood/fish/'));
    seafoodLinks.appendChild(makeLink(nav.shellfish, '/products/seafood/shellfish/'));
    seafoodLinks.appendChild(makeLink(nav.cephalopods, '/products/seafood/cephalopods/'));
    seafood.appendChild(seafoodLinks);

    links.appendChild(seafood);
    links.appendChild(makeLink(nav.fruits, '/products/fruits/'));
    links.appendChild(makeLink(nav.vegetables, '/products/vegetables/'));
    links.appendChild(makeLink(nav.seasonal, '/products/seasonal/'));
  };

  const normalizeAll = () => doc.querySelectorAll('.nav-products > .nav-products-links').forEach(normalizeProducts);
  normalizeAll();
  window.setTimeout(normalizeAll, 0);
  window.setTimeout(normalizeAll, 100);
  new MutationObserver(normalizeAll).observe(body, { childList: true, subtree: true });

  const configs = [
    { button: '#menuToggleBtn,.mobile-menu,.es-menu,.intl-menu', overlay: '#navOverlay,.nav-overlay,.intl-overlay' },
    { button: '#productsMenu,.p-menu', overlay: '#productsOverlay,.p-overlay' }
  ];

  configs.forEach(({ button: bs, overlay: os }) => {
    const button = get(bs);
    const overlay = get(os);
    if (!button || !overlay || button.dataset.etMenuBound === 'true') return;

    const setOpen = open => {
      body.classList.toggle('nav-open', open);
      body.classList.toggle('menu-open', open);
      root.classList.toggle('menu-is-open', open);
      button.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? (lang === 'es' ? 'Cerrar menú' : 'Close menu') : (lang === 'es' ? 'Abrir menú' : 'Open menu'));
      overlay.setAttribute('aria-hidden', String(!open));
    };

    button.addEventListener('click', e => {
      e.preventDefault();
      e.stopImmediatePropagation();
      const open = body.classList.contains('nav-open') || body.classList.contains('menu-open');
      setOpen(!open);
    }, true);
    overlay.addEventListener('click', e => { if (e.target === overlay) setOpen(false); });
    overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    doc.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 900) setOpen(false); }, { passive: true });
    button.dataset.etMenuBound = 'true';
  });
})();
