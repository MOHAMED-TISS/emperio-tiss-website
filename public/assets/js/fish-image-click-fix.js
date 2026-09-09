(() => {
  'use strict';

  const state = { images: [], index: 0 };
  const viewer = document.createElement('div');
  viewer.className = 'fish-gallery fish-gallery--direct';
  viewer.hidden = true;
  viewer.setAttribute('aria-hidden', 'true');
  viewer.innerHTML = `
    <div class="fish-gallery__panel" role="dialog" aria-modal="true" aria-label="Fish image viewer" tabindex="-1">
      <img class="fish-gallery__image" alt="">
      <button class="fish-gallery__prev" type="button" aria-label="Previous image">‹</button>
      <button class="fish-gallery__next" type="button" aria-label="Next image">›</button>
      <button class="fish-gallery__close" type="button" aria-label="Close">×</button>
      <span class="fish-gallery__counter" aria-live="polite"></span>
    </div>`;

  const panel = viewer.querySelector('.fish-gallery__panel');
  const image = viewer.querySelector('.fish-gallery__image');
  const counter = viewer.querySelector('.fish-gallery__counter');

  const getImages = (media) => {
    try {
      const value = JSON.parse(media?.dataset.images || '[]');
      return Array.isArray(value) ? value.filter(Boolean) : [];
    } catch (_) {
      return [];
    }
  };

  const paint = () => {
    const total = state.images.length;
    if (!total) return;
    image.src = state.images[state.index];
    counter.textContent = `${state.index + 1} / ${total}`;
    viewer.querySelector('.fish-gallery__prev').hidden = total < 2;
    viewer.querySelector('.fish-gallery__next').hidden = total < 2;
  };

  const open = (images, alt) => {
    if (!images.length) return;
    state.images = images;
    state.index = 0;
    image.alt = alt || 'Fish image';
    viewer.hidden = false;
    viewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    paint();
    panel.focus();
  };

  const close = () => {
    viewer.hidden = true;
    viewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    image.removeAttribute('src');
  };

  const setCardTarget = (button, media, img) => {
    const activate = (event) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      open(getImages(media), img.alt);
    };
    button.addEventListener('click', activate, false);
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') activate(event);
    }, false);
  };

  const enhance = () => {
    document.querySelectorAll('.fish-catalog-card__media').forEach((media) => {
      const img = media.querySelector('.fish-card-image');
      if (!img) return;
      const images = getImages(media);
      if (!images.length) return;

      let button = media.querySelector('.fish-card-image-button');
      if (!button) {
        button = document.createElement('button');
        button.type = 'button';
        button.className = 'fish-card-image-button';
        button.setAttribute('aria-label', `View ${img.alt || 'fish image'}`);
        button.appendChild(img);
        media.insertBefore(button, media.firstChild);
      }

      if (button.dataset.fishClickBound !== 'true') {
        button.dataset.fishClickBound = 'true';
        setCardTarget(button, media, img);
      }
    });
  };

  viewer.querySelector('.fish-gallery__prev').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    state.index = (state.index - 1 + state.images.length) % state.images.length;
    paint();
  });
  viewer.querySelector('.fish-gallery__next').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    state.index = (state.index + 1) % state.images.length;
    paint();
  });
  viewer.querySelector('.fish-gallery__close').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    close();
  });
  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) close();
  });
  document.addEventListener('keydown', (event) => {
    if (viewer.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft' && state.images.length > 1) {
      event.preventDefault();
      state.index = (state.index - 1 + state.images.length) % state.images.length;
      paint();
    }
    if (event.key === 'ArrowRight' && state.images.length > 1) {
      event.preventDefault();
      state.index = (state.index + 1) % state.images.length;
      paint();
    }
  });

  const ensureStyles = () => {
    if (document.getElementById('fish-direct-click-styles')) return;
    const style = document.createElement('style');
    style.id = 'fish-direct-click-styles';
    style.textContent = `
      body.fish-catalog-pilot .fish-catalog-card__media { position:relative !important; }
      body.fish-catalog-pilot .fish-catalog-card__media::before,
      body.fish-catalog-pilot .fish-catalog-card__media::after { pointer-events:none !important; }
      body.fish-catalog-pilot .fish-catalog-card__media .fish-card-image-button { position:relative !important; z-index:2 !important; display:block !important; width:100% !important; height:100% !important; min-width:0 !important; min-height:0 !important; margin:0 !important; padding:0 !important; border:0 !important; background:transparent !important; cursor:zoom-in !important; pointer-events:auto !important; overflow:hidden !important; }
      body.fish-catalog-pilot .fish-catalog-card__media .fish-card-image-button .fish-card-image { display:block !important; width:100% !important; height:100% !important; object-fit:cover !important; cursor:zoom-in !important; pointer-events:auto !important; }
      body.fish-catalog-pilot .fish-catalog-card__media .fish-card-nav { z-index:5 !important; pointer-events:auto !important; }
      body.fish-catalog-pilot .fish-gallery { position:fixed !important; inset:0 !important; z-index:100000 !important; display:flex !important; align-items:center !important; justify-content:center !important; padding:24px !important; background:rgba(3,20,15,.96) !important; backdrop-filter:blur(10px) !important; -webkit-backdrop-filter:blur(10px) !important; }
      body.fish-catalog-pilot .fish-gallery[hidden] { display:none !important; }
      body.fish-catalog-pilot .fish-gallery__panel { position:relative !important; z-index:100001 !important; width:min(1180px,94vw) !important; height:min(88vh,860px) !important; display:flex !important; align-items:center !important; justify-content:center !important; outline:none !important; }
      body.fish-catalog-pilot .fish-gallery__image { display:block !important; position:relative !important; z-index:100002 !important; max-width:100% !important; max-height:80vh !important; width:auto !important; height:auto !important; object-fit:contain !important; pointer-events:auto !important; user-select:none !important; -webkit-user-drag:none !important; box-shadow:0 24px 80px rgba(0,0,0,.4) !important; }
      body.fish-catalog-pilot .fish-gallery button { position:absolute !important; z-index:100003 !important; width:48px !important; height:48px !important; padding:0 !important; border:1px solid rgba(227,199,139,.52) !important; border-radius:50% !important; background:rgba(3,20,15,.72) !important; color:#e8cf99 !important; cursor:pointer !important; font:300 30px/1 Arial,sans-serif !important; pointer-events:auto !important; }
      body.fish-catalog-pilot .fish-gallery__prev { left:8px !important; top:50% !important; transform:translateY(-50%) !important; }
      body.fish-catalog-pilot .fish-gallery__next { right:8px !important; top:50% !important; transform:translateY(-50%) !important; }
      body.fish-catalog-pilot .fish-gallery__close { right:8px !important; top:8px !important; }
      body.fish-catalog-pilot .fish-gallery__counter { position:absolute !important; left:50% !important; bottom:8px !important; transform:translateX(-50%) !important; z-index:100003 !important; color:#fff !important; font:500 13px/1 Arial,sans-serif !important; pointer-events:none !important; }
      @media(max-width:700px){ body.fish-catalog-pilot .fish-gallery__panel{width:96vw !important;height:82vh !important;} body.fish-catalog-pilot .fish-gallery__image{max-width:92vw !important;max-height:72vh !important;} }
    `;
    document.head.appendChild(style);
  };

  const start = () => {
    ensureStyles();
    enhance();
    document.body.appendChild(viewer);
    new MutationObserver(enhance).observe(document.body, { childList:true, subtree:true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once:true });
  else start();
})();