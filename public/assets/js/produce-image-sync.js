/* Produce catalogue images — the Fruits & Vegetables intake folder is the image source of truth. */
(() => {
  'use strict';

  const MANIFEST_URL = '/assets/data/product-images.json';
  const INTAKE_PREFIX = '/assets/products/fruits-vegetables/incoming/';
  const READY_TIMEOUT = 100;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  const naturalImageCompare = (a, b) => {
    const filename = value => String(value || '').split('/').pop().replace(/\.[^.]+$/, '').trim();
    const parse = value => {
      const match = value.match(/^(.*?)(?:\s*[-_ ]?\(?\s*(\d+)\s*\)?)?$/);
      return { base: (match?.[1] || value).trim().toLocaleLowerCase(), number: match?.[2] ? Number(match[2]) : 0, hasNumber: !!match?.[2] };
    };
    const left = parse(filename(a));
    const right = parse(filename(b));
    const baseCompare = left.base.localeCompare(right.base, undefined, { numeric: true, sensitivity: 'base' });
    if (baseCompare !== 0) return baseCompare;
    if (left.hasNumber !== right.hasNumber) return left.hasNumber ? 1 : -1;
    if (left.number !== right.number) return left.number - right.number;
    return filename(a).localeCompare(filename(b), undefined, { numeric: true, sensitivity: 'base' });
  };

  function normaliseEntry(entry) {
    const values = Array.isArray(entry) ? entry : (entry ? [entry] : []);
    return [...new Set(values.filter(value => typeof value === 'string' && value.startsWith(INTAKE_PREFIX)))].sort(naturalImageCompare);
  }

  function imageMap(manifest) {
    const map = new Map();
    Object.entries(manifest || {}).forEach(([id, entry]) => {
      const images = normaliseEntry(entry);
      if (images.length) map.set(id, images);
    });
    return map;
  }

  function ensureStyles() {
    if (document.getElementById('etProduceImageSyncStyles')) return;
    const style = document.createElement('style');
    style.id = 'etProduceImageSyncStyles';
    style.textContent = `
      .produce-image-source{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:.42rem .55rem;background:linear-gradient(180deg,transparent,rgba(2,18,27,.7));color:rgba(255,255,255,.88);font:600 .43rem/1 var(--et-sans,'DM Sans',sans-serif);letter-spacing:.1em;text-transform:uppercase;pointer-events:none}
      .product-card__media .produce-image-button{position:relative;display:block;width:100%;height:100%;padding:0;border:0;background:none;cursor:pointer;overflow:hidden}
      .product-card__media .produce-image-button img{width:100%;height:100%;display:block;object-fit:cover;transition:transform .65s cubic-bezier(.2,.78,.2,1)}
      .product-card__media .produce-image-button:hover img{transform:scale(1.035)}
      .produce-image-count{position:absolute;right:.65rem;top:.65rem;padding:.34rem .45rem;background:rgba(2,18,27,.58);backdrop-filter:blur(7px);color:#fff;font:600 .43rem/1 var(--et-sans,'DM Sans',sans-serif);letter-spacing:.08em;text-transform:uppercase}
      .citrus-product-image{position:relative;margin:0 0 1.2rem;min-height:270px;overflow:hidden;background:#e9e4da;box-shadow:0 20px 45px rgba(20,43,58,.1)}
      .citrus-product-image button{position:relative;display:block;width:100%;height:100%;min-height:270px;padding:0;border:0;background:none;cursor:pointer;overflow:hidden}
      .citrus-product-image img{width:100%;height:100%;min-height:270px;display:block;object-fit:cover;transition:transform .75s cubic-bezier(.2,.78,.2,1)}
      .citrus-product-image button:hover img{transform:scale(1.035)}
      .citrus-product-image .produce-image-source{padding:.65rem .75rem}
      #etProduceImageLightbox{position:fixed;inset:0;z-index:10050;display:none;align-items:center;justify-content:center;padding:28px;background:rgba(2,14,24,.94)}
      #etProduceImageLightbox.is-open{display:flex}
      #etProduceImageLightbox img{max-width:min(92vw,1500px);max-height:84vh;object-fit:contain}
      #etProduceImageLightbox button{position:absolute;border:0;background:rgba(255,255,255,.1);color:#fff;width:46px;height:46px;border-radius:50%;font-size:26px;cursor:pointer}
      #etProduceImageLightbox .close{top:20px;right:20px}
      #etProduceImageLightbox .prev{left:22px}
      #etProduceImageLightbox .next{right:22px}
      #etProduceImageLightbox .count{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,.75);font:500 12px/1 var(--et-sans,'DM Sans',sans-serif);letter-spacing:.12em}
      @media(max-width:640px){.citrus-product-image,.citrus-product-image button,.citrus-product-image img{min-height:220px}}
    `;
    document.head.appendChild(style);
  }

  let lightboxImages = [];
  let lightboxIndex = 0;

  function ensureLightbox() {
    if (document.getElementById('etProduceImageLightbox')) return;
    const box = document.createElement('div');
    box.id = 'etProduceImageLightbox';
    box.setAttribute('aria-hidden', 'true');
    box.innerHTML = '<button class="close" type="button" aria-label="Cerrar">×</button><button class="prev" type="button" aria-label="Imagen anterior">‹</button><img alt=""><button class="next" type="button" aria-label="Imagen siguiente">›</button><span class="count"></span>';
    document.body.appendChild(box);
    box.addEventListener('click', event => { if (event.target === box) closeLightbox(); });
    box.querySelector('.close').addEventListener('click', closeLightbox);
    box.querySelector('.prev').addEventListener('click', () => showLightbox(lightboxIndex - 1));
    box.querySelector('.next').addEventListener('click', () => showLightbox(lightboxIndex + 1));
    document.addEventListener('keydown', event => {
      if (!box.classList.contains('is-open')) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showLightbox(lightboxIndex - 1);
      if (event.key === 'ArrowRight') showLightbox(lightboxIndex + 1);
    });
  }

  function showLightbox(index) {
    if (!lightboxImages.length) return;
    lightboxIndex = (index + lightboxImages.length) % lightboxImages.length;
    const box = document.getElementById('etProduceImageLightbox');
    box.querySelector('img').src = lightboxImages[lightboxIndex];
    box.querySelector('.count').textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
    box.querySelector('.prev').hidden = lightboxImages.length < 2;
    box.querySelector('.next').hidden = lightboxImages.length < 2;
  }

  function openLightbox(images, alt) {
    ensureLightbox();
    lightboxImages = images;
    lightboxIndex = 0;
    const box = document.getElementById('etProduceImageLightbox');
    box.querySelector('img').alt = alt || '';
    box.classList.add('is-open');
    box.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    showLightbox(0);
  }

  function closeLightbox() {
    const box = document.getElementById('etProduceImageLightbox');
    if (!box) return;
    box.classList.remove('is-open');
    box.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function productIdFromCard(card) {
    return card?.dataset.productId || '';
  }

  function renderCardImage(card, images) {
    const media = card.querySelector('.product-card__media');
    if (!media || !images.length) return;
    const productName = card.querySelector('.product-card__title')?.textContent?.trim() || productIdFromCard(card);
    media.innerHTML = `<button class="produce-image-button" type="button" aria-label="Ver imágenes de ${esc(productName)}"><img src="${esc(images[0])}" alt="${esc(productName)}" loading="lazy" draggable="false">${images.length > 1 ? `<span class="produce-image-count">${images.length} imágenes</span>` : ''}<span class="produce-image-source">Fruits &amp; Vegetables · Catalogue image</span></button>`;
    media.querySelector('button').addEventListener('click', () => openLightbox(images, productName));
  }

  function renderBaseCards(map) {
    document.querySelectorAll('.product-card[data-product-id]').forEach(card => {
      const images = map.get(productIdFromCard(card));
      if (images) renderCardImage(card, images);
    });
  }

  function renderCitrus(map) {
    document.querySelectorAll('.citrus-family-block').forEach(section => {
      const id = section.querySelector('.citrus-family-product strong')?.textContent?.trim();
      const images = map.get(id);
      if (!id || !images || section.querySelector('.citrus-product-image')) return;
      const productName = section.querySelector('.citrus-family-title h3')?.textContent?.trim() || id;
      const figure = document.createElement('figure');
      figure.className = 'citrus-product-image';
      figure.innerHTML = `<button type="button" aria-label="Ver imágenes de ${esc(productName)}"><img src="${esc(images[0])}" alt="${esc(productName)}" loading="lazy" draggable="false">${images.length > 1 ? `<span class="produce-image-count">${images.length} imágenes</span>` : ''}<span class="produce-image-source">Fruits &amp; Vegetables · Catalogue image</span></button>`;
      figure.querySelector('button').addEventListener('click', () => openLightbox(images, productName));
      const layout = section.querySelector('.citrus-family-layout');
      if (layout) layout.insertAdjacentElement('beforebegin', figure);
    });
  }

  async function waitForCatalogue(attempt = 0) {
    if (document.querySelector('.product-card[data-product-id]') || document.querySelector('.citrus-family-block')) return true;
    if (attempt >= 50) return false;
    await new Promise(resolve => setTimeout(resolve, READY_TIMEOUT));
    return waitForCatalogue(attempt + 1);
  }

  async function init() {
    if (!document.body.classList.contains('produce-page')) return;
    ensureStyles();
    try {
      const response = await fetch(MANIFEST_URL, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Image manifest request failed: ${response.status}`);
      const manifest = await response.json();
      const map = imageMap(manifest);
      if (!map.size) return;
      const ready = await waitForCatalogue();
      if (!ready) return;

      if (window.__ET_CATALOG_PRODUCTS) {
        window.__ET_CATALOG_PRODUCTS = window.__ET_CATALOG_PRODUCTS.map(product => {
          const images = map.get(product.id);
          return images ? { ...product, image: images[0], images } : product;
        });
      }
      renderBaseCards(map);
      renderCitrus(map);
      document.documentElement.dataset.produceImagesReady = 'true';
    } catch (error) {
      console.error('[EMPERIO TISS] Produce image sync failed:', error);
      document.documentElement.dataset.produceImagesReady = 'false';
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
