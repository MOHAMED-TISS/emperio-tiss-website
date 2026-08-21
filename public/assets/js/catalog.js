/* Shared catalogue interactions — language agnostic */
(() => {
  'use strict';

  document.querySelectorAll('.catalog-filter,[data-catalog-filter]').forEach((filter) => {
    filter.addEventListener('click', () => {
      const group = filter.closest('[data-catalog]') || document;
      const value = filter.dataset.catalogFilter || filter.dataset.filter || 'all';
      group.querySelectorAll('.catalog-filter,[data-catalog-filter]').forEach((item) => {
        item.classList.toggle('is-active', item === filter);
        item.setAttribute('aria-pressed', String(item === filter));
      });
      group.querySelectorAll('[data-catalog-item]').forEach((item) => {
        const categories = (item.dataset.catalogItem || '').split(/\s+/).filter(Boolean);
        item.hidden = value !== 'all' && !categories.includes(value);
      });
    });
  });
})();
