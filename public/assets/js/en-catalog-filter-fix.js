(() => {
  'use strict';
  const lang = (document.documentElement.lang || '').slice(0, 2).toLowerCase();
  if (!['en', 'fr'].includes(lang)) return;

  // Catalogue state stays local to the catalogue runtime. Never patch native prototypes.

  // Fish: every category now has fresh and frozen references, so no filter is locked.

  const syncCompact = () => {
    const body = document.body;
    const subcategory = body?.dataset.catalogSubcategory || body?.dataset
      .catalogSubcategories || '';
    const isFrozenSeafood = body?.dataset.catalogFamily === 'seafood' &&
      /(^|,)(shellfish|cephalopods)(,|$)/.test(subcategory);
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
    syncCompact();
  };

  document.addEventListener('click', event => {
    if (event.target.closest(
      '[data-compact-filter]')) {
      window.requestAnimationFrame(sync);
      window.setTimeout(sync, 50);
    }
  }, true);

  const observer = new MutationObserver(sync);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-pressed']
  });
  sync();
})();