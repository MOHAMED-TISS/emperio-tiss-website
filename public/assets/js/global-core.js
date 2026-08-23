(() => {
  'use strict';
  const doc = document;
  const root = document.documentElement;
  const body = document.body;
  const get = (s, scope = doc) => scope.querySelector(s);
  root.classList.remove('et-pointer-ready');
  get('.et-pointer')?.remove();

  const header = get('.site-header,.p-header');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const lang = (root.lang || 'es').slice(0, 2).toLowerCase();
  const nav = {
    es: { prefix: '', home: 'Inicio', company: 'Empresa', products: 'Productos', seafood: 'Productos del mar', fish: 'Pescados', shellfish: 'Mariscos / Crustáceos', mediterranean: 'Del Mediterráneo', moruno: 'Moruno', cigala: 'Cigala', whitePrawn: 'Gamba blanca', tigerPrawn: 'Langostino tigre', cephalopods: 'Cefalópodos', fruitsVegetables: 'Frutas y hortalizas', fruits: 'Frutas', citrus: 'Cítricos', exoticFruit: 'Frutas exóticas', otherFruit: 'Otras frutas', vegetables: 'Hortalizas', seasonal: 'Temporada', seasonalSelection: 'Selección de temporada', markets: 'Mercados', news: 'Noticias', contact: 'Contacto' },
    en: { prefix: '/en', home: 'Home', company: 'Company', products: 'Products', seafood: 'Seafood', fish: 'Fish', shellfish: 'Shellfish / Crustaceans', mediterranean: 'Mediterranean', moruno: 'Moruno', cigala: 'Cigala', whitePrawn: 'Gamba blanca', tigerPrawn: 'Langostino tigre', cephalopods: 'Cephalopods', fruitsVegetables: 'Fruits & Vegetables', fruits: 'Fruit', citrus: 'Citrus', exoticFruit: 'Exotic fruit', otherFruit: 'Other fruit', vegetables: 'Vegetables', seasonal: 'Seasonal', seasonalSelection: 'Seasonal selection', markets: 'Markets', news: 'News', contact: 'Contact' },
    fr: { prefix: '/fr', home: 'Accueil', company: 'Entreprise', products: 'Produits', seafood: 'Produits de la mer', fish: 'Poissons', shellfish: 'Fruits de mer / Crustacés', mediterranean: 'Méditerranée', moruno: 'Moruno', cigala: 'Cigala', whitePrawn: 'Gamba blanca', tigerPrawn: 'Langostino tigre', cephalopods: 'Céphalopodes', fruitsVegetables: 'Fruits & légumes', fruits: 'Fruits', citrus: 'Agrumes', exoticFruit: 'Fruits exotiques', otherFruit: 'Autres fruits', vegetables: 'Légumes', seasonal: 'Produits de saison', seasonalSelection: 'Sélection de saison', markets: 'Marchés', news: 'Actualités', contact: 'Contact' },
    ar: { prefix: '/ar', home: 'الرئيسية', company: 'الشركة', products: 'المنتجات', seafood: 'المأكولات البحرية', fish: 'الأسماك', shellfish: 'المأكولات البحرية / القشريات', mediterranean: 'من البحر المتوسط', moruno: 'Moruno', cigala: 'Cigala', whitePrawn: 'Gamba blanca', tigerPrawn: 'Langostino tigre', cephalopods: 'رأسيات الأرجل', fruitsVegetables: 'الفواكه والخضروات', fruits: 'الفواكه', citrus: 'الحمضيات', exoticFruit: 'الفواكه الاستوائية', otherFruit: 'فواكه أخرى', vegetables: 'الخضروات', seasonal: 'المنتجات الموسمية', seasonalSelection: 'اختيارات موسمية', markets: 'الأسواق', news: 'الأخبار', contact: 'اتصل بنا' }
  }[lang] || null;
  if (!nav) return;

  const path = window.location.pathname.replace(/\/+$/, '/') || '/';
  const href = suffix => `${nav.prefix}${suffix}`;
  const current = suffix => path === href(suffix);

  const load = (kind, src, key) => {
    if (doc.querySelector(`[data-${key}]`)) return;
    const node = doc.createElement(kind === 'css' ? 'link' : 'script');
    if (kind === 'css') { node.rel = 'stylesheet'; node.href = src; }
    else { node.src = src; node.defer = true; }
    node.dataset[key] = 'true';
    doc.head.appendChild(node);
  };
  load('css', '/assets/css/canonical-nav.css?v=20260822-canonical-4', 'etCanonicalNav');

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

  const link = (label, suffix) => {
    const a = doc.createElement('a');
    a.href = href(suffix);
    a.textContent = label;
    if (current(suffix)) a.setAttribute('aria-current', 'page');
    return a;
  };

  const summary = label => {
    const s = doc.createElement('summary');
    s.textContent = label;
    return s;
  };

  const leaf = label => {
    const s = doc.createElement('span');
    s.className = 'nav-product-leaf';
    s.textContent = label;
    return s;
  };

  const buildPrimary = (idx, label, suffix) => {
    const a = link(label, suffix);
    const n = doc.createElement('span');
    n.className = 'idx';
    n.textContent = idx;
    const t = doc.createElement('span');
    t.textContent = label;
    a.replaceChildren(n, t);
    return a;
  };

  const buildProducts = () => {
    const details = doc.createElement('details');
    details.className = 'nav-products';
    if (/\/products\/(?:seafood|fruits|vegetables|seasonal)\//.test(path)) details.open = true;

    const n = doc.createElement('span');
    n.className = 'idx';
    n.textContent = '03';
    const t = doc.createElement('span');
    t.textContent = nav.products;
    const productSummary = doc.createElement('summary');
    productSummary.append(n, t);
    details.appendChild(productSummary);

    const productsLinks = doc.createElement('div');
    productsLinks.className = 'nav-products-links';

    const seafood = doc.createElement('details');
    seafood.className = 'nav-seafood';
    if (/\/products\/seafood\//.test(path)) seafood.open = true;
    seafood.appendChild(summary(nav.seafood));

    const seafoodLinks = doc.createElement('div');
    seafoodLinks.className = 'nav-products-links nav-seafood-links';
    seafoodLinks.appendChild(link(nav.fish, '/products/seafood/fish/'));

    const shellfish = doc.createElement('details');
    shellfish.className = 'nav-shellfish';
    if (/\/products\/seafood\/shellfish\//.test(path)) shellfish.open = true;
    shellfish.appendChild(summary(nav.shellfish));

    const shellfishLinks = doc.createElement('div');
    shellfishLinks.className = 'nav-products-links nav-products-links--level-3';
    const mediterranean = doc.createElement('details');
    mediterranean.className = 'nav-shellfish-mediterranean';
    mediterranean.appendChild(summary(nav.mediterranean));
    const mediterraneanLinks = doc.createElement('div');
    mediterraneanLinks.className = 'nav-products-links nav-products-links--level-4';
    mediterraneanLinks.append(leaf(nav.moruno), leaf(nav.cigala), leaf(nav.whitePrawn), leaf(nav.tigerPrawn));
    mediterranean.appendChild(mediterraneanLinks);
    shellfishLinks.appendChild(mediterranean);
    shellfish.appendChild(shellfishLinks);
    seafoodLinks.appendChild(shellfish);
    seafoodLinks.appendChild(link(nav.cephalopods, '/products/seafood/cephalopods/'));
    seafood.appendChild(seafoodLinks);
    productsLinks.appendChild(seafood);

    const produce = doc.createElement('details');
    produce.className = 'nav-produce';
    produce.appendChild(summary(nav.fruitsVegetables));
    const produceLinks = doc.createElement('div');
    produceLinks.className = 'nav-products-links';
    const fruits = doc.createElement('details');
    fruits.className = 'nav-fruits';
    fruits.appendChild(summary(nav.fruits));
    const fruitLinks = doc.createElement('div');
    fruitLinks.className = 'nav-products-links nav-products-links--level-3';
    fruitLinks.append(leaf(nav.citrus), leaf(nav.exoticFruit), leaf(nav.otherFruit));
    fruits.appendChild(fruitLinks);
    produceLinks.appendChild(fruits);
    produceLinks.appendChild(link(nav.vegetables, '/products/vegetables/'));
    produce.appendChild(produceLinks);
    productsLinks.appendChild(produce);

    const seasonal = doc.createElement('details');
    seasonal.className = 'nav-seasonal';
    seasonal.appendChild(summary(nav.seasonal));
    const seasonalLinks = doc.createElement('div');
    seasonalLinks.className = 'nav-products-links nav-products-links--level-3';
    seasonalLinks.appendChild(link(nav.seasonalSelection, '/products/seasonal/'));
    seasonal.appendChild(seasonalLinks);
    productsLinks.appendChild(seasonal);

    details.appendChild(productsLinks);
    return details;
  };

  const rebuildNavigation = () => {
    doc.querySelectorAll('.nav-overlay-links').forEach(menu => {
      if (menu.dataset.canonicalNav === 'true') return;
      menu.dataset.canonicalNav = 'true';
      menu.replaceChildren(
        buildPrimary('01', nav.home, '/'),
        buildPrimary('02', nav.company, '/about/'),
        buildProducts(),
        buildPrimary('04', nav.markets, '/markets/'),
        buildPrimary('05', nav.news, '/news/'),
        buildPrimary('06', nav.contact, '/contact/')
      );
    });
  };

  rebuildNavigation();
  window.setTimeout(rebuildNavigation, 0);
  window.setTimeout(rebuildNavigation, 100);
  new MutationObserver(rebuildNavigation).observe(body, { childList: true, subtree: true });

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
