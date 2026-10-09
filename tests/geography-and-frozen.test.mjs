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

test('frozen fish references are offered in every language, not only in Arabic', () => {
  const fish = read('public/assets/js/fish-catalog.js');
  assert.match(fish, /const allProducts = \[\.\.\.products, \.\.\.frozenProducts\]/);
  assert.doesNotMatch(fish, /frozenArProducts|lang === 'ar' \? frozen/);
  assert.doesNotMatch(fish, /data-fish-filter="frozen"\]'\)\.forEach/, 'the Frozen filter must not be hidden');
  const frozen = fish.match(/const frozenProducts = \[([\s\S]*?)\n  \];/)[1];
  const ids = [...frozen.matchAll(/\['([^']+)'/g)].map(m => m[1]);
  assert.equal(ids.length, 14);
  for (const id of ids) {
    assert.match(fish, new RegExp(`(?:'${id}'|\\b${id}):\\{es:'[^']+',en:'[^']+',fr:'[^']+',it:'[^']+',ar:'[^']+'\\}`), `${id} needs a name in 5 languages`);
  }
  // technical values are translated outside Spanish (Arabic through ar/es-normalizer.js)
  for (const value of ['Atlántico / abastecimiento español', 'Abastecimiento internacional vía España', 'Blanco / semigraso', 'Azul / graso']) {
    assert.ok(fish.includes(`'${value}':{en:`), `${value} needs EN/FR/IT translations`);
  }
  // EN/FR filters no longer lock Frozen to blue fish
  const filterFix = read('public/assets/js/en-catalog-filter-fix.js');
  assert.doesNotMatch(filterFix, /Only Salmon and Mackerel|Frozen is available only for Blue fish/);
  for (const lang of ['', 'en/', 'fr/', 'it/', 'ar/']) {
    assert.match(read(`public/${lang}products/seafood/fish/index.html`), /data-fish-filter="frozen"/);
  }
});
