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

test('Arabic pages remain RTL and do not load the obsolete Arabic stylesheet', () => {
  for (const file of arPages) {
    const html = read(file);
    assert.match(html, /lang="ar"\s+dir="rtl"/i, `${file} must be Arabic RTL`);
    assert.doesNotMatch(html, /ar-pages\.css/i, `${file} must not load the obsolete Arabic page stylesheet`);
  }
});

test('Arabic visual adapter only handles RTL and Arabic typography', () => {
  const css = read('public/assets/css/ar-visual.css');
  assert.match(css, /Arabic adapter for the canonical Spanish page design/i);
  assert.doesNotMatch(css, /background\s*:/i);
  assert.doesNotMatch(css, /min-height\s*:/i);
  assert.doesNotMatch(css, /grid-template-columns/i);
  assert.doesNotMatch(css, /--ar-/i);
});

test('Arabic runtime normalizer maps legacy AR classes to the ES classes', () => {
  const js = read('public/assets/js/ar-es-normalizer.js');
  for (const pair of [
    ['ar-page', 'es-page'],
    ['ar-hero', 'es-hero'],
    ['ar-section', 'es-section'],
    ['ar-grid', 'es-grid'],
    ['ar-card', 'es-card'],
    ['ar-cta', 'es-cta'],
    ['ar-footer', 'es-footer']
  ]) {
    assert.match(js, new RegExp(`['\"]${pair[0]}['\"]\\s*,\\s*['\"]${pair[1]}['\"]`));
  }
});

test('Arabic generic content pages expose the ES page body class', () => {
  for (const file of [
    'public/ar/about/index.html',
    'public/ar/contact/index.html',
    'public/ar/products/seafood/index.html',
    'public/ar/products/fruits/index.html',
    'public/ar/products/vegetables/index.html',
    'public/ar/products/seasonal/index.html'
  ]) {
    const html = read(file);
    assert.match(html, /class="[^"]*ar-page[^"]*"/i, `${file} must retain AR page marker`);
  }
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

test('Arabic content does not name countries, cities, or regions as target markets or destinations', () => {
  const forbidden = [
    'إسبانيا','فرنسا','إيطاليا','ألمانيا','هولندا','المغرب','تونس','موريتانيا',
    'السعودية','الإمارات','قطر','الكويت','البحرين','عُمان','الأردن','لبنان',
    'مصر','ليبيا','الجزائر','تركيا','العراق','سوريا','مدريد',
    'إسبانيا عبر','السوق السعودي','الأسواق الخليجية','دول الخليج',
    'عبر إسبانيا','التصدير الإسبانية'
  ];
  const targetFiles = arPages.filter((file) => !file.endsWith('/markets/index.html'));
  for (const file of targetFiles) {
    const html = read(file);
    for (const term of forbidden) {
      assert.doesNotMatch(html, new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `${file} must not contain target geography term: ${term}`);
    }
  }
});
