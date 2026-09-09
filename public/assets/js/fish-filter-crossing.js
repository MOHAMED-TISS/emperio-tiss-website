(() => {
  'use strict';

  const conditionButtons = [...document.querySelectorAll('[data-fish-filter]')];
  const categoryButtons = [...document.querySelectorAll('[data-fish-category]')];

  if (conditionButtons.length && categoryButtons.length) {
    // Definitive Fish catalogue rule:
    // every fish reference is fresh; only Salmon and Mackerel are also frozen.
    const compatible = {
      white: ['fresh', 'all'],
      blue: ['fresh', 'frozen', 'all'],
      special: ['fresh', 'all'],
      all: ['fresh', 'frozen', 'all']
    };

    const selected = selector => document.querySelector(`${selector}[aria-pressed="true"]`)
      ?.dataset[selector.includes('category') ? 'fishCategory' : 'fishFilter'] || 'all';

    const sync = () => {
      const condition = selected('[data-fish-filter]');
      let category = selected('[data-fish-category]');

      categoryButtons.forEach(button => {
        const value = button.dataset.fishCategory || 'all';
        const allowed = condition === 'all' || (compatible[value] || []).includes(condition);
        button.disabled = !allowed;
        button.setAttribute('aria-disabled', String(!allowed));
        if (!allowed) {
          button.title = condition === 'frozen' ?
            'Only Salmon and Mackerel are available frozen.' :
            'Not available for this combination';
        } else button.removeAttribute('title');
      });

      if (category !== 'all' && !(compatible[category] || []).includes(condition)) {
        const all = categoryButtons.find(button => button.dataset.fishCategory === 'all');
        all?.click();
        category = 'all';
      }

      conditionButtons.forEach(button => {
        const value = button.dataset.fishFilter || 'all';
        const allowed = category === 'all' || (compatible[category] || []).includes(value);
        button.disabled = !allowed;
        button.setAttribute('aria-disabled', String(!allowed));
        if (!allowed) button.title = 'Not available for this category';
        else button.removeAttribute('title');
      });
    };

    conditionButtons.forEach(button => button.addEventListener('click', () => requestAnimationFrame(
      sync)));
    categoryButtons.forEach(button => button.addEventListener('click', () => requestAnimationFrame(
      sync)));
    sync();
  }

  // Market merchandising order: keep the canonical catalogue and specifications,
  // but present references in the consumption-priority order defined per market.
  const grid = document.getElementById('fishCatalogGrid');
  if (!grid) return;

  const lang = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
  const PRIORITY_URL = '/assets/data/catalogue-market-priority.json';
  let priority = [];
  let pending = false;

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

  const schedule = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      applyOrder();
    });
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
