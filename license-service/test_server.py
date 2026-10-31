import concurrent.futures
import http.client
import json
import sqlite3
import tempfile
import threading
import time
import unittest
import uuid
from pathlib import Path

from server import MAX_BODY, Server, Store


class ServiceTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.token = "test-admin-secret-" + "a" * 32
        self.server = Server(("127.0.0.1", 0), Store(str(Path(self.temp.name) / "db.sqlite3")), self.token)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.temp.cleanup()

    def request(self, method, path, body=None, admin=False, raw=None):
        connection = http.client.HTTPConnection(*self.server.server_address, timeout=5)
        headers = {"Content-Type": "application/json"}
        if admin:
            headers["Authorization"] = "Bearer " + self.token
        encoded = raw if raw is not None else (None if body is None else json.dumps(body))
        connection.request(method, path, encoded, headers)
        response = connection.getresponse()
        status, data, response_headers = response.status, json.loads(response.read()), response.headers
        connection.close()
        return status, data, response_headers

    def create(self, expiry=None):
        status, data, _ = self.request("POST", "/v1/admin/licenses", {"expires_at": expiry}, admin=True)
        self.assertEqual(status, 201)
        return data

    def validate(self, key, installation=None):
        return self.request("POST", "/v1/validate", {
            "license_key": key, "installation_id": installation or str(uuid.uuid4())})

    def test_activation_and_binding(self):
        record = self.create()
        installation = str(uuid.uuid4())
        status, data, headers = self.validate(record["license_key"], installation)
        self.assertEqual((status, data["valid"], data["lease_seconds"]), (200, True, 259200))
        self.assertIsNone(data["expires_at"])
        self.assertEqual(headers["Cache-Control"], "no-store")
        self.assertEqual(self.validate(record["license_key"], installation)[0], 200)
        self.assertEqual(self.validate(record["license_key"])[1]["reason"], "bound_other")
        self.assertEqual(self.validate("SN-" + "x" * 43)[1]["reason"], "invalid")

    def test_concurrent_binding_has_one_winner(self):
        record = self.create()
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            results = list(pool.map(lambda _: self.validate(record["license_key"])[0], range(8)))
        self.assertEqual(results.count(200), 1)
        self.assertEqual(results.count(403), 7)

    def test_expiration_revocation_and_reset(self):
        record = self.create(time.time() + 100)
        installation = str(uuid.uuid4())
        self.assertEqual(self.validate(record["license_key"], installation)[0], 200)
        root = f'/v1/admin/licenses/{record["id"]}'
        self.assertEqual(self.request("POST", root + "/reset", {}, admin=True)[0], 200)
        self.assertEqual(self.validate(record["license_key"])[0], 200)
        self.assertEqual(self.request("POST", root + "/revoke", {}, admin=True)[0], 200)
        self.assertEqual(self.validate(record["license_key"])[1]["reason"], "revoked")
        expired = self.create(time.time() + 100)
        with self.server.store.connect() as db:
            db.execute("UPDATE licenses SET expires_at=? WHERE id=?", (time.time() - 1, expired["id"]))
        self.assertEqual(self.validate(expired["license_key"])[1]["reason"], "expired")

    def test_auth_and_no_secrets_in_listing_or_storage(self):
        record = self.create()
        self.assertEqual(self.request("GET", "/v1/admin/licenses")[0], 401)
        self.assertEqual(self.request("POST", "/v1/admin/licenses", {})[0], 401)
        status, data, _ = self.request("GET", "/v1/admin/licenses", admin=True)
        self.assertEqual(status, 200)
        self.assertNotIn("key_hash", json.dumps(data))
        self.assertNotIn("license_key", json.dumps(data))
        with self.server.store.connect() as db:
            stored = db.execute("SELECT key_hash FROM licenses").fetchone()[0]
        self.assertEqual(len(stored), 64)
        self.assertNotEqual(stored, record["license_key"])

    def test_bad_requests_and_size_limit(self):
        for raw in ("[]", "null", "{", '{"expires_at":NaN}', '{"expires_at":true}', '{"expires_at":-1}'):
            self.assertEqual(self.request("POST", "/v1/admin/licenses", admin=True, raw=raw)[0], 400)
        self.assertEqual(self.request("POST", "/v1/validate", {"license_key": "a", "installation_id": "bad"})[0], 400)
        self.assertEqual(self.request("POST", "/v1/validate", raw="x" * (MAX_BODY + 1))[0], 413)
        self.assertEqual(self.request("POST", "/v1/admin/licenses/nope/reset", {}, admin=True)[0], 400)
        self.assertEqual(self.request("GET", "/health")[0], 200)

    def test_rate_limit_and_bounded_memory(self):
        for _ in range(30):
            self.assertTrue(self.server.limiter.allow("test-peer"))
        self.assertFalse(self.server.limiter.allow("test-peer"))
        for number in range(4200):
            self.server.limiter.allow(f"peer-{number}")
        self.assertEqual(len(self.server.limiter.peers), 4096)
        self.server.limiter.global_tokens = 0
        self.assertEqual(self.validate("SN-" + "x" * 43)[0], 429)

    def test_customer_name_validation_and_persistence(self):
        status, record, _ = self.request("POST", "/v1/admin/licenses", {"customer_name": "  أحمد  "}, admin=True)
        self.assertEqual(status, 201)
        self.assertEqual(record["customer_name"], "أحمد")
        rows = self.request("GET", "/v1/admin/licenses", admin=True)[1]["licenses"]
        self.assertEqual(rows[0]["customer_name"], "أحمد")
        self.assertNotIn("customer_name", self.validate(record["license_key"])[1])
        for name in ("", "  ", None, 123, {}, "x" * 101, "a\nb"):
            self.assertEqual(self.request("POST", "/v1/admin/licenses", {"customer_name": name}, admin=True)[0], 400)
        self.assertEqual(self.create()["customer_name"], "")

    def test_legacy_database_migration_is_preserving_and_idempotent(self):
        legacy = str(Path(self.temp.name) / "legacy.sqlite3")
        with sqlite3.connect(legacy) as db:
            db.execute("CREATE TABLE licenses (id TEXT PRIMARY KEY,key_hash TEXT UNIQUE NOT NULL,created_at REAL NOT NULL,expires_at REAL,installation_id TEXT,revoked INTEGER NOT NULL DEFAULT 0)")
            db.execute("INSERT INTO licenses VALUES ('legacy','hash',1,2,'installation',1)")
        store = Store(legacy)
        Store(legacy)
        record = store.list()[0]
        self.assertEqual(record["id"], "legacy")
        self.assertEqual(record["customer_name"], "")
        self.assertEqual(record["installation_id"], "installation")
        self.assertEqual(record["revoked"], 1)

    def test_requires_admin_secret(self):
        with self.assertRaises(ValueError):
            Server(("127.0.0.1", 0), self.server.store, "short")


if __name__ == "__main__":
    unittest.main()
