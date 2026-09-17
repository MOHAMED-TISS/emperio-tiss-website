# Sitewide SEO & Indexing Design

**Date:** 2026-09-17  
**Repository:** `MOHAMED-TISS/emperio-tiss-website`  
**Base:** `main` at `2c40d05b64ef6dbbec3c350b153136b3ce8b592b`

## Problem

Google Search Console currently reports only two indexed site URLs, while the submitted sitemap contains 65 intended canonical URLs across ES, EN, FR, AR and IT. The report shows 63 URLs as `Discovered – currently not indexed` and one URL as an alternate page with a proper canonical.

The repository audit shows that the site already has a sitemap and several pages contain canonical/hreflang markup, but the implementation is inconsistent: some intended canonical pages such as Arabic About/Contact pages lack explicit canonical and hreflang tags in their source HTML, while legacy `.html` aliases intentionally use redirects plus `noindex`.

Google documents that `Discovered – currently not indexed` means the URL has been found but not crawled yet, and that canonicalization is a hint rather than a guarantee. Google also recommends reciprocal hreflang annotations between localized versions.

## Goals

1. Preserve the 65 sitemap URLs as the intended indexable/canonical URL set.
2. Make canonicalization deterministic and self-referential for every intended canonical URL.
3. Make hreflang reciprocal across ES/EN/FR/AR/IT for every equivalent page, plus `x-default` pointing to the Spanish version.
4. Ensure canonicalization signals do not contradict intentional legacy redirects.
5. Avoid changing legacy `.html` redirect pages from their current `noindex` behavior.
6. Add automated tests that detect missing or contradictory SEO metadata before deployment.
7. Keep the implementation centralized so future pages do not require five-language metadata patches in unrelated HTML files.

## Non-goals

- Do not promise or force Google indexing.
- Do not bulk-submit individual URLs to Search Console.
- Do not redesign page content or Arabic visual styling as part of this SEO change.
- Do not delete legacy redirect routes.
- Do not alter product image/catalogue logic.

## Design

### 1. Canonical URL matrix

The sitemap's 65 URLs remain the source-of-truth indexable route matrix: 13 page families × 5 languages.

Spanish routes are the canonical `x-default` equivalents; English, French, Arabic and Italian use the same localized route structure.

### 2. Response-level normalization

The Cloudflare Worker in `src/index.js` already fronts the Pages asset binding through `env.ASSETS.fetch(request)`. For GET requests that resolve to HTML and match one of the 65 canonical routes, the Worker will normalize the document head with HTMLRewriter:

- remove existing `rel=canonical` tags;
- remove existing hreflang alternate tags;
- append exactly one self-canonical tag;
- append one `hreflang` tag for each of `es`, `en`, `fr`, `it`, `ar`;
- append one `x-default` tag to the Spanish equivalent;
- leave non-target HTML responses and intentional legacy aliases untouched.

This creates a single runtime source of truth while preserving the page-specific title and description already authored in each HTML file.

### 3. Automated validator

Add `tests/test_seo_metadata.py` using only the Python standard library. It will read `public/sitemap.xml` and the intended HTML files and assert:

- exactly 65 sitemap URLs;
- every sitemap URL maps to an existing canonical page file;
- no sitemap target contains `noindex`;
- every target contains a `<title>` and meta description;
- every target's existing canonical, when present, points to itself;
- every target's existing hreflang set, when present, is reciprocal and uses the expected URLs;
- legacy redirect pages remain `noindex` and are excluded from the canonical target set.

The test is intentionally source-level. Runtime normalization is separately validated through deterministic route-matrix tests in the Worker module.

### 4. Internal consistency

Do not rewrite the site's page hierarchy or copy. The SEO change must be limited to indexing signals and validation so that the visual/content work can proceed separately.

## Success criteria

After implementation:

- all 65 sitemap URLs have a deterministic self-canonical at response level;
- all 65 have reciprocal ES/EN/FR/IT/AR hreflang plus x-default at response level;
- the sitemap and canonical matrix are identical;
- no canonical target is `noindex`;
- legacy `.html` aliases remain redirect/noindex routes;
- automated SEO tests pass;
- main site behavior outside SEO metadata is unchanged.
