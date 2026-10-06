/* EMPERIO TISS — Products hero real parallax */
(() => {
  'use strict';

  const hero = document.querySelector('body.products-landing-page.products-2026 .hero');
  const media = hero?.querySelector('.hero-parallax-media');
  if (!hero || !media) return;

  const motion = window.matchMedia('(min-width:901px) and (prefers-reduced-motion:no-preference)');
  let raf = 0;
  let current = 0;
  let target = 0;
  let running = false;

  const setTransform = value => {
    media.style.transform = `translate3d(0,${value.toFixed(2)}px,0) scale(1.10)`;
  };

  const computeTarget = () => {
    if (!motion.matches) {
      target = 0;
      current = 0;
      media.style.transform = '';
      return false;
    }

    const rect = hero.getBoundingClientRect();
    const height = Math.max(hero.offsetHeight,1);

    if (rect.bottom <= 0 || rect.top >= window.innerHeight) return false;

    const progress = Math.min(1,Math.max(0,-rect.top / height));
    target = progress * 118;
    return true;
  };

  const animate = () => {
    raf = 0;
    if (!computeTarget()) {
      running = false;
      return;
    }

    current += (target - current) * 0.11;
    setTransform(current);

    if (Math.abs(target - current) > 0.15) {
      raf = requestAnimationFrame(animate);
    } else {
      current = target;
      setTransform(current);
      running = false;
    }
  };

  const requestRender = () => {
    if (raf) return;
    running = true;
    raf = requestAnimationFrame(animate);
  };

  window.addEventListener('scroll',requestRender,{passive:true});
  window.addEventListener('resize',requestRender,{passive:true});
  motion.addEventListener?.('change',requestRender);

  requestRender();
})();
