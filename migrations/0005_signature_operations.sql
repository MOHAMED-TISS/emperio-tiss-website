-- SIGNATURE operational engagement table.
-- New columns on clients/private_offers are added idempotently at runtime by
-- ensureSignatureOperationsSchema so existing production D1 databases can
-- upgrade safely before this migration is applied.

CREATE TABLE IF NOT EXISTS offer_views (
  offer_id INTEGER NOT NULL,
  email TEXT NOT NULL,
  first_viewed_at INTEGER NOT NULL,
  last_viewed_at INTEGER NOT NULL,
  view_count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY(offer_id,email)
);

CREATE INDEX IF NOT EXISTS idx_offer_views_email ON offer_views(email);
CREATE INDEX IF NOT EXISTS idx_offer_views_offer ON offer_views(offer_id,last_viewed_at DESC);
