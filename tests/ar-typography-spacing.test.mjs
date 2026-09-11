import fs from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const read = (path) => fs.readFileSync(path, 'utf8');

test('Arabic typography uses Arabic font without inherited Latin tracking or uppercase transforms', () => {
  const js = read('public/assets/js/ar-es-normalizer.js');
  assert.match(js, /Noto Sans Arabic/);
  assert.match(js, /letter-spacing\s*:\s*0/);
  assert.match(js, /text-transform\s*:\s*none/);
});

test('Arabic display type has positive line-height and controlled word spacing', () => {
  const js = read('public/assets/js/ar-es-normalizer.js');
  assert.match(js, /line-height\s*:\s*1\.1/);
  assert.match(js, /word-spacing\s*:\s*0/);
});

test('Arabic catalogue titles and body copy use separate readable scales', () => {
  const js = read('public/assets/js/ar-es-normalizer.js');
  assert.match(js, /font-size:clamp\(2\.6rem,6vw,5\.4rem\)/);
  assert.match(js, /font-size:clamp\(1\.35rem,2\.6vw,2\.15rem\)/);
  assert.match(js, /font-size:clamp\(15px,1\.35vw,17px\)/);
});
