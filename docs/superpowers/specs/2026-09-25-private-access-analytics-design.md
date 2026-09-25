# Private Access Requests and Analytics Design

## Objective

Turn EMPERIO PRIVATE access into a qualified B2B application flow. Every application must capture actionable company data, persist before email delivery, notify the internal team, and appear in an accessible operations dashboard with reliable country and category analytics.

## Public application

The multilingual News page keeps its current EMPERIO PRIVATE section and visual language. Its compact email-only form becomes a structured company application with these required fields: CIF/tax identifier, company name, address, country, contact person, mobile, professional email, WhatsApp, and at least one product category. The only categories are `seafood`, `fruits`, and `vegetables`; the UI labels are translated for ES, EN, FR, IT, and AR. An optional product-detail field lets the applicant name species, varieties, formats, or volumes without weakening category analytics. The existing honeypot and rate limit remain. A required privacy acknowledgement explains that the data is used to assess private access.

Country is a dedicated required selector/value, separate from the postal address. This is necessary for dependable country reporting. Phone and WhatsApp are stored as entered after bounded normalization; the server rejects empty or implausibly short values but does not pretend to validate every international numbering plan.

## Persistence and notification

Migration `0003` extends `clients` in place with `tax_id`, `address`, `country`, `contact_name`, `mobile`, `whatsapp`, `interest_categories`, `products_interest`, `privacy_accepted_at`, `notification_status`, and `notification_error`. Categories are stored as a stable comma-separated set because D1 analytics can query a normalized companion table more safely. A new `client_interests(email, category)` table stores one row per selected category with a constrained category value and indexes for country, status, date, and category aggregation.

The Worker validates every required field, known language, and category allowlist before writing. It upserts the pending application and replaces its category rows in one D1 batch. Only after persistence does it send an escaped HTML notification to `info@emperio-tiss.com`, with the applicant email as Reply-To and all company details. Resend success updates `notification_status` to `sent`; failure updates it to `failed`, preserves the request, logs only the provider class, and returns a successful application response indicating that the request was saved. An already-approved email continues to receive its private magic link instead of being downgraded to pending.

## Operations desk

The existing admin page remains a single authenticated operations surface. The overview API returns complete client records and an `analytics` object containing:

- totals for all, pending, approved, and rejected requests;
- daily request counts for the last 30 days, including zero-count days;
- ranked country counts;
- ranked category counts from `client_interests`;
- language counts.

The top of the panel gains four KPI blocks and three accessible chart regions: request trend, countries, and categories. Charts use semantic HTML plus inline SVG/CSS generated from trusted numeric API data; no third-party chart library, remote script, or canvas dependency is introduced. Every chart has a text/table equivalent and usable empty state. Country and category labels are text inserted through DOM APIs, never HTML interpolation.

The request list shows company, CIF, country, contact channels, categories, status, and notification state. Selecting a pending record populates the approval form. Approval preserves the submitted company data and changes only the administrative fields/status.

## Security, privacy, and accessibility

Server validation is authoritative. Email content escapes all applicant-controlled values. Admin analytics expose no new unauthenticated endpoint and aggregate only authenticated D1 data. Public error messages do not expose provider or database details. The UI uses native labels, fieldsets, legends, focus styles, `aria-live`, and reduced-motion-safe transitions. No personal data is written to client logs or analytics markup beyond the authenticated request list.

## Scope

In scope: public private-access form, D1 schema, Worker request/email/admin aggregation behavior, operations dashboard markup/styles/scripts, API and contract tests, migration and deployment.

Out of scope: header/footer, general News editorial content, private offer catalogue design, newsletter behavior, CRM integrations, automated lead scoring, geocoding, and historical enrichment of old email-only records. Existing records remain valid and appear as incomplete legacy entries until edited or reapplied.

## Verification and rollout

Tests cover required-field rejection, category allowlisting, persistence before notification failure, escaped email output, approved-client behavior, authenticated analytics, zero-data charts, and admin contract IDs. Run JS syntax checks, Node tests, CSS brace validation, mobile/desktop browser checks, apply migration locally then remotely, commit/push, confirm CI, deploy with `npx wrangler deploy`, and verify the live form/admin without submitting a real production application.
