import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { handlePublicRequests, handleAdminRequests } from './requests.mjs';
const ORIGIN = 'https://smartnest.pro';
function fixture(t) {
  const db = new DatabaseSync(':memory:'); db.exec(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8')); t.after(() => db.close());
  const DB = { prepare(sql) {
    const stmt = db.prepare(sql); let args = {};
    const adapter = { bind(...values) { args = Object.fromEntries(values.map((value, i) => [String(i + 1), value])); return adapter; }, async first() { return stmt.get(args) ?? null; }, async all() { return { results: stmt.all(args) }; }, async run() { return { meta: { changes: stmt.run(args).changes } }; } }; return adapter;
  } };
  const env = { DB, PUBLIC_REQUEST_LIMITER: { async limit() { return { success: true }; } } };
  async function call(path, data, admin = false, origin = ORIGIN, method = data === undefined ? 'GET' : 'POST') {
    const response = await (admin ? handleAdminRequests : handlePublicRequests)(new Request(ORIGIN + path, { method, headers: { 'Content-Type': 'application/json', ...(origin ? { Origin: origin } : {}), 'CF-Connecting-IP': '192.0.2.1' }, ...(data === undefined ? {} : { body: JSON.stringify(data) }) }), env);
    if (!response) return undefined;
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    return { status: response.status, data: await response.json() };
  }
  return { db, env, call };
}
const input = patch => ({ submission_id: crypto.randomUUID(), type: 'license', plan: '3_months', name: '  بيت أحمد  ', contact_method: 'email', contact: 'ahmad@example.com', license_reference: '', message: '', consent: true, website: '', ...patch });

test('public intake acknowledges only reference and stores trimmed private details for owner', async t => {
 const { call } = fixture(t); const request = input(); const response = await call('/v1/public/requests', request);
 assert.equal(response.status, 201); assert.deepEqual(Object.keys(response.data).sort(), ['received', 'reference']); assert.match(response.data.reference, /^SNREQ-[A-F0-9]{16}$/);
 assert.equal(JSON.stringify(response.data).includes(request.contact), false);
 assert.equal(await call('/v1/public/requests/' + response.data.reference), undefined);
 const listed = await call('/v1/admin/requests', undefined, true); assert.equal(listed.data.requests.length, 1); assert.equal(listed.data.requests[0].name, 'بيت أحمد'); assert.equal(listed.data.requests[0].status, 'new'); assert.equal(listed.data.new_count, 1);
});

test('public handler never handles private list/update routes', async t => {
 const { call } = fixture(t);
 assert.equal(await call('/v1/admin/requests'), undefined);
 assert.equal(await call('/v1/admin/site', { patreon_url: 'https://patreon.com/example' }), undefined);
});

test('origin, limiter, bindings and content limits fail closed', async t => {
 const { env, call } = fixture(t);
 assert.equal((await call('/v1/public/requests', input(), false, 'https://attacker.example')).status, 403);
 assert.equal((await call('/v1/public/requests', input(), false, null)).status, 403);
 env.PUBLIC_REQUEST_LIMITER = { async limit() { return { success: false }; } };
 assert.equal((await call('/v1/public/requests', input())).status, 429);
 delete env.PUBLIC_REQUEST_LIMITER; assert.equal((await call('/v1/public/requests', input())).status, 503);
 env.PUBLIC_REQUEST_LIMITER = { async limit() { return { success: true }; } };
 assert.equal((await call('/v1/public/requests', input({ message: 'x'.repeat(20000) }))).status, 413);
 delete env.DB; assert.equal((await call('/v1/public/site')).status, 503);
});

test('public validation rejects malformed details, full license keys and unintended fields', async t => {
 const { call, db } = fixture(t);
 for (const patch of [ { consent: false }, { website: 'spam' }, { type: 'admin' }, { type: 'support', plan: '', message: '' }, { plan: 'free' }, { type: 'patreon', plan: 'lifetime' }, { submission_id: 'bad' }, { name: '' }, { name: 'x'.repeat(101) }, { name: 'in\njection' }, { contact: 'bad email' }, { contact: 'a'.repeat(121) }, { contact_method: 'phone' }, { contact_method: 'whatsapp', contact: 'abc' }, { contact_method: 'whatsapp', contact: '123' }, { license_reference: 'SN-' + 'a'.repeat(40) }, { message: 'My key: SN-' + 'z'.repeat(40) }, { message: 'x'.repeat(2001) }, { extra: true } ]) {
  assert.equal((await call('/v1/public/requests', input(patch))).status, 400, JSON.stringify(patch));
 }
 assert.equal(db.prepare('SELECT COUNT(*) AS total FROM customer_requests').get().total, 0);
 assert.equal((await call('/v1/public/requests', input({ type: 'support', plan: '', message: '<script>alert(1)</script>\nHelp needed', contact_method: 'whatsapp', contact: '+972 50 123-4567' }))).status, 201);
});

test('idempotency under competing submissions creates one request and rejects changed payload', async t => {
 const { call, db } = fixture(t); const payload = input();
 const results = await Promise.all(Array.from({ length: 8 }, () => call('/v1/public/requests', payload)));
 assert.ok(results.every(result => result.status === 201)); assert.equal(new Set(results.map(result => result.data.reference)).size, 1);
 assert.equal(db.prepare('SELECT COUNT(*) AS total FROM customer_requests').get().total, 1);
 assert.equal((await call('/v1/public/requests', { ...payload, name: 'Different' })).status, 409);
});

test('owner can update status/notes but cannot mutate identity or arbitrary columns', async t => {
 const { call } = fixture(t); await call('/v1/public/requests', input()); const first = (await call('/v1/admin/requests', undefined, true)).data.requests[0];
 assert.equal((await call(`/v1/admin/requests/${first.id}/update`, { status: 'in_progress', admin_note: 'Private <script>note</script>' }, true)).status, 200);
 let listed = (await call('/v1/admin/requests?status=in_progress', undefined, true)).data;
 assert.equal(listed.new_count, 0); assert.equal(listed.requests[0].admin_note, 'Private <script>note</script>');
 assert.equal((await call(`/v1/admin/requests/${first.id}/update`, { status: 'closed' }, true)).status, 200);
 assert.equal((await call(`/v1/admin/requests/${first.id}/update`, { status: 'deleted' }, true)).status, 400);
 assert.equal((await call(`/v1/admin/requests/${first.id}/update`, { name: 'Not permitted' }, true)).status, 400);
 assert.equal((await call(`/v1/admin/requests/${crypto.randomUUID()}/update`, { status: 'closed' }, true)).status, 404);
 assert.equal((await call(`/v1/admin/requests/${first.id}/update`, {}, true)).status, 400);
});

test('owner pagination handles timestamp ties without gaps and search treats wildcards literally', async t => {
 const { call, db } = fixture(t);
 const insert = db.prepare("INSERT INTO customer_requests(id,submission_id,reference,payload_hash,type,plan,name,contact_method,contact,created_at) VALUES (?,?,?,'hash','license','3_months',?,'email','customer@example.com',1000)");
 for (let i = 0; i < 105; i++) insert.run(crypto.randomUUID(), crypto.randomUUID(), 'REF-' + i, i === 0 ? 'Literal % name' : 'Customer ' + i);
 const first = await call('/v1/admin/requests', undefined, true); assert.equal(first.data.requests.length, 100); assert.ok(first.data.next_cursor);
 const second = await call('/v1/admin/requests?cursor=' + first.data.next_cursor, undefined, true); assert.equal(second.data.requests.length, 5); assert.equal(second.data.next_cursor, null);
 assert.equal(new Set([...first.data.requests, ...second.data.requests].map(item => item.id)).size, 105);
 const found = await call('/v1/admin/requests?search=%25', undefined, true); assert.equal(found.data.requests.length, 1); assert.equal(found.data.requests[0].name, 'Literal % name');
 for (const query of ['cursor=not-valid', 'status=deleted', 'search=a&search=b', 'unknown=true']) assert.equal((await call('/v1/admin/requests?' + query, undefined, true)).status, 400);
});

test('Patreon URL defaults empty and only verified Patreon HTTPS destinations can be saved', async t => {
 const { call } = fixture(t);
 assert.deepEqual((await call('/v1/public/site')).data, { patreon_url: null });
 for (const patreon_url of [ 'javascript:alert(1)', 'https://patreon.com.evil.example/name', 'https://evil.example/patreon', 'https://patreon.com', 'http://patreon.com/name', 'https://u:p@patreon.com/name', 'https://patreon.com:8443/name', 'https://patreon.com/name#fragment', null ]) assert.equal((await call('/v1/admin/site', { patreon_url }, true)).status, 400);
 assert.equal((await call('/v1/admin/site', { patreon_url: 'https://www.patreon.com/c/smartnest' }, true)).status, 200);
 assert.equal((await call('/v1/public/site')).data.patreon_url, 'https://www.patreon.com/c/smartnest');
 assert.equal((await call('/v1/admin/site', { patreon_url: '' }, true)).status, 200);
 assert.equal((await call('/v1/public/site')).data.patreon_url, null);
});

test('fragmented public bodies remain bounded without Content-Length', async t => {
 const { env } = fixture(t);
 const request = new Request(ORIGIN + '/v1/public/requests', { method: 'POST', headers: { Origin: ORIGIN, 'Content-Type': 'application/json' }, duplex: 'half', body: new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(9000)); controller.enqueue(new Uint8Array(9000)); controller.close(); } }) });
 assert.equal((await handlePublicRequests(request, env)).status, 413);
});
