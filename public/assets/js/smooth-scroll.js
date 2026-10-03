/* EMPERIO TISS — global Lenis smooth/inertial scrolling
   Sitewide, shared by every public page and subpage.
*/
(() => {
  'use strict';

  if (window.__emperioSmoothScrollBooted) return;
  window.__emperioSmoothScrollBooted = true;

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if (reduced?.matches) {
    document.documentElement.classList.add('et-native-scroll');
    return;
  }

  const LENIS_SRC = 'https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.min.js';

  const installBaseStyles = () => {
    if (document.querySelector('style[data-et-lenis]')) return;
    const style = document.createElement('style');
    style.dataset.etLenis = 'true';
    style.textContent = `
      html.lenis, html.lenis body { height: auto; }
      .lenis.lenis-smooth { scroll-behavior: auto !important; }
      .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
      .lenis.lenis-stopped { overflow: hidden; }
      .lenis.lenis-smooth iframe { pointer-events: none; }
    `;
    document.head.appendChild(style);
  };

  const markNestedInteractiveAreas = () => {
    document.querySelectorAll('dialog, textarea, select').forEach((node) => {
      if (!node.hasAttribute('data-lenis-prevent')) {
        node.setAttribute('data-lenis-prevent', '');
      }
    });
  };

  const initLenis = () => {
    if (window.__emperioLenis || !window.Lenis) return window.__emperioLenis || null;

    installBaseStyles();
    markNestedInteractiveAreas();

    try {
      const lenis = new window.Lenis({
        duration: 1.05,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1
      });

      const raf = (time) => {
        lenis.raf(time);
        window.__emperioLenisRaf = requestAnimationFrame(raf);
      };
      window.__emperioLenisRaf = requestAnimationFrame(raf);

      const syncScrollTrigger = () => {
        if (window.ScrollTrigger?.update) {
          lenis.on('scroll', window.ScrollTrigger.update);
          return true;
        }
        return false;
      };

      if (!syncScrollTrigger()) {
        let tries = 0;
        const timer = window.setInterval(() => {
          tries += 1;
          if (syncScrollTrigger() || tries > 40) window.clearInterval(timer);
        }, 100);
      }

      window.__emperioLenis = lenis;
      document.documentElement.classList.add('et-lenis-ready');
      window.dispatchEvent(new CustomEvent('emperio:lenis-ready', { detail: { lenis } }));
      return lenis;
    } catch (_) {
      document.documentElement.classList.add('et-native-scroll');
      return null;
    }
  };

  if (window.Lenis) {
    initLenis();
    return;
  }

  const absoluteSrc = new URL(LENIS_SRC, document.baseURI).href;
  const existing = [...document.scripts].find((script) => script.src === absoluteSrc);

  if (existing) {
    existing.addEventListener('load', initLenis, { once: true });
    if (existing.dataset.loaded === 'true') initLenis();
    return;
  }

  const script = document.createElement('script');
  script.src = LENIS_SRC;
  script.defer = true;
  script.dataset.etLenisLibrary = 'true';
  script.addEventListener('load', () => {
    script.dataset.loaded = 'true';
    initLenis();
  }, { once: true });
  script.addEventListener('error', () => {
    document.documentElement.classList.add('et-native-scroll');
  }, { once: true });
  document.head.appendChild(script);
})();
