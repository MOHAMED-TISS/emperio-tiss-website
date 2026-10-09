import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const p = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(p) : [p];
});
const read = file => fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

test('the geography strap reads "From Madrid to the world" and never lists the Mediterranean as a market', () => {
  // owner decision 2026-10-09: the Mediterranean is a fishing ground (origin), not a market
  const oldStrap = /(Europa|Europe|Espagne|Spain|Spagna|España) · (África|Africa|Afrique)[^<'"\n]{0,30}· (Mediterr|Méditerran)|(EUROPA|EUROPE) · (ÁFRICA|AFRICA|AFRIQUE) · (MEDITERR|MÉDITERRAN)|أفريقيا · (البحر )?المتوسط/;
  for (const file of walk('public').filter(f => /\.(html|js|json)$/.test(f))) {
    assert.doesNotMatch(read(file), oldStrap, `${file} still lists the Mediterranean in the geography strap`);
  }
  const header = read('public/assets/js/header-universal.js');
  const footer = read('public/assets/js/footer-terminal.js');
  for (const strap of ['Desde Madrid al mundo', 'From Madrid to the world', 'De Madrid au monde', 'Da Madrid al mondo', 'من مدريد إلى العالم']) {
    assert.ok(header.includes(strap), `header strap missing: ${strap}`);
    assert.ok(footer.includes(strap), `footer strap missing: ${strap}`);
  }
});

test('every language shows the Spanish fish catalogue, no language-only references', () => {
  // owner decision 2026-10-09: the Spanish catalogue is universal (the Arabic-only frozen list was removed)
  const fish = read('public/assets/js/fish-catalog.js');
  assert.match(fish, /const allProducts = products\.map\(/);
  assert.doesNotMatch(fish, /frozenArProducts|frozenProducts|lang === 'ar' \?/);
  const block = fish.match(/const products = \[([\s\S]*?)\n  \];/)[1];
  const ids = [...block.matchAll(/\['([^']+)'/g)].map(m => m[1]);
  const spanish = JSON.parse(read('public/assets/data/catalogue-es-products.json')).categories['seafood/fish'];
  assert.deepEqual(ids, spanish);
  for (const id of ids) {
    const named = new RegExp(`(?:'${id}'|\\b${id}):\\{es:'[^']+',en:'[^']+',fr:'[^']+',it:'[^']+',ar:'[^']+'\\}`);
    assert.match(fish, named, `${id} needs a name in 5 languages`);
  }
  // technical values are translated outside Spanish (Arabic through ar/es-normalizer.js)
  for (const value of ['Blanco / semigraso', 'Azul / graso', 'Mediterráneo / Atlántico oriental']) {
    assert.ok(fish.includes(`'${value}':{en:`), `${value} needs EN/FR/IT translations`);
  }
  // the Frozen filter only shows when the Spanish set has frozen fish
  assert.match(fish, /if \(!allProducts\.some\(p => p\.condition\.includes\('Congelado'\)\)\)/);
  const ar = read('public/ar/products/seafood/fish/index.html');
  assert.doesNotMatch(ar, /ar-fish-gcc-note|طازجة ومجمدة/);
});
