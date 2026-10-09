import test from 'node:test';
import assert from 'node:assert/strict';
import { SEO_LANGUAGES, SEO_ROUTE_SUFFIXES, getSeoMeta } from '../src/seo-metadata.js';
import { SEO_COPY, seoCopy, buildSocialHead, buildStructuredData } from '../src/seo-copy.js';

const routes = SEO_ROUTE_SUFFIXES.flatMap(suffix => SEO_LANGUAGES.map(language => ({ language, suffix })));
const pathFor = (language, suffix) => language === 'es' ? suffix : (suffix === '/' ? `/${language}/` : `/${language}${suffix}`);

test('every route has a title and description in every language', () => {
  assert.equal(Object.keys(SEO_COPY).length, SEO_ROUTE_SUFFIXES.length);
  const titles = new Set();
  for (const { language, suffix } of routes) {
    const copy = seoCopy(language, suffix);
    assert.ok(copy, `${language} ${suffix} has no copy`);
    assert.ok(copy.title.length >= 25 && copy.title.length <= 70, `${language} ${suffix} title length ${copy.title.length}`);
    assert.match(copy.title, /EMPERIO TISS/);
    assert.ok(copy.description.length >= 70 && copy.description.length <= 170, `${language} ${suffix} description length ${copy.description.length}`);
    assert.ok(!titles.has(copy.title), `duplicate title ${copy.title}`);
    titles.add(copy.title);
  }
});

test('the Mediterranean is only ever named as a fishing ground, never a market', () => {
  const sea = /Mediterr|Méditerran|المتوسط/i;
  const catchZone = /captura|fishing ground|zone de pêche|zona di pesca|منطقة صيد/i;
  for (const { language, suffix } of routes) {
    const { title, description } = seoCopy(language, suffix);
    assert.doesNotMatch(title, sea, `${language} ${suffix} title`);
    if (sea.test(description)) assert.match(description, catchZone, `${language} ${suffix} description`);
    const data = buildStructuredData(language, suffix, getSeoMeta(pathFor(language, suffix)).canonical);
    assert.doesNotMatch(data.match(/"areaServed":\[[^\]]*\]/)[0], sea);
  }
});

test('structured data is valid JSON with organization, page and breadcrumb ending at the page', () => {
  for (const { language, suffix } of routes) {
    const { canonical } = getSeoMeta(pathFor(language, suffix));
    const html = buildStructuredData(language, suffix, canonical);
    assert.doesNotMatch(html.slice(35, -9), /</, 'raw < inside JSON-LD');
    const graph = JSON.parse(html.replace(/^<script[^>]*>|<\/script>$/g, ''))['@graph'];
    const types = graph.map(node => node['@type']);
    assert.ok(types.includes('Organization') && types.includes('WebSite') && types.includes('BreadcrumbList'));
    const page = graph[2];
    assert.equal(page.url, canonical);
    assert.equal(page.inLanguage, language);
    const items = graph[3].itemListElement;
    assert.equal(items.at(-1).item, canonical);
    assert.equal(items[0].item, getSeoMeta(pathFor(language, '/')).canonical);
    items.forEach((item, index) => assert.equal(item.position, index + 1));
  }
});

test('sharing tags use the localized copy, canonical URL and the 1200x630 image', () => {
  const head = buildSocialHead('fr', '/products/seafood/cephalopods/', 'https://emperio-tiss.com/fr/products/seafood/cephalopods/');
  assert.match(head, /property="og:title" content="Céphalopodes : poulpe, calmar et seiche \| EMPERIO TISS"/);
  assert.match(head, /property="og:url" content="https:\/\/emperio-tiss\.com\/fr\/products\/seafood\/cephalopods\/"/);
  assert.match(head, /og-share-1200x630\.png/);
  assert.match(head, /name="twitter:card" content="summary_large_image"/);
  assert.match(head, /property="og:locale" content="fr_FR"/);
  assert.equal((head.match(/og:locale:alternate/g) || []).length, 4);
});
