(() => {
  'use strict';
  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  if (!body) return;

  const lang = (root.lang || 'es').slice(0, 2).toLowerCase();
  const nav = {
    es: { prefix: '', seafood: 'Productos del mar', fish: 'Pescados', shellfish: 'Mariscos', cephalopods: 'Cefalópodos', fruits: 'Frutas', vegetables: 'Hortalizas', seasonal: 'Temporada' },
    en: { prefix: '/en', seafood: 'Seafood', fish: 'Fish', shellfish: 'Shellfish', cephalopods: 'Cephalopods', fruits: 'Fruits', vegetables: 'Vegetables', seasonal: 'Seasonal' },
    fr: { prefix: '/fr', seafood: 'Produits de la mer', fish: 'Poissons', shellfish: 'Coquillages', cephalopods: 'Céphalopodes', fruits: 'Fruits', vegetables: 'Légumes', seasonal: 'Produits de saison' },
    ar: { prefix: '/ar', seafood: 'المأكولات البحرية', fish: 'الأسماك', shellfish: 'المحاريات', cephalopods: 'رأسيات الأرجل', fruits: 'الفواكه', vegetables: 'الخضروات', seasonal: 'المنتجات الموسمية' }
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

  const normalize = (productsLinks) => {
    if (!productsLinks || productsLinks.dataset.canonicalNav === 'true') return;
    productsLinks.dataset.canonicalNav = 'true';
    productsLinks.innerHTML = '';

    const seafood = doc.createElement('details');
    seafood.className = 'nav-seafood';
    if (/\/products\/seafood\/(fish|shellfish|cephalopods)\/$/.test(path)) seafood.open = true;

    const summary = doc.createElement('summary');
    summary.textContent = nav.seafood;
    seafood.appendChild(summary);

    const seafoodLinks = doc.createElement('div');
    seafoodLinks.className = 'nav-products-links nav-seafood-links';
    seafoodLinks.appendChild(makeLink(nav.fish, '/products/seafood/fish/'));
    seafoodLinks.appendChild(makeLink(nav.shellfish, '/products/seafood/shellfish/'));
    seafoodLinks.appendChild(makeLink(nav.cephalopods, '/products/seafood/cephalopods/'));
    seafood.appendChild(seafoodLinks);

    productsLinks.appendChild(seafood);
    productsLinks.appendChild(makeLink(nav.fruits, '/products/fruits/'));
    productsLinks.appendChild(makeLink(nav.vegetables, '/products/vegetables/'));
    productsLinks.appendChild(makeLink(nav.seasonal, '/products/seasonal/'));
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
