/* EMPERIO TISS — final header cleanup
   Removes only legacy inline header mutations emitted by global.js?v=20260922-shared-shell.
   Header structure and visual styling remain in HTML + header-final.css?v=20260922-shared-shell.
*/
(() => {
  'use strict';

  if (window.__etHeaderFinalReady) return;
  window.__etHeaderFinalReady = true;

  const clearLegacyInlineHeaderStyles = () => {
    document.querySelectorAll('.site-header').forEach((header) => {
      [
        'left',
        'right',
        'inset-inline',
        'width',
        'margin-inline',
        'padding-inline',
        'transform'
      ].forEach((property) => header.style.removeProperty(property));
    });

    document
      .querySelectorAll('.site-header .et-language-switch, .site-header .language-nav')
      .forEach((control) => {
        [
          'width',
          'min-width',
          'height',
          'margin-inline-start',
          'padding',
          'border',
          'border-radius',
          'background',
          'box-shadow',
          'backdrop-filter',
          '-webkit-backdrop-filter',
          'overflow'
        ].forEach((property) => control.style.removeProperty(property));
      });

    document.getElementById('et-social-actions-style')?.remove();
  };

  /* About must use the same universal menu as the ES homepage.
     Remove only the old About-specific menu rules from its inline style block. */
  const clearLegacyAboutMenuOverrides = () => {
    if (!document.body.classList.contains('about-page')) return;

    document.querySelectorAll('head style').forEach((style) => {
      if (!style.textContent.includes('.es-page.about-page .nav-overlay-contact')) return;

      style.textContent = style.textContent
        .replace(
          /\.es-page\.about-page \.nav-overlay-contact\{display:none!important\}\s*/g, '')
        .replace(
          /\.es-page\.about-page \.nav-overlay-links > a:last-child\{color:var\(--et-gold\)!important\}\s*/g,
          '')
        .replace(
          /\.es-page\.about-page \.nav-overlay-links > a:last-child:hover\{color:#fff!important\}\s*/g,
          '');
    });
  };


  // Enhance whichever localized shell owns this route; retain its menu and language controls.
  const applyBrandShell = () => {
    const doc = document;
    doc.body.classList.add('et-brand-shell');
    const lang = (doc.documentElement.lang || 'es').slice(0, 2);
    const labels = {
      es: ['Empresa', 'Productos', 'Mercados', 'Contacto'],
      en: ['Company', 'Products', 'Markets', 'Contact'],
      fr: ['Entreprise', 'Produits', 'Marchés', 'Contact'],
      it: ['Azienda', 'Prodotti', 'Mercati', 'Contatti'],
      ar: ['الشركة', 'المنتجات', 'الأسواق', 'اتصل بنا']
    }[lang] || ['Company', 'Products', 'Markets', 'Contact'];
    const base = lang === 'es' ? '/' : `/${lang}/`;
    const inner = doc.querySelector('.site-header .header-inner');
    if (inner && !inner.querySelector('.home-header-nav')) {
      const nav = doc.createElement('nav');
      nav.className = 'home-header-nav';
      nav.setAttribute('aria-label', labels.slice(0,2).join(' · '));
      nav.innerHTML = `<a href="${base}about/">${labels[0]}</a><a href="${base}products/">${labels[1]}</a>`;
      inner.prepend(nav);
    }
    if (inner && !inner.querySelector('.home-header-secondary')) {
      const nav = doc.createElement('nav');
      nav.className = 'home-header-secondary';
      nav.setAttribute('aria-label', labels.slice(2).join(' · '));
      nav.innerHTML = `<a href="${base}markets/">${labels[2]}</a><a href="${base}contact/">${labels[3]}</a>`;
      inner.querySelector('.site-logo')?.after(nav);
    }
    doc.querySelectorAll('.site-header .site-logo img, .et-footer-logo').forEach(img => {
      const src = '/assets/images/emperio-tiss-logo.svg?v=20260922-arc-metal';
      if (img.getAttribute('src') !== src) img.setAttribute('src', src);
      if (img.closest('.site-header') && !img.classList.contains('home-metal-logo')) img.classList.add('home-metal-logo');
      img.alt = 'EMPERIO TISS S.L.';
      img.width = 440;
      img.height = 440;
    });
  };

  applyBrandShell();
  clearLegacyInlineHeaderStyles();
  clearLegacyAboutMenuOverrides();

  const observer = new MutationObserver(() => {
    applyBrandShell();
    clearLegacyInlineHeaderStyles();
    clearLegacyAboutMenuOverrides();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
