(() => {
  const apply = () => document.querySelectorAll('#fishCatalogGrid .fish-catalog-card__detail').forEach(row => {
    const label = row.querySelector('span');
    if (label && label.textContent.trim().toLowerCase() === 'calibre') {
      const value = row.querySelector('strong');
      if (value) value.textContent = 'Según disponibilidad';
    }
  });
  apply();
  new MutationObserver(apply).observe(document.getElementById('fishCatalogGrid') || document.body, {childList:true,subtree:true});
})();
