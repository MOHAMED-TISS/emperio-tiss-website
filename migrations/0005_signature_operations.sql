ALTER TABLE clients ADD COLUMN last_login_at INTEGER;
ALTER TABLE clients ADD COLUMN last_seen_at INTEGER;
ALTER TABLE clients ADD COLUMN login_count INTEGER NOT NULL DEFAULT 0;

ALTER TABLE private_offers ADD COLUMN updated_at INTEGER;
ALTER TABLE private_offers ADD COLUMN cancelled_at INTEGER;
ALTER TABLE private_offers ADD COLUMN deleted_at INTEGER;
ALTER TABLE private_offers ADD COLUMN visibility_scope TEXT NOT NULL DEFAULT 'all';
ALTER TABLE private_offers ADD COLUMN visibility_value TEXT;
ALTER TABLE private_offers ADD COLUMN priority INTEGER NOT NULL DEFAULT 0;

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
CREATE INDEX IF NOT EXISTS idx_private_offers_visibility ON private_offers(status,visibility_scope,visibility_value,valid_until);
CREATE INDEX IF NOT EXISTS idx_clients_last_login ON clients(last_login_at);
