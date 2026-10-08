/* EMPERIO TISS — EDITORIAL HEADER (2026-10)
   One masthead for every public page and language:
   - top strip (markets, email, languages, theme) on wide screens
   - main bar: Menu button + left links | centred compact logo | right links + Signature + Contact
   - compact floating bar on scroll
   - full-screen menu (#ethMenu) opened by the Menu button
   Uses its own `eth-` namespace so the legacy header stylesheets cannot interfere.
*/
(() => {
  'use strict';

  const VERSION = '20261008-eth-4';
  if (window.__etLiquidUniversalHeaderVersion === VERSION) return;
  window.__etLiquidUniversalHeaderVersion = VERSION;

  // Block cached legacy controllers if an older script URL executes later.
  window.__etUniversalHomeHeaderVersion = '20261003-commercial-header-8';
  window.__etCanonicalHeaderVersion = '20260929-overlay-preserve-1';
  window.__etHeaderFinalReady = true;

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  if (!body) return;

  const rawPath = (location.pathname || '/').replace(/\/+/g, '/');
  if (
    rawPath === '/private' ||
    rawPath.startsWith('/private/') ||
    body.classList.contains('private-page') ||
    body.classList.contains('private-admin-page')
  ) return;

  const supported = ['es', 'en', 'fr', 'it', 'ar'];
  const languageNames = { es: 'Español', en: 'English', fr: 'Français', it: 'Italiano', ar: 'العربية' };
  const detected = (root.lang || 'es').slice(0, 2).toLowerCase();
  const lang = supported.includes(detected) ? detected : 'es';
  const prefix = lang === 'es' ? '' : `/${lang}`;
  const base = `${prefix}/`;
  const route = segment => `${prefix}/${String(segment).replace(/^\/+|\/+$/g, '')}/`;
  const EMAIL = 'info@emperio-tiss.com';
  const TAGLINE = 'Rising together, leading the world';
  const ASSET_V = '20261008-eth-1';

  const copy = {
    es: {
      home: 'Inicio', company: 'Empresa', products: 'Productos', markets: 'Mercados', news: 'Noticias',
      contact: 'Contacto', signature: 'Signature', languages: 'Idiomas', language: 'Idioma',
      menu: 'Menú', openMenu: 'Abrir menú', close: 'Cerrar', closeMenu: 'Cerrar menú',
      mainNav: 'Navegación principal', skip: 'Saltar al contenido', theme: 'Cambiar tema',
      fish: 'Pescado', shellfish: 'Marisco', cephalopods: 'Cefalópodos', fruits: 'Frutas', vegetables: 'Hortalizas', seasonal: 'Temporada',
      locale: 'Madrid · Europa · África · Mediterráneo · Oriente Medio',
      featured: 'Destacado', featuredTitle: 'Del origen, a su próximo mercado.',
      sigTitle: 'Acceso profesional', sigText: 'Ofertas privadas, disponibilidad y referencias para empresas aprobadas.', sigCta: 'Entrar'
    },
    en: {
      home: 'Home', company: 'Company', products: 'Products', markets: 'Markets', news: 'News',
      contact: 'Contact', signature: 'Signature', languages: 'Languages', language: 'Language',
      menu: 'Menu', openMenu: 'Open menu', close: 'Close', closeMenu: 'Close menu',
      mainNav: 'Main navigation', skip: 'Skip to content', theme: 'Change theme',
      fish: 'Fish', shellfish: 'Shellfish', cephalopods: 'Cephalopods', fruits: 'Fruits', vegetables: 'Vegetables', seasonal: 'Seasonal',
      locale: 'Madrid · Europe · Africa · Mediterranean · Middle East',
      featured: 'Featured', featuredTitle: 'From origin to your next market.',
      sigTitle: 'Professional access', sigText: 'Private offers, availability and references for approved companies.', sigCta: 'Enter'
    },
    fr: {
      home: 'Accueil', company: 'Entreprise', products: 'Produits', markets: 'Marchés', news: 'Actualités',
      contact: 'Contact', signature: 'Signature', languages: 'Langues', language: 'Langue',
      menu: 'Menu', openMenu: 'Ouvrir le menu', close: 'Fermer', closeMenu: 'Fermer le menu',
      mainNav: 'Navigation principale', skip: 'Aller au contenu', theme: 'Changer de thème',
      fish: 'Poissons', shellfish: 'Crustacés', cephalopods: 'Céphalopodes', fruits: 'Fruits', vegetables: 'Légumes', seasonal: 'Saison',
      locale: 'Madrid · Europe · Afrique · Méditerranée · Moyen-Orient',
      featured: 'À la une', featuredTitle: 'De l’origine à votre prochain marché.',
      sigTitle: 'Accès professionnel', sigText: 'Offres privées, disponibilités et références pour les entreprises approuvées.', sigCta: 'Entrer'
    },
    it: {
      home: 'Home', company: 'Azienda', products: 'Prodotti', markets: 'Mercati', news: 'Notizie',
      contact: 'Contatti', signature: 'Signature', languages: 'Lingue', language: 'Lingua',
      menu: 'Menu', openMenu: 'Apri menu', close: 'Chiudi', closeMenu: 'Chiudi menu',
      mainNav: 'Navigazione principale', skip: 'Vai al contenuto', theme: 'Cambia tema',
      fish: 'Pesce', shellfish: 'Crostacei', cephalopods: 'Cefalopodi', fruits: 'Frutta', vegetables: 'Ortaggi', seasonal: 'Stagionale',
      locale: 'Madrid · Europa · Africa · Mediterraneo · Medio Oriente',
      featured: 'In evidenza', featuredTitle: 'Dall’origine al vostro prossimo mercato.',
      sigTitle: 'Accesso professionale', sigText: 'Offerte private, disponibilità e referenze per aziende approvate.', sigCta: 'Accedi'
    },
    ar: {
      home: 'الرئيسية', company: 'الشركة', products: 'المنتجات', markets: 'الأسواق', news: 'الأخبار',
      contact: 'اتصل بنا', signature: 'Signature', languages: 'اللغات', language: 'اللغة',
      menu: 'القائمة', openMenu: 'فتح القائمة', close: 'إغلاق', closeMenu: 'إغلاق القائمة',
      mainNav: 'التنقل الرئيسي', skip: 'انتقل إلى المحتوى', theme: 'تغيير المظهر',
      fish: 'الأسماك', shellfish: 'القشريات', cephalopods: 'رأسيات الأرجل', fruits: 'الفواكه', vegetables: 'الخضروات', seasonal: 'الموسمية',
      locale: 'مدريد · أوروبا · أفريقيا · البحر المتوسط · الشرق الأوسط',
      featured: 'مميز', featuredTitle: 'من المنشأ إلى سوقك التالي.',
      sigTitle: 'دخول مهني', sigText: 'عروض خاصة وتوفر ومراجع للشركات المعتمدة.', sigCta: 'دخول'
    }
  }[lang];

  const contentPath = (() => {
    let pathname = rawPath;
    for (const code of ['en', 'fr', 'it', 'ar']) {
      const marker = `/${code}`;
      if (pathname === marker || pathname.startsWith(`${marker}/`)) {
        pathname = pathname.slice(marker.length) || '/';
        break;
      }
    }
    return pathname.startsWith('/') ? pathname : `/${pathname}`;
  })();

  const languageHref = code => {
    if (contentPath.startsWith('/legal/')) return code === 'es' ? contentPath : `/${code}/`;
    if (code === 'es') return contentPath;
    return `/${code}${contentPath === '/' ? '/' : contentPath}`;
  };

  const normalizedSection = contentPath.replace(/^\/+|\/+$/g, '');
  const isSection = section => normalizedSection === section || normalizedSection.startsWith(`${section}/`);
  const current = section => (isSection(section) ? ' class="is-active" aria-current="page"' : '');
  const productsActive = isSection('products') && !isSection('products/seasonal');

  const icon = {
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h18"/><path d="M3 15h18"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/><circle cx="12" cy="12" r="4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 15.6A8.5 8.5 0 0 1 8.4 3.6 8.6 8.6 0 1 0 20.4 15.6Z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>'
  };

  const logo = cls => `
    <a href="${base}" class="eth-logo ${cls}" aria-label="EMPERIO TISS — ${copy.home}">
      <img class="eth-logo__emblem" src="/assets/images/emperio-tiss-emblem.svg?v=20261008-brand" alt="" width="201" height="240" draggable="false">
      <img class="eth-logo__name eth-logo__name--dark" src="/assets/images/brand/emperio-tiss-name-compact-gold.svg?v=${ASSET_V}" alt="" width="356" height="100" draggable="false">
      <img class="eth-logo__name eth-logo__name--light" src="/assets/images/brand/emperio-tiss-name-compact-gold-on-light.svg?v=${ASSET_V}" alt="" width="356" height="100" draggable="false">
    </a>`;

  const languageLinks = cls => supported.map(code =>
    `<a class="${cls}" href="${languageHref(code)}" hreflang="${code}" lang="${code}"${code === lang ? ' aria-current="true"' : ''}>${code.toUpperCase()}</a>`
  ).join('');

  const headerMarkup = `
    <a class="eth-skip" href="#eth-main">${copy.skip}</a>
    <div class="eth-strip">
      <div class="eth-strip__inner">
        <span class="eth-strip__locale">${copy.locale}</span>
        <div class="eth-strip__tools">
          <a class="eth-strip__mail" href="mailto:${EMAIL}">${EMAIL}</a>
          <nav class="eth-strip__langs" aria-label="${copy.languages}">${languageLinks('eth-strip__lang')}</nav>
          <button class="eth-theme" type="button" aria-label="${copy.theme}" aria-pressed="false"></button>
        </div>
      </div>
    </div>
    <div class="eth-bar">
      <div class="eth-bar__side eth-bar__side--start">
        <button class="eth-menu-btn" type="button" aria-expanded="false" aria-controls="ethMenu">
          ${icon.menu}<span>${copy.menu}</span>
        </button>
        <nav class="eth-nav" aria-label="${copy.mainNav}">
          <a href="${route('about')}"${current('about')}>${copy.company}</a>
          <a href="${route('products')}"${productsActive ? ' class="is-active" aria-current="page"' : ''}>${copy.products}</a>
          <a href="${route('products/seasonal')}"${current('products/seasonal')}>${copy.seasonal}</a>
        </nav>
      </div>
      ${logo('eth-logo--bar')}
      <div class="eth-bar__side eth-bar__side--end">
        <nav class="eth-nav" aria-label="${copy.mainNav} 2">
          <a href="${route('markets')}"${current('markets')}>${copy.markets}</a>
          <a href="${route('news')}"${current('news')}>${copy.news}</a>
        </nav>
        <a class="eth-btn eth-btn--ghost eth-signature" href="${route('news')}#emperio-private">${copy.signature}</a>
        <a class="eth-btn eth-btn--gold eth-contact" href="${route('contact')}">
          <span class="eth-contact__label">${copy.contact}</span>${icon.mail}
        </a>
      </div>
    </div>`;

  const menuItems = [
    ['about', copy.company],
    ['products', copy.products],
    ['products/seasonal', copy.seasonal],
    ['markets', copy.markets],
    ['news', copy.news],
    ['contact', copy.contact]
  ];

  const menuMarkup = `
    <div class="eth-menu__top">
      <button class="eth-menu__close" type="button" aria-label="${copy.closeMenu}">${icon.close}<span>${copy.close}</span></button>
      ${logo('eth-logo--menu')}
      <div class="eth-menu__top-end">
        <nav class="eth-menu__langs-top" aria-label="${copy.languages}">${languageLinks('eth-menu__lang-top')}</nav>
        <a class="eth-btn eth-btn--gold" href="${route('contact')}">${copy.contact}</a>
      </div>
    </div>
    <div class="eth-menu__body">
      <div class="eth-menu__main">
        <nav class="eth-menu__nav" aria-label="${copy.mainNav}">
          <ol>
            ${menuItems.map(([seg, label], i) => {
              const active = seg === 'products' ? productsActive : isSection(seg);
              const sub = seg === 'products' ? `
              <div class="eth-menu__sub">
                <a href="${route('products/seafood/fish')}">${copy.fish}</a>
                <a href="${route('products/seafood/shellfish')}">${copy.shellfish}</a>
                <a href="${route('products/seafood/cephalopods')}">${copy.cephalopods}</a>
                <a href="${route('products/fruits')}">${copy.fruits}</a>
                <a href="${route('products/vegetables')}">${copy.vegetables}</a>
              </div>` : '';
              return `<li>
              <a class="eth-menu__link${active ? ' is-active' : ''}" href="${route(seg)}"${active ? ' aria-current="page"' : ''}>
                <span class="eth-menu__idx">${String(i + 1).padStart(2, '0')}</span><span class="eth-menu__label">${label}</span>
              </a>${sub}
            </li>`;
            }).join('')}
          </ol>
        </nav>
        <div class="eth-menu__foot">
          <div class="eth-menu__block">
            <span class="eth-menu__kicker">${copy.language}</span>
            <div class="eth-menu__langs">${supported.map(code => `<a href="${languageHref(code)}" hreflang="${code}" lang="${code}"${code === lang ? ' aria-current="true"' : ''}>${languageNames[code]}</a>`).join('')}</div>
          </div>
          <div class="eth-menu__block">
            <span class="eth-menu__kicker">${copy.contact}</span>
            <p><a href="mailto:${EMAIL}">${EMAIL}</a> · Madrid</p>
          </div>
          <div class="eth-menu__block eth-menu__block--row">
            <span class="eth-menu__tagline">${TAGLINE}</span>
            <button class="eth-theme" type="button" aria-label="${copy.theme}" aria-pressed="false"></button>
          </div>
        </div>
      </div>
      <aside class="eth-menu__aside">
        <a class="eth-menu__feature" href="${route('products')}">
          <img src="/assets/images/home-ocean-poster.webp" alt="" loading="lazy" decoding="async" width="1600" height="900">
          <span class="eth-menu__feature-text">
            <span class="eth-menu__kicker">${copy.featured}</span>
            <span class="eth-menu__feature-title">${copy.featuredTitle}</span>
          </span>
        </a>
        <a class="eth-menu__signature" href="${route('news')}#emperio-private">
          <img src="/assets/images/emperio-tiss-emblem.svg?v=20261008-brand" alt="" width="201" height="240">
          <span>
            <span class="eth-menu__kicker">EMPERIO Signature</span>
            <span class="eth-menu__sig-title">${copy.sigTitle}</span>
            <span class="eth-menu__sig-text">${copy.sigText}</span>
            <span class="eth-menu__sig-cta">${copy.sigCta} ${icon.arrow}</span>
          </span>
        </a>
      </aside>
    </div>`;

  const ensureCss = () => {
    const href = `/assets/css/header-2026.css?v=${VERSION}`;
    const existing = doc.querySelector('link[data-eth-css]');
    if (existing) {
      if (existing.getAttribute('href') !== href) existing.setAttribute('href', href);
      return;
    }
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.ethCss = 'true';
    doc.head.appendChild(link);
  };

  const ensureMainTarget = () => {
    if (doc.getElementById('eth-main')) return;
    const main = doc.querySelector('main') || doc.querySelector('[role="main"]');
    if (!main) return;
    const anchor = doc.createElement('span');
    anchor.id = 'eth-main';
    anchor.tabIndex = -1;
    anchor.className = 'eth-main-anchor';
    main.insertAdjacentElement('afterbegin', anchor);
  };

  const install = () => {
    ensureCss();
    body.classList.add('eth-header-2026');

    const existing = doc.getElementById('ethHeader');
    const legacyHeader =
      doc.getElementById('etLiquidHeader') ||
      doc.querySelector('body > .site-header') ||
      doc.querySelector('body > .p-header') ||
      doc.querySelector('body > .admin-topbar');

    // Keep any legacy overlay attached to <body> (other scripts still reference it) but out of the way.
    const legacyOverlay = doc.getElementById('navOverlay') || legacyHeader?.querySelector('#navOverlay,.nav-overlay,.intl-overlay');
    if (legacyOverlay && legacyOverlay.parentElement !== body) body.appendChild(legacyOverlay);

    let header = existing;
    if (!header || header.dataset.ethVersion !== VERSION) {
      const next = doc.createElement('header');
      next.className = 'eth';
      next.id = 'ethHeader';
      next.dataset.ethVersion = VERSION;
      next.innerHTML = headerMarkup;
      if (header) header.replaceWith(next);
      else if (legacyHeader) legacyHeader.replaceWith(next);
      else body.insertAdjacentElement('afterbegin', next);
      header = next;
    }

    let menu = doc.getElementById('ethMenu');
    if (!menu || menu.dataset.ethVersion !== VERSION) {
      const next = doc.createElement('div');
      next.id = 'ethMenu';
      next.className = 'eth-menu';
      next.dataset.ethVersion = VERSION;
      next.setAttribute('role', 'dialog');
      next.setAttribute('aria-modal', 'true');
      next.setAttribute('aria-label', copy.menu);
      next.hidden = true;
      next.innerHTML = menuMarkup;
      if (menu) menu.replaceWith(next);
      else header.insertAdjacentElement('afterend', next);
      menu = next;
    }

    ensureMainTarget();
    syncTheme();
    // Start in the right state (e.g. after a reload mid-page) without animating from the top.
    target = progress = Math.min(1, Math.max(0, scrollY / COMPACT_DISTANCE));
    updateHero(header);
    paint(header);
    header.classList.add('is-ready');
  };

  // Legacy scripts (e.g. the fish catalogue rebuild) may insert an old header later: remove it.
  const LEGACY_HEADERS = 'body > .site-header, body > .p-header, body > #etLiquidHeader, body > header.et-liquid-header';
  const removeLegacyHeaders = () => {
    doc.querySelectorAll(LEGACY_HEADERS).forEach(old => {
      old.querySelectorAll('#navOverlay,.nav-overlay,.intl-overlay').forEach(overlay => body.appendChild(overlay));
      old.remove();
    });
  };

  // ---- theme
  const readTheme = () => {
    const value = root.dataset.etTheme;
    if (value === 'dark' || value === 'light') return value;
    try {
      const saved = localStorage.getItem('et_theme_mode');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (_) {}
    return 'light';
  };

  const syncTheme = () => {
    const isDark = readTheme() === 'dark';
    doc.querySelectorAll('.eth-theme').forEach(button => {
      button.setAttribute('aria-pressed', String(isDark));
      button.innerHTML = isDark ? icon.sun : icon.moon;
    });
  };

  const setTheme = theme => {
    const next = theme === 'dark' ? 'dark' : 'light';
    if (window.ETTheme?.set) {
      window.ETTheme.set(next);
    } else {
      root.dataset.etTheme = next;
      root.style.colorScheme = next;
      try { localStorage.setItem('et_theme_mode', next); } catch (_) {}
      window.dispatchEvent(new CustomEvent('et:themechange', { detail: { theme: next } }));
    }
    syncTheme();
  };

  // ---- full-screen menu
  let lastFocus = null;
  const focusable = el => [...el.querySelectorAll('a[href],button:not([disabled])')].filter(n => n.offsetParent !== null);

  const setMenu = open => {
    const menu = doc.getElementById('ethMenu');
    const button = doc.querySelector('.eth-menu-btn');
    if (!menu || !button) return;
    if (open === !menu.hidden) return;

    if (open) {
      lastFocus = doc.activeElement;
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
      body.classList.add('eth-menu-open');
      button.setAttribute('aria-expanded', 'true');
      menu.querySelector('.eth-menu__close')?.focus({ preventScroll: true });
    } else {
      menu.classList.remove('is-open');
      body.classList.remove('eth-menu-open');
      button.setAttribute('aria-expanded', 'false');
      const done = () => { if (!menu.classList.contains('is-open')) menu.hidden = true; };
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) done();
      else setTimeout(done, 320);
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus({ preventScroll: true });
    }
  };

  // ---- scroll / hero states
  const heroSelector = [
    'main > .hero', 'main > .page-hero', 'main > .es-hero', 'main > .intl-hero', 'main > .ar-hero',
    'main > .product-hero', 'main > .about-hero', 'main > .news-hero', 'main > section.hero',
    'main > section[class$="-hero"]', 'main > section[class*="-hero "]'
  ].join(',');

  // Gradual contraction: --eth-p eases from 0 (top) to 1 (compact) as the page scrolls.
  const COMPACT_DISTANCE = 280;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let progress = 0;
  let target = 0;
  let frame = 0;
  const nextFrame = fn => (doc.hidden ? setTimeout(fn, 16) : requestAnimationFrame(fn));

  const updateHero = header => {
    const hero = doc.querySelector(heroSelector);
    let overHero = false;
    if (hero) {
      const rect = hero.getBoundingClientRect();
      const probe = Math.min(header.getBoundingClientRect().bottom, 140) * 0.6;
      overHero = rect.top <= probe && rect.bottom > probe;
    }
    header.classList.toggle('is-over-hero', overHero);
  };

  const paint = header => {
    header.style.setProperty('--eth-p', progress.toFixed(4));
    header.classList.toggle('is-compact', progress > 0.6);
    header.classList.toggle('is-scrolled', progress > 0.02);
  };

  const step = () => {
    frame = 0;
    const header = doc.getElementById('ethHeader');
    if (!header) return;
    const delta = target - progress;
    progress = reduceMotion.matches || Math.abs(delta) < 0.002 ? target : progress + delta * 0.16;
    paint(header);
    if (progress !== target) frame = nextFrame(step);
  };

  const updateScrollState = () => {
    const header = doc.getElementById('ethHeader');
    if (!header) return;
    updateHero(header);
    target = Math.min(1, Math.max(0, scrollY / COMPACT_DISTANCE));
    if (!frame) frame = nextFrame(step);
  };
  const requestUpdate = updateScrollState;

  install();
  // The hero can still be settling (fonts, images, late scripts) when the header installs.
  setTimeout(updateScrollState, 60);
  setTimeout(updateScrollState, 600);
  if (doc.readyState !== 'complete') window.addEventListener('load', updateScrollState, { once: true });

  if (!window.__ethEventsBound) {
    window.__ethEventsBound = true;

    doc.addEventListener('click', event => {
      if (event.target.closest('.eth-menu-btn')) {
        event.preventDefault();
        const menu = doc.getElementById('ethMenu');
        setMenu(menu ? menu.hidden : true);
        return;
      }
      if (event.target.closest('.eth-menu__close')) {
        event.preventDefault();
        setMenu(false);
        return;
      }
      if (event.target.closest('.eth-theme')) {
        event.preventDefault();
        setTheme(readTheme() === 'dark' ? 'light' : 'dark');
        return;
      }
      if (event.target.closest('#ethMenu a[href]')) setMenu(false);
    });

    doc.addEventListener('keydown', event => {
      const menu = doc.getElementById('ethMenu');
      if (!menu || menu.hidden) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenu(false);
        return;
      }
      if (event.key === 'Tab') {
        const items = focusable(menu);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && doc.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && doc.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    window.addEventListener('et:themechange', syncTheme);
  }

  // Re-install if a legacy script replaces or removes the header later.
  // Capped so a legacy script that keeps re-inserting its header can never loop with this one.
  let queued = false;
  let repairs = 0;
  const observer = new MutationObserver(() => {
    if (queued) return;
    const missing = !doc.getElementById('ethHeader') || !doc.getElementById('ethMenu');
    if (!missing && !doc.querySelector(LEGACY_HEADERS)) return;
    if (++repairs > 12) {
      observer.disconnect();
      return;
    }
    queued = true;
    queueMicrotask(() => {
      queued = false;
      if (!doc.getElementById('ethHeader') || !doc.getElementById('ethMenu')) install();
      removeLegacyHeaders();
    });
  });
  observer.observe(body, { childList: true });
})();
