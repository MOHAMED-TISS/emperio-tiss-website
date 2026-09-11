# EMPERIO TISS — Arabic RTL Architecture

Date: 2026-09-11
Branch: `restore/ar-overhaul-20260911`

## Goal

Replace the current layered Arabic presentation with one coherent RTL design system while preserving the existing working catalogue engines and canonical international taxonomy.

## Scope

### In scope
- All `/ar/` pages and Arabic product subpages.
- Arabic header, mobile navigation overlay, language switcher and footer.
- Arabic typography hierarchy and RTL spacing/composition.
- Navy / ivory / champagne-gold visual system; remove residual green styling.
- Canonical three-category product architecture:
  - المأكولات البحرية
  - الفواكه والخضروات
  - المنتجات الموسمية
- Arabic catalogue hierarchy and Fish catalogue presentation.
- Standardized Arabic terminology, CTA labels, metadata and technical labels.
- Responsive desktop/tablet/mobile behavior.
- Removal/consolidation of obsolete Arabic presentation layers where safe.

### Out of scope
- Redesigning the Spanish reference experience.
- Changing product imagery/manifests unless required to preserve the working catalogue engine.
- Changing business content or market strategy.
- Changing newsletter/backend behavior.

## Architecture

1. **Single Arabic visual layer**
   - `html[lang="ar"]` is the only language selector for Arabic presentation rules.
   - Arabic UI/body text uses Noto Sans Arabic.
   - Latin product names, scientific names, codes and technical values retain controlled Latin typography where appropriate.
   - No blanket `body *` font override.

2. **Canonical shell**
   - One header structure across Arabic pages.
   - One mobile overlay structure.
   - One language switcher containing ES / EN / FR / IT / AR.
   - One universal footer structure.
   - JavaScript may enhance the shell but must not create competing Arabic shells.

3. **Section system**
   - Reuse the established EMPERIO TISS navy / ivory / champagne-gold tokens.
   - Consistent container width, vertical rhythm, heading hierarchy, labels, borders, buttons and CTA spacing.
   - Arabic heroes use content-driven responsive height rather than universal fixed 100vh behavior.

4. **Catalogue system**
   - Preserve the operational catalogue engine and current Fish image manifest/order.
   - Arabic Fish becomes a proper RTL presentation of the same catalogue architecture.
   - Other seafood/product sections follow the same structural hierarchy instead of separate presentation-only shells.

5. **Terminology**
   - Standardize seafood taxonomy, including `رأسيات الأرجل` for cephalopods and a distinct shellfish term where applicable.
   - Apply one glossary across navigation, filters, cards, metadata, CTAs and footer.

## File strategy

Primary files expected to be consolidated/adjusted:
- `public/assets/css/ar-pages.css`
- `public/assets/css/ar-visual.css`
- `public/assets/css/header-final.css`
- `public/assets/css/canonical-nav.css`
- `public/assets/js/global.js`
- `public/assets/js/international-shell.js`
- Arabic page HTML/JS/CSS files discovered during implementation.

Legacy Arabic rules will be removed or reduced only after their selectors are mapped to the canonical replacement, to avoid regressions on non-Arabic pages.

## Acceptance criteria

- No green background, border, text or inherited `!important` rule remains on any `/ar/` page unless it is part of an intentional photographic asset.
- Every Arabic page uses the same header, overlay, language switcher and footer structure.
- All language switchers expose ES / EN / FR / IT / AR and preserve the current-page path where supported.
- Arabic does not force Noto Sans Arabic onto Latin-only technical content.
- Product landing architecture matches the canonical three-category taxonomy.
- Fish catalogue remains operational, with image ordering and catalogue behavior intact.
- Arabic terminology is internally consistent.
- Desktop, tablet and mobile layouts avoid clipped/overlapping content and excessive fixed-height gaps.
- No duplicated obsolete Arabic shell is left active in the cascade.
- Changes are isolated on `restore/ar-overhaul-20260911` until verified; `main` is not modified directly.
