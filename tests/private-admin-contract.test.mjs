import assert from 'node:assert/strict';
import fs from 'node:fs';

const page = fs.readFileSync('public/private/admin/index.html', 'utf8');
const script = fs.readFileSync('public/assets/js/private-admin.js', 'utf8');

assert.match(page, /data-admin-form/);
assert.match(page, /data-client-form/);
assert.match(page, /data-offer-form/);
assert.match(page, /data-send-offer-form/);
assert.match(page, /data-newsletter-form/);
assert.match(script, /\/api\/private\/admin\/approve/);
assert.match(script, /\/api\/private\/admin\/offers/);
assert.match(script, /\/api\/private\/admin\/send-offer/);
assert.match(script, /\/api\/admin\/newsletter\/send/);
assert.match(script, /Authorization/);
assert.match(script, /Sent to/);

console.log('private-admin contract: PASS');
