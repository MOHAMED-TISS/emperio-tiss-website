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
      ? { family: 'Famille', state: 'État', origin: 'Origine', fao: 'Zone FAO', calibre: 'Calibre', quality: 'Qualité', presentation: 'Présentation', packaging: 'Conditionnement', availability: 'Disponibilité', white: 'Poisson blanc', blue: 'Poisson bleu' }
      : lang === 'it'
      ? { family: 'Famiglia', state: 'Stato', origin: 'Origine', fao: 'Zona FAO', calibre: 'Calibro', quality: 'Qualità', presentation: 'Presentazione', packaging: 'Imballaggio', availability: 'Disponibilità', white: 'Pesce bianco', blue: 'Pesce azzurro' }
      : lang === 'en'
      ? { family: 'Family', state: 'Condition', origin: 'Origin', fao: 'FAO area', calibre: 'Calibre', quality: 'Quality', presentation: 'Presentation', packaging: 'Packaging', availability: 'Availability', white: 'White fish', blue: 'Blue fish' }
      : lang === 'ar'
      ? { family: 'الفئة', state: 'الحالة', origin: 'المنشأ', fao: 'منطقة FAO', calibre: 'المقاس', quality: 'الجودة', presentation: 'التقديم', packaging: 'التعبئة', availability: 'التوفر', white: 'سمك أبيض', blue: 'سمك أزرق' }
      : { family: 'Familia', state: 'Estado', origin: 'Origen', fao: 'Zona FAO', calibre: 'Calibre', quality: 'Calidad', presentation: 'Presentación', packaging: 'Embalaje', availability: 'Disponibilidad', white: 'Pez blanco', blue: 'Pez azul' };
    const state = item.condition.split(' / ').map(x => x === 'Fresco' ? (lang === 'fr' ? 'Frais' : lang === 'en' ? 'Fresh' : lang === 'it' ? 'Fresco' : lang === 'ar' ? 'طازج' : 'Fresco') : (lang === 'fr' ? 'Congelé' : lang === 'en' ? 'Frozen' : lang === 'it' ? 'Surgelato' : lang === 'ar' ? 'مجمد' : 'Congelado')).join(' / ');
    const detail = (k,v) => `<div class="fish-catalog-card__detail"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`;
    return `<article class="fish-catalog-card fish-catalog-card--market-added" data-product-id="${item.id}"><div class="fish-catalog-card__media"><span class="fish-catalog-card__placeholder">EMPERIO TISS</span></div><div class="fish-catalog-card__body"><p class="fish-catalog-card__meta">${esc(cat === 'white' ? labels.white : labels.blue)}</p><h3 class="fish-catalog-card__title">${esc(name)}</h3><p class="fish-catalog-card__scientific"><em>${esc(item.scientificName)}</em></p><div class="fish-catalog-card__details">${detail(labels.family, cat === 'white' ? labels.white : labels.blue)}${detail('Type', item.type)}${detail(labels.state, state)}${detail(labels.origin, item.origin)}${detail(labels.fao, item.faoZone)}${detail(labels.calibre, lang === 'ar' ? 'حسب التوفر' : lang === 'fr' ? 'Selon disponibilité' : lang === 'it' ? 'Secondo disponibilità' : lang === 'en' ? 'According to availability' : 'Según disponibilidad')} ${detail(labels.quality, lang === 'ar' ? 'مواصفة مهنية' : lang === 'fr' ? 'Spécification professionnelle' : lang === 'it' ? 'Specificazione professionale' : lang === 'en' ? 'Professional specification' : 'Especificación profesional')}${detail(labels.presentation, lang === 'ar' ? 'حسب الوجهة' : lang === 'fr' ? 'Selon destination' : lang === 'it' ? 'Secondo destinazione' : lang === 'en' ? 'According to destination' : 'Según destino')}${detail(labels.packaging, lang === 'ar' ? 'حسب السوق' : lang === 'fr' ? 'Selon marché' : lang === 'it' ? 'Secondo mercato' : lang === 'en' ? 'According to market' : 'Según mercado')}${detail(labels.availability, lang === 'ar' ? 'حسب التوفر' : lang === 'fr' ? 'Selon disponibilité' : lang === 'it' ? 'Secondo disponibilità' : lang === 'en' ? 'According to availability' : 'Según disponibilidad')}</div></div></article>`;
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
    const ordered = [...cards].sort((a,b) => (rank.get(a.dataset.productId) ?? 9999) - (rank.get(b.dataset.productId) ?? 9999));
    const fragment = document.createDocumentFragment();
    ordered.forEach(card => fragment.appendChild(card));
    grid.appendChild(fragment);
  };

  const hydrate = () => {
    additions.filter(matches).forEach(item => {
      if (grid.querySelector(`[data-product-id="${item.id}"]`)) return;
      grid.insertAdjacentHTML('beforeend', renderAddition(item));
    });
    applyOrder();
  };

  const schedule = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; hydrate(); });
  };

  if (conditionButtons.length && categoryButtons.length) {
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
    const search = document.getElementById('fishCatalogSearch');
    search?.addEventListener('input', schedule);
    sync();
  } else {
    document.getElementById('fishCatalogSearch')?.addEventListener('input', schedule);
  }

  const observer = new MutationObserver(schedule);
  observer.observe(grid, { childList: true });

  fetch(PRIORITY_URL, { cache: 'no-cache' })
    .then(response => response.ok ? response.json() : {})
    .then(data => {
      priority = data?.priority?.['seafood/fish']?.[lang] || [];
      schedule();
    })
    .catch(() => schedule());
})();
