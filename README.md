# EMPERIO TISS — Corporate Website

Static multilingual B2B website for EMPERIO TISS S.L.

## Stack
- HTML / CSS / JavaScript
- Cloudflare Workers static assets via Wrangler
- Public site root: `public/`

## Production structure

```text
public/
├── index.html                 # Spanish homepage
├── about/                     # Spanish company page
├── products/                  # Spanish product system
├── markets/                   # Spanish markets
├── news/                      # Spanish news
├── contact/                   # Spanish contact
├── legal/                     # Legal pages
├── en/                        # English site
├── fr/                        # French site
├── ar/                        # Arabic site
├── logo.png                   # Shared brand asset
├── robots.txt
├── sitemap.xml
└── shared CSS / JS assets
```

## Products architecture

The current product system is intentionally kept compatible with existing public URLs. Canonical product pages use directory URLs such as `/products/seafood/`, while legacy `.html` URLs that may still be indexed or linked are retained as compatibility pages where required.

The Spanish Products system remains the baseline for Seafood, Fruits & Vegetables, Seasonal and related product components. English, French and Arabic versions are maintained separately so language-specific layouts do not accidentally overwrite each other.

## Deployment

`wrangler.jsonc` points Cloudflare at `./public` as the static asset directory. No build command is required.

Production domain: `https://emperio-tiss.com`

## Maintenance rules

- Do not remove a public URL without checking references and search/indexing implications.
- Preserve `public/logo.png` and existing product architecture unless a change explicitly requires otherwise.
- Keep language versions isolated.
- Remove development artifacts, empty placeholders and obsolete documentation rather than accumulating them in the production repository.
