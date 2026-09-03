(() => {
  'use strict';

  const DATA_URL = '/assets/data/produce-varieties.json';
  const labels = { es: 'VARIEDADES', en: 'VARIETIES', fr: 'VARIÉTÉS', ar: 'الأصناف', it: 'VARIETÀ' };
  const requestLabels = { es: 'Solicitar referencia', en: 'Request reference', fr: 'Demander la référence', ar: 'طلب المرجع', it: 'Richiedi referenza' };
  const availabilityLabels = {
    es: { trigger: 'Disponibilidad anual', spain: 'España', morocco: 'Marruecos', legend: 'Orientativo · sujeto a campaña y programa de suministro', high: 'Alta', medium: 'Media', limited: 'Limitada' },
    en: { trigger: 'Annual availability', spain: 'Spain', morocco: 'Morocco', legend: 'Indicative · subject to season and supply programme', high: 'High', medium: 'Medium', limited: 'Limited' },
    fr: { trigger: 'Disponibilité annuelle', spain: 'Espagne', morocco: 'Maroc', legend: 'Indicatif · selon campagne et programme d’approvisionnement', high: 'Forte', medium: 'Moyenne', limited: 'Limitée' },
    ar: { trigger: 'التوفر السنوي', spain: 'إسبانيا', morocco: 'المغرب', legend: 'إرشادي · حسب الموسم وبرنامج التوريد', high: 'مرتفع', medium: 'متوسط', limited: 'محدود' },
    it: { trigger: 'Disponibilità annuale', spain: 'Spagna', morocco: 'Marocco', legend: 'Indicativo · secondo campagna e programma di fornitura', high: 'Alta', medium: 'Media', limited: 'Limitata' }
  };
  const months = {
    es: ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'],
    en: ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'],
    fr: ['JAN','FÉV','MAR','AVR','MAI','JUN','JUL','AOÛ','SEP','OCT','NOV','DÉC'],
    ar: ['ينا','فبر','مار','أبر','ماي','يون','يول','أغس','سبت','أكت','نوف','ديس'],
    it: ['GEN','FEB','MAR','APR','MAG','GIU','LUG','AGO','SET','OTT','NOV','DIC']
  };
  const lang = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
  const av = availabilityLabels[lang] || availabilityLabels.es;
  const monthLabels = months[lang] || months.es;

  async function waitForBaseCatalog(attempt = 0) {
    if (window.__ET_CATALOG_PRODUCTS && window.EMPERIO_TISS_CATALOG) return window.__ET_CATALOG_PRODUCTS;
    if (attempt >= 100) throw new Error('Base catalogue did not initialize');
    await new Promise(resolve => setTimeout(resolve, 100));
    return waitForBaseCatalog(attempt + 1);
  }

  function safe(value) { return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }

  function availabilityPanel(product) {
    if (!product || !product.availability) return '';
    const rows = [
      { key: 'spain', label: av.spain },
      { key: 'morocco', label: av.morocco }
    ];
    const legend = `<span class="availability-legend-item"><i class="is-high"></i>${safe(av.high)}</span><span class="availability-legend-item"><i class="is-medium"></i>${safe(av.medium)}</span><span class="availability-legend-item"><i class="is-limited"></i>${safe(av.limited)}</span>`;
    const body = rows.map(row => {
      const values = Array.isArray(product.availability[row.key]) ? product.availability[row.key] : [];
      return `<div class="availability-row"><div class="availability-origin">${safe(row.label)}</div><div class="availability-months">${monthLabels.map((month, index) => { const level = Number(values[index] || 0); return `<span class="availability-month level-${level}" title="${safe(month)}">${safe(month)}</span>`; }).join('')}</div></div>`;
    }).join('');
    return `<div class="product-card__availability"><button class="product-card__availability-toggle" type="button" aria-expanded="false"><span>${safe(av.trigger)}</span><span class="product-card__availability-icon" aria-hidden="true">+</span></button><div class="product-card__availability-panel" hidden><div class="availability-grid">${body}</div><div class="availability-legend">${legend}</div><p class="availability-note">${safe(av.legend)}</p></div></div>`;
  }

  function bindAvailability(root = document) {
    root.querySelectorAll('.product-card__availability-toggle').forEach(button => {
      if (button.dataset.availabilityBound) return;
      button.dataset.availabilityBound = 'true';
      button.addEventListener('click', () => {
        const wrap = button.closest('.product-card__availability');
        const panel = wrap?.querySelector('.product-card__availability-panel');
        if (!panel) return;
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        panel.hidden = expanded;
        wrap.classList.toggle('is-open', !expanded);
      });
    });
  }

  function enrichCards(products, additions) {
    document.querySelectorAll('[data-product-id]').forEach(card => {
      const product = products.find(item => item.id === card.dataset.productId);
      if (!product) return;
      const body = card.querySelector('.product-card__body');
      if (!body) return;
      if (Array.isArray(product.varieties) && product.varieties.length && !body.querySelector('.product-card__varieties')) {
        const title = body.querySelector('.product-card__title');
        if (title) {
          const line = document.createElement('p');
          line.className = 'product-card__varieties';
          line.innerHTML = `<span>${labels[lang] || labels.es}</span> ${product.varieties.map(safe).join(' · ')}`;
          title.insertAdjacentElement('afterend', line);
        }
      }
      if (product.availability && !body.querySelector('.product-card__availability')) {
        const link = body.querySelector('.product-card__link');
        const panel = document.createRange().createContextualFragment(availabilityPanel(product));
        if (link) link.replaceWith(panel);
        else body.insertAdjacentHTML('beforeend', availabilityPanel(product));
      }
      if (additions.some(item => item.id === product.id)) {
        const link = body.querySelector('.product-card__link');
        if (link) {
          link.href = `/contact/?product=${encodeURIComponent(product.id)}`;
          link.textContent = `${requestLabels[lang] || requestLabels.es} ↗`;
        }
      }
    });
    bindAvailability();
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
      enrichCards(all, additions);
      document.documentElement.dataset.produceVarietiesReady = 'true';
    } catch (error) {
      console.error('[EMPERIO TISS] Produce varieties failed:', error);
      document.documentElement.dataset.produceVarietiesReady = 'false';
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
