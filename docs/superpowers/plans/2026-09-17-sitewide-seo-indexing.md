# Sitewide SEO & Indexing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Normalize canonical and hreflang signals for all 65 intended multilingual page URLs at response time and prevent regressions with automated source-level tests.

**Architecture:** Keep the existing static HTML pages and intentional legacy redirects unchanged. Add a small route-matrix module used by the Cloudflare Worker; for matching HTML GET requests, strip pre-existing canonical/hreflang annotations and emit exactly one self-canonical, five reciprocal language links and one x-default link. Add Node-based source tests that validate the 65-page sitemap and route matrix.

**Tech Stack:** Cloudflare Workers HTMLRewriter, JavaScript ES modules, Node.js built-in test runner, HTML/XML parsing with standard string/regex checks.

**Spec:** `docs/superpowers/specs/2026-09-17-sitewide-seo-indexing-design.md`

## Global Constraints

- The sitemap remains exactly 65 intended canonical URLs: 13 page families × 5 languages.
- Canonical tags must be self-referential on the intended canonical URL.
- `hreflang` must be reciprocal across `es`, `en`, `fr`, `it`, `ar`.
- `x-default` points to the Spanish equivalent.
- Legacy `.html` compatibility pages remain `noindex` and are not added to the canonical matrix.
- Do not redesign content, visuals, product images or Arabic layout in this task.
- Do not promise or force Google indexing.

---

### Task 1: Add the SEO route matrix module

**Files:**
- Create: `src/seo-metadata.js`
- Test: `tests/seo-metadata.test.mjs`

**Interfaces:**
- Produces: `SEO_LANGUAGES`, `SEO_ROUTE_SUFFIXES`, `getSeoMeta(pathname)` and `isSeoCanonicalPath(pathname)`.
- `getSeoMeta(pathname)` returns `null` for non-canonical/legacy routes; otherwise returns `{ canonical, hreflang }`, where `hreflang` is an object containing `es`, `en`, `fr`, `it`, `ar`, and `x-default` absolute URLs.

- [ ] **Step 1: Write the failing tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { getSeoMeta, isSeoCanonicalPath, SEO_ROUTE_SUFFIXES } from '../src/seo-metadata.js';

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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/seo-metadata.test.mjs`
Expected: FAIL because `src/seo-metadata.js` does not exist yet.

- [ ] **Step 3: Implement the route matrix**

```js
const ORIGIN = 'https://emperio-tiss.com';
export const SEO_LANGUAGES = ['es', 'en', 'fr', 'it', 'ar'];
export const SEO_ROUTE_SUFFIXES = [
  '/', '/about/', '/products/', '/products/seafood/',
  '/products/seafood/fish/', '/products/seafood/shellfish/',
  '/products/seafood/cephalopods/', '/products/fruits/',
  '/products/vegetables/', '/products/seasonal/', '/markets/',
  '/news/', '/contact/'
];

const languageBase = {
  es: '',
  en: '/en',
  fr: '/fr',
  it: '/it',
  ar: '/ar'
};

const withLanguage = (language, suffix) => {
  if (language === 'es') return suffix;
  if (suffix === '/') return `${languageBase[language]}/`;
  return `${languageBase[language]}${suffix}`;
};

export const isSeoCanonicalPath = pathname => {
  if (!pathname.endsWith('/')) return false;
  return SEO_LANGUAGES.some(language =>
    SEO_ROUTE_SUFFIXES.includes(language === 'es' ? pathname : pathname.replace(new RegExp(`^/${language}`), '') || '/'))
  );
};

export function getSeoMeta(pathname) {
  const normalized = pathname || '/';
  let language = 'es';
  let suffix = normalized;
  for (const candidate of SEO_LANGUAGES) {
    const base = languageBase[candidate];
    if (candidate !== 'es' && (normalized === `${base}/` || normalized.startsWith(`${base}/`))) {
      language = candidate;
      suffix = normalized === `${base}/` ? '/' : normalized.slice(base.length);
      break;
    }
  }
  if (!SEO_ROUTE_SUFFIXES.includes(suffix)) return null;
  const localized = Object.fromEntries(SEO_LANGUAGES.map(code => [code, `${ORIGIN}${withLanguage(code, suffix)}`]));
  return {
    canonical: localized[language],
    hreflang: { ...localized, 'x-default': localized.es }
  };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test tests/seo-metadata.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/seo-metadata.js tests/seo-metadata.test.mjs
git commit -m "test: define multilingual SEO route matrix"
```

---

### Task 2: Add source-level sitemap and metadata regression tests

**Files:**
- Create: `tests/seo-pages.test.mjs`

**Interfaces:**
- Consumes: `public/sitemap.xml`, `public/**/index.html`, and the route matrix from `src/seo-metadata.js`.
- Produces: deterministic failures when intended canonical pages are missing, noindexed, missing title/description, or contain contradictory static canonical/hreflang metadata.

- [ ] **Step 1: Write the failing test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { SEO_LANGUAGES, SEO_ROUTE_SUFFIXES, getSeoMeta } from '../src/seo-metadata.js';

const ROOT = process.cwd();
const SITEMAP = fs.readFileSync(path.join(ROOT, 'public/sitemap.xml'), 'utf8');
const urls = [...SITEMAP.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const htmlPathFor = url => {
  const pathname = new URL(url).pathname;
  return path.join(ROOT, 'public', pathname === '/' ? 'index.html' : pathname.slice(1), 'index.html');
};

test('sitemap contains exactly 65 canonical URLs', () => {
  assert.equal(urls.length, 65);
  assert.equal(new Set(urls).size, 65);
});

test('sitemap contains five complete language groups', () => {
  for (const language of SEO_LANGUAGES) {
    const base = language === 'es' ? 'https://emperio-tiss.com' : `https://emperio-tiss.com/${language}`;
    const count = urls.filter(url => url === `${base}/` || url.startsWith(`${base}/`)).length;
    assert.equal(count, 13, `${language} should have 13 sitemap URLs`);
  }
});

test('every sitemap target has a title, description and no static noindex', () => {
  for (const url of urls) {
    const file = htmlPathFor(url);
    assert.equal(fs.existsSync(file), true, `missing HTML for ${url}`);
    const html = fs.readFileSync(file, 'utf8');
    assert.match(html, /<title>[^<]+<\/title>/i, `missing title: ${url}`);
    assert.match(html, /<meta\s+name=["']description["'][^>]+content=["'][^"']+/i, `missing description: ${url}`);
    assert.doesNotMatch(html, /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i, `noindex on canonical: ${url}`);
  }
});

test('existing static canonical/hreflang signals do not contradict the route matrix', () => {
  for (const url of urls) {
    const meta = getSeoMeta(new URL(url).pathname);
    const html = fs.readFileSync(htmlPathFor(url), 'utf8');
    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1];
    if (canonical) assert.equal(canonical, meta.canonical, `canonical mismatch: ${url}`);
    for (const language of [...SEO_LANGUAGES, 'x-default']) {
      const expected = meta.hreflang[language];
      if (expected && html.includes(`hreflang=\"${language}\"`)) {
        const pattern = new RegExp(`<link[^>]+hreflang=["']${language}["'][^>]+href=["']([^"']+)["']`, 'i');
        assert.equal(html.match(pattern)?.[1], expected, `hreflang mismatch: ${url} -> ${language}`);
      }
    }
  }
});
```

- [ ] **Step 2: Run the test to capture the current failures**

Run: `node --test tests/seo-pages.test.mjs`
Expected: FAIL on at least the pages missing source canonical/hreflang consistency; these failures establish the current baseline.

- [ ] **Step 3: Keep the test source-only and strict about indexing blockers**

Do not make the test require every page to have static hreflang, because response-level normalization is the implementation source of truth. The test only rejects static tags when they exist and conflict, while it strictly rejects missing files, missing title/description and static `noindex`.

- [ ] **Step 4: Run the test again after Task 1**

Run: `node --test tests/seo-pages.test.mjs`
Expected: sitemap/file/title/description checks pass; any pre-existing canonical conflicts are reported explicitly for correction before deployment.

- [ ] **Step 5: Commit**

```bash
git add tests/seo-pages.test.mjs
git commit -m "test: validate sitemap canonical page set"
```

---

### Task 3: Normalize SEO metadata in the Cloudflare Worker

**Files:**
- Modify: `src/index.js`
- Test: `tests/seo-metadata.test.mjs`

**Interfaces:**
- Consumes: `getSeoMeta(pathname)`.
- Produces: HTML responses for canonical routes with exactly one canonical and one complete hreflang set.

- [ ] **Step 1: Add Worker normalization helper with a route-level test**

```js
import { getSeoMeta } from './seo-metadata.js';

const isHtmlResponse = response => (response.headers.get('content-type') || '').toLowerCase().includes('text/html');

function normalizeSeoResponse(request, response) {
  if (request.method !== 'GET' || !response.ok || !isHtmlResponse(response)) return response;
  const meta = getSeoMeta(new URL(request.url).pathname);
  if (!meta) return response;

  return new HTMLRewriter()
    .on('head', new HeadSeoRewriter(meta))
    .transform(response);
}

class HeadSeoRewriter {
  constructor(meta) { this.meta = meta; }
  element(element) {
    element.onEndTag(tag => {
      const canonical = `<link rel="canonical" href="${this.meta.canonical}">`;
      const alternates = Object.entries(this.meta.hreflang)
        .map(([code, href]) => `<link rel="alternate" hreflang="${code}" href="${href}">`)
        .join('');
      tag.before(canonical + alternates, { html: true });
    });
  }
}
```

Before finalizing this helper, the implementation must remove any pre-existing canonical/hreflang tags inside the head rather than creating duplicates. The final handler should therefore register an element handler for `link` tags that calls `element.remove()` when `rel=canonical` or `hreflang` is present, then append the normalized set at the head end.

- [ ] **Step 2: Implement the minimal route-aware response transform**

Integrate it immediately before the existing `return env.ASSETS.fetch(request)` path:

```js
const assetResponse = await env.ASSETS.fetch(request);
return normalizeSeoResponse(request, assetResponse);
```

Keep all API routes unchanged.

- [ ] **Step 3: Run syntax checks**

Run:
```bash
node --check src/index.js
node --check src/seo-metadata.js
```
Expected: both PASS.

- [ ] **Step 4: Run all SEO tests**

Run:
```bash
node --test tests/seo-metadata.test.mjs tests/seo-pages.test.mjs
```
Expected: PASS with no canonical/hreflang matrix failures.

- [ ] **Step 5: Commit**

```bash
git add src/index.js src/seo-metadata.js tests/seo-metadata.test.mjs tests/seo-pages.test.mjs
git commit -m "fix: normalize multilingual SEO metadata at edge"
```

---

### Task 4: Add CI coverage for the SEO audit

**Files:**
- Create: `.github/workflows/validate-seo-indexing.yml`

**Interfaces:**
- Consumes: SEO tests and all public HTML/sitemap inputs.
- Produces: a GitHub Actions check on relevant site, sitemap, SEO module or test changes.

- [ ] **Step 1: Create the workflow**

```yaml
name: Validate SEO indexing architecture

on:
  push:
    paths:
      - 'public/**'
      - 'src/index.js'
      - 'src/seo-metadata.js'
      - 'tests/seo-*.test.mjs'
      - '.github/workflows/validate-seo-indexing.yml'
  pull_request:
    paths:
      - 'public/**'
      - 'src/index.js'
      - 'src/seo-metadata.js'
      - 'tests/seo-*.test.mjs'
      - '.github/workflows/validate-seo-indexing.yml'
  workflow_dispatch:

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Syntax check
        run: |
          node --check src/index.js
          node --check src/seo-metadata.js
      - name: SEO route and page tests
        run: node --test tests/seo-metadata.test.mjs tests/seo-pages.test.mjs
```

- [ ] **Step 2: Commit the workflow**

```bash
git add .github/workflows/validate-seo-indexing.yml
git commit -m "ci: validate SEO indexing architecture"
```

---

### Task 5: Verify the branch and prepare deployment

**Files:**
- Modify: none
- Test: existing workflows plus SEO tests

- [ ] **Step 1: Run the final local checks**

Run:
```bash
node --test tests/seo-metadata.test.mjs tests/seo-pages.test.mjs
node --check src/index.js
node --check src/seo-metadata.js
```
Expected: all PASS.

- [ ] **Step 2: Review the branch diff**

Use GitHub comparison from `main` to `restore/seo-indexing-audit-20260917` and verify only SEO docs, Worker metadata normalization and tests/workflow changed.

- [ ] **Step 3: Open a pull request**

```text
Title: fix: normalize multilingual SEO indexing signals
Base: main
Head: restore/seo-indexing-audit-20260917
```

The PR body must state that the change fixes canonical/hreflang consistency and adds automated validation, but does not guarantee or force Google indexing.

- [ ] **Step 4: After merge, resubmit the sitemap once in Search Console**

Use the existing `https://emperio-tiss.com/sitemap.xml`. Do not mass-request all 65 URLs; inspect key URLs individually after deployment and let Google recrawl the site.
