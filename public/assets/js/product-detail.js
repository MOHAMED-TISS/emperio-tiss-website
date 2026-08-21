(() => {
  'use strict';

  const root = document.getElementById('productDetail');
  if (!root) return;

  const labels = {
    condition: 'Condición', origin: 'Origen', faoZone: 'Zona FAO', calibre: 'Calibre', quality: 'Calidad',
    format: 'Formato', packaging: 'Envase / embalaje', availability: 'Disponibilidad', variety: 'Variedad',
    campaign: 'Campaña', brix: 'Brix', maturity: 'Madurez', glazing: 'Glaseado', processing: 'Procesado',
    freezing: 'Congelación', harvest: 'Cosecha', destination: 'Destino'
  };
  const order = ['condition','origin','faoZone','calibre','quality','format','packaging','availability','variety','campaign','brix','maturity','glazing','processing','freezing','harvest','destination'];

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  const pretty = (key, value) => {
    if (key === 'condition') {
      return (Array.isArray(value) ? value : [value]).map((item) => item === 'fresh' ? 'Fresco' : item === 'frozen' ? 'Congelado' : item).join(' · ');
    }
    return Array.isArray(value) ? value.filter(Boolean).join(' · ') : String(value ?? '');
  };

  async function getCatalog() {
    const response = await fetch('/assets/data/catalog.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.products)) throw new Error('Invalid catalog');
    return data;
  }

  async function render() {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) {
      root.innerHTML = '<div class="product-detail-error"><h1>Producto no especificado.</h1><a href="/products/">Volver a productos ↗</a></div>';
      return;
    }

    const data = await getCatalog();
    const product = data.products.find((item) => item.id === id && item.status === 'active');
    if (!product) {
      root.innerHTML = '<div class="product-detail-error"><h1>Producto no disponible.</h1><a href="/products/">Volver a productos ↗</a></div>';
      return;
    }

    const category = product.subcategory || product.family || 'product';
    const specs = order.filter((key) => product[key] && ((Array.isArray(product[key]) && product[key].some(Boolean)) || (!Array.isArray(product[key]) && product[key])))
      .map((key) => `<div class="product-detail__spec"><small>${esc(labels[key] || key)}</small><strong>${esc(pretty(key, product[key]))}</strong></div>`).join('');

    root.innerHTML = `<article class="product-detail" data-product-id="${esc(product.id)}">
      <div class="product-detail__media">
        ${product.image ? `<img src="${esc(product.image)}" alt="${esc(product.commercialName)}" loading="eager">` : '<div class="product-detail__placeholder">EMPERIO TISS</div>'}
      </div>
      <div class="product-detail__content">
        <p class="product-detail__eyebrow">${esc(category)}</p>
        <h1 class="product-detail__title">${esc(product.commercialName)}</h1>
        <p><em>${esc(product.scientificName)}</em></p>
        <div class="product-detail__specs">${specs}</div>
        <a class="button button-light" href="/contact/">Solicitar esta referencia <span>↗</span></a>
      </div>
    </article>`;
    document.title = `${product.commercialName} | EMPERIO TISS`;
  }

  render().catch((error) => {
    console.error('[EMPERIO TISS] Product detail failed:', error);
    root.innerHTML = '<div class="product-detail-error"><h1>No se pudo cargar la ficha.</h1><a href="/products/">Volver a productos ↗</a></div>';
  });
})();
