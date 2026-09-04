import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const js = fs.readFileSync('public/assets/js/fruit-catalog.js', 'utf8');
const citrus3d = fs.readFileSync('public/assets/js/citrus-3d.js', 'utf8');
const page = fs.readFileSync('public/products/fruits/index.html', 'utf8');
const data = JSON.parse(fs.readFileSync('public/assets/data/fruit-catalog-v1.json', 'utf8'));

test('citrus catalogue exposes the premium interactive structure', () => {
  assert.match(js, /citrus-orchard/);
  assert.match(js, /citrus-family-switcher/);
  assert.match(js, /citrus-technical/);
  assert.match(js, /citrus-campaign/);
  assert.match(js, /data-citrus-variety/);
});

test('citrus presenter is a real interactive 3D canvas layer', () => {
  assert.match(citrus3d, /canvas/);
  assert.match(citrus3d, /webgl/i);
  assert.match(citrus3d, /citrus-3d/);
  assert.match(citrus3d, /requestAnimationFrame/);
  assert.match(citrus3d, /pointermove/);
});

test('fruit page loads the catalogue renderer before the citrus 3D presenter', () => {
  assert.match(page, /products-catalog\.js/);
  assert.match(page, /fruit-catalog\.js/);
  assert.match(page, /citrus-3d\.js/);
  assert.ok(page.indexOf('products-catalog.js') < page.indexOf('fruit-catalog.js'));
  assert.ok(page.indexOf('fruit-catalog.js') < page.indexOf('citrus-3d.js'));
});

test('mandarinas include Berkane', () => {
  const mandarina = data.products.find((product) => product.id === 'mandarina');
  assert.ok(mandarina);
  assert.ok(mandarina.varieties.includes('Berkane'));
});
