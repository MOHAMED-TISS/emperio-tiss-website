/* EMPERIO TISS — Home ES sections (2026-10)
   Scroll storytelling for "Del producto al acuerdo" and the interactive markets Atlas. */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- 1. Scroll storytelling ---------- */
  const stepsRoot = document.querySelector('.ets-steps');
  if (stepsRoot) {
    const steps = [...stepsRoot.querySelectorAll('.ets-step')];
    const images = [...stepsRoot.querySelectorAll('.ets-steps__image')];
    const bars = [...stepsRoot.querySelectorAll('.ets-steps__bar i')];
    const count = stepsRoot.querySelector('.ets-steps__count b');
    const label = stepsRoot.querySelector('.ets-steps__label');

    const activate = index => {
      steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
      images.forEach((image, i) => image.classList.toggle('is-active', i === index));
      bars.forEach((bar, i) => bar.classList.toggle('is-done', i <= index));
      if (count) count.textContent = String(index + 1).padStart(2, '0');
      if (label) label.textContent = steps[index].dataset.label || '';
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) activate(steps.indexOf(entry.target));
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      steps.forEach(step => io.observe(step));
    }
    activate(0);
  }

  /* ---------- 2. Atlas ---------- */
  const atlas = document.querySelector('.ets-atlas');
  if (!atlas) return;

  const tabs = [...atlas.querySelectorAll('[role="tab"][data-region]')];
  const panel = atlas.querySelector('#atlas-panel');
  const details = [...atlas.querySelectorAll('.ets-atlas__detail')];
  const mapWrap = atlas.querySelector('.ets-atlas__map');
  const CYCLE = 6500;
  let current = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
  if (current < 0) current = 0;
  let svg = null;
  let timer = 0;
  let paused = false;
  let visible = false;

  const paintMap = (key, redraw) => {
    if (!svg) return;
    svg.querySelectorAll('.atlas-dots[data-region]').forEach(el => el.classList.toggle('is-on', el.dataset.region === key));
    svg.querySelectorAll('.atlas-city').forEach(el => el.classList.toggle('is-on', el.dataset.region === key));
    svg.querySelectorAll('.atlas-pulse').forEach(el => el.classList.toggle('is-on', el.dataset.region === key));
    svg.querySelectorAll('.atlas-arc').forEach(el => {
      const on = el.dataset.region === key;
      el.classList.toggle('is-on', on);
      if (on && redraw && !reduceMotion.matches) {
        // replay the drawing of the active routes
        el.classList.add('is-drawing');
        el.getBoundingClientRect();
        el.classList.remove('is-drawing');
      }
    });
  };

  const select = (index, { focus = false, redraw = true } = {}) => {
    current = (index + tabs.length) % tabs.length;
    const key = tabs[current].dataset.region;
    tabs.forEach((tab, i) => {
      const on = i === current;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    details.forEach(detail => { detail.hidden = detail.dataset.region !== key; });
    panel?.setAttribute('aria-labelledby', tabs[current].id);
    paintMap(key, redraw);
    if (focus) tabs[current].focus();
    restartCycle();
  };

  const restartCycle = () => {
    clearTimeout(timer);
    atlas.classList.remove('is-cycling');
    if (paused || !visible || reduceMotion.matches) return;
    // restart the progress line animation
    atlas.getBoundingClientRect();
    atlas.classList.add('is-cycling');
    timer = setTimeout(() => select(current + 1), CYCLE);
  };

  atlas.style.setProperty('--atlas-cycle', CYCLE + 'ms');

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => { paused = true; select(index); });
    tab.addEventListener('mouseenter', () => { if (index !== current) select(index); });
    tab.addEventListener('keydown', event => {
      const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (event.key in keys) { event.preventDefault(); paused = true; select(current + keys[event.key], { focus: true }); }
      else if (event.key === 'Home') { event.preventDefault(); paused = true; select(0, { focus: true }); }
      else if (event.key === 'End') { event.preventDefault(); paused = true; select(tabs.length - 1, { focus: true }); }
    });
  });

  const body = atlas.querySelector('.ets-atlas__body');
  body?.addEventListener('mouseenter', () => { paused = true; restartCycle(); });
  body?.addEventListener('mouseleave', () => { paused = false; restartCycle(); });
  atlas.addEventListener('focusin', () => { paused = true; restartCycle(); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) atlas.classList.add('is-ready');
      restartCycle();
    }, { threshold: .25 }).observe(atlas);
  } else {
    visible = true;
    atlas.classList.add('is-ready');
  }

  // Load the map inline so it can be styled and animated; the <img> stays as a fallback.
  const src = mapWrap?.dataset.atlasSrc;
  if (src && window.fetch) {
    fetch(src).then(response => (response.ok ? response.text() : Promise.reject())).then(text => {
      const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
      const node = doc.documentElement;
      if (!node || node.nodeName.toLowerCase() !== 'svg') return;
      // a travelling light for every route
      const arcs = node.querySelector('.atlas-arcs');
      node.querySelectorAll('.atlas-arc').forEach(arc => {
        const pulse = arc.cloneNode();
        pulse.setAttribute('class', 'atlas-pulse');
        pulse.style.animationDelay = (Math.random() * -3).toFixed(2) + 's';
        arcs.appendChild(pulse);
      });
      node.setAttribute('aria-hidden', 'true');
      mapWrap.replaceChildren(document.importNode(node, true));
      svg = mapWrap.querySelector('svg');
      paintMap(tabs[current].dataset.region, false);
    }).catch(() => {});
  }

  select(current, { redraw: false });
})();
