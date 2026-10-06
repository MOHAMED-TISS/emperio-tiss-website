/* EMPERIO TISS — UNIVERSAL LIQUID GLASS HEADER
   One isolated masthead for every public page and language.
   Does not reuse legacy .site-header markup or styling.
*/
(() => {
  'use strict';

  const VERSION = '20261006-liquid-universal-8';
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

  const supported = ['es','en','fr','it','ar'];
  const detected = (root.lang || 'es').slice(0,2).toLowerCase();
  const lang = supported.includes(detected) ? detected : 'es';
  const prefix = lang === 'es' ? '' : `/${lang}`;
  const base = `${prefix}/`;
  const route = segment => `${prefix}/${String(segment).replace(/^\/+|\/+$/g,'')}/`;

  const copy = {
    es: {
      home:'Inicio', company:'Empresa', products:'Productos', markets:'Mercados', news:'Noticias',
      contact:'Contacto', signature:'Signature', languages:'Idiomas', menu:'Abrir menú', close:'Cerrar menú',
      seafood:'Productos del mar', fish:'Pescados', shellfish:'Mariscos', cephalopods:'Cefalópodos',
      fruits:'Frutas', vegetables:'Hortalizas', seasonal:'Temporada',
      enquiry:'Consulta empresarial', locale:'Madrid · Europa · África · Mediterráneo'
    },
    en: {
      home:'Home', company:'Company', products:'Products', markets:'Markets', news:'News',
      contact:'Contact', signature:'Signature', languages:'Languages', menu:'Open menu', close:'Close menu',
      seafood:'Seafood', fish:'Fish', shellfish:'Shellfish', cephalopods:'Cephalopods',
      fruits:'Fruits', vegetables:'Vegetables', seasonal:'Seasonal',
      enquiry:'Business enquiry', locale:'Madrid · Europe · Africa · Mediterranean'
    },
    fr: {
      home:'Accueil', company:'Entreprise', products:'Produits', markets:'Marchés', news:'Actualités',
      contact:'Contact', signature:'Signature', languages:'Langues', menu:'Ouvrir le menu', close:'Fermer le menu',
      seafood:'Produits de la mer', fish:'Poissons', shellfish:'Crustacés', cephalopods:'Céphalopodes',
      fruits:'Fruits', vegetables:'Légumes', seasonal:'Saison',
      enquiry:'Demande commerciale', locale:'Madrid · Europe · Afrique · Méditerranée'
    },
    it: {
      home:'Home', company:'Azienda', products:'Prodotti', markets:'Mercati', news:'Notizie',
      contact:'Contatti', signature:'Signature', languages:'Lingue', menu:'Apri menu', close:'Chiudi menu',
      seafood:'Prodotti del mare', fish:'Pesce', shellfish:'Crostacei', cephalopods:'Cefalopodi',
      fruits:'Frutta', vegetables:'Ortaggi', seasonal:'Stagionale',
      enquiry:'Richiesta commerciale', locale:'Madrid · Europa · Africa · Mediterraneo'
    },
    ar: {
      home:'الرئيسية', company:'الشركة', products:'المنتجات', markets:'الأسواق', news:'الأخبار',
      contact:'اتصل بنا', signature:'Signature', languages:'اللغات', menu:'فتح القائمة', close:'إغلاق القائمة',
      seafood:'المأكولات البحرية', fish:'الأسماك', shellfish:'الرخويات', cephalopods:'رأسيات الأرجل',
      fruits:'الفواكه', vegetables:'الخضروات', seasonal:'الموسمية',
      enquiry:'استفسار تجاري', locale:'مدريد · أوروبا · أفريقيا · البحر المتوسط'
    }
  }[lang];

  const contentPath = (() => {
    let pathname = rawPath;
    for (const code of ['en','fr','it','ar']) {
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

  const normalizedSection = contentPath.replace(/^\/+|\/+$/g,'');
  const isSection = section =>
    normalizedSection === section || normalizedSection.startsWith(`${section}/`);
  const activeAttr = section =>
    isSection(section) ? ' class="is-active" aria-current="page"' : '';

  const languageMenu = supported.map(code => {
    const active = code === lang ? ' class="current" aria-current="page"' : '';
    return `<a href="${languageHref(code)}"${active}>${code.toUpperCase()}</a>`;
  }).join('');

  const headerMarkup = `
    <div class="et-liquid-bar">
      <button id="etLiquidMenuBtn" class="et-liquid-menu" type="button" aria-label="${copy.menu}" aria-expanded="false" aria-controls="navOverlay">
        <span></span><span></span><span></span>
      </button>

      <a href="${base}" class="et-liquid-logo" aria-label="EMPERIO TISS">
        <img src="/assets/images/emperio-tiss-emblem.svg" alt="EMPERIO TISS" width="230" height="267" draggable="false">
      </a>

      <nav class="et-liquid-nav" aria-label="${copy.company} · ${copy.products} · ${copy.seasonal} · ${copy.markets} · ${copy.news}">
        <a href="${route('about')}"${activeAttr('about')}>${copy.company}</a>
        <a href="${route('products')}"${activeAttr('products')}>${copy.products}</a>
        <a href="${route('products/seasonal')}"${activeAttr('products/seasonal')}>${copy.seasonal}</a>
        <a href="${route('markets')}"${activeAttr('markets')}>${copy.markets}</a>
        <a href="${route('news')}"${activeAttr('news')}>${copy.news}</a>
      </nav>

      <div class="et-liquid-tools">
        <details class="et-liquid-language">
          <summary class="et-liquid-lang" aria-label="${copy.languages}">${lang.toUpperCase()}</summary>
          <nav class="et-liquid-language-menu" aria-label="${copy.languages}">
            ${languageMenu}
          </nav>
        </details>

        <button class="et-liquid-theme" type="button" aria-label="Tema visual" aria-pressed="false"></button>

        <div class="et-liquid-ctas">
          <a class="et-liquid-signature" href="${route('news')}#emperio-private">${copy.signature}</a>
          <a class="et-liquid-contact" href="${route('contact')}">${copy.contact}</a>
        </div>
      </div>
    </div>`;

  const overlayMarkup = `
    <div class="nav-overlay-inner">
      <nav class="nav-overlay-links" aria-label="${copy.menu}" data-et-navigation-built="true">
        <a href="${base}"${contentPath === '/' ? ' class="active" aria-current="page"' : ''}><span class="idx">01</span><span>${copy.home}</span></a>
        <a href="${route('about')}"${activeAttr('about')}><span class="idx">02</span><span>${copy.company}</span></a>
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
          </div>
        </details>
        <a href="${route('products/seasonal')}"${activeAttr('products/seasonal')}><span class="idx">04</span><span>${copy.seasonal}</span></a>
        <a href="${route('markets')}"${activeAttr('markets')}><span class="idx">05</span><span>${copy.markets}</span></a>
        <a href="${route('news')}"${activeAttr('news')}><span class="idx">06</span><span>${copy.news}</span></a>
        <a href="${route('contact')}"${activeAttr('contact')}><span class="idx">07</span><span>${copy.contact}</span></a>
      </nav>
      <div class="nav-overlay-foot">
        <div class="nav-overlay-lang">${supported.map(code => `<a href="${languageHref(code)}"${code === lang ? ' class="current" aria-current="page"' : ''}>${code.toUpperCase()}</a>`).join('<span>·</span>')}</div>
        <div class="nav-overlay-contact">
          <a href="${route('contact')}">${copy.enquiry}</a>
          <span>${copy.locale}</span>
        </div>
      </div>
    </div>`;

  const ensureCss = () => {
    if (doc.querySelector('link[data-et-liquid-header-css],link[href*="header-liquid-v23.css"]')) return;
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/header-liquid-v23.css?v=20261006-liquid-universal-8';
    link.dataset.etLiquidHeaderCss = 'true';
    doc.head.appendChild(link);
  };

  const install = () => {
    ensureCss();
    body.classList.add('liquid-header-v23','et-liquid-universal');

    const existingLiquid = doc.getElementById('etLiquidHeader');
    const legacyHeader =
      doc.querySelector('body > .site-header') ||
      doc.querySelector('body > .p-header') ||
      doc.querySelector('body > .admin-topbar');

    const nestedOverlay =
      doc.getElementById('navOverlay') ||
      legacyHeader?.querySelector('#navOverlay,.nav-overlay,.intl-overlay') ||
      existingLiquid?.querySelector('#navOverlay,.nav-overlay,.intl-overlay');

    if (nestedOverlay && nestedOverlay.parentElement !== body) body.appendChild(nestedOverlay);

    let header = existingLiquid;
    if (!header || header.dataset.etLiquidUniversal !== VERSION) {
      const next = doc.createElement('header');
      next.className = 'et-liquid-header';
      next.id = 'etLiquidHeader';
      next.dataset.etLiquidUniversal = VERSION;
      next.innerHTML = headerMarkup;

      if (header) header.replaceWith(next);
      else if (legacyHeader) legacyHeader.replaceWith(next);
      else body.insertAdjacentElement('afterbegin', next);

      header = next;
    } else if (!header.querySelector('.et-liquid-language')) {
      header.innerHTML = headerMarkup;
    }

    let overlay = doc.getElementById('navOverlay');
    const overlayReady =
      overlay?.dataset.etLiquidUniversal === VERSION &&
      overlay.querySelector('.nav-product-parent') &&
      overlay.querySelector('.nav-product-children');

    if (!overlayReady) {
      const nextOverlay = doc.createElement('div');
      nextOverlay.id = 'navOverlay';
      nextOverlay.className = 'nav-overlay';
      nextOverlay.setAttribute('aria-hidden','true');
      nextOverlay.dataset.etLiquidUniversal = VERSION;
      nextOverlay.innerHTML = overlayMarkup;

      if (overlay) overlay.replaceWith(nextOverlay);
      else header.insertAdjacentElement('afterend',nextOverlay);
      overlay = nextOverlay;
    }

    if (overlay.parentElement !== body) body.appendChild(overlay);
    syncThemeIcon();
    updateScrollState(true);
  };

  const sunIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/><circle cx="12" cy="12" r="4"/></svg>';
  const moonIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 15.6A8.5 8.5 0 0 1 8.4 3.6 8.6 8.6 0 1 0 20.4 15.6Z"/></svg>';

  const readTheme = () => {
    const current = root.dataset.etTheme;
    if (current === 'dark' || current === 'light') return current;
    try {
      const saved = localStorage.getItem('et_theme_mode');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (_) {}
    return 'light';
  };

  const syncThemeIcon = () => {
    const button = doc.querySelector('.et-liquid-theme');
    if (!button) return;
    const theme = readTheme();
    const isDark = theme === 'dark';
    button.setAttribute('aria-pressed',String(isDark));
    button.innerHTML = isDark ? sunIcon : moonIcon;
  };

  const setTheme = theme => {
    const next = theme === 'dark' ? 'dark' : 'light';
    if (window.ETTheme?.set) {
      window.ETTheme.set(next);
    } else {
      root.dataset.etTheme = next;
      root.style.colorScheme = next;
      try { localStorage.setItem('et_theme_mode',next); } catch (_) {}
      window.dispatchEvent(new CustomEvent('et:themechange',{detail:{theme:next}}));
    }
    syncThemeIcon();
  };

  const menuState = open => {
    const button = doc.querySelector('.et-liquid-menu');
    const overlay = doc.getElementById('navOverlay');
    if (!button || !overlay) return;

    body.classList.toggle('nav-open',open);
    body.classList.toggle('menu-open',open);
    root.classList.toggle('menu-is-open',open);
    button.classList.toggle('is-open',open);
    button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',open ? copy.close : copy.menu);
    overlay.setAttribute('aria-hidden',String(!open));
  };

  let target = 0;
  let current = 0;
  let raf = 0;

  const heroSelector = [
    'main > .hero',
    'main > .page-hero',
    'main > .es-hero',
    'main > .intl-hero',
    'main > .ar-hero',
    'main > .product-hero',
    'main > .about-hero',
    'main > .news-hero',
    'main > section.hero',
    'main > section[class$="-hero"]'
  ].join(',');

  const updateHeroContrast = () => {
    const header = doc.getElementById('etLiquidHeader');
    const hero = doc.querySelector(heroSelector);
    if (!header || !hero) {
      header?.classList.remove('is-over-hero');
      return;
    }

    const headerRect = header.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();
    const probeY = Math.max(headerRect.top, 0) + Math.min(headerRect.height || 88, 88) * .55;
    const overHero = heroRect.top <= probeY && heroRect.bottom > probeY;
    header.classList.toggle('is-over-hero', overHero);
  };

  const scrollTarget = () => {
    if (matchMedia('(max-width:980px)').matches) return 0;
    return Math.min(1,Math.max(0,scrollY / 520));
  };

  const renderScroll = force => {
    const bar = doc.querySelector('.et-liquid-bar');
    if (!bar) {
      raf = 0;
      return;
    }

    const delta = target - current;
    current = force ? target : current + delta * .105;

    const vw = innerWidth;
    const endWidth = vw >= 1700 ? 62 : vw >= 1500 ? 70 : vw >= 1280 ? 78 : vw >= 1050 ? 84 : 90;
    const width = 100 - ((100 - endWidth) * current);
    const height = 88 - (26 * current);
    const blur = 34 + (10 * current);
    const pad = 44 - (12 * current);

    bar.style.setProperty('--elh-p',current.toFixed(4));
    bar.style.setProperty('--elh-width',width.toFixed(3) + '%');
    bar.style.setProperty('--elh-height',height.toFixed(2) + 'px');
    bar.style.setProperty('--elh-blur',blur.toFixed(1) + 'px');
    bar.style.setProperty('--elh-pad',pad.toFixed(1) + 'px');

    if (!force && Math.abs(delta) > .0007) raf = requestAnimationFrame(() => renderScroll(false));
    else raf = 0;
  };

  const updateScrollState = (force=false) => {
    updateHeroContrast();
    target = scrollTarget();
    if (force) {
      current = target;
      renderScroll(true);
      return;
    }
    if (!raf) raf = requestAnimationFrame(() => renderScroll(false));
  };

  install();

  if (!window.__etLiquidUniversalEventsBound) {
    window.__etLiquidUniversalEventsBound = true;

    doc.addEventListener('click', event => {
      const menuButton = event.target.closest('.et-liquid-menu');
      if (menuButton) {
        event.preventDefault();
        event.stopPropagation();
        menuState(menuButton.getAttribute('aria-expanded') !== 'true');
        return;
      }

      const themeButton = event.target.closest('.et-liquid-theme');
      if (themeButton) {
        event.preventDefault();
        setTheme(readTheme() === 'dark' ? 'light' : 'dark');
        return;
      }

      const overlay = event.target.closest('#navOverlay');
      if (overlay && (event.target === overlay || event.target.closest('a'))) {
        menuState(false);
      }

      doc.querySelectorAll('.et-liquid-language[open]').forEach(details => {
        if (!event.target.closest('.et-liquid-language')) details.removeAttribute('open');
      });
    });

    doc.addEventListener('keydown',event => {
      if (event.key === 'Escape') {
        menuState(false);
        doc.querySelectorAll('.et-liquid-language[open]').forEach(details => details.removeAttribute('open'));
      }
    });

    window.addEventListener('resize',() => {
      if (innerWidth > 980) menuState(false);
      updateScrollState(true);
    },{passive:true});

    window.addEventListener('scroll',() => updateScrollState(false),{passive:true});
    window.addEventListener('et:themechange',() => {
      syncThemeIcon();
      updateHeroContrast();
    });
  }

  let observerQueued = false;
  const observer = new MutationObserver(() => {
    if (observerQueued) return;
    if (doc.getElementById('etLiquidHeader')) return;
    observerQueued = true;
    queueMicrotask(() => {
      observerQueued = false;
      if (!doc.getElementById('etLiquidHeader')) install();
    });
  });
  observer.observe(body,{childList:true,subtree:true});
})();