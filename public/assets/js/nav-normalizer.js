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
    es: { seafood: 'Productos del mar', fruits: 'Frutas y hortalizas', seasonal: 'Temporada', fish: 'Pescados', shellfish: 'Mariscos', cephalopods: 'Cefalópodos' },
    en: { seafood: 'Seafood', fruits: 'Fruits & Vegetables', seasonal: 'Seasonal', fish: 'Fish', shellfish: 'Shellfish', cephalopods: 'Cephalopods' },
    fr: { seafood: 'Produits de la mer', fruits: 'Fruits & légumes', seasonal: 'Produits de saison', fish: 'Poissons', shellfish: 'Coquillages', cephalopods: 'Céphalopodes' },
    ar: { seafood: 'المأكولات البحرية', fruits: 'الفواكه والخضروات', seasonal: 'المنتجات الموسمية', fish: 'الأسماك', shellfish: 'المحاريات', cephalopods: 'رأسيات الأرجل' }
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
          <a href="${prefix}/products/seafood/shellfish/"${current('shellfish') ? ' aria-current="page"' : ''}>${labels.shellfish}</a>
          <a href="${prefix}/products/seafood/cephalopods/"${current('cephalopods') ? ' aria-current="page"' : ''}>${labels.cephalopods}</a>
        </div>
      </details>
      <a href="${prefix}/products/fruits/">${labels.fruits}</a>
      <a href="${prefix}/products/seasonal/">${labels.seasonal}</a>
    `;
    body.dataset.navNormalized = 'true';
  }

  normalizeDirectionalMarks();
})();
