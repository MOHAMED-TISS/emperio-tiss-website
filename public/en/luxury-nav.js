/* EMPERIO TISS — clean English navigation */
(function () {
  'use strict';

  const doc = document;
  const win = window;

  function getMenuButton() {
    return doc.getElementById('menuToggleBtn') || doc.querySelector('.menu-toggle, .es-menu, .mobile-menu');
  }

  function getOverlay() {
    return doc.getElementById('navOverlay');
  }

  function setPageIdentity() {
    const path = win.location.pathname.toLowerCase();
    let page = 'standard';
    if (path.includes('seafood')) page = 'seafood';
    else if (path.includes('fruits-vegetables')) page = 'produce';
    else if (path.includes('seasonal')) page = 'seasonal';
    else if (path.includes('/news')) page = 'news';
    doc.body.dataset.sitePage = page;
  }

  function setMenu(open) {
    const button = getMenuButton();
    const overlay = getOverlay();

    doc.body.classList.toggle('nav-open', open);
    doc.documentElement.classList.toggle('menu-lock', open);
    doc.body.classList.toggle('menu-lock', open);

    if (button) {
      button.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    if (overlay) {
      overlay.setAttribute('aria-hidden', String(!open));
      overlay.classList.toggle('is-open', open);
    }
  }

  function normalizeButton() {
    const button = getMenuButton();
    if (!button) return null;

    button.id = 'menuToggleBtn';
    button.type = 'button';
    button.setAttribute('aria-controls', 'navOverlay');

    let bars = button.querySelectorAll('span:not(.et-menu-label)');
    while (bars.length < 3) {
      button.appendChild(doc.createElement('span'));
      bars = button.querySelectorAll('span:not(.et-menu-label)');
    }

    if (!button.querySelector('.et-menu-label')) {
      const label = doc.createElement('span');
      label.className = 'et-menu-label';
      label.textContent = 'MENU';
      button.appendChild(label);
    }

    return button;
  }

  function addLanguageBar() {
    const header = doc.querySelector('#luxuryHeader .header-inner, .site-header .header-inner, .site-header .nav-wrap');
    if (!header || header.querySelector('.et-language-switch')) return;

    const path = win.location.pathname.toLowerCase();
    const currentLanguage = path.startsWith('/en/') || path === '/en/' ? 'EN' : path.startsWith('/fr/') ? 'FR' : path.startsWith('/ar/') ? 'AR' : 'ES';

    const links = [
      ['ES', '/'],
      ['EN', '/en/index.html'],
      ['FR', '/fr/index.html'],
      ['AR', '/ar/index.html']
    ];

    const box = doc.createElement('nav');
    box.className = 'et-language-switch';
    box.setAttribute('aria-label', 'Language');

    links.forEach(function (item, index) {
      const link = doc.createElement('a');
      link.href = item[1];
      link.textContent = item[0];
      if (item[0] === currentLanguage) link.className = 'current';
      box.appendChild(link);

      if (index < links.length - 1) {
        const separator = doc.createElement('span');
        separator.className = 'sep';
        separator.textContent = '·';
        separator.setAttribute('aria-hidden', 'true');
        box.appendChild(separator);
      }
    });

    const button = getMenuButton();
    if (button) header.insertBefore(box, button);
    else header.appendChild(box);
  }

  function bind() {
    setPageIdentity();
    const button = normalizeButton();
    const overlay = getOverlay();

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        setMenu(!doc.body.classList.contains('nav-open'));
      });
    }

    if (overlay) {
      overlay.addEventListener('click', function (event) {
        if (event.target === overlay) setMenu(false);
      });
      overlay.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () { setMenu(false); });
      });
    }

    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setMenu(false);
    });

    win.addEventListener('pageshow', function () { setMenu(false); });

    addLanguageBar();
    setMenu(false);
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', bind, { once: true });
  else bind();
})();
