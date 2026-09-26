import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('public/products/seafood/fish/index.html', 'utf8');
const headerCss = fs.readFileSync('public/assets/css/header-final.css', 'utf8');
const globalCss = fs.readFileSync('public/assets/css/global.css', 'utf8');

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

test('fish catalogue does not override the shared branded header', () => {
  assert.doesNotMatch(headerCss, /\.fish-catalog-pilot \.site-header\s*\{/);
  assert.match(headerCss, /(^|\n)\.site-header\s*\{/);
  assert.equal((headerCss.match(/(^|\n)\.site-header\s*\{/g) || []).length, 1);
  assert.doesNotMatch(headerCss, /--et-pill-/);
});

test('global design tokens use the approved EMPERIO TISS palette and motion system', () => {
  for (const token of ['#0B1E33', '#F4F0E6', '#C9A24B', '#2C8C86', '#7A8B5C', '#C08A3E']) {
    assert.match(globalCss, new RegExp(token, 'i'));
  }
  assert.match(globalCss, /cubic-bezier\(0\.16,\s*1,\s*0\.3,\s*1\)/);
  assert.match(globalCss, /cubic-bezier\(0\.65,\s*0,\s*0\.35,\s*1\)/);
  assert.doesNotMatch(globalCss, /#03140f|#061b14|#0d2c21|#10251c/i);
});
