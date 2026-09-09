(() => {
  'use strict';

  const conditionButtons = [...document.querySelectorAll('[data-fish-filter]')];
  const categoryButtons = [...document.querySelectorAll('[data-fish-category]')];
  const grid = document.getElementById('fishCatalogGrid');
  if (!grid) return;

  const lang = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
  const PRIORITY_URL = '/assets/data/catalogue-market-priority.json';

  const compatible = {
    white: ['fresh', 'frozen', 'all'],
    blue: ['fresh', 'frozen', 'all'],
    special: ['fresh', 'all'],
    all: ['fresh', 'frozen', 'all']
  };

  const names = {
    cod: { es: 'Bacalao', en: 'Cod', fr: 'Cabillaud', it: 'Baccalà', ar: 'سمك القد' },
    pollock: { es: 'Abadejo de Alaska', en: 'Alaska pollock', fr: 'Lieu d’Alaska', it: 'Pollock dell’Alaska', ar: 'بولوك ألاسكا' },
    haddock: { es: 'Eglefino', en: 'Haddock', fr: 'Églefin', it: 'Eglefino', ar: 'الحدوق' },
    saithe: { es: 'Carbonero', en: 'Saithe', fr: 'Lieu noir', it: 'Carbonaro', ar: 'سمك السايث' },
    trout: { es: 'Trucha', en: 'Trout', fr: 'Truite', it: 'Trota', ar: 'التراوت' },
    sardine: { es: 'Sardina', en: 'Sardine', fr: 'Sardine', it: 'Sardina', ar: 'السردين' },
    basa: { es: 'Panga', en: 'Basa', fr: 'Pangasius', it: 'Pangasio', ar: 'الباسا' }
  };

  const additions = [
    ['cod', 'Gadus morhua', 'Pez de escama', 'Blanco / semigraso', 'Fresco / Congelado', 'Atlántico Norte / según origen', 'FAO 27'],
    ['pollock', 'Gadus chalcogrammus', 'Pez de escama', 'Blanco / magro', 'Fresco / Congelado', 'Atlántico Norte / Pacífico Norte según origen', 'FAO 27 / FAO 61'],
    ['haddock', 'Melanogrammus aeglefinus', 'Pez de escama', 'Blanco / magro', 'Fresco / Congelado', 'Atlántico Norte', 'FAO 27'],
    ['saithe', 'Pollachius virens', 'Pez de escama', 'Blanco / magro', 'Fresco / Congelado', 'Atlántico Norte', 'FAO 27'],
    ['trout', 'Oncorhynchus mykiss', 'Pez de escama', 'Blanco / semigraso', 'Fresco / Congelado', 'Según origen de acuicultura', 'Según origen'],
    ['sardine', 'Sardina pilchardus', 'Pez de escama', 'Azul / graso', 'Fresco / Congelado', 'Atlántico / Mediterráneo', 'FAO 27 / FAO 37'],
    ['basa', 'Pangasianodon hypophthalmus', 'Pez de escama', 'Blanco / magro', 'Fresco / Congelado', 'Vietnam / según programa de suministro', 'FAO 71']
  ];

  const marketTop10 = {
    es: ['dorada','lubina','merluza-pijota','rape','san-pedro','mujol','denton','sargo','pargo','caballa'],
    en: ['salmon','atun','cod','pollock','merluza-pijota','haddock','caballa','lubina','basa','pez-espada'],
    fr: ['salmon','cod','saithe','trout','dorada','lubina','merluza-pijota','rape','caballa','sardine'],
    it: ['dorada','salmon','lubina','pez-espada','atun','merluza-pijota','boqueron','caballa','rape','pez-limon'],
    ar: ['salmon','atun','mero-amarillo','lubina','pez-espada','pez-limon','caballa','dorada','merluza-pijota','pargo']
  };

  const selected = selector => document.querySelector(`${selector}[aria-pressed="true"]`)
    ?.dataset[selector.includes('category') ? 'fishCategory' : 'fishFilter'] || 'all';

  const esc = value => String(value ?? '').replace(/[&<>\"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;', "'":'&#39;'
  }[c]));

  const categoryOf = item => item.type.startsWith('Azul') ? 'blue' : 'white';
  const conditionOf = item => item.condition.toLowerCase().split('/').map(x => x.trim())
    .map(x => x === 'fresco' ? 'fresh' : x === 'congelado' ? 'frozen' : x);

  const renderAddition = item => {
    const name = (names[item.id] || {})[lang] || names[item.id]?.es || item.id;
    const cat = categoryOf(item);
    const labels = lang === 'fr'
      ? { family: 'Famille', type: 'Type', state: 'État', origin: 'Origine', fao: 'Zone FAO', calibre: 'Calibre', quality: 'Qualité', presentation: 'Présentation', packaging: 'Conditionnement', availability: 'Disponibilité', white: 'Poisson blanc', blue: 'Poisson bleu' }
      : lang === 'it'
      ? { family: 'Famiglia', type: 'Tipo', state: 'Stato', origin: 'Origine', fao: 'Zona FAO', calibre: 'Calibro', quality: 'Qualità', presentation: 'Presentazione', packaging: 'Imballaggio', availability: 'Disponibilità', white: 'Pesce bianco', blue: 'Pesce azzurro' }
      : lang === 'en'
      ? { family: 'Family', type: 'Type', state: 'Condition', origin: 'Origin', fao: 'FAO area', calibre: 'Calibre', quality: 'Quality', presentation: 'Presentation', packaging: 'Packaging', availability: 'Availability', white: 'White fish', blue: 'Blue fish' }
      : lang === 'ar'
      ? { family: 'الفئة', type: 'النوع', state: 'الحالة', origin: 'المنشأ', fao: 'منطقة FAO', calibre: 'المقاس', quality: 'الجودة', presentation: 'التقديم', packaging: 'التعبئة', availability: 'التوفر', white: 'سمك أبيض', blue: 'سمك أزرق' }
      : { family: 'Familia', type: 'Tipo', state: 'Estado', origin: 'Origen', fao: 'Zona FAO', calibre: 'Calibre', quality: 'Calidad', presentation: 'Presentación', packaging: 'Embalaje', availability: 'Disponibilidad', white: 'Pez blanco', blue: 'Pez azul' };
    const freshLabel = { es: 'Fresco', en: 'Fresh', fr: 'Frais', it: 'Fresco', ar: 'طازج' }[lang] || 'Fresh';
    const frozenLabel = { es: 'Congelado', en: 'Frozen', fr: 'Congelé', it: 'Surgelato', ar: 'مجمد' }[lang] || 'Frozen';
    const state = item.condition.split(' / ').map(x => x === 'Fresco' ? freshLabel : frozenLabel).join(' / ');
    const detail = (k,v) => `<div class="fish-catalog-card__detail"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`;
    const text = lang === 'ar'
      ? { availability:'حسب التوفر', destination:'حسب الوجهة', market:'حسب السوق', quality:'مواصفة مهنية' }
      : lang === 'fr'
      ? { availability:'Selon disponibilité', destination:'Selon destination', market:'Selon marché', quality:'Spécification professionnelle' }
      : lang === 'it'
      ? { availability:'Secondo disponibilità', destination:'Secondo destinazione', market:'Secondo mercato', quality:'Specificazione professionale' }
      : lang === 'en'
      ? { availability:'According to availability', destination:'According to destination', market:'According to market', quality:'Professional specification' }
      : { availability:'Según disponibilidad', destination:'Según destino', market:'Según mercado', quality:'Especificación profesional' };
    return `<article class="fish-catalog-card fish-catalog-card--market-added" data-product-id="${item.id}"><div class="fish-catalog-card__media"><span class="fish-catalog-card__placeholder">EMPERIO TISS</span></div><div class="fish-catalog-card__body"><p class="fish-catalog-card__meta">${esc(cat === 'white' ? labels.white : labels.blue)}</p><h3 class="fish-catalog-card__title">${esc(name)}</h3><p class="fish-catalog-card__scientific"><em>${esc(item.scientificName)}</em></p><div class="fish-catalog-card__details">${detail(labels.family, cat === 'white' ? labels.white : labels.blue)}${detail(labels.type, item.type)}${detail(labels.state, state)}${detail(labels.origin, item.origin)}${detail(labels.fao, item.faoZone)}${detail(labels.calibre, text.availability)}${detail(labels.quality, text.quality)}${detail(labels.presentation, text.destination)}${detail(labels.packaging, text.market)}${detail(labels.availability, text.availability)}</div></div></article>`;
  };

  const matches = item => {
    const condition = selected('[data-fish-filter]');
    const category = selected('[data-fish-category]');
    const q = (document.getElementById('fishCatalogSearch')?.value || '').trim().toLowerCase();
    const name = (names[item.id] || {})[lang] || names[item.id]?.es || item.id;
    const haystack = `${name} ${item.id} ${item.scientificName} ${item.group} ${item.type} ${item.origin} ${item.faoZone}`.toLowerCase();
    return (condition === 'all' || conditionOf(item).includes(condition)) && (category === 'all' || categoryOf(item) === category) && (!q || haystack.includes(q));
  };

  const mergePriority = existing => {
    const wanted = marketTop10[lang] || [];
    const rest = existing.filter(id => !wanted.includes(id));
    return [...wanted, ...rest];
  };

  let priority = [];
  let pending = false;
  const applyOrder = () => {
    const rank = new Map(mergePriority(priority).map((id, index) => [id, index]));
    const cards = Array.from(grid.querySelectorAll('.fish-catalog-card'));
    if (cards.length < 2) return;
    const ordered = [...cards].sort((a,b) => (rank.get(a.dataset.productId) ?? 9999) - (rank.get(b.dataset.productId) ?? 9999));
    if (ordered.every((card, index) => card === cards[index])) return;
    const fragment = document.createDocumentFragment();
    ordered.forEach(card => fragment.appendChild(card));
    grid.appendChild(fragment);
  };

  const hydrate = () => {
    additions.filter(matches).forEach(item => {
      if (!grid.querySelector(`[data-product-id="${item[0]}"]`)) {
        const mapped = { id: item[0], scientificName: item[1], group: item[2], type: item[3], condition: item[4], origin: item[5], faoZone: item[6] };
        grid.insertAdjacentHTML('beforeend', renderAddition(mapped));
      }
    });
    applyOrder();
  };

  const schedule = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; hydrate(); });
  };

  const sync = () => {
    const condition = selected('[data-fish-filter]');
    let category = selected('[data-fish-category]');
    categoryButtons.forEach(button => {
      const value = button.dataset.fishCategory || 'all';
      const allowed = condition === 'all' || (compatible[value] || []).includes(condition);
      button.disabled = !allowed;
      button.setAttribute('aria-disabled', String(!allowed));
    });
    if (category !== 'all' && !(compatible[category] || []).includes(condition)) {
      categoryButtons.find(button => button.dataset.fishCategory === 'all')?.click();
      category = 'all';
    }
    conditionButtons.forEach(button => {
      const value = button.dataset.fishFilter || 'all';
      const allowed = category === 'all' || (compatible[category] || []).includes(value);
      button.disabled = !allowed;
      button.setAttribute('aria-disabled', String(!allowed));
    });
  };

  conditionButtons.forEach(button => button.addEventListener('click', () => requestAnimationFrame(() => { sync(); schedule(); })));
  categoryButtons.forEach(button => button.addEventListener('click', () => requestAnimationFrame(() => { sync(); schedule(); })));
  document.getElementById('fishCatalogSearch')?.addEventListener('input', schedule);

  const observer = new MutationObserver(schedule);
  observer.observe(grid, { childList: true });

  fetch(PRIORITY_URL, { cache: 'no-cache' })
    .then(response => response.ok ? response.json() : {})
    .then(data => {
      priority = data?.priority?.['seafood/fish']?.[lang] || [];
      schedule();
    })
    .catch(schedule);

  sync();
})();
