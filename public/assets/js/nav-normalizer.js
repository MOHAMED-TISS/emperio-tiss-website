(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const path = window.location.pathname.replace(/\/+$/, '/') || '/';

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
      seafood: 'Productos del mar',
      fruits: 'Frutas y hortalizas',
      seasonal: 'Temporada',
      fish: 'Pescados',
      shellfish: 'Mariscos',
      cephalopods: 'Cefalópodos'
    },
    en: {
      seafood: 'Seafood',
      fruits: 'Fruits & Vegetables',
      seasonal: 'Seasonal',
      fish: 'Fish',
      shellfish: 'Shellfish',
      cephalopods: 'Cephalopods'
    },
    fr: {
      seafood: 'Produits de la mer',
      fruits: 'Fruits & légumes',
      seasonal: 'Produits de saison',
      fish: 'Poissons',
      shellfish: 'Coquillages',
      cephalopods: 'Céphalopodes'
    },
    ar: {
      seafood: 'المأكولات البحرية',
      fruits: 'الفواكه والخضروات',
      seasonal: 'المنتجات الموسمية',
      fish: 'الأسماك',
      shellfish: 'المحاريات',
      cephalopods: 'رأسيات الأرجل'
    }
  }[locale];

  const navProducts = doc.querySelector('.nav-products');
  const links = navProducts?.querySelector(':scope > .nav-products-links');
  if (!navProducts || !links || !labels) return;

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
})();
