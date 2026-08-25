(() => {
  'use strict';
  const root = document.querySelector('.markets-page');
  if (!root) return;

  root.classList.add('markets-vibrant-ready');

  const reveal = root.querySelectorAll('.markets-intro-copy, .markets-region-row, .markets-country-layout, .markets-africa-inner, .markets-mediterranean-inner, .markets-middleeast-grid, .markets-alliance-inner');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    reveal.forEach(el => io.observe(el));
  } else reveal.forEach(el => el.classList.add('is-visible'));

  const compass = root.querySelector('.markets-compass');
  const opening = root.querySelector('.markets-opening');
  if (compass && opening && matchMedia('(pointer:fine)').matches) {
    opening.addEventListener('pointermove', e => {
      const rect = opening.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      compass.style.setProperty('--mx', `${x * 18}px`);
      compass.style.setProperty('--my', `${y * 18}px`);
    });
    opening.addEventListener('pointerleave', () => {
      compass.style.setProperty('--mx', '0px');
      compass.style.setProperty('--my', '0px');
    });
  }

  root.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
