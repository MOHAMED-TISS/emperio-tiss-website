(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const path = window.location.pathname.replace(/\/+$/, '/') || '/';

  const luxuryCss = '/assets/css/components/luxury-direction-v2.css?v=20260822-2';
  if (!doc.querySelector('link[data-et-luxury-direction]')) {
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = luxuryCss;
    link.dataset.etLuxuryDirection = 'true';
    doc.head.appendChild(link);
  }

  const normalizeDirectionalMarks = () => {
    const arrows = /[↗→←↔↓]/g;
    const variant = char => {
      if (char === '↓') return 'luxury-direction-v2--down';
      if (char === '←') return 'luxury-direction-v2--left';
      if (char === '↔') return 'luxury-direction-v2--both';
      return '';
    };

    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(parent.tagName)) continue;
      if (arrows.test(node.nodeValue)) textNodes.push(node);
      arrows.lastIndex = 0;
    }

    textNodes.forEach(textNode => {
      const value = textNode.nodeValue;
      const fragment = doc.createDocumentFragment();
      let last = 0;
      value.replace(arrows, (match, offset) => {
        if (offset > last) fragment.appendChild(doc.createTextNode(value.slice(last, offset)));
        const mark = doc.createElement('span');
        mark.className = `luxury-direction-v2 ${variant(match)}`.trim();
        mark.setAttribute('aria-hidden', 'true');
        fragment.appendChild(mark);
        last = offset + match.length;
        return match;
      });
      if (last < value.length) fragment.appendChild(doc.createTextNode(value.slice(last)));
      textNode.parentNode.replaceChild(fragment, textNode);
    });

    body.dataset.luxuryDirections = 'true';
  };

  const locale = (() => {
    const lang = (root.lang || 'es').toLowerCase();
    if (lang.startsWith('ar')) return 'ar';
    if (lang.startsWith('fr')) return 'fr';
    if (lang.startsWith('en')) return 'en';
    return 'es';
  })();

  const prefix = locale === 'es' ? '' : `/${locale}`;

  const labels = {
    es: {
      seafood: 'Productos del mar', fish: 'Pescados', shellfish: 'Mariscos / Crustáceos',
      mediterranean: 'Del Mediterráneo', moruno: 'Moruno', cigala: 'Cigala', whitePrawn: 'Gamba blanca', tigerPrawn: 'Langostino tigre',
      cephalopods: 'Cefalópodos', fruitsVegetables: 'Frutas y hortalizas', fruits: 'Frutas', citrus: 'Cítricos', exoticFruit: 'Frutas exóticas', otherFruit: 'Otras frutas',
      vegetables: 'Hortalizas', seasonal: 'Temporada', seasonalSelection: 'Selección de temporada'
    },
    en: {
      seafood: 'Seafood', fish: 'Fish', shellfish: 'Shellfish / Crustaceans',
      mediterranean: 'Mediterranean', moruno: 'Moruno', cigala: 'Cigala', whitePrawn: 'Gamba blanca', tigerPrawn: 'Langostino tigre',
      cephalopods: 'Cephalopods', fruitsVegetables: 'Fruits & Vegetables', fruits: 'Fruit', citrus: 'Citrus', exoticFruit: 'Exotic fruit', otherFruit: 'Other fruit',
      vegetables: 'Vegetables', seasonal: 'Seasonal', seasonalSelection: 'Seasonal selection'
    },
    fr: {
      seafood: 'Produits de la mer', fish: 'Poissons', shellfish: 'Fruits de mer / Crustacés',
      mediterranean: 'Méditerranée', moruno: 'Moruno', cigala: 'Cigala', whitePrawn: 'Gamba blanca', tigerPrawn: 'Langostino tigre',
      cephalopods: 'Céphalopodes', fruitsVegetables: 'Fruits & légumes', fruits: 'Fruits', citrus: 'Agrumes', exoticFruit: 'Fruits exotiques', otherFruit: 'Autres fruits',
      vegetables: 'Légumes', seasonal: 'Produits de saison', seasonalSelection: 'Sélection de saison'
    },
    ar: {
      seafood: 'المأكولات البحرية', fish: 'الأسماك', shellfish: 'المأكولات البحرية / القشريات',
      mediterranean: 'من البحر المتوسط', moruno: 'Moruno', cigala: 'Cigala', whitePrawn: 'Gamba blanca', tigerPrawn: 'Langostino tigre',
      cephalopods: 'رأسيات الأرجل', fruitsVegetables: 'الفواكه والخضروات', fruits: 'الفواكه', citrus: 'الحمضيات', exoticFruit: 'الفواكه الاستوائية', otherFruit: 'فواكه أخرى',
      vegetables: 'الخضروات', seasonal: 'المنتجات الموسمية', seasonalSelection: 'اختيارات موسمية'
    }
  }[locale];

  const navProducts = doc.querySelector('.nav-products');
  const links = navProducts?.querySelector(':scope > .nav-products-links');

  if (navProducts && links && labels) {
    const current = suffix => path === `${prefix}/products/seafood/${suffix}/`;
    const seafoodOpen = current('fish') || current('shellfish') || current('cephalopods');

    links.innerHTML = `
      <details class="nav-seafood"${seafoodOpen ? ' open' : ''}>
        <summary>${labels.seafood}</summary>
        <div class="nav-products-links">
          <a href="${prefix}/products/seafood/fish/"${current('fish') ? ' aria-current="page"' : ''}>${labels.fish}</a>
          <details class="nav-shellfish">
            <summary>${labels.shellfish}</summary>
            <div class="nav-products-links nav-products-links--level-3">
              <details class="nav-shellfish-mediterranean">
                <summary>${labels.mediterranean}</summary>
                <div class="nav-products-links nav-products-links--level-4">
                  <span class="nav-product-leaf">${labels.moruno}</span>
                  <span class="nav-product-leaf">${labels.cigala}</span>
                  <span class="nav-product-leaf">${labels.whitePrawn}</span>
                  <span class="nav-product-leaf">${labels.tigerPrawn}</span>
                </div>
              </details>
            </div>
          </details>
          <a href="${prefix}/products/seafood/cephalopods/"${current('cephalopods') ? ' aria-current="page"' : ''}>${labels.cephalopods}</a>
        </div>
      </details>
      <details class="nav-produce">
        <summary>${labels.fruitsVegetables}</summary>
        <div class="nav-products-links">
          <details class="nav-fruits">
            <summary>${labels.fruits}</summary>
            <div class="nav-products-links nav-products-links--level-3">
              <span class="nav-product-leaf">${labels.citrus}</span>
              <span class="nav-product-leaf">${labels.exoticFruit}</span>
              <span class="nav-product-leaf">${labels.otherFruit}</span>
            </div>
          </details>
          <a href="${prefix}/products/vegetables/">${labels.vegetables}</a>
        </div>
      </details>
      <details class="nav-seasonal">
        <summary>${labels.seasonal}</summary>
        <div class="nav-products-links nav-products-links--level-3">
          <a href="${prefix}/products/seasonal/">${labels.seasonalSelection}</a>
        </div>
      </details>
    `;
    body.dataset.navNormalized = 'true';
  }

  normalizeDirectionalMarks();
})();
