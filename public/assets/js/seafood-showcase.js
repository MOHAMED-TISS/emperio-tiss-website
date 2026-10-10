(() => {
  'use strict';

  /* EMPERIO TISS — seafood showcase (fish, shellfish and cephalopods, every language).
     The catalogue scripts stay the data authority (Spanish set, market order, translations); each one
     publishes its products here and this module draws the same experience everywhere:
     search and filters, an elegant marquee (auto glide, drag with momentum, pause), a product plate
     with the technical sheet, and on fish pages the emblematic selection. */

  const doc = document, root = doc.documentElement;
  const lang = (root.lang || 'es').slice(0, 2).toLowerCase();
  const rtl = lang === 'ar' || root.dir === 'rtl';
  const VERSION = '20261010-5';

  // hide the original grids until the showcase is ready; show them again if no data ever arrives
  root.classList.add('et-show-on');
  const early = doc.createElement('style');
  early.textContent = 'html.et-show-on :is(#fishCatalogGrid,.seafood-catalog-grid,.market-catalogue__grid,#compactCatalogGrid,#fruitCatalog){visibility:hidden;min-height:60vh}';
  doc.head.appendChild(early);
  const fallback = setTimeout(() => root.classList.remove('et-show-on'), 5000);

  let css = doc.querySelector('link[data-et-showcase]');
  if (!css) {
    css = doc.createElement('link');
    css.rel = 'stylesheet';
    css.href = `/assets/css/seafood-showcase.css?v=${VERSION}`;
    css.dataset.etShowcase = 'true';
    doc.head.appendChild(css);
  }

  const T = {
    es: {pause: 'Pausar movimiento', resume: 'Reanudar movimiento', sheet: 'Ficha técnica completa', prev: 'Especie anterior', next: 'Especie siguiente', close: 'Cerrar', view: 'Ver imágenes de', selection: 'Selección emblemática', open: 'Ver ficha completa', search: 'Buscar especie o producto…', all: 'Todos', allGroups: 'Todas las categorías', fresh: 'Fresco', frozen: 'Congelado', onboard: 'Congelado a bordo', ref: 'referencia', refs: 'referencias', none: 'No hay referencias que coincidan con la búsqueda.', state: 'Estado', origin: 'Origen', fao: 'Zona FAO'},
    en: {pause: 'Pause motion', resume: 'Resume motion', sheet: 'Full technical sheet', prev: 'Previous species', next: 'Next species', close: 'Close', view: 'View images of', selection: 'Signature selection', open: 'View full sheet', search: 'Search species or product…', all: 'All', allGroups: 'All categories', fresh: 'Fresh', frozen: 'Frozen', onboard: 'Frozen at sea', ref: 'reference', refs: 'references', none: 'No references match your search.', state: 'Condition', origin: 'Origin', fao: 'FAO area'},
    fr: {pause: 'Mettre en pause', resume: 'Reprendre le mouvement', sheet: 'Fiche technique complète', prev: 'Espèce précédente', next: 'Espèce suivante', close: 'Fermer', view: 'Voir les images :', selection: 'Sélection emblématique', open: 'Voir la fiche complète', search: 'Rechercher une espèce ou un produit…', all: 'Tous', allGroups: 'Toutes les catégories', fresh: 'Frais', frozen: 'Congelé', onboard: 'Congelé à bord', ref: 'référence', refs: 'références', none: 'Aucune référence ne correspond à votre recherche.', state: 'État', origin: 'Origine', fao: 'Zone FAO'},
    it: {pause: 'Metti in pausa', resume: 'Riprendi il movimento', sheet: 'Scheda tecnica completa', prev: 'Specie precedente', next: 'Specie successiva', close: 'Chiudi', view: 'Vedi le immagini di', selection: 'Selezione emblematica', open: 'Vedi la scheda completa', search: 'Cerca specie o prodotto…', all: 'Tutti', allGroups: 'Tutte le categorie', fresh: 'Fresco', frozen: 'Surgelato', onboard: 'Congelato a bordo', ref: 'referenza', refs: 'referenze', none: 'Nessuna referenza corrisponde alla ricerca.', state: 'Stato', origin: 'Origine', fao: 'Zona FAO'},
    ar: {pause: 'إيقاف الحركة', resume: 'استئناف الحركة', sheet: 'البطاقة الفنية الكاملة', prev: 'النوع السابق', next: 'النوع التالي', close: 'إغلاق', view: 'عرض صور', selection: 'مختارات مميزة', open: 'عرض البطاقة الكاملة', search: 'ابحث عن نوع أو منتج…', all: 'الكل', allGroups: 'كل الفئات', fresh: 'طازج', frozen: 'مجمد', onboard: 'مجمد على متن السفينة', ref: 'مرجع', refs: 'مراجع', none: 'لا توجد مراجع مطابقة للبحث.', state: 'الحالة', origin: 'المنشأ', fao: 'منطقة FAO'}
  };
  const ui = T[lang] || T.es;

  // editorial note per fish species: general description only, no commercial data
  const NOTES = {
    dorada: {es: 'Pez blanco de carne firme, jugosa y de sabor delicado. Un imprescindible de la cocina mediterránea.', en: 'White fish with firm, juicy flesh and a delicate flavour. A Mediterranean essential.', fr: 'Poisson blanc à la chair ferme, juteuse et au goût délicat. Un incontournable de la cuisine méditerranéenne.', it: 'Pesce bianco dalla carne soda, succosa e dal sapore delicato. Un classico della cucina mediterranea.', ar: 'سمك أبيض ذو لحم متماسك وعصيري ونكهة رقيقة. أساسي في المطبخ المتوسطي.'},
    lubina: {es: 'Carne blanca, fina y de lasca tersa, con muy poca espina. Elegante en cualquier preparación.', en: 'Fine white flesh with smooth flakes and very few bones. Elegant in any preparation.', fr: 'Chair blanche, fine et nacrée, avec très peu d’arêtes. Élégante dans toutes les préparations.', it: 'Carne bianca e fine, a sfoglie compatte e con pochissime spine. Elegante in ogni preparazione.', ar: 'لحم أبيض ناعم متماسك قليل الحسك. أنيق في كل طريقة تحضير.'},
    'merluza-pijota': {es: 'El pescado blanco más apreciado en España: carne suave, lascas tiernas y sabor limpio.', en: 'Spain’s most prized white fish: soft flesh, tender flakes and a clean flavour.', fr: 'Le poisson blanc le plus apprécié en Espagne : chair douce, feuillets tendres et goût net.', it: 'Il pesce bianco più apprezzato in Spagna: carne morbida, sfoglie tenere e sapore pulito.', ar: 'أكثر الأسماك البيضاء تقديرًا في إسبانيا: لحم طري ونكهة نقية.'},
    rape: {es: 'Carne prieta, sin espinas y de textura casi de marisco. Protagonista de guisos y arroces.', en: 'Dense, boneless flesh with an almost shellfish-like texture. A star of stews and rice dishes.', fr: 'Chair serrée, sans arêtes, à la texture proche des crustacés. Reine des mijotés et des riz.', it: 'Carne compatta, senza spine e dalla consistenza quasi di crostaceo. Protagonista di zuppe e risotti.', ar: 'لحم كثيف بلا حسك وقوامه قريب من القشريات. نجم الأطباق المطهوة والأرز.'},
    caballa: {es: 'Pez azul de sabor intenso y rico en omega-3. Carácter marino en estado puro.', en: 'Oily fish with an intense flavour, rich in omega-3. Pure character of the sea.', fr: 'Poisson bleu au goût intense, riche en oméga-3. Le caractère marin à l’état pur.', it: 'Pesce azzurro dal sapore intenso, ricco di omega-3. Carattere marino allo stato puro.', ar: 'سمك أزرق ذو نكهة قوية وغني بأوميغا 3. طابع بحري خالص.'},
    sardina: {es: 'Icono del pescado azul: sabrosa, nutritiva y profundamente mediterránea.', en: 'The icon of oily fish: tasty, nourishing and deeply Mediterranean.', fr: 'L’icône du poisson bleu : savoureuse, nourrissante et profondément méditerranéenne.', it: 'Icona del pesce azzurro: saporita, nutriente e profondamente mediterranea.', ar: 'رمز الأسماك الزرقاء: لذيذة ومغذية ومتوسطية بامتياز.'},
    boqueron: {es: 'Pequeño pez azul de carne fina y sabor marino, emblema de la cocina española.', en: 'A small oily fish with fine flesh and a sea flavour, an emblem of Spanish cuisine.', fr: 'Petit poisson bleu à la chair fine et au goût marin, emblème de la cuisine espagnole.', it: 'Piccolo pesce azzurro dalla carne fine e dal sapore di mare, simbolo della cucina spagnola.', ar: 'سمك أزرق صغير ذو لحم ناعم ونكهة بحرية، رمز للمطبخ الإسباني.'},
    salmonete: {es: 'Carne fina y sabrosa de color rosado, muy valorada por la alta cocina.', en: 'Fine, flavourful pink flesh, highly valued in fine dining.', fr: 'Chair fine et savoureuse, rosée, très prisée par la haute cuisine.', it: 'Carne fine e saporita dal colore rosato, molto apprezzata dall’alta cucina.', ar: 'لحم ناعم لذيذ وردي اللون، يحظى بتقدير كبير في المطبخ الراقي.'},
    atun: {es: 'La gran especie del pescado azul: carne roja, densa y de sabor profundo.', en: 'The great oily fish: red, dense flesh with a deep flavour.', fr: 'La grande espèce du poisson bleu : chair rouge, dense et au goût profond.', it: 'La grande specie del pesce azzurro: carne rossa, densa e dal sapore profondo.', ar: 'أعظم أنواع الأسماك الزرقاء: لحم أحمر كثيف ونكهة عميقة.'},
    'pez-espada': {es: 'Carne compacta, sin espinas y de sabor suave, ideal en rodajas y lomos.', en: 'Compact, boneless flesh with a mild flavour, ideal as steaks and loins.', fr: 'Chair compacte, sans arêtes et au goût doux, idéale en darnes et en longes.', it: 'Carne compatta, senza spine e dal sapore delicato, ideale in tranci e filetti.', ar: 'لحم متماسك بلا حسك ونكهة معتدلة، مثالي للشرائح والفيليه.'},
    'san-pedro': {es: 'Pescado de roca de carne blanca y fina, muy apreciado por la alta cocina.', en: 'A rock fish with fine white flesh, much appreciated in fine dining.', fr: 'Poisson de roche à la chair blanche et fine, très apprécié par la haute cuisine.', it: 'Pesce di scoglio dalla carne bianca e fine, molto apprezzato dall’alta cucina.', ar: 'سمك صخري ذو لحم أبيض ناعم، يحظى بتقدير كبير في المطبخ الراقي.'},
    denton: {es: 'Pez de roca mediterráneo de carne blanca, firme y sabrosa.', en: 'A Mediterranean rock fish with firm, flavourful white flesh.', fr: 'Poisson de roche méditerranéen à la chair blanche, ferme et savoureuse.', it: 'Pesce di scoglio mediterraneo dalla carne bianca, soda e saporita.', ar: 'سمك صخري متوسطي ذو لحم أبيض متماسك ولذيذ.'},
    sargo: {es: 'Espárido de carne blanca y textura firme, de sabor marcado y limpio.', en: 'A sea bream with white, firm flesh and a distinct, clean flavour.', fr: 'Sparidé à la chair blanche et ferme, au goût marqué et net.', it: 'Sparide dalla carne bianca e soda, dal sapore deciso e pulito.', ar: 'من فصيلة الدنيس، لحمه أبيض متماسك ونكهته واضحة ونقية.'},
    sole: {es: 'Pescado plano de carne fina y delicada, referencia de la cocina clásica.', en: 'A flatfish with fine, delicate flesh, a reference of classic cuisine.', fr: 'Poisson plat à la chair fine et délicate, référence de la cuisine classique.', it: 'Pesce piatto dalla carne fine e delicata, riferimento della cucina classica.', ar: 'سمك مسطح ذو لحم ناعم ورقيق، مرجع في المطبخ الكلاسيكي.'},
    'pez-limon': {es: 'Carne firme con grasa equilibrada, muy apreciada en crudo.', en: 'Firm flesh with balanced fat, highly prized raw.', fr: 'Chair ferme au gras équilibré, très appréciée crue.', it: 'Carne soda dal grasso equilibrato, molto apprezzata a crudo.', ar: 'لحم متماسك بدهون متوازنة، مرغوب جدًا نيئًا.'},
    mujol: {es: 'Pescado de carne blanca y sabor marcado; de su hueva nace la bottarga.', en: 'White-fleshed fish with a distinct flavour; its roe becomes bottarga.', fr: 'Poisson à chair blanche au goût marqué ; ses œufs donnent la poutargue.', it: 'Pesce dalla carne bianca e dal sapore deciso; dalle sue uova nasce la bottarga.', ar: 'سمك أبيض اللحم ذو نكهة واضحة؛ ومن بطارخه تُصنع البوتارغا.'},
    pargo: {es: 'Espárido de gran porte y carne blanca, firme y sabrosa.', en: 'A large sea bream with white, firm and flavourful flesh.', fr: 'Grand sparidé à la chair blanche, ferme et savoureuse.', it: 'Sparide di grande taglia dalla carne bianca, soda e saporita.', ar: 'دنيس كبير الحجم ذو لحم أبيض متماسك ولذيذ.'},
    mero: {es: 'Pescado noble de carne blanca, gelatinosa y untuosa.', en: 'A noble fish with white, gelatinous and rich flesh.', fr: 'Poisson noble à la chair blanche, gélatineuse et onctueuse.', it: 'Pesce nobile dalla carne bianca, gelatinosa e untuosa.', ar: 'سمك نبيل ذو لحم أبيض هلامي وغني.'},
    sama: {es: 'Pez de la familia del dentón, de carne blanca y firme.', en: 'A fish of the dentex family with firm white flesh.', fr: 'Poisson de la famille du denté, à la chair blanche et ferme.', it: 'Pesce della famiglia del dentice, dalla carne bianca e soda.', ar: 'سمك من فصيلة السنغاري، لحمه أبيض ومتماسك.'},
    rascacio: {es: 'Pez de roca de sabor intenso, base clásica de sopas y calderos.', en: 'A rock fish with an intense flavour, the classic base for soups and fish stews.', fr: 'Poisson de roche au goût intense, base classique des soupes et des bouillabaisses.', it: 'Pesce di scoglio dal sapore intenso, base classica di zuppe e brodetti.', ar: 'سمك صخري ذو نكهة قوية، أساس كلاسيكي للحساء.'},
    salmon: {es: 'Carne anaranjada, untuosa y rica en omega-3. De una versatilidad excepcional.', en: 'Orange, rich flesh full of omega-3. Exceptionally versatile.', fr: 'Chair orangée, onctueuse et riche en oméga-3. D’une polyvalence exceptionnelle.', it: 'Carne arancione, untuosa e ricca di omega-3. Di eccezionale versatilità.', ar: 'لحم برتقالي غني بأوميغا 3. متعدد الاستخدامات بشكل استثنائي.'}
  };
  const SIGNATURE = ['dorada', 'lubina', 'merluza-pijota'];
  const SCENE_IMAGE = {dorada: 'fish-dorada-2026', lubina: 'fish-lubina-2026', 'merluza-pijota': 'fish-merluza-2026'};

  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const pad = n => String(n).padStart(2, '0');
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const arText = v => (lang === 'ar' && typeof window.ETArNormalize === 'function' && v) ? window.ETArNormalize(String(v)) : v;
  const stateOf = item => item.onboard ? ui.onboard : (item.states || []).map(s => s === 'fresh' ? ui.fresh : s === 'frozen' ? ui.frozen : s).join(' · ');
  const rows = pairs => pairs.filter(([, v]) => v).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
  const arrow = dir => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">${(dir < 0) !== rtl ? '<path d="M19 12H5M11 6l-6 6 6 6"/>' : '<path d="M5 12h14M13 6l6 6-6 6"/>'}</svg>`;
  const json = url => fetch(url, {cache: 'no-cache'}).then(r => r.ok ? r.json() : {}).catch(() => ({}));
  const references = json('/assets/data/product-references.json');

  // ---------------------------------------------------------------- publication from the catalogue scripts
  let best = null, mounted = null, settle = 0;
  const receive = detail => {
    if (!detail || !Array.isArray(detail.items)) return;
    if (best && (best.priority || 0) > (detail.priority || 0)) return;
    best = detail;
    clearTimeout(settle);
    // give a higher-priority source (the international catalogue) a moment to arrive
    settle = setTimeout(() => mount(best), mounted ? 0 : 450);
  };
  window.ETShowcase = {publish: receive};
  (window.__etShowcaseQueue || []).forEach(receive);
  doc.addEventListener('et:showcase', event => receive(event.detail));
  // Arabic pages: the shared dictionary may arrive after the first paint
  doc.addEventListener('et:ar-normalize', () => { if (mounted) mount(mounted); });

  // ---------------------------------------------------------------- the showcase
  let all = [], deck = [], state = 'all', group = 'all', query = '', refMap = {};
  let host = null, stage = null, toolbar = null, countEl = null, current = 0, plateList = null, lastFocus = null;

  const mount = detail => {
    clearTimeout(fallback);
    references.then(data => {
      const registry = data?.references || {}, aliases = data?.aliases || {};
      refMap = {};
      detail.items.forEach(item => { refMap[item.id] = item.reference || registry[item.id] || registry[aliases[item.id]] || ''; });
      all = detail.items.map(item => ({...item,
        name: arText(item.name), family: arText(item.family), origin: arText(item.origin), fao: arText(item.fao),
        specs: (item.specs || []).map(([k, v]) => [k, arText(v)]), note: (NOTES[item.id] || {})[lang] || ''}));
      const conceal = el => { if (el) { el.hidden = true; el.setAttribute('aria-hidden', 'true'); el.style.setProperty('display', 'none', 'important'); } };
      (detail.hide || []).forEach(conceal);
      host = detail.host;
      // one catalogue per page: any other catalogue block (older renderers) steps aside
      doc.querySelectorAll('.market-catalogue, .seafood-catalog, .compact-catalog, .fish-catalog').forEach(section => { if (!section.contains(host)) conceal(section); });
      if (!mounted || mounted.host !== host) build(detail);
      mounted = detail;
      root.classList.remove('et-show-on');
      render();
      if (detail.category === 'fish') paintSelection();
    });
  };

  const build = detail => {
    doc.querySelectorAll('.et-show').forEach(el => el.remove());
    const wrap = doc.createElement('div');
    wrap.className = detail.layout === 'grid' ? 'et-show et-show--grid' : 'et-show';
    if (rtl) wrap.setAttribute('dir', 'rtl');
    wrap.innerHTML = `<div class="et-show__toolbar"><input class="et-show__search" type="search" placeholder="${esc(ui.search)}" aria-label="${esc(ui.search)}"><p class="et-show__count" aria-live="polite"></p></div>`
      + `<div class="et-show__filters"></div><div class="et-show__stage"></div>`;
    if (detail.after && detail.after.parentNode) detail.after.insertAdjacentElement('afterend', wrap);
    else host.prepend(wrap);
    stage = wrap.querySelector('.et-show__stage');
    toolbar = wrap.querySelector('.et-show__filters');
    countEl = wrap.querySelector('.et-show__count');
    wrap.querySelector('.et-show__search').addEventListener('input', event => { query = event.target.value.trim().toLowerCase(); render(); });
    toolbar.addEventListener('click', event => {
      const chip = event.target.closest('[data-state],[data-group]');
      if (!chip) return;
      if (chip.dataset.state) state = chip.dataset.state; else group = chip.dataset.group;
      render();
    });
    bindMarquee();
    buildPlate(wrap);
  };

  const filters = () => {
    const states = ['onboard', 'frozen', 'fresh'].filter(s => all.some(item => s === 'onboard' ? item.onboard : !item.onboard && (item.states || []).includes(s)));
    const groups = [...new Map(all.filter(i => i.group).map(i => [i.group, i.groupLabel || i.family])).entries()];
    const chip = (attr, key, label, on) => `<button type="button" class="et-show__chip" data-${attr}="${esc(key)}" aria-pressed="${on}">${esc(label)}</button>`;
    let html = '';
    if (states.length > 1) html += `<div class="et-show__chips">${chip('state', 'all', ui.all, state === 'all')}${states.map(s => chip('state', s, ui[s], state === s)).join('')}</div>`;
    if (groups.length > 1) html += `<div class="et-show__chips">${chip('group', 'all', mounted?.labels?.allGroups || ui.allGroups, group === 'all')}${groups.map(([k, l]) => chip('group', k, arText(l), group === k)).join('')}</div>`;
    toolbar.innerHTML = html;
  };

  const matches = item => {
    const inState = state === 'all' || (state === 'onboard' ? item.onboard : (item.states || []).includes(state) && (state !== 'frozen' || !item.onboard));
    const inGroup = group === 'all' || item.group === group;
    const hay = [item.name, item.id, item.scientificName, item.family, item.origin].join(' ').toLowerCase();
    return inState && inGroup && (!query || hay.includes(query));
  };

  const render = () => {
    if (!stage) return;
    filters();
    deck = all.filter(matches);
    countEl.textContent = `${deck.length} ${deck.length === 1 ? ui.ref : ui.refs}`;
    if (mounted && mounted.layout === 'grid') paintGrid(); else paintMarquee();
  };

  // ---------------------------------------------------------------- marquee
  const tile = (item, i) => {
    const thumb = (item.images || [])[0];
    return `<button class="et-mq__card" type="button" data-index="${i}" aria-label="${esc(item.name)}">`
      + (thumb ? `<img src="${esc(thumb)}" alt="" loading="lazy" decoding="async" draggable="false">` : '<span class="et-mq__ph">EMPERIO TISS</span>')
      + `<span class="et-mq__state">${esc(stateOf(item))}</span>`
      + `<span class="et-mq__meta"><b>${esc(item.name)}</b><i>${esc(item.scientificName || '')}</i></span></button>`;
  };
  const word = (item, i) => `<button class="et-mq__word${i % 2 ? ' is-outline' : ''}" type="button" data-index="${i}">${esc(item.name)}</button><span class="et-mq__dot" aria-hidden="true">◆</span>`;
  const line = (html, mod, still) => `<div class="et-mq__line et-mq__line--${mod}${still ? ' is-still' : ''}" data-line="${mod}"><div class="et-mq__track"><div class="et-mq__set">${html}</div>`
    + (still ? '' : `<div class="et-mq__set" aria-hidden="true">${html.replaceAll('<button ', '<button tabindex="-1" ')}</div>`) + '</div></div>';

  let paused = reduced();
  try { const saved = localStorage.getItem('et_fish_marquee_paused'); if (saved !== null) paused = saved === '1'; } catch (_) {}
  const toggleInner = () => paused
    ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg><span>${esc(ui.resume)}</span>`
    : `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg><span>${esc(ui.pause)}</span>`;

  const paintMarquee = () => {
    if (!deck.length) { stage.innerHTML = `<p class="et-show__empty">${esc(ui.none)}</p>`; lines = []; return; }
    const still = reduced() || deck.length < 3;
    const indexed = deck.map((item, i) => [item, i]);
    const words = indexed.map(([item, i]) => word(item, i)).join('');
    const rowA = indexed.filter((_, k) => k % 2 === 0).map(([item, i]) => tile(item, i)).join('');
    const rowB = indexed.filter((_, k) => k % 2 === 1).map(([item, i]) => tile(item, i)).join('');
    const control = still ? '' : `<div class="et-mq__controls"><button class="et-mq__toggle" type="button" aria-pressed="${paused}">${toggleInner()}</button></div>`;
    stage.innerHTML = `<div class="et-mq">${control}${line(words, 'names', still)}${line(rowA, 'cards', still)}${rowB ? line(rowB, 'cards-reverse', still) : ''}</div>`;
    tune();
  };

  // grid layout (fruit): families as tabs; with every family shown the grid is sectioned by family
  const paintGrid = () => {
    lines = [];
    if (!deck.length) { stage.innerHTML = `<p class="et-show__empty">${esc(ui.none)}</p>`; return; }
    const card = (item, i) => {
      const thumb = item.thumb || (item.images || [])[0];
      return `<button class="et-tile" type="button" data-index="${i}" aria-label="${esc(item.name)}">`
        + `<span class="et-tile__photo">${thumb ? `<img src="${esc(thumb)}" alt="" loading="lazy" decoding="async" draggable="false">` : '<span class="et-mq__ph">EMPERIO TISS</span>'}</span>`
        + `<span class="et-tile__body"><b>${esc(item.name)}</b>${item.scientificName ? `<i>${esc(item.scientificName)}</i>` : ''}${item.origin ? `<em>${esc(item.origin)}</em>` : ''}</span></button>`;
    };
    const indexed = deck.map((item, i) => [item, i]);
    const families = [...new Map(deck.map(item => [item.group, item.groupLabel || item.family])).entries()];
    const sectioned = group === 'all' && !query && families.length > 1;
    const html = sectioned
      ? families.map(([key, label]) => { const list = indexed.filter(([item]) => item.group === key); return `<section class="et-grid__family"><div class="et-grid__head" role="heading" aria-level="3"><span>${esc(arText(label))}</span><i>${pad(list.length)}</i></div><div class="et-grid">${list.map(([item, i]) => card(item, i)).join('')}</div></section>`; }).join('')
      : `<div class="et-grid">${indexed.map(([item, i]) => card(item, i)).join('')}</div>`;
    stage.innerHTML = `<div class="et-grid-wrap">${html}</div>`;
  };

  // lines glide on their own, ease to a stop under the pointer, follow the hand when dragged and keep
  // their momentum when released; the loop only runs while the showcase is on screen and the tab visible
  const speed = {names: -42, cards: -30, 'cards-reverse': 26};
  let lines = [], looping = false, lastTime = 0, onScreen = true;
  const tune = () => {
    lines = [];
    stage.querySelectorAll('.et-mq__line:not(.is-still)').forEach(el => {
      const [set, copy] = el.querySelectorAll('.et-mq__set');
      if (!set.dataset.base) set.dataset.base = set.innerHTML;
      if (set.scrollWidth < 600) return; // styles not applied yet
      const repeat = set.dataset.base.replaceAll('<button ', '<button tabindex="-1" ');
      for (let guard = 0; set.scrollWidth < el.clientWidth + 120 && guard < 8; guard++) set.insertAdjacentHTML('beforeend', repeat);
      if (copy) copy.innerHTML = set.innerHTML.replaceAll('<button ', '<button tabindex="-1" ').replaceAll('tabindex="-1" tabindex="-1" ', 'tabindex="-1" ');
      const pace = speed[el.dataset.line] ?? -30, old = el.etLine;
      el.etLine = {el, track: el.querySelector('.et-mq__track'), width: set.getBoundingClientRect().width, x: old?.x ?? 0, v: old?.v ?? (paused ? 0 : pace), pace, hover: false, drag: null};
      lines.push(el.etLine);
    });
    startLoop();
  };
  const frame = now => {
    if (!onScreen || doc.hidden) { looping = false; return; }
    const dt = Math.min(.05, (now - lastTime) / 1000 || 0);
    lastTime = now;
    for (const l of lines) {
      if (!l.drag) {
        const target = l.hover || paused ? 0 : l.pace;
        l.v += (target - l.v) * Math.min(1, dt * (Math.abs(l.v - target) > 200 ? 1.6 : 2.4));
        l.x += l.v * dt;
      }
      if (l.width > 0) l.x = ((l.x % l.width) - l.width) % l.width;
      l.track.style.transform = `translate3d(${l.x.toFixed(2)}px,0,0)`;
    }
    if (lines.length) requestAnimationFrame(frame); else looping = false;
  };
  const startLoop = () => { if (!looping && lines.length && onScreen && !doc.hidden) { looping = true; lastTime = performance.now(); requestAnimationFrame(frame); } };
  doc.addEventListener('visibilitychange', startLoop);

  const bindMarquee = () => {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => { onScreen = entries[0].isIntersecting; startLoop(); }, {rootMargin: '120px 0px'}).observe(stage);
    }
    const lineOf = event => event.target.closest?.('.et-mq__line')?.etLine;
    stage.addEventListener('pointerdown', event => {
      const l = lineOf(event);
      if (!l || (event.pointerType === 'mouse' && event.button !== 0)) return;
      l.drag = null;
      l.press = {id: event.pointerId, x: event.clientX, y: event.clientY, startX: l.x, samples: [[performance.now(), event.clientX]]};
    });
    stage.addEventListener('pointermove', event => {
      const l = lineOf(event) || lines.find(x => x.press?.id === event.pointerId);
      if (!l?.press || l.press.id !== event.pointerId) return;
      const dx = event.clientX - l.press.x;
      if (!l.drag) {
        if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(event.clientY - l.press.y)) return;
        l.drag = true;
        l.el.classList.add('is-dragging');
        l.el.setPointerCapture?.(event.pointerId);
      }
      l.x = l.press.startX + dx;
      l.press.samples.push([performance.now(), event.clientX]);
      if (l.press.samples.length > 6) l.press.samples.shift();
    });
    const release = event => {
      const l = lines.find(x => x.press?.id === event.pointerId);
      if (!l) return;
      if (l.drag) {
        const s = l.press.samples, [t0, x0] = s[0], [t1, x1] = s[s.length - 1];
        l.v = Math.max(-2400, Math.min(2400, t1 > t0 ? (x1 - x0) / ((t1 - t0) / 1000) : 0));
        l.el.classList.remove('is-dragging');
        l.justDragged = true;
        setTimeout(() => { l.justDragged = false; }, 0);
      }
      l.drag = null;
      l.press = null;
    };
    stage.addEventListener('pointerup', release);
    stage.addEventListener('pointercancel', release);
    stage.addEventListener('click', event => { if (lineOf(event)?.justDragged) { event.preventDefault(); event.stopImmediatePropagation(); } }, true);
    stage.addEventListener('pointerover', event => { if (event.pointerType === 'mouse') { const l = lineOf(event); if (l) l.hover = true; } });
    stage.addEventListener('pointerout', event => { if (event.pointerType === 'mouse') { const l = lineOf(event); if (l && !l.el.contains(event.relatedTarget)) l.hover = false; } });
    stage.addEventListener('focusin', event => { const l = lineOf(event); if (l) l.hover = true; });
    stage.addEventListener('focusout', event => { const l = lineOf(event); if (l && !l.el.contains(event.relatedTarget)) l.hover = false; });
    stage.addEventListener('click', event => {
      const toggle = event.target.closest('.et-mq__toggle');
      if (toggle) {
        paused = !paused;
        try { localStorage.setItem('et_fish_marquee_paused', paused ? '1' : '0'); } catch (_) {}
        toggle.setAttribute('aria-pressed', String(paused));
        toggle.innerHTML = toggleInner();
        return;
      }
      const pick = event.target.closest('[data-index]');
      if (pick) openPlate(Number(pick.dataset.index));
    });
    css.addEventListener('load', tune);
    doc.fonts?.ready.then(tune);
    let resizeTimer = 0;
    addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(tune, 200); });
  };

  // ---------------------------------------------------------------- plate
  let plate = null, plateBody = null, viewer = null;
  const buildPlate = wrap => {
    plate = doc.createElement('div');
    plate.className = 'et-plate';
    plate.hidden = true;
    plate.setAttribute('role', 'dialog');
    plate.setAttribute('aria-modal', 'true');
    plate.innerHTML = '<div class="et-plate__backdrop"></div><div class="et-plate__panel">'
      + `<button class="et-plate__close" type="button" aria-label="${esc(ui.close)}">×</button>`
      + `<button class="et-plate__arrow et-plate__arrow--prev" type="button" data-dir="-1" aria-label="${esc(ui.prev)}">${arrow(-1)}</button>`
      + `<button class="et-plate__arrow et-plate__arrow--next" type="button" data-dir="1" aria-label="${esc(ui.next)}">${arrow(1)}</button>`
      + '<div class="et-plate__body"></div></div>';
    wrap.appendChild(plate);
    plateBody = plate.querySelector('.et-plate__body');
    plate.addEventListener('click', event => {
      if (event.target.closest('.et-plate__close') || event.target.classList.contains('et-plate__backdrop')) { closePlate(); return; }
      const a = event.target.closest('.et-plate__arrow');
      if (a) { showPlate(current + Number(a.dataset.dir) * (rtl ? -1 : 1), true); return; }
      const photo = event.target.closest('.et-plate__photo');
      if (photo) openViewer(JSON.parse(photo.dataset.images || '[]'));
    });
    doc.addEventListener('keydown', event => {
      if (viewer && !viewer.hidden) {
        if (event.key === 'Escape') closeViewer();
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') stepViewer(event.key === 'ArrowRight' ? 1 : -1);
        return;
      }
      if (plate.hidden) return;
      const photo = event.target.closest?.('.et-plate__photo');
      if (photo && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); openViewer(JSON.parse(photo.dataset.images || '[]')); return; }
      if (event.key === 'Escape') closePlate();
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); showPlate(current + ((event.key === 'ArrowRight') !== rtl ? 1 : -1), true); }
    });
    let touchX = null;
    plate.addEventListener('touchstart', event => { touchX = event.touches[0]?.clientX ?? null; }, {passive: true});
    plate.addEventListener('touchend', event => {
      if (touchX === null) return;
      const dx = (event.changedTouches[0]?.clientX ?? touchX) - touchX;
      touchX = null;
      if (Math.abs(dx) > 60 && event.target.closest('.et-plate__photo')) showPlate(current + ((dx < 0) !== rtl ? 1 : -1), true);
    }, {passive: true});
  };
  const plateDeck = () => plateList || deck;
  const plateHtml = item => {
    const hero = plateList && SCENE_IMAGE[item.id] ? `/assets/images/selection/${SCENE_IMAGE[item.id]}.webp` : '';
    const images = hero ? [hero, ...(item.images || [])] : (item.images || []);
    const ref = refMap[item.id] || '';
    return `<article class="fish-catalog-card et-plate__card" data-product-id="${esc(item.id)}"${ref ? ` data-product-reference="${esc(ref)}"` : ''}>`
      + `<div class="et-plate__photo" data-images='${esc(JSON.stringify(images))}' role="button" tabindex="0" aria-label="${esc(`${ui.view} ${item.name}`)}">`
      + (images[0] ? `<img src="${esc(images[0])}" alt="${esc(item.name)}" decoding="async" draggable="false">` : '<span class="et-mq__ph">EMPERIO TISS</span>')
      + `<span class="et-mq__state">${esc(stateOf(item))}</span></div>`
      + `<div class="et-plate__info"><div class="et-plate__lead"><p class="et-plate__kicker"><span>${esc(item.family || '')}</span>${ref ? `<span class="et-plate__refchip et-product-reference">REF. ${esc(ref)}</span>` : ''}</p>`
      + `<div class="et-fish-card__name et-plate__name" role="heading" aria-level="3">${esc(item.name)}</div>${item.scientificName ? `<p class="et-plate__latin" data-latin="true">${esc(item.scientificName)}</p>` : ''}`
      + (item.note ? `<p class="et-plate__story">${esc(item.note)}</p>` : '')
      + `</div><div class="et-plate__side"><dl class="et-plate__facts">${rows([[ui.state, stateOf(item)], [ui.origin, item.origin], [ui.fao, item.fao]])}</dl>`
      + '<div class="et-fish-card__sheet et-plate__actions"></div>'
      + ((item.specs || []).length ? `<details class="et-plate__more"><summary>${esc(ui.sheet)}</summary><dl class="et-fish-card__specs et-plate__specs">${rows(item.specs)}</dl></details>` : '')
      + '</div></div></article>';
  };
  const showPlate = (index, animate) => {
    const list = plateDeck();
    if (!list.length) return;
    current = (index + list.length) % list.length;
    const swap = () => {
      plateBody.innerHTML = plateHtml(list[current]);
      plate.setAttribute('aria-label', list[current].name);
      plate.querySelectorAll('.et-plate__arrow').forEach(a => { a.hidden = list.length < 2; });
      plateBody.classList.remove('is-leaving');
    };
    if (animate && !reduced()) { plateBody.classList.add('is-leaving'); setTimeout(swap, 240); } else swap();
  };
  const openPlate = (index, list = null) => {
    plateList = list;
    lastFocus = doc.activeElement;
    showPlate(index, false);
    plate.hidden = false;
    root.classList.add('et-plate-open');
    requestAnimationFrame(() => plate.classList.add('is-open'));
    plate.querySelector('.et-plate__close').focus({preventScroll: true});
  };
  const closePlate = () => {
    plate.classList.remove('is-open');
    root.classList.remove('et-plate-open');
    setTimeout(() => { plate.hidden = true; plateBody.innerHTML = ''; }, 360);
    lastFocus?.focus?.({preventScroll: true});
  };

  // full-screen photo viewer
  let gallery = [], galleryIndex = 0;
  const openViewer = images => {
    if (!images.length) return;
    if (!viewer) {
      viewer = doc.createElement('div');
      viewer.className = 'et-viewer';
      viewer.dir = 'ltr'; // counter and arrows read left to right on every page (Arabic mirrors ‹ ›)
      viewer.hidden = true;
      viewer.innerHTML = `<img class="et-viewer__img" alt="" draggable="false"><button class="et-viewer__btn et-viewer__close" type="button" aria-label="${esc(ui.close)}">×</button><button class="et-viewer__btn et-viewer__prev" type="button" aria-label="${esc(ui.prev)}">‹</button><button class="et-viewer__btn et-viewer__next" type="button" aria-label="${esc(ui.next)}">›</button><span class="et-viewer__count"></span>`;
      doc.body.appendChild(viewer);
      viewer.addEventListener('click', event => {
        if (event.target === viewer || event.target.closest('.et-viewer__close')) closeViewer();
        else if (event.target.closest('.et-viewer__prev')) stepViewer(-1);
        else if (event.target.closest('.et-viewer__next')) stepViewer(1);
      });
      // phones: swipe between photos
      let swipeX = null;
      viewer.addEventListener('touchstart', event => { swipeX = event.touches[0]?.clientX ?? null; }, {passive: true});
      viewer.addEventListener('touchend', event => {
        if (swipeX === null) return;
        const dx = (event.changedTouches[0]?.clientX ?? swipeX) - swipeX;
        swipeX = null;
        if (Math.abs(dx) > 50) stepViewer(dx < 0 ? 1 : -1);
      }, {passive: true});
    }
    gallery = images; galleryIndex = 0; viewer.hidden = false; paintViewer();
  };
  const paintViewer = () => {
    viewer.querySelector('.et-viewer__img').src = gallery[galleryIndex];
    viewer.querySelector('.et-viewer__count').textContent = `${galleryIndex + 1} / ${gallery.length}`;
    viewer.querySelectorAll('.et-viewer__prev,.et-viewer__next').forEach(b => { b.hidden = gallery.length < 2; });
  };
  const stepViewer = d => { if (gallery.length > 1) { galleryIndex = (galleryIndex + d + gallery.length) % gallery.length; paintViewer(); } };
  const closeViewer = () => { if (viewer) { viewer.hidden = true; viewer.querySelector('.et-viewer__img').removeAttribute('src'); } };

  // ---------------------------------------------------------------- emblematic selection (fish pages)
  let sceneIndex = 0;
  const sceneItems = () => SIGNATURE.map(id => all.find(item => item.id === id)).filter(Boolean);
  const factsRun = item => [item.origin, item.fao, item.family, stateOf(item), item.scientificName].filter(Boolean).map(f => `<span>${esc(f)}</span><i></i>`).join('');
  const showScene = (index, user) => {
    const emblem = doc.getElementById('fishEmblematic');
    const scene = emblem?.querySelector('.et-scene');
    const items = sceneItems();
    if (!scene || !items.length) return;
    sceneIndex = (index + items.length) % items.length;
    const item = items[sceneIndex];
    scene.querySelectorAll('.et-scene__image').forEach((img, k) => img.classList.toggle('is-active', k === sceneIndex));
    scene.querySelectorAll('.et-scene__tab').forEach((tab, k) => {
      tab.setAttribute('aria-selected', String(k === sceneIndex));
      tab.tabIndex = k === sceneIndex ? 0 : -1;
      const thread = tab.querySelector('.et-scene__thread');
      thread.style.animation = 'none'; void thread.offsetWidth; thread.style.animation = '';
    });
    scene.querySelector('.et-scene__count').textContent = `${pad(sceneIndex + 1)} / ${pad(items.length)}`;
    const panel = scene.querySelector('.et-scene__panel');
    panel.classList.add('is-changing');
    setTimeout(() => {
      panel.querySelector('.et-scene__label').textContent = `${item.family} · ${stateOf(item)}`;
      panel.querySelector('.et-scene__note').textContent = item.note || item.scientificName || '';
      panel.querySelector('.et-scene__cta').dataset.id = item.id;
      scene.querySelector('.et-scene__facts').innerHTML = `<div class="et-scene__run">${factsRun(item)}${factsRun(item)}</div><div class="et-scene__run" aria-hidden="true">${factsRun(item)}${factsRun(item)}</div>`;
      panel.classList.remove('is-changing');
    }, user ? 180 : 260);
  };
  const paintSelection = () => {
    const emblem = doc.getElementById('fishEmblematic');
    const items = sceneItems();
    if (!emblem || !items.length) return;
    emblem.classList.add('et-emblem');
    let scene = emblem.querySelector('.et-scene');
    if (!scene) {
      scene = doc.createElement('div');
      scene.className = 'et-scene et-scene--index';
      scene.dir = 'ltr'; // the photographs leave their dark side on the left: the layout stays, Arabic text runs right to left inside it
      (emblem.querySelector('.fish-emblematic__grid') || emblem.querySelector('.fish-emblematic__intro')).insertAdjacentElement('afterend', scene);
      scene.addEventListener('click', event => {
        const tab = event.target.closest('.et-scene__tab');
        if (tab) { showScene(Number(tab.dataset.index), true); return; }
        const cta = event.target.closest('.et-scene__cta');
        if (cta) { const list = sceneItems(); const i = list.findIndex(p => p.id === cta.dataset.id); if (i >= 0) openPlate(i, list); }
      });
      scene.addEventListener('keydown', event => {
        if (!event.target.closest('.et-scene__tab') || !['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(event.key)) return;
        event.preventDefault();
        showScene(sceneIndex + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1), true);
        scene.querySelector('.et-scene__tab[aria-selected="true"]')?.focus();
      });
      const hold = on => scene.classList.toggle('is-held', on);
      scene.addEventListener('mouseenter', () => hold(true));
      scene.addEventListener('mouseleave', () => hold(false));
      scene.addEventListener('focusin', () => hold(true));
      scene.addEventListener('focusout', event => { if (!scene.contains(event.relatedTarget)) hold(false); });
      scene.addEventListener('animationend', event => { if (event.animationName === 'et-thread' && !event.pseudoElement) showScene(sceneIndex + 1, false); });
      doc.addEventListener('visibilitychange', () => scene.classList.toggle('is-hidden-tab', doc.hidden));
      if ('IntersectionObserver' in window) new IntersectionObserver(e => scene.classList.toggle('is-offscreen', !e[0].isIntersecting)).observe(scene);
    }
    const dir = '/assets/images/selection/';
    scene.innerHTML = `<div class="et-scene__images" aria-hidden="true">${items.map((item, k) => { const n = SCENE_IMAGE[item.id]; const src = n ? `${dir}${n}.webp` : (item.images || [])[0] || ''; const set = n ? ` srcset="${dir}${n}-1000.webp 1000w, ${dir}${n}.webp 1536w" sizes="(max-width: 900px) 100vw, 1300px"` : ''; return src ? `<img class="et-scene__image${k === 0 ? ' is-active' : ''}" data-id="${esc(item.id)}" src="${esc(src)}"${set} alt="" decoding="async"${k ? ' loading="lazy"' : ''} draggable="false">` : ''; }).join('')}</div>`
      + '<div class="et-scene__shade" aria-hidden="true"></div>'
      + `<div class="et-scene__folio"><span>${esc(ui.selection)}</span><span class="et-scene__count">01 / ${pad(items.length)}</span></div>`
      + '<div class="et-scene__side">'
      + `<div class="et-scene__tabs" role="tablist" aria-orientation="vertical" aria-label="${esc(ui.selection)}">${items.map((item, k) => `<button class="et-scene__tab" type="button" role="tab" data-index="${k}" aria-selected="${k === 0}" tabindex="${k === 0 ? 0 : -1}"><strong>${esc(item.name)}</strong><small data-latin="true">${esc(item.scientificName || '')}</small><i class="et-scene__thread" aria-hidden="true"></i></button>`).join('')}</div>`
      + `<div class="et-scene__panel"><span class="et-scene__label"></span><p class="et-scene__note"></p><button class="et-scene__cta" type="button">${esc(ui.open)} <span aria-hidden="true">${rtl ? '←' : '→'}</span></button></div>`
      + '</div><div class="et-scene__facts" aria-hidden="true"></div>';
    showScene(0, false);
  };
})();
