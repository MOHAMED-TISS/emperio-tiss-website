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

  // Catalogue-only image protection. This deliberately does not disable
  // browser controls globally; it only covers product catalogue imagery.
  const protectImages = (root = document) => {
    root.querySelectorAll('.fish-catalog-card img, .catalog-card img, .catalog-product img, .fish-gallery__image, [data-catalog] img').forEach((img) => {
      img.setAttribute('draggable', 'false');
      img.setAttribute('oncontextmenu', 'return false');
      img.setAttribute('ondragstart', 'return false');
      img.style.userSelect = 'none';
      img.style.webkitUserDrag = 'none';
      img.style.webkitTouchCallout = 'none';
    });
  };

  protectImages();

  document.addEventListener('contextmenu', (event) => {
    const image = event.target.closest('.fish-catalog-card img, .catalog-card img, .catalog-product img, .fish-gallery__image, [data-catalog] img');
    if (image) event.preventDefault();
  }, true);

  document.addEventListener('dragstart', (event) => {
    const image = event.target.closest('img');
    if (image && image.closest('.fish-catalog-card, .catalog-card, .catalog-product, .fish-gallery, [data-catalog]')) {
      event.preventDefault();
    }
  }, true);

  // Covers dynamically-rendered catalogue cards/lightbox images.
  const observer = new MutationObserver(() => protectImages());
  observer.observe(document.body, { childList: true, subtree: true });
})();
