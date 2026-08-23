(() => {
  'use strict';
  if (!document.querySelector('.fish-catalog-card, .seafood-catalog-card, .product-card, [data-catalog-family]')) return;

  const style = document.createElement('style');
  style.textContent = `
    /* Shared catalogue finish */
    .product-catalog-grid{gap:clamp(18px,2vw,28px)!important;background:transparent!important}
    .product-card{border:1px solid rgba(16,35,49,.08)!important;border-radius:18px!important;overflow:hidden!important;background:rgba(255,255,255,.72)!important;box-shadow:0 8px 28px rgba(16,35,49,.06)!important;transition:transform .25s ease,box-shadow .25s ease,background .25s ease!important}
    .product-card:hover{transform:translateY(-3px);background:#fff!important;box-shadow:0 16px 38px rgba(16,35,49,.09)!important}
    .product-card__media{position:relative;overflow:hidden!important;background:#edf0eb!important}
    .product-card__image-button{position:relative!important;overflow:hidden!important}
    .product-card__image-button img{transition:opacity .22s ease,transform .35s ease!important}
    .product-card__media:hover img{transform:scale(1.015)}
    .catalog-inline-nav{position:absolute;top:50%;transform:translateY(-50%);z-index:4;width:36px;height:36px;border:1px solid rgba(255,255,255,.72);border-radius:50%;background:rgba(16,35,49,.42);backdrop-filter:blur(7px);color:#fff;font:400 22px/1 sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s ease,background .2s ease}
    .product-card__media:hover .catalog-inline-nav,.seafood-catalog-card__media:hover .catalog-inline-nav,.catalog-inline-nav:focus-visible{opacity:1}
    .catalog-inline-nav:hover{background:rgba(16,35,49,.75)}
    .catalog-inline-nav--prev{left:12px}.catalog-inline-nav--next{right:12px}
    .catalog-inline-count{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);z-index:4;padding:5px 9px;border-radius:999px;background:rgba(16,35,49,.52);backdrop-filter:blur(5px);color:#fff;font:500 10px/1 'DM Sans',sans-serif;letter-spacing:.08em;pointer-events:none}
    .product-card__body{background:transparent!important}
    .product-card__title,.fish-catalog-card__title{color:#102331!important;text-shadow:none!important}
    .product-card__meta,.product-card__group{color:#8a683c!important}
    .product-card__description{color:#53615e!important}
    .fish-catalog-card__scientific{color:#53615e!important}
    .fish-catalog-card__detail strong{color:#1b2f3c!important}
    .fish-catalog-card__detail span{color:#66726e!important}
  `;
  document.head.appendChild(style);

  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function addControls(media, images, getImage, setImage) {
    if (!media || images.length < 2 || media.querySelector('.catalog-inline-nav')) return;
    const prev = document.createElement('button');
    prev.type = 'button'; prev.className = 'catalog-inline-nav catalog-inline-nav--prev'; prev.setAttribute('aria-label','Imagen anterior'); prev.textContent = '‹';
    const next = document.createElement('button');
    next.type = 'button'; next.className = 'catalog-inline-nav catalog-inline-nav--next'; next.setAttribute('aria-label','Imagen siguiente'); next.textContent = '›';
    const counter = document.createElement('span'); counter.className = 'catalog-inline-count'; counter.textContent = `1 / ${images.length}`;
    let index = 0;
    const go = step => { index = (index + step + images.length) % images.length; setImage(images[index]); counter.textContent = `${index + 1} / ${images.length}`; };
    prev.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); go(-1); });
    next.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); go(1); });
    media.append(prev,next,counter);
  }

  function enhanceGeneric(root = document) {
    root.querySelectorAll('.product-card__media').forEach(media => {
      if (media.dataset.inlineGalleryReady) return;
      const button = media.querySelector('[data-gallery-product]');
      if (!button) return;
      const id = button.dataset.galleryProduct;
      const product = window.__ET_CATALOG_PRODUCTS?.find(p => p.id === id);
      const images = Array.from(new Set((product?.images || []).filter(Boolean)));
      if (images.length < 2) return;
      const img = button.querySelector('img');
      if (!img) return;
      media.dataset.inlineGalleryReady = 'true';
      addControls(media, images, () => img.src, src => { img.style.opacity = '.35'; window.setTimeout(() => { img.src = src; img.style.opacity = '1'; }, 90); });
    });
  }

  function enhanceSeafood(root = document) {
    root.querySelectorAll('.seafood-catalog-card__media[data-image-list]').forEach(media => {
      if (media.dataset.inlineGalleryReady) return;
      let images=[];
      try { images = JSON.parse(media.dataset.imageList || '[]'); } catch (_) {}
      if (images.length < 2) return;
      const img = media.querySelector('img');
      if (!img) return;
      media.dataset.inlineGalleryReady = 'true';
      addControls(media, images, () => img.src, src => { img.style.opacity='.35'; window.setTimeout(() => { img.src=src; img.style.opacity='1'; },90); });
    });
  }

  const enhance = () => { enhanceGeneric(); enhanceSeafood(); };
  enhance();
  const observer = new MutationObserver(enhance);
  observer.observe(document.body, {childList:true, subtree:true});
})();
