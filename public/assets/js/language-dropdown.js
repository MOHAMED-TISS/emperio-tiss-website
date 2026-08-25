(() => {
  'use strict';
  const doc = document;
  const root = doc.documentElement;

  const normalizePath = () => {
    let pathname = window.location.pathname || '/';
    for (const prefix of ['/en', '/fr', '/it', '/ar']) {
      if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
        pathname = pathname.slice(prefix.length) || '/';
        break;
      }
    }
    if (!pathname.startsWith('/')) pathname = `/${pathname}`;
    return pathname;
  };

  const languageHref = (code, pathname) => {
    if (code === 'ES') return pathname;
    return `/${code.toLowerCase()}${pathname === '/' ? '/' : pathname}`;
  };

  const flagMap = {
    ES: { src: '/assets/flags/es.svg', label: 'Español' },
    EN: { src: '/assets/flags/en.svg', label: 'English' },
    FR: { src: '/assets/flags/fr.svg', label: 'Français' },
    IT: { src: '/assets/flags/it.svg', label: 'Italiano' },
    AR: { src: '/assets/flags/ar.svg', label: 'العربية' }
  };

  const installSwitcherGuard = () => {
    if (doc.getElementById('et-language-switcher-guard')) return;
    const style = doc.createElement('style');
    style.id = 'et-language-switcher-guard';
    style.textContent = `
      .site-header .et-language-switch > a,
      .site-header .et-language-switch > span { display: none !important; }
      .site-header .et-language-switch > .et-language-current { display: inline-flex !important; }
      .site-header .et-language-switch > .et-language-dropdown { display: flex !important; }

      .site-header .et-language-current,
      .site-header .et-language-dropdown a { color: #fff; }
      .site-header .et-language-flag {
        display: block;
        width: 23px;
        height: 15px;
        flex: 0 0 auto;
        object-fit: cover;
        border-radius: 3px;
        box-shadow: 0 0 0 1px rgba(255,255,255,.18), 0 2px 7px rgba(0,0,0,.18);
      }
      .site-header .et-language-current .et-language-flag {
        width: 24px;
        height: 16px;
      }
      .site-header .et-language-current {
        gap: 7px;
      }
      .site-header .et-language-dropdown a {
        gap: 7px;
        justify-content: flex-start;
        padding-inline: 8px;
      }
      .site-header .et-language-dropdown a .et-language-name {
        display: none;
      }
      .site-header .et-language-flag[aria-hidden="true"] { pointer-events:none; }
    `;
    doc.head.appendChild(style);
  };

  const closeAll = () => {
    doc.querySelectorAll('.et-language-switch.is-open').forEach((nav) => {
      nav.classList.remove('is-open');
      const button = nav.querySelector('.et-language-current');
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  };

  const makeFlag = (code) => {
    const meta = flagMap[code];
    const img = doc.createElement('img');
    img.className = 'et-language-flag';
    img.src = meta.src;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.title = meta.label;
    return img;
  };

  const makeName = (code) => {
    const span = doc.createElement('span');
    span.className = 'et-language-name';
    span.textContent = flagMap[code]?.label || code;
    return span;
  };

  const enhance = () => {
    installSwitcherGuard();
    const pathname = normalizePath();
    const active = (root.lang || 'en').slice(0, 2).toUpperCase();
    const codes = ['ES', 'EN', 'FR', 'IT', 'AR'];

    doc.querySelectorAll('.et-language-switch').forEach((nav) => {
      if (!nav.closest('.site-header,.et-header-inner,.header-inner,.p-header-inner,.es-header-inner')) return;
      if (nav.dataset.etLanguageReady === 'true' || nav.querySelector('.et-language-current')) return;

      const existing = new Map([...nav.querySelectorAll(':scope > a')].map((a) => [a.textContent.trim().toUpperCase(), a.href]));
      const links = codes.map((code) => {
        const link = doc.createElement('a');
        link.href = existing.get(code) || languageHref(code, pathname);
        link.dataset.languageCode = code;
        link.setAttribute('aria-label', flagMap[code].label);
        link.title = flagMap[code].label;
        if (code === active) {
          link.className = 'current';
          link.setAttribute('aria-current', 'page');
        }
        link.append(makeFlag(code), makeName(code));
        return link;
      });

      const current = links.find((link) => link.classList.contains('current')) || links[0];
      const alternatives = links.filter((link) => link !== current);

      const button = doc.createElement('button');
      button.type = 'button';
      button.className = 'et-language-current';
      button.setAttribute('aria-haspopup', 'true');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', `Change language: ${flagMap[active]?.label || active}`);
      button.title = `Change language: ${flagMap[active]?.label || active}`;
      button.append(makeFlag(active), (() => {
        const chevron = doc.createElement('i');
        chevron.setAttribute('aria-hidden', 'true');
        return chevron;
      })());

      const menu = doc.createElement('div');
      menu.className = 'et-language-dropdown';
      menu.setAttribute('role', 'menu');
      alternatives.forEach((link) => {
        const item = link.cloneNode(true);
        item.classList.remove('current');
        item.setAttribute('role', 'menuitem');
        menu.appendChild(item);
      });

      nav.replaceChildren(button, menu);
      nav.dataset.etLanguageReady = 'true';

      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const open = nav.classList.contains('is-open');
        closeAll();
        if (!open) {
          nav.classList.add('is-open');
          button.setAttribute('aria-expanded', 'true');
        }
      });

      nav.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeAll();
          button.focus();
        }
      });
    });
  };

  enhance();
  new MutationObserver(enhance).observe(doc.documentElement, { childList: true, subtree: true });
  doc.addEventListener('click', (event) => {
    if (!event.target.closest('.et-language-switch')) closeAll();
  });
})();
