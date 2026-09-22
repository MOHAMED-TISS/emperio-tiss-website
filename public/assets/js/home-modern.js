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

  // Load decorative video only when motion and data preferences allow it.
  const video = page.querySelector('.home-hero-video');
  const toggle = page.querySelector('.home-video-toggle');
  if (video && toggle) {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection;
    let userPaused = false;
    let inView = true;
    const allowed = () => !motion.matches && !connection?.saveData;
    const syncLabel = () => {
      toggle.textContent = video.paused ? 'Reproducir vídeo' : 'Pausar vídeo';
      toggle.setAttribute('aria-label', video.paused ? 'Reproducir vídeo de fondo' : 'Pausar vídeo de fondo');
    };
    const update = () => {
      if (!allowed() || userPaused || !inView || document.hidden) { video.pause(); return; }
      if (!video.getAttribute('src')) video.src = window.innerWidth < 768 ? video.dataset.mobileSrc : video.dataset.desktopSrc;
      video.muted = true;
      toggle.hidden = false;
      video.play().catch(syncLabel);
    };
    toggle.addEventListener('click', () => { userPaused = !video.paused; if (userPaused) video.pause(); else update(); });
    video.addEventListener('play', syncLabel);
    video.addEventListener('pause', syncLabel);
    video.addEventListener('error', () => { toggle.hidden = true; video.removeAttribute('src'); video.load(); });
    motion.addEventListener('change', () => { toggle.hidden = !allowed(); update(); });
    connection?.addEventListener('change', () => { toggle.hidden = !allowed(); update(); });
    document.addEventListener('visibilitychange', update);
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => { inView = entries[0].isIntersecting; update(); }, { threshold: 0 }).observe(hero);
    else update();
  }
})();
