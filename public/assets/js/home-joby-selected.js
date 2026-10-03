/* EMPERIO TISS — selected Joby motion on production home
   Scope: Lenis + hero + markets + final supply CTA.
*/
(() => {
  'use strict';

  const body = document.body;
  if (!body?.classList.contains('home-joby-selected')) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  /* Same inertial scroll feel used in the demo. */
  if (!reduceMotion.matches && window.Lenis) {
    try {
      const lenis = new window.Lenis({
        duration: 1.05,
        smoothWheel: true,
        wheelMultiplier: .9,
        touchMultiplier: 1
      });

      if (gsap && ScrollTrigger) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      } else {
        const raf = (time) => {
          lenis.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
      }

      window.__emperioLenis = lenis;
    } catch (_) {
      /* Native scrolling remains available. */
    }
  }

  const fallbackReveal = () => {
    const nodes = document.querySelectorAll(
      '.markets-top,.markets-title,.home-markets-map,.market-grid article,#contact .invitation-content,#contact .invitation-bottom'
    );

    if (!('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.animate(
          [
            { opacity: 0, transform: 'translateY(34px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ],
          {
            duration: 760,
            easing: 'cubic-bezier(.16,1,.3,1)',
            fill: 'both'
          }
        );
        obs.unobserve(entry.target);
      });
    }, { threshold: .12 });

    nodes.forEach((node) => io.observe(node));
  };

  if (reduceMotion.matches || !gsap || !ScrollTrigger) {
    fallbackReveal();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* HERO */
  const hero = document.querySelector('.approved-hero');
  if (hero) {
    const title = hero.querySelector('h1');
    const image = hero.querySelector('.approved-hero-image');
    const kicker = hero.querySelector('.approved-kicker');
    const description = hero.querySelector('.approved-description');
    const cta = hero.querySelector('.approved-cta');
    const geography = hero.querySelector('.approved-geography');

    let lines = [];
    if (title && !title.dataset.jobySplit) {
      const parts = title.innerHTML
        .split(/<br\s*\/?\s*>/i)
        .map((line) => line.trim())
        .filter(Boolean);

      title.innerHTML = parts
        .map((line) => `<span class="joby-line"><span>${line}</span></span>`)
        .join('');
      title.dataset.jobySplit = 'true';
      lines = [...title.querySelectorAll('.joby-line > span')];
    }

    gsap.set(image, { scale: 1.12 });
    gsap.set(lines, { yPercent: 118, rotate: 1.2 });
    gsap.set([kicker, description, cta, geography].filter(Boolean), { y: 22, autoAlpha: 0 });

    gsap.timeline({ defaults: { ease: 'power4.out' }, delay: .08 })
      .to(image, { scale: 1.035, duration: 1.6 }, 0)
      .to(kicker, { y: 0, autoAlpha: 1, duration: .7 }, .18)
      .to(lines, { yPercent: 0, rotate: 0, duration: .86, stagger: .11 }, .20)
      .to(description, { y: 0, autoAlpha: 1, duration: .75 }, .58)
      .to(cta, { y: 0, autoAlpha: 1, duration: .7 }, .67)
      .to(geography, { y: 0, autoAlpha: 1, duration: .7 }, .76);

    gsap.to(image, {
      scale: 1.16,
      yPercent: 5,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: .65
      }
    });

    const heroCopy = hero.querySelector('.approved-hero-copy');
    if (heroCopy) {
      gsap.to(heroCopy, {
        yPercent: 13,
        autoAlpha: .18,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: '45% top',
          end: 'bottom top',
          scrub: .5
        }
      });
    }
  }

  const reveal = (target, y = 50, duration = .9) => {
    gsap.utils.toArray(target).forEach((el) => {
      gsap.fromTo(el,
        { y, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            once: true
          }
        }
      );
    });
  };

  reveal('.markets-top', 30, .75);
  reveal('.markets-title', 70, 1);
  reveal('#contact .invitation-content', 72, 1);
  reveal('#contact .invitation-bottom', 30, .75);

  /* MARKET ROUTES */
  const marketMap = document.querySelector('.home-markets-map');
  if (marketMap) {
    const routes = [...marketMap.querySelectorAll('.route')];
    const nodes = [...marketMap.querySelectorAll('.node')];
    const labels = [...marketMap.querySelectorAll('.map-word,.map-sub')];

    routes.forEach((path) => {
      const length = path.getTotalLength?.() || 900;
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });

    gsap.set(nodes, { scale: 0, transformOrigin: '50% 50%' });
    gsap.set(labels, { autoAlpha: 0, y: 8 });

    gsap.timeline({
      scrollTrigger: {
        trigger: marketMap,
        start: 'top 78%',
        end: 'bottom 46%',
        scrub: .55
      }
    })
      .to(routes, { strokeDashoffset: 0, stagger: .08, ease: 'none' }, 0)
      .to(nodes, { scale: 1, stagger: .07, ease: 'power3.out' }, .15)
      .to(labels, { autoAlpha: 1, y: 0, stagger: .025, ease: 'power3.out' }, .22);
  }

  const cards = [...document.querySelectorAll('.market-grid article')];
  if (cards.length) {
    gsap.fromTo(cards,
      { y: 55, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        stagger: .09,
        duration: .8,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: cards[0].parentElement,
          start: 'top 84%',
          once: true
        }
      }
    );
  }

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
})();
