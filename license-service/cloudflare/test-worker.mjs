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
