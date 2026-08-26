CREATE TABLE IF NOT EXISTS subscribers (
  email TEXT PRIMARY KEY,
  language TEXT NOT NULL DEFAULT 'en',
  consent_at INTEGER NOT NULL,
  confirmed_at INTEGER
);

CREATE TABLE IF NOT EXISTS clients (
  email TEXT PRIMARY KEY,
  name TEXT,
  company TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL,
  approved_at INTEGER
);

CREATE TABLE IF NOT EXISTS auth_tokens (
  token_hash TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  email TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS private_sessions (
  token_hash TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS private_offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT,
  origin TEXT,
  destination TEXT,
  availability TEXT,
  valid_until INTEGER NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at INTEGER NOT NULL,
  last_sent_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_subscribers_language ON subscribers(language);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_offers_status_valid_until ON private_offers(status, valid_until);
