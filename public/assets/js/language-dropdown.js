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

  const installSwitcherGuard = () => {
    if (doc.getElementById('et-language-switcher-guard')) return;
    const style = doc.createElement('style');
    style.id = 'et-language-switcher-guard';
    style.textContent = `
      .site-header .et-language-switch > a,
      .site-header .et-language-switch > span { display: none !important; }
      .site-header .et-language-switch > .et-language-current { display: inline-flex !important; }
      .site-header .et-language-switch > .et-language-dropdown { display: flex !important; }
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
        link.textContent = code;
        if (code === active) {
          link.className = 'current';
          link.setAttribute('aria-current', 'page');
        }
        return link;
      });

      nav.replaceChildren(...links.reduce((nodes, link, index) => {
        if (index) {
          const sep = doc.createElement('span');
          sep.textContent = '·';
          nodes.push(sep);
        }
        nodes.push(link);
        return nodes;
      }, []));

      const current = links.find((link) => link.classList.contains('current')) || links[0];
      const alternatives = links.filter((link) => link !== current);

      const button = doc.createElement('button');
      button.type = 'button';
      button.className = 'et-language-current';
      button.setAttribute('aria-haspopup', 'true');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Change language');
      button.innerHTML = `<span>${current.textContent.trim()}</span><i aria-hidden="true"></i>`;

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
