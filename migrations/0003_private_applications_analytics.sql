ALTER TABLE clients ADD COLUMN tax_id TEXT;
ALTER TABLE clients ADD COLUMN address TEXT;
ALTER TABLE clients ADD COLUMN country TEXT;
ALTER TABLE clients ADD COLUMN contact_name TEXT;
ALTER TABLE clients ADD COLUMN mobile TEXT;
ALTER TABLE clients ADD COLUMN whatsapp TEXT;
ALTER TABLE clients ADD COLUMN interest_categories TEXT;
ALTER TABLE clients ADD COLUMN products_interest TEXT;
ALTER TABLE clients ADD COLUMN privacy_accepted_at INTEGER;
ALTER TABLE clients ADD COLUMN notification_status TEXT;
ALTER TABLE clients ADD COLUMN notification_error TEXT;

CREATE TABLE client_interests (
  email TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('seafood','fruits','vegetables')),
  PRIMARY KEY(email, category)
);

CREATE INDEX idx_clients_country ON clients(country);
CREATE INDEX idx_clients_created_at ON clients(created_at);
CREATE INDEX idx_client_interests_category ON client_interests(category);
