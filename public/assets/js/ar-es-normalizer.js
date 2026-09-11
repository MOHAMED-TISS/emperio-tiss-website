(() => {
  'use strict';

  const doc = document;
  const body = doc.body;
  if (!body || !doc.documentElement.lang.toLowerCase().startsWith('ar')) return;

  const classMap = new Map([
    ['ar-page', 'es-page'],
    ['ar-container', 'es-container'],
    ['ar-hero', 'es-hero'],
    ['ar-hero-inner', 'es-container'],
    ['ar-kicker', 'es-kicker'],
    ['ar-lead', 'es-lead'],
    ['ar-section', 'es-section'],
    ['ar-grid', 'es-grid'],
    ['ar-label', 'es-label'],
    ['ar-copy', 'es-copy'],
    ['ar-cards', 'es-cards'],
    ['ar-card', 'es-card'],
    ['ar-cta', 'es-cta'],
    ['ar-actions', 'es-actions'],
    ['ar-btn', 'es-btn'],
    ['ar-footer', 'es-footer'],
    ['ar-footer-inner', 'es-container']
  ]);

  const normalize = () => {
    if (body.classList.contains('home-page') || body.classList.contains('markets-current') || body.classList.contains('news-current')) return;
    body.classList.add('es-page');
    for (const [from, to] of classMap) {
      if (from === 'ar-page') continue;
      doc.querySelectorAll(`.${from}`).forEach((element) => element.classList.add(to));
    }
    doc.querySelectorAll('.ar-page').forEach((element) => element.classList.add('es-page'));
  };

  normalize();
  new MutationObserver(normalize).observe(doc.body, { childList: true, subtree: true });
})();
