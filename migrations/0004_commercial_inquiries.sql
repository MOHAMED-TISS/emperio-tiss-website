CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','qualified','studying','offered','won','lost')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  source TEXT,
  page_url TEXT,
  name TEXT,
  company TEXT,
  tax_id TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  product_category TEXT,
  product_id TEXT,
  product_name TEXT,
  origin TEXT,
  destination TEXT,
  specification TEXT,
  message TEXT,
  notification_status TEXT,
  notification_error TEXT
);
CREATE INDEX IF NOT EXISTS idx_inquiries_status_created ON inquiries(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);
