# EMPERIO TISS — Website Architecture

## Scope

This document is the architectural source of truth for the static multilingual website.

## Canonical URL rules

- Product category URLs use directory-style pages (`/path/` → `index.html`).
- Existing flat `.html` URLs remain redirect stubs for backwards compatibility and SEO.
- Seafood canonical pages: `seafood/`, `seafood/fish/`, `seafood/shellfish/`, `seafood/cephalopods/`.
- Fruits and Vegetables remain separate canonical categories: `fruits/` and `vegetables/`.
- Seasonal canonical page: `seasonal/`.
- The abandoned combined `fruits-vegetables/` page is not part of the navigation or canonical information architecture.

## Component ownership

Shared components are defined once and consumed by all language/page trees:

- Header: shared component CSS/markup.
- Navigation: one disclosure-based implementation using native `<details>/<summary>`.
- Hero: shared base layout plus page/category modifier classes; the base hero never owns a page-specific background image.
- Footer: one structural component; RTL is handled through language-scoped rules rather than a separate footer implementation.
- Catalogue: one shared data/rendering engine where the feature is structurally the same; visual section variants remain page-specific when genuinely unique.

## Typography

- Serif: **Cormorant Garamond**.
- Sans: **DM Sans**.
- Arabic: **Noto Sans Arabic**.
- Main navigation: 40px.
- Products subcategories: 35px.
- Seafood children: 25px.

## CSS rules

- Shared behavior belongs in shared component CSS.
- Page-specific visual identity uses modifier classes.
- No shared component styling in page-level `<style>` blocks.
- Do not use `!important` to resolve architecture problems or cascade uncertainty.
- Do not create duplicate implementations of the same component under page-specific names.

## Hero rule

Use:

```html
<section class="page-hero page-hero--fish">
```

The shared `.page-hero` owns layout and typography only. A modifier owns the hero media. There must be exactly one media source for a hero; no duplicate background image in pseudo-elements or another selector.

## Navigation hierarchy

```text
01 Home
02 Company
03 Products
      Seafood +
          Fish
          Shellfish
          Cephalopods
      Fruits & Vegetables
      Seasonal
04 Markets
05 News
06 Contact
```

Seafood uses `+` when closed and `−` when open.

## Main branch protection

The architecture cleanup is being implemented first on:

`test/website-architecture-cleanup`

`main` must remain unchanged until the test branch passes the full acceptance checklist.
