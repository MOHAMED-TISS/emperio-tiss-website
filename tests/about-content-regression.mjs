import fs from 'node:fs';
import assert from 'node:assert/strict';

const unifiedCss = fs.readFileSync('public/assets/css/site-pages-unified.css', 'utf8');
const aboutCss = fs.readFileSync('public/assets/css/about-2026.css', 'utf8');

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

// The Company page is built by tools/build-about.cjs: one structure, five languages.
const pages = [
  ['es', 'public/about/index.html', '/', /Del origen al mercado/],
  ['en', 'public/en/about/index.html', '/en/', /From origin to market/],
  ['fr', 'public/fr/about/index.html', '/fr/', /De l’origine au marché/],
  ['it', 'public/it/about/index.html', '/it/', /Dall’origine al mercato/],
  ['ar', 'public/ar/about/index.html', '/ar/', /من المنشأ إلى السوق/],
];
const sections = ['ab26-hero', 'ab26-facts', 'ab26-role', 'ab26-supply', 'ab26-criteria', 'ab26-reach', 'ab26-values', 'ab26-commit', 'ab26-close'];

for (const [lang, path, base, title] of pages) {
  const html = fs.readFileSync(path, 'utf8');
  assert.match(html, /<body class="es-page[^"]*about-page about-2026/, `${lang}: Company page shell`);
  assert.match(html, /about-2026\.css/, `${lang}: must load the Company page stylesheet`);
  assert.doesNotMatch(html, /about-media\.css/, `${lang}: the old about stylesheet is retired`);
  assert.match(html, title, `${lang}: hero title`);
  for (const section of sections) assert.match(html, new RegExp(`class="ab26-section[^"]*${section}|class="${section}`), `${lang}: missing ${section}`);
  assert.equal((html.match(/<article><span>0\d<\/span><h3>/g) || []).length, 6, `${lang}: six values`);
  assert.equal((html.match(/<article><h3>/g) || []).length, 2, `${lang}: responsibility and technology commitments`);
  for (const route of ['contact/', 'products/seafood/', 'products/fruits-vegetables/', 'products/seasonal/', 'markets/', 'private/']) {
    assert.ok(html.includes(`href="${base}${route}"`), `${lang}: link to ${base}${route}`);
  }
  assert.match(html, /info@emperio-tiss\.com/, `${lang}: missing contact CTA`);
  // the Mediterranean is a fishing ground, never listed as a market region
  const regions = html.match(/<div class="ab26-regions"[\s\S]*?<\/div><\/div>/)[0];
  assert.doesNotMatch(regions, /Mediterr|Méditerran|المتوسط/, `${lang}: Mediterranean listed as a market`);
  assert.equal((regions.match(/<h3>/g) || []).length, 3, `${lang}: three market regions`);
  if (lang === 'ar') assert.match(html, /lang="ar"\s+dir="rtl"[\s\S]*class="es-page ar-page/, 'ar: RTL Arabic page');
}

// hero always fills the viewport; reveal motion respects reduced-motion users
assert.match(aboutCss, /\.ab26-hero \{[^}]*min-height: 100svh;[^}]*min-height: 100dvh;/);
assert.match(aboutCss, /prefers-reduced-motion: no-preference/);
assert.match(aboutCss, /html\[data-et-theme="dark"\] body\.about-2026/);

console.log('about-content-regression: PASS');
