(() => {
  'use strict';

  const state = { images: [], index: 0 };

  const viewer = document.createElement('div');
  viewer.className = 'fish-gallery fish-gallery--direct';
  viewer.hidden = true;
  viewer.setAttribute('aria-hidden', 'true');
  viewer.innerHTML = `
    <div class="fish-gallery__panel" role="dialog" aria-modal="true" aria-label="Fish image viewer">
      <img class="fish-gallery__image" alt="">
      <button class="fish-gallery__prev" type="button" aria-label="Previous image">‹</button>
      <button class="fish-gallery__next" type="button" aria-label="Next image">›</button>
      <button class="fish-gallery__close" type="button" aria-label="Close">×</button>
      <span class="fish-gallery__counter" aria-live="polite"></span>
    </div>`;

  const vimg = viewer.querySelector('.fish-gallery__image');
  const counter = viewer.querySelector('.fish-gallery__counter');

  const render = () => {
    const total = state.images.length;
    if (!total) return;
    vimg.src = state.images[state.index];
    counter.textContent = `${state.index + 1} / ${total}`;
    viewer.querySelector('.fish-gallery__prev').hidden = total < 2;
    viewer.querySelector('.fish-gallery__next').hidden = total < 2;
  };

  const open = (images, alt) => {
    state.images = images;
    state.index = 0;
    vimg.alt = alt || 'Fish image';
    viewer.hidden = false;
    viewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    render();
  };

  const close = () => {
    viewer.hidden = true;
    viewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    vimg.removeAttribute('src');
  };

  viewer.querySelector('.fish-gallery__prev').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    state.index = (state.index - 1 + state.images.length) % state.images.length;
    render();
  });

  viewer.querySelector('.fish-gallery__next').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    state.index = (state.index + 1) % state.images.length;
    render();
  });

  viewer.querySelector('.fish-gallery__close').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    close();
  });

  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) close();
  });

  viewer.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft' && state.images.length > 1) {
      state.index = (state.index - 1 + state.images.length) % state.images.length;
      render();
    }
    if (event.key === 'ArrowRight' && state.images.length > 1) {
      state.index = (state.index + 1) % state.images.length;
      render();
    }
  });

  const ensureStyles = () => {
    if (document.getElementById('fish-direct-click-styles')) return;
    const style = document.createElement('style');
    style.id = 'fish-direct-click-styles';
    style.textContent = `
      body.fish-catalog-pilot .fish-catalog-card__media { position: relative; }
      body.fish-catalog-pilot .fish-catalog-card__media,
      body.fish-catalog-pilot .fish-catalog-card__media * { pointer-events: auto !important; }
      body.fish-catalog-pilot .fish-catalog-card__media .fish-card-image { position: relative; z-index: 2; cursor: zoom-in; pointer-events: auto !important; }
      body.fish-catalog-pilot .fish-catalog-card__zoom,
      body.fish-catalog-pilot .fish-card-image-button { position: relative; z-index: 2; pointer-events: auto !important; cursor: zoom-in; }
      body.fish-catalog-pilot .fish-catalog-card__media .fish-card-nav { z-index: 5; pointer-events: auto !important; }
      body.fish-catalog-pilot .fish-catalog-card__media::before,
      body.fish-catalog-pilot .fish-catalog-card__media::after { pointer-events: none !important; }
    `;
    document.head.appendChild(style);
  };

  const readImages = (media) => {
    try {
      const images = JSON.parse(media.dataset.images || '[]');
      return Array.isArray(images) ? images.filter(Boolean) : [];
    } catch (_) {
      return [];
    }
  };

  const resolveHit = (target) => {
    if (!(target instanceof Element)) return null;
    const media = target.closest('.fish-catalog-card__media');
    if (!media) return null;
    if (target.closest('.fish-card-nav')) return null;
    const image = media.querySelector('.fish-card-image');
    if (!image) return null;
    return { image, media };
  };

  document.addEventListener('click', (event) => {
    const hit = resolveHit(event.target);
    if (!hit) return;

    const images = readImages(hit.media);
    if (!images.length) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    open(images, hit.image.alt);
  }, true);

  ensureStyles();
  document.body.appendChild(viewer);
})();