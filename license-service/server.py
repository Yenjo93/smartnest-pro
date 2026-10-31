"""SmartNest licensing API. Put behind an HTTPS reverse proxy in production."""
from __future__ import annotations

import argparse
import hashlib
import hmac
import json
import logging
import math
import os
import secrets
import sqlite3
import threading
import time
import uuid
from collections import OrderedDict
from contextlib import contextmanager
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import HTTPRedirectHandler, Request, build_opener

LEASE_SECONDS = 3 * 24 * 60 * 60
MAX_BODY = 4096
LOG = logging.getLogger("smartnest-license")


class Store:
    def __init__(self, path: str):
        self.path = path
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        with self.connect() as db:
            db.execute("PRAGMA journal_mode=WAL")
            db.execute("""CREATE TABLE IF NOT EXISTS licenses (
                id TEXT PRIMARY KEY, key_hash TEXT UNIQUE NOT NULL,
                created_at REAL NOT NULL, expires_at REAL,
                installation_id TEXT, revoked INTEGER NOT NULL DEFAULT 0,
                customer_name TEXT NOT NULL DEFAULT '')""")

            columns = {column[1] for column in db.execute("PRAGMA table_info(licenses)")}
            if "customer_name" not in columns:
                db.execute("ALTER TABLE licenses ADD COLUMN customer_name TEXT NOT NULL DEFAULT ''")

    @contextmanager
    def connect(self):
        db = sqlite3.connect(self.path, timeout=15)
        try:
            with db:
                yield db
        finally:
            db.close()

    def create(self, expires_at, customer_name=""):
        key = "SN-" + secrets.token_urlsafe(32)
        record = {"id": str(uuid.uuid4()), "created_at": time.time(), "expires_at": expires_at, "customer_name": customer_name}
        with self.connect() as db:
            db.execute("INSERT INTO licenses(id,key_hash,created_at,expires_at,customer_name) VALUES (?,?,?,?,?)",
                       (record["id"], hashlib.sha256(key.encode()).hexdigest(), record["created_at"], expires_at, customer_name))
        return {**record, "license_key": key}

    def list(self):
        with self.connect() as db:
            db.row_factory = sqlite3.Row
            return [dict(row) for row in db.execute(
                "SELECT id,created_at,expires_at,installation_id,revoked,customer_name FROM licenses ORDER BY created_at DESC")]

    def change(self, identifier, action):
        column = "revoked=1" if action == "revoke" else "installation_id=NULL"
        with self.connect() as db:
            return db.execute(f"UPDATE licenses SET {column} WHERE id=?", (identifier,)).rowcount == 1

    def validate(self, key, installation):
        # The write lock covers lookup and binding, so competing activations cannot both win.
        with self.connect() as db:
            db.execute("BEGIN IMMEDIATE")
            row = db.execute("SELECT id,expires_at,installation_id,revoked FROM licenses WHERE key_hash=?",
                             (hashlib.sha256(key.encode()).hexdigest(),)).fetchone()
            if row is None:
                return {"valid": False, "reason": "invalid"}
            identifier, expiry, bound, revoked = row
            if revoked:
                return {"valid": False, "reason": "revoked"}
            if expiry is not None and expiry <= time.time():
                return {"valid": False, "reason": "expired"}
            if bound is not None and bound != installation:
                return {"valid": False, "reason": "bound_other"}
            if bound is None:
                db.execute("UPDATE licenses SET installation_id=? WHERE id=?", (installation, identifier))
            return {"valid": True, "expires_at": expiry, "lease_seconds": LEASE_SECONDS}


class Limiter:
    """Bounded per-peer token buckets plus a global bucket; trust no forwarded IP headers."""
    def __init__(self):
        self.lock = threading.Lock()
        self.peers = OrderedDict()
        self.global_tokens = 300.0
        self.global_time = time.monotonic()

    def allow(self, peer):
        with self.lock:
            now = time.monotonic()
            self.global_tokens = min(300, self.global_tokens + (now - self.global_time) * 5)
            self.global_time = now
            tokens, previous = self.peers.pop(peer, (30.0, now))
            tokens = min(30, tokens + (now - previous) / 2)
            accepted = tokens >= 1 and self.global_tokens >= 1
            if accepted:
                tokens -= 1
                self.global_tokens -= 1
            self.peers[peer] = (tokens, now)
            if len(self.peers) > 4096:
                self.peers.popitem(last=False)
            return accepted


class Server(ThreadingHTTPServer):
    daemon_threads = True
    request_queue_size = 64

    def __init__(self, address, store, token):
        if not isinstance(token, str) or len(token) < 32:
            raise ValueError("SMARTNEST_ADMIN_TOKEN must contain at least 32 characters")
        self.store = store
        self.admin_token = token
        self.limiter = Limiter()
        super().__init__(address, Handler)


class Handler(BaseHTTPRequestHandler):
    server_version = "SmartNest"
    sys_version = ""

    def setup(self):
        super().setup()
        self.connection.settimeout(10)

    def log_message(self, format, *args):
        # Do not log paths, bodies, credentials or untrusted request text.
        return

    def reply(self, status, data):
        body = json.dumps(data, allow_nan=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Content-Security-Policy", "default-src 'none'")
        self.send_header("Connection", "close")
        if status == 429:
            self.send_header("Retry-After", "60")
        self.end_headers()
        self.wfile.write(body)
        self.close_connection = True

    def authorized(self):
        return hmac.compare_digest(self.headers.get("Authorization", "").encode(),
                                   ("Bearer " + self.server.admin_token).encode())

    def body(self):
        if self.headers.get("Transfer-Encoding"):
            raise ValueError("Unsupported transfer encoding")
        length = self.headers.get("Content-Length", "")
        if not length.isascii() or not length.isdecimal():
            raise ValueError("Invalid content length")
        size = int(length)
        if size > MAX_BODY:
            raise OverflowError
        if self.headers.get_content_type() != "application/json":
            raise ValueError("Expected application/json")
        payload = self.rfile.read(size)
        if len(payload) != size:
            raise ValueError("Incomplete body")
        data = json.loads(payload, parse_constant=lambda _: (_ for _ in ()).throw(ValueError()))
        if not isinstance(data, dict):
            raise ValueError("Expected object")
        return data

    def do_GET(self):
        try:
            if self.path == "/health":
                self.reply(200, {"ok": True})
            elif self.path == "/v1/admin/licenses":
                if not self.authorized():
                    self.reply(401, {"error": "unauthorized"})
                    return
                self.reply(200, {"licenses": self.server.store.list()})
            else:
                self.reply(404, {"error": "not_found"})
        except (sqlite3.Error, OSError):
            LOG.error("License API request failed")
            self.reply(503, {"error": "unavailable"})

    def do_POST(self):
        try:
            if not self.server.limiter.allow(self.client_address[0]):
                self.reply(429, {"error": "rate_limited"})
                return
            if self.path == "/v1/validate":
                data = self.body()
                if set(data) != {"license_key", "installation_id"}:
                    raise ValueError
                key, installation = data["license_key"], data["installation_id"]
                if not isinstance(key, str) or not 16 <= len(key) <= 256:
                    raise ValueError
                if not isinstance(installation, str) or len(installation) != 36:
                    raise ValueError
                installation = str(uuid.UUID(installation))
                result = self.server.store.validate(key, installation)
                self.reply(200 if result["valid"] else 403, result)
                return
            if not self.path.startswith("/v1/admin/licenses"):
                self.reply(404, {"error": "not_found"})
                return
            if not self.authorized():
                self.reply(401, {"error": "unauthorized"})
                return
            data = self.body()
            if self.path == "/v1/admin/licenses":
                if set(data) - {"expires_at", "customer_name"}:
                    raise ValueError
                customer_name = ""
                if "customer_name" in data:
                    if not isinstance(data["customer_name"], str):
                        raise ValueError
                    customer_name = data["customer_name"].strip()
                    if not customer_name or len(customer_name) > 100 or any(ord(c) < 32 or ord(c) == 127 for c in customer_name):
                        raise ValueError
                expiry = data.get("expires_at")
                if expiry is not None and (isinstance(expiry, bool) or not isinstance(expiry, (float, int))
                    or not math.isfinite(expiry) or expiry <= time.time()):
                    raise ValueError
                self.reply(201, self.server.store.create(expiry, customer_name))
                return
            parts = self.path.split("/")
            if len(parts) != 6 or parts[5] not in {"reset", "revoke"}:
                self.reply(404, {"error": "not_found"})
                return
            if data:
                raise ValueError
            identifier = str(uuid.UUID(parts[4]))
            found = self.server.store.change(identifier, parts[5])
            self.reply(200 if found else 404, {"ok": True} if found else {"error": "not_found"})
        except OverflowError:
            self.reply(413, {"error": "body_too_large"})
        except (ValueError, TypeError, UnicodeError, RecursionError):
            self.reply(400, {"error": "invalid_request"})
        except (sqlite3.Error, OSError):
            LOG.error("License API request failed")
            self.reply(503, {"error": "unavailable"})


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, message, headers, new_url):
        # Never forward the owner's bearer token to a redirected destination.
        return None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("serve")
    create = sub.add_parser("create")
    create.add_argument("--days", type=float, help="Omit for a perpetual license")
    create.add_argument("--name", help="Customer name (1–100 characters)")
    sub.add_parser("list")
    for action in ("revoke", "reset"):
        sub.add_parser(action).add_argument("id")
    args = parser.parse_args()
    token = os.environ.get("SMARTNEST_ADMIN_TOKEN", "")
    if len(token) < 32:
        parser.error("Set SMARTNEST_ADMIN_TOKEN to a random secret of at least 32 characters")
    if args.command == "serve":
        server = Server((os.environ.get("SMARTNEST_BIND", "127.0.0.1"),
                         int(os.environ.get("SMARTNEST_PORT", "8080"))),
                        Store(os.environ.get("SMARTNEST_DB", "data/licenses.sqlite3")), token)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            server.server_close()
        return
    base = os.environ.get("SMARTNEST_SERVICE_URL", "http://127.0.0.1:8080").rstrip("/")
    if not base.startswith("https://") and not base.startswith(("http://127.0.0.1:", "http://localhost:")):
        parser.error("Use HTTPS, or HTTP on localhost only")
    path = "/v1/admin/licenses"
    data = None
    if args.command == "create":
        if args.days is not None and (not math.isfinite(args.days) or args.days <= 0):
            parser.error("--days must be a positive finite number")
        data = {"expires_at": None if args.days is None else time.time() + args.days * 86400}
        if args.name is not None:
            name = args.name.strip()
            if not name or len(name) > 100 or any(ord(c) < 32 or ord(c) == 127 for c in name):
                parser.error("--name must contain 1–100 characters without control characters")
            data["customer_name"] = name
    elif args.command in {"reset", "revoke"}:
        try:
            identifier = str(uuid.UUID(args.id))
        except ValueError:
            parser.error("id must be a UUID")
        path += f"/{identifier}/{args.command}"
        data = {}
    request = Request(base + path, data=None if data is None else json.dumps(data).encode(),
                      headers={"Authorization": "Bearer " + token, "Content-Type": "application/json", "User-Agent": "SmartNest-Pro-License/1.0"})
    try:
        with build_opener(NoRedirect).open(request, timeout=15) as response:
            print(json.dumps(json.load(response), indent=2))
    except HTTPError as error:
        parser.exit(1, f"License service returned HTTP {error.code}\n")
    except OSError:
        parser.exit(1, "Cannot reach license service\n")


if __name__ == "__main__":
    main()
