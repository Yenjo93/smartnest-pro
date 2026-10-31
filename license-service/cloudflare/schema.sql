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
