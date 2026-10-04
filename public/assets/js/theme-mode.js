(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  if (!body || body.classList.contains('private-page') || body.classList.contains('private-admin-page')) return;
  if (window.__etThemeModeLoaded) return;
  window.__etThemeModeLoaded = true;

  const STORAGE_KEY = 'et_theme_mode';
  const supported = new Set(['light','dark']);
  const lang = (root.lang || 'es').slice(0,2).toLowerCase();
  const labels = {
    es:{light:'Cambiar a modo claro',dark:'Cambiar a modo nocturno',name:'Tema visual',lightName:'Modo claro',darkName:'Modo nocturno'},
    en:{light:'Switch to light mode',dark:'Switch to dark mode',name:'Visual theme',lightName:'Light mode',darkName:'Night mode'},
    fr:{light:'Passer au mode clair',dark:'Passer au mode sombre',name:'Thème visuel',lightName:'Mode clair',darkName:'Mode sombre'},
    it:{light:'Passa alla modalità chiara',dark:'Passa alla modalità scura',name:'Tema visivo',lightName:'Modalità chiara',darkName:'Modalità scura'},
    ar:{light:'التبديل إلى الوضع الفاتح',dark:'التبديل إلى الوضع الداكن',name:'المظهر',lightName:'الوضع الفاتح',darkName:'الوضع الداكن'}
  }[lang] || {light:'Switch to light mode',dark:'Switch to dark mode',name:'Visual theme',lightName:'Light mode',darkName:'Night mode'};

  const readStored = () => {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return supported.has(value) ? value : null;
    } catch (_) {
      return null;
    }
  };

  const writeStored = value => {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (_) {}
  };

  const initial = supported.has(root.dataset.etTheme) ? root.dataset.etTheme : (readStored() || 'light');

  const updateThemeColor = theme => {
    let meta = doc.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = doc.createElement('meta');
      meta.name = 'theme-color';
      doc.head.appendChild(meta);
    }
    meta.content = theme === 'dark' ? '#081827' : '#F4F0E6';
  };

  const syncButtons = theme => {
    doc.querySelectorAll('.et-theme-toggle').forEach(button => {
      const isDark = theme === 'dark';
      const pressed = String(isDark);
      const aria = isDark ? labels.light : labels.dark;
      const label = isDark ? labels.lightName : labels.darkName;

      if (button.getAttribute('aria-pressed') !== pressed) button.setAttribute('aria-pressed', pressed);
      if (button.getAttribute('aria-label') !== aria) button.setAttribute('aria-label', aria);
      if (button.getAttribute('title') !== aria) button.setAttribute('title', aria);

      const text = button.querySelector('.et-theme-toggle__label');
      if (text && text.textContent !== label) text.textContent = label;
    });
  };

  const apply = (theme, persist=false) => {
    const next = supported.has(theme) ? theme : 'light';
    root.dataset.etTheme = next;
    root.style.colorScheme = next;
    if (persist) writeStored(next);
    updateThemeColor(next);
    syncButtons(next);
    window.dispatchEvent(new CustomEvent('et:themechange',{detail:{theme:next}}));
  };

  const icon = `
    <span class="et-theme-toggle__icon et-theme-toggle__icon--sun" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="3.4"></circle><path d="M12 2.4v2.1M12 19.5v2.1M4.2 4.2l1.5 1.5M18.3 18.3l1.5 1.5M2.4 12h2.1M19.5 12h2.1M4.2 19.8l1.5-1.5M18.3 5.7l1.5-1.5"></path></svg>
    </span>
    <span class="et-theme-toggle__icon et-theme-toggle__icon--moon" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false"><path d="M19.3 15.1A7.9 7.9 0 0 1 8.9 4.7 7.9 7.9 0 1 0 19.3 15.1Z"></path></svg>
    </span>`;

  const buildButton = (overlay=false) => {
    const button = doc.createElement('button');
    button.type = 'button';
    button.className = overlay ? 'et-theme-toggle et-theme-toggle--overlay' : 'et-theme-toggle';
    button.dataset.etThemeControl = 'true';
    button.innerHTML = overlay ? icon + '<span class="et-theme-toggle__label"></span>' : icon;
    button.addEventListener('click', () => {
      const current = root.dataset.etTheme === 'dark' ? 'dark' : 'light';
      apply(current === 'dark' ? 'light' : 'dark', true);
    });
    return button;
  };

  const ensureToggle = () => {
    const header = doc.querySelector('.site-header');
    if (header && !header.querySelector('.et-theme-toggle:not(.et-theme-toggle--overlay)')) {
      const container = header.querySelector('.header-inner') || header;
      const language = container.querySelector('.header-language-switch,.et-language-switch,.language-nav');
      const menu = container.querySelector('#menuToggleBtn,.mobile-menu');
      const button = buildButton(false);
      button.setAttribute('aria-label', labels.name);
      container.insertBefore(button, language || menu || null);
    }

    const overlay = doc.querySelector('.nav-overlay');
    if (overlay && !overlay.querySelector('.et-theme-toggle--overlay')) {
      const foot = overlay.querySelector('.nav-overlay-foot') || overlay.querySelector('.nav-overlay-inner') || overlay;
      const button = buildButton(true);
      foot.appendChild(button);
    }
    syncButtons(root.dataset.etTheme || initial);
  };

  apply(initial, false);
  ensureToggle();

  let observerQueued = false;
  const observer = new MutationObserver(() => {
    if (observerQueued) return;
    observerQueued = true;
    requestAnimationFrame(() => {
      observerQueued = false;
      ensureToggle();
    });
  });
  observer.observe(body,{childList:true,subtree:true});

  window.ETTheme = Object.freeze({
    get: () => root.dataset.etTheme || 'light',
    set: theme => apply(theme, true)
  });
})();