(() => {
  'use strict';

  const page = document.querySelector('.home-page');
  if (!page) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopMotion = window.matchMedia('(min-width: 901px)');
  const connection = navigator.connection;

  // One restrained entrance per scene; no card staggering or scroll rails.
  const revealNodes = page.querySelectorAll(
    '.intro-section > .container, .products-section > .container, .markets-section > .container, .company-section > .container, .contact-section .contact-inner'
  );

  revealNodes.forEach((node) => node.classList.add('home-reveal'));

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -6% 0px' });

    revealNodes.forEach((node) => observer.observe(node));
  }

  // Desktop-only ambient hero video. Mobile and reduced-motion use the poster.
  const hero = page.querySelector('.hero');
  const video = page.querySelector('.home-hero-video');
  const toggle = page.querySelector('.home-video-toggle');

  if (!hero || !video || !toggle) return;

  let userPaused = false;
  let inView = true;

  const allowed = () =>
    desktopMotion.matches &&
    !reduceMotion.matches &&
    !connection?.saveData;

  const syncLabel = () => {
    const paused = video.paused;
    toggle.textContent = paused ? 'Reproducir vídeo' : 'Pausar vídeo';
    toggle.setAttribute('aria-label', paused ? 'Reproducir vídeo de fondo' : 'Pausar vídeo de fondo');
  };

  const updateVideo = () => {
    if (!allowed()) {
      video.pause();
      toggle.hidden = true;
      return;
    }

    toggle.hidden = false;

    if (userPaused || !inView || document.hidden) {
      video.pause();
      return;
    }

    if (!video.getAttribute('src')) {
      video.src = video.dataset.desktopSrc;
    }

    video.muted = true;
    video.play().catch(syncLabel);
  };

  toggle.addEventListener('click', () => {
    if (video.paused) {
      userPaused = false;
      updateVideo();
    } else {
      userPaused = true;
      video.pause();
    }
  });

  video.addEventListener('play', syncLabel);
  video.addEventListener('pause', syncLabel);
  video.addEventListener('error', () => {
    toggle.hidden = true;
    video.removeAttribute('src');
    video.load();
  });

  reduceMotion.addEventListener('change', updateVideo);
  desktopMotion.addEventListener('change', updateVideo);
  connection?.addEventListener('change', updateVideo);
  document.addEventListener('visibilitychange', updateVideo);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      inView = entries[0]?.isIntersecting ?? true;
      updateVideo();
    }, { threshold: 0 }).observe(hero);
  } else {
    updateVideo();
  }
})();
