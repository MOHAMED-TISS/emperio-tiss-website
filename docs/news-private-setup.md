# News / Market Signals / EMPERIO Private setup

## Operational configuration — September 2026

`wrangler.jsonc` now binds `NEWS_DB` to `emperio-tiss-news`. Apply both migrations
with `npx wrangler d1 migrations apply NEWS_DB --remote`; do not create a second DB.
The admin key is a Worker secret. A Windows-user-encrypted local copy is retained
in ignored `output/admin-key.xml`; `output/Open-Admin.ps1` copies it to the clipboard
and opens the panel. Neither file is deployed. Back up the key in a password manager.

Email remains unavailable until `RESEND_API_KEY` is set on this Worker and the sender
domain is verified in Resend. Configure it using `npx wrangler secret put RESEND_API_KEY`
or the Cloudflare dashboard. Never put it in Git or chat. The configured From address
is `EMPERIO TISS <no-reply@emperio-tiss.com>`.

The panel lists the latest 200 clients, subscribers and offers, plus 50 campaigns.
Publishing an offer returns its ID and adds it to the active-offer selector.
Newsletter and offer distribution first save an immutable campaign draft, then require
preview and explicit send confirmation. The server freezes the eligible audience at
send start, checks consent again per recipient and claims each delivery atomically.
Maximum 200 recipients per campaign. Keep the browser open; use Preview / details to
resume pending deliveries after interruption. Failed or uncertain deliveries are never
automatically retried. Review the provider logs before creating a replacement campaign.
Provider acceptance is not inbox delivery. Tracking webhooks and public News article
publishing are not implemented by this admin.

All newsletters append a personal unsubscribe link. Opening it shows a confirmation
form; POST removes consent and invalidates pending confirmation tokens. Double opt-in
is required to reactivate. Delivery tests stub the provider; no live campaign is sent.

Current API: `GET /api/private/admin/overview`, `POST /api/private/admin/campaigns`
with `{subject,html,language}` or `{kind:"offer",offer_id}`, then
`GET /api/private/admin/campaigns/preview?id=...`. Both sending endpoints now require
`{campaign_id,confirm:true,audience_fingerprint}`, using `audienceFingerprint` from
preview. An audience change requires a new preview. These replace the legacy payloads below.
Run `node --test tests/private-admin-api.test.mjs tests/private-admin-contract.test.mjs`.

## Historical initial setup (superseded by operational configuration above)

The website now contains the front-end and Worker routes for:

- Market Signals newsletter with email confirmation.
- Private-client access request and magic-link authentication.
- Approved-client private offers.
- Admin-only approval, offer publishing/sending, and newsletter sending endpoints.

## Cloudflare D1

Create a D1 database and apply:

```bash
npx wrangler d1 create emperio-news
npx wrangler d1 migrations apply emperio-news --remote
```

Then add the binding to `wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "NEWS_DB",
    "database_name": "emperio-news",
    "database_id": "YOUR_D1_DATABASE_ID",
    "migrations_dir": "./migrations"
  }
]
```

## Secrets

Set:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put ADMIN_API_KEY
```

`RESEND_API_KEY` is used by the existing contact flow and the new newsletter/private communication flows. `ADMIN_API_KEY` protects approval, offer and newsletter sending endpoints.

## Admin API examples

Approve a client:

`POST /api/private/admin/approve`

```json
{"email":"buyer@example.com","name":"Buyer Name","company":"Buyer Company","language":"en"}
```

Create a private offer:

`POST /api/private/admin/offers`

```json
{"title":"Selected seafood availability","category":"SEAFOOD","origin":"Morocco","destination":"Perpignan","availability":"8 MT","valid_until":1788134400,"description":"Selected availability for approved clients."}
```

Send an existing offer to approved clients:

`POST /api/private/admin/send-offer`

```json
{"offer_id":1}
```

Send a newsletter to confirmed subscribers. Add `language` to segment by language.

`POST /api/admin/newsletter/send`

```json
{"subject":"EMPERIO TISS Market Signals","html":"<h2>Market Signals</h2><p>...</p>","language":"en"}
```

All admin requests require:

`Authorization: Bearer <ADMIN_API_KEY>`
