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

  clearLegacyInlineHeaderStyles();

  const observer = new MutationObserver(() => {
    clearLegacyInlineHeaderStyles();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
