import assert from 'node:assert/strict';
import fs from 'node:fs';
const worker=fs.readFileSync('src/index.js','utf8');
const core=fs.readFileSync('public/assets/js/global-core.js','utf8');
const flow=fs.readFileSync('public/assets/js/commercial-flow.js','utf8');
const admin=fs.readFileSync('public/assets/js/private-admin.js','utf8');
const page=fs.readFileSync('public/private/admin/index.html','utf8');
const catalog=JSON.parse(fs.readFileSync('public/assets/data/catalog-v1.3.json','utf8'));
const registry=JSON.parse(fs.readFileSync('public/assets/data/product-references.json','utf8'));
const catalogueFiles=[
  'public/assets/data/catalog-v1.3.json',
  'public/assets/data/catalog.json',
  'public/assets/data/cephalopods-catalog-es.json',
  'public/assets/data/cephalopods-catalog-fr.json',
  'public/assets/data/cephalopods-catalog-it.json',
  'public/assets/data/fish-catalog-es.json',
  'public/assets/data/shellfish-catalog-es.json',
  'public/assets/data/shellfish-catalog-fr.json',
  'public/assets/data/fruit-catalog-v1.json',
  'public/assets/data/produce-varieties.json'
];
assert.match(worker,/INQ-/);
assert.match(worker,/inquiries\/status/);
assert.match(core,/product_specification/);
assert.match(core,/product_reference/);
assert.match(worker,/product_reference/);
assert.match(flow,/product-references\.json/);
assert.match(core,/result\.inquiry_id/);
assert.match(flow,/Request this specification/);
assert.match(admin,/admin-inquiry-status/);
assert.match(page,/id="inquiryList"/);
assert.equal(catalog.schemaVersion,'2.0');
assert.equal(registry.rules.digits,4);
assert.equal(registry.rules.unique,true);
assert.equal(registry.rules.languageIndependent,true);
const registered=Object.values(registry.references);
assert.equal(new Set(registered).size,registered.length,'Product references must be unique');
for(const ref of registered) assert.match(ref,/^\d{4}$/,'Every product reference must contain exactly four digits');
for(const file of catalogueFiles){
  const data=JSON.parse(fs.readFileSync(file,'utf8'));
  for(const product of data.products || []){
    assert.ok(registry.references[product.id],`${file}: unregistered product ${product.id}`);
    assert.equal(product.reference,registry.references[product.id],`${file}: inconsistent reference for ${product.id}`);
  }
}
for(const p of catalog.products) for(const f of ['faoZone','quality','format','packaging','weights','season','availability','moq','destinationConstraints','documents']) assert.ok(Array.isArray(p[f]),`${p.id} missing ${f}`);
console.log('commercial inquiries pipeline: PASS');