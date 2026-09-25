ALTER TABLE subscribers ADD COLUMN unsubscribe_token TEXT;
ALTER TABLE subscribers ADD COLUMN unsubscribed_at INTEGER;
CREATE UNIQUE INDEX subscriber_unsubscribe ON subscribers(unsubscribe_token);
CREATE TABLE campaigns (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK(kind IN ('newsletter','offer')),
  offer_id INTEGER,
  subject TEXT NOT NULL,
  html TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at INTEGER NOT NULL,
  started_at INTEGER
);
CREATE TABLE campaign_deliveries (
  campaign_id TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  updated_at INTEGER NOT NULL,
  PRIMARY KEY(campaign_id,email)
);
CREATE TABLE request_limits (
  bucket TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
