/* EMPERIO TISS — clean English navigation
   One responsibility: menu state + stable language switcher.
   Page styles remain in their own stylesheets. */
(function () {
  'use strict';

  const doc = document;
  const win = window;

  function getMenuButton() {
    return doc.getElementById('menuToggleBtn') ||
      doc.querySelector('.menu-toggle, .es-menu, .mobile-menu');
  }

  function getOverlay() {
    return doc.getElementById('navOverlay');
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

    const current = win.location.pathname.toLowerCase();
    const links = [
      { label: 'ES', href: '/' },
      { label: 'EN', href: '/en/index.html' },
      { label: 'FR', href: '/fr/index.html' },
      { label: 'AR', href: '/ar/index.html' }
    ];

    const box = doc.createElement('nav');
    box.className = 'et-language-switch';
    box.setAttribute('aria-label', 'Language');

    links.forEach(function (item, index) {
      const link = doc.createElement('a');
      link.href = item.href;
      link.textContent = item.label;

      const isEnglish = current === '/en' || current.startsWith('/en/');
      const isFrench = current === '/fr' || current.startsWith('/fr/');
      const isArabic = current === '/ar' || current.startsWith('/ar/');
      const active =
        (item.label === 'EN' && isEnglish) ||
        (item.label === 'FR' && isFrench) ||
        (item.label === 'AR' && isArabic) ||
        (item.label === 'ES' && !isEnglish && !isFrench && !isArabic);

      if (active) link.classList.add('current');
      box.appendChild(link);

      if (index < links.length - 1) {
        const separator = doc.createElement('span');
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
        link.addEventListener('click', function () {
          setMenu(false);
        });
      });
    }

    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setMenu(false);
    });

    win.addEventListener('pageshow', function () {
      setMenu(false);
    });

    addLanguageBar();
    setMenu(false);
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', bind, { once: true });
  } else {
    bind();
  }
})();
