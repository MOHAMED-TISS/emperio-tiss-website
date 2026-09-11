import fs from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const read = (path) => fs.readFileSync(path, 'utf8');

test('Arabic adapter enforces a 100vh hero without owning page geometry', () => {
  const js = read('public/assets/js/ar-es-normalizer.js');
  assert.match(js, /min-height\s*[:=]\s*['"]?100vh/);
});

test('Arabic runtime owns catalogue lightbox interactions and preserves page scroll', () => {
  const js = read('public/assets/js/ar-es-normalizer.js');
  assert.match(js, /market-catalogue-card__media/);
  assert.match(js, /fish-catalog-card__media/);
  assert.match(js, /preventDefault\(\)/);
  assert.match(js, /Escape/);
  assert.match(js, /overflow\s*=/);
});

test('Arabic runtime translates common catalogue technical values', () => {
  const js = read('public/assets/js/ar-es-normalizer.js');
  for (const text of ['طازج', 'مجمد', 'حسب التوفر', 'حسب الوجهة', 'حسب السوق', 'المنشأ', 'الجودة', 'التعبئة']) {
    assert.match(js, new RegExp(text));
  }
});

test('Arabic runtime applies readable RTL catalogue type and spacing', () => {
  const js = read('public/assets/js/ar-es-normalizer.js');
  assert.match(js, /fontSize/);
  assert.match(js, /lineHeight/);
  assert.match(js, /letterSpacing/);
  assert.match(js, /textAlign/);
});
