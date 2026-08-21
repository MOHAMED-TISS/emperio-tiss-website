(() => {
  'use strict';

  const catalogUrl = '/assets/data/catalog.json';
  const demoUrl = '/assets/data/fish-demo.json';
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

  const esc = (value) => String(value ?? '').replace(/[&<>\"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;'
  }[char]));
  const first = (value) => Array.isArray(value) ? value.find(Boolean) || '' : (value || '');
  const conditionLabel = (value) => value === 'fresh' ? 'Fresh' : value === 'frozen' ? 'Frozen' : value;

  function card(product) {
    const meta = [
      product.condition?.map(conditionLabel).join(' · '),
      first(product.origin),
      first(product.calibre)
    ].filter(Boolean).join(' · ');
    const isDemo = product.status === 'demo';
    const link = isDemo
      ? '<span class="fish-catalog-card__link fish-catalog-card__link--demo">Visual test · no live fiche</span>'
      : `<a class="fish-catalog-card__link" href="/products/product.html?id=${encodeURIComponent(product.id)}">View specification ↗</a>`;

    return `<article class="fish-catalog-card${isDemo ? ' is-demo' : ''}" data-product-id="${esc(product.id)}"><div class="fish-catalog-card__media">${product.image ? `<img src="${esc(product.image)}" alt="${esc(product.commercialName)}" loading="lazy">` : '<span class="fish-catalog-card__placeholder">EMPERIO TISS</span>'}</div><div class="fish-catalog-card__body"><p class="fish-catalog-card__meta">${esc(isDemo ? 'DEMO · FISH' : (product.subcategory || 'Fish'))}</p><h3 class="fish-catalog-card__title">${esc(product.commercialName)}</h3><p class="fish-catalog-card__scientific"><em>${esc(product.scientificName)}</em></p>${meta ? `<p class="fish-catalog-card__spec">${esc(meta)}</p>` : ''}${link}</div></article>`;
  }

  function emblematicCard(product) {
    return `<article class="fish-emblematic-card"><div class="fish-emblematic-card__media"><span>EMPERIO TISS</span></div><div class="fish-emblematic-card__body"><span class="fish-emblematic-card__kicker">EMBLEMATIC · DEMO</span><h3>${esc(product.commercialName)}</h3><p class="fish-emblematic-card__scientific"><em>${esc(product.scientificName)}</em></p><div class="fish-emblematic-card__meta"><span>${esc(product.origin)}</span><span>${esc(product.condition)}</span></div><p class="fish-emblematic-card__note">${esc(product.note)}</p><span class="fish-emblematic-card__mark">Selected reference</span></div></article>`;
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

  Promise.all([
    loadJson(catalogUrl),
    demoMode ? loadJson(demoUrl) : Promise.resolve({ products: [] }),
    demoMode ? loadJson(emblematicUrl) : Promise.resolve({ products: [] })
  ]).then(([data, demo, emblematic]) => {
    const live = (data.products || []).filter((product) => product.status === 'active' && product.family === 'seafood' && product.subcategory === 'fish');
    const sample = demoMode ? (demo.products || []).filter((product) => product.status === 'demo' && product.family === 'seafood' && product.subcategory === 'fish') : [];
    products = [...live, ...sample];

    if (demoMode && emblematicSection && emblematicGrid) {
      const selected = (emblematic.products || []).filter((product) => product.status === 'demo').slice(0, 3);
      emblematicGrid.innerHTML = selected.map(emblematicCard).join('');
      emblematicSection.hidden = false;
    }
    render();
  }).catch((error) => {
    console.error('[EMPERIO TISS] Fish catalog failed:', error);
    count.textContent = 'Unavailable';
    grid.innerHTML = '<p class="fish-catalog__empty">The catalogue could not be loaded.</p>';
  });
})();
