# EMPERIO TISS — Design System

## Brand direction

Premium international B2B food sourcing with an editorial, sophisticated visual language. Seafood uses deep marine/ocean tones; Fruits & Vegetables uses natural agricultural tones; Seasonal uses warm harvest tones. All remain under one brand system.

## Typography

```css
--et-serif: "Cormorant Garamond", Georgia, serif;
--et-sans: "DM Sans", Arial, sans-serif;
--et-arabic: "Noto Sans Arabic", Tahoma, sans-serif;
```

### Navigation

- Level 1: 40px Cormorant Garamond, weight 500, line-height 1.08.
- Level 2: 35px Cormorant Garamond, weight 500, line-height 1.08.
- Level 3: 25px Cormorant Garamond, weight 500, line-height 1.12.
- Navigation metadata (`01`…`06`): DM Sans, approximately 11px, discreet gold/champagne accent.
- Level 2 indentation: 48px minimum.
- Level 3 indentation: an additional 72px visual depth.
- Seafood disclosure mark: `+`; open state: `−`.

### Body

- Body/UI: DM Sans.
- Body range: 15–17px.
- Lead copy: 17–22px where the page design calls for it.
- Eyebrows: 9–11px, uppercase, generous tracking.

## Core colors

```css
--et-ink: #102331;
--et-white: #ffffff;
--et-gold: #d9c7a0;
--marine-deep: #041d31;
--marine-mid: #07324d;
--ivory: #f3f1e8;
--ivory-alt: #f8f6f0;
--category-seafood: #123a36;
```

Seasonal and produce accents are finalized from their current visual implementations during the visual QA phase rather than invented as arbitrary replacements.

## Spacing

Use an 8px base rhythm:

`8 / 16 / 24 / 32 / 48 / 72`

Hero and large-section spacing may exceed the base rhythm where editorial composition requires it.

## Containers

- Content maximum: 1180px.
- Desktop gutter: approximately 64px.
- Mobile gutter: approximately 32px.

## Component rules

### Header

Transparent/floating over hero media where appropriate. No page-specific duplicate header architecture.

### Navigation

One native `<details>/<summary>` disclosure tree. No page-specific copies. Native keyboard/assistive-technology behavior is preserved.

### Hero

The base hero controls layout, spacing, type and overlay behavior. Media is supplied by one modifier class per page/variant. No duplicate image in `::before`, `::after`, inline styles, or an additional background selector.

### Footer

One structural footer component. Language text lives in the HTML; RTL differences are language-scoped CSS only.

## Motion

Use the existing project easing curve where appropriate:

`cubic-bezier(.165,.84,.44,1)`

Keep interactions restrained and editorial. Respect `prefers-reduced-motion`.

## Non-negotiable rules

- No page-level styling of shared components.
- No cascading override chains used as architecture.
- No new `!important` for visual conflicts unless a documented utility exception requires it.
- No duplicate hero media layers.
- No duplicate navigation indicators.
- No new `pilot`, `demo`, `fix`, `soft`, `final`, `v2` component variants for production UI.
