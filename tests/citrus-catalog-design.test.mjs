import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const js = fs.readFileSync('public/assets/js/fruit-catalog.js', 'utf8');
const baseCss = fs.readFileSync('public/assets/css/citrus-catalog.css', 'utf8');
const overridesCss = fs.readFileSync('public/assets/css/citrus-catalog-overrides.css', 'utf8');
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

test('citrus presentation keeps the image dominant and moves all navigation below it', () => {
  assert.match(overridesCss, /fruit-special-shell\{[^}]*display:grid !important/);
  assert.match(overridesCss, /citrus-orchard\{display:contents !important/);
  assert.match(overridesCss, /citrus-botanical\{[^}]*grid-column:1 !important;grid-row:2 !important/);
  assert.match(overridesCss, /citrus-selection\{[^}]*position:static !important/);
  assert.match(overridesCss, /citrus-selection::before\{[^}]*VARIEDADES \/ REFERENCIAS/);
  assert.match(overridesCss, /citrus-family-switcher\{[^}]*grid-row:4 !important/);
  assert.match(overridesCss, /citrus-detail\{[^}]*grid-row:5 !important/);
  assert.match(overridesCss, /citrus-tree-scene::after\{[^}]*REFERENCIAS · VER DEBAJO/);
  assert.match(overridesCss, /citrus-hotspot-label\{[^}]*opacity:0 !important/);
  assert.match(overridesCss, /citrus-popover-price[^}]*display:none !important/);
  assert.match(overridesCss, /citrus-cart-button[^}]*display:none !important/);
  assert.match(page, /citrus-catalog-overrides\.css\?v=20260904\.6/);
  assert.match(baseCss, /background:#f9f6f0/);
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
