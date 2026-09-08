# Multilingual Market-Localised Catalogues Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generalise the Spanish seafood and produce catalogues to EN/FR/IT/AR while preserving the established visual system, technical specification rules, image ordering, multilingual navigation, and market-specific product priorities.

**Architecture:** Keep one canonical product catalogue/data source and one shared catalogue renderer/market layer. Language pages provide only the page shell, locale and category; the shared layer supplies translated labels, product names, market priority ordering, image galleries and filters. Market priority changes ordering/presentation only; it never invents products, alters technical facts, or changes the Spanish master catalogue.

**Tech Stack:** Static HTML, vanilla JavaScript, CSS, JSON catalogue data, GitHub Actions.

**Spec:** This plan implements the approved multilingual catalogue generalisation request in the conversation.

## Global Constraints

- Preserve the established Spanish catalogue visual language: editorial typography, ivory/navy/champagne palette, restrained cards, generous spacing, technical specifications and image-first presentation.
- EN/FR/IT remain LTR; AR remains RTL and must retain Arabic typography and direction.
- Existing global header/navigation/footer systems must not be redesigned as part of this work.
- Product facts remain canonical; market priority may reorder references but must not change scientific names, origin, condition, calibre or availability facts.
- Image order is always natural filename order: base image first, then numeric variants (`Naranja.jpg`, `Naranja 1.jpg`, `Naranja 2.jpg`, `Naranja 10.jpg`).
- Product images remain shared across languages; translations do not duplicate image assets.
- Market priority is evidence-led and must be encoded explicitly per language/market, not inferred from browser locale.

---

### Task 1: Shared market catalogue model

**Files:**
- Create: `public/assets/data/catalogue-market-priority.json`
- Create: `public/assets/js/market-catalogue.js`
- Test: `tests/market-catalogue.test.mjs`

- [ ] Define locale metadata and market priority lists for ES, EN, FR, IT and AR across seafood/fish, seafood/shellfish, seafood/cephalopods, fruits and vegetables.
- [ ] Implement canonical product loading from `catalog-v1.3.json` and shared image loading from `product-images.json`.
- [ ] Implement natural image ordering and market-priority ordering independently.
- [ ] Implement translated labels and product names with safe Spanish fallback only where a translation is genuinely absent.
- [ ] Render catalogue cards using the established technical fields and existing visual hooks.
- [ ] Support search, condition filters and category filters where the source catalogue exposes those fields.
- [ ] Keep AR markup RTL-safe and avoid directional assumptions in controls.

### Task 2: Seafood category generalisation

**Files:**
- Modify: EN/FR/IT/AR seafood category pages and fish/shellfish/cephalopod catalogue pages.
- Modify: relevant seafood catalogue scripts only where necessary to hand rendering to the shared layer.
- Modify: shared seafood catalogue CSS only where necessary to unify visual behaviour.

- [ ] Generalise Fish first and use it as the reference implementation.
- [ ] Add full shellfish and cephalopod catalogue rendering to all four non-Spanish locales.
- [ ] Preserve existing Italian market-led fish selection as a priority input rather than deleting it.
- [ ] Add market-specific ordering:
  - ES: Mediterranean/Spanish wholesale relevance first.
  - EN: salmon, tuna, cod/hake/whitefish and prawns-led ordering, reflecting current UK demand.
  - FR: salmon, cod and high-value fresh references first, followed by relevant shellfish.
  - IT: gilthead seabream, mussels, seabass, salmon, swordfish and octopus/squid relevance first.
  - AR: Gulf/Middle-East relevance first among available references, prioritising fish and shrimp, with premium/fresh positioning.
- [ ] Never create a product merely because market research mentions it; only existing canonical references may appear.

### Task 3: Fruits & Vegetables generalisation

**Files:**
- Modify: EN/FR/IT/AR fruits and vegetables pages.
- Modify: `public/assets/js/fruit-catalog.js` / `products-catalog.js` only where needed to use the shared market layer.
- Modify: produce image sync integration only if language pages currently bypass it.

- [ ] Generalise the Spanish Fruits and Vegetables catalogue structure to all four locales.
- [ ] Preserve the current citrus-family presentation and product-image behaviour.
- [ ] Apply market-specific priority within the products actually present in the canonical catalogue.
- [ ] Keep technical produce fields shared and language-neutral where appropriate.
- [ ] Preserve natural image filename ordering across all locales.

### Task 4: Visual and RTL unification

**Files:**
- Create/modify: `public/assets/css/catalogue-market-unified.css`
- Modify: language catalogue pages to load the shared visual layer.

- [ ] Match the Spanish catalogue hierarchy: hero → market/category context → emblematic/priority selection → working catalogue → technical specification → B2B CTA.
- [ ] Keep existing language-specific typography where it is intentional, but unify spacing, card proportions, image treatment, filters and lightbox behaviour.
- [ ] Add RTL-specific rules for Arabic without mirroring inappropriate Latin visual conventions.
- [ ] Ensure mobile and desktop layouts remain consistent.

### Task 5: Automated validation and regression coverage

**Files:**
- Modify: `tests/market-catalogue.test.mjs`
- Create/modify: `.github/workflows/validate-market-catalogues.yml`

- [ ] Validate every target language/category page loads the shared catalogue layer.
- [ ] Validate all five locales have priority definitions for every target category.
- [ ] Validate no market priority references a nonexistent product ID.
- [ ] Validate natural image ordering, including numeric values above 9.
- [ ] Validate Arabic pages retain `dir="rtl"`.
- [ ] Validate image manifests are not duplicated per language.
- [ ] Run syntax and test checks before claiming completion.

### Task 6: Market rationale documentation

**Files:**
- Create: `docs/catalogue-market-priority.md`

- [ ] Document the market-priority logic and evidence sources.
- [ ] Explain that priority affects merchandising order, not factual catalogue content.
- [ ] Record the date/version of the market research so future updates can be made deliberately.
