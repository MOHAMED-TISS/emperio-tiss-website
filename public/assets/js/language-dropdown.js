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
    if (code === 'EN') return `/en${pathname === '/' ? '/' : pathname}`;
    if (code === 'FR') return `/fr${pathname === '/' ? '/' : pathname}`;
    if (code === 'IT') return `/it${pathname === '/' ? '/' : pathname}`;
    if (code === 'AR') return `/ar${pathname === '/' ? '/' : pathname}`;
    return pathname;
  };

  const closeAll = () => {
    doc.querySelectorAll('.et-language-switch.is-open').forEach((nav) => {
      nav.classList.remove('is-open');
      const button = nav.querySelector('.et-language-current');
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  };

  const normalizeSwitcher = (nav) => {
    if (!nav.closest('.site-header,.et-header-inner,.header-inner,.p-header-inner,.es-header-inner')) return;
    const pathname = normalizePath();
    const active = (root.lang || 'en').slice(0, 2).toUpperCase();
    const codes = ['ES', 'EN', 'FR', 'IT', 'AR'];
    const currentHrefs = new Map([...nav.querySelectorAll(':scope > a')].map((a) => [a.textContent.trim().toUpperCase(), a.href]));

    const links = codes.map((code) => {
      const a = doc.createElement('a');
      a.href = currentHrefs.get(code) || languageHref(code, pathname);
      a.textContent = code;
      if (code === active) {
        a.className = 'current';
        a.setAttribute('aria-current', 'page');
      }
      return a;
    });

    nav.querySelectorAll(':scope > button,.et-language-dropdown,:scope > a,:scope > span').forEach((node) => node.remove());
    links.forEach((link, index) => {
      if (index) {
        const sep = doc.createElement('span');
        sep.textContent = '·';
        nav.appendChild(sep);
      }
      nav.appendChild(link);
    });
    nav.dataset.etLanguageNormalized = 'true';
  };

  const enhance = () => {
    doc.querySelectorAll('.et-language-switch').forEach(normalizeSwitcher);
    doc.querySelectorAll('.et-language-switch').forEach((nav) => {
      if (nav.dataset.etLanguageReady === 'true') return;
      const links = [...nav.querySelectorAll(':scope > a')];
      if (links.length !== 5) return;

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