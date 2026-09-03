(() => {
  'use strict';

  const DATA_URL = '/assets/data/produce-varieties.json';
  const labels = { es: 'VARIEDADES', en: 'VARIETIES', fr: 'VARIÉTÉS', ar: 'الأصناف', it: 'VARIETÀ' };
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
  const requestLabels = { es: 'Solicitar referencia', en: 'Request reference', fr: 'Demander la référence', ar: 'طلب المرجع', it: 'Richiedi referenza' };
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

  function ensureAvailabilityStyles() {
    if (document.getElementById('etAvailabilityStyles')) return;
    const style = document.createElement('style');
    style.id = 'etAvailabilityStyles';
    style.textContent = `
      .produce-vegetables-page .product-card__availability{margin-top:.35rem;border-top:1px solid var(--veg-line,rgba(32,56,44,.14));padding-top:.9rem}
      .produce-vegetables-page .product-card__availability-toggle{display:flex;align-items:center;justify-content:space-between;width:100%;padding:0;border:0;background:none;color:var(--veg-green,#49653F);font:700 .63rem/1.2 var(--et-sans);letter-spacing:.11em;text-transform:uppercase;cursor:pointer;text-align:left}
      .produce-vegetables-page .product-card__availability-toggle:hover{color:var(--veg-red,#A94B3B)}
      .produce-vegetables-page .product-card__availability-icon{display:inline-grid;place-items:center;width:1.35rem;height:1.35rem;border:1px solid currentColor;border-radius:50%;font:400 .95rem/1 var(--et-sans);transition:transform .3s var(--et-ease),background .3s var(--et-ease),color .3s var(--et-ease)}
      .produce-vegetables-page .product-card__availability.is-open .product-card__availability-icon{transform:rotate(45deg);background:var(--veg-green,#49653F);color:#fff}
      .produce-vegetables-page .product-card__availability-panel{padding-top:1rem}
      .produce-vegetables-page .availability-grid{display:grid;gap:.8rem}
      .produce-vegetables-page .availability-row{display:grid;grid-template-columns:76px minmax(0,1fr);gap:.7rem;align-items:center}
      .produce-vegetables-page .availability-origin{font:700 .56rem/1 var(--et-sans);letter-spacing:.12em;text-transform:uppercase;color:var(--veg-ink,#18251D)}
      .produce-vegetables-page .availability-months{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:2px}
      .produce-vegetables-page .availability-month{display:grid;place-items:center;min-width:0;height:25px;border:1px solid rgba(32,56,44,.1);font:600 .39rem/1 var(--et-sans);letter-spacing:.03em;color:#778177;background:rgba(32,56,44,.025)}
      .produce-vegetables-page .availability-month.level-1{background:rgba(73,101,63,.84);border-color:rgba(73,101,63,.84);color:#fff}
      .produce-vegetables-page .availability-month.level-2{background:rgba(111,129,80,.42);border-color:rgba(111,129,80,.3);color:var(--veg-deep,#20382C)}
      .produce-vegetables-page .availability-month.level-3{background:rgba(208,160,68,.13);border-color:rgba(208,160,68,.34);color:#75663f}
      .produce-vegetables-page .availability-legend{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1rem;padding-top:.75rem;border-top:1px solid rgba(32,56,44,.08)}
      .produce-vegetables-page .availability-legend-item{display:inline-flex;align-items:center;gap:.35rem;font:600 .48rem/1 var(--et-sans);letter-spacing:.06em;text-transform:uppercase;color:#6A756D}
      .produce-vegetables-page .availability-legend-item i{display:inline-block;width:7px;height:7px;border-radius:50%;background:#C9CDC5}
      .produce-vegetables-page .availability-legend-item i.is-high{background:var(--veg-green,#49653F)}
      .produce-vegetables-page .availability-legend-item i.is-medium{background:var(--veg-herb,#6F8150)}
      .produce-vegetables-page .availability-legend-item i.is-limited{background:var(--veg-spice,#D0A044)}
      .produce-vegetables-page .availability-note{margin:.75rem 0 0;color:#788178;font:400 .64rem/1.5 var(--et-serif);font-style:italic}
      @media(max-width:980px){.produce-vegetables-page .availability-row{grid-template-columns:68px minmax(0,1fr)}}
      @media(max-width:640px){.produce-vegetables-page .product-card__availability{padding-top:.85rem}.produce-vegetables-page .availability-row{grid-template-columns:1fr;gap:.4rem}.produce-vegetables-page .availability-month{height:29px;font-size:.42rem}.produce-vegetables-page .availability-legend{gap:.55rem}}
    `;
    document.head.appendChild(style);
  }

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
        const fragment = document.createRange().createContextualFragment(availabilityPanel(product));
        if (link) link.replaceWith(fragment);
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
    ensureAvailabilityStyles();
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
