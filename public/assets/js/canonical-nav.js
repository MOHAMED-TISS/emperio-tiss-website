(() => {
  'use strict';
  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  if (!body) return;

  const lang = (root.lang || 'es').slice(0, 2).toLowerCase();
  const nav = {
    es: {
      prefix: '', seafood: 'Productos del mar', fish: 'Pescados', shellfish: 'Mariscos / Crustáceos',
      mediterranean: 'Del Mediterráneo', moruno: 'Moruno', cigala: 'Cigala', whitePrawn: 'Gamba blanca', tigerPrawn: 'Langostino tigre',
      cephalopods: 'Cefalópodos', fruitsVegetables: 'Frutas y hortalizas', fruits: 'Frutas', citrus: 'Cítricos', exoticFruit: 'Frutas exóticas', otherFruit: 'Otras frutas',
      vegetables: 'Hortalizas', seasonal: 'Temporada', seasonalSelection: 'Selección de temporada'
    },
    en: {
      prefix: '/en', seafood: 'Seafood', fish: 'Fish', shellfish: 'Shellfish / Crustaceans',
      mediterranean: 'Mediterranean', moruno: 'Moruno', cigala: 'Cigala', whitePrawn: 'Gamba blanca', tigerPrawn: 'Langostino tigre',
      cephalopods: 'Cephalopods', fruitsVegetables: 'Fruits & Vegetables', fruits: 'Fruit', citrus: 'Citrus', exoticFruit: 'Exotic fruit', otherFruit: 'Other fruit',
      vegetables: 'Vegetables', seasonal: 'Seasonal', seasonalSelection: 'Seasonal selection'
    },
    fr: {
      prefix: '/fr', seafood: 'Produits de la mer', fish: 'Poissons', shellfish: 'Fruits de mer / Crustacés',
      mediterranean: 'Méditerranée', moruno: 'Moruno', cigala: 'Cigala', whitePrawn: 'Gamba blanca', tigerPrawn: 'Langostino tigre',
      cephalopods: 'Céphalopodes', fruitsVegetables: 'Fruits & légumes', fruits: 'Fruits', citrus: 'Agrumes', exoticFruit: 'Fruits exotiques', otherFruit: 'Autres fruits',
      vegetables: 'Légumes', seasonal: 'Produits de saison', seasonalSelection: 'Sélection de saison'
    },
    ar: {
      prefix: '/ar', seafood: 'المأكولات البحرية', fish: 'الأسماك', shellfish: 'المأكولات البحرية / القشريات',
      mediterranean: 'من البحر المتوسط', moruno: 'Moruno', cigala: 'Cigala', whitePrawn: 'Gamba blanca', tigerPrawn: 'Langostino tigre',
      cephalopods: 'رأسيات الأرجل', fruitsVegetables: 'الفواكه والخضروات', fruits: 'الفواكه', citrus: 'الحمضيات', exoticFruit: 'الفواكه الاستوائية', otherFruit: 'فواكه أخرى',
      vegetables: 'الخضروات', seasonal: 'المنتجات الموسمية', seasonalSelection: 'اختيارات موسمية'
    }
  }[lang] || null;
  if (!nav) return;

  const path = window.location.pathname.replace(/\/+$/, '/') || '/';
  const href = (suffix) => `${nav.prefix}${suffix}`;

  const makeLink = (label, suffix) => {
    const a = doc.createElement('a');
    a.href = href(suffix);
    a.textContent = label;
    if (path === href(suffix)) a.setAttribute('aria-current', 'page');
    return a;
  };

  const makeSummary = (label) => {
    const summary = doc.createElement('summary');
    summary.textContent = label;
    return summary;
  };

  const makeLeaf = (label) => {
    const span = doc.createElement('span');
    span.className = 'nav-product-leaf';
    span.textContent = label;
    return span;
  };

  const normalize = (productsLinks) => {
    if (!productsLinks || productsLinks.dataset.canonicalNav === 'true') return;
    productsLinks.dataset.canonicalNav = 'true';
    productsLinks.innerHTML = '';

    const seafood = doc.createElement('details');
    seafood.className = 'nav-seafood';
    if (/\/products\/seafood\/(fish|shellfish|cephalopods)\/$/.test(path)) seafood.open = true;

    seafood.appendChild(makeSummary(nav.seafood));

    const seafoodLinks = doc.createElement('div');
    seafoodLinks.className = 'nav-products-links nav-seafood-links';
    seafoodLinks.appendChild(makeLink(nav.fish, '/products/seafood/fish/'));

    const shellfish = doc.createElement('details');
    shellfish.className = 'nav-shellfish';
    if (/\/products\/seafood\/shellfish\//.test(path)) shellfish.open = true;
    shellfish.appendChild(makeSummary(nav.shellfish));

    const shellfishLinks = doc.createElement('div');
    shellfishLinks.className = 'nav-products-links nav-products-links--level-3';

    const mediterranean = doc.createElement('details');
    mediterranean.className = 'nav-shellfish-mediterranean';
    mediterranean.appendChild(makeSummary(nav.mediterranean));

    const mediterraneanLinks = doc.createElement('div');
    mediterraneanLinks.className = 'nav-products-links nav-products-links--level-4';
    mediterraneanLinks.appendChild(makeLeaf(nav.moruno));
    mediterraneanLinks.appendChild(makeLeaf(nav.cigala));
    mediterraneanLinks.appendChild(makeLeaf(nav.whitePrawn));
    mediterraneanLinks.appendChild(makeLeaf(nav.tigerPrawn));
    mediterranean.appendChild(mediterraneanLinks);
    shellfishLinks.appendChild(mediterranean);
    shellfish.appendChild(shellfishLinks);
    seafoodLinks.appendChild(shellfish);
    seafoodLinks.appendChild(makeLink(nav.cephalopods, '/products/seafood/cephalopods/'));
    seafood.appendChild(seafoodLinks);
    productsLinks.appendChild(seafood);

    const produce = doc.createElement('details');
    produce.className = 'nav-produce';
    produce.appendChild(makeSummary(nav.fruitsVegetables));

    const produceLinks = doc.createElement('div');
    produceLinks.className = 'nav-products-links';

    const fruits = doc.createElement('details');
    fruits.className = 'nav-fruits';
    fruits.appendChild(makeSummary(nav.fruits));

    const fruitLinks = doc.createElement('div');
    fruitLinks.className = 'nav-products-links nav-products-links--level-3';
    fruitLinks.appendChild(makeLeaf(nav.citrus));
    fruitLinks.appendChild(makeLeaf(nav.exoticFruit));
    fruitLinks.appendChild(makeLeaf(nav.otherFruit));
    fruits.appendChild(fruitLinks);
    produceLinks.appendChild(fruits);
    produceLinks.appendChild(makeLink(nav.vegetables, '/products/vegetables/'));
    produce.appendChild(produceLinks);
    productsLinks.appendChild(produce);

    const seasonal = doc.createElement('details');
    seasonal.className = 'nav-seasonal';
    seasonal.appendChild(makeSummary(nav.seasonal));
    const seasonalLinks = doc.createElement('div');
    seasonalLinks.className = 'nav-products-links nav-products-links--level-3';
    seasonalLinks.appendChild(makeLink(nav.seasonalSelection, '/products/seasonal/'));
    seasonal.appendChild(seasonalLinks);
    productsLinks.appendChild(seasonal);
  };

  const run = () => {
    doc.querySelectorAll('.nav-products > .nav-products-links').forEach(normalize);
  };

  run();
  window.setTimeout(run, 0);
  window.setTimeout(run, 100);

  const observer = new MutationObserver(() => {
    doc.querySelectorAll('.nav-products > .nav-products-links').forEach((links) => {
      if (!links.dataset.canonicalNav) normalize(links);
    });
  });
  observer.observe(doc.body, { childList: true, subtree: true });
})();
