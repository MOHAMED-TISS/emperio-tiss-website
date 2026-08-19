/* EMPERIO TISS — Fruits & Vegetables immersive scroll timeline */
(function () {
  'use strict';

  const page = document.querySelector('.fv-motion');
  if (!page) return;

  const win = window;
  const doc = document.documentElement;
  const hero = page.querySelector('.es-fruit-hero');
  const heroInner = hero && hero.querySelector('.es-container');
  const title = hero && hero.querySelector('h1');
  const kicker = hero && hero.querySelector('.es-kicker');
  const lead = hero && hero.querySelector('.es-lead');
  const actions = hero && hero.querySelector('.es-actions');
  const scrollLine = hero && hero.querySelector('.fv-scroll-line');
  const cards = [...page.querySelectorAll('.es-card')];
  const rows = [...page.querySelectorAll('.es-list-row')];
  const cta = page.querySelector('.es-cta');

  /* The reference interaction is scroll-led. Keep the animation native and dependency-free. */
  const reduce = win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    [...cards, ...rows, cta].forEach(el => el && el.classList.add('is-inview'));
    return;
  }

  /* Reliable reveal observer. */
  const observer = 'IntersectionObserver' in win
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('is-inview');
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' })
    : null;

  [...cards, ...rows, cta].forEach(el => {
    if (!el) return;
    if (observer) observer.observe(el);
    else el.classList.add('is-inview');
  });

  let ticking = false;

  function clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
  }

  function timeline() {
    ticking = false;
    if (!hero) return;

    const viewport = win.innerHeight || 1;
    const rect = hero.getBoundingClientRect();
    const heroTravel = Math.max(hero.offsetHeight - viewport, viewport * 0.65);
    const progress = clamp(-rect.top / heroTravel);

    /* Main RESN-style scene: the opening remains the canvas while the content
       travels, scales and separates as the visitor scrolls through it. */
    hero.style.setProperty('--fv-progress', progress.toFixed(4));
    hero.style.setProperty('--fv-scene-y', `${progress * -90}px`);
    hero.style.setProperty('--fv-scene-scale', `${1 + progress * 0.085}`);
    hero.style.setProperty('--fv-scene-rotate', `${progress * -1.8}deg`);
    hero.style.setProperty('--fv-orbit', `${progress * 180}px`);

    if (heroInner) {
      heroInner.style.transform = `translate3d(${progress * -5}vw, ${progress * 70}px, 0) scale(${1 - progress * 0.055})`;
      heroInner.style.opacity = `${1 - progress * 0.48}`;
    }

    if (title) {
      title.style.transform = `translate3d(${progress * -10}vw, ${progress * -18}px, 0) scale(${1 - progress * 0.08})`;
      title.style.opacity = `${1 - progress * 0.58}`;
    }
    if (kicker) {
      kicker.style.transform = `translate3d(${progress * -4}vw, ${progress * -30}px, 0)`;
      kicker.style.opacity = `${1 - progress * 0.9}`;
    }
    if (lead) {
      lead.style.transform = `translate3d(${progress * 5}vw, ${progress * 25}px, 0)`;
      lead.style.opacity = `${1 - progress * 1.2}`;
    }
    if (actions) {
      actions.style.transform = `translate3d(${progress * 8}vw, ${progress * 35}px, 0)`;
      actions.style.opacity = `${1 - progress * 1.5}`;
    }
    if (scrollLine) {
      scrollLine.style.opacity = `${1 - progress * 3}`;
      scrollLine.style.transform = `scaleY(${Math.max(.05, 1 - progress * 3)})`;
    }

    /* Cards enter as a sequence instead of simply appearing. */
    cards.forEach((card, index) => {
      const r = card.getBoundingClientRect();
      const p = clamp((viewport * .92 - r.top) / (viewport * .62));
      const delay = index * .08;
      const q = clamp((p - delay) / Math.max(.35, 1 - delay));
      card.style.setProperty('--fv-card-p', q.toFixed(3));
    });

    rows.forEach((row, index) => {
      const r = row.getBoundingClientRect();
      const p = clamp((viewport * .9 - r.top) / (viewport * .45));
      row.style.setProperty('--fv-row-p', p.toFixed(3));
      row.style.setProperty('--fv-row-x', `${(1 - p) * 70}px`);
      row.style.transitionDelay = `${index * 45}ms`;
    });

    if (cta) {
      const r = cta.getBoundingClientRect();
      const p = clamp((viewport - r.top) / (viewport + r.height));
      cta.style.setProperty('--fv-cta-p', p.toFixed(3));
      cta.style.setProperty('--fv-cta-scale', `${1.16 - p * .12}`);
      cta.style.setProperty('--fv-cta-y', `${(0.5 - p) * 90}px`);
    }
  }

  function requestTimeline() {
    if (!ticking) {
      ticking = true;
      win.requestAnimationFrame(timeline);
    }
  }

  win.addEventListener('scroll', requestTimeline, { passive: true });
  win.addEventListener('resize', requestTimeline, { passive: true });
  timeline();

  /* Mouse movement adds a second, very restrained layer on desktop. */
  if (win.matchMedia && win.matchMedia('(hover:hover) and (pointer:fine)').matches && hero) {
    hero.addEventListener('pointermove', event => {
      const r = hero.getBoundingClientRect();
      const x = (event.clientX - r.left) / r.width - .5;
      const y = (event.clientY - r.top) / r.height - .5;
      hero.style.setProperty('--fv-mouse-x', `${x * 22}px`);
      hero.style.setProperty('--fv-mouse-y', `${y * 16}px`);
    }, { passive: true });

    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--fv-mouse-x', '0px');
      hero.style.setProperty('--fv-mouse-y', '0px');
    }, { passive: true });
  }
})();
