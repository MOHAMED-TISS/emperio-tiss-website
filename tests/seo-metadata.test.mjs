import test from 'node:test';
import assert from 'node:assert/strict';
import { getSeoMeta, isSeoCanonicalPath, SEO_ROUTE_SUFFIXES, buildSeoHead } from '../src/seo-metadata.js';

test('canonical route matrix contains the 13 sitemap page families', () => {
  assert.equal(SEO_ROUTE_SUFFIXES.length, 13);
  assert.ok(SEO_ROUTE_SUFFIXES.includes('/'));
  assert.ok(SEO_ROUTE_SUFFIXES.includes('/products/seafood/fish/'));
  assert.ok(SEO_ROUTE_SUFFIXES.includes('/contact/'));
});

test('localized route produces self canonical and five language alternates', () => {
  const meta = getSeoMeta('/ar/about/');
  assert.deepEqual(meta, {
    canonical: 'https://emperio-tiss.com/ar/about/',
    hreflang: {
      es: 'https://emperio-tiss.com/about/',
      en: 'https://emperio-tiss.com/en/about/',
      fr: 'https://emperio-tiss.com/fr/about/',
      it: 'https://emperio-tiss.com/it/about/',
      ar: 'https://emperio-tiss.com/ar/about/',
      'x-default': 'https://emperio-tiss.com/about/'
    }
  });
});

test('spanish homepage uses root for canonical and x-default', () => {
  const meta = getSeoMeta('/');
  assert.equal(meta.canonical, 'https://emperio-tiss.com/');
  assert.equal(meta.hreflang.es, 'https://emperio-tiss.com/');
  assert.equal(meta.hreflang['x-default'], 'https://emperio-tiss.com/');
  assert.equal(meta.hreflang.it, 'https://emperio-tiss.com/it/');
});

test('legacy html redirects are outside the canonical matrix', () => {
  assert.equal(isSeoCanonicalPath('/products/seafood.html'), false);
  assert.equal(getSeoMeta('/products/seafood.html'), null);
});

test('SEO head output is deterministic', () => {
  const tags = buildSeoHead(getSeoMeta('/it/products/'));
  assert.match(tags, /rel="canonical" href="https:\/\/emperio-tiss\.com\/it\/products\/"/);
  for (const language of ['es', 'en', 'fr', 'it', 'ar', 'x-default']) {
    assert.match(tags, new RegExp(`hreflang="${language}"`));
  }
});
