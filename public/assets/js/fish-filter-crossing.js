(() => {
  'use strict';

  const conditionButtons = [...document.querySelectorAll('[data-fish-filter]')];
  const categoryButtons = [...document.querySelectorAll('[data-fish-category]')];
  const grid = document.getElementById('fishCatalogGrid');
  if (!grid) return;

  const lang = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
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
    basa: { es: 'Panga', en: 'Basa', fr: 'Pangasius', it: 'Pangasio', ar: 'الباسا' },
    sole: { es: 'Lenguado', en: 'Common sole', fr: 'Sole commune', it: 'Sogliola', ar: 'سمك موسى' },
    whiting: { es: 'Pescadilla / Bacaladilla', en: 'Whiting', fr: 'Merlan', it: 'Nasello argentato', ar: 'سمك الميرلان' },
    hamour: { es: 'Mero del Golfo', en: 'Hamour grouper', fr: 'Mérou du Golfe', it: 'Cernia del Golfo', ar: 'هامور' },
    kingfish: { es: 'Carite / Kingfish', en: 'Kingfish (Kanaad)', fr: 'Thazard rayé', it: 'Sgombro spagnolo', ar: 'كنعد' },
    shaaur: { es: 'Emperador moteado', en: 'Spangled emperor', fr: 'Empereur tacheté', it: 'Imperatore maculato', ar: 'شعري' },
    safi: { es: 'Pez conejo moteado', en: 'Rabbitfish', fr: 'Poisson-lapin', it: 'Pesce coniglio', ar: 'صافي' },
    najil: { es: 'Mero coral leopardo', en: 'Leopard coral grouper', fr: 'Mérou corallien léopard', it: 'Cernia corallina leopardata', ar: 'ناجل' }
  };

  const additions = [
    ['cod', 'Gadus morhua', 'Pez de escama', 'Blanco / semigraso', 'Fresco / Congelado', 'Atlántico Norte / según origen', 'FAO 27'],
    ['pollock', 'Gadus chalcogrammus', 'Pez de escama', 'Blanco / magro', 'Fresco / Congelado', 'Atlántico Norte / Pacífico Norte según origen', 'FAO 27 / FAO 61'],
    ['haddock', 'Melanogrammus aeglefinus', 'Pez de escama', 'Blanco / magro', 'Fresco / Congelado', 'Atlántico Norte', 'FAO 27'],
    ['saithe', 'Pollachius virens', 'Pez de escama', 'Blanco / magro', 'Fresco / Congelado', 'Atlántico Norte', 'FAO 27'],
    ['trout', 'Oncorhynchus mykiss', 'Pez de escama', 'Blanco / semigraso', 'Fresco / Congelado', 'Según origen de acuicultura', 'Según origen'],
    ['sardine', 'Sardina pilchardus', 'Pez de escama', 'Azul / graso', 'Fresco / Congelado', 'Atlántico / Mediterráneo', 'FAO 27 / FAO 37'],
    ['basa', 'Pangasianodon hypophthalmus', 'Pez de escama', 'Blanco / magro', 'Fresco / Congelado', 'Vietnam / según programa de suministro', 'FAO 71'],
    ['sole', 'Solea solea', 'Pez de escama', 'Blanco / semigraso', 'Fresco / Congelado', 'Atlántico / Mediterráneo según origen', 'FAO 27 / FAO 37'],
    ['whiting', 'Merlangius merlangus', 'Pez de escama', 'Blanco / magro', 'Fresco / Congelado', 'Atlántico Norte', 'FAO 27'],
    ['hamour', 'Epinephelus coioides', 'Pez de escama', 'Blanco / semigraso', 'Fresco', 'Golfo / Mar Arábigo', 'FAO 51'],
    ['kingfish', 'Scomberomorus commerson', 'Pez de escama', 'Azul / graso', 'Fresco', 'Golfo / Mar Arábigo', 'FAO 51 / FAO 57'],
    ['shaaur', 'Lethrinus nebulosus', 'Pez de escama', 'Blanco / semigraso', 'Fresco', 'Golfo / Océano Índico occidental', 'FAO 51 / FAO 57'],
    ['safi', 'Siganus canaliculatus', 'Pez de escama', 'Blanco / semigraso', 'Fresco', 'Golfo / Océano Índico occidental', 'FAO 51 / FAO 57'],
    ['najil', 'Plectropomus pessuliferus', 'Pez de escama', 'Blanco / semigraso', 'Fresco', 'Mar Rojo / Golfo / Océano Índico', 'FAO 51 / FAO 57']
  ];

  const marketTop10 = {
    // Top 5 explicitly align with the latest Spain fresh-species evidence; the remainder
    // is the commercial merchandising order for the species carried on the site.
    es: ['salmon','sardine','merluza-pijota','cod','lubina','dorada','atun','rape','caballa','sole'],
    // UK: salmon, tuna, cod and pollock lead; haddock, mackerel, seabass and basa remain core.
    en: ['salmon','atun','cod','pollock','haddock','caballa','lubina','basa','merluza-pijota','saithe'],
    // France: salmon, cod, saithe, trout and seabream lead; sardine is retained in the top 10.
    fr: ['salmon','cod','saithe','trout','dorada','sardine','caballa','merluza-pijota','rape','whiting'],
    // Italy: sardine is deliberately excluded; seabream, salmon, seabass, swordfish and hake lead the fish assortment.
    it: ['dorada','salmon','lubina','pez-espada','merluza-pijota','boqueron','atun','caballa','rape','pez-limon'],
    // Gulf/Middle East: tuna, hamour, kanaad, salmon and locally preferred reef fish lead.
    ar: ['atun','hamour','kingfish','salmon','shaaur','lubina','dorada','najil','safi','pez-limon']
  };

  const selected = selector => document.querySelector(`${selector}[aria-pressed="true"]`)
    ?.dataset[selector.includes('category') ? 'fishCategory' : 'fishFilter'] || 'all';

  const esc = value => String(value ?? '').replace(/[&<>\"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;', "'":'&#39;'
  }[c]));

  const categoryOf = item => item.type.startsWith('Azul') ? 'blue' : 'white';
  const conditionOf = item => item.condition.toLowerCase().split('/').map(x => x.trim())
    .map(x => x === 'fresco' ? 'fresh' : x === 'congelado' ? 'frozen' : x);

  const labels = {
    es: { family:'Familia', type:'Tipo', state:'Estado', origin:'Origen', fao:'Zona FAO', calibre:'Calibre', quality:'Calidad', presentation:'Presentación', packaging:'Embalaje', availability:'Disponibilidad', white:'Pez blanco', blue:'Pez azul' },
    en: { family:'Family', type:'Type', state:'Condition', origin:'Origin', fao:'FAO area', calibre:'Calibre', quality:'Quality', presentation:'Presentation', packaging:'Packaging', availability:'Availability', white:'White fish', blue:'Blue fish' },
    fr: { family:'Famille', type:'Type', state:'État', origin:'Origine', fao:'Zone FAO', calibre:'Calibre', quality:'Qualité', presentation:'Présentation', packaging:'Conditionnement', availability:'Disponibilité', white:'Poisson blanc', blue:'Poisson bleu' },
    it: { family:'Famiglia', type:'Tipo', state:'Stato', origin:'Origine', fao:'Zona FAO', calibre:'Calibro', quality:'Qualità', presentation:'Presentazione', packaging:'Imballaggio', availability:'Disponibilità', white:'Pesce bianco', blue:'Pesce azzurro' },
    ar: { family:'الفئة', type:'النوع', state:'الحالة', origin:'المنشأ', fao:'منطقة FAO', calibre:'المقاس', quality:'الجودة', presentation:'التقديم', packaging:'التعبئة', availability:'التوفر', white:'سمك أبيض', blue:'سمك أزرق' }
  }[lang] || {};

  const copy = {
    es: { fresh:'Fresco', frozen:'Congelado', availability:'Según disponibilidad', destination:'Según destino', market:'Según mercado', quality:'Especificación profesional' },
    en: { fresh:'Fresh', frozen:'Frozen', availability:'According to availability', destination:'According to destination', market:'According to market', quality:'Professional specification' },
    fr: { fresh:'Frais', frozen:'Congelé', availability:'Selon disponibilité', destination:'Selon destination', market:'Selon marché', quality:'Spécification professionnelle' },
    it: { fresh:'Fresco', frozen:'Surgelato', availability:'Secondo disponibilità', destination:'Secondo destinazione', market:'Secondo mercato', quality:'Specificazione professionale' },
    ar: { fresh:'طازج', frozen:'مجمد', availability:'حسب التوفر', destination:'حسب الوجهة', market:'حسب السوق', quality:'مواصفة مهنية' }
  }[lang] || {};

  const renderAddition = item => {
    const name = (names[item.id] || {})[lang] || names[item.id]?.es || item.id;
    const cat = categoryOf(item);
    const state = conditionOf(item).map(x => x === 'fresh' ? copy.fresh : copy.frozen).join(' / ');
    const detail = (k,v) => `<div class="fish-catalog-card__detail"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`;
    return `<article class="fish-catalog-card fish-catalog-card--market-added" data-product-id="${esc(item.id)}"><div class="fish-catalog-card__media"><span class="fish-catalog-card__placeholder">EMPERIO TISS</span></div><div class="fish-catalog-card__body"><p class="fish-catalog-card__meta">${esc(cat === 'white' ? labels.white : labels.blue)}</p><h3 class="fish-catalog-card__title">${esc(name)}</h3><p class="fish-catalog-card__scientific"><em>${esc(item.scientificName)}</em></p><div class="fish-catalog-card__details">${detail(labels.family, cat === 'white' ? labels.white : labels.blue)}${detail(labels.type, item.type)}${detail(labels.state, state)}${detail(labels.origin, item.origin)}${detail(labels.fao, item.faoZone)}${detail(labels.calibre, copy.availability)}${detail(labels.quality, copy.quality)}${detail(labels.presentation, copy.destination)}${detail(labels.packaging, copy.market)}${detail(labels.availability, copy.availability)}</div></div></article>`;
  };

  const matches = item => {
    const condition = selected('[data-fish-filter]');
    const category = selected('[data-fish-category]');
    const q = (document.getElementById('fishCatalogSearch')?.value || '').trim().toLowerCase();
    const name = (names[item.id] || {})[lang] || names[item.id]?.es || item.id;
    const haystack = `${name} ${item.id} ${item.scientificName} ${item.group} ${item.type} ${item.origin} ${item.faoZone}`.toLowerCase();
    return (condition === 'all' || conditionOf(item).includes(condition)) && (category === 'all' || categoryOf(item) === category) && (!q || haystack.includes(q));
  };

  const wanted = marketTop10[lang] || [];
  const rank = new Map(wanted.map((id, index) => [id, index]));
  let pending = false;

  const applyOrder = () => {
    const cards = Array.from(grid.querySelectorAll('.fish-catalog-card'));
    if (cards.length < 2) return;
    const ordered = [...cards].sort((a,b) => (rank.get(a.dataset.productId) ?? 9999) - (rank.get(b.dataset.productId) ?? 9999));
    if (ordered.every((card, index) => card === cards[index])) return;
    const fragment = document.createDocumentFragment();
    ordered.forEach(card => fragment.appendChild(card));
    grid.appendChild(fragment);
  };

  const hydrate = () => {
    additions.filter(item => wanted.includes(item[0])).filter(matches).forEach(item => {
      if (!grid.querySelector(`[data-product-id="${item[0]}"]`)) {
        grid.insertAdjacentHTML('beforeend', renderAddition({
          id:item[0], scientificName:item[1], group:item[2], type:item[3], condition:item[4], origin:item[5], faoZone:item[6]
        }));
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

  sync();
  schedule();
})();
