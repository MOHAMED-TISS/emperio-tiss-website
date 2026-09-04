import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const js = fs.readFileSync('public/assets/js/fruit-catalog.js', 'utf8');
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
  assert.match(js, /Añadir al carrito|Add to cart|Ajouter au panier|Aggiungi al carrello/);
  assert.match(js, /is-focused/);
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
