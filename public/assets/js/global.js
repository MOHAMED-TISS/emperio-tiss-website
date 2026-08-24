(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const lang = (root.lang || 'en').slice(0, 2).toLowerCase();

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
    script.async = false;
    script.dataset[key] = 'true';
    doc.head.appendChild(script);
  };

  loadCss('/assets/css/site-pages.css?v=20260821-3', 'etSitePages');
  loadCss('/assets/css/site-pages-unified.css?v=20260821-1', 'etUnifiedPages');
  loadCss('/assets/css/canonical-nav.css?v=20260824-2', 'etCanonicalNav');
  loadCss('/assets/css/catalogue-taxonomy.css?v=20260823-catalogue-1', 'etCatalogueTaxonomy');
  loadCss('/assets/css/nav-consistency.css?v=20260823-nav-1', 'etNavConsistency');
  loadCss('/assets/css/catalogue-type-scale-unified.css?v=20260823-es-baseline-2', 'etCatalogueTypeScale');
  loadCss('/assets/css/catalogue-filter-contrast-en-fr.css?v=20260823-filter-contrast-1', 'etCatalogueFilterContrast');
  loadCss('/assets/css/header-final.css?v=20260824-11', 'etHeaderFinalCanonical');

  if (['en', 'fr', 'ar'].includes(lang)) {
    loadScript('/assets/js/international-shell.js?v=20260824-2', 'etInternationalShell');
  }

  const socialCopy = {
    es: { whatsapp: 'Contactar por WhatsApp', linkedin: 'LinkedIn' },
    en: { whatsapp: 'Contact us on WhatsApp', linkedin: 'LinkedIn' },
    fr: { whatsapp: 'Contacter sur WhatsApp', linkedin: 'LinkedIn' },
    ar: { whatsapp: 'تواصل معنا عبر واتساب', linkedin: 'LinkedIn' }
  }[lang] || { whatsapp: 'Contact us on WhatsApp', linkedin: 'LinkedIn' };

  const whatsappHref = 'https://wa.me/34614270684';
  const linkedinHref = 'https://www.linkedin.com/company/emperiotiss/';
  const whatsappIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.5 3.5A10.9 10.9 0 0 0 13 1.1 10.9 10.9 0 0 0 3.2 17.4L2 22l4.7-1.2A10.9 10.9 0 1 0 20.5 3.5Zm-7.4 17.2a9.1 9.1 0 0 1-4.6-1.2l-.3-.2-2.8.7-.8-2.7.8-2.7.2-.3a9.1 9.1 0 1 1 7.1 3.7Zm5-6.8c-.3-.2-1.8-.9-2-.9-.3-.1-.4-.1-.6.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.5-.7-2.6-1.3-3.7-2.9-.3-.5.3-.5.8-1.6.1-.2.1-.4 0-.6 0-.2-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.8.8-1.1 1.9-1.1 3 0 .7.2 1.3.5 1.9.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.5.6.5-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.1-.2-.2-.5-.3Z"/></svg>';
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
    header.innerHTML = `
      <div class="header-inner">
        <a href="/" class="site-logo" aria-label="EMPERIO TISS - Inicio">
          <img src="/logo.png" alt="EMPERIO TISS" width="94" height="62">
        </a>
        <a href="${whatsappHref}" class="et-whatsapp" target="_blank" rel="noopener noreferrer" aria-label="${socialCopy.whatsapp}">
          ${whatsappIcon}<span>${socialCopy.whatsapp}</span>
        </a>
        <nav class="et-language-switch" aria-label="Idiomas">
          <a href="/" class="current">ES</a><span>·</span><a href="/en/">EN</a><span>·</span><a href="/fr/">FR</a><span>·</span><a href="/ar/">AR</a>
        </nav>
        <button id="menuToggleBtn" class="mobile-menu" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="navOverlay">
          <span></span><span></span><span></span>
        </button>
      </div>`;

    if (oldHeader) oldHeader.replaceWith(header);
    else doc.body.insertAdjacentElement('afterbegin', header);

    const overlay = existingOverlay || doc.querySelector('#navOverlay');
    if (overlay && overlay.parentElement !== doc.body) doc.body.appendChild(overlay);
  };

  rebuildFishHeader();

  const ensureHeaderWhatsApp = () => {
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
    if (link.parentElement !== container) {
      container.insertBefore(link, reference);
      return;
    }
    if (reference && link.nextElementSibling !== reference) container.insertBefore(link, reference);
  };

  const ensureFooterLinkedIn = () => {
    const footer = doc.querySelector('footer');
    if (!footer || footer.querySelector('.et-linkedin')) return;
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

  const enhance = () => { ensureHeaderWhatsApp(); ensureFooterLinkedIn(); };
  enhance();
  new MutationObserver(enhance).observe(doc.body, { childList: true, subtree: true });

  const catalogueImageSelector = ['.fish-catalog-card img','.catalog-card img','.catalog-product img','.fish-gallery__image','.fish-lightbox__image','[data-catalog] img','.compact-catalog img','.seafood-catalog img','.fish-emblematic-card img'].join(',');
  const protectCatalogueImages = (rootElement = doc) => rootElement.querySelectorAll(catalogueImageSelector).forEach((img) => {
    img.setAttribute('draggable', 'false'); img.setAttribute('oncontextmenu', 'return false'); img.setAttribute('ondragstart', 'return false'); img.setAttribute('onselectstart', 'return false');
    img.style.userSelect = 'none'; img.style.webkitUserDrag = 'none'; img.style.webkitTouchCallout = 'none';
  });
  protectCatalogueImages();
  doc.addEventListener('contextmenu', (event) => { if (event.target.closest(catalogueImageSelector)) event.preventDefault(); }, true);
  doc.addEventListener('dragstart', (event) => { const image = event.target.closest('img'); if (image && image.matches(catalogueImageSelector)) event.preventDefault(); }, true);
  doc.addEventListener('selectstart', (event) => { if (event.target.closest(catalogueImageSelector)) event.preventDefault(); }, true);
  new MutationObserver(() => protectCatalogueImages()).observe(doc.documentElement, { childList: true, subtree: true });

  loadScript('/assets/js/language-dropdown.js?v=20260824-5', 'etLanguageDropdown');
  loadScript('/assets/js/header-final.js?v=20260824-1', 'etHeaderFinalScript');
  loadScript('/assets/js/global-core.js?v=20260823-taxonomy-5', 'etGlobalCore');
  loadScript('/assets/js/catalog-polish.js?v=20260823-catalogue-polish-1', 'etCatalogPolish');
  loadScript('/assets/js/site-polish.js?v=20260823-site-polish-1', 'etSitePolish');
  loadScript('/assets/js/fish-filter-crossing.js?v=20260823-fish-filter-2', 'etFishFilterCrossing');
  loadScript('/assets/js/en-catalog-filter-fix.js?v=20260823-en-filter-2', 'etEnCatalogFilterFix');
})();
