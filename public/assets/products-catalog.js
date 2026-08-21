/* EMPERIO TISS — structured product catalogue foundation */
(function () {
  'use strict';

  const required = [
    'id', 'family', 'subcategory', 'commercialName', 'scientificName',
    'condition', 'origin', 'faoZone', 'calibre', 'quality', 'format',
    'packaging', 'availability', 'image', 'status'
  ];

  async function loadCatalogue() {
    const response = await fetch('/products/catalog.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Product catalogue unavailable');
    const data = await response.json();
    validate(data);
    document.documentElement.dataset.productCatalogue = 'ready';
    window.EMPERIO_TISS_PRODUCTS = data;
    return data;
  }

  function validate(data) {
    if (!data || data.schemaVersion !== '1.0' || !Array.isArray(data.families) || !Array.isArray(data.products)) {
      throw new Error('Invalid product catalogue structure');
    }

    const familyIds = new Set(data.families.map(family => family.id));
    data.products.forEach(product => {
      required.forEach(field => {
        if (!(field in product)) throw new Error(`Missing product field: ${field}`);
      });
      if (!familyIds.has(product.family)) throw new Error(`Unknown product family: ${product.family}`);
      if (!Array.isArray(product.condition)) throw new Error('condition must be an array');
    });
  }

  loadCatalogue().catch(error => {
    document.documentElement.dataset.productCatalogue = 'error';
    console.error('[EMPERIO TISS] Product catalogue:', error.message);
  });
})();
