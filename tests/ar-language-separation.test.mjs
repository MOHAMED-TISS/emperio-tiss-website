import fs from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const read = (path) => fs.readFileSync(path, 'utf8');

const arPages = [
  'public/ar/index.html',
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

test('AR-specific asset paths exist', () => {
  for (const file of [
    'public/assets/css/ar/visual.css',
    'public/assets/css/ar/home.css',
    'public/assets/css/ar/pages.css',
    'public/assets/css/ar/catalogues.css',
    'public/assets/js/ar/loader.js'
  ]) assert.ok(fs.existsSync(file), `${file} must exist`);
});

test('Arabic pages reference the new AR layer', () => {
  for (const file of arPages) {
    const html = read(file);
    assert.match(html, /\/assets\/css\/ar\//, `${file} must reference AR CSS`);
  }
});

test('AR runtime adapters live under the AR namespace', () => {
  for (const file of [
    'public/assets/js/ar/es-normalizer.js',
    'public/assets/js/ar/content-geography.js'
  ]) assert.ok(fs.existsSync(file), `${file} must exist`);
});

test('shared runtime does not directly reference obsolete AR asset filenames', () => {
  const core = read('public/assets/js/global-core.js');
  assert.doesNotMatch(core, /\/assets\/js\/ar-es-normalizer\.js/);
  assert.doesNotMatch(core, /\/assets\/js\/ar-content-neutralizer\.js/);
});
