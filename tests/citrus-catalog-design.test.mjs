import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const js = fs.readFileSync('public/assets/js/fruit-catalog.js', 'utf8');
const css = fs.readFileSync('public/assets/css/citrus-catalog.css', 'utf8');
const page = fs.readFileSync('public/products/fruits/index.html', 'utf8');
const data = JSON.parse(fs.readFileSync('public/assets/data/fruit-catalog-v1.json', 'utf8'));

test('citrus catalogue keeps the premium interactive structure', () => {
  assert.match(js, /citrus-orchard/);
  assert.match(js, /citrus-family-switcher/);
  assert.match(js, /citrus-technical/);
  assert.match(js, /citrus-campaign/);
  assert.match(js, /data-citrus-variety/);
});

test('citrus orchard uses a real tree image and three product hotspots', () => {
  assert.match(js, /images\.unsplash\.com\/photo-/);
  assert.match(js, /citrus-hotspot--top/);
  assert.match(js, /citrus-hotspot--left/);
  assert.match(js, /citrus-hotspot--right/);
  assert.match(js, /is-focused/);
});

test('citrus popovers no longer expose retail price or cart UI', () => {
  assert.doesNotMatch(js, /citrus-popover-price/);
  assert.doesNotMatch(js, /citrus-cart-button/);
  assert.doesNotMatch(js, /Añadir al carrito|Add to cart|Ajouter au panier|Aggiungi al carrello/);
});

test('citrus visual system reserves enough space and readable type for the tree and cards', () => {
  assert.match(css, /citrus-tree-scene\{[^}]*min-height:760px/);
  assert.match(css, /citrus-tree-title strong\{[^}]*font:[^}]*1\.35rem/);
  assert.match(css, /citrus-product-popover>strong\{[^}]*font:[^}]*1\.9rem/);
  assert.match(css, /citrus-popover-copy\{[^}]*font:[^}]*\.78rem/);
  assert.match(css, /citrus-product-popover\{[^}]*background:#fff/);
  assert.match(css, /citrus-hotspot-label\{[^}]*text-shadow/);
});

test('fruit page loads the catalogue renderer before the fruit presenter', () => {
  assert.match(page, /products-catalog\.js/);
  assert.match(page, /fruit-catalog\.js/);
  assert.ok(page.indexOf('products-catalog.js') < page.indexOf('fruit-catalog.js'));
});

test('mandarinas include Berkane', () => {
  const mandarina = data.products.find((product) => product.id === 'mandarina');
  assert.ok(mandarina);
  assert.ok(mandarina.varieties.includes('Berkane'));
});
