(() => {
  'use strict';
  const root = document.querySelector('.markets-current');
  if (!root) return;
  const stage = root.querySelector('.current-stage'),
    line = root.querySelector('.current-line path'),
    dot = root.querySelector('.current-dot'),
    moves = [...root.querySelectorAll('.current-movement')];
  if (!stage) return;
  let target = 0,
    shown = 0,
    frame = 0,
    active = -1,
    lineState = '';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const len = 2600;
  // the dot travels with a transform (no layout per frame) from its starting point
  if (dot) {
    dot.style.top = '18vh';
    dot.style.left = '9vw';
  }
  // One animation frame reads the geometry first and writes styles after,
  // and keeps easing until the line has caught up with the scroll position.
  const tick = () => {
    frame = 0;
    const rect = stage.getBoundingClientRect(),
      max = Math.max(1, stage.offsetHeight - window.innerHeight);
    target = clamp(-rect.top / max, 0, 1);
    const delta = target - shown;
    shown = Math.abs(delta) < 0.0005 ? target : shown + delta * 0.14;
    if (line) {
      line.style.strokeDashoffset = String(len - (len * shown));
      const phase = (shown * moves.length) % 1;
      const hold = phase > 0.15 && phase < 0.7;
      const transition = phase >= 0.7 || phase < 0.15;
      const state = hold ? 'hold' : transition ? 'transition' : 'rest';
      if (state !== lineState) {
        lineState = state;
        line.style.opacity = hold ? '0.22' : transition ? '0.78' : '0.38';
        line.style.strokeWidth = hold ? '0.8' : transition ? '1.6' : '1.05';
      }
    }
    if (dot) dot.style.transform = `translate(-50%, -50%) translate3d(${(shown * 18).toFixed(3)}vw, ${(shown * 64).toFixed(3)}vh, 0)`;
    const idx = Math.min(moves.length - 1, Math.floor(shown * moves.length));
    if (idx !== active) {
      active = idx;
      moves.forEach((m, i) => m.classList.toggle('active', i === idx));
    }
    if (shown !== target) frame = requestAnimationFrame(tick);
  };
  const request = () => { if (!frame) frame = requestAnimationFrame(tick); };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });
  request();
})();
