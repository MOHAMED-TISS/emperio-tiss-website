(() => {
  'use strict';
  const conditionButtons = [...document.querySelectorAll('[data-fish-filter]')];
  const categoryButtons = [...document.querySelectorAll('[data-fish-category]')];
  if (!conditionButtons.length || !categoryButtons.length) return;

  // Current Fish catalogue availability matrix:
  // White fish = fresh; Special fish = fresh; Blue fish = fresh + frozen.
  const compatible = {
    white: ['fresh', 'all'],
    blue: ['fresh', 'frozen', 'all'],
    special: ['fresh', 'all'],
    all: ['fresh', 'frozen', 'all']
  };

  const selected = selector => document.querySelector(`${selector}[aria-pressed="true"]`)?.dataset[selector.includes('category') ? 'fishCategory' : 'fishFilter'] || 'all';

  const sync = () => {
    const condition = selected('[data-fish-filter]');
    let category = selected('[data-fish-category]');

    categoryButtons.forEach(button => {
      const value = button.dataset.fishCategory || 'all';
      const allowed = condition === 'all' || (compatible[value] || []).includes(condition);
      button.disabled = !allowed;
      button.setAttribute('aria-disabled', String(!allowed));
      if (!allowed) button.title = condition === 'frozen' ? 'Not available for frozen fish' : 'Not available for this combination';
      else button.removeAttribute('title');
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

  conditionButtons.forEach(button => button.addEventListener('click', () => requestAnimationFrame(sync)));
  categoryButtons.forEach(button => button.addEventListener('click', () => requestAnimationFrame(sync)));
  sync();
})();
