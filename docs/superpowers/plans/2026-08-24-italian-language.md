# Italian Language Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Add a complete Italian (`/it/`) site that mirrors the existing ES/EN/FR/AR information architecture, visuals, header, navigation and product catalog experience.

**Architecture:** Reuse existing CSS/JS/page templates rather than creating an Italian design system. Extend the shared language/runtime layer to recognize `it`, add Italian routes/labels and create Italian HTML pages mirroring the current EN structure.

**Tech Stack:** Static HTML/CSS/JS, GitHub repository, existing shared header/navigation/catalogue assets.

**Spec:** Approved chat design for Italian rollout on 2026-08-24.

## Global Constraints

- Preserve the current ES homepage header as the visual reference.
- Italian uses `/it/` and must never alter existing ES/EN/FR/AR routes.
- Preserve existing CSS/JS components and catalogue behavior.
- Add IT to the language switcher everywhere the shared header is rendered.
- Italian page content must be Italian; technical/scientific product names remain accurate.

---

### Task 1: Extend shared language runtime

**Files:**
- Modify: `public/assets/js/international-shell.js`
- Modify: `public/assets/js/global.js`
- Modify: `public/assets/js/global-core.js`

- [ ] Add `it` labels, paths, footer copy and language-switch links.
- [ ] Load the international shell for `it`.
- [ ] Add Italian navigation routing and menu labels.
- [ ] Verify existing languages retain their current behavior.

### Task 2: Add Italian core pages

**Files:**
- Create: `public/it/index.html`
- Create: `public/it/about/index.html`
- Create: `public/it/contact/index.html`
- Create: `public/it/markets/index.html`
- Create: `public/it/news/index.html`

- [ ] Mirror current EN structure and CSS.
- [ ] Translate visible copy and metadata into Italian.
- [ ] Use `/it/...` links consistently.

### Task 3: Add Italian product pages

**Files:**
- Create: `public/it/products/index.html`
- Create: `public/it/products/fruits/index.html`
- Create: `public/it/products/vegetables/index.html`
- Create: `public/it/products/seasonal/index.html`
- Create: `public/it/products/seafood/index.html`
- Create: `public/it/products/seafood/fish/index.html`
- Create: `public/it/products/seafood/shellfish/index.html`
- Create: `public/it/products/seafood/cephalopods/index.html`

- [ ] Mirror existing page visuals and scripts.
- [ ] Translate page copy and catalog UI labels into Italian.
- [ ] Keep shared product imagery/data and technical terminology where appropriate.

### Task 4: SEO/navigation verification

**Files:**
- Modify: `public/sitemap.xml`

- [ ] Add Italian URLs.
- [ ] Check language-switch links point to `/it/` equivalents.
- [ ] Search the Italian subtree for accidental `/en/`, `/fr/`, or `/ar/` internal links.
- [ ] Confirm every Italian page loads the canonical shared header runtime.

### Task 5: Verification

- [ ] Run repository-level grep checks for `it` route coverage.
- [ ] Validate all created HTML files are non-empty and reference existing shared CSS/JS.
- [ ] Compare Italian page count against the selected EN page set.
- [ ] Confirm no existing language files were modified except shared runtime/sitemap.
