import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// The EN / FR / IT / AR Homes are generated from the ES Home by tools/localize-home.cjs.
const es = fs.readFileSync('public/index.html', 'utf8');
const copy = JSON.parse(fs.readFileSync('public/assets/i18n/home.json', 'utf8'));
const body = html => html.slice(html.indexOf('<body')).replace(/<script\b[\s\S]*?<\/script>/g, '');
const KEEP = new Set(['ES', 'EN', 'FR', 'IT', 'AR', 'Signature', 'I', 'II', 'III', 'EMPERIO TISS', 'EMPERIO SIGNATURE', 'info@emperio-tiss.com']);

test('every piece of ES Home copy has a translation', () => {
  const texts = [...body(es).matchAll(/>([^<>]+)</g)].map(m => m[1].trim())
    .concat([...body(es).matchAll(/(?:aria-label|alt|data-label)="([^"]*)"/g)].map(m => m[1].trim()))
    .filter(t => t && /\p{L}/u.test(t) && !KEEP.has(t));
  const missing = [...new Set(texts)].filter(t => !copy.text[t]);
  assert.deepEqual(missing, [], 'add these to public/assets/i18n/home.json, then run node tools/localize-home.cjs');
  for (const [key, value] of Object.entries(copy.text)) assert.equal(value.length, 4, `${key} needs en, fr, it, ar`);
});

test('localized Homes carry the 2026 sections, stylesheets and map', () => {
  const esSheets = [...es.slice(0, es.indexOf('<body')).matchAll(/href="(\/assets\/css\/[^"?]+)/g)].map(m => m[1]);
  for (const lang of ['en', 'fr', 'it', 'ar']) {
    const html = fs.readFileSync(`public/${lang}/index.html`, 'utf8');
    for (const hook of ['home-selection-redesign', 'ets-steps', 'ets-atlas', 'home-signature-v2']) {
      assert.match(html, new RegExp(`class="[^"]*${hook}`), `${lang}: ${hook}`);
    }
    const sheets = [...html.slice(0, html.indexOf('<body')).matchAll(/href="(\/assets\/css\/[^"?]+)/g)].map(m => m[1]);
    assert.deepEqual(sheets.filter(s => s !== '/assets/css/home-ar-2026.css'), esSheets, `${lang}: same stylesheets, same order as ES`);
    assert.match(html, new RegExp(`/assets/images/markets/atlas-2026-${lang}\\.svg`));
    assert.ok(fs.existsSync(`public/assets/images/markets/atlas-2026-${lang}.svg`));
    assert.doesNotMatch(body(html), /href="\/(?:about|products|markets|news|contact|private)\//, `${lang}: internal links stay in ${lang}`);
  }
  assert.match(fs.readFileSync('public/ar/index.html', 'utf8'), /home-ar-2026\.css/);
});

test('the selection marquee speaks every Home language', () => {
  const js = fs.readFileSync('public/assets/js/home-es-navigation-pilot.js', 'utf8');
  assert.doesNotMatch(js, /!==\s*'es'\)\s*return/);
  for (const lang of ['es', 'en', 'fr', 'it', 'ar']) assert.match(js, new RegExp(`\\b${lang}:\\{`));
});
