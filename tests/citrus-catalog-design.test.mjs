import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const js = fs.readFileSync('public/assets/js/fruit-catalog.js', 'utf8');
const baseCss = fs.readFileSync('public/assets/css/citrus-catalog.css', 'utf8');
const overridesCss = fs.readFileSync('public/assets/css/citrus-catalog-overrides.css', 'utf8');
const page = fs.readFileSync('public/products/fruits/index.html', 'utf8');
const data = JSON.parse(fs.readFileSync('public/assets/data/fruit-catalog-v1.json', 'utf8'));

// Exercise the renderer rather than asserting the retired visual layout's CSS strings.
import vm from 'node:vm';
async function renderCatalogue(products = data.products) {
  const roots = {fruitCatalog: {innerHTML: ''}, fruitOther: {innerHTML: ''}};
  let init;
  vm.runInNewContext(js, {
    document: {documentElement: {lang: 'es'}, body: {classList: {contains: () => true}},
      getElementById: id => roots[id], addEventListener: (_, fn) => {init = fn;}},
    window: {}, console, fetch: async () => ({ok: true, json: async () => ({products})})
  });
  await init();
  return roots;
}
test('fruit inquiry links retain product and variety selection', async () => {
  const roots = await renderCatalogue();
  assert.match(roots.fruitCatalog.innerHTML, /product=clementina&variety=Clemenules/);
  assert.match(roots.fruitOther.innerHTML, /contact\/\?product=/);
});
test('unverified campaign months are not presented as availability', async () => {
  const roots = await renderCatalogue();
  assert.doesNotMatch(roots.fruitCatalog.innerHTML, /is-active|citrus-month/);
  assert.match(roots.fruitCatalog.innerHTML, /Disponibilidad por confirmar/);
});
test('catalogue escapes product values before inserting HTML', async () => {
  const products = structuredClone(data.products);
  products.find(p => p.id === 'clementina').varieties = ['<script>bad</script>'];
  const roots = await renderCatalogue(products);
  assert.doesNotMatch(roots.fruitCatalog.innerHTML, /<script>/);
  assert.match(roots.fruitCatalog.innerHTML, /&lt;script&gt;/);
});
test('conditions remain accessible through native disclosure controls', async () => {
  const roots = await renderCatalogue();
  assert.equal((roots.fruitCatalog.innerHTML.match(/<details /g) || []).length, 3);
  assert.equal((roots.fruitCatalog.innerHTML.match(/<summary>/g) || []).length, 3);
});

test('fruit page loads the catalogue renderer before the fruit presenter', () => {
  assert.match(page, /products-catalog\.js/);
  assert.match(page, /fruit-catalog\.js/);
  assert.ok(page.indexOf('products-catalog.js') < page.indexOf('fruit-catalog.js'));
});

test('mandarinas include Berkane', () => {
  const mandarina = data.products.find((product) => product.id === 'mandarina');
  assert.ok(mandarina);
  assert.ok(mandarina.varieties.includes('Berkane'));
});
