# SmartNest license service

This folder contains the licensing server and an owner-only command line client. For Cloudflare deployment on `licenses.smartnest.pro`, use [cloudflare/README.md](cloudflare/README.md). The Python/Docker instructions below are an alternative hosting option.

The service issues random keys, stores only their SHA-256 hashes, binds a key to one installation on its first successful validation, and supports expiration, revocation and resetting the installation binding. It does not receive Home Assistant entities, addresses or dashboard layouts. A copied full Home Assistant backup can copy the installation identity too; local code can be modified by its owner, so licensing is not unbreakable copy protection.

## Run locally (Python 3.10+)

Keep the admin secret in your server's secret manager/environment. Generate one with `python3 -c 'import secrets; print(secrets.token_urlsafe(48))'`, then export it as `SMARTNEST_ADMIN_TOKEN` in your private terminal. Never send this secret to customers or commit it.

```sh
python3 server.py serve
```

Default listener: `127.0.0.1:8080`. Default database: `data/licenses.sqlite3`. Configure with `SMARTNEST_BIND`, `SMARTNEST_PORT`, `SMARTNEST_DB`. File permissions and encryption at rest are the host administrator's responsibility.

## Deploy

On a Docker host, set `SMARTNEST_ADMIN_TOKEN` in the shell or host secret facility and run:

```sh
docker compose up -d --build
```

The database lives in the persistent `licenses` volume. Back up the SQLite database using SQLite's online backup API (or stop the service before copying all database/WAL files); losing this volume loses license records. Restoring an old backup can restore old revocation/binding state.

Point a domain such as `licenses.your-domain.example` to this server. Put the loopback-only service behind your HTTPS reverse proxy, for example this Caddy site:

```caddyfile
licenses.your-domain.example {
    @public path /v1/validate /health
    handle @public {
        reverse_proxy 127.0.0.1:8080
    }
    respond 404
}
```

Use a real domain you control, allow ports 80/443 for the proxy, and verify a valid HTTPS certificate. The example intentionally keeps `/v1/admin/*` off the public internet: run owner commands locally on the server, or use a secure SSH tunnel. If you choose to expose the admin API, restrict it to trusted IPs/VPN in addition to bearer authentication. Do not expose port 8080 publicly. Add reverse-proxy connection and request limits; the service has a 4 KB body limit, 10 second socket timeout, global token bucket (300 burst, 5 requests/second), and bounded per-peer buckets (30 burst, one token per 2 seconds). Behind a proxy, all clients share its peer bucket; the service ignores forwarded IP headers deliberately. Raise limits in code or configure an authenticated trusted proxy design before serving large customer fleets.

Before distributing SmartNest, run `python3 scripts/configure-license-service.py https://licenses.your-domain.example` from the repository root to pin your public endpoint. Customers enter only their key; they cannot choose a validation server in setup. Restart HA after updating the integration. Do not use the example domain literally. The HA client should POST `/v1/validate` on setup and periodically thereafter; successful responses permit up to 72 hours of offline grace, bounded by the license's expiration. Revocation takes effect at the next successful validation; an unreachable server cannot communicate revocation until the cached lease runs out. Resetting allows a replacement installation to bind; revoke the license instead if it should stop working everywhere. A customer can validate an old installation again before the replacement does, so perform replacement/reset together.

## Issue and manage customer keys

Run these on the server with the same `SMARTNEST_ADMIN_TOKEN` environment variable:

```sh
python3 server.py create --days 365
python3 server.py create
python3 server.py list
python3 server.py revoke LICENSE_UUID
python3 server.py reset LICENSE_UUID
```

`create` without `--days` makes a perpetual license. Its response contains the customer `license_key` **once only** and the record `id`; deliver the key privately and retain the ID for management. `list` contains IDs, expiry and installation binding but no keys or key hashes. `reset` clears installation binding without undoing revocation. Keys are not passwords to the owner API. `SMARTNEST_SERVICE_URL` overrides the management destination (default `http://127.0.0.1:8080`); use HTTPS for remote destinations.

## API contract

All request bodies are JSON objects. Every response is non-cacheable JSON. No browser CORS access is needed; Home Assistant calls the service from its backend.

- `GET /health` → `200 {"ok": true}`.
- `POST /v1/validate` with `{"license_key":"SN-…","installation_id":"UUID"}` → `200 {"valid":true,"expires_at":null,"lease_seconds":259200}`. Expiring licenses return Unix seconds in `expires_at`. Denial → `403 {"valid":false,"reason":"invalid|revoked|expired|bound_other"}` (one concrete reason, not the combined string).
- `POST /v1/admin/licenses` with `{"expires_at": null}` or a future Unix timestamp → `201 {"id":"UUID","created_at":timestamp,"expires_at":null,"license_key":"SN-…"}`.
- `GET /v1/admin/licenses` → `200 {"licenses":[...]}`.
- `POST /v1/admin/licenses/UUID/revoke` or `/reset` with `{}` → `200 {"ok":true}`.
- Admin routes require `Authorization: Bearer OWNER_SECRET`. Errors: `400` malformed input, `401` bad admin authentication, `403` denied license, `404` unknown route/ID, `413` oversized body, `429` rate limit, `503` database/service unavailable. A client must never treat a `400`, malformed response or server error as a fresh successful validation.

## Verify

```sh
python3 -m unittest -v
```

Tests use a temporary database and real local HTTP requests, including competing activation requests. No customer data or live service is needed.
