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
  assert.match(html, /href="\/assets\/css\/es-pages\.css/, `${lang}: ES visual stylesheet must be loaded`);
  assert.match(html, /action="\/api\/contact"/, `${lang}: form must use canonical contact endpoint`);

  const switcher = html.match(/class="et-language-switch"[\s\S]*?<\/nav>/)?.[0] || '';
  const found = [...switcher.matchAll(/>\s*(ES|EN|FR|IT|AR)\s*</g)].map((m) => m[1]);
  assert.deepEqual(found, switchOrder, `${lang}: language switcher must be ES/EN/FR/IT/AR`);

  for (const field of backendFields) {
    assert.match(html, new RegExp(`name="${field}"`), `${lang}: missing canonical field ${field}`);
  }

  assert.match(html, /<option>Pescados|<option>Fish|<option>Poissons|<option>Pesce|<option>الأسماك/);
  assert.match(html, /<option>Mariscos|<option>Shellfish|<option>Fruits de mer|<option>Molluschi e crostacei|<option>المأكولات البحرية/);
  assert.match(html, /<option>Cefalópodos|<option>Cephalopods|<option>Céphalopodes|<option>Cefalopodi|<option>رأسيات الأرجل/);
  assert.match(html, /<option>Frutas|<option>Fruits|<option>Frutta|<option>الفواكه/);
  assert.match(html, /<option>Hortalizas|<option>Vegetables|<option>Légumes|<option>Ortaggi|<option>الخضروات/);
  assert.match(html, /<option>Productos de temporada|<option>Seasonal products|<option>Produits de saison|<option>Prodotti stagionali|<option>المنتجات الموسمية/);
  assert.match(html, /<option>Otro|<option>Other|<option>Autre|<option>Altro|<option>أخرى/);
}

console.log('contact-language-regression: PASS');
