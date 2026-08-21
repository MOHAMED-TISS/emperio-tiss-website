/* Compatibility shim: universal interactions are centralized in /assets/js/global.js. */
(() => {
  const load = () => {
    if (window.__ET_GLOBAL_LOADED__) return;
    window.__ET_GLOBAL_LOADED__ = true;
    const script = document.createElement('script');
    script.src = '/assets/js/global.js';
    document.head.appendChild(script);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load, { once: true });
  else load();
})();
