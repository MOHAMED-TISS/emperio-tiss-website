# Website Architecture Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Consolidate the EMPERIO TISS static site around one shared navigation, typography, hero, header and footer system while preserving working page content and keeping `main` untouched until the test branch passes verification.

**Architecture:** Static HTML remains the application architecture. Shared CSS is split conceptually into core tokens/base and reusable components, while page files keep only genuinely page-specific visual identity. Native `<details>/<summary>` remains the navigation disclosure mechanism.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, GitHub Pages/Cloudflare-compatible deployment.

**Spec:** `ARCHITECTURE.md` and `DESIGN-SYSTEM.md` on the test branch.

## Global Constraints

- Work only on `test/website-architecture-cleanup`; do not modify `main`.
- Serif is Cormorant Garamond; sans is DM Sans; Arabic is Noto Sans Arabic.
- Navigation level 1/2/3 sizes are 40px / 35px / 25px.
- Native `<details>/<summary>` must remain the disclosure mechanism.
- Hero base classes must not own page-specific background media.
- No new page-level `<style>` blocks for shared components.
- Do not use `!important` to repair architectural conflicts.
- Existing flat `.html` redirect stubs remain in place.
- Preserve `alt` coverage and `robots.txt`.

---

### Task 1: Lock test architecture and design decisions

**Files:**
- Create: `ARCHITECTURE.md`
- Create: `DESIGN-SYSTEM.md`
- Create: `docs/superpowers/plans/2026-08-22-website-architecture-cleanup.md`

- [x] Document canonical URLs, component ownership, typography, navigation hierarchy and hero rule.
- [x] Document visual tokens and non-negotiable constraints.

**Test:** Verify the three documents exist on the test branch and explicitly say `main` remains unchanged until acceptance tests pass.

---

### Task 2: Remove only confirmed orphaned files

**Files:**
- Delete only zero-reference files confirmed by full-path grep after a final dependency pass.

- [ ] Re-check exact path references, not basename-only references.
- [ ] Delete confirmed orphans in one isolated commit.
- [ ] Do not delete `global-core.js` yet.
- [ ] Do not delete `ar/rtl-fix.css` until RTL visual verification.

**Test:** repository-wide reference search returns zero references for every deleted path.

---

### Task 3: Canonicalize navigation styling

**Files:**
- Modify: `assets/css/global.css`
- Modify: all affected pages only if their HTML differs from the canonical disclosure tree.
- Modify: `en/products/seafood/fish/index.html` to remove Fish-only navigation styling after the shared rules are live.

**Interfaces:**
- Produces one global navigation visual contract: level 1 40px, level 2 35px, level 3 25px, explicit indentation, one Seafood `+/-` disclosure mark.

- [ ] Generalize the Fish-only level-2/3 rules into the shared nav.
- [ ] Keep the existing global Products `+/-` behavior.
- [ ] Ensure only Seafood receives the nested `+/-` mark.
- [ ] Remove redundant disclosure-marker suppression copies where safe.
- [ ] Migrate any pages still missing the canonical disclosure structure.

**Test:** Open/close Products and Seafood on representative ES/EN/FR/AR pages; grep confirms one declaration of each custom `+`/`−` rule.

---

### Task 4: Canonicalize typography

**Files:**
- Modify: shared font loading in the common site head strategy.
- Modify: `assets/css/global.css` and relevant page CSS.

- [ ] Set `--et-serif` to Cormorant Garamond.
- [ ] Consolidate Google Fonts requests without dropping required Arabic support.
- [ ] Remove Fish-only font loading once shared loading is active.
- [ ] Preserve DM Sans for body/UI and Noto Sans Arabic for AR.

**Test:** inspect computed typography on Home, Products, Fish and AR pages; ensure no Playfair-only component remains unintentionally.

---

### Task 5: Split hero architecture

**Files:**
- Modify: `assets/css/seafood-subpages-en.css`
- Modify: `assets/css/seafood-subpages-es.css`
- Modify: `assets/css/produce-es.css`
- Modify: affected hero HTML files
- Create/modify: shared hero component rules if required by the existing asset structure

- [ ] Make `.page-hero` layout-only.
- [ ] Add one modifier class per hero media variant.
- [ ] Remove Fish inline hero background.
- [ ] Add a single Fish hero image source.
- [ ] Provide dedicated Shellfish and Cephalopod imagery during this phase if available; otherwise keep their intentional gradient variant without duplicate layers until assets are approved.
- [ ] Explicitly remove legacy pseudo-element media.

**Test:** cold-cache reload on Fish three times; confirm no underlayer or flash. Compare Fish/Shellfish/Cephalopods at desktop and mobile.

---

### Task 6: Header consolidation

**Files:**
- Modify: shared header styles and affected pages.
- Merge useful rules from `fish-header-float.css` into the canonical header implementation.

- [ ] Preserve working transparent header/logo/menu/language behavior.
- [ ] Remove Fish-specific header ownership.
- [ ] Do not merge unshipped `global-core.js` scroll behavior until separately approved.

**Test:** verify header, logo, language switcher and hamburger/X on ES/EN/FR/AR at desktop/mobile.

---

### Task 7: Footer consolidation

**Files:**
- Create/modify canonical footer component CSS/markup.
- Modify pages using `intl-footer`, `ar-footer`, `es-footer`, `site-footer`, `fish-site-footer`, `markets-footer`, `footer-band`.
- Delete `fish-footer.css` only after unique rules are migrated.

- [ ] Define one structure and language/RTL data behavior.
- [ ] Preserve existing legal/footer content.
- [ ] Preserve logo sizing improvements.

**Test:** visual comparison on one representative page from each footer family and all four languages.

---

### Task 8: Asset consolidation

**Files:**
- Replace duplicated logo/hero/product assets with one canonical master.
- Update references only where required.

- [ ] Preserve the logo filename/path contract where practical.
- [ ] Compress or replace the 2.6MB logo without visible quality loss.
- [ ] Consolidate duplicate seafood hero/product images.
- [ ] Remove duplicate copies only after reference migration.

**Test:** repository-wide duplicate checksum scan and visual logo diff at header/footer sizes.

---

### Task 9: SEO scaffolding

**Files:**
- Modify all page heads as required.
- Regenerate `sitemap.xml`.

- [ ] Add canonical tags to all live pages.
- [ ] Add reciprocal hreflang entries where translations exist.
- [ ] Include all canonical URLs in sitemap.
- [ ] Preserve robots.txt.

**Test:** XML validation, canonical/hreflang spot checks across all four languages.

---

### Task 10: Final cleanup and verification

- [ ] Re-run orphan/reference audit.
- [ ] Search for `pilot`, `demo`, `soft`, `fix`, `prototype` production filenames/classes that are no longer justified.
- [ ] Count and review remaining `!important` declarations.
- [ ] Validate every navigation path.
- [ ] Validate hero media sources.
- [ ] Run responsive visual verification at 1440, 1280, 1024, 768, 430, 390, 375.
- [ ] Test ES/EN/FR/AR.
- [ ] Check console errors and network failures in a real browser.
- [ ] Review the complete Git diff.

**Final gate:** do not merge to `main` until all acceptance tests pass.
