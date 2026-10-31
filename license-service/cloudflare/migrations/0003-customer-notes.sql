-- Apply once to the existing production database before deploying this Worker.
ALTER TABLE licenses ADD COLUMN customer_contact TEXT NOT NULL DEFAULT '';
ALTER TABLE licenses ADD COLUMN notes TEXT NOT NULL DEFAULT '';
