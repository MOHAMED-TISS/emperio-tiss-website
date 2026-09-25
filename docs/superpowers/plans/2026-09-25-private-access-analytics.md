# Private Access Requests and Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture qualified company applications for EMPERIO PRIVATE, notify EMPERIO TISS by email, and display operational request analytics in the authenticated admin panel.

**Architecture:** Extend the existing D1 schema and Worker endpoints in place. The public form submits structured multilingual data; the Worker validates and stores it before attempting Resend delivery. The authenticated overview endpoint returns records plus aggregate data rendered by dependency-free, accessible admin charts.

**Tech Stack:** Cloudflare Worker, D1/SQLite, Resend, static HTML, vanilla JavaScript, CSS, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-25-private-access-analytics-design.md`

## Global Constraints

- Categories are exactly `seafood`, `fruits`, and `vegetables`.
- CIF, company, address, country, contact person, mobile, email, WhatsApp, privacy acknowledgement, and one category are required.
- Store the request before attempting notification; notification failure must not lose the lead.
- No third-party chart library and no unauthenticated analytics endpoint.
- Keep header, footer, News editorial content, newsletter behavior, and private catalogue outside scope.
- Preserve ES, EN, FR, IT, and AR behavior and RTL support.
- Use existing brand tokens: navy `#0B1E33`, ivory `#F4F0E6`, champagne `#C9A24B`, DM Sans, Playfair Display.

## Review Focus

- Repeated application from an approved email must send a magic link and must not reset status.
- Invalid or duplicate category values must be rejected or normalized without corrupting analytics.
- Resend failure after persistence must return success while recording `failed` notification state.
- Applicant text containing HTML must be escaped in the internal email and rendered as text in admin.
- Legacy clients with null company fields must remain listable and must not break chart rendering.

---

### Task 1: D1 schema and request API

**Files:**
- Create: `migrations/0003_private_applications_analytics.sql`
- Modify: `src/index.js`
- Test: `tests/private-admin-api.test.mjs`

**Interfaces:**
- Produces: validated client columns, `client_interests`, and `requestAccess(request, env)` persistence/notification behavior.
- Consumes: existing `clean`, `emailOk`, `escapeHtml`, `resend`, `allowRequest`, and D1 binding.

- [ ] Add failing API tests for missing fields, invalid categories, escaped notification HTML, stored requests when Resend fails, and approved-client access.
- [ ] Run `node --test tests/private-admin-api.test.mjs` and confirm failures are caused by the missing structured application behavior.
- [ ] Add migration 0003 with nullable legacy-safe columns, constrained `client_interests`, and reporting indexes.
- [ ] Implement bounded field validation, stable category parsing, D1 batch persistence, escaped notification email, and notification status updates.
- [ ] Re-run `node --test tests/private-admin-api.test.mjs` and confirm it passes.

### Task 2: Analytics API

**Files:**
- Modify: `src/index.js`
- Test: `tests/private-admin-api.test.mjs`

**Interfaces:**
- Consumes: `clients` and `client_interests` from Task 1.
- Produces: `analytics = {summary, daily, countries, categories, languages}` on the authenticated overview response.

- [ ] Add failing tests for authentication, totals, country/category/language grouping, 30-day daily series, and empty data.
- [ ] Run the focused tests and confirm the overview lacks the required aggregates.
- [ ] Add bounded aggregate queries and a zero-filled UTC 30-day series to `adminOverview`.
- [ ] Re-run API tests and confirm all analytics assertions pass.

### Task 3: Multilingual application form

**Files:**
- Modify: `public/assets/js/news-current.js`
- Modify: `public/assets/css/news-current.css`
- Test: `tests/private-admin-contract.test.mjs`

**Interfaces:**
- Produces: form names matching Task 1 fields and localized UI strings.
- Consumes: `/api/private/request-access` and the existing shared form submitter.

- [ ] Add failing contract assertions for every required field, category values, privacy acknowledgement, and language value.
- [ ] Run `node --test tests/private-admin-contract.test.mjs` and confirm the new contract assertions fail.
- [ ] Extend all five language dictionaries and render a responsive field grid, country selector, category fieldset, optional details, honeypot, and privacy acknowledgement.
- [ ] Add namespaced form styling with visible focus, errors, RTL support, and responsive recomposition.
- [ ] Re-run contract tests and JS syntax checks.

### Task 4: Operations analytics dashboard

**Files:**
- Modify: `public/private/admin/index.html`
- Modify: `public/assets/js/private-admin.js`
- Modify: `public/assets/css/private-admin.css`
- Test: `tests/private-admin-contract.test.mjs`

**Interfaces:**
- Consumes: Task 2 `analytics` and Task 1 client fields.
- Produces: KPI nodes, accessible trend/country/category charts, detailed request rows, and approval prefill.

- [ ] Add failing contract tests for dashboard IDs, chart fallback containers, detailed fields, and updated asset versions.
- [ ] Run the contract test and confirm the dashboard additions are absent.
- [ ] Add semantic KPI/chart markup and expand the approval form only where needed.
- [ ] Implement numeric-safe SVG trend rendering, CSS bar lists, empty states, textual summaries, and detailed request records using DOM text nodes.
- [ ] Add restrained responsive styling using existing design tokens and no new dependency.
- [ ] Run contract, API, syntax, and CSS balance checks.

### Task 5: Integration, migration, and release

**Files:**
- Modify if needed: `.github/workflows/validate-private-admin.yml`
- Verify: all files above

**Interfaces:**
- Consumes: Tasks 1-4.
- Produces: migrated and deployed production application.

- [ ] Run `node --check` for changed JavaScript and the complete Node test suite.
- [ ] Apply migration locally and run schema-backed API tests.
- [ ] Inspect the form and admin at 375px and 1440px for overflow, labels, charts, RTL, console errors, and reduced motion.
- [ ] Commit with an imperative message and push `main` as already authorized for this project.
- [ ] Apply `0003` remotely, confirm CI, deploy with `npx wrangler deploy`, and verify live endpoints/UI without creating a real lead.
