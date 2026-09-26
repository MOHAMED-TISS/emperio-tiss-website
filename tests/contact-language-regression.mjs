import fs from 'node:fs';
import assert from 'node:assert/strict';

const pages = [
  ['es', 'public/contact/index.html', '/'],
  ['en', 'public/en/contact/index.html', '/en/'],
  ['fr', 'public/fr/contact/index.html', '/fr/'],
  ['it', 'public/it/contact/index.html', '/it/'],
  ['ar', 'public/ar/contact/index.html', '/ar/'],
];

const switchOrder = ['ES', 'EN', 'FR', 'IT', 'AR'];
const backendFields = ['nombre', 'empresa', 'email', 'telefono', 'producto', 'destino', 'mensaje'];

for (const [lang, path, prefix] of pages) {
  const html = fs.readFileSync(path, 'utf8');
  assert.match(html, /class="[^"]*es-page[^"]*"/, `${lang}: Contact must use the ES visual shell`);
  assert.match(html, /href="\/assets\/css\/es-pages\.css/,
    `${lang}: ES visual stylesheet must be loaded`);
  assert.match(html, /href="\/assets\/css\/contact\.css\?v=20260926-hero100-force"/,
    `${lang}: contact stylesheet cache key must include the 100vh hero release`);
  assert.match(html, /action="\/api\/contact"/,
  `${lang}: form must use canonical contact endpoint`);

  const switcher = html.match(/class="et-language-switch"[\s\S]*?<\/nav>/)?.[0] || '';
  const found = [...switcher.matchAll(/>\s*(ES|EN|FR|IT|AR)\s*</g)].map((m) => m[1]);
  assert.deepEqual(found, switchOrder, `${lang}: language switcher must be ES/EN/FR/IT/AR`);

  for (const field of backendFields) {
    assert.match(html, new RegExp(`name="${field}"`), `${lang}: missing canonical field ${field}`);
  }

  assert.match(html,
  /<option>Pescados|<option>Fish|<option>Poissons|<option>Pesce|<option>الأسماك/);
  assert.match(html,
    /<option>Mariscos|<option>Shellfish|<option>Fruits de mer|<option>Molluschi e crostacei|<option>المأكولات البحرية/
    );
  assert.match(html,
    /<option>Cefalópodos|<option>Cephalopods|<option>Céphalopodes|<option>Cefalopodi|<option>رأسيات الأرجل/
    );
  assert.match(html, /<option>Frutas|<option>Fruits|<option>Frutta|<option>الفواكه/);
  assert.match(html,
    /<option>Hortalizas|<option>Vegetables|<option>Légumes|<option>Ortaggi|<option>الخضروات/);
  assert.match(html,
    /<option>Productos de temporada|<option>Seasonal products|<option>Produits de saison|<option>Prodotti stagionali|<option>المنتجات الموسمية/
    );
  assert.match(html, /<option>Otro|<option>Other|<option>Autre|<option>Altro|<option>أخرى/);
}

const filterCss = fs.readFileSync('public/assets/css/catalogue-filter-contrast-en-fr.css', 'utf8');
const contactCss = fs.readFileSync('public/assets/css/contact.css', 'utf8');
assert.match(contactCss, /\.es-page \.es-hero\s*\{[^}]*min-height:\s*100vh/s,
  'Contact hero must fill the viewport');
assert.match(contactCss, /body\.es-page \.es-hero\s*\{[^}]*min-height:\s*100dvh/s,
  'Contact hero must use the dynamic viewport height');
assert.match(contactCss, /min-height:\s*100dvh\s*!important/,
  'Contact hero must override the later shared 88svh rule');
assert.doesNotMatch(contactCss, /\.es-page \.es-hero\s*\{[^}]*min-height:\s*100svh/s,
  'Contact hero must not use the smaller viewport height');
for (const pageClass of ['es-page', 'intl-page', 'ar-page', 'about-page', 'products-site', 'news-page']) {
  assert.doesNotMatch(filterCss, new RegExp(`\\.${pageClass} a\\[href\\*="contact"\\]`),
    `${pageClass}: content CTA sizing must not capture the 06 contact link in the menu`);
  assert.match(filterCss, new RegExp(`\\.${pageClass} main a\\[href\\*="contact"\\]`),
    `${pageClass}: contact CTA sizing must stay scoped to main content`);
}

console.log('contact-language-regression: PASS');
