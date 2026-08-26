# Noticias + Market Signals + EMPERIO Private

## Goal
Build a multilingual communication ecosystem for ES/EN/FR/IT/AR with three layers: editorial News/Market Signals, public newsletter subscription, and a private approved-client area for exclusive offers.

## Scope
- Replace the five News landing pages with a shared editorial design language.
- Add shared News CSS/JS and multilingual content blocks.
- Add newsletter subscription UI with double-opt-in flow through the existing Cloudflare Worker + Resend.
- Add private-client access request / magic-link flow, approved-client records, and private-offer retrieval through Cloudflare Worker + D1 (binding to be configured before production deployment).
- Add admin API primitives for approving clients and publishing/sending offers/newsletters.
- Keep all non-News pages and existing navigation architecture unchanged.

## Files
- `public/assets/css/news-current.css`: News/editorial/private visual system.
- `public/assets/js/news-current.js`: category filtering, newsletter/private forms, UI states.
- `public/news/index.html`: Spanish News.
- `public/en/news/index.html`: English News.
- `public/fr/news/index.html`: French News.
- `public/it/news/index.html`: Italian News.
- `public/ar/news/index.html`: Arabic News / RTL.
- `src/index.js`: newsletter, private access, session and admin API routes.
- `migrations/0001_news_private.sql`: D1 schema.
- `wrangler.jsonc`: documented D1 binding placeholder for production setup.
- `README.md`: setup/configuration notes.

## Acceptance criteria
- News pages have a real editorial hierarchy, featured story, latest signals, filters, intelligence block, newsletter capture and private-area entry.
- ES/EN/FR/IT/AR preserve language-specific copy and RTL in Arabic while sharing the same visual system.
- Newsletter subscription validates email, stores subscriber when D1 is available, and sends confirmation using Resend.
- Confirmation activates the subscriber.
- Approved clients can request a magic link and retrieve currently published private offers.
- Admin endpoints are protected by `ADMIN_API_KEY` and never expose private offer data publicly.
- No non-News page is modified.
