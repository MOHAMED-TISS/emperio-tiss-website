import fs from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const read = (path) => fs.readFileSync(path, 'utf8');
const arabicRuntime = 'public/assets/js/ar/es-normalizer.js';

test('Arabic adapter enforces a 100vh hero on every page variant', () => {
  const js = read(arabicRuntime);
  assert.match(js, /min-height:100vh/);
  assert.match(js, /current-stage/);
  assert.match(js, /#newsApp/);
});

test('Arabic runtime owns catalogue lightbox interactions and preserves page scroll', () => {
  const js = read(arabicRuntime);
  assert.match(js, /market-catalogue-card__media/);
  assert.match(js, /fish-catalog-card__media/);
  assert.match(js, /preventDefault\(\)/);
  assert.match(js, /Escape/);
  assert.match(js, /body\.style\.overflow/);
});

test('Arabic runtime translates common catalogue and page values', () => {
  const js = read(arabicRuntime);
  for (const text of ['طازج', 'مجمد', 'حسب التوفر', 'حسب الوجهة', 'حسب السوق', 'المنشأ', 'الجودة', 'التعبئة', 'قانوني', 'إشعار قانوني']) {
    assert.match(js, new RegExp(text));
  }
});

test('Arabic runtime applies readable RTL type and spacing', () => {
  const js = read(arabicRuntime);
  assert.match(js, /font-family:/);
  assert.match(js, /font-size:/);
  assert.match(js, /line-height:/);
  assert.match(js, /letter-spacing:/);
  assert.match(js, /text-align:/);
});
