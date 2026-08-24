(() => {
  'use strict';
  const doc = document;

  const closeAll = () => {
    doc.querySelectorAll('.et-language-switch.is-open').forEach((nav) => {
      nav.classList.remove('is-open');
      const button = nav.querySelector('.et-language-current');
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  };

  const enhance = () => {
    doc.querySelectorAll('.et-language-switch').forEach((nav) => {
      if (nav.dataset.etLanguageReady === 'true') return;
      if (!nav.closest('.site-header,.et-header-inner,.header-inner,.p-header-inner,.es-header-inner')) return;

      const links = [...nav.querySelectorAll(':scope > a')];
      if (!links.length) return;

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
