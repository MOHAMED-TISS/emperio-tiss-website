import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const sync = fs.readFileSync('public/assets/js/produce-image-sync.js', 'utf8');
const fruitsPage = fs.readFileSync('public/products/fruits/index.html', 'utf8');
const vegetablesPage = fs.readFileSync('public/products/vegetables/index.html', 'utf8');


test('produce image sync is loaded by both fruit and vegetable catalogues', () => {
  assert.match(fruitsPage, /produce-image-sync\.js/);
  assert.match(vegetablesPage, /produce-image-sync\.js/);
});

test('produce image sync reads the shared image manifest and only applies produce intake images', () => {
  assert.match(sync, /\/assets\/data\/product-images\.json/);
  assert.match(sync, /\/assets\/products\/fruits-vegetables\/incoming\//);
  assert.match(sync, /data-product-id/);
});

test('produce image sync supports galleries and keeps the primary image first', () => {
  assert.match(sync, /Array\.isArray\(entry\)/);
  assert.match(sync, /images\[0\]/);
  assert.match(sync, /product-card__image-count/);
});

test('produce image sync can update the custom citrus catalogue', () => {
  assert.match(sync, /citrus-family-block/);
  assert.match(sync, /citrus-product-image/);
});
