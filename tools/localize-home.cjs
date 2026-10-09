/* Generate the localized Homes (EN / FR / IT / AR) from the approved ES Home and the i18n copy.
   usage: node tools/localize-home.cjs
   - <head>: each language keeps its own metadata and fonts; its stylesheets become the ES Home
     stylesheets in the same order (plus the Arabic layer on /ar/).
   - <body>: the ES body with every text node, aria-label, alt and data-label translated from
     public/assets/i18n/home.json, internal links pointing at the language, and the localized
     Atlas map. Untranslated Spanish copy fails the run. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
const copy = JSON.parse(fs.readFileSync(path.join(root, 'public/assets/i18n/home.json'), 'utf8'));
const escape = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const STYLESHEET = /[ \t]*<link\b[^>]*href="\/assets\/css\/[^"]+"[^>]*>[ \t]*\r?\n?/g;
const esHead = source.slice(0, source.indexOf('<body'));
const esStyles = (esHead.match(STYLESHEET) || []).map(tag => tag.trim()).join('\n');
const AR_LAYER = '<link rel="stylesheet" href="/assets/css/home-ar-2026.css?v=20261009-1">';
// Copy that stays as it is in every language (brand names, codes, contact).
const KEEP = new Set(['ES', 'EN', 'FR', 'IT', 'AR', 'Signature', 'I', 'II', 'III', 'EMPERIO TISS', 'EMPERIO SIGNATURE', 'info@emperio-tiss.com']);
const missing = new Set();
const translate = (value, index) => {
  const key = value.trim();
  if (!key || !/\p{L}/u.test(key) || KEEP.has(key)) return value;
  if (!copy.text[key]) { missing.add(key); return value; }
  return value.replace(key, copy.text[key][index]);
};

for (const [index, lang] of ['en', 'fr', 'it', 'ar'].entries()) {
  const file = path.join(root, 'public', lang, 'index.html');
  const original = fs.readFileSync(file, 'utf8');
  let head = original.slice(0, original.indexOf('<body'));
  const first = head.search(STYLESHEET);
  head = head.replace(STYLESHEET, '');
  const styles = esStyles + (lang === 'ar' ? '\n' + AR_LAYER : '');
  head = first >= 0 ? head.slice(0, first) + styles + '\n' + head.slice(first) : head.replace('</head>', styles + '\n</head>');

  let body = source.slice(source.indexOf('<body'));
  const scripts = [];
  body = body.replace(/<script\b[\s\S]*?<\/script>/g, script => `\u0000${scripts.push(script) - 1}\u0000`);
  body = body.replace(/>([^<>]+)</g, (match, value) => '>' + translate(value, index) + '<');
  body = body.replace(/(aria-label|alt|data-label)="([^"]*)"/g, (match, attr, value) => {
    const out = translate(value, index);
    return out === value ? match : `${attr}="${escape(out)}"`;
  });
  body = body.replace(/\u0000(\d+)\u0000/g, (m, i) => scripts[i]);
  body = body.replace(/href="\/(about|products|markets|news|contact|private)([^" ]*)"/g, `href="/${lang}/$1$2"`);
  // Preserve cross-language destinations while localizing brand/home links.
  body = body.replace(/(<a\b[^>]*href=")\/("[^>]*>)(?!(?:ES|<span>·))/g, `$1/${lang}/$2`);
  body = body.replace(/(<a[^>]*href=")\/(?:en|fr|it|ar)\/" class="current">ES/g, '$1/" class="current">ES');
  body = body.replace(/class="current"/g, '').replace(new RegExp(`href="/${lang}/"(\\s*)>${lang.toUpperCase()}`, 'g'), `href="/${lang}/" class="current">${lang.toUpperCase()}`);
  body = body.replace(/\/assets\/images\/markets\/atlas-2026\.svg/g, `/assets/images/markets/atlas-2026-${lang}.svg`);
  body = body.replace(/(<img\b[^>]*loading="lazy"[^>]*?) loading="lazy"/g, '$1');
  const scenes = {};
  for (const key of ['sea', 'fruit']) scenes[key] = { ...copy.scenes[key], label: copy.scenes[key].label[index], description: copy.scenes[key].description[index] };
  body = body.replace(/\n?<script type="application\/json" id="home-scenes">[\s\S]*?<\/script>/, '');
  body = body.replace('</main>', '</main>\n<script type="application/json" id="home-scenes">' + JSON.stringify(scenes).replace(/</g, '\\u003c') + '</script>');
  fs.writeFileSync(file, head + body);
}

if (missing.size) {
  console.error('Missing translations in public/assets/i18n/home.json:\n  ' + [...missing].join('\n  '));
  process.exit(1);
}
console.log('Localized Homes written: en, fr, it, ar');
