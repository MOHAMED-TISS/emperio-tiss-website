(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  if (root.lang !== 'es' || !body || !body.classList.contains('home-page')) return;

  body.classList.add('es-motion-ready');
  body.classList.add('es-page-enter');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const revealTargets = document.querySelectorAll(
    '.home-page section:not(.hero) .eyebrow,' +
    '.home-page section:not(.hero) h2,' +
    '.home-page section:not(.hero) .intro-lead,' +
    '.home-page section:not(.hero) .product-row,' +
    '.home-page section:not(.hero) .market-grid article,' +
    '.home-page section:not(.hero) .company-values div,' +
    '.home-page section:not(.hero) .contact-text,' +
    '.home-page section:not(.hero) .button'
  );

  revealTargets.forEach((element, index) => {
    element.classList.add('es-reveal');
    element.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 70}ms`);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(element => observer.observe(element));
  } else {
    revealTargets.forEach(element => element.classList.add('is-visible'));
  }
})();
