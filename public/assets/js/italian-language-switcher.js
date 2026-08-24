(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  if ((root.lang || '').slice(0, 2).toLowerCase() !== 'it') return;

  const routes = [
    ['ES', '/'],
    ['EN', '/en/'],
    ['FR', '/fr/'],
    ['AR', '/ar/']
  ];

  const currentPath = window.location.pathname || '/';
  const itPath = currentPath.startsWith('/it/') ? currentPath.slice(3) || '/' : '/';
  const routeFor = (prefix) => prefix === '/' ? (itPath === '/' ? '/' : itPath) : `${prefix}${itPath === '/' ? '/' : itPath}`;

  const init = () => {
    const nav = doc.querySelector('.site-header .et-language-switch');
    if (!nav || nav.dataset.itLanguageFinal === 'true') return !!nav;

    nav.replaceChildren();
    nav.classList.remove('is-open');

    const button = doc.createElement('button');
    button.type = 'button';
    button.className = 'et-language-current';
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Cambia lingua');
    button.innerHTML = '<span>IT</span><i aria-hidden="true"></i>';

    const menu = doc.createElement('div');
    menu.className = 'et-language-dropdown';
    menu.setAttribute('role', 'menu');

    routes.forEach(([label, prefix]) => {
      const link = doc.createElement('a');
      link.href = routeFor(prefix);
      link.textContent = label;
      link.setAttribute('role', 'menuitem');
      menu.appendChild(link);
    });

    nav.append(button, menu);
    nav.dataset.itLanguageFinal = 'true';
    nav.dataset.etLanguageReady = 'true';

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const open = nav.classList.contains('is-open');
      doc.querySelectorAll('.et-language-switch.is-open').forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.et-language-current')?.setAttribute('aria-expanded', 'false');
      });
      nav.classList.toggle('is-open', !open);
      button.setAttribute('aria-expanded', String(!open));
    });

    nav.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      nav.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      button.focus();
    });

    return true;
  };

  if (init()) {
    doc.addEventListener('click', (event) => {
      if (!event.target.closest('.et-language-switch')) {
        doc.querySelectorAll('.et-language-switch.is-open').forEach((nav) => nav.classList.remove('is-open'));
      }
    });
    return;
  }

  const observer = new MutationObserver(() => {
    if (init()) observer.disconnect();
  });
  observer.observe(doc.body, { childList: true, subtree: true });
})();
