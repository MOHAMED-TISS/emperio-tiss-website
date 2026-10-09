import fs from 'node:fs';
import assert from 'node:assert/strict';

const unifiedCss = fs.readFileSync('public/assets/css/site-pages-unified.css', 'utf8');
const companyCss = fs.readFileSync('public/assets/css/company.css', 'utf8');

assert.doesNotMatch(
  unifiedCss,
  /(?:\.es-page|\.intl-page|\.ar-page|\.about-page|\.products-site|\.news-page)\s+a\[href\*="contact"\]/,
  'contact CTA selectors must not style header or footer navigation links',
);
assert.match(
  unifiedCss,
  /\.about-page main a\[href\*="contact"\]/,
  'about-page contact CTAs must stay scoped to main content',
);

// The Company page is built by tools/build-about.cjs: one corporate structure, five languages.
const pages = [
  ['es', 'public/about/index.html', '/', /Del origen al mercado, con criterio/],
  ['en', 'public/en/about/index.html', '/en/', /From origin to market, with purpose/],
  ['fr', 'public/fr/about/index.html', '/fr/', /De l’origine au marché, avec discernement/],
  ['it', 'public/it/about/index.html', '/it/', /Dall’origine al mercato, con criterio/],
  ['ar', 'public/ar/about/index.html', '/ar/', /من المنشأ إلى السوق، بمعايير واضحة/],
];

for (const [lang, path, base, title] of pages) {
  const html = fs.readFileSync(path, 'utf8');
  assert.match(html, /<body class="es-page[^"]*about-page about-2026/, `${lang}: Company page shell`);
  assert.match(html, /company\.css/, `${lang}: must load the Company page stylesheet`);
  assert.doesNotMatch(html, /about-media\.css|about-2026\.css/, `${lang}: retired about stylesheets`);
  assert.match(html, title, `${lang}: hero statement`);
  for (const id of ['co-title', 'co-who', 'co-mv', 'co-model', 'co-areas', 'co-presence', 'co-data', 'co-commit', 'co-close']) {
    assert.ok(html.includes(`id="${id}`), `${lang}: missing ${id}`);
  }
  assert.equal((html.match(/<li><span>0\d<\/span><h3>/g) || []).length, 10, `${lang}: six values and four operating steps`);
  assert.doesNotMatch(html, /co-figures/, `${lang}: no figures (owner 2026-10-09)`);
  for (const route of ['contact/', 'products/seafood/', 'products/fruits-vegetables/', 'products/seasonal/', 'markets/', 'private/']) {
    assert.ok(html.includes(`href="${base}${route}"`), `${lang}: link to ${base}${route}`);
  }
  assert.match(html, /info@emperio-tiss\.com/, `${lang}: missing contact`);
  // owner 2026-10-09: no figures, no founding year, no team, no sanitary registration
  assert.doesNotMatch(html, /2024|foundingDate/, `${lang}: founding year must not be shown`);
  // the Mediterranean is a fishing ground, never listed as a market region
  const regions = html.match(/<dl class="co-regions">[\s\S]*?<\/dl>/)[0];
  assert.doesNotMatch(regions, /Mediterr|Méditerran|المتوسط/, `${lang}: Mediterranean listed as a market`);
  assert.equal((regions.match(/<dt>/g) || []).length, 3, `${lang}: three market regions`);
  if (lang === 'ar') assert.match(html, /lang="ar"\s+dir="rtl"[\s\S]*class="es-page ar-page/, 'ar: RTL Arabic page');
}

// hero always fills the viewport; reveal motion respects reduced-motion users; dark theme defined
assert.match(companyCss, /\.co-hero \{[^}]*min-height: 100svh;[^}]*min-height: 100dvh;/);
assert.match(companyCss, /prefers-reduced-motion: no-preference/);
assert.match(companyCss, /html\[data-et-theme="dark"\] body\.about-2026/);

console.log('about-content-regression: PASS');
