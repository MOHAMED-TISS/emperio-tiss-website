import fs from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const read = (path) => fs.readFileSync(path, 'utf8');

test('Arabic normalizer maps the legacy page classes onto the ES classes', () => {
  const js = read('public/assets/js/ar/es-normalizer.js');
  for (const pair of [
    ['ar-page', 'es-page'],
    ['ar-hero', 'es-hero'],
    ['ar-section', 'es-section'],
    ['ar-grid', 'es-grid'],
    ['ar-card', 'es-card'],
    ['ar-cta', 'es-cta'],
    ['ar-footer', 'es-footer']
  ]) {
    assert.match(js, new RegExp(`['\"]${pair[0]}['\"]\\s*,\\s*['\"]${pair[1]}['\"]`));
  }
});

test('Arabic normalizer is owned and loaded by the AR layer', () => {
  const loader = read('public/assets/js/ar/loader.js');
  assert.match(loader, /\/assets\/js\/ar\/es-normalizer\.js/);
});

 test('shared core no longer loads the Arabic normalizer directly', () => {
  const globalCore = read('public/assets/js/global-core.js');
  assert.doesNotMatch(globalCore, /ar-es-normalizer\.js/);
});
