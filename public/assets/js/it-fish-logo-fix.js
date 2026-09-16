(() => {
  'use strict';

  if (!window.location.pathname.startsWith('/it/products/seafood/fish/')) return;

  const homeHref = '/it/';
  const logo = document.querySelector('.site-header .site-logo');
  if (logo) {
    logo.setAttribute('href', homeHref);
    logo.setAttribute('aria-label', 'EMPERIO TISS — Home');
  }
})();
