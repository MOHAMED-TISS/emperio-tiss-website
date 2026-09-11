# Arabic RTL Design Specification

**Goal:** Rebuild the Arabic presentation as one coherent RTL implementation that matches the current EMPERIO TISS navy/ivory/champagne editorial identity without changing working catalogue engines.

## Scope
- All `/ar/` pages and subpages currently in the repository.
- Arabic visual presentation, shared header/navigation/overlay, language switcher, footer, spacing, taxonomy labels, and Arabic catalogue presentation.
- Preserve existing catalogue data, image manifests, filters, gallery behaviour, and working operational engines unless a wrapper/style conflict must be removed.

## Design rules
- Palette: navy, ivory, champagne-gold only; no green remnants, including `!important` rules.
- Typography: Noto Sans Arabic for Arabic UI/body; retain controlled EMPERIO Latin typography for Latin product/scientific/technical tokens. Never apply Arabic font globally to every element.
- RTL: `html[lang="ar"]` and main content are RTL; language switchers remain LTR.
- Header: one canonical header and one mobile overlay with Arabic navigation: `الرئيسية · الشركة · المنتجات · الأسواق · الأخبار · اتصل بنا`; all five languages ES/EN/FR/IT/AR are present.
- Footer: one canonical footer implementation across every Arabic page.
- Product taxonomy: exactly three top-level categories: `المأكولات البحرية`, `الفواكه والخضروات`, `المنتجات الموسمية`.
- Seafood terminology: use `المأكولات البحرية` for seafood; `الرخويات` for shellfish/molluscs where appropriate; `رأسيات الأرجل` for cephalopods.
- Responsive layout: avoid forced full-screen hero heights; use content-led responsive spacing and explicit mobile breakpoints.
- Catalogue alignment: Fish is the reference for operational catalogue structure. Other Arabic catalogues must use the same visual hierarchy while retaining market-specific product priorities.

## Implementation constraints
- Work from a restore branch, not `main`.
- Remove obsolete/duplicated Arabic visual layers only after their selectors have been migrated or superseded.
- Do not alter ES/EN/FR/IT visual systems except where a shared component must be made language-safe.
- Verify every Arabic route for palette leakage, font misuse, duplicate headers/footers, missing language links, taxonomy consistency, and untranslated/incorrect Arabic terminology.
