(() => {
  'use strict';

  const grid = document.getElementById('fishCatalogGrid');
  if (!grid) return;

  const lang = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
  const PRIORITY_URL = '/assets/data/catalogue-market-priority.json';

  let priority = [];
  let pending = false;

  const schedule = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      applyOrder();
    });
  };

  const applyOrder = () => {
    if (!priority.length) return;

    const rank = new Map(priority.map((id, index) => [id, index]));
    const cards = Array.from(grid.querySelectorAll('.fish-catalog-card'));
    if (cards.length < 2) return;

    const ordered = [...cards].sort((a, b) => {
      const aId = a.dataset.productId || '';
      const bId = b.dataset.productId || '';
      const aRank = rank.has(aId) ? rank.get(aId) : Number.MAX_SAFE_INTEGER;
      const bRank = rank.has(bId) ? rank.get(bId) : Number.MAX_SAFE_INTEGER;
      return aRank - bRank;
    });

    if (ordered.every((card, index) => card === cards[index])) return;

    const fragment = document.createDocumentFragment();
    ordered.forEach(card => fragment.appendChild(card));
    grid.appendChild(fragment);
  };

  const observer = new MutationObserver(schedule);
  observer.observe(grid, { childList: true });

  fetch(PRIORITY_URL, { cache: 'no-cache' })
    .then(response => response.ok ? response.json() : {})
    .then(data => {
      priority = data?.priority?.['seafood/fish']?.[lang] || [];
      schedule();
    })
    .catch(() => {});
})();
