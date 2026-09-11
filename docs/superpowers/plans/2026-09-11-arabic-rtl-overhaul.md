# Arabic RTL Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate the Arabic experience into one RTL visual system while preserving working catalogue engines and keeping all changes isolated from `main` until verified.

**Architecture:** Replace the competing Arabic visual layers with one canonical `ar-visual.css`, make the shared international shell language-safe for Arabic, align static Arabic catalogue/taxonomy content to the three-category model, and remove obsolete Arabic-only presentation assets only after their selectors are no longer referenced. Catalogue engines and data remain canonical; Arabic receives presentation-level RTL rules rather than a second catalogue implementation.

**Tech Stack:** Static HTML, CSS, JavaScript, GitHub repository contents, existing international shell and catalogue scripts.

**Spec:** `docs/superpowers/specs/2026-09-11-arabic-rtl-design.md`

## Global Constraints

- Palette: navy / ivory / champagne-gold only; no green remnants, including `!important` rules.
- Typography: Noto Sans Arabic for Arabic UI/body; controlled Latin typography for Latin product/scientific/technical tokens.
- Header navigation exactly: `الرئيسية · الشركة · المنتجات · الأسواق · الأخبار · اتصل بنا`.
- Language switcher always exposes ES / EN / FR / IT / AR.
- Product taxonomy exactly: `المأكولات البحرية`, `الفواكه والخضروات`, `المنتجات الموسمية`.
- Cephalopod terminology: `رأسيات الأرجل`; shellfish/molluscs: `الرخويات`.
- No forced 100vh Arabic heroes; spacing is content-led and responsive.
- Do not change ES/EN/FR/IT visuals except shared code must become language-safe.
- Work only on restore branch until verification is complete.

---

### Task 1: Establish isolated restore branch and preserve baseline

**Files:**
- Create/maintain branch: `restore/ar-rtl-overhaul-20260911`
- Preserve baseline commit: current `main` HEAD before implementation.

- [ ] **Step 1: Create the restore branch from the current `main` HEAD.**

- [ ] **Step 2: Record the branch base SHA in the implementation notes and use it as the restore point.**

- [ ] **Step 3: Ensure no implementation commit is made directly to `main`.**

- [ ] **Step 4: Commit the approved design/spec and plan only on the restore branch.**

---

### Task 2: Replace the competing Arabic visual layers with one canonical RTL layer

**Files:**
- Modify: `public/assets/css/ar-visual.css`
- Modify: `public/assets/css/ar-pages.css` only as needed to remove conflicting selectors after migration
- Modify: `public/assets/js/global.js` for Arabic asset versioning only if required

**Interfaces:**
- Consumes existing page classes (`ar-page`, `es-page`, `home-page`, `markets-current`, `news-current`, catalogue classes) and shared shell classes.
- Produces a single Arabic presentation layer loaded once by `global.js`.

- [ ] **Step 1: Replace blanket Arabic font application with scoped selectors.**

```css
html[lang="ar"] body,
html[lang="ar"] .ar-page,
html[lang="ar"] .es-page,
html[lang="ar"] .news-current,
html[lang="ar"] .markets-current {
  font-family: "Noto Sans Arabic", var(--et-sans, "DM Sans", sans-serif);
}

html[lang="ar"] .et-language-switch,
html[lang="ar"] .et-whatsapp,
html[lang="ar"] .et-linkedin,
html[lang="ar"] .latin-token,
html[lang="ar"] .scientific-name,
html[lang="ar"] .technical-value {
  font-family: var(--et-sans, "DM Sans", sans-serif);
}
```

- [ ] **Step 2: Set the canonical palette variables and explicitly eliminate green variables.**

```css
html[lang="ar"] body {
  --et-deep: #071b31;
  --et-navy: #0b2540;
  --et-ink: #10233a;
  --et-paper: #f4f1e8;
  --et-ivory: #f4f1e8;
  --et-gold: #c9a35f;
  --et-muted: #69727b;
  --ar-ink: #10233a;
  --ar-deep: #071b31;
  --ar-paper: #f4f1e8;
  --ar-gold: #c9a35f;
  --ar-muted: #69727b;
}
```

- [ ] **Step 3: Remove full-screen Arabic hero overrides and use content-led sizing.**

```css
html[lang="ar"] .ar-page .ar-hero,
html[lang="ar"] .es-page .es-hero,
html[lang="ar"] .news-current .news-hero,
html[lang="ar"] .markets-current .current-stage {
  min-height: auto;
}

@media (min-width: 801px) {
  html[lang="ar"] .ar-page .ar-hero,
  html[lang="ar"] .es-page .es-hero,
  html[lang="ar"] .news-current .news-hero {
    padding-block: 150px 100px;
  }
}

@media (max-width: 800px) {
  html[lang="ar"] .ar-page .ar-hero,
  html[lang="ar"] .es-page .es-hero,
  html[lang="ar"] .news-current .news-hero {
    padding-block: 112px 64px;
  }
}
```

- [ ] **Step 4: Define one Arabic type hierarchy and one shared container rhythm for headings, labels, body, cards, buttons and CTAs.**

- [ ] **Step 5: Preserve Latin rendering for product names, scientific names, measurements, grades and technical values rather than translating the typographic treatment.**

- [ ] **Step 6: Commit the visual-system consolidation.**

```bash
git add public/assets/css/ar-visual.css public/assets/css/ar-pages.css public/assets/js/global.js
git commit -m "feat: consolidate Arabic RTL visual system"
```

---

### Task 3: Make the header, mobile overlay and language selector canonical for Arabic

**Files:**
- Modify: `public/assets/js/international-shell.js`
- Modify: `public/assets/js/global.js`
- Modify: affected Arabic static HTML files only when they contain hard-coded duplicate shell markup
- Modify: shared header CSS only when required for RTL-safe structure

**Interfaces:**
- Consumes `lang === 'ar'`, canonical header classes, and existing overlay DOM.
- Produces one consistent Arabic header/overlay with complete five-language switching.

- [ ] **Step 1: Ensure Arabic gets the same navigation structure as other international pages and remove empty `.nav-overlay-links` placeholders from Arabic static pages when the JS shell supplies the canonical overlay.**

- [ ] **Step 2: Render the Arabic menu labels exactly as:**

```text
الرئيسية
الشركة
المنتجات
الأسواق
الأخبار
اتصل بنا
```

- [ ] **Step 3: Ensure the products menu exposes the canonical three-category hierarchy and seafood subcategories without introducing a separate Arabic taxonomy.**

- [ ] **Step 4: Guarantee every Arabic switcher contains ES, EN, FR, IT, AR and keeps the switcher itself LTR.**

- [ ] **Step 5: Remove duplicated WhatsApp/header injection paths where the same element can be inserted twice by mutation observers.**

- [ ] **Step 6: Commit the shared shell changes.**

```bash
git add public/assets/js/international-shell.js public/assets/js/global.js public/ar

git commit -m "fix: unify Arabic header navigation and languages"
```

---

### Task 4: Unify the footer implementation across every Arabic route

**Files:**
- Modify: `public/assets/js/international-shell.js`
- Modify: `public/assets/js/global.js`
- Modify: Arabic static page files that hard-code `.ar-footer` / `.es-footer` fragments
- Modify: shared footer CSS as required

- [ ] **Step 1: Choose the universal international footer as the single DOM contract for Arabic.**

- [ ] **Step 2: Remove page-specific Arabic footer rendering once the universal footer exists.**

- [ ] **Step 3: Make the footer RTL-safe for Arabic while keeping legal links, contact details and social links in a consistent structure.**

- [ ] **Step 4: Ensure LinkedIn is inserted once and WhatsApp/contact affordances remain consistent.**

- [ ] **Step 5: Commit the footer unification.**

```bash
git add public/assets/js/international-shell.js public/assets/js/global.js public/ar public/assets/css

git commit -m "fix: unify Arabic footer component"
```

---

### Task 5: Correct Arabic product landing and taxonomy content

**Files:**
- Modify: `public/ar/products/index.html`
- Modify: `public/ar/products/seafood.html`
- Modify: `public/ar/products/fruits-vegetables.html`
- Modify: `public/ar/products/seasonal.html`
- Review: `public/ar/products/fruits/`, `public/ar/products/vegetables/`, `public/ar/products/seafood/`, `public/ar/products/seasonal/`

- [ ] **Step 1: Replace the `Four worlds` taxonomy with exactly three top-level product categories.**

- [ ] **Step 2: Use the canonical Arabic labels:**

```text
المأكولات البحرية
الفواكه والخضروات
المنتجات الموسمية
```

- [ ] **Step 3: Remove category language that separates fruits and vegetables as top-level products.**

- [ ] **Step 4: Align shellfish/cephalopod terminology across all relevant Arabic files, using `الرخويات` and `رأسيات الأرجل` consistently.**

- [ ] **Step 5: Keep URLs/routes compatible with existing catalogue architecture; do not delete a working route solely because its parent category is now grouped.**

- [ ] **Step 6: Commit taxonomy corrections.**

```bash
git add public/ar/products
git commit -m "fix: align Arabic product taxonomy"
```

---

### Task 6: Align Arabic Fish catalogue presentation without changing the engine

**Files:**
- Modify: Arabic Fish HTML/inline styling under `public/ar/products/seafood/`
- Modify: Arabic catalogue CSS only where needed for RTL presentation
- Preserve: existing image manifest and catalogue JavaScript/data

- [ ] **Step 1: Identify and remove Arabic-only presentation rules layered on top of the canonical fish catalogue when they duplicate the same layout responsibilities.**

- [ ] **Step 2: Apply RTL direction to the UI while leaving gallery sequence, image manifest and filter logic untouched.**

- [ ] **Step 3: Localize visible operational labels for filters, CTA, category headings and metadata into Arabic; preserve scientific names and measurement values in controlled Latin typography.**

- [ ] **Step 4: Match the ES reference geometry for cards, section widths, filter bar, gallery spacing and CTA proportions, mirrored for RTL where directionally appropriate.**

- [ ] **Step 5: Confirm no Arabic-only catalogue engine has been introduced.**

- [ ] **Step 6: Commit fish presentation alignment.**

```bash
git add public/ar/products/seafood public/assets/css
git commit -m "fix: align Arabic fish catalogue presentation"
```

---

### Task 7: Bring remaining Arabic catalogue pages into the same visual hierarchy

**Files:**
- Modify: Arabic shellfish, cephalopods, fruits, vegetables and seasonal pages under `public/ar/products/`
- Modify: relevant catalogue presentation CSS only

- [ ] **Step 1: Give shellfish and cephalopods the same hero → filter/intro → catalogue → CTA hierarchy as Fish where an operational catalogue exists.**

- [ ] **Step 2: Give fruits, vegetables and seasonal pages the same editorial hierarchy without manufacturing catalogue data that does not exist.**

- [ ] **Step 3: Keep section backgrounds separated; no inherited citrus/seafood background should bleed into unrelated categories.**

- [ ] **Step 4: Verify cards use consistent dimensions, borders, spacing and image treatment across Arabic subpages.**

- [ ] **Step 5: Commit remaining catalogue presentation alignment.**

```bash
git add public/ar/products public/assets/css
git commit -m "fix: harmonize Arabic catalogue page hierarchy"
```

---

### Task 8: Remove obsolete Arabic-only CSS and duplicate shell code

**Files:**
- Delete only verified-obsolete files/selectors under `public/assets/css/` and `public/assets/js/`
- Modify: `public/ar/**` references when deleting a file that is directly linked from an Arabic page

- [ ] **Step 1: Search for every reference to `ar-pages.css`, `.ar-footer`, `.es-footer`, `nav-overlay-links`, duplicated language switchers and green palette variables.**

- [ ] **Step 2: Delete only files with zero remaining references after Tasks 2–7.**

- [ ] **Step 3: Remove dead inline `<style>` blocks that exist only to restore obsolete Arabic presentation rules.**

- [ ] **Step 4: Commit the cleanup with the deleted paths explicitly listed in the commit.**

```bash
git add -A
git commit -m "chore: remove obsolete Arabic presentation layers"
```

---

### Task 9: Verify every Arabic route and prepare main integration

**Files:**
- No new runtime files; verification only
- Optional: `docs/superpowers/plans/2026-09-11-arabic-rtl-overhaul.md` for verification notes

- [ ] **Step 1: Enumerate all `/ar/` routes from repository directories and HTML references.**

- [ ] **Step 2: Static-check Arabic files for green colour literals/variables and obsolete footer classes.**

- [ ] **Step 3: Static-check every Arabic HTML page for ES/EN/FR/IT/AR language links.**

- [ ] **Step 4: Static-check for duplicate `.site-header` and duplicate `<footer>` blocks per page.**

- [ ] **Step 5: Static-check for blanket selectors equivalent to `body * { font-family: ... }` under Arabic.**

- [ ] **Step 6: Static-check Arabic product pages for `Four worlds` and inconsistent `رأس...` taxonomy.**

- [ ] **Step 7: Run the site's available build/lint/test command if present; otherwise validate HTML/CSS/JS through repository-level syntax checks available in the project.**

- [ ] **Step 8: Inspect the live/preview Arabic pages at desktop and mobile breakpoints before considering the branch complete.**

- [ ] **Step 9: Run `git diff main...restore/ar-rtl-overhaul-20260911` and verify only intended Arabic/shared-shell changes exist.**

- [ ] **Step 10: Only after verification, prepare the branch for PR/merge to `main`.**
