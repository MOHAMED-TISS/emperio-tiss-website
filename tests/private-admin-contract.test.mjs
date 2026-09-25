import assert from 'node:assert/strict';
import fs from 'node:fs';

const page = fs.readFileSync('public/private/admin/index.html', 'utf8');
const script = fs.readFileSync('public/assets/js/private-admin.js', 'utf8');
const newsScript = fs.readFileSync('public/assets/js/news-current.js', 'utf8');

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
assert.match(script, /campaign_id/);
assert.match(page, /sandbox=""/);
assert.match(page, /confirmCampaign/);
for (const field of ['tax_id','company','address','country','contact_name','mobile','email','whatsapp','products_interest','privacy']) {
  assert.match(newsScript,new RegExp(`name=["']${field}["']`));
}
assert.match(newsScript,/name="categories"/);
assert.match(newsScript,/\['seafood','fruits','vegetables'\]/);
assert.match(newsScript,/value="\$\{value\}"/);
assert.match(newsScript,/value="\$\{L\}"/);
for (const id of ['metricTotal','metricPending','metricApproved','metricRejected','requestTrend','requestTrendTable','countryChart','categoryChart']) {
  assert.match(page,new RegExp(`id=["']${id}["']`));
}
assert.match(script,/renderAnalytics/);
assert.match(script,/notification_status/);
assert.match(script,/interest_categories/);
assert.match(page,/private-admin\.js\?v=20260925-analytics/);

console.log('private-admin contract: PASS');
