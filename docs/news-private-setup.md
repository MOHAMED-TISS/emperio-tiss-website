# News / Market Signals / EMPERIO Private setup

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
