(() => {
  'use strict';
  if ((document.documentElement.lang || '').slice(0,2).toLowerCase() !== 'en') return;

  let syncing = false;

  const getPressed = selector => document.querySelector(`${selector}[aria-pressed="true"]`);

  const syncFish = () => {
    const conditionButtons = [...document.querySelectorAll('[data-fish-filter]')];
    const categoryButtons = [...document.querySelectorAll('[data-fish-category]')];
    if (!conditionButtons.length || !categoryButtons.length) return;

    const condition = getPressed('[data-fish-filter]')?.dataset.fishFilter || 'all';
    let category = getPressed('[data-fish-category]')?.dataset.fishCategory || 'all';

    const allowedForCondition = value => condition !== 'frozen' || value === 'all' || value === 'blue';
    categoryButtons.forEach(button => {
      const value = button.dataset.fishCategory || 'all';
      const allowed = allowedForCondition(value);
      button.disabled = !allowed;
      button.setAttribute('aria-disabled', String(!allowed));
      if (!allowed) button.title = 'Only Salmon and Mackerel are available frozen.';
      else button.removeAttribute('title');
    });

    if (condition === 'frozen' && category !== 'all' && category !== 'blue') {
      const all = categoryButtons.find(button => button.dataset.fishCategory === 'all');
      syncing = true;
      all?.click();
      syncing = false;
      category = 'all';
    }

    conditionButtons.forEach(button => {
      const value = button.dataset.fishFilter || 'all';
      const allowed = category === 'all' || category === 'blue' || value !== 'frozen';
      button.disabled = !allowed;
      button.setAttribute('aria-disabled', String(!allowed));
      if (!allowed) button.title = 'Frozen is available only for Blue fish.';
      else button.removeAttribute('title');
    });
  };

  const syncCompact = () => {
    const body = document.body;
    const subcategory = body?.dataset.catalogSubcategory || body?.dataset.catalogSubcategories || '';
    const isFrozenSeafood = body?.dataset.catalogFamily === 'seafood' && /(^|,)(shellfish|cephalopods)(,|$)/.test(subcategory);
    if (!isFrozenSeafood) return;

    const filters = [...document.querySelectorAll('[data-compact-filter]')];
    if (!filters.length) return;
    const fresh = filters.find(button => button.dataset.compactFilter === 'fresh');
    const frozen = filters.find(button => button.dataset.compactFilter === 'frozen');
    if (!fresh || !frozen) return;

    fresh.disabled = true;
    fresh.setAttribute('aria-disabled', 'true');
    fresh.title = 'Fresh is not available for this catalogue.';
    frozen.disabled = false;
    frozen.removeAttribute('aria-disabled');
    frozen.removeAttribute('title');
  };

  const sync = () => {
    if (syncing) return;
    syncFish();
    syncCompact();
  };

  document.addEventListener('click', event => {
    if (event.target.closest('[data-fish-filter],[data-fish-category],[data-compact-filter]')) {
      window.requestAnimationFrame(sync);
      window.setTimeout(sync, 50);
    }
  }, true);

  const observer = new MutationObserver(sync);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-pressed'] });
  sync();
})();
