# Product Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Establish a structured, multilingual-ready B2B product catalogue behind the Spanish Products gateway without disturbing the current visual system.

**Architecture:** Product records live in one structured JSON catalogue. A small browser layer loads and validates the catalogue, while the existing HTML/CSS remains responsible for presentation. Product families are stable IDs so EN/FR/AR can consume the same records later.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, JSON, GitHub/Cloudflare Pages.

**Spec:** Product technical architecture agreed in the EMPERIO TISS project conversation.

## Global Constraints

- Preserve the current Products visual system and page architecture.
- Do not duplicate product data per language.
- Seafood: fish mainly fresh; shellfish and cephalopods mainly frozen, with product-level exceptions.
- Fruits: Citrus, Exotics, Core Produce.
- Vegetables do not need an additional subcategory layer.
- Technical fields must support commercial name, scientific name, origin, FAO zone where applicable, calibre, quality, condition, format, packaging, availability and imagery.

---

### Task 1: Product data foundation

**Files:**
- Create: `public/products/catalog.json`
- Create: `public/products-catalog.js`

- [x] Define stable family/subcategory IDs.
- [x] Add representative seafood and produce records.
- [x] Add the complete technical field set required for future product detail pages.
- [x] Add runtime validation before exposing the catalogue to the page.

### Task 2: Spanish Products gateway integration

**Files:**
- Modify: `public/products/index.html`

- [ ] Load the catalogue after the existing navigation script.
- [ ] Keep the current visual cards and copy intact while making the page aware of the structured catalogue.
- [ ] Verify the catalogue loads without changing the current layout.

### Task 3: Product detail expansion

**Files:**
- Future: `public/products/product.html`
- Future: product detail rendering layer

- [ ] Build one reusable product detail template.
- [ ] Display buyer-priority fields first and secondary technical fields progressively.
- [ ] Connect enquiry CTA to the existing contact flow.
