import fs from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const read = (path) => fs.readFileSync(path, 'utf8');

test('Arabic typography uses Arabic font without inherited Latin tracking or uppercase transforms', () => {
  const css = read('public/assets/css/ar-visual.css');
  assert.match(css, /Noto Sans Arabic/);
  assert.match(css, /letter-spacing:\s*0 !important/);
  assert.match(css, /text-transform:\s*none !important/);
});

test('Arabic display type has positive line-height and controlled word spacing', () => {
  const css = read('public/assets/css/ar-visual.css');
  assert.match(css, /line-height:\s*1\.08\s*!important/);
  assert.match(css, /word-spacing:\s*0\s*!important/);
});

test('Arabic catalogue titles and body copy use separate readable scales', () => {
  const js = read('public/assets/js/ar-es-normalizer.js');
  assert.match(js, /font-size:clamp\(2\.6rem,6vw,5\.4rem\)/);
  assert.match(js, /font-size:clamp\(1\.35rem,2\.6vw,2\.15rem\)/);
  assert.match(js, /font-size:clamp\(15px,1\.35vw,17px\)/);
});
