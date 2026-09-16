(() => {
  'use strict';

  const page = document.querySelector('.home-page');
  if (!page) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Add a lightweight scroll progress rail without changing the header shell.
  const hero = page.querySelector('.hero');
  if (hero && !hero.querySelector('.home-scroll-progress')) {
    const progress = document.createElement('div');
    progress.className = 'home-scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    progress.innerHTML = '<span></span>';
    hero.appendChild(progress);
  }

  const progressBar = hero?.querySelector('.home-scroll-progress span');
  const updateProgress = () => {
    if (!progressBar || !hero) return;
    const rect = hero.getBoundingClientRect();
    const visible = Math.min(1, Math.max(0, -rect.top / Math.max(1, hero.offsetHeight - window.innerHeight)));
    progressBar.style.height = `${visible * 100}%`;
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });

  // Reveal sections only when they enter the viewport.
  const revealNodes = page.querySelectorAll(
    '.intro-section .intro-content, .products-section .section-heading, .product-list, .markets-top, .markets-title, .market-grid, .company-grid, .contact-inner'
  );
  revealNodes.forEach((node) => node.classList.add('home-reveal'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealNodes.forEach((node) => observer.observe(node));
  }

  // Turn product and market grids into staggered entrances.
  page.querySelectorAll('.product-list, .market-grid').forEach((grid) => {
    grid.classList.add('home-stagger');
    if (reduceMotion) grid.classList.add('is-visible');
  });

  // Subtle pointer parallax on the hero image for desktop only.
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches && hero) {
    let raf = 0;
    hero.addEventListener('pointermove', (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 16;
      const y = (event.clientY / window.innerHeight - 0.5) * 10;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        hero.style.setProperty('--hm-parallax-x', `${x}px`);
        hero.style.setProperty('--hm-parallax-y', `${y}px`);
      });
    });
    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--hm-parallax-x', '0px');
      hero.style.setProperty('--hm-parallax-y', '0px');
    });
  }
})();
