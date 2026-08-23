(() => {
  'use strict';
  const doc = document;
  const root = document.documentElement;
  const body = document.body;
  if (!body) return;

  const lang = (root.lang || 'es').slice(0, 2).toLowerCase();
  const nav = {
    es: { prefix:'', seafood:'Productos del mar', fish:'Pescados', fishScale:'Pez de escama', white:'Blanco / semigraso', blue:'Azul / graso', premium:'Premium', special:'Pescados especiales', shellfish:'Mariscos / Crustáceos', mediterranean:'Del Mediterráneo', moruno:'Moruno', cigala:'Cigala', whitePrawn:'Gamba blanca', tigerPrawn:'Langostino tigre', cephalopods:'Cefalópodos', fruitsVegetables:'Frutas y hortalizas', fruits:'Frutas', citrus:'Cítricos', exoticFruit:'Frutas exóticas', otherFruit:'Otras frutas', vegetables:'Hortalizas', seasonal:'Temporada', seasonalSelection:'Selección de temporada' },
    en: { prefix:'/en', seafood:'Seafood', fish:'Fish', fishScale:'Scaled fish', white:'White / semi-fatty', blue:'Blue / fatty', premium:'Premium', special:'Special fish', shellfish:'Shellfish / Crustaceans', mediterranean:'Mediterranean', moruno:'Moruno', cigala:'Cigala', whitePrawn:'Gamba blanca', tigerPrawn:'Langostino tigre', cephalopods:'Cephalopods', fruitsVegetables:'Fruits & Vegetables', fruits:'Fruit', citrus:'Citrus', exoticFruit:'Exotic fruit', otherFruit:'Other fruit', vegetables:'Vegetables', seasonal:'Seasonal', seasonalSelection:'Seasonal selection' },
    fr: { prefix:'/fr', seafood:'Produits de la mer', fish:'Poissons', fishScale:'Poissons à écailles', white:'Blancs / semi-gras', blue:'Bleus / gras', premium:'Premium', special:'Poissons spéciaux', shellfish:'Fruits de mer / Crustacés', mediterranean:'Méditerranée', moruno:'Moruno', cigala:'Cigala', whitePrawn:'Gamba blanca', tigerPrawn:'Langostino tigre', cephalopods:'Céphalopodes', fruitsVegetables:'Fruits & légumes', fruits:'Fruits', citrus:'Agrumes', exoticFruit:'Fruits exotiques', otherFruit:'Autres fruits', vegetables:'Légumes', seasonal:'Produits de saison', seasonalSelection:'Sélection de saison' },
    ar: { prefix:'/ar', seafood:'المأكولات البحرية', fish:'الأسماك', fishScale:'أسماك ذات قشور', white:'أبيض / شبه دهني', blue:'أزرق / دهني', premium:'فاخر', special:'أسماك خاصة', shellfish:'المأكولات البحرية / القشريات', mediterranean:'من البحر المتوسط', moruno:'Moruno', cigala:'Cigala', whitePrawn:'Gamba blanca', tigerPrawn:'Langostino tigre', cephalopods:'رأسيات الأرجل', fruitsVegetables:'الفواكه والخضروات', fruits:'الفواكه', citrus:'الحمضيات', exoticFruit:'الفواكه الاستوائية', otherFruit:'فواكه أخرى', vegetables:'الخضروات', seasonal:'المنتجات الموسمية', seasonalSelection:'اختيارات موسمية' }
  }[lang] || null;
  if (!nav) return;

  const path = window.location.pathname.replace(/\/+$/, '/') || '/';
  const href = suffix => `${nav.prefix}${suffix}`;
  const makeLink = (label, suffix) => { const a=doc.createElement('a'); a.href=href(suffix); a.textContent=label; if(path===href(suffix)) a.setAttribute('aria-current','page'); return a; };
  const makeSummary = label => { const s=doc.createElement('summary'); s.textContent=label; return s; };
  const makeLeaf = label => { const s=doc.createElement('span'); s.className='nav-product-leaf'; s.textContent=label; return s; };

  const buildFish = () => {
    const fish=doc.createElement('details'); fish.className='nav-fish'; fish.appendChild(makeSummary(nav.fish));
    const fishLinks=doc.createElement('div'); fishLinks.className='nav-products-links nav-fish-links';

    const scaled=doc.createElement('details'); scaled.className='nav-fish-scale'; scaled.appendChild(makeSummary(nav.fishScale));
    const scaleLinks=doc.createElement('div'); scaleLinks.className='nav-products-links nav-products-links--level-4';

    const white=doc.createElement('details'); white.className='nav-fish-type'; white.appendChild(makeSummary(nav.white));
    const whiteLinks=doc.createElement('div'); whiteLinks.className='nav-products-links nav-products-links--level-5';
    ['Dorada','Lubina','Merluza / Pijota','Mújol','Rape','San Pedro','Mero amarillo','Pargo','Dentón','Sama','Sargo','Rascacio'].forEach(makeLeaf).forEach(x=>whiteLinks.appendChild(x));
    white.appendChild(whiteLinks);

    const blue=doc.createElement('details'); blue.className='nav-fish-type'; blue.appendChild(makeSummary(nav.blue));
    const blueLinks=doc.createElement('div'); blueLinks.className='nav-products-links nav-products-links--level-5';
    ['Caballa','Salmonete','Atún','Pez limón','Boquerón'].forEach(makeLeaf).forEach(x=>blueLinks.appendChild(x));
    blue.appendChild(blueLinks);

    const premium=doc.createElement('details'); premium.className='nav-fish-type'; premium.appendChild(makeSummary(nav.premium));
    const premiumLinks=doc.createElement('div'); premiumLinks.className='nav-products-links nav-products-links--level-5';
    ['Dentón','San Pedro','Mero amarillo','Pargo','Sama','Pez limón','Atún'].forEach(makeLeaf).forEach(x=>premiumLinks.appendChild(x));
    premium.appendChild(premiumLinks);

    scaled.append(scaleLinks, white, blue, premium);
    fishLinks.appendChild(scaled);

    const special=doc.createElement('details'); special.className='nav-fish-special'; special.appendChild(makeSummary(nav.special));
    const specialLinks=doc.createElement('div'); specialLinks.className='nav-products-links nav-products-links--level-4';
    ['Pez sable','Pez espada'].forEach(makeLeaf).forEach(x=>specialLinks.appendChild(x));
    special.appendChild(specialLinks); fishLinks.appendChild(special);

    fish.appendChild(fishLinks); return fish;
  };

  const normalize = productsLinks => {
    if (!productsLinks || productsLinks.dataset.canonicalNav === 'true') return;
    productsLinks.dataset.canonicalNav='true'; productsLinks.innerHTML='';

    const seafood=doc.createElement('details'); seafood.className='nav-seafood'; seafood.appendChild(makeSummary(nav.seafood));
    const seafoodLinks=doc.createElement('div'); seafoodLinks.className='nav-products-links nav-seafood-links';
    seafoodLinks.appendChild(buildFish());

    const shellfish=doc.createElement('details'); shellfish.className='nav-shellfish'; shellfish.appendChild(makeSummary(nav.shellfish));
    const shellfishLinks=doc.createElement('div'); shellfishLinks.className='nav-products-links nav-products-links--level-3';
    const mediterranean=doc.createElement('details'); mediterranean.className='nav-shellfish-mediterranean'; mediterranean.appendChild(makeSummary(nav.mediterranean));
    const mediterraneanLinks=doc.createElement('div'); mediterraneanLinks.className='nav-products-links nav-products-links--level-4';
    [nav.moruno,nav.cigala,nav.whitePrawn,nav.tigerPrawn].forEach(makeLeaf).forEach(x=>mediterraneanLinks.appendChild(x));
    mediterranean.appendChild(mediterraneanLinks); shellfishLinks.appendChild(mediterranean); shellfish.appendChild(shellfishLinks); seafoodLinks.appendChild(shellfish);
    seafoodLinks.appendChild(makeLink(nav.cephalopods,'/products/seafood/cephalopods/')); seafood.appendChild(seafoodLinks); productsLinks.appendChild(seafood);

    const produce=doc.createElement('details'); produce.className='nav-produce'; produce.appendChild(makeSummary(nav.fruitsVegetables));
    const produceLinks=doc.createElement('div'); produceLinks.className='nav-products-links';
    const fruits=doc.createElement('details'); fruits.className='nav-fruits'; fruits.appendChild(makeSummary(nav.fruits));
    const fruitLinks=doc.createElement('div'); fruitLinks.className='nav-products-links nav-products-links--level-3';
    [nav.citrus,nav.exoticFruit,nav.otherFruit].forEach(makeLeaf).forEach(x=>fruitLinks.appendChild(x)); fruits.appendChild(fruitLinks); produceLinks.appendChild(fruits); produceLinks.appendChild(makeLink(nav.vegetables,'/products/vegetables/')); produce.appendChild(produceLinks); productsLinks.appendChild(produce);

    const seasonal=doc.createElement('details'); seasonal.className='nav-seasonal'; seasonal.appendChild(makeSummary(nav.seasonal));
    const seasonalLinks=doc.createElement('div'); seasonalLinks.className='nav-products-links nav-products-links--level-3'; seasonalLinks.appendChild(makeLink(nav.seasonalSelection,'/products/seasonal/')); seasonal.appendChild(seasonalLinks); productsLinks.appendChild(seasonal);
  };

  const run=()=>doc.querySelectorAll('.nav-products > .nav-products-links').forEach(normalize);
  run(); window.setTimeout(run,0); window.setTimeout(run,100);
  new MutationObserver(run).observe(doc.body,{childList:true,subtree:true});
})();
