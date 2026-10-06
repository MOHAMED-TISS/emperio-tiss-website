/* EMPERIO TISS — Products hero parallax */
(() => {
  'use strict';

  const hero = document.querySelector('body.products-landing-page.products-2026 .hero');
  if (!hero) return;

  const motion = window.matchMedia('(min-width:901px) and (prefers-reduced-motion:no-preference)');
  let raf = 0;

  const reset = () => {
    hero.style.setProperty('--products-parallax-bg','0px');
    hero.style.setProperty('--products-parallax-glow','0px');
  };

  const render = () => {
    raf = 0;
    if (!motion.matches) {
      reset();
      return;
    }

    const rect = hero.getBoundingClientRect();
    const height = Math.max(hero.offsetHeight,1);

    if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

    const progress = Math.min(1,Math.max(0,-rect.top / height));
    const bgShift = Math.min(72, progress * 72);
    const glowShift = Math.min(26, progress * 26);

    hero.style.setProperty('--products-parallax-bg', `${bgShift.toFixed(2)}px`);
    hero.style.setProperty('--products-parallax-glow', `${glowShift.toFixed(2)}px`);
  };

  const requestRender = () => {
    if (raf) return;
    raf = requestAnimationFrame(render);
  };

  window.addEventListener('scroll',requestRender,{passive:true});
  window.addEventListener('resize',requestRender,{passive:true});
  motion.addEventListener?.('change',requestRender);

  requestRender();
})();
