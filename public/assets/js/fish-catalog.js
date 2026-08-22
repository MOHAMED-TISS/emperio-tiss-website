(() => {
  'use strict';

  const catalogUrl = '/assets/data/catalog.json';
  const demoUrl = '/assets/data/fish-demo.json';
  const realPhotoUrl = '/assets/data/fish-real-photo-demo.json';
  const emblematicUrl = '/assets/data/fish-emblematic-demo.json';
  const grid = document.getElementById('fishCatalogGrid');
  const search = document.getElementById('fishCatalogSearch');
  const count = document.getElementById('fishCatalogCount');
  const filters = [...document.querySelectorAll('[data-fish-filter]')];
  const emblematicSection = document.getElementById('fishEmblematic');
  const emblematicGrid = document.getElementById('fishEmblematicGrid');
  if (!grid || !search || !count) return;

  const demoMode = new URLSearchParams(window.location.search).get('demo') === '1';
  let products = [];
  let activeFilter = 'all';
  let realPhotos = {};

  const esc = (value) => String(value ?? '').replace(/[&<>\"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;'
  }[char]));
  const first = (value) => Array.isArray(value) ? value.find(Boolean) || '' : (value || '');
  const conditionLabel = (value) => value === 'fresh' ? 'Fresh' : value === 'frozen' ? 'Frozen' : value;
  const normalizeImages = (product) => {
    const images = Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []);
    return images.map((item) => typeof item === 'string' ? { src: item } : item).filter((item) => item?.src);
  };

  function card(product) {
    const meta = [product.condition?.map(conditionLabel).join(' · '), first(product.origin), first(product.calibre)].filter(Boolean).join(' · ');
    const isDemo = product.status === 'demo';
    const images = normalizeImages(product);
    const mainImage = images[0]?.src || '';
    const media = mainImage
      ? `<div class="fish-catalog-card__gallery"><div class="fish-catalog-card__media"><button type="button" class="fish-catalog-card__zoom" data-gallery-open="${esc(product.id)}" aria-label="Open ${esc(product.commercialName)} image"><img id="fish-image-${esc(product.id)}" src="${esc(mainImage)}" alt="${esc(product.commercialName)}" loading="lazy"></button></div>${images.length > 1 ? `<div class="fish-catalog-card__thumbs" role="group" aria-label="More images for ${esc(product.commercialName)}">${images.map((item, index) => `<button type="button" class="fish-catalog-card__thumb${index === 0 ? ' is-active' : ''}" data-gallery-src="${esc(item.src)}" data-gallery-target="fish-image-${esc(product.id)}" data-gallery-open="${esc(product.id)}" aria-label="View image ${index + 1}"><img src="${esc(item.src)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}</div>`
      : '<div class="fish-catalog-card__media"><span class="fish-catalog-card__placeholder">EMPERIO TISS</span></div>';
    const link = isDemo
      ? '<span class="fish-catalog-card__link fish-catalog-card__link--demo">Visual test · no live fiche</span>'
      : `<a class="fish-catalog-card__link" href="/products/product.html?id=${encodeURIComponent(product.id)}">View specification ↗</a>`;
    return `<article class="fish-catalog-card${isDemo ? ' is-demo' : ''}" data-product-id="${esc(product.id)}">${media}<div class="fish-catalog-card__body"><p class="fish-catalog-card__meta">${esc(isDemo ? 'DEMO · FISH' : (product.subcategory || 'Fish'))}</p><h3 class="fish-catalog-card__title">${esc(product.commercialName)}</h3><p class="fish-catalog-card__scientific"><em>${esc(product.scientificName)}</em></p>${meta ? `<p class="fish-catalog-card__spec">${esc(meta)}</p>` : ''}${link}</div></article>`;
  }

  function emblematicPhotoSet(product) {
    const map = {
      'Sparus aurata': 'demo-sea-bream',
      'Mullus barbatus': 'demo-red-mullet'
    };
    return realPhotos[map[product.scientificName]] || [];
  }

  function emblematicCard(product) {
    const images = emblematicPhotoSet(product);
    const media = images.length
      ? `<button type="button" class="fish-emblematic-card__media fish-emblematic-card__media--image" data-emblematic-open="${esc(product.id)}" ${images.map((item, index) => `data-image-${index}="${esc(item.src)}" data-credit-${index}="${esc(item.credit || '')}" data-license-${index}="${esc(item.license || '')}"`).join(' ')} aria-label="Open ${esc(product.commercialName)} images"><img src="${esc(images[0].src)}" alt="${esc(product.commercialName)}" loading="lazy"><span class="fish-emblematic-card__zoom-label">View larger ↗</span></button>`
      : '<div class="fish-emblematic-card__media"><span>EMPERIO TISS</span></div>';
    return `<article class="fish-emblematic-card">${media}<div class="fish-emblematic-card__body"><span class="fish-emblematic-card__kicker">EMBLEMATIC · DEMO</span><h3>${esc(product.commercialName)}</h3><p class="fish-emblematic-card__scientific"><em>${esc(product.scientificName)}</em></p><div class="fish-emblematic-card__meta"><span>${esc(product.origin)}</span><span>${esc(product.condition)}</span></div><p class="fish-emblematic-card__note">${esc(product.note)}</p><span class="fish-emblematic-card__mark">${images.length ? 'Selected reference · view image' : 'Selected reference'}</span></div></article>`;
  }

  function render() {
    const query = search.value.trim().toLowerCase();
    const visible = products.filter((product) => {
      const matchesFilter = activeFilter === 'all' || (product.condition || []).includes(activeFilter);
      const haystack = [product.commercialName, product.scientificName, ...(product.origin || [])].join(' ').toLowerCase();
      return matchesFilter && (!query || haystack.includes(query));
    });
    count.textContent = `${visible.length} reference${visible.length === 1 ? '' : 's'}${demoMode ? ' · demo' : ''}`;
    grid.innerHTML = visible.length ? visible.map(card).join('') : '<p class="fish-catalog__empty">No fish references match your search.</p>';
  }

  grid.addEventListener('click', (event) => {
    const thumb = event.target.closest('.fish-catalog-card__thumb');
    if (!thumb) return;
    const target = document.getElementById(thumb.dataset.galleryTarget || '');
    const src = thumb.dataset.gallerySrc;
    if (!target || !src) return;
    target.src = src;
    thumb.closest('.fish-catalog-card')?.querySelectorAll('.fish-catalog-card__thumb').forEach((item) => item.classList.remove('is-active'));
    thumb.classList.add('is-active');
  });

  filters.forEach((button) => button.addEventListener('click', () => {
    activeFilter = button.dataset.fishFilter || 'all';
    filters.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    render();
  }));
  search.addEventListener('input', render);

  const loadJson = (url) => fetch(url, { cache: 'no-cache' }).then((response) => {
    if (!response.ok) throw new Error(`Catalogue request failed: ${response.status}`);
    return response.json();
  });

  function setupLightbox() {
    const modal = document.createElement('div');
    modal.className = 'fish-lightbox';
    modal.hidden = true;
    modal.innerHTML = `<div class="fish-lightbox__backdrop" data-lightbox-close></div><div class="fish-lightbox__dialog" role="dialog" aria-modal="true" aria-label="Product image viewer"><button type="button" class="fish-lightbox__close" data-lightbox-close aria-label="Close image viewer">×</button><button type="button" class="fish-lightbox__prev" data-lightbox-prev aria-label="Previous image">‹</button><img class="fish-lightbox__image" alt=""><button type="button" class="fish-lightbox__next" data-lightbox-next aria-label="Next image">›</button><div class="fish-lightbox__caption"></div></div>`;
    document.body.appendChild(modal);
    let currentImages = [], currentIndex = 0;
    const close = () => { modal.hidden = true; document.body.classList.remove('fish-lightbox-open'); };
    const show = (index) => {
      if (!currentImages.length) return;
      currentIndex = (index + currentImages.length) % currentImages.length;
      const item = currentImages[currentIndex];
      modal.querySelector('.fish-lightbox__image').src = item.src;
      modal.querySelector('.fish-lightbox__image').alt = item.alt || '';
      modal.querySelector('.fish-lightbox__caption').textContent = item.credit ? `${item.credit}${item.license ? ` · ${item.license}` : ''}` : '';
      modal.querySelector('[data-lightbox-prev]').hidden = currentImages.length < 2;
      modal.querySelector('[data-lightbox-next]').hidden = currentImages.length < 2;
    };
    const openImages = (images, alt) => {
      if (!images.length) return;
      currentImages = images.map((item) => ({ ...item, alt }));
      show(0);
      modal.hidden = false;
      document.body.classList.add('fish-lightbox-open');
    };

    grid.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-gallery-open]');
      if (!trigger) return;
      const product = products.find((item) => item.id === trigger.dataset.galleryOpen);
      openImages(product ? normalizeImages(product) : [], product?.commercialName || 'Fish');
    });

    if (emblematicGrid) {
      emblematicGrid.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-emblematic-open]');
        if (!trigger) return;
        const images = [...Array(3).keys()].map((index) => trigger.dataset[`image-${index}`] ? {
          src: trigger.dataset[`image-${index}`],
          credit: trigger.dataset[`credit-${index}`] || '',
          license: trigger.dataset[`license-${index}`] || ''
        } : null).filter(Boolean);
        const title = trigger.querySelector('img')?.alt || 'Emblematic Fish';
        openImages(images, title);
      });
    }

    modal.addEventListener('click', (event) => {
      if (event.target.closest('[data-lightbox-close]')) close();
      if (event.target.closest('[data-lightbox-prev]')) show(currentIndex - 1);
      if (event.target.closest('[data-lightbox-next]')) show(currentIndex + 1);
    });
    document.addEventListener('keydown', (event) => {
      if (modal.hidden) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') show(currentIndex - 1);
      if (event.key === 'ArrowRight') show(currentIndex + 1);
    });
  }

  setupLightbox();

  loadJson(catalogUrl).then((data) => {
    products = (data.products || []).filter((product) => product.status === 'active' && product.family === 'seafood' && product.subcategory === 'fish');
    return demoMode ? loadJson(demoUrl) : { products: [] };
  }).then((demo) => {
    if (demoMode) products = [...products, ...(demo.products || []).filter((product) => product.status === 'demo' && product.family === 'seafood' && product.subcategory === 'fish')];
    render();
  }).catch((error) => {
    console.error('[EMPERIO TISS] Fish catalogue data failed:', error);
    count.textContent = 'Unavailable';
    grid.innerHTML = '<p class="fish-catalog__empty">The catalogue could not be loaded.</p>';
  });

  if (demoMode && emblematicSection && emblematicGrid) {
    loadJson(realPhotoUrl).then((data) => {
      realPhotos = data.products || {};
      return loadJson(emblematicUrl);
    }).then((data) => {
      const selected = (data.products || []).filter((product) => product.status === 'demo').slice(0, 3);
      emblematicGrid.innerHTML = selected.map(emblematicCard).join('');
      emblematicSection.hidden = false;
    }).catch(() => {
      loadJson(emblematicUrl).then((data) => {
        const selected = (data.products || []).filter((product) => product.status === 'demo').slice(0, 3);
        emblematicGrid.innerHTML = selected.map(emblematicCard).join('');
        emblematicSection.hidden = false;
      }).catch(() => {});
    });
  }
})();
