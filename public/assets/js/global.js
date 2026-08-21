/* EMPERIO TISS — GLOBAL INTERACTION SYSTEM */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const get = (selector, scope = doc) => scope.querySelector(selector);

  /* Native pointer: never hide the user's system cursor. */
  root.classList.remove('et-pointer-ready');
  get('.et-pointer')?.remove();

  /* Header scroll state */
  const header = get('.site-header');
  const updateHeader = () => {
    header?.classList.toggle('scrolled', window.scrollY > 24);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* Universal navigation: supports both canonical .mobile-menu and the
     established .es-menu used by the Spanish editorial pages. */
  const button = get('#menuToggleBtn, .mobile-menu, .es-menu');
  const overlay = get('#navOverlay, .nav-overlay');

  if (button && overlay) {
    const setOpen = (open) => {
      body.classList.toggle('nav-open', open);
      body.classList.toggle('menu-open', open);
      button.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      overlay.setAttribute('aria-hidden', String(!open));
      doc.documentElement.classList.toggle('menu-is-open', open);
    };

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const open = body.classList.contains('nav-open') || body.classList.contains('menu-open');
      setOpen(!open);
    }, true);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) setOpen(false);
    });

    overlay.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    doc.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) setOpen(false);
    }, { passive: true });
  }

  /* Accessible language dropdowns using data attributes. */
  doc.querySelectorAll('[data-language-toggle]').forEach((toggle) => {
    const menuId = toggle.getAttribute('aria-controls');
    const menu = menuId ? doc.getElementById(menuId) : get('[data-language-menu]', toggle.parentElement || doc);
    if (!menu) return;

    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    };

    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.hidden = open;
    });

    doc.addEventListener('click', (event) => {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) close();
    });
  });
})();
