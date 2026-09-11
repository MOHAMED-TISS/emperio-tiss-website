import fs from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const read = (path) => fs.readFileSync(path, 'utf8');

test('AR-specific asset paths exist', () => {
  for (const file of [
    'public/assets/css/ar/visual.css',
    'public/assets/css/ar/home.css',
    'public/assets/css/ar/pages.css',
    'public/assets/css/ar/catalogues.css',
    'public/assets/js/ar/loader.js',
    'public/assets/js/ar/es-normalizer.js',
    'public/assets/js/ar/content-geography.js'
  ]) assert.ok(fs.existsSync(file), `${file} must exist`);
});

test('the Arabic loader owns the AR entry points', () => {
  const loader = read('public/assets/js/ar/loader.js');
  for (const href of [
    '/assets/css/ar/visual.css',
    '/assets/css/ar/home.css',
    '/assets/css/ar/pages.css',
    '/assets/css/ar/catalogues.css'
  ]) assert.match(loader, new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(loader, /\/assets\/js\/ar\/es-normalizer\.js/);
  assert.match(loader, /\/assets\/js\/ar\/content-geography\.js/);
});

test('shared runtime routes Arabic presentation through the AR loader', () => {
  const global = read('public/assets/js/global.js');
  assert.match(global, /loadScript\('\/assets\/js\/ar\/loader\.js\?v=20260912-ar-separation-1', 'etArLayerLoader'\)/);
  assert.doesNotMatch(global, /\/assets\/css\/ar-visual\.css/);
});

test('shared runtime no longer owns obsolete Arabic adapters', () => {
  const core = read('public/assets/js/global-core.js');
  assert.doesNotMatch(core, /\/assets\/js\/ar-es-normalizer\.js/);
  assert.doesNotMatch(core, /\/assets\/js\/ar-content-neutralizer\.js/);
});

test('Arabic geography adapter keeps commercial targeting regional', () => {
  const geography = read('public/assets/js/ar/content-geography.js');
  assert.match(geography, /const MENA = 'منطقة الشرق الأوسط وشمال أفريقيا \(MENA\)'/);
  assert.match(geography, /السوق السعودي/g);
  assert.match(geography, /دول الخليج/g);
  assert.match(geography, /إسبانيا · فرنسا · إيطاليا · ألمانيا · هولندا/g);
  assert.doesNotMatch(geography, /element\.textContent\s*=/);
});
