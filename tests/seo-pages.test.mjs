import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { SEO_LANGUAGES, SEO_ROUTE_SUFFIXES, getSeoMeta } from '../src/seo-metadata.js';

const ROOT = process.cwd();
const SITEMAP = fs.readFileSync(path.join(ROOT, 'public/sitemap.xml'), 'utf8');
const urls = [...SITEMAP.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);

function htmlPathFor(url) {
  const pathname = new URL(url).pathname;
  if (pathname === '/') return path.join(ROOT, 'public', 'index.html');
  return path.join(ROOT, 'public', pathname.slice(1), 'index.html');
}

function canonicalFrom(html) {
  return html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ?? null;
}

function hreflangFrom(html) {
  const entries = {};
  const pattern = /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["']/gi;
  for (const match of html.matchAll(pattern)) entries[match[1].toLowerCase()] = match[2];
  return entries;
}

test('SEO route matrix matches the 65-entry sitemap contract', () => {
  assert.equal(SEO_ROUTE_SUFFIXES.length, 13);
  assert.equal(SEO_LANGUAGES.length, 5);
  assert.equal(urls.length, 65);
  assert.equal(new Set(urls).size, 65);

  for (const url of urls) {
    assert.ok(getSeoMeta(new URL(url).pathname), `sitemap URL is outside SEO matrix: ${url}`);
  }
});

test('every sitemap target has real HTML, title, description and no static noindex', () => {
  for (const url of urls) {
    const file = htmlPathFor(url);
    assert.equal(fs.existsSync(file), true, `missing HTML for ${url}`);
    const html = fs.readFileSync(file, 'utf8');

    assert.match(html, /<title>\s*[^<]+\s*<\/title>/i, `missing title: ${url}`);
    assert.match(
      html,
      /<meta\s+name=["']description["'][^>]+content=["'][^"']+/i,
      `missing description: ${url}`
    );
    assert.doesNotMatch(
      html,
      /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i,
      `noindex on canonical: ${url}`
    );
  }
});

test('existing static canonical and hreflang signals never contradict the route matrix', () => {
  for (const url of urls) {
    const pathname = new URL(url).pathname;
    const expected = getSeoMeta(pathname);
    const html = fs.readFileSync(htmlPathFor(url), 'utf8');
    const canonical = canonicalFrom(html);

    if (canonical) assert.equal(canonical, expected.canonical, `canonical mismatch: ${url}`);

    const existingHreflang = hreflangFrom(html);
    for (const [language, href] of Object.entries(existingHreflang)) {
      assert.ok(expected.hreflang[language], `unknown hreflang ${language}: ${url}`);
      assert.equal(href, expected.hreflang[language], `hreflang mismatch: ${url} -> ${language}`);
    }
  }
});

test('all localized language groups are represented exactly 13 times', () => {
  for (const language of SEO_LANGUAGES) {
    const count = urls.filter(url => {
      const pathname = new URL(url).pathname;
      if (language === 'es') return !/^\/(en|fr|it|ar)(\/|$)/.test(pathname);
      return pathname === `/${language}/` || pathname.startsWith(`/${language}/`);
    }).length;
    assert.equal(count, 13, `${language} should have exactly 13 sitemap URLs`);
  }
});
