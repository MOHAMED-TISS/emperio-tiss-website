# Arabic Language Separation Design

**Date:** 2026-09-12
**Status:** Proposed architecture
**Repository:** `MOHAMED-TISS/emperio-tiss-website`

## Goal

Make the Arabic (`/ar/`) implementation a clearly separated language layer while preserving the existing shared design, catalogue engines, responsive geometry, assets, and functionality used by ES/EN/FR/IT.

## Current state

Arabic pages are already partially separated at the URL/content level, but implementation concerns remain mixed. Current AR-specific assets include `ar-visual.css`, `ar-pages.css`, `ar-catalogue-taxonomy.js`, `ar-es-normalizer.js`, and `ar-content-neutralizer.js`. Some AR pages also load shared files directly and contain page-specific inline Arabic overrides.

The present Arabic catalogue architecture therefore has two layers of compatibility: shared catalogue engines plus an AR-to-ES normalization bridge. This has helped stabilize the existing site but increases coupling and makes Arabic changes more likely to affect or depend on shared language implementations.

## Target architecture

```text
public/
├── ar/                         # Arabic HTML/content
│   ├── index.html
│   ├── about/
│   ├── contact/
│   ├── markets/
│   ├── news/
│   └── products/
│
└── assets/
    ├── css/
    │   ├── shared/             # canonical shared design/system
    │   └── ar/                 # Arabic-only presentation adapters
    └── js/
        ├── shared/             # canonical shared functionality
        └── ar/                 # Arabic-only behavior/content adapters
```

The physical directory split is introduced incrementally. Existing shared paths are not moved merely for naming consistency if that would create unnecessary churn; the architectural requirement is that AR-only behavior has an unambiguous ownership boundary.

## Boundaries

### Shared layer

The shared layer remains the single source of truth for:

- core layout and responsive geometry
- canonical page/component structure
- header/footer mechanics where behavior is language-neutral
- product catalogue engines
- filtering, search, lightbox and image behavior
- shared buttons and interaction patterns
- common accessibility mechanics

No ES/EN/FR/IT file should gain Arabic-specific branching merely to support AR.

### Arabic layer

The Arabic layer owns:

- `lang="ar"` and `dir="rtl"` presentation behavior
- Arabic typography and font family choices
- Arabic navigation/content labels
- Arabic-specific copy and metadata
- Arabic market/commercial geography wording
- RTL-specific visual corrections
- Arabic-specific adapters needed by shared engines

### Commercial geography rule

Arabic commercial messaging must use:

`منطقة الشرق الأوسط وشمال أفريقيا (MENA)`

as the regional target where the content refers to destination, client, buyer market, or commercial target. Individual countries must not be presented as AR destination/client/target-market references. Technical product-origin data may remain when it is genuinely part of product provenance, certification, logistics, or catalogue specification.

## Migration strategy

1. Create a restore branch from the current `main` commit before structural changes.
2. Inventory every AR-only asset and every shared asset currently loaded by AR pages.
3. Add AR-specific directories without changing shared engine behavior.
4. Update AR pages to load the separated AR assets explicitly.
5. Replace runtime text neutralization with explicit Arabic source/content data where practical, starting with commercial geography.
6. Retain the existing AR normalizer temporarily as a compatibility bridge.
7. Add tests proving that AR pages use the separated layer and that ES/EN/FR/IT remain free of AR-only assets/branching.
8. Remove the compatibility bridge only after all AR pages no longer depend on its class mappings or generated structure.
9. Run all existing multilingual, catalogue, and AR regression workflows before merging.

## Non-goals

- Rebuilding the website as a separate application for Arabic.
- Duplicating shared catalogue engines for AR.
- Changing product data, catalogue taxonomy, image order, or market-independent business content unless required by the separation.
- Changing the visual identity of ES/EN/FR/IT.
- Removing legitimate technical origin/provenance information solely because it contains a country name.

## Acceptance criteria

- Every `/ar/` page has an explicit, discoverable AR asset boundary.
- Shared language-neutral CSS/JS contains no new Arabic-specific layout rules.
- Arabic RTL and typography behavior continue to work across home, about, contact, markets, news, products, seafood, fish, shellfish, cephalopods, fruits, vegetables and seasonal pages.
- Arabic commercial target geography is MENA rather than individual countries.
- Shared catalogue engines continue to serve all languages without duplicated AR engines.
- Existing multilingual and AR regression tests pass.
- A restore branch exists before structural migration.
