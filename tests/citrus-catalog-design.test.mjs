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
    document: {readyState: 'loading', documentElement: {lang: 'es'}, body: {classList: {contains: () => true}},
      getElementById: id => roots[id], addEventListener: (_, fn) => {init = fn;}},
    window: {}, console, fetch: async () => ({ok: true, json: async () => ({products})})
  });
  await init();
  return roots;
}
test('fruit inquiry links retain the product selection', async () => {
  const roots = await renderCatalogue();
  assert.match(roots.fruitCatalog.innerHTML, /product=clementina/);
  assert.match(roots.fruitOther.innerHTML, /contact\/\?product=/);
});
test('unverified campaign months are not presented as availability', async () => {
  const roots = await renderCatalogue();
  assert.doesNotMatch(roots.fruitCatalog.innerHTML, /is-active|citrus-month/);
  assert.match(roots.fruitCatalog.innerHTML, /Según campaña y programa/);
});
test('catalogue escapes product values before inserting HTML', async () => {
  const products = structuredClone(data.products);
  products.find(p => p.id === 'clementina').varieties = ['<script>bad</script>'];
  const roots = await renderCatalogue(products);
  assert.doesNotMatch(roots.fruitCatalog.innerHTML, /<script>/);
  assert.match(roots.fruitCatalog.innerHTML, /&lt;script&gt;/);
});
test('conditions are always visible in a definition list on every card', async () => {
  const roots = await renderCatalogue();
  const cards = (roots.fruitCatalog.innerHTML.match(/class="fruit-catalog-status"/g) || []).length;
  assert.ok(cards > 0);
  assert.equal((roots.fruitCatalog.innerHTML.match(/<dl class="fruit-catalog-meta">/g) || []).length, cards);
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
