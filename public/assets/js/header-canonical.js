/* EMPERIO TISS — CANONICAL PUBLIC HEADER
   One DOM structure for every public route and language.
   The approved Home masthead is the single source of truth.
*/
(() => {
  'use strict';

  const VERSION = '20261008-eth-yield-1';
  if (window.__etCanonicalHeaderVersion === VERSION) return;
  window.__etCanonicalHeaderVersion = VERSION;
  window.__etHeaderFinalReady = true; // compatibility with older cached loaders.

  const doc = document;
  const body = doc.body;
  const root = doc.documentElement;

  if (
    body?.classList.contains('liquid-header-v23') ||
    doc.getElementById('etLiquidHeader')
  ) return;

  const path = (window.location.pathname || '/').replace(/\/+/g, '/');
  const lang = (root.lang || 'es').slice(0, 2).toLowerCase();
  const supported = ['es', 'en', 'fr', 'it', 'ar'];
  const currentLang = supported.includes(lang) ? lang : 'es';

  if (
    path === '/private' ||
    path.startsWith('/private/') ||
    body.classList.contains('private-page') ||
    body.classList.contains('private-admin-page')
  ) return;

  const copy = {
    es: {
      company: 'Empresa',
      products: 'Productos',
      markets: 'Mercados',
      contact: 'Contacto',
      navLeft: 'Accesos principales',
      navRight: 'Mercados y contacto',
      languages: 'Idiomas',
      menu: 'Abrir menú',
      home: 'EMPERIO TISS - Inicio',
      whatsapp: 'Contactar por WhatsApp'
    },
    en: {
      company: 'Company',
      products: 'Products',
      markets: 'Markets',
      contact: 'Contact',
      navLeft: 'Main navigation',
      navRight: 'Markets and contact',
      languages: 'Languages',
      menu: 'Open menu',
      home: 'EMPERIO TISS - Home',
      whatsapp: 'Contact us on WhatsApp'
    },
    fr: {
      company: 'Entreprise',
      products: 'Produits',
      markets: 'Marchés',
      contact: 'Contact',
      navLeft: 'Navigation principale',
      navRight: 'Marchés et contact',
      languages: 'Langues',
      menu: 'Ouvrir le menu',
      home: 'EMPERIO TISS - Accueil',
      whatsapp: 'Contacter sur WhatsApp'
    },
    it: {
      company: 'Azienda',
      products: 'Prodotti',
      markets: 'Mercati',
      contact: 'Contatti',
      navLeft: 'Navigazione principale',
      navRight: 'Mercati e contatti',
      languages: 'Lingue',
      menu: 'Apri menu',
      home: 'EMPERIO TISS - Home',
      whatsapp: 'Contattaci su WhatsApp'
    },
    ar: {
      company: 'الشركة',
      products: 'المنتجات',
      markets: 'الأسواق',
      contact: 'اتصل بنا',
      navLeft: 'التنقل الرئيسي',
      navRight: 'الأسواق والاتصال',
      languages: 'اللغات',
      menu: 'فتح القائمة',
      home: 'EMPERIO TISS - الرئيسية',
      whatsapp: 'تواصل معنا عبر واتساب'
    }
  }[currentLang];

  const prefix = currentLang === 'es' ? '' : `/${currentLang}`;
  const base = `${prefix}/`;
  const route = (segment) => `${prefix}/${segment}/`;

  const contentPath = (() => {
    let pathname = path;
    for (const code of ['en', 'fr', 'it', 'ar']) {
      const p = `/${code}`;
      if (pathname === p || pathname.startsWith(`${p}/`)) {
        pathname = pathname.slice(p.length) || '/';
        break;
      }
    }
    return pathname.startsWith('/') ? pathname : `/${pathname}`;
  })();

  const languageHref = (code) => {
    if (code === 'es') return contentPath;
    return `/${code}${contentPath === '/' ? '/' : contentPath}`;
  };

  const isSection = (segment) => {
    const normalized = contentPath.replace(/^\/+|\/+$/g, '');
    return normalized === segment || normalized.startsWith(`${segment}/`);
  };

  const currentAttr = (segment) =>
    isSection(segment) ? ' class="is-active" aria-current="page"' : '';

  const whatsappIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.5 3.5A10.9 10.9 0 0 0 13 1.1 10.9 10.9 0 0 0 3.2 17.4L2 22l4.7-1.2A10.9 10.9 0 1 0 20.5 3.5Zm-7.4 17.2a9.1 9.1 0 0 1-4.6-1.2l-.3-.2-2.8.7.8-2.7.8-2.7.2-.3a9.1 9.1 0 1 1 7.1 3.7Zm5-6.8c-.3-.2-1.8-.9-2-.9-.3-.1-.4-.1-.6.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.5-.7-2.6-1.3-3.7-2.9-.3-.5.3-.5.8-1.6.1-.2.1-.4 0-.6 0-.2-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.8.8-1.1 1.9-1.1 3 0 .7.2 1.3.5 1.9.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.5.6.5-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.1-.2-.2-.5-.3Z"/></svg>';

  const languageLinks = ['es', 'en', 'fr', 'it', 'ar'].map((code, index) => {
    const label = code.toUpperCase();
    const active = code === currentLang ? ' class="current" aria-current="page"' : '';
    const separator = index ? '<span>·</span>' : '';
    return `${separator}<a href="${languageHref(code)}"${active}>${label}</a>`;
  }).join('');

  const headerMarkup = `
    <div class="header-inner">
      <nav class="home-header-nav" aria-label="${copy.navLeft}">
        <a href="${route('about')}"${currentAttr('about')}>${copy.company}</a>
        <a href="${route('products')}"${currentAttr('products')}>${copy.products}</a>
      </nav>
      <a href="${base}" class="site-logo" aria-label="${copy.home}">
        <img class="home-metal-logo" src="/assets/images/emperio-tiss-emblem.svg?v=20261008-brand" alt="EMPERIO TISS S.L." width="230" height="267">
      </a>
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
      <button id="menuToggleBtn" class="mobile-menu" type="button" aria-label="${copy.menu}" aria-expanded="false" aria-controls="navOverlay">
        <span></span><span></span><span></span>
      </button>
    </div>`;

  const clearLegacyInlineHeaderStyles = (header) => {
    [
      'left', 'right', 'inset-inline', 'width', 'margin-inline',
      'padding-inline', 'transform'
    ].forEach((property) => header.style.removeProperty(property));
  };

  // The 2026 header (header-universal.js) owns every public page now: stand down so the two never fight.
  const ethInCharge = () =>
    Boolean(doc.getElementById('ethHeader') || doc.querySelector('script[src*="header-universal.js"]'));

  const installCanonicalHeader = () => {
    if (ethInCharge()) return;
    body.classList.add('et-brand-shell');

    let header = doc.querySelector('body > .site-header') || doc.querySelector('.site-header');

    if (!header) {
      header = doc.createElement('header');
      body.insertAdjacentElement('afterbegin', header);
    }

    if (header.dataset.etCanonicalHeader === VERSION) {
      clearLegacyInlineHeaderStyles(header);
      return;
    }

    // Some legacy product pages still keep #navOverlay inside the header.
    // Detach it before replacing the header or the menu DOM is destroyed with
    // the legacy header, leaving a visible toggle with nothing to open.
    const preservedOverlay =
      doc.getElementById('navOverlay') ||
      header.querySelector('.nav-overlay,.intl-overlay') ||
      doc.querySelector('.nav-overlay,.intl-overlay');
    if (preservedOverlay && preservedOverlay.parentElement !== body) {
      body.appendChild(preservedOverlay);
    }

    const canonical = doc.createElement('header');
    canonical.className = 'site-header';
    canonical.id = 'luxuryHeader';
    canonical.dataset.etCanonicalHeader = VERSION;
    canonical.innerHTML = headerMarkup;

    header.replaceWith(canonical);
    clearLegacyInlineHeaderStyles(canonical);

    const overlay = preservedOverlay || doc.getElementById('navOverlay');
    if (overlay && overlay.parentElement !== body) body.appendChild(overlay);
  };

  installCanonicalHeader();

  // A few legacy scripts can still mutate or replace the header after DOM ready.
  // Reassert the canonical structure only when the header itself was replaced.
  const observer = new MutationObserver(() => {
    if (ethInCharge()) {
      observer.disconnect();
      return;
    }
    const header = doc.querySelector('body > .site-header') || doc.querySelector('.site-header');
    if (!header || header.dataset.etCanonicalHeader !== VERSION) installCanonicalHeader();
  });

  observer.observe(body, { childList: true, subtree: true });
})();
