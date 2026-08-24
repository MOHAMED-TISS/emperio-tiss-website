(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const get = (selector, scope = doc) => scope.querySelector(selector);
  const overlaySelector = '#navOverlay,.nav-overlay,.intl-overlay';
  const buttonSelector = '#menuToggleBtn,.mobile-menu,.es-menu,.intl-menu';

  root.classList.remove('et-pointer-ready');
  get('.et-pointer')?.remove();

  const header = get('.site-header,.p-header');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const lang = (root.lang || 'en').slice(0, 2).toLowerCase();
  const labels = {
    es: { home: 'Inicio', company: 'Empresa', products: 'Productos', seafood: 'Productos del mar', fish: 'Pescados', shellfish: 'Mariscos & Crustáceos', cephalopods: 'Cefalópodos', fruits: 'Frutas', vegetables: 'Hortalizas', seasonal: 'Temporada', markets: 'Mercados', news: 'Noticias', contact: 'Contacto', open: 'Abrir menú', close: 'Cerrar menú' },
    en: { home: 'Home', company: 'Company', products: 'Products', seafood: 'Seafood', fish: 'Fish', shellfish: 'Shellfish & Crustaceans', cephalopods: 'Cephalopods', fruits: 'Fruits', vegetables: 'Vegetables', seasonal: 'Seasonal', markets: 'Markets', news: 'News', contact: 'Contact', open: 'Open menu', close: 'Close menu' },
    fr: { home: 'Accueil', company: 'Entreprise', products: 'Produits', seafood: 'Produits de la mer', fish: 'Poissons', shellfish: 'Fruits de mer & Crustacés', cephalopods: 'Céphalopodes', fruits: 'Fruits', vegetables: 'Légumes', seasonal: 'Saison', markets: 'Marchés', news: 'Actualités', contact: 'Contact', open: 'Ouvrir le menu', close: 'Fermer le menu' },
    ar: { home: 'الرئيسية', company: 'الشركة', products: 'المنتجات', seafood: 'منتجات البحر', fish: 'الأسماك', shellfish: 'المأكولات البحرية والقشريات', cephalopods: 'رأسيات الأرجل', fruits: 'الفواكه', vegetables: 'الخضروات', seasonal: 'الموسمية', markets: 'الأسواق', news: 'الأخبار', contact: 'اتصل بنا', open: 'فتح القائمة', close: 'إغلاق القائمة' }
  };

  const paths = {
    es: { home: '/', company: '/about/', seafood: '/products/seafood/', fish: '/products/seafood/fish/', shellfish: '/products/seafood/shellfish/', cephalopods: '/products/seafood/cephalopods/', fruits: '/products/fruits/', vegetables: '/products/vegetables/', seasonal: '/products/seasonal/', markets: '/markets/', news: '/news/', contact: '/contact/' },
    en: { home: '/en/', company: '/en/about/', seafood: '/en/products/seafood/', fish: '/en/products/seafood/fish/', shellfish: '/en/products/seafood/shellfish/', cephalopods: '/en/products/seafood/cephalopods/', fruits: '/en/products/fruits/', vegetables: '/en/products/vegetables/', seasonal: '/en/products/seasonal/', markets: '/en/markets/', news: '/en/news/', contact: '/en/contact/' },
    fr: { home: '/fr/', company: '/fr/about/', seafood: '/fr/products/seafood/', fish: '/fr/products/seafood/fish/', shellfish: '/fr/products/seafood/shellfish/', cephalopods: '/fr/products/seafood/cephalopods/', fruits: '/fr/products/fruits/', vegetables: '/fr/products/vegetables/', seasonal: '/fr/products/seasonal/', markets: '/fr/markets/', news: '/fr/news/', contact: '/fr/contact/' },
    ar: { home: '/ar/', company: '/ar/about/', seafood: '/ar/products/seafood/', fish: '/ar/products/seafood/fish/', shellfish: '/ar/products/seafood/shellfish/', cephalopods: '/ar/products/seafood/cephalopods/', fruits: '/ar/products/fruits/', vegetables: '/ar/products/vegetables/', seasonal: '/ar/products/seasonal/', markets: '/ar/markets/', news: '/ar/news/', contact: '/ar/contact/' }
  };

  const T = labels[lang] || labels.en;
  const L = paths[lang] ? lang : 'en';
  const idx = (n, text) => `<span class="idx">${n}</span><span>${text}</span>`;

  const normalizeMenuOverlays = () => {
    doc.querySelectorAll(overlaySelector).forEach((overlay) => {
      const ownerHeader = overlay.closest('.site-header,.p-header,.et-header-inner,.header-inner');
      if (ownerHeader && overlay.parentElement !== body) body.appendChild(overlay);
    });
  };

  const buildNavigation = () => {
    normalizeMenuOverlays();
    const nav = get('.nav-overlay-links');
    if (!nav || nav.dataset.etNavigationBuilt === 'true') return;

    nav.innerHTML = `
      <a href="${paths[L].home}">${idx('01', T.home)}</a>
      <a href="${paths[L].company}">${idx('02', T.company)}</a>
      <details class="nav-products">
        <summary>${idx('03', T.products)}</summary>
        <div class="nav-products-links">
          <details class="nav-seafood">
            <summary>${T.seafood}</summary>
            <div class="nav-products-links">
              <a class="nav-product-leaf" href="${paths[L].fish}">${T.fish}</a>
              <a class="nav-product-leaf" href="${paths[L].shellfish}">${T.shellfish}</a>
              <a class="nav-product-leaf" href="${paths[L].cephalopods}">${T.cephalopods}</a>
            </div>
          </details>
          <a href="${paths[L].fruits}">${T.fruits}</a>
          <a href="${paths[L].vegetables}">${T.vegetables}</a>
          <a href="${paths[L].seasonal}">${T.seasonal}</a>
        </div>
      </details>
      <a href="${paths[L].markets}">${idx('04', T.markets)}</a>
      <a href="${paths[L].news}">${idx('05', T.news)}</a>
      <a href="${paths[L].contact}">${idx('06', T.contact)}</a>`;

    nav.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    nav.dataset.etNavigationBuilt = 'true';
  };

  const setMenuOpen = (button, overlay, open) => {
    normalizeMenuOverlays();
    body.classList.toggle('nav-open', open);
    body.classList.toggle('menu-open', open);
    root.classList.toggle('menu-is-open', open);
    button.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? T.close : T.open);
    overlay.setAttribute('aria-hidden', String(!open));
  };

  const closeMenu = () => {
    const button = get(buttonSelector);
    const overlay = get(overlaySelector);
    if (button && overlay) setMenuOpen(button, overlay, false);
  };

  doc.addEventListener('click', (event) => {
    const button = event.target.closest(buttonSelector);
    if (button) {
      normalizeMenuOverlays();
      const overlay = get(overlaySelector);
      if (!overlay) return;
      event.preventDefault();
      event.stopPropagation();
      const open = body.classList.contains('nav-open') || body.classList.contains('menu-open');
      setMenuOpen(button, overlay, !open);
      return;
    }

    const overlay = event.target.closest(overlaySelector);
    if (!overlay) return;
    if (event.target === overlay || event.target.closest('.nav-overlay-close,.intl-overlay-close')) {
      closeMenu();
      return;
    }
    if (event.target.closest('a')) closeMenu();
  }, true);

  doc.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  }, { passive: true });

  const initDynamicParts = () => {
    normalizeMenuOverlays();
    buildNavigation();
  };

  initDynamicParts();
  new MutationObserver(initDynamicParts).observe(doc.body, { childList: true, subtree: true });
})();
