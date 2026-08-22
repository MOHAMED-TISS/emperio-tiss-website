(() => {
  'use strict';

  const root = document.documentElement;
  if (root.lang !== 'es') return;

  const body = document.body;
  if (!body || !body.classList.contains('home-page')) return;

  body.classList.add('es-motion-ready');

  const curtain = document.createElement('div');
  curtain.className = 'es-page-curtain';
  curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = '<span></span><span></span>';
  document.body.prepend(curtain);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => body.classList.add('es-page-enter'));
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const revealTargets = document.querySelectorAll(
    '.home-page section:not(.hero) .eyebrow, .home-page section:not(.hero) h2, .home-page section:not(.hero) .product-row, .home-page section:not(.hero) .market-grid article, .home-page section:not(.hero) .company-values div'
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
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(element => observer.observe(element));
  } else {
    revealTargets.forEach(element => element.classList.add('is-visible'));
  }

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
    let target;
    try { target = new URL(href, window.location.href); } catch { return; }
    if (target.origin !== window.location.origin) return;

    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (target.pathname === window.location.pathname && target.search === window.location.search) return;
      event.preventDefault();
      curtain.classList.add('is-leaving');
      window.setTimeout(() => { window.location.href = target.href; }, 360);
    });
  });
})();
