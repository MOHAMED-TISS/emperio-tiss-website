(() => {
  'use strict';

  if (!(document.documentElement.lang || '').toLowerCase().startsWith('ar')) return;

  const head = document.head;
  const css = [
    '/assets/css/ar/visual.css',
    '/assets/css/ar/home.css',
    '/assets/css/ar/pages.css',
    '/assets/css/ar/catalogues.css'
  ];

  for (const href of css) {
    if (head.querySelector(`link[href^="${href}"]`)) continue;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${href}?v=20260912-ar-separation-1`;
    head.appendChild(link);
  }
})();
