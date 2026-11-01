-- Compatible with the standalone license service. Keys are SHA-256 hashes only.
CREATE TABLE IF NOT EXISTS licenses (
    id TEXT PRIMARY KEY,
    key_hash TEXT UNIQUE NOT NULL,
    created_at REAL NOT NULL,
    expires_at REAL,
    installation_id TEXT,
    revoked INTEGER NOT NULL DEFAULT 0,
    customer_name TEXT NOT NULL DEFAULT '',
    customer_contact TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT ''
);
-- Additive migration. No license keys, expiry or binding records are changed.
CREATE TABLE IF NOT EXISTS customer_requests (
    id TEXT PRIMARY KEY,
    submission_id TEXT UNIQUE NOT NULL,
    reference TEXT UNIQUE NOT NULL,
    payload_hash TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('license','renewal','support','patreon')),
    plan TEXT NOT NULL DEFAULT '',
    name TEXT NOT NULL,
    contact_method TEXT NOT NULL CHECK(contact_method IN ('email','whatsapp')),
    contact TEXT NOT NULL,
    license_reference TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    created_at REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','in_progress','closed')),
    admin_note TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS requests_created ON customer_requests(created_at DESC,id DESC);
CREATE INDEX IF NOT EXISTS requests_status_created ON customer_requests(status,created_at DESC,id DESC);
CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY,value TEXT NOT NULL);
