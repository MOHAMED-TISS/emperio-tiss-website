import fs from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const read = (path) => fs.readFileSync(path, 'utf8');
const arPages = [
  'public/ar/about/index.html',
  'public/ar/contact/index.html',
  'public/ar/markets/index.html',
  'public/ar/news/index.html',
  'public/ar/products/index.html',
  'public/ar/products/seafood/index.html',
  'public/ar/products/seafood/fish/index.html',
  'public/ar/products/seafood/shellfish/index.html',
  'public/ar/products/seafood/cephalopods/index.html',
  'public/ar/products/fruits/index.html',
  'public/ar/products/vegetables/index.html',
  'public/ar/products/seasonal/index.html'
];

test('Arabic page system uses the Spanish page design baseline', () => {
  for (const file of arPages) {
    const html = read(file);
    assert.match(html, /lang="ar"\s+dir="rtl"/i, `${file} must be Arabic RTL`);
    assert.doesNotMatch(html, /ar-pages\.css/i, `${file} must not load the obsolete Arabic page stylesheet`);
  }
});

test('Arabic visual adapter only handles RTL and never replaces Spanish geometry', () => {
  const css = read('public/assets/css/ar-visual.css');
  assert.match(css, /Arabic adapter for the canonical Spanish page design/i);
  assert.doesNotMatch(css, /background\s*:/i);
  assert.doesNotMatch(css, /min-height\s*:/i);
  assert.doesNotMatch(css, /grid-template-columns/i);
  assert.doesNotMatch(css, /--ar-/i);
});

test('Arabic pages explicitly inherit the same Spanish visual layer as their counterparts', () => {
  const filesUsingEsPage = [
    'public/ar/about/index.html',
    'public/ar/contact/index.html',
    'public/ar/products/seafood/index.html'
  ];
  for (const file of filesUsingEsPage) {
    const html = read(file);
    assert.match(html, /class="es-page[^\"]*"/i, `${file} must use the ES page body class`);
    assert.match(html, /\/assets\/css\/es-pages\.css/i, `${file} must load ES page CSS`);
  }
});

test('Arabic canonical header is single-source and not loaded twice', () => {
  const global = read('public/assets/js/global.js');
  assert.match(global, /querySelectorAll\(['"]link\[href\*=['"]header-final\.css/i);
});

test('Arabic Products landing mirrors the Spanish product structure', () => {
  const html = read('public/ar/products/index.html');
  assert.match(html, /body class="home-page ar-home ar-products-page"/);
  assert.equal((html.match(/class="product-row"/g) || []).length, 4);
  assert.match(html, /class="products-section"/);
  assert.match(html, /class="markets-section"/);
  assert.match(html, /class="company-section"/);
  assert.match(html, /class="contact-section"/);
});
