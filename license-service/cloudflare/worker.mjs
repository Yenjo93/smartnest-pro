import { renderPublicPage } from './public-page.mjs';
import { handlePublicRequests, handleAdminRequests } from './requests.mjs';
import { ADMIN_HTML } from './admin-page.mjs';
import { panelConfigured, sameOrigin, passwordMatches, sessionCookie, clearCookie, sessionValid, planExpiry } from './admin-auth.mjs';
/** SmartNest license API for Cloudflare Workers + D1. No customer secrets are logged. */
const LEASE_SECONDS = 259200;
const MAX_BODY = 4096;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const encoder = new TextEncoder();

class InputError extends Error {
  constructor(status = 400) { super('Invalid request'); this.status = status; }
}

function reply(status, data, extraHeaders = {}) {
  return Response.json(data, { status, headers: {
    'Cache-Control': 'no-store',
    'Referrer-Policy': 'no-referrer',
    'X-Frame-Options': 'DENY',
    ...extraHeaders,
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
    AND (installation_id IS NULL OR installation_id=?1) RETURNING expires_at,customer_name`)
    .bind(installation, keyHash, now).first();
  if (row) return reply(200, { valid: true, expires_at: row.expires_at, lease_seconds: LEASE_SECONDS, customer_name: row.customer_name });
  // A later lookup only explains denial; it never authorizes an unsuccessful atomic write.
  const denied = await db.prepare('SELECT expires_at,installation_id,revoked FROM licenses WHERE key_hash=?1').bind(keyHash).first();
  const reason = !denied ? 'invalid' : denied.revoked ? 'revoked' : denied.expires_at !== null && denied.expires_at <= now ? 'expired' : 'bound_other';
  return reply(403, { valid: false, reason });
}

async function htmlPage(markup) {
  const hashes = async (tag) => Promise.all([...markup.matchAll(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)</' + tag + '>', 'g'))].map(async match => {
    const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(match[1])));
    return "'sha256-" + btoa(String.fromCharCode(...bytes)) + "'";
  }));
  const scripts = await hashes('script');
  const styles = await hashes('style');
  return new Response(markup, { headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Content-Security-Policy': "default-src 'none'; script-src " + scripts.join(' ') + "; style-src " + styles.join(' ') + "; connect-src 'self'; img-src 'self' data:; font-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  } });
}

function customerMetadata(data) {
  const result = {};
  for (const [field, max, multiline] of [['customer_name', 100, false], ['customer_contact', 120, false], ['notes', 1000, true]]) {
    if (!Object.hasOwn(data, field)) continue;
    if (typeof data[field] !== 'string') throw new InputError();
    const text = data[field].trim();
    if ((field === 'customer_name' && !text) || Array.from(text).length > max || (multiline ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/ : /[\u0000-\u001f\u007f]/).test(text)) throw new InputError();
    result[field] = text;
  }
  return result;
}

async function handle(request, env) {
  const url = new URL(request.url);
  const publicHost = url.hostname === 'smartnest.pro' || ['localhost', '127.0.0.1'].includes(url.hostname);
  const publicPath = url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '');
  if (request.method === 'GET' && publicHost && ['/', '/license', '/renew', '/support', '/patreon', '/privacy'].includes(publicPath)) return htmlPage(renderPublicPage(publicPath));
  if ((request.method === 'GET' || request.method === 'HEAD') && (url.pathname.startsWith('/brand/') || url.pathname.startsWith('/showcase/')) && env.ASSETS) return env.ASSETS.fetch(request);
  if (url.search && !(request.method === 'GET' && url.pathname === '/v1/admin/requests')) return reply(404, { error: 'not_found' });
  if (url.pathname === '/v1/public/requests' || url.pathname === '/v1/public/site') {
    const result = await handlePublicRequests(request, env);
    if (result) return result;
  }
  if (request.method === 'GET' && (url.pathname === '/admin' || url.pathname === '/admin/')) return htmlPage(ADMIN_HTML);
  if (request.method === 'GET' && url.pathname === '/') return Response.redirect(url.origin + '/admin', 302);
  if (request.method === 'GET' && url.pathname === '/health') return reply(200, { ok: true });
  if (!env.DB || typeof env.SMARTNEST_ADMIN_TOKEN !== 'string' || env.SMARTNEST_ADMIN_TOKEN.length < 32 || !env.RATE_LIMITER) return reply(503, { error: 'unavailable' });
  const isAdmin = url.pathname.startsWith('/v1/admin/');
  const isValidate = request.method === 'POST' && url.pathname === '/v1/validate';
  if (!isAdmin && !isValidate) return reply(404, { error: 'not_found' });
  const peer = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const { success } = await env.RATE_LIMITER.limit({ key: `${isAdmin ? 'admin' : 'validate'}:${peer}` });
  if (!success) return reply(429, { error: 'rate_limited' });
  if (isValidate) return validate(await body(request), env.DB);
  if (url.pathname === '/v1/admin/login' && request.method === 'POST') {
    if (!sameOrigin(request)) return reply(403, { error: 'forbidden' });
    if (!panelConfigured(env)) return reply(503, { error: 'unavailable' });
    const input = await body(request);
    onlyKeys(input, ['password'], ['password']);
    if (!await passwordMatches(input.password, env)) return reply(401, { error: 'unauthorized' });
    return reply(200, { authenticated: true }, { 'Set-Cookie': await sessionCookie(env) });
  }
  if (url.pathname === '/v1/admin/logout' && request.method === 'POST') {
    if (!sameOrigin(request)) return reply(403, { error: 'forbidden' });
    return reply(200, { ok: true }, { 'Set-Cookie': clearCookie() });
  }
  const bearer = await authorized(request, env.SMARTNEST_ADMIN_TOKEN);
  if (!bearer) {
    if (!await sessionValid(request, env)) return reply(401, { error: 'unauthorized' });
    if (request.method !== 'GET' && !sameOrigin(request)) return reply(403, { error: 'forbidden' });
  }
  if (request.method === 'GET' && url.pathname === '/v1/admin/session') return reply(200, { authenticated: true });
  const requestAdmin = await handleAdminRequests(request, env);
  if (requestAdmin) return requestAdmin;
  if (request.method === 'GET' && url.pathname === '/v1/admin/licenses') {
    const result = await env.DB.prepare('SELECT id,created_at,expires_at,installation_id,revoked,customer_name,customer_contact,notes FROM licenses ORDER BY created_at DESC').all();
    return reply(200, { licenses: result.results });
  }
  if (request.method !== 'POST') return reply(404, { error: 'not_found' });
  if (url.pathname === '/v1/admin/licenses') {
    const data = await body(request);
    onlyKeys(data, ['expires_at', 'plan', 'customer_name', 'customer_contact', 'notes']);
    const metadata = { customer_name: '', customer_contact: '', notes: '', ...customerMetadata(data) };
    if (Object.hasOwn(data, 'plan') && Object.hasOwn(data, 'expires_at')) throw new InputError();
    const issuedAt = Date.now() / 1000;
    let expires = data.expires_at ?? null;
    if (Object.hasOwn(data, 'plan')) {
      if (typeof data.plan !== 'string') throw new InputError();
      try { expires = planExpiry(data.plan, issuedAt); }
      catch { throw new InputError(); }
    }
    if (expires !== null && (typeof expires !== 'number' || !Number.isFinite(expires) || expires <= Date.now() / 1000)) throw new InputError();
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    const licenseKey = `SN-${btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')}`;
    const record = { id: crypto.randomUUID(), created_at: issuedAt, expires_at: expires, ...metadata };
    await env.DB.prepare('INSERT INTO licenses(id,key_hash,created_at,expires_at,customer_name,customer_contact,notes) VALUES (?1,?2,?3,?4,?5,?6,?7)').bind(record.id, await hash(licenseKey), record.created_at, expires, metadata.customer_name, metadata.customer_contact, metadata.notes).run();
    return reply(201, { ...record, license_key: licenseKey });
  }
  const match = /^\/v1\/admin\/licenses\/([^/]+)\/(revoke|reset|update|renew)$/.exec(url.pathname);
  if (!match || !UUID.test(match[1])) return reply(404, { error: 'not_found' });
  const identifier = match[1].toLowerCase();
  const data = await body(request);
  if (match[2] === 'update') {
    onlyKeys(data, ['customer_name', 'customer_contact', 'notes']);
    const metadata = customerMetadata(data);
    const fields = Object.keys(metadata);
    if (!fields.length) throw new InputError();
    // Only fixed, validated column names enter SQL; values are always bound.
    const assignments = fields.map((field, index) => field + '=?' + (index + 2)).join(',');
    const result = await env.DB.prepare(`UPDATE licenses SET ${assignments} WHERE id=?1`)
      .bind(identifier, ...fields.map(field => metadata[field])).run();
    return result.meta.changes > 0 ? reply(200, { ok: true }) : reply(404, { error: 'not_found' });
  }
  if (match[2] === 'renew') {
    onlyKeys(data, ['plan'], ['plan']);
    if (typeof data.plan !== 'string' || !['3_months', '6_months', '1_year', 'lifetime'].includes(data.plan)) throw new InputError();
    for (let attempt = 0; attempt < 4; attempt++) {
      const current = await env.DB.prepare('SELECT expires_at FROM licenses WHERE id=?1').bind(identifier).first();
      if (!current) return reply(404, { error: 'not_found' });
      if (current.expires_at === null && data.plan !== 'lifetime') return reply(409, { error: 'already_lifetime' });
      const expires = planExpiry(data.plan, Math.max(Date.now() / 1000, current.expires_at ?? 0));
      // Compare-and-swap prevents simultaneous renewals from overwriting one another.
      const result = await env.DB.prepare('UPDATE licenses SET expires_at=?1 WHERE id=?2 AND expires_at IS ?3 RETURNING expires_at,revoked')
        .bind(expires, identifier, current.expires_at).first();
      if (result) return reply(200, { ok: true, expires_at: result.expires_at, revoked: result.revoked });
    }
    return reply(409, { error: 'conflict' });
  }
  onlyKeys(data, []);
  const change = match[2] === 'revoke' ? 'revoked=1' : 'installation_id=NULL';
  const result = await env.DB.prepare(`UPDATE licenses SET ${change} WHERE id=?1`).bind(identifier).run();
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
