# Arabic Language Separation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separate Arabic (`/ar/`) presentation and content behavior into an explicit AR-owned layer while keeping ES/EN/FR/IT and shared catalogue engines on the canonical shared implementation.

**Architecture:** Keep `public/ar/` as the Arabic content boundary, introduce explicit `assets/css/ar/` and `assets/js/ar/` ownership for Arabic-only behavior, and keep catalogue engines and language-neutral components shared. Migrate incrementally: add the new boundary, switch consumers, replace runtime geography rewriting with explicit Arabic content, then remove legacy AR compatibility files only after dependency tests prove they are unused.

**Tech Stack:** Static HTML, CSS, browser JavaScript, GitHub Actions, Node.js built-in test runner (`node:test`).

**Spec:** `docs/superpowers/specs/2026-09-12-ar-language-separation-design.md`

## Global Constraints

- Keep the canonical shared design and responsive geometry unchanged for ES/EN/FR/IT.
- Do not duplicate shared catalogue engines for Arabic.
- Arabic pages must remain `lang="ar"` and `dir="rtl"`.
- Arabic commercial target/client geography must use `منطقة الشرق الأوسط وشمال أفريقيا (MENA)` instead of individual destination/client/target countries.
- Legitimate technical product-origin/provenance data must not be removed merely because it contains a country name.
- Do not remove `ar-es-normalizer.js` until tests demonstrate that all AR pages no longer depend on its class mapping or generated structure.
- Do not use wholesale `element.textContent = ...` rewrites where they would destroy semantic child markup or heading emphasis.
- Existing AR catalogue behavior, filtering, search, lightbox and image handling must continue to use the shared engines.
- Every structural task ends with focused tests before the next task starts.

---

### Task 1: Establish the restore checkpoint and inventory contract

**Files:**
- Create: none; use existing Git branch `restore/pre-ar-separation-20260912`
- Test: `tests/ar-es-design.test.mjs`

**Interfaces:**
- Consumes: current `main` commit `406980be1fb2af567f7ef58487d7e9ac8c553c25`.
- Produces: a named restore branch and a regression baseline that later tasks can rely on.

- [ ] **Step 1: Verify the restore branch points at current `main`**

Run:
```bash
git ls-remote origin refs/heads/main refs/heads/restore/pre-ar-separation-20260912
```
Expected: both refs resolve to `406980be1fb2af567f7ef58487d7e9ac8c553c25`.

- [ ] **Step 2: Run the existing Arabic regression suite before structural work**

Run:
```bash
node --test tests/ar-es-design.test.mjs tests/ar-es-normalizer.test.mjs tests/ar-page-polish.test.mjs
```
Expected: PASS on the existing baseline.

- [ ] **Step 3: Commit only if baseline test expectations need adjustment for the new architecture**

```bash
git add tests/ar-es-design.test.mjs tests/ar-es-normalizer.test.mjs tests/ar-page-polish.test.mjs
git commit -m "test: lock Arabic separation baseline"
```
Do not modify production files in this task.

---

### Task 2: Add explicit Arabic asset ownership without changing behavior

**Files:**
- Create: `public/assets/css/ar/visual.css`
- Create: `public/assets/css/ar/home.css`
- Create: `public/assets/css/ar/pages.css`
- Create: `public/assets/css/ar/catalogues.css`
- Create: `public/assets/js/ar/loader.js`
- Test: `tests/ar-language-separation.test.mjs`

**Interfaces:**
- Consumes: existing `public/assets/css/ar-visual.css`, `public/assets/css/home-ar.css`, existing AR page CSS rules, `public/assets/js/global-core.js` AR branch.
- Produces: explicit `/assets/css/ar/*` and `/assets/js/ar/*` paths that contain only Arabic-owned concerns.

- [ ] **Step 1: Write failing ownership tests**

Create `tests/ar-language-separation.test.mjs` with these checks:
```js
import fs from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const read = (path) => fs.readFileSync(path, 'utf8');

const arPages = [
  'public/ar/index.html',
  'public/ar/about/index.html',
  'public/ar/contact/index.html',
  'public/ar/markets/index.html',
  'public/ar/news/index.html',
  'public/ar/products/index.html',
  'public/ar/products/seafood/index.html',
  'public/ar/products/seafood/fish/index.html',
  'public/ar/products/seafood/shellfish/index.html',
  'public/ar/products/seafood/cephalopods/index.html',
  'public/ar/products/fruits/index.html',
  'public/ar/products/vegetables/index.html',
  'public/ar/products/seasonal/index.html'
];

test('AR-specific asset paths exist', () => {
  for (const file of [
    'public/assets/css/ar/visual.css',
    'public/assets/css/ar/home.css',
    'public/assets/css/ar/pages.css',
    'public/assets/css/ar/catalogues.css',
    'public/assets/js/ar/loader.js'
  ]) assert.ok(fs.existsSync(file), `${file} must exist`);
});

test('Arabic pages reference the new AR layer', () => {
  for (const file of arPages) {
    const html = read(file);
    assert.match(html, /\/assets\/css\/ar\//, `${file} must reference AR CSS`);
  }
});
```
Run:
```bash
node --test tests/ar-language-separation.test.mjs
```
Expected: FAIL because the new files and references do not exist yet.

- [ ] **Step 2: Copy only current Arabic-owned presentation rules into the new CSS files**

Use these ownership rules:
```text
visual.css    = RTL, Arabic typography, Arabic-specific text rhythm only
home.css      = home-page Arabic visual adjustments only
pages.css     = generic AR page presentation only
catalogues.css = AR-only catalogue presentation adapters only
```
Do not move shared geometry or catalogue engine rules into these files.

- [ ] **Step 3: Create the AR loader with a single explicit entry point**

`public/assets/js/ar/loader.js` must:
```js
(() => {
  'use strict';
  if (!(document.documentElement.lang || '').toLowerCase().startsWith('ar')) return;

  const root = document.head;
  const css = [
    '/assets/css/ar/visual.css',
    '/assets/css/ar/home.css',
    '/assets/css/ar/pages.css',
    '/assets/css/ar/catalogues.css'
  ];

  for (const href of css) {
    if (!root.querySelector(`link[href^="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `${href}?v=20260912-ar-separation-1`;
      root.appendChild(link);
    }
  }
})();
```

- [ ] **Step 4: Add the new AR references to every AR page**

Place the loader after the shared stylesheet declarations and before page behavior scripts:
```html
<script src="/assets/js/ar/loader.js?v=20260912-ar-separation-1" defer></script>
```

- [ ] **Step 5: Run the focused ownership tests**

Run:
```bash
node --test tests/ar-language-separation.test.mjs
```
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add public/assets/css/ar public/assets/js/ar/loader.js public/ar tests/ar-language-separation.test.mjs
git commit -m "refactor: add explicit Arabic asset layer"
```

---

### Task 3: Move Arabic runtime adapters under the AR namespace

**Files:**
- Create: `public/assets/js/ar/es-normalizer.js`
- Create: `public/assets/js/ar/content-geography.js`
- Modify: `public/assets/js/ar/loader.js`
- Modify: `public/assets/js/global-core.js`
- Modify: `tests/ar-language-separation.test.mjs`

**Interfaces:**
- Consumes: existing `ar-es-normalizer.js` and `ar-content-neutralizer.js` behavior.
- Produces: AR-owned runtime modules loaded only when `lang="ar"`.

- [ ] **Step 1: Extend tests to require AR-owned runtime paths**

Add:
```js
test('AR runtime adapters live under the AR namespace', () => {
  for (const file of [
    'public/assets/js/ar/es-normalizer.js',
    'public/assets/js/ar/content-geography.js'
  ]) assert.ok(fs.existsSync(file), `${file} must exist`);
});

test('shared runtime does not directly reference obsolete AR asset filenames', () => {
  const core = read('public/assets/js/global-core.js');
  assert.doesNotMatch(core, /\/assets\/js\/ar-es-normalizer\.js/);
  assert.doesNotMatch(core, /\/assets\/js\/ar-content-neutralizer\.js/);
});
```
Run:
```bash
node --test tests/ar-language-separation.test.mjs
```
Expected: FAIL until the runtime paths are migrated.

- [ ] **Step 2: Move the normalizer implementation into the AR namespace**

Create `public/assets/js/ar/es-normalizer.js` by preserving the current behavior of `ar-es-normalizer.js`, including its AR-to-ES class mappings, Arabic catalogue translations, RTL handling and lightbox integration. Do not change the functional mapping in this task.

- [ ] **Step 3: Replace the broad neutralizer with a targeted geography adapter**

Create `public/assets/js/ar/content-geography.js` with this contract:
```js
(() => {
  'use strict';
  const root = document.documentElement;
  if (!(root.lang || '').toLowerCase().startsWith('ar')) return;

  const MENA = 'منطقة الشرق الأوسط وشمال أفريقيا (MENA)';
  const targetPhrases = [
    /السوق السعودي/g,
    /الأسواق السعودية/g,
    /المشترين في السعودية/g,
    /سوق الشرق الأوسط/g,
    /أسواق الشرق الأوسط/g,
    /دول الخليج/g,
    /أسواق الخليج/g,
    /الأسواق الخليجية/g,
    /السوق الخليجي/g,
    /في الخليج/g,
    /لأسواق الخليج/g,
    /إسبانيا · فرنسا · إيطاليا · ألمانيا · هولندا/g,
    /المغرب · تونس · موريتانيا · غرب أفريقيا/g
  ];

  const replaceTextNode = (node) => {
    let value = node.nodeValue || '';
    for (const pattern of targetPhrases) value = value.replace(pattern, MENA);
    if (value !== node.nodeValue) node.nodeValue = value;
  };

  const scan = (scope) => {
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || !node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
        if (/^(SCRIPT|STYLE|NOSCRIPT)$/i.test(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest('[data-latin="true"], .scientific-name, .technical-value')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) replaceTextNode(node);
  };

  const run = () => document.body && scan(document.body);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();
```
This deliberately operates on text nodes instead of replacing `container.textContent`, preserving child markup and heading emphasis.

- [ ] **Step 4: Update the AR loader and global runtime entry**

`public/assets/js/ar/loader.js` must load both runtime adapters after the shared DOM is available:
```js
for (const src of [
  '/assets/js/ar/es-normalizer.js?v=20260912-ar-separation-1',
  '/assets/js/ar/content-geography.js?v=20260912-ar-separation-1'
]) {
  if (!document.querySelector(`script[src^="${src.split('?')[0]}"]`)) {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    document.head.appendChild(script);
  }
}
```
Remove direct loading of the old AR runtime filenames from `global-core.js` and make its AR branch load only `/assets/js/ar/loader.js`.

- [ ] **Step 5: Run focused runtime tests**

Run:
```bash
node --test tests/ar-language-separation.test.mjs tests/ar-es-normalizer.test.mjs tests/ar-es-design.test.mjs
```
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add public/assets/js/ar public/assets/js/global-core.js tests/ar-language-separation.test.mjs
 git commit -m "refactor: isolate Arabic runtime adapters"
```

---

### Task 4: Make Arabic commercial geography explicit in source content

**Files:**
- Modify: `public/ar/index.html`
- Modify: `public/ar/markets/index.html`
- Modify: `public/ar/products/seafood/fish/index.html`
- Modify: `public/ar/products/index.html`
- Modify: `public/ar/products/seafood/index.html`
- Modify: `public/assets/js/market-catalogue.js`
- Modify: `public/assets/js/fruit-catalog.js` only where the text describes target market rather than origin/availability
- Test: `tests/ar-language-separation.test.mjs`

**Interfaces:**
- Consumes: existing Arabic page content and shared catalogue data.
- Produces: source-level MENA commercial wording; technical origin data remains intact.

- [ ] **Step 1: Add failing source-content tests**

Add:
```js
const commercialCountryTerms = /(?:السوق السعودي|الأسواق السعودية|المشترين في السعودية|سوق الشرق الأوسط|أسواق الشرق الأوسط|دول الخليج|أسواق الخليج|الأسواق الخليجية|السوق الخليجي|إسبانيا · فرنسا · إيطاليا · ألمانيا · هولندا|المغرب · تونس · موريتانيا · غرب أفريقيا)/g;

test('Arabic commercial source content uses MENA wording', () => {
  const files = [
    'public/ar/index.html',
    'public/ar/markets/index.html',
    'public/ar/products/index.html',
    'public/ar/products/seafood/index.html',
    'public/ar/products/seafood/fish/index.html'
  ];
  for (const file of files) {
    const html = read(file);
    assert.doesNotMatch(html, commercialCountryTerms, `${file} must not contain country-based commercial target wording`);
  }
});

test('Arabic source pages include the explicit MENA region where commercial geography is stated', () => {
  const markets = read('public/ar/markets/index.html');
  const fish = read('public/ar/products/seafood/fish/index.html');
  assert.match(markets, /منطقة الشرق الأوسط وشمال أفريقيا \(MENA\)/);
  assert.match(fish, /منطقة الشرق الأوسط وشمال أفريقيا \(MENA\)/);
});
```
Run:
```bash
node --test tests/ar-language-separation.test.mjs
```
Expected: FAIL against the existing country-specific source copy.

- [ ] **Step 2: Replace market-target copy in AR home and markets pages**

For commercial target lists, use:
```html
<p>منطقة الشرق الأوسط وشمال أفريقيا (MENA)</p>
```
Do not rewrite office-location strings such as `مدريد · إسبانيا` unless they are being presented as a commercial destination/client.

- [ ] **Step 3: Replace the Arabic Fish commercial note and metadata**

Use MENA wording in visible copy and meta description/OG description. Keep technical product-origin fields unchanged.

- [ ] **Step 4: Update shared dynamic AR-facing market text at the source of generation**

Where `market-catalogue.js` or another shared generator creates Arabic market-target text, replace the target wording with the MENA region. Do not add `lang === 'ar'` branches for generic catalogue behavior; instead use an existing language-aware label/data lookup where available.

- [ ] **Step 5: Keep provenance data intact**

Do not alter entries such as product origin, FAO areas, supply routes or seasonal origin labels merely because they contain Spain, Morocco, Tunisia or another country.

- [ ] **Step 6: Run source-content tests**

Run:
```bash
node --test tests/ar-language-separation.test.mjs tests/market-catalogue.test.mjs
```
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add public/ar public/assets/js/market-catalogue.js public/assets/js/fruit-catalog.js tests/ar-language-separation.test.mjs
 git commit -m "content: make Arabic commercial geography MENA"
```

---

### Task 5: Remove the legacy AR files and old page-level loading

**Files:**
- Delete: `public/assets/css/ar-pages.css`
- Delete: `public/assets/css/ar-visual.css`
- Delete: `public/assets/js/ar-es-normalizer.js`
- Delete: `public/assets/js/ar-content-neutralizer.js`
- Modify: all `/ar/**/index.html` files that still load deleted assets directly
- Modify: `tests/ar-es-design.test.mjs`
- Modify: `tests/ar-language-separation.test.mjs`

**Interfaces:**
- Consumes: AR-owned replacements from Tasks 2–4.
- Produces: no active production dependency on the legacy AR asset filenames.

- [ ] **Step 1: Add failing legacy-removal tests**

Add:
```js
test('legacy Arabic asset files are no longer present', () => {
  for (const file of [
    'public/assets/css/ar-pages.css',
    'public/assets/css/ar-visual.css',
    'public/assets/js/ar-es-normalizer.js',
    'public/assets/js/ar-content-neutralizer.js'
  ]) assert.equal(fs.existsSync(file), false, `${file} must be removed`);
});

test('Arabic pages do not reference legacy Arabic assets', () => {
  for (const file of arPages) {
    const html = read(file);
    assert.doesNotMatch(html, /(?:ar-pages\.css|ar-visual\.css|ar-es-normalizer\.js|ar-content-neutralizer\.js)/);
  }
});
```
Run:
```bash
node --test tests/ar-language-separation.test.mjs
```
Expected: FAIL until cleanup is complete.

- [ ] **Step 2: Remove direct legacy stylesheet/script references from AR pages**

Delete only references to the four obsolete files. Preserve all shared CSS/JS references and all shared catalogue-engine scripts.

- [ ] **Step 3: Delete the four legacy files**

Use Git deletion so the history remains visible:
```bash
git rm public/assets/css/ar-pages.css public/assets/css/ar-visual.css public/assets/js/ar-es-normalizer.js public/assets/js/ar-content-neutralizer.js
```

- [ ] **Step 4: Update tests to assert the new boundary**

Replace old assertions that require the legacy paths with assertions that require `/assets/css/ar/` and `/assets/js/ar/`.

- [ ] **Step 5: Run all Arabic focused tests**

Run:
```bash
node --test tests/ar-language-separation.test.mjs tests/ar-es-design.test.mjs tests/ar-es-normalizer.test.mjs tests/ar-page-polish.test.mjs
```
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add public/ar public/assets/css public/assets/js tests
git commit -m "refactor: remove legacy Arabic compatibility layer"
```

---

### Task 6: Prove shared-language isolation and final multilingual compatibility

**Files:**
- Modify: `tests/ar-language-separation.test.mjs`
- Modify: existing workflow files only if the current CI does not discover the new test automatically

**Interfaces:**
- Consumes: final AR namespace and shared files.
- Produces: regression coverage proving AR isolation without altering ES/EN/FR/IT behavior.

- [ ] **Step 1: Add cross-language isolation tests**

Add:
```js
const latinPages = [
  'index.html',
  'en/index.html',
  'fr/index.html',
  'it/index.html'
];

test('non-AR pages do not load AR-only assets', () => {
  for (const file of latinPages) {
    const html = read(`public/${file}`);
    assert.doesNotMatch(html, /\/assets\/(?:css|js)\/ar\//, `${file} must not load the AR layer`);
  }
});

test('shared files do not contain Arabic-only branching introduced by the separation', () => {
  for (const file of [
    'public/assets/js/global-core.js',
    'public/assets/js/market-catalogue.js',
    'public/assets/js/fish-catalog.js'
  ]) {
    const source = read(file);
    assert.doesNotMatch(source, /ar-content-neutralizer\.js|ar-es-normalizer\.js|ar-pages\.css|ar-visual\.css/);
  }
});
```

- [ ] **Step 2: Run the complete relevant regression matrix**

Run:
```bash
node --test tests/ar-language-separation.test.mjs tests/ar-es-design.test.mjs tests/ar-es-normalizer.test.mjs tests/ar-page-polish.test.mjs tests/market-catalogue.test.mjs tests/contact-language-regression.mjs tests/about-content-regression.mjs
```
Expected: PASS.

- [ ] **Step 3: Run the repository's existing multilingual workflow locally if its command is documented**

Inspect the workflow definition under `.github/workflows/` and run the same Node test commands locally. Do not substitute a different test command when an existing workflow command is available.

- [ ] **Step 4: Push the refactor branch and wait for GitHub Actions**

```bash
git push -u origin refactor/ar-language-separation-20260912
```
Expected: the existing Arabic/multilingual validation workflows run against the branch.

- [ ] **Step 5: Verify CI conclusions before any merge**

Use GitHub Actions results for the branch commit and require successful conclusions for the relevant Arabic and multilingual workflows.

- [ ] **Step 6: Commit any workflow-test registration changes separately**

```bash
git add .github/workflows tests
 git commit -m "test: register Arabic separation regression suite"
```
Only create this commit when an existing workflow does not already discover `tests/*.mjs`.

---

### Task 7: Review and merge as one controlled architectural change

**Files:**
- No new production files.
- Review: all commits on `refactor/ar-language-separation-20260912`.

**Interfaces:**
- Consumes: verified refactor branch and restore branch.
- Produces: a mergeable PR whose diff is limited to the Arabic ownership refactor and its tests.

- [ ] **Step 1: Compare the refactor branch with `main`**

Verify the diff contains only:
```text
AR asset ownership
AR runtime entry points
AR commercial geography content
AR regression tests
legacy AR asset removals
```
Expected: no product image reorder, no catalogue engine duplication, no ES/EN/FR/IT visual redesign.

- [ ] **Step 2: Confirm restore branch exists and points to the pre-migration state**

```bash
git ls-remote origin refs/heads/restore/pre-ar-separation-20260912
```
Expected: the restore branch still resolves to `406980be1fb2af567f7ef58487d7e9ac8c553c25`.

- [ ] **Step 3: Open the PR only after CI is green**

PR title:
```text
refactor: separate Arabic language layer
```

PR body must state that Arabic presentation/runtime assets are isolated while shared catalogue engines remain shared, and that the restore branch is preserved.

- [ ] **Step 4: Review the PR diff for accidental shared-file drift**

Reject the change if any unrelated ES/EN/FR/IT layout or catalogue geometry changes appear.

- [ ] **Step 5: Merge only after the final verification evidence is green**

Use the repository's allowed merge method and record the resulting merge SHA.
