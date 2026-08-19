/* EMPERIO TISS — clean global navigation */
(function () {
  'use strict';

  const d = document;
  const w = window;

  const getMenu = () => d.getElementById('menuToggleBtn');
  const getOverlay = () => d.getElementById('navOverlay');
  const isEnglish = () => /^\/en(?:\/|$)/.test(w.location.pathname);

  function setMenu(open) {
    const button = getMenu();
    const overlay = getOverlay();

    d.body.classList.toggle('nav-open', open);
    d.documentElement.classList.toggle('menu-lock', open);
    d.body.classList.toggle('menu-lock', open);

    if (button) {
      button.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open
        ? (isEnglish() ? 'Close menu' : 'Cerrar menú')
        : (isEnglish() ? 'Open menu' : 'Abrir menú'));
    }

    if (overlay) overlay.setAttribute('aria-hidden', String(!open));
  }

  function normalizeButton() {
    const button = getMenu();
    if (!button) return;

    button.type = 'button';
    button.setAttribute('aria-controls', 'navOverlay');

    if (!button.querySelector('.et-menu-label')) {
      const label = d.createElement('span');
      label.className = 'et-menu-label';
      label.textContent = isEnglish() ? 'MENU' : 'MENÚ';
      button.appendChild(label);
    }
  }

  function addLanguagePill() {
    const host = d.querySelector('.es-header-inner, #luxuryHeader .header-inner, .site-header .header-inner');
    const button = getMenu();
    if (!host || !button || host.querySelector('.et-language-switch')) return;

    const en = isEnglish();
    const box = d.createElement('div');
    box.className = 'et-language-switch';

    const primary = d.createElement('a');
    primary.className = 'current';
    primary.href = en ? '/en/index.html' : '/index.html';
    primary.textContent = en ? 'EN' : 'ES';

    const separator = d.createElement('span');
    separator.className = 'sep';
    separator.textContent = '·';

    const secondary = d.createElement('a');
    secondary.href = en ? '/index.html' : '/en/index.html';
    secondary.textContent = en ? 'ES' : 'EN';

    box.append(primary, separator, secondary);
    host.insertBefore(box, button);
  }

  function init() {
    normalizeButton();
    addLanguagePill();
    setMenu(false);

    const button = getMenu();
    const overlay = getOverlay();

    if (button && !button.dataset.navBound) {
      button.dataset.navBound = 'true';
      button.addEventListener('click', function (event) {
        event.preventDefault();
        setMenu(!d.body.classList.contains('nav-open'));
      });
    }

    if (overlay && !overlay.dataset.navBound) {
      overlay.dataset.navBound = 'true';
      overlay.addEventListener('click', function (event) {
        if (event.target === overlay) setMenu(false);
      });
    }

    d.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setMenu(false);
    });

    d.querySelectorAll('#navOverlay a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenu(false);
      });
    });
  }

  d.addEventListener('DOMContentLoaded', init);
  w.addEventListener('pageshow', function () { setMenu(false); });
})();
