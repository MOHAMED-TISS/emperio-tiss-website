(() => {
  'use strict';

  if (!(document.documentElement.lang || '').toLowerCase().startsWith('ar')) return;

  const head = document.head;
  const assetVersion = '20260912-ar-separation-1';
  const css = [
    '/assets/css/ar/visual.css',
    '/assets/css/ar/home.css',
    '/assets/css/ar/pages.css',
    '/assets/css/ar/catalogues.css'
  ];
  const scripts = [
    '/assets/js/ar/es-normalizer.js',
    '/assets/js/ar/content-geography.js',
    '/assets/js/ar/catalogue-taxonomy.js'
  ];

  for (const href of css) {
    if (head.querySelector(`link[href^="${href}"]`)) continue;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${href}?v=${assetVersion}`;
    head.appendChild(link);
  }

  for (const src of scripts) {
    const key = `etAr${src.split('/').pop().replace(/[^a-z0-9]/gi, '')}`;
    if (document.querySelector(`script[data-ar-asset="${key}"]`)) continue;
    const script = document.createElement('script');
    script.src = `${src}?v=${assetVersion}`;
    script.async = false;
    script.dataset.arAsset = key;
    head.appendChild(script);
  }
})();
