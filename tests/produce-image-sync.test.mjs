import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const sync = fs.readFileSync('public/assets/js/produce-image-sync.js', 'utf8');
const catalog = fs.readFileSync('public/assets/js/products-catalog.js', 'utf8');
const italianFish = fs.readFileSync('public/assets/js/fish-catalog-it-market.js', 'utf8');
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

test('all catalogue gallery implementations use natural filename ordering', () => {
  assert.match(sync, /naturalImageCompare/);
  assert.match(sync, /\.sort\(naturalImageCompare\)/);
  assert.match(catalog, /naturalImageCompare/);
  assert.match(catalog, /\.sort\(naturalImageCompare\)/);
  assert.match(italianFish, /naturalImageCompare/);
  assert.match(italianFish, /sortImages/);
});

test('natural ordering contract is base image, then numeric variants', () => {
  const natural = (a, b) => {
    const filename = value => String(value).split('/').pop().replace(/\.[^.]+$/, '').trim();
    const parse = value => {
      const match = value.match(/^(.*?)(?:\s*[-_ ]?\(?\s*(\d+)\s*\)?)?$/);
      return { base: (match?.[1] || value).trim().toLocaleLowerCase(), number: match?.[2] ? Number(match[2]) : 0, hasNumber: !!match?.[2] };
    };
    const left = parse(filename(a));
    const right = parse(filename(b));
    const baseCompare = left.base.localeCompare(right.base, undefined, { numeric: true, sensitivity: 'base' });
    if (baseCompare !== 0) return baseCompare;
    if (left.hasNumber !== right.hasNumber) return left.hasNumber ? 1 : -1;
    if (left.number !== right.number) return left.number - right.number;
    return filename(a).localeCompare(filename(b), undefined, { numeric: true, sensitivity: 'base' });
  };

  const input = ['Naranja 10.jpg', 'Naranja 2.jpg', 'Naranja.jpg', 'Naranja 1.jpg'];
  assert.deepEqual(input.sort(natural), ['Naranja.jpg', 'Naranja 1.jpg', 'Naranja 2.jpg', 'Naranja 10.jpg']);
});
