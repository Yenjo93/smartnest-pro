import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker from './worker.mjs';

const ADMIN = 'a-private-admin-token-at-least-32-characters';
function fixture(t) {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));
  t.after(() => sqlite.close());
  const DB = {
    prepare(sql) {
      const statement = sqlite.prepare(sql);
      let params = {};
      const adapter = {
        bind(...values) { params = Object.fromEntries(values.map((value, index) => [String(index + 1), value])); return adapter; },
        async first() { return statement.get(params) ?? null; },
        async all() { return { results: statement.all(params) }; },
        async run() { const result = statement.run(params); return { meta: { changes: result.changes } }; },
      };
      return adapter;
    },
  };
  const env = { DB, SMARTNEST_ADMIN_TOKEN: ADMIN, RATE_LIMITER: { async limit() { return { success: true }; } } };
  async function call(path, data, token = ADMIN, method = data === undefined ? 'GET' : 'POST') {
    const headers = { 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await worker.fetch(new Request(`https://licenses.smartnest.pro${path}`, { method, headers, ...(data === undefined ? {} : { body: JSON.stringify(data) }) }), env);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    return { status: response.status, data: await response.json() };
  }
  async function issue(expires_at = null) {
    const result = await call('/v1/admin/licenses', { expires_at });
    assert.equal(result.status, 201);
    return result.data;
  }
  return { env, sqlite, call, issue };
}

const activate = (key, id = crypto.randomUUID()) => ({ license_key: key, installation_id: id });

test('owner auth fails closed, including missing secret or binding', async t => {
  const { env, call } = fixture(t);
  assert.equal((await call('/v1/admin/licenses', {}, null)).status, 401);
  assert.equal((await call('/v1/admin/licenses', {}, 'wrong')).status, 401);
  env.SMARTNEST_ADMIN_TOKEN = '';
  assert.equal((await call('/v1/validate', activate('x'.repeat(32)))).status, 503);
  env.SMARTNEST_ADMIN_TOKEN = ADMIN;
  delete env.RATE_LIMITER;
  assert.equal((await call('/v1/validate', activate('x'.repeat(32)))).status, 503);
});

test('binds to one installation and returns unchanged client contract', async t => {
  const { call, issue } = fixture(t);
  const key = await issue();
  const request = activate(key.license_key);
  const first = await call('/v1/validate', request);
  assert.equal(first.status, 200);
  assert.deepEqual(first.data, { valid: true, expires_at: null, lease_seconds: 259200 });
  assert.equal((await call('/v1/validate', request)).status, 200);
  assert.deepEqual(await call('/v1/validate', activate(key.license_key)), { status: 403, data: { valid: false, reason: 'bound_other' } });
});

test('competing installation requests have exactly one winner', async t => {
  const { call, issue } = fixture(t);
  const key = await issue();
  const responses = await Promise.all(Array.from({ length: 10 }, () => call('/v1/validate', activate(key.license_key))));
  assert.equal(responses.filter(r => r.status === 200).length, 1);
  assert.equal(responses.filter(r => r.status === 403).length, 9);
});

test('expiry, reset and revocation preserve binding semantics', async t => {
  const { call, issue, sqlite } = fixture(t);
  const key = await issue(Date.now() / 1000 + 86400);
  const first = activate(key.license_key);
  assert.equal((await call('/v1/validate', first)).status, 200);
  assert.equal((await call(`/v1/admin/licenses/${key.id}/reset`, {})).status, 200);
  assert.equal((await call('/v1/validate', activate(key.license_key))).status, 200);
  sqlite.prepare('UPDATE licenses SET expires_at=1 WHERE id=?').run(key.id);
  assert.equal((await call('/v1/validate', first)).data.reason, 'expired');
  assert.equal((await call(`/v1/admin/licenses/${key.id}/revoke`, {})).status, 200);
  assert.equal((await call(`/v1/admin/licenses/${key.id}/reset`, {})).status, 200);
  assert.equal((await call('/v1/validate', first)).data.reason, 'revoked');
});

test('owner list and storage never contain plaintext keys', async t => {
  const { call, issue, sqlite } = fixture(t);
  const key = await issue();
  const result = await call('/v1/admin/licenses');
  assert.equal(result.status, 200);
  assert.equal(result.data.licenses[0].id, key.id);
  assert.equal(JSON.stringify(result.data).includes(key.license_key), false);
  assert.equal(Object.hasOwn(result.data.licenses[0], 'key_hash'), false);
  const stored = sqlite.prepare('SELECT * FROM licenses').get();
  assert.match(stored.key_hash, /^[0-9a-f]{64}$/);
  assert.equal(JSON.stringify(stored).includes(key.license_key), false);
});

test('invalid requests, unknown keys, body limits and route limits', async t => {
  const { env, call } = fixture(t);
  assert.equal((await call('/v1/validate', activate('x'.repeat(32)))).data.reason, 'invalid');
  assert.equal((await call('/v1/validate', activate('x'.repeat(32), 'not-a-uuid'))).status, 400);
  assert.equal((await call('/v1/admin/licenses', { expires_at: 'never' })).status, 400);
  assert.equal((await call('/v1/admin/licenses', { expires_at: 1 })).status, 400);
  assert.equal((await call('/v1/admin/licenses', { unexpected: true })).status, 400);
  assert.equal((await call('/v1/validate', { payload: 'x'.repeat(5000) })).status, 413);
  assert.equal((await call('/v1/admin/licenses', [])).status, 400);
  env.RATE_LIMITER = { async limit({ key }) { assert.match(key, /^validate:192\.0\.2\.1$/); return { success: false }; } };
  assert.equal((await call('/v1/validate', activate('x'.repeat(32)))).status, 429);
});

test('fragmented streaming body is bounded independently of content length', async t => {
  const { env } = fixture(t);
  const request = new Request('https://licenses.smartnest.pro/v1/validate', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, duplex: 'half',
    body: new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(3000)); controller.enqueue(new Uint8Array(3000)); controller.close(); } }),
  });
  assert.equal((await worker.fetch(request, env)).status, 413);
});

const ORIGIN = 'https://licenses.smartnest.pro';
const PANEL_PASSWORD = 'private-panel-password-at-least-24-chars';
function browser(env, path, data, cookie, origin = ORIGIN) {
  return worker.fetch(new Request(ORIGIN + path, {
    method: data === undefined ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json', ...(origin ? { Origin: origin } : {}), ...(cookie ? { Cookie: cookie } : {}) },
    ...(data === undefined ? {} : { body: JSON.stringify(data) }),
  }), env);
}

async function login(env) {
  env.SMARTNEST_PANEL_PASSWORD = PANEL_PASSWORD;
  const response = await browser(env, '/v1/admin/login', { password: PANEL_PASSWORD });
  assert.equal(response.status, 200);
  const cookie = response.headers.get('Set-Cookie');
  assert.match(cookie, /Secure; HttpOnly; SameSite=Strict; Path=\//);
  return cookie.split(';')[0];
}

test('panel login does not expose credentials and session authorizes owner actions', async t => {
  const { env } = fixture(t);
  const cookie = await login(env);
  const session = await browser(env, '/v1/admin/session', undefined, cookie);
  assert.deepEqual(await session.json(), { authenticated: true });
  const issued = await browser(env, '/v1/admin/licenses', { plan: '3_months' }, cookie);
  assert.equal(issued.status, 201);
  const key = await issued.json();
  assert.ok(key.expires_at > key.created_at + 80 * 86400);
  assert.equal((await browser(env, `/v1/admin/licenses/${key.id}/revoke`, {}, cookie)).status, 200);
  const logout = await browser(env, '/v1/admin/logout', {}, cookie);
  assert.match(logout.headers.get('Set-Cookie'), /Max-Age=0/);
  assert.equal((await browser(env, '/v1/admin/session')).status, 401);
});

test('login, credential changes, tampered sessions and cross-origin writes fail closed', async t => {
  const { env } = fixture(t);
  env.SMARTNEST_PANEL_PASSWORD = PANEL_PASSWORD;
  assert.equal((await browser(env, '/v1/admin/login', { password: 'wrong' })).status, 401);
  assert.equal((await browser(env, '/v1/admin/login', { password: PANEL_PASSWORD }, undefined, 'https://evil.example')).status, 403);
  assert.equal((await browser(env, '/v1/admin/login', { password: PANEL_PASSWORD }, undefined, null)).status, 403);
  const cookie = await login(env);
  assert.equal((await browser(env, '/v1/admin/licenses', {}, cookie, 'https://evil.example')).status, 403);
  assert.equal((await browser(env, '/v1/admin/licenses', {}, cookie, null)).status, 403);
  const tampered = cookie.slice(0, -1) + (cookie.endsWith('a') ? 'b' : 'a');
  assert.equal((await browser(env, '/v1/admin/session', undefined, tampered)).status, 401);
  env.SMARTNEST_PANEL_PASSWORD += 'rotated';
  assert.equal((await browser(env, '/v1/admin/session', undefined, cookie)).status, 401);
});

test('sessions expire and missing panel password does not disable CLI', async t => {
  const { env, call } = fixture(t);
  assert.equal((await browser(env, '/v1/admin/login', { password: PANEL_PASSWORD })).status, 503);
  assert.equal((await call('/v1/admin/licenses')).status, 200);
  const cookie = await login(env);
  const original = Date.now;
  Date.now = () => original() + 8 * 3600 * 1000 + 1000;
  try { assert.equal((await browser(env, '/v1/admin/session', undefined, cookie)).status, 401); }
  finally { Date.now = original; }
});

test('all four plans are computed on server and reject ambiguous or unknown inputs', async t => {
  const { call } = fixture(t);
  for (const plan of ['3_months', '6_months', '1_year', 'lifetime']) {
    const { status, data } = await call('/v1/admin/licenses', { plan });
    assert.equal(status, 201);
    if (plan === 'lifetime') assert.equal(data.expires_at, null);
    else assert.ok(data.expires_at > data.created_at);
  }
  assert.equal((await call('/v1/admin/licenses', { plan: 'forever' })).status, 400);
  assert.equal((await call('/v1/admin/licenses', { plan: 'lifetime', expires_at: null })).status, 400);
});

test('calendar month plans clamp month ends and leap years', async () => {
  const { planExpiry } = await import('./admin-auth.mjs');
  const stamp = iso => Date.parse(iso) / 1000;
  assert.equal(planExpiry('3_months', stamp('2026-01-31T12:30:00Z')), stamp('2026-04-30T12:30:00Z'));
  assert.equal(planExpiry('6_months', stamp('2027-08-31T12:30:00Z')), stamp('2028-02-29T12:30:00Z'));
  assert.equal(planExpiry('1_year', stamp('2028-02-29T12:30:00Z')), stamp('2029-02-28T12:30:00Z'));
});

test('admin document has a restrictive CSP with exact hashes and no embedded secrets', async t => {
  const { env } = fixture(t);
  const response = await browser(env, '/admin');
  assert.equal(response.status, 200);
  const csp = response.headers.get('Content-Security-Policy');
  assert.match(csp, /frame-ancestors 'none'/);
  assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval/);
  const html = await response.text();
  assert.ok(!html.includes(ADMIN) && !html.includes(PANEL_PASSWORD));
  for (const tag of ['script', 'style']) {
    const blocks = [...html.matchAll(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)</' + tag + '>', 'g'))];
    assert.ok(blocks.length);
    for (const block of blocks) {
      const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(block[1])));
      const hash = btoa(String.fromCharCode(...bytes));
      assert.ok(csp.includes("'sha256-" + hash + "'"));
    }
  }
});

test('customer names persist, are trimmed, and stay private to owner APIs', async t => {
  const { call } = fixture(t);
  const created = await call('/v1/admin/licenses', { plan: '3_months', customer_name: '  أحمد — المنزل  ' });
  assert.equal(created.status, 201);
  assert.equal(created.data.customer_name, 'أحمد — المنزل');
  const listed = await call('/v1/admin/licenses');
  assert.equal(listed.data.licenses.find(r => r.id === created.data.id).customer_name, 'أحمد — المنزل');
  const activated = await call('/v1/validate', activate(created.data.license_key));
  assert.equal(activated.status, 200);
  assert.equal(Object.hasOwn(activated.data, 'customer_name'), false);
  const legacy = await call('/v1/admin/licenses', {});
  assert.equal(legacy.status, 201);
  assert.equal(legacy.data.customer_name, '');
});

test('explicit invalid customer names are rejected without creating records', async t => {
  const { call, sqlite } = fixture(t);
  for (const customer_name of ['', '  ', null, 123, {}, 'x'.repeat(101), 'valid\nforged', '\u0000name']) {
    assert.equal((await call('/v1/admin/licenses', { customer_name })).status, 400);
  }
  assert.equal(sqlite.prepare('SELECT count(*) AS count FROM licenses').get().count, 0);
  assert.equal((await call('/v1/admin/licenses', { customer_name: 'أ'.repeat(100) })).status, 201);
});

test('D1 name migration preserves existing licenses and activation state', t => {
  const sqlite = new DatabaseSync(':memory:');
  t.after(() => sqlite.close());
  sqlite.exec(`CREATE TABLE licenses (id TEXT PRIMARY KEY, key_hash TEXT UNIQUE NOT NULL, created_at REAL NOT NULL, expires_at REAL, installation_id TEXT, revoked INTEGER NOT NULL DEFAULT 0);
    INSERT INTO licenses VALUES ('old-id','hash',100,200,'installation',1);`);
  sqlite.exec(readFileSync(new URL('./migrations/0002-license-name.sql', import.meta.url), 'utf8'));
  const record = sqlite.prepare('SELECT * FROM licenses').get();
  assert.equal(record.customer_name, '');
  assert.equal(record.id, 'old-id');
  assert.equal(record.expires_at, 200);
  assert.equal(record.installation_id, 'installation');
  assert.equal(record.revoked, 1);
});

test('admin page embedded script parses and customer names use text-only rendering', async () => {
  const { ADMIN_HTML } = await import('./admin-page.mjs');
  const { Script } = await import('node:vm');
  const match = /<script>([\s\S]*?)<\/script>/.exec(ADMIN_HTML);
  assert.ok(match);
  assert.doesNotThrow(() => new Script(match[1]));
});
