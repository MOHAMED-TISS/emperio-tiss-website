# English Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the English homepage and all English subpages into one coherent premium B2B food-trade experience with zero broken internal routes or navigation hooks.

**Architecture:** Keep `luxury-nav.js` as the shared navigation controller and isolate English presentation in `public/en/en.css`. Normalize every English page to the same header/overlay/footer structure, then use page-specific semantic classes for content. Preserve `public/products.css`, the logo, images, and Spanish architecture.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Cloudflare Pages-compatible asset paths.

**Spec:** `docs/superpowers/specs/2026-08-18-english-site-redesign.md`

## Global Constraints

- Preserve `public/logo.png` and existing relative path architecture.
- Preserve `luxury-nav.js` as the navigation controller unless tests demonstrate a required defect.
- Preserve the Spanish site and `public/products.css` baseline.
- All English pages use `body.en-page` and the same navigation DOM.
- All English pages load `luxury-nav.js`.
- Internal English links must resolve to existing `/en/` routes.
- No external JS dependency.
- Mobile navigation must remain keyboard accessible and scroll-safe.

---

### Task 1: Baseline validation

**Files:**
- Test: repository English HTML and referenced assets

- [ ] **Step 1: Enumerate all English routes from `public/en/`.**
- [ ] **Step 2: Validate every English page contains `body.en-page`, `#menuToggleBtn`, `#navOverlay`, `.nav-overlay-inner`, `.nav-overlay-links`, `.nav-overlay-side`, `.nav-overlay-foot`, and `luxury-nav.js`.**
- [ ] **Step 3: Validate every local `href` and `src` points to an existing repository path or an intentional site-root route.**
- [ ] **Step 4: Record baseline failures before changing implementation.**

### Task 2: Shared English visual system

**Files:**
- Modify: `public/en/en.css`

- [ ] **Step 1: Replace conflicting English rules with a scoped system under `.en-page`.**
- [ ] **Step 2: Define the shared page shell, typography, header spacing, hero, section rhythm, cards, CTA, footer, focus states and responsive breakpoints.**
- [ ] **Step 3: Ensure product-specific existing styles do not create conflicting backgrounds, typography or spacing on English pages.**
- [ ] **Step 4: Add mobile rules for navigation-safe content spacing and readable type.**

### Task 3: English homepage

**Files:**
- Modify: `public/en/index.html`

- [ ] **Step 1: Keep the normalized navigation DOM and correct English routes.**
- [ ] **Step 2: Build a complete B2B narrative: hero, company proposition, product pillars, market bridge, operating approach and enquiry CTA.**
- [ ] **Step 3: Add semantic sections with reusable English classes covered by `en.css`.**
- [ ] **Step 4: Ensure the page has no dead buttons or placeholder content.**

### Task 4: Company and Markets pages

**Files:**
- Modify: `public/en/about/index.html`
- Modify: `public/en/markets/index.html`

- [ ] **Step 1: Keep shared navigation and footer structure identical to the homepage.**
- [ ] **Step 2: Rewrite Company content around role, sourcing, coordination, logistics and Madrid positioning.**
- [ ] **Step 3: Rewrite Markets content around Europe, Africa and Middle East with clear commercial relevance.**
- [ ] **Step 4: Use the shared visual system rather than generic `home-*` classes.**

### Task 5: Products landing and detail pages

**Files:**
- Modify: `public/en/products/index.html`
- Modify: `public/en/products/seafood.html`
- Modify: `public/en/products/fruits-vegetables.html`
- Modify: `public/en/products/seasonal.html`

- [ ] **Step 1: Preserve the working Products architecture and product-specific page scopes.**
- [ ] **Step 2: Make the landing page visually consistent with the English homepage while retaining clear product navigation.**
- [ ] **Step 3: Give Seafood a marine/editorial identity, with Fish, Shellfish and Cephalopods content and existing image assets where available.**
- [ ] **Step 4: Give Fruits & Vegetables a premium produce identity with seasonal/citrus positioning and existing asset compatibility.**
- [ ] **Step 5: Give Seasonal a strong seasonal sourcing narrative and commercial CTA.**
- [ ] **Step 6: Verify all product detail links resolve correctly.**

### Task 6: Contact page

**Files:**
- Modify: `public/en/contact/index.html`

- [ ] **Step 1: Build a clear B2B enquiry page with product, destination, volume and delivery-period guidance.**
- [ ] **Step 2: Keep the email CTA functional and accessible.**
- [ ] **Step 3: Match the shared English visual system and footer.**

### Task 7: Automated validation after implementation

**Files:**
- Test: all English pages and local assets

- [ ] **Step 1: Re-run route, DOM-hook, asset and link validation.**
- [ ] **Step 2: Assert zero missing local assets and zero missing English routes.**
- [ ] **Step 3: Assert every English page loads the shared navigation script exactly once.**
- [ ] **Step 4: Assert all English pages use `lang="en"` and `body.en-page`.**
- [ ] **Step 5: Inspect the final diff to ensure Spanish/Product baseline files outside the English scope were not changed.**

### Task 8: Review and merge gate

- [ ] **Step 1: Create a PR from the feature branch to `main`.**
- [ ] **Step 2: Review the complete changed-file diff for accidental deletions or route changes.**
- [ ] **Step 3: Run final validation against the PR head.**
- [ ] **Step 4: Merge only when all validations pass.**
