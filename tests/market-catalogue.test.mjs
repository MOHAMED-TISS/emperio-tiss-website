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

test('priority IDs exist in the complete B2B catalogue', () => {
  const ids = new Set(catalog.products.map(p => p.id));
  for (const category of categories) {
    for (const locale of locales) {
      for (const id of config.priority[category]?.[locale] || []) {
        assert.ok(ids.has(id), `${category}/${locale} references unknown product ${id}`);
      }
    }
  }
});

test('renderer uses the complete catalogue and handles legacy fruit subcategories', () => {
  assert.match(renderer, /CATALOG_URL = '\/assets\/data\/catalog\.json'/);
  assert.match(renderer, /new Set\(\['fruits','citrus','exotics','core-produce'\]\)/);
});

test('international shell applies the Spanish category CSS baseline and seafood navigation', () => {
  assert.match(shellRenderer, /seafood-category-nav/);
  assert.match(shellRenderer, /seafood-subpages-es\.css/);
  assert.match(shellRenderer, /produce-es\.css/);
  assert.match(shellRenderer, /fish-editorial\.css/);
  assert.match(shellRenderer, /body\.classList\.add\('market-catalogue-page'\)/);
});

test('international product heroes are rebuilt from the Spanish page-hero architecture', () => {
  assert.match(shellRenderer, /hero\.classList\.remove\('product-hero'\)/);
  assert.match(shellRenderer, /hero\.classList\.add\('page-hero','market-page-hero'\)/);
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
  assert.match(css, /width:min\(1240px,calc\(100% - 48px\)\)/);
  assert.match(css, /grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(css, /border-radius:18px/);
  assert.match(css, /html\[dir=rtl\]/);
  assert.match(css, /@media\(max-width:850px\)/);
  assert.match(css, /@media\(max-width:560px\)/);
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
