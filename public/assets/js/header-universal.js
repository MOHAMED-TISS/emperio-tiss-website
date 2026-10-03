/* EMPERIO TISS — UNIVERSAL HOME ES HEADER
   The Spanish Home masthead is the visual/structural source of truth
   for every non-admin page and language.
*/
(() => {
  'use strict';

  const VERSION = '20261003-commercial-header-4';
  const LEGACY_CANONICAL_VERSION = '20260929-overlay-preserve-1';

  if (window.__etUniversalHomeHeaderVersion === VERSION) return;
  window.__etUniversalHomeHeaderVersion = VERSION;
  window.__etHeaderFinalReady = true;

  const doc = document;
  const body = doc.body;
  const root = doc.documentElement;
  if (!body) return;

  const path = (location.pathname || '/').replace(/\/+/g, '/');

  const ensureJobyHeaderCss = () => {
    if (doc.querySelector('link[data-et-joby-header]')) return;
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/header-joby-experience.css?v=20261003-commercial-4';
    link.dataset.etJobyHeader = 'true';
    doc.head.appendChild(link);
  };

  ensureJobyHeaderCss();
  const supported = ['es', 'en', 'fr', 'ar', 'it'];
  const detected = (root.lang || 'es').slice(0, 2).toLowerCase();
  const lang = supported.includes(detected) ? detected : 'es';
  const prefix = lang === 'es' ? '' : `/${lang}`;
  const base = `${prefix}/`;
  const route = (segment) => `${prefix}/${segment}/`;

  const copy = {
    es: {
      home: 'Inicio', company: 'Empresa', products: 'Productos',
      seafood: 'Productos del mar', fish: 'Pescados', shellfish: 'Mariscos',
      cephalopods: 'Cefalópodos', fruits: 'Frutas', vegetables: 'Hortalizas',
      seasonal: 'Temporada', markets: 'Mercados', news: 'Noticias',
      contact: 'Contacto', enquiry: 'Consulta empresarial ↗',
      navLeft: 'Accesos principales', navRight: 'Mercados y contacto',
      nav: 'Navegación principal', languages: 'Idiomas', menu: 'Abrir menú',
      homeAria: 'EMPERIO TISS - Inicio', whatsapp: 'Contactar por WhatsApp',
      locale: 'Madrid · Europa · África · Mediterráneo'
    },
    en: {
      home: 'Home', company: 'Company', products: 'Products',
      seafood: 'Seafood', fish: 'Fish', shellfish: 'Shellfish',
      cephalopods: 'Cephalopods', fruits: 'Fruits', vegetables: 'Vegetables',
      seasonal: 'Seasonal', markets: 'Markets', news: 'News',
      contact: 'Contact', enquiry: 'Business enquiry ↗',
      navLeft: 'Main navigation', navRight: 'Markets and contact',
      nav: 'Main navigation', languages: 'Languages', menu: 'Open menu',
      homeAria: 'EMPERIO TISS - Home', whatsapp: 'Contact us on WhatsApp',
      locale: 'Madrid · Europe · Africa · Mediterranean'
    },
    fr: {
      home: 'Accueil', company: 'Entreprise', products: 'Produits',
      seafood: 'Produits de la mer', fish: 'Poissons', shellfish: 'Crustacés',
      cephalopods: 'Céphalopodes', fruits: 'Fruits', vegetables: 'Légumes',
      seasonal: 'Saison', markets: 'Marchés', news: 'Actualités',
      contact: 'Contact', enquiry: 'Demande commerciale ↗',
      navLeft: 'Navigation principale', navRight: 'Marchés et contact',
      nav: 'Navigation principale', languages: 'Langues', menu: 'Ouvrir le menu',
      homeAria: 'EMPERIO TISS - Accueil', whatsapp: 'Contacter sur WhatsApp',
      locale: 'Madrid · Europe · Afrique · Méditerranée'
    },
    ar: {
      home: 'الرئيسية', company: 'الشركة', products: 'المنتجات',
      seafood: 'المأكولات البحرية', fish: 'الأسماك', shellfish: 'الرخويات',
      cephalopods: 'رأسيات الأرجل', fruits: 'الفواكه', vegetables: 'الخضروات',
      seasonal: 'الموسمية', markets: 'الأسواق', news: 'الأخبار',
      contact: 'اتصل بنا', enquiry: 'استفسار تجاري ↗',
      navLeft: 'التنقل الرئيسي', navRight: 'الأسواق والاتصال',
      nav: 'التنقل الرئيسي', languages: 'اللغات', menu: 'فتح القائمة',
      homeAria: 'EMPERIO TISS - الرئيسية', whatsapp: 'تواصل معنا عبر واتساب',
      locale: 'مدريد · أوروبا · أفريقيا · البحر المتوسط'
    },
    it: {
      home: 'Home', company: 'Azienda', products: 'Prodotti',
      seafood: 'Prodotti del mare', fish: 'Pesce', shellfish: 'Crostacei',
      cephalopods: 'Cefalopodi', fruits: 'Frutta', vegetables: 'Ortaggi',
      seasonal: 'Stagionali', markets: 'Mercati', news: 'Notizie',
      contact: 'Contatti', enquiry: 'Richiesta commerciale ↗',
      navLeft: 'Navigazione principale', navRight: 'Mercati e contatti',
      nav: 'Navigazione principale', languages: 'Lingue', menu: 'Apri menu',
      homeAria: 'EMPERIO TISS - Home', whatsapp: 'Contattaci su WhatsApp',
      locale: 'Madrid · Europa · Africa · Mediterraneo'
    }
  }[lang];

  const contentPath = (() => {
    let pathname = path;
    for (const code of ['en', 'fr', 'ar', 'it']) {
      const marker = `/${code}`;
      if (pathname === marker || pathname.startsWith(`${marker}/`)) {
        pathname = pathname.slice(marker.length) || '/';
        break;
      }
    }
    return pathname.startsWith('/') ? pathname : `/${pathname}`;
  })();

  const languageHref = (code) => {
    // Legal pages only exist in ES; other language choices return to language home.
    if (contentPath.startsWith('/legal/')) {
      return code === 'es' ? contentPath : `/${code}/`;
    }
    if (code === 'es') return contentPath;
    return `/${code}${contentPath === '/' ? '/' : contentPath}`;
  };

  const isSection = (segment) => {
    const normalized = contentPath.replace(/^\/+|\/+$/g, '');
    return normalized === segment || normalized.startsWith(`${segment}/`);
  };

  const currentAttr = (segment) =>
    isSection(segment) ? ' class="is-active" aria-current="page"' : '';

  const whatsappIcon =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.5 3.5A10.9 10.9 0 0 0 13 1.1 10.9 10.9 0 0 0 3.2 17.4L2 22l4.7-1.2A10.9 10.9 0 1 0 20.5 3.5Zm-7.4 17.2a9.1 9.1 0 0 1-4.6-1.2l-.3-.2-2.8.7.8-2.7.8-2.7.2-.3a9.1 9.1 0 1 1 7.1 3.7Zm5-6.8c-.3-.2-1.8-.9-2-.9-.3-.1-.4-.1-.6.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.5-.7-2.6-1.3-3.7-2.9-.3-.5.3-.5.8-1.6.1-.2.1-.4 0-.6 0-.2-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.8.8-1.1 1.9-1.1 3 0 .7.2 1.3.5 1.9.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.5.6.5-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.1-.2-.2-.5-.3Z"/></svg>';

  const languageOrder = ['es', 'en', 'fr', 'ar', 'it'];
  const languageLinks = languageOrder.map((code, index) => {
    const current = code === lang ? ' class="current" aria-current="page"' : '';
    return `${index ? '<span>·</span>' : ''}<a href="${languageHref(code)}"${current}>${code.toUpperCase()}</a>`;
  }).join('');

  const headerMarkup = `
    <div class="header-inner">
      <button id="menuToggleBtn" class="mobile-menu" type="button" aria-label="${copy.menu}" aria-expanded="false" aria-controls="navOverlay">
        <span></span><span></span><span></span>
      </button>

      <a href="${base}" class="site-logo" aria-label="${copy.homeAria}">
        <img class="home-metal-logo" src="/assets/images/emperio-tiss-emblem.svg?v=20261003-joby-2" alt="EMPERIO TISS S.L." width="230" height="267">
      </a>

      <a class="joby-header-utility" href="${route('contact')}">
        ${copy.contact} <span aria-hidden="true">↗</span>
      </a>

      <nav class="home-header-nav" aria-label="${copy.navLeft}">
        <a href="${route('about')}"${currentAttr('about')}>${copy.company}</a>
        <a href="${route('products')}"${currentAttr('products')}>${copy.products}</a>
      </nav>

      <nav class="home-header-secondary" aria-label="${copy.navRight}">
        <a href="${route('markets')}"${currentAttr('markets')}>${copy.markets}</a>
        <a href="${route('contact')}"${currentAttr('contact')}>${copy.contact}</a>
      </nav>

      <a href="https://wa.me/34614270684" class="et-whatsapp" target="_blank" rel="noopener noreferrer" aria-label="${copy.whatsapp}">
        ${whatsappIcon}<span>${copy.whatsapp}</span>
      </a>

      <nav class="et-language-switch" aria-label="${copy.languages}">
        ${languageLinks}
      </nav>
    </div>`;

  const overlayMarkup = `
    <div class="nav-overlay-inner">
      <nav class="nav-overlay-links" aria-label="${copy.nav}" data-et-navigation-built="true">
        <a href="${base}"${contentPath === '/' ? ' class="active" aria-current="page"' : ''}><span class="idx">01</span><span>${copy.home}</span></a>
        <a href="${route('about')}"${currentAttr('about')}><span class="idx">02</span><span>${copy.company}</span></a>
        <details class="nav-products">
          <summary><span class="idx">03</span><span>${copy.products}</span></summary>
          <div class="nav-products-links">
            <div class="nav-product-group">
              <a class="nav-product-parent" href="${route('products/seafood')}">${copy.seafood}</a>
              <div class="nav-product-children">
                <a href="${route('products/seafood/fish')}">${copy.fish}</a>
                <a href="${route('products/seafood/shellfish')}">${copy.shellfish}</a>
                <a href="${route('products/seafood/cephalopods')}">${copy.cephalopods}</a>
              </div>
            </div>

            <a class="nav-product-parent" href="${route('products/fruits')}">${copy.fruits}</a>
            <a class="nav-product-parent" href="${route('products/vegetables')}">${copy.vegetables}</a>
            <a class="nav-product-parent" href="${route('products/seasonal')}">${copy.seasonal}</a>
          </div>
        </details>
        <a href="${route('markets')}"${currentAttr('markets')}><span class="idx">04</span><span>${copy.markets}</span></a>
        <a href="${route('news')}"${currentAttr('news')}><span class="idx">05</span><span>${copy.news}</span></a>
        <a href="${route('contact')}"${currentAttr('contact')}><span class="idx">06</span><span>${copy.contact}</span></a>
      </nav>
      <div class="nav-overlay-foot">
        <div class="nav-overlay-lang">${languageLinks}</div>
        <div class="nav-overlay-contact"><a href="${route('contact')}">${copy.enquiry}</a><a href="https://wa.me/34614270684" target="_blank" rel="noopener noreferrer">${copy.whatsapp} ↗</a><span>${copy.locale}</span></div>
      </div>
    </div>`;

  const clearLegacyInlineStyles = (header) => {
    ['left','right','inset-inline','width','margin-inline','padding-inline','transform']
      .forEach((property) => header.style.removeProperty(property));
  };

  const install = () => {
    body.classList.add('et-brand-shell');

    let header =
      doc.querySelector('body > .site-header') ||
      doc.querySelector('.site-header') ||
      doc.querySelector('body > .admin-topbar') ||
      doc.querySelector('.admin-topbar');
    const headerReady = header?.dataset.etUniversalHeader === VERSION;

    if (!headerReady) {
      const canonical = doc.createElement('header');
      canonical.className = 'site-header';
      canonical.id = 'luxuryHeader';
      // Keep the legacy marker so the old canonical observer accepts this DOM
      // instead of fighting the new universal controller.
      canonical.dataset.etCanonicalHeader = LEGACY_CANONICAL_VERSION;
      canonical.dataset.etUniversalHeader = VERSION;
      canonical.innerHTML = headerMarkup;

      if (header) header.replaceWith(canonical);
      else body.insertAdjacentElement('afterbegin', canonical);
      header = canonical;
    }

    clearLegacyInlineStyles(header);

    let overlay = doc.getElementById('navOverlay');
    const hierarchyOk =
      !!overlay?.querySelector('.nav-product-parent') &&
      !!overlay?.querySelector('.nav-product-children');

    if (!overlay || overlay.dataset.etUniversalOverlay !== VERSION || !hierarchyOk) {
      const canonicalOverlay = doc.createElement('div');
      canonicalOverlay.id = 'navOverlay';
      canonicalOverlay.className = 'nav-overlay';
      canonicalOverlay.setAttribute('aria-hidden', 'true');
      canonicalOverlay.dataset.etUniversalOverlay = VERSION;
      canonicalOverlay.innerHTML = overlayMarkup;

      if (overlay) overlay.replaceWith(canonicalOverlay);
      else header.insertAdjacentElement('afterend', canonicalOverlay);
      overlay = canonicalOverlay;
    }

    if (overlay.parentElement !== body) body.appendChild(overlay);
  };

  install();

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      const header =
        doc.querySelector('body > .site-header') ||
        doc.querySelector('.site-header') ||
        doc.querySelector('body > .admin-topbar') ||
        doc.querySelector('.admin-topbar');
      const overlay = doc.getElementById('navOverlay');
      const productHierarchyOk =
        !!overlay?.querySelector('.nav-product-parent') &&
        !!overlay?.querySelector('.nav-product-children');

      if (
        !header ||
        header.dataset.etUniversalHeader !== VERSION ||
        !overlay ||
        overlay.dataset.etUniversalOverlay !== VERSION ||
        !productHierarchyOk
      ) install();
    });
  });

  observer.observe(body, { childList: true, subtree: true });

  /* Private admin does not load global-core.js; keep its universal menu functional
     without importing the rest of the public shell. */
  if (body.classList.contains('private-admin-page') && !window.__etAdminUniversalMenuBound) {
    window.__etAdminUniversalMenuBound = true;

    const closeMenu = () => {
      const overlay = doc.getElementById('navOverlay');
      const button = doc.getElementById('menuToggleBtn');
      body.classList.remove('nav-open', 'menu-open');
      overlay?.setAttribute('aria-hidden', 'true');
      button?.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
      const overlay = doc.getElementById('navOverlay');
      const button = doc.getElementById('menuToggleBtn');
      body.classList.add('nav-open');
      overlay?.setAttribute('aria-hidden', 'false');
      button?.setAttribute('aria-expanded', 'true');
    };

    doc.addEventListener('click', (event) => {
      const button = event.target.closest('#menuToggleBtn');
      if (button) {
        event.preventDefault();
        if (button.getAttribute('aria-expanded') === 'true') closeMenu();
        else openMenu();
        return;
      }

      const overlay = event.target.closest('#navOverlay');
      if (overlay && event.target.closest('a')) closeMenu();
    });

    doc.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }
})();
