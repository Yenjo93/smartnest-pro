/** SmartNest license API for Cloudflare Workers + D1. No customer secrets are logged. */
const LEASE_SECONDS = 259200;
const MAX_BODY = 4096;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const encoder = new TextEncoder();

class InputError extends Error {
  constructor(status = 400) { super('Invalid request'); this.status = status; }
}

function reply(status, data) {
  return Response.json(data, { status, headers: {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'",
    ...(status === 429 ? { 'Retry-After': '60' } : {}),
  } });
}

async function body(request) {
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') throw new InputError();
  const declared = request.headers.get('Content-Length');
  if (declared !== null && (!/^\d+$/.test(declared) || Number(declared) > MAX_BODY)) throw new InputError(Number(declared) > MAX_BODY ? 413 : 400);
  if (!request.body) throw new InputError();
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY) { await reader.cancel(); throw new InputError(413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  let data;
  try { data = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw new InputError(); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new InputError();
  return data;
}

function onlyKeys(data, allowed, required = []) {
  if (Object.keys(data).some(key => !allowed.includes(key)) || required.some(key => !Object.hasOwn(data, key))) throw new InputError();
}

async function hash(value) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function authorized(request, secret) {
  // WebCrypto verifies HMAC in constant time, without a JavaScript secret comparison.
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`Bearer ${secret}`));
  return crypto.subtle.verify('HMAC', key, signature, encoder.encode(request.headers.get('Authorization') ?? ''));
}

async function validate(data, db) {
  onlyKeys(data, ['license_key', 'installation_id'], ['license_key', 'installation_id']);
  if (typeof data.license_key !== 'string' || data.license_key.length < 16 || data.license_key.length > 256 || typeof data.installation_id !== 'string' || !UUID.test(data.installation_id)) throw new InputError();
  const installation = data.installation_id.toLowerCase();
  const keyHash = await hash(data.license_key);
  const now = Date.now() / 1000;
  // One atomic statement authorizes and binds together: concurrent installations cannot both win.
  const row = await db.prepare(`UPDATE licenses SET installation_id=COALESCE(installation_id,?1)
    WHERE key_hash=?2 AND revoked=0 AND (expires_at IS NULL OR expires_at>?3)
    AND (installation_id IS NULL OR installation_id=?1) RETURNING expires_at`)
    .bind(installation, keyHash, now).first();
  if (row) return reply(200, { valid: true, expires_at: row.expires_at, lease_seconds: LEASE_SECONDS });
  // A later lookup only explains denial; it never authorizes an unsuccessful atomic write.
  const denied = await db.prepare('SELECT expires_at,installation_id,revoked FROM licenses WHERE key_hash=?1').bind(keyHash).first();
  const reason = !denied ? 'invalid' : denied.revoked ? 'revoked' : denied.expires_at !== null && denied.expires_at <= now ? 'expired' : 'bound_other';
  return reply(403, { valid: false, reason });
}

async function handle(request, env) {
  const url = new URL(request.url);
  if (url.search) return reply(404, { error: 'not_found' });
  if (request.method === 'GET' && url.pathname === '/health') return reply(200, { ok: true });
  if (!env.DB || typeof env.SMARTNEST_ADMIN_TOKEN !== 'string' || env.SMARTNEST_ADMIN_TOKEN.length < 32 || !env.RATE_LIMITER) return reply(503, { error: 'unavailable' });
  const isAdmin = url.pathname.startsWith('/v1/admin/');
  const isValidate = request.method === 'POST' && url.pathname === '/v1/validate';
  if (!isAdmin && !isValidate) return reply(404, { error: 'not_found' });
  const peer = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const { success } = await env.RATE_LIMITER.limit({ key: `${isAdmin ? 'admin' : 'validate'}:${peer}` });
  if (!success) return reply(429, { error: 'rate_limited' });
  if (isValidate) return validate(await body(request), env.DB);
  if (!await authorized(request, env.SMARTNEST_ADMIN_TOKEN)) return reply(401, { error: 'unauthorized' });
  if (request.method === 'GET' && url.pathname === '/v1/admin/licenses') {
    const result = await env.DB.prepare('SELECT id,created_at,expires_at,installation_id,revoked FROM licenses ORDER BY created_at DESC').all();
    return reply(200, { licenses: result.results });
  }
  if (request.method !== 'POST') return reply(404, { error: 'not_found' });
  if (url.pathname === '/v1/admin/licenses') {
    const data = await body(request);
    onlyKeys(data, ['expires_at']);
    const expires = data.expires_at ?? null;
    if (expires !== null && (typeof expires !== 'number' || !Number.isFinite(expires) || expires <= Date.now() / 1000)) throw new InputError();
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    const licenseKey = `SN-${btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')}`;
    const record = { id: crypto.randomUUID(), created_at: Date.now() / 1000, expires_at: expires };
    await env.DB.prepare('INSERT INTO licenses(id,key_hash,created_at,expires_at) VALUES (?1,?2,?3,?4)').bind(record.id, await hash(licenseKey), record.created_at, expires).run();
    return reply(201, { ...record, license_key: licenseKey });
  }
  const match = /^\/v1\/admin\/licenses\/([^/]+)\/(revoke|reset)$/.exec(url.pathname);
  if (!match || !UUID.test(match[1])) return reply(404, { error: 'not_found' });
  onlyKeys(await body(request), []);
  const change = match[2] === 'revoke' ? 'revoked=1' : 'installation_id=NULL';
  const result = await env.DB.prepare(`UPDATE licenses SET ${change} WHERE id=?1`).bind(match[1].toLowerCase()).run();
  return result.meta.changes > 0 ? reply(200, { ok: true }) : reply(404, { error: 'not_found' });
}

export default {
  async fetch(request, env) {
    try { return await handle(request, env); }
    catch (error) {
      if (error instanceof InputError) return reply(error.status, { error: error.status === 413 ? 'body_too_large' : 'invalid_request' });
      console.error(JSON.stringify({ event: 'license_api_unavailable' }));
      return reply(503, { error: 'unavailable' });
    }
  },
};
