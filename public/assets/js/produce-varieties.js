(() => {
  'use strict';

  const DATA_URL = '/assets/data/produce-varieties.json';
  const labels = { es: 'VARIEDADES', en: 'VARIETIES', fr: 'VARIÉTÉS', ar: 'الأصناف', it: 'VARIETÀ' };
  const lang = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();

  async function waitForBaseCatalog(attempt = 0) {
    if (window.__ET_CATALOG_PRODUCTS && window.EMPERIO_TISS_CATALOG) return window.__ET_CATALOG_PRODUCTS;
    if (attempt >= 100) throw new Error('Base catalogue did not initialize');
    await new Promise(resolve => setTimeout(resolve, 100));
    return waitForBaseCatalog(attempt + 1);
  }

  function enrichCards(products) {
    document.querySelectorAll('[data-product-id]').forEach(card => {
      const product = products.find(item => item.id === card.dataset.productId);
      if (!product || !Array.isArray(product.varieties) || !product.varieties.length) return;
      const body = card.querySelector('.product-card__body');
      if (!body || body.querySelector('.product-card__varieties')) return;
      const title = body.querySelector('.product-card__title');
      if (!title) return;
      const line = document.createElement('p');
      line.className = 'product-card__varieties';
      line.innerHTML = `<span>${labels[lang] || labels.es}</span> ${product.varieties.map(value => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))).join(' · ')}`;
      title.insertAdjacentElement('afterend', line);
    });
  }

  async function init() {
    if (!document.body.classList.contains('produce-page')) return;
    try {
      const response = await fetch(DATA_URL, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Produce varieties request failed: ${response.status}`);
      const extension = await response.json();
      const base = await waitForBaseCatalog();
      const byId = new Map(extension.products.map(product => [product.id, product]));
      const merged = base.map(product => byId.has(product.id) ? { ...product, ...byId.get(product.id) } : product);
      const existingIds = new Set(base.map(product => product.id));
      const additions = extension.products.filter(product => !existingIds.has(product.id)).map(product => ({
        family: 'produce', category: 'produce', status: 'active', condition: ['fresh'], calibre: ['Según especificación del comprador'], image: '', images: [], ...product
      }));
      const all = [...merged, ...additions];
      window.__ET_CATALOG_PRODUCTS = all;
      document.querySelectorAll('[data-catalog-family="produce"]').forEach(target => {
        const subcategories = (target.dataset.catalogSubcategories || '').split(',').map(value => value.trim()).filter(Boolean);
        const selected = all.filter(product => product.family === 'produce' && (!subcategories.length || subcategories.includes(product.subcategory)) && product.status === 'active');
        target.innerHTML = selected.length ? selected.map(product => window.EMPERIO_TISS_CATALOG.card(product)).join('') : target.innerHTML;
      });
      enrichCards(all);
      document.documentElement.dataset.produceVarietiesReady = 'true';
    } catch (error) {
      console.error('[EMPERIO TISS] Produce varieties failed:', error);
      document.documentElement.dataset.produceVarietiesReady = 'false';
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
