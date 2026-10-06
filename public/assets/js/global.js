(() => {
  'use strict';

  const doc = document;
  const root = document.documentElement;
  const lang = (root.lang || 'en').slice(0, 2).toLowerCase();
  const path = (window.location.pathname || '/').replace(/\/+/g, '/');
  const isProductPath = /\/products(?:\/|$)/.test(path);

  const assetPath = value => {
    try {
      return new URL(value, doc.baseURI).pathname;
    } catch (_) {
      return String(value || '').split('?')[0];
    }
  };

  const hasAsset = (selector, attribute, value) => {
    const target = assetPath(value);
    return [...doc.querySelectorAll(selector)].some(node =>
      assetPath(node.getAttribute(attribute) || '') === target);
  };

  const loadCss = (href, key) => {
    if (doc.querySelector(`link[data-${key}]`) ||
        hasAsset('link[rel="stylesheet"]', 'href', href)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset[key] = 'true';
    doc.head.appendChild(link);
  };

  const loadScript = (src, key) => {
    if (doc.querySelector(`script[data-${key}]`) ||
        hasAsset('script[src]', 'src', src)) return;
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.dataset[key] = 'true';
    doc.head.appendChild(script);
  };

  loadCss('/assets/css/site-pages.css?v=20260927-hero100', 'etSitePages');
  loadCss('/assets/css/site-pages-unified.css?v=20260928-home-header-1', 'etUnifiedPages');
  loadCss('/assets/css/canonical-nav.css?v=20260824-2', 'etCanonicalNav');
  loadCss('/assets/css/catalogue-taxonomy.css?v=20260823-catalogue-1', 'etCatalogueTaxonomy');
  if (isProductPath) {
    loadCss('/assets/css/catalogue-type-scale-unified.css?v=20260823-es-baseline-2', 'etCatalogueTypeScale');
    loadCss('/assets/css/catalogue-filter-contrast-en-fr.css?v=20260926-catalogue-only', 'etCatalogueFilterContrast');
  }
  loadCss('/assets/css/header-final.css?v=20261001-signature', 'etHeaderFinalCanonical');
  loadCss('/assets/css/theme-mode.css?v=20261004-3', 'etThemeModeCss');
  if (lang === 'ar' && !document.body.classList.contains('home-experience')) {
    loadCss('/assets/css/es-pages.css?v=20260911-es-ar-1', 'etEsPagesAr');
    loadScript('/assets/js/ar/loader.js?v=20260923-ar-idempotent', 'etArLayerLoader');
  }

  if (['en', 'fr', 'ar', 'it'].includes(lang) && !document.body.classList.contains('home-experience')) {
    loadScript('/assets/js/international-shell.js?v=20261003-terminal-footer-fix-1', 'etInternationalShell');
  }

  // Public interior brand layer must sit after legacy page CSS so the approved Home identity wins the cascade.
  loadCss('/assets/css/brand-interiors.css?v=20260928-catalogue-layout-3', 'etBrandInteriors');
  if (!document.body.classList.contains('home-experience') && !document.body.classList.contains('private-page') && !document.body.classList.contains('private-admin-page')) {
    loadCss('/assets/css/site-2026.css?v=20261003-4', 'etSite2026');
  }

  const socialCopy = {
    es: { whatsapp: 'Contactar por WhatsApp', linkedin: 'LinkedIn' },
    en: { whatsapp: 'Contact us on WhatsApp', linkedin: 'LinkedIn' },
    fr: { whatsapp: 'Contacter sur WhatsApp', linkedin: 'LinkedIn' },
    ar: { whatsapp: 'تواصل معنا عبر واتساب', linkedin: 'LinkedIn' },
    it: { whatsapp: 'Contattaci su WhatsApp', linkedin: 'LinkedIn' }
  }[lang] || { whatsapp: 'Contact us on WhatsApp', linkedin: 'LinkedIn' };

  const whatsappHref = 'https://wa.me/34614270684';
  const linkedinHref = 'https://www.linkedin.com/company/emperiotiss/';
  const whatsappIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.5 3.5A10.9 10.9 0 0 0 13 1.1 10.9 10.9 0 0 0 3.2 17.4L2 22l4.7-1.2A10.9 10.9 0 1 0 20.5 3.5Zm-7.4 17.2a9.1 9.1 0 0 1-4.6-1.2l-.3-.2-2.8.7.8-2.7.8-2.7.2-.3a9.1 9.1 0 1 1 7.1 3.7Zm5-6.8c-.3-.2-1.8-.9-2-.9-.3-.1-.4-.1-.6.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.5-.7-2.6-1.3-3.7-2.9-.3-.5.3-.5.8-1.6.1-.2.1-.4 0-.6 0-.2-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.8.8-1.1 1.9-1.1 3 0 .7.2 1.3.5 1.9.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.5.6.5-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.1-.2-.2-.5-.3Z"/></svg>';
  const linkedinIcon = '<span aria-hidden="true" class="et-linkedin-mark">in</span>';

  const rebuildFishHeader = () => {
    if (!document.body.classList.contains('fish-catalog-pilot')) return;
    const legacyStyle = Array.from(doc.querySelectorAll('style')).find((style) => style.textContent.includes('body.fish-catalog-pilot .site-header'));
    if (legacyStyle) {
      const text = legacyStyle.textContent;
      const start = text.indexOf('body.fish-catalog-pilot .site-header');
      const end = text.indexOf('.page-hero,.seafood-subpage .page-hero');
      if (start >= 0 && end > start) legacyStyle.textContent = `${text.slice(0, start)}${text.slice(end)}`;
    }
    const oldHeader = doc.querySelector('.fish-catalog-pilot > .site-header');
    const existingOverlay = doc.querySelector('#navOverlay');
    const header = doc.createElement('header');
    header.className = 'site-header';
    header.id = 'luxuryHeader';
    const fishHomeAria = {
      es: 'EMPERIO TISS - Inicio',
      en: 'EMPERIO TISS - Home',
      fr: 'EMPERIO TISS - Accueil',
      it: 'EMPERIO TISS - Home',
      ar: 'EMPERIO TISS — الرئيسية'
    }[lang] || 'EMPERIO TISS - Inicio';
    const fishHomeHref = lang === 'es' ? '/' : `/${lang}/`;
    const fishMenuAria = lang === 'ar' ? 'فتح القائمة' : 'Abrir menú';
    const fishLanguageAria = lang === 'ar' ? 'اللغة' : 'Idiomas';
    header.innerHTML = `<div class="header-inner"><a href="${fishHomeHref}" class="site-logo" aria-label="${fishHomeAria}"><img class="home-metal-logo" src="/assets/images/emperio-tiss-emblem.svg?v=20261003-header-current" alt="EMPERIO TISS S.L." width="230" height="267"></a><a href="${whatsappHref}" class="et-whatsapp" target="_blank" rel="noopener noreferrer" aria-label="${socialCopy.whatsapp}">${whatsappIcon}<span>${socialCopy.whatsapp}</span></a><nav class="et-language-switch" aria-label="${fishLanguageAria}"><a href="/" class="current">ES</a><span>·</span><a href="/en/">EN</a><span>·</span><a href="/fr/">FR</a><span>·</span><a href="/ar/">AR</a><span>·</span><a href="/it/">IT</a></nav><button id="menuToggleBtn" class="mobile-menu" type="button" aria-label="${fishMenuAria}" aria-expanded="false" aria-controls="navOverlay"><span></span><span></span><span></span></button></div>`;
    if (oldHeader) oldHeader.replaceWith(header); else doc.body.insertAdjacentElement('afterbegin', header);
    const overlay = existingOverlay || doc.querySelector('#navOverlay');
    if (overlay && overlay.parentElement !== doc.body) doc.body.appendChild(overlay);
  };

  rebuildFishHeader();

  const italianHref = () => {
    let pathname = window.location.pathname || '/';
    for (const prefix of ['/en', '/fr', '/ar']) if (pathname === prefix || pathname.startsWith(`${prefix}/`)) pathname = pathname.slice(prefix.length) || '/';
    if (!pathname.startsWith('/')) pathname = `/${pathname}`;
    return `/it${pathname === '/' ? '/' : pathname}`;
  };

  const ensureItalianLanguageLinks = () => {
    if (lang === 'it') return;
    const href = italianHref();
    doc.querySelectorAll('.et-language-switch,.language-nav,.nav-overlay-lang').forEach((switcher) => {
      if (switcher.querySelector('a[href^="/it/"]')) return;
      const link = doc.createElement('a');
      link.href = href;
      link.textContent = 'IT';
      const trailing = Array.from(switcher.children).reverse().find((el) => el.tagName === 'A');
      if (trailing) {
        const sep = doc.createElement('span');
        sep.textContent = '·';
        trailing.insertAdjacentElement('afterend', sep);
        sep.insertAdjacentElement('afterend', link);
      } else switcher.appendChild(link);
    });
  };

  const ensureHeaderWhatsApp = () => {
    if (doc.body.classList.contains('liquid-header-v23')) return;
    const header = doc.querySelector('.site-header,.et-header-inner,.header-inner,.p-header-inner,.es-header-inner');
    if (!header) return;
    const container = header.querySelector('.header-inner') || header;
    let link = container.querySelector('.et-whatsapp');
    if (!link) link = header.querySelector('.et-whatsapp');
    if (!link) {
      link = doc.createElement('a');
      link.className = 'et-whatsapp';
      link.href = whatsappHref;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', socialCopy.whatsapp);
      link.innerHTML = `${whatsappIcon}<span>${socialCopy.whatsapp}</span>`;
    }
    const language = container.querySelector('.et-language-switch,.language-nav');
    const menu = container.querySelector('#menuToggleBtn,.mobile-menu,.es-menu,.p-menu');
    const reference = language || menu || null;
    if (link.parentElement !== container) { container.insertBefore(link, reference); return; }
    if (reference && link.nextElementSibling !== reference) container.insertBefore(link, reference);
  };

  const ensureFooterLinkedIn = () => {
    const footer = doc.querySelector('footer');
    if (!footer || footer.classList.contains('et-terminal-footer') || footer.querySelector('.et-linkedin')) return;
    const link = doc.createElement('a');
    link.className = 'et-linkedin';
    link.href = linkedinHref;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', socialCopy.linkedin);
    link.innerHTML = `${linkedinIcon}<span>${socialCopy.linkedin}</span>`;
    const bottom = footer.querySelector('.et-footer-bottom,.et-footer-legal,.footer-band-inner,.ar-footer-inner');
    if (bottom) bottom.appendChild(link); else footer.appendChild(link);
  };

  const enhance = () => { ensureHeaderWhatsApp(); ensureItalianLanguageLinks(); ensureFooterLinkedIn(); };
  enhance();
  new MutationObserver(enhance).observe(doc.body, { childList: true, subtree: true });

  const pageImageSelector = 'img';
  const protectPageImages = (rootElement = doc) => rootElement.querySelectorAll(pageImageSelector).forEach((img) => {
    img.setAttribute('draggable', 'false');
    img.setAttribute('oncontextmenu', 'return false');
    img.setAttribute('ondragstart', 'return false');
    img.setAttribute('onselectstart', 'return false');
    img.style.userSelect = 'none';
    img.style.webkitUserDrag = 'none';
    img.style.webkitTouchCallout = 'none';
  });
  protectPageImages();
  doc.addEventListener('contextmenu', (event) => { if (event.target instanceof Element && event.target.closest(pageImageSelector)) event.preventDefault(); }, true);
  doc.addEventListener('dragstart', (event) => { if (event.target instanceof Element && event.target.closest(pageImageSelector)) event.preventDefault(); }, true);
  doc.addEventListener('selectstart', (event) => { if (event.target instanceof Element && event.target.closest(pageImageSelector)) event.preventDefault(); }, true);
  new MutationObserver(() => protectPageImages()).observe(doc.documentElement, { childList: true, subtree: true });

  loadCss('/assets/css/header-liquid-v23.css?v=20261006-liquid-universal-10', 'etLiquidHeaderCss');
  loadScript('/assets/js/header-universal.js?v=20261006-liquid-universal-10', 'etUniversalHomeHeader');
  loadScript('/assets/js/theme-mode.js?v=20261004-3', 'etThemeModeScript');
  loadScript('/assets/js/language-dropdown.js?v=20260825-flags-1', 'etLanguageDropdown');
  loadScript('/assets/js/global-core.js?v=20261006-liquid-universal-10', 'etGlobalCore');
  loadScript('/assets/js/commercial-flow.js?v=20260928-es-set-1', 'etCommercialFlow');
  if (isProductPath) {
    loadScript('/assets/js/catalog-polish.js?v=20260926-product-only', 'etCatalogPolish');
    if (['en', 'fr'].includes(lang)) {
      loadScript('/assets/js/en-catalog-filter-fix.js?v=20260926-no-prototype-patch', 'etEnCatalogFilterFix');
    }
  }
  loadCss('/assets/css/cookie-consent.css?v=20261004-5', 'etCookieConsentCss');
  loadScript('/assets/js/cookie-consent.js?v=20261004-5', 'etCookieConsentScript');
  loadScript('/assets/js/analytics-events.js?v=20261004-3', 'etAnalyticsEventsScript');
  loadScript('/assets/js/site-polish.js?v=20261003-terminal-footer-fix-1', 'etSitePolish');
  loadCss('/assets/css/footer-terminal.css?v=20261003-4', 'etTerminalFooterCss');
  loadScript('/assets/js/footer-terminal.js?v=20261003-2', 'etTerminalFooterScript');

  // /products/ contrast must be physically last because site-2026/theme layers are injected at runtime.
  if (doc.body.classList.contains('products-landing-page') && doc.body.classList.contains('products-2026')) {
    const contrastHref = '/assets/css/products-contrast-2026.css?v=20261006-2';
    let contrastLink = [...doc.querySelectorAll('link[rel="stylesheet"]')].find(link =>
      assetPath(link.getAttribute('href') || '') === assetPath(contrastHref)
    );
    if (!contrastLink) {
      contrastLink = doc.createElement('link');
      contrastLink.rel = 'stylesheet';
      contrastLink.dataset.etProductsContrast = 'true';
      doc.head.appendChild(contrastLink);
    }
    contrastLink.href = contrastHref;
    doc.head.appendChild(contrastLink);
  }

  loadScript('/assets/js/smooth-scroll.js?v=20261003-1', 'etSmoothScroll');
})();