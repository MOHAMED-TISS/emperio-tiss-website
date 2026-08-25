/* EMPERIO TISS — final header cleanup
   Removes only legacy inline header mutations emitted by global.js.
   Header structure and visual styling remain in HTML + header-final.css.
*/
(() => {
  'use strict';

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
        .replace(/\.es-page\.about-page \.nav-overlay-contact\{display:none!important\}\s*/g, '')
        .replace(/\.es-page\.about-page \.nav-overlay-links > a:last-child\{color:var\(--et-gold\)!important\}\s*/g, '')
        .replace(/\.es-page\.about-page \.nav-overlay-links > a:last-child:hover\{color:#fff!important\}\s*/g, '');
    });
  };

  clearLegacyInlineHeaderStyles();
  clearLegacyAboutMenuOverrides();

  const observer = new MutationObserver(() => {
    clearLegacyInlineHeaderStyles();
    clearLegacyAboutMenuOverrides();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
