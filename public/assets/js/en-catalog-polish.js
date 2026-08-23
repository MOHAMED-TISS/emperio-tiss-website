(() => {
  'use strict';
  const body = document.body;
  const isTarget = body?.dataset.catalogFamily === 'seafood' && /(^|,)(shellfish|cephalopods)(,|$)/.test(body.dataset.catalogSubcategory || body.dataset.catalogSubcategories || '');
  if (!isTarget) return;

  const catalog = document.querySelector('.compact-catalog');
  if (!catalog) return;

  const blockContext = event => event.preventDefault();
  catalog.addEventListener('contextmenu', blockContext, true);
  catalog.addEventListener('dragstart', event => {
    if (event.target.closest('img')) event.preventDefault();
  }, true);
  catalog.addEventListener('selectstart', event => {
    if (event.target.closest('img')) event.preventDefault();
  }, true);

  const markCards = () => {
    catalog.querySelectorAll('.compact-catalog-card').forEach(card => card.classList.add('is-ready'));
  };
  markCards();
  new MutationObserver(markCards).observe(catalog, { childList: true, subtree: true });
})();
