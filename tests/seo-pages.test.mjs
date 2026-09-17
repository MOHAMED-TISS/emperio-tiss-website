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
  const direct = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  if (direct) return direct[1];
  return html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1] ?? null;
}

function hreflangFrom(html) {
  const entries = {};
  const patterns = [
    /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["']/gi,
    /<link[^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["'][^>]+rel=["']alternate["']/gi
  ];
  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) entries[match[1].toLowerCase()] = match[2];
  }
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
  const failures = [];

  for (const url of urls) {
    const file = htmlPathFor(url);
    if (!fs.existsSync(file)) {
      failures.push(`${url}: missing HTML file`);
      continue;
    }

    const html = fs.readFileSync(file, 'utf8');
    if (!/<title>\s*[^<]+\s*<\/title>/i.test(html)) failures.push(`${url}: missing title`);
    if (!/<meta\s+name=["']description["'][^>]+content=["'][^"']+/i.test(html)) {
      failures.push(`${url}: missing meta description`);
    }
    if (/<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) {
      failures.push(`${url}: canonical target has static noindex`);
    }
  }

  assert.deepEqual(failures, [], failures.join('\n'));
});

test('existing static canonical and hreflang signals never contradict the route matrix', () => {
  const failures = [];

  for (const url of urls) {
    const pathname = new URL(url).pathname;
    const expected = getSeoMeta(pathname);
    const html = fs.readFileSync(htmlPathFor(url), 'utf8');
    const canonical = canonicalFrom(html);

    if (canonical && canonical !== expected.canonical) {
      failures.push(`${url}: canonical ${canonical} != ${expected.canonical}`);
    }

    for (const [language, href] of Object.entries(hreflangFrom(html))) {
      if (!expected.hreflang[language]) failures.push(`${url}: unknown hreflang ${language}`);
      else if (href !== expected.hreflang[language]) {
        failures.push(`${url}: hreflang ${language} ${href} != ${expected.hreflang[language]}`);
      }
    }
  }

  assert.deepEqual(failures, [], failures.join('\n'));
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
