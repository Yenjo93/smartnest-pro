-- Run once against an existing database before deploying the name-aware Worker.
ALTER TABLE licenses ADD COLUMN customer_name TEXT NOT NULL DEFAULT '';
