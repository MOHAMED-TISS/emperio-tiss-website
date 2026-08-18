# English Site Redesign

## Goal
Create one coherent, premium English-language experience across `/en/` and every English subpage, with consistent navigation, content hierarchy, visual language, responsive behavior, and valid internal routes.

## Scope
- `/en/`
- `/en/about/`
- `/en/products/`
- `/en/products/seafood.html`
- `/en/products/fruits-vegetables.html`
- `/en/products/seasonal.html`
- `/en/markets/`
- `/en/contact/`
- English-specific shared CSS/HTML only; preserve Spanish pages and the working Products baseline.

## Design
Use a premium international food-trade identity: editorial dark base, warm ivory typography, restrained metallic-gold accents, subtle glass surfaces, large whitespace, strong typographic hierarchy, and restrained motion. The homepage should establish the brand narrative; subpages should feel like the same site rather than isolated templates.

## Content
English copy must be concise, credible and B2B-oriented. Position EMPERIO TISS as a Madrid-based connector between suppliers, professional buyers and destination markets across Europe, Africa and the Middle East. Avoid unsupported claims, unnecessary trading jargon and references to products/services that are not part of the current site scope.

## Technical constraints
- Preserve `public/logo.png` and existing relative path architecture.
- Preserve `luxury-nav.js` as the navigation controller unless tests demonstrate a required defect.
- Preserve the Spanish site and `public/products.css` baseline.
- All English pages use `body.en-page` and the same navigation DOM.
- All English pages load `luxury-nav.js`.
- Internal English links must resolve to existing `/en/` routes.
- No external JS dependency.
- Mobile navigation must remain keyboard accessible and scroll-safe.

## Validation
Before implementation, establish a baseline route/DOM/link validation and record existing failures. After implementation, run static HTML/link validation, verify asset references, verify navigation hooks, and inspect all English routes. Any failed validation blocks merge.
