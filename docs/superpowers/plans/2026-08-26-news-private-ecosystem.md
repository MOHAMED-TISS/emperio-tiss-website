# Noticias + Market Signals + EMPERIO Private

## Approved operational continuation — 2026-09-24
User approved connecting D1, secure admin access, real client/offer/subscriber lists,
campaign drafts, preview, explicit send confirmation, unsubscribe and campaign history.
Edit existing admin assets and Worker; add an additive migration and behavioral tests.
Keep the public News design and global shell unchanged. No live campaigns during tests.

### Execution and verification
- [x] Add D1 binding and additive schema; create an EU database and apply migrations.
- [x] Test Worker authentication, validation, missing email configuration, double opt-in,
  unsubscribe, audience language, campaign duplicate prevention, and provider failure.
- [x] Implement database health, lists, drafts and recipient-by-recipient dispatch.
  Claims prevent duplicate dispatch; interrupted/uncertain deliveries remain visible and
  are never automatically resent. Sending pauses when the browser closes.
- [x] Add admin preview and recipient confirmation; never expose private lists publicly.
- [x] Generate an admin key, retain only a Windows-user-encrypted local copy outside
  public, and upload it as a Worker secret. Resend key is user-supplied via Cloudflare.
- [ ] Run Node tests, syntax checks, dry-run deploy, mobile/desktop browser checks;
  commit, push, CI, deploy and authenticated read-only live verification.

Verification ledger: 22 Node tests pass; local D1 migrations and Worker dry-run pass.
Browser workflows pass at 375px and 1440px with no horizontal overflow or page errors.
Review findings fixed: initial sends require an audience fingerprint; started campaign
previews use frozen recipients; private offers support language segmentation.
RESEND_API_KEY still requires user configuration; production sending cannot be claimed
verified until the provider credential, sender domain and an authorized test email exist.

### Review focus
Concurrent send requests must not duplicate delivery; a missing mail secret must not
consume consent tokens; unsubscribe must invalidate pending confirmations; revoked
clients must lose sessions; database or provider errors must never look like success.
Campaign content is immutable after sending starts. Maximum audience is 200 per campaign;
larger audiences need a queue, not an unbounded Worker request.

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
