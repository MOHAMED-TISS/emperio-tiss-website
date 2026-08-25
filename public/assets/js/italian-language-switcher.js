(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  if ((root.lang || '').slice(0, 2).toLowerCase() !== 'it') return;

  const flagMap = {
    ES: { src: '/assets/flags/es.svg?v=20260825-2', label: 'Español', href: '/' },
    EN: { src: '/assets/flags/en.svg?v=20260825-2', label: 'English', href: '/en/' },
    FR: { src: '/assets/flags/fr.svg?v=20260825-2', label: 'Français', href: '/fr/' },
    AR: { src: '/assets/flags/ar.svg?v=20260825-2', label: 'العربية', href: '/ar/' },
    IT: { src: '/assets/flags/it.svg?v=20260825-2', label: 'Italiano', href: '/it/' }
  };

  const currentPath = window.location.pathname || '/';
  const itPath = currentPath.startsWith('/it/') ? currentPath.slice(3) || '/' : '/';
  const routeFor = (code) => {
    const base = flagMap[code].href;
    if (code === 'IT') return `/it${itPath === '/' ? '/' : itPath}`;
    return base === '/' ? (itPath === '/' ? '/' : itPath) : `${base}${itPath === '/' ? '' : itPath}`;
  };

  const makeFlag = (code) => {
    const img = doc.createElement('img');
    img.className = 'et-language-flag';
    img.src = flagMap[code].src;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.title = flagMap[code].label;
    return img;
  };

  const closeAll = () => {
    doc.querySelectorAll('.et-language-switch.is-open').forEach((nav) => {
      nav.classList.remove('is-open');
      nav.querySelector('.et-language-current')?.setAttribute('aria-expanded', 'false');
    });
  };

  const init = () => {
    const nav = doc.querySelector('.site-header .et-language-switch');
    if (!nav || nav.dataset.itLanguageFinal === 'true') return !!nav;

    nav.replaceChildren();
    nav.classList.remove('is-open');

    const current = doc.createElement('button');
    current.type = 'button';
    current.className = 'et-language-current';
    current.setAttribute('aria-haspopup', 'true');
    current.setAttribute('aria-expanded', 'false');
    current.setAttribute('aria-label', 'Cambia lingua: Italiano');
    current.title = 'Cambia lingua: Italiano';
    current.append(makeFlag('IT'));
    const chevron = doc.createElement('i');
    chevron.setAttribute('aria-hidden', 'true');
    current.append(chevron);

    const menu = doc.createElement('div');
    menu.className = 'et-language-dropdown';
    menu.setAttribute('role', 'menu');

    ['ES', 'EN', 'FR', 'AR'].forEach((code) => {
      const link = doc.createElement('a');
      link.href = routeFor(code);
      link.setAttribute('role', 'menuitem');
      link.setAttribute('aria-label', flagMap[code].label);
      link.title = flagMap[code].label;
      link.append(makeFlag(code));
      menu.appendChild(link);
    });

    nav.append(current, menu);
    nav.dataset.itLanguageFinal = 'true';
    nav.dataset.etLanguageReady = 'true';

    current.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const open = nav.classList.contains('is-open');
      closeAll();
      if (!open) {
        nav.classList.add('is-open');
        current.setAttribute('aria-expanded', 'true');
      }
    });

    nav.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      closeAll();
      current.focus();
    });

    return true;
  };

  if (init()) {
    doc.addEventListener('click', (event) => {
      if (!event.target.closest('.et-language-switch')) closeAll();
    });
    return;
  }

  const observer = new MutationObserver(() => {
    if (init()) observer.disconnect();
  });
  observer.observe(doc.body, { childList: true, subtree: true });
})();
