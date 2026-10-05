/* EMPERIO TISS — JOBY MOTION STUDY
   Demo-only choreography for the Spanish homepage.
   Depends on GSAP + ScrollTrigger + Lenis loaded by index.html.
*/
(() => {
  'use strict';

  const body = document.body;
  if (!body?.classList.contains('joby-motion-demo')) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.approved-hero');
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  /* Legacy demo header bootstrap; final geometry follows the Superpower reference below. */
  const installJobyHeader = () => {
    const liveHeader = document.querySelector('.site-header');
    const inner = liveHeader?.querySelector('.header-inner');
    if (!liveHeader || !inner) return;

    liveHeader.classList.add('joby-pill-header');

    let current = inner.querySelector('.joby-header-current');
    if (!current) {
      current = document.createElement('span');
      current.className = 'joby-header-current';
      current.textContent = 'EMPERIO TISS';
      current.setAttribute('aria-hidden', 'true');
      inner.appendChild(current);
    }

    const logo = inner.querySelector('.site-logo img');
    if (logo) {
      logo.src = '/assets/images/emperio-tiss-emblem.svg';
      logo.removeAttribute('srcset');
      logo.alt = 'EMPERIO TISS';
      logo.width = 230;
      logo.height = 267;
    }
  };

  installJobyHeader();

  /* SUPERPOWER HEADER REFERENCE — richer controls, liquid glass and eased contraction. */
  const installProgressiveHeader = () => {
    const liveHeader = document.querySelector('.site-header');
    const inner = liveHeader?.querySelector('.header-inner');
    if (!liveHeader || !inner) return;

    const currentLabel = inner.querySelector('.joby-header-current');
    if (currentLabel) currentLabel.remove();

    const logo = inner.querySelector('.site-logo img');
    if (logo) {
      logo.src = '/assets/images/emperio-tiss-logo.svg?v=20261001-signature';
      logo.removeAttribute('srcset');
      logo.alt = 'EMPERIO TISS S.L.';
      logo.width = 600;
      logo.height = 430;
    }

    const primary = inner.querySelector('.home-header-nav');
    if (primary) {
      primary.innerHTML = '<a href="/about/">Empresa</a><a href="/products/">Productos</a><a href="/markets/">Mercados</a>';
    }

    const secondary = inner.querySelector('.home-header-secondary');
    if (secondary) {
      secondary.innerHTML = '<a href="/news/">Noticias</a>';
    }

    let tools = inner.querySelector('.super-header-tools');
    if (!tools) {
      tools = document.createElement('div');
      tools.className = 'super-header-tools';
      if (secondary) tools.appendChild(secondary);

      const signature = document.createElement('a');
      signature.className = 'super-signature';
      signature.href = '/news/#emperio-private';
      signature.textContent = 'Signature';

      const lang = document.createElement('span');
      lang.className = 'super-lang';
      lang.textContent = 'ES';

      const theme = document.createElement('button');
      theme.className = 'super-theme-toggle';
      theme.type = 'button';
      theme.setAttribute('aria-label', 'Cambiar modo claro u oscuro');
      theme.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/><circle cx="12" cy="12" r="4"/></svg>';

      const contact = document.createElement('a');
      contact.className = 'super-contact';
      contact.href = '/contact/';
      contact.innerHTML = 'Contacto <span aria-hidden="true">↗</span>';

      tools.append(signature, lang, theme, contact);
      inner.appendChild(tools);

      const applyTheme = (mode) => {
        const themeMode = mode === 'light' ? 'light' : 'dark';
        body.dataset.superTheme = themeMode;
        document.documentElement.dataset.theme = themeMode;
        theme.setAttribute('aria-pressed', themeMode === 'light' ? 'true' : 'false');
        theme.innerHTML = themeMode === 'light'
          ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 15.6A8.5 8.5 0 0 1 8.4 3.6 8.6 8.6 0 1 0 20.4 15.6Z"/></svg>'
          : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/><circle cx="12" cy="12" r="4"/></svg>';
        try { localStorage.setItem('emperio-super-theme', themeMode); } catch (_) {}
      };

      let initialTheme = 'dark';
      try {
        const stored = localStorage.getItem('emperio-super-theme');
        if (stored === 'light' || stored === 'dark') initialTheme = stored;
      } catch (_) {}
      applyTheme(initialTheme);

      theme.addEventListener('click', () => {
        applyTheme(body.dataset.superTheme === 'dark' ? 'light' : 'dark');
      });
    }

    let target = 0;
    let current = 0;
    let raf = 0;

    const getTarget = () => {
      if (window.matchMedia('(max-width: 980px)').matches) return 0;
      return Math.min(1, Math.max(0, window.scrollY / 520));
    };

    const render = () => {
      const delta = target - current;
      current += delta * .105;

      const vw = window.innerWidth;
      const endWidth = vw >= 1500 ? 62 : vw >= 1280 ? 66 : vw >= 1050 ? 72 : 78;
      const width = 100 - ((100 - endWidth) * current);
      const height = 80 - (24 * current);
      const blur = 27 + (12 * current);
      const pad = 28 - (10 * current);
      const gap = 25 - (8 * current);

      inner.style.setProperty('--sp-p', current.toFixed(4));
      inner.style.setProperty('--sp-pill-width', width.toFixed(3) + '%');
      inner.style.setProperty('--sp-pill-height', height.toFixed(2) + 'px');
      inner.style.setProperty('--sp-blur', blur.toFixed(1) + 'px');
      inner.style.setProperty('--sp-pad', pad.toFixed(1) + 'px');
      inner.style.setProperty('--sp-gap', gap.toFixed(1) + 'px');

      if (Math.abs(delta) > .0007) {
        raf = window.requestAnimationFrame(render);
      } else {
        raf = 0;
      }
    };

    const update = () => {
      target = getTarget();
      if (!raf) raf = window.requestAnimationFrame(render);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  };

  installProgressiveHeader();

  const fallbackReveal = () => {
    const nodes = document.querySelectorAll(
      '.chapter,.opening,.approach-heading,.origin-image,.steps article,.markets-top,.markets-title,.home-markets-map,.market-grid article,.home-private-copy,.home-private-seal,.invitation-content,.invitation-bottom'
    );
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.animate(
          [
            { opacity: 0, transform: 'translateY(34px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ],
          { duration: 720, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }
        );
        obs.unobserve(entry.target);
      });
    }, { threshold: .12 });
    nodes.forEach((el) => io.observe(el));
  };

  if (reduceMotion.matches || !gsap || !ScrollTrigger) {
    body.classList.add('joby-motion-fallback');
    fallbackReveal();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* Lenis: low-amplitude inertia, not a floaty agency scroll. */
  if (window.Lenis) {
    try {
      const lenis = new window.Lenis({
        duration: 1.05,
        smoothWheel: true,
        wheelMultiplier: .9,
        touchMultiplier: 1
      });

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
      window.__emperioJobyLenis = lenis;
    } catch (_) {
      /* Native scrolling remains fully functional. */
    }
  }

  const splitHeroLines = () => {
    const title = document.querySelector('.approved-hero-copy h1');
    if (!title || title.dataset.jobySplit === 'true') return [];
    const lines = title.innerHTML
      .split(/<br\s*\/?\s*>/i)
      .map((line) => line.trim())
      .filter(Boolean);

    title.innerHTML = lines
      .map((line) => `<span class="joby-line"><span>${line}</span></span>`)
      .join('');
    title.dataset.jobySplit = 'true';
    return [...title.querySelectorAll('.joby-line > span')];
  };

  const heroLines = splitHeroLines();

  /* HERO — fast arrival, long deceleration. */
  if (hero) {
    const image = hero.querySelector('.approved-hero-image');
    const kicker = hero.querySelector('.approved-kicker');
    const description = hero.querySelector('.approved-description');
    const cta = hero.querySelector('.approved-cta');
    const geography = hero.querySelector('.approved-geography');

    gsap.set(image, { scale: 1.12 });
    gsap.set(heroLines, { yPercent: 118, rotate: 1.2 });
    gsap.set([kicker, description, cta, geography], { y: 22, autoAlpha: 0 });

    const intro = gsap.timeline({
      defaults: { ease: 'power4.out' },
      delay: .08
    });

    intro
      .to(image, { scale: 1.035, duration: 1.6 }, 0)
      .to(kicker, { y: 0, autoAlpha: 1, duration: .7 }, .18)
      .to(heroLines, {
        yPercent: 0,
        rotate: 0,
        duration: .86,
        stagger: .11,
        ease: 'power4.out'
      }, .20)
      .to(description, { y: 0, autoAlpha: 1, duration: .75 }, .58)
      .to(cta, { y: 0, autoAlpha: 1, duration: .7 }, .67)
      .to(geography, { y: 0, autoAlpha: 1, duration: .7 }, .76);

    if (image) {
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
    }

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

  /* Shared masked/editorial reveal. */
  const reveal = (targets, options = {}) => {
    const els = gsap.utils.toArray(targets).filter(Boolean);
    els.forEach((el) => {
      el.classList.add('joby-reveal');
      gsap.fromTo(el,
        {
          y: options.y ?? 58,
          autoAlpha: 0,
          clipPath: options.clip ? 'inset(0 0 100% 0)' : 'none'
        },
        {
          y: 0,
          autoAlpha: 1,
          clipPath: options.clip ? 'inset(0 0 0% 0)' : 'none',
          duration: options.duration ?? .9,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: options.start ?? 'top 86%',
            once: true
          }
        }
      );
    });
  };

  reveal('.chapter', { y: 26, duration: .7 });
  reveal('.opening', { y: 70, duration: 1 });
  reveal('.approach-heading', { y: 70, duration: 1 });
  reveal('.markets-top', { y: 30, duration: .75 });
  reveal('.markets-title', { y: 70, duration: 1 });
  reveal('.home-private-copy', { y: 70, duration: 1 });
  reveal('.home-private-seal', { y: 48, duration: .95 });
  reveal('.invitation-content', { y: 72, duration: 1 });
  reveal('.invitation-bottom', { y: 30, duration: .75 });

  /* Product universe — sticky viewport stage with restrained scrub. */
  const scene = document.querySelector('.collection .scene');
  if (scene) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', () => {
      const images = [...scene.querySelectorAll('.scene-image')];
      const content = scene.querySelector('.scene-content');
      const caption = scene.querySelector('.scene-caption');
      const bottom = scene.querySelector('.scene-bottom');

      gsap.set(images, { scale: 1.08 });

      const stage = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: 'top top',
          end: '+=110%',
          pin: true,
          pinSpacing: true,
          scrub: .65,
          anticipatePin: 1
        }
      });

      if (images.length) stage.to(images, { scale: 1.16, ease: 'none' }, 0);
      if (content) stage.to(content, { y: -34, ease: 'none' }, 0);
      if (caption) stage.to(caption, { y: -16, ease: 'none' }, 0);
      if (bottom) stage.to(bottom, { y: 22, ease: 'none' }, 0);
    });
  }

  /* Directional image curtain. */
  const originImage = document.querySelector('.origin-image');
  if (originImage) {
    const img = originImage.querySelector('img');
    if (img) {
      gsap.fromTo(img,
        { clipPath: 'inset(100% 0 0 0)', scale: 1.12 },
        {
          clipPath: 'inset(0% 0 0 0)',
          scale: 1,
          duration: 1.15,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: originImage,
            start: 'top 82%',
            once: true
          }
        }
      );
    }
  }

  /* Approach rows: one sequence rather than independent card animations. */
  const steps = [...document.querySelectorAll('.steps article')];
  if (steps.length) {
    gsap.fromTo(steps,
      { y: 44, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: .8,
        stagger: .12,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: steps[0].parentElement,
          start: 'top 78%',
          once: true
        }
      }
    );
  }

  /* Markets: draw logistics paths in sync with the scroll. */
  const marketMap = document.querySelector('.home-markets-map');
  if (marketMap) {
    const routes = [...marketMap.querySelectorAll('.route')];
    const nodes = [...marketMap.querySelectorAll('.node')];
    const labels = [...marketMap.querySelectorAll('.map-word,.map-sub')];

    routes.forEach((path) => {
      const length = path.getTotalLength?.() || 900;
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length
      });
    });
    gsap.set(nodes, { scale: 0, transformOrigin: '50% 50%' });
    gsap.set(labels, { autoAlpha: 0, y: 8 });

    const mapTl = gsap.timeline({
      scrollTrigger: {
        trigger: marketMap,
        start: 'top 78%',
        end: 'bottom 46%',
        scrub: .55
      }
    });

    mapTl
      .to(routes, { strokeDashoffset: 0, stagger: .08, ease: 'none' }, 0)
      .to(nodes, { scale: 1, stagger: .07, ease: 'power3.out' }, .15)
      .to(labels, { autoAlpha: 1, y: 0, stagger: .025, ease: 'power3.out' }, .22);
  }

  const marketCards = [...document.querySelectorAll('.market-grid article')];
  if (marketCards.length) {
    gsap.fromTo(marketCards,
      { y: 55, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        stagger: .09,
        duration: .8,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: marketCards[0].parentElement,
          start: 'top 84%',
          once: true
        }
      }
    );
  }

  /* Signature: Joby-style solid colour takeover rising behind the content. */
  const signature = document.querySelector('.home-private');
  if (signature) {
    const wash = document.createElement('div');
    wash.className = 'joby-private-wash';
    wash.setAttribute('aria-hidden', 'true');
    signature.prepend(wash);

    gsap.to(wash, {
      clipPath: 'inset(0% 0 0 0)',
      ease: 'none',
      scrollTrigger: {
        trigger: signature,
        start: 'top 92%',
        end: 'top 28%',
        scrub: .55
      }
    });
  }

  /* Scene state remains available; the Superpower-reference glass stays visually consistent. */
  const setHeader = (mode) => {
    if (!header) return;
    header.classList.toggle('joby-header--dark', mode === 'dark');
    header.classList.toggle('joby-header--light', mode !== 'dark');
  };

  const toneScenes = [
    { el: hero, mode: 'dark' },
    { el: document.querySelector('.collection'), mode: 'light' },
    { el: document.querySelector('.approach'), mode: 'light' },
    { el: document.querySelector('.markets-section'), mode: 'dark' },
    { el: signature, mode: 'dark' },
    { el: document.querySelector('.invitation'), mode: 'light' }
  ].filter((item) => item.el);

  toneScenes.forEach(({ el, mode }) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 12%',
      end: 'bottom 12%',
      onEnter: () => setHeader(mode),
      onEnterBack: () => setHeader(mode)
    });
  });
  setHeader('dark');

  /* Small button/arrow translations echo the Joby micro-motion without noise. */
  document.querySelectorAll('.home-action,.approved-cta,.home-private-action,.approach-link').forEach((link) => {
    link.addEventListener('pointerenter', () => {
      gsap.to(link, { x: 5, duration: .45, ease: 'power4.out', overwrite: true });
    });
    link.addEventListener('pointerleave', () => {
      gsap.to(link, { x: 0, duration: .55, ease: 'power4.out', overwrite: true });
    });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  window.__emperioJobyMotionDemo = { gsap, ScrollTrigger };
})();
