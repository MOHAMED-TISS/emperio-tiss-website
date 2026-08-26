import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('public/products/seafood/fish/index.html', 'utf8');

test('fish page uses the premium editorial visual layer', () => {
  assert.match(html, /href="\/assets\/css\/fish-editorial\.css/);
  assert.match(html, /class="page-hero"/);
  assert.match(html, /class="fish-emblematic"/);
  assert.match(html, /class="fish-catalog"/);
});

test('fish page keeps the existing product catalogue hooks', () => {
  assert.match(html, /id="fishCatalogGrid"/);
  assert.match(html, /id="fishCatalogSearch"/);
  assert.match(html, /data-fish-filter="fresh"/);
  assert.match(html, /data-fish-category="white"/);
});

test('fish page does not rename the global navigation controls', () => {
  assert.match(html, /id="menuToggleBtn"/);
  assert.match(html, /id="navOverlay"/);
});
