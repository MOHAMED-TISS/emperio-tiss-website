import fs from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const config = JSON.parse(fs.readFileSync('public/assets/data/catalogue-market-priority.json',
  'utf8'));
const renderer = fs.readFileSync('public/assets/js/market-catalogue.js', 'utf8');
const shellRenderer = fs.readFileSync('public/assets/js/market-catalogue-shell.js', 'utf8');
const css = fs.readFileSync('public/assets/css/catalogue-market-unified.css', 'utf8');
const shell = fs.readFileSync('public/assets/js/international-shell.js', 'utf8');
const catalog = JSON.parse(fs.readFileSync('public/assets/data/catalog.json', 'utf8'));
const extendedCatalog = JSON.parse(fs.readFileSync('public/assets/data/catalog-v1.3.json', 'utf8'));
const spanishSet = JSON.parse(fs.readFileSync('public/assets/data/catalogue-es-products.json', 'utf8'));
const fishRenderer = fs.readFileSync('public/assets/js/fish-catalog.js', 'utf8');
const shellfishEs = JSON.parse(fs.readFileSync('public/assets/data/shellfish-catalog-es.json', 'utf8'));
const cephalopodsEs = JSON.parse(fs.readFileSync('public/assets/data/cephalopods-catalog-es.json', 'utf8'));
const fruitsEs = JSON.parse(fs.readFileSync('public/assets/data/fruit-catalog-v1.json', 'utf8'));

const categories = ['seafood/fish', 'seafood/shellfish', 'seafood/cephalopods', 'produce/fruits',
  'produce/vegetables'
];
const locales = ['es', 'en', 'fr', 'it', 'ar'];

test('market priority defines every target category for every international locale', () => {
  for (const category of categories) {
    for (const locale of ['en', 'fr', 'it', 'ar']) {
      assert.ok(Array.isArray(config.priority[category]?.[locale]),
        `${category}/${locale} priority missing`);
    }
  }
});

test('every locale is an exact permutation of the visible Spanish catalogue set', () => {
  for (const category of categories) {
    const expected = spanishSet.categories[category] || [];
    assert.ok(expected.length, `${category} Spanish authority set missing`);
    const expectedSorted = [...expected].sort();
    for (const locale of locales) {
      const actual = config.priority[category]?.[locale] || [];
      assert.equal(actual.length, expected.length, `${category}/${locale} product count differs from ES`);
      assert.deepEqual([...new Set(actual)].sort(), expectedSorted,
        `${category}/${locale} must contain exactly the Spanish catalogue products`);
    }
  }
});

test('Spanish authority manifest matches the products actually rendered on ES catalogue pages', () => {
  const fishBlock = fishRenderer.match(/const products = \[([\s\S]*?)\n  \];\n\n  const frozenArProducts/);
  assert.ok(fishBlock, 'Spanish fish product list not found');
  const visibleFish = [...fishBlock[1].matchAll(/\[\s*'([^']+)'/g)].map(match => match[1]);
  assert.deepEqual(spanishSet.categories['seafood/fish'], visibleFish);

  assert.deepEqual(spanishSet.categories['seafood/shellfish'],
    (shellfishEs.products || []).map(p => p.id));
  assert.deepEqual(spanishSet.categories['seafood/cephalopods'],
    (cephalopodsEs.products || []).map(p => p.id));
  assert.deepEqual(spanishSet.categories['produce/fruits'],
    (fruitsEs.products || []).map(p => p.id));

  const visibleVegetables = (extendedCatalog.products || [])
    .filter(p => p.family === 'produce' && p.subcategory === 'vegetables' && p.status === 'active')
    .map(p => p.id);
  assert.deepEqual(spanishSet.categories['produce/vegetables'], visibleVegetables);
});

test('every Spanish catalogue product resolves to master commercial data', () => {
  const ids = new Set([
    ...(catalog.products || []).map(p => p.id),
    ...(extendedCatalog.products || []).map(p => p.id)
  ]);
  for (const category of categories) {
    for (const id of spanishSet.categories[category] || []) {
      const dataId = spanishSet.dataAliases?.[id] || id;
      assert.ok(ids.has(dataId), `${category} Spanish product ${id} has no master data source`);
    }
  }
});

test('renderer uses the Spanish catalogue set as product authority and market priority only for sorting', () => {
  assert.match(renderer, /ES_SET_URL\s*=\s*'\/assets\/data\/catalogue-es-products\.json'/);
  assert.match(renderer, /spanishIds\s*=\s*esSet\?\.categories/);
  assert.match(renderer, /dataAliases/);
  assert.match(renderer, /marketOrder/);
  assert.match(renderer, /sourceIndex/);
});

test('international shell applies the Spanish category CSS baseline and seafood navigation', () => {
  assert.match(shellRenderer, /seafood-category-nav/);
  assert.match(shellRenderer, /seafood-subpages-es\.css/);
  assert.match(shellRenderer, /produce-es\.css/);
  assert.match(shellRenderer, /fish-editorial\.css/);
  assert.match(shellRenderer, /body\.classList\.add\(\s*'market-catalogue-page'\s*\)/);
});

test('international product heroes are rebuilt from the Spanish page-hero architecture', () => {
  assert.match(shellRenderer, /hero\.classList\.remove\(\s*'product-hero'\s*\)/);
  assert.match(shellRenderer, /hero\.classList\.add\(\s*'page-hero'\s*,\s*'market-page-hero'\s*\)/);
  assert.match(shellRenderer, /page-hero-inner/);
  assert.match(shellRenderer, /heroes\[subcategory\]/);
  assert.match(shellRenderer, /t\.produce\[subcategory\]/);
  assert.match(shellRenderer, /Fishing_Boat_on_the_Sea\.jpg/);
});

test('renderer is language-aware and supports RTL', () => {
  assert.match(renderer, /lang === 'ar'/);
  assert.match(renderer, /document\.documentElement\.classList\.add/);
  assert.match(renderer, /market-catalogue/);
});

test('international shell loads the shared catalogue layers', () => {
  assert.match(shell, /market-catalogue-shell\.js/);
  assert.match(shell, /market-catalogue\.js/);
  assert.match(shell, /data-etMarketCatalogueShell/);
  assert.match(shell, /data-etMarketCatalogue/);
});

test('unified catalogue CSS matches Spanish catalogue geometry and contains RTL/responsive rules',
() => {
  assert.match(css, /width:\s*min\(1240px\s*,\s*calc\(100%\s*-\s*48px\)\)/);
  assert.match(css, /grid-template-columns:\s*repeat\(3\s*,\s*minmax\(0\s*,\s*1fr\)\)/);
  assert.match(css, /border-radius:\s*18px/);
  assert.match(css, /html\[dir=rtl\]/);
  assert.match(css, /@media\(max-width\s*:\s*850px\)/);
  assert.match(css, /@media\(max-width\s*:\s*560px\)/);
});

test('natural image ordering contract is numeric and base-first', () => {
  const file = value => String(value).split('/').pop().replace(/\.[^.]+$/, '').trim();
  const compare = (a, b) => {
    const parse = value => {
      const f = file(value);
      const m = f.match(/^(.*?)(?:\s*[-_ ]?\(?\s*(\d+)\s*\)?)?$/);
      return {
        base: (m?.[1] || f).trim(),
        n: m?.[2] ? Number(m[2]) : 0,
        numbered: !!m?.[2]
      };
    };
    const x = parse(a),
      y = parse(b);
    const base = x.base.localeCompare(y.base, undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    if (base) return base;
    if (x.numbered !== y.numbered) return x.numbered ? 1 : -1;
    return x.n - y.n;
  };
  const input = ['Naranja 10.jpg', 'Naranja 2.jpg', 'Naranja.jpg', 'Naranja 1.jpg'];
  assert.deepEqual(input.sort(compare), ['Naranja.jpg', 'Naranja 1.jpg', 'Naranja 2.jpg',
    'Naranja 10.jpg'
  ]);
});

test('Italian catalogue translates Spanish technical values in the shared renderer', () => {
  assert.match(renderer, /itTechnicalTranslations/);
  assert.match(renderer, /Mediterraneo \/ secondo disponibilità/);
  assert.match(renderer, /Secondo disponibilità/);
  assert.match(renderer, /Specifica professionale/);
  assert.match(renderer, /Intero \/ secondo destinazione/);
  assert.match(renderer, /Secondo requisiti della destinazione/);
  assert.match(renderer, /Secondo mercato/);
});


test('international shell gates market catalogue runtime to catalogue routes', () => {
  assert.match(shell, /marketCataloguePath/);
  assert.match(shell, /if \(marketCataloguePath\)/);
});
