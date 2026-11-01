/** Public request intake. Owner routes MUST be called only after the parent auth guard. */
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const STATUSES = ['new', 'in_progress', 'closed'];
const TYPES = ['license', 'renewal', 'support', 'patreon'];
const PLANS = ['3_months', '6_months', '1_year', 'lifetime'];
const encoder = new TextEncoder();
class RequestError extends Error { constructor(status = 400) { super('Invalid request'); this.status = status; } }
function reply(status, data) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Content-Security-Policy': "default-src 'none'", ...(status === 429 ? { 'Retry-After': '60' } : {}) } });
}
async function body(request) {
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json' || !request.body) throw new RequestError();
  const length = request.headers.get('Content-Length');
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > 16384)) throw new RequestError(Number(length) > 16384 ? 413 : 400);
  const reader = request.body.getReader(); const chunks = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 16384) { await reader.cancel(); throw new RequestError(413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  let parsed;
  try { parsed = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); } catch { throw new RequestError(); }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new RequestError();
  return parsed;
}
function keys(data, allowed, required = []) {
  if (Object.keys(data).some(key => !allowed.includes(key)) || required.some(key => !Object.hasOwn(data, key))) throw new RequestError();
}
function text(value, max, required = false, multiline = false) {
  if (typeof value !== 'string') throw new RequestError();
  value = value.trim();
  if ((required && !value) || Array.from(value).length > max || (multiline ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/ : /[\u0000-\u001f\u007f]/).test(value)) throw new RequestError();
  return value;
}
async function sha(value) { return [...new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)))].map(v => v.toString(16).padStart(2, '0')).join(''); }
function normalized(data) {
  keys(data, ['submission_id', 'type', 'plan', 'name', 'contact_method', 'contact', 'license_reference', 'message', 'consent', 'website'], ['submission_id', 'type', 'plan', 'name', 'contact_method', 'contact', 'message', 'consent']);
  if (typeof data.submission_id !== 'string' || !UUID.test(data.submission_id) || !TYPES.includes(data.type) || data.consent !== true || (Object.hasOwn(data, 'website') && data.website !== '')) throw new RequestError();
  if (['license', 'renewal'].includes(data.type) ? !PLANS.includes(data.plan) : data.plan !== '') throw new RequestError();
  const name = text(data.name, 100, true), contact = text(data.contact, 120, true);
  if (!['email', 'whatsapp'].includes(data.contact_method)) throw new RequestError();
  if (data.contact_method === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) throw new RequestError();
  if (data.contact_method === 'whatsapp' && (!/^\+?[0-9 ()-]+$/.test(contact) || contact.replace(/\D/g, '').length < 7 || contact.replace(/\D/g, '').length > 15)) throw new RequestError();
  const licenseReference = text(data.license_reference ?? '', 80);
  // The public form must never collect activation keys.
  if (/SN-[A-Za-z0-9_-]{16,}/i.test(licenseReference) || /SN-[A-Za-z0-9_-]{16,}/i.test(data.message)) throw new RequestError();
  return { submission_id: data.submission_id.toLowerCase(), type: data.type, plan: data.plan, name, contact_method: data.contact_method, contact, license_reference: licenseReference, message: text(data.message, 2000, data.type === 'support', true) };
}
function patreonUrl(value) {
  if (value === '') return '';
  value = text(value, 500, true);
  let url; try { url = new URL(value); } catch { throw new RequestError(); }
  if (url.protocol !== 'https:' || !['patreon.com', 'www.patreon.com'].includes(url.hostname) || url.username || url.password || url.port || !url.pathname.replaceAll('/', '') || url.hash) throw new RequestError();
  return url.toString();
}
async function configuredPatreon(env) {
  const row = await env.DB.prepare("SELECT value FROM site_settings WHERE key='patreon_url'").first();
  if (!row?.value) return null;
  try { return patreonUrl(row.value); } catch { return null; }
}
function cursor(value) {
  if (!value) return null;
  if (value.length > 200 || !/^[A-Za-z0-9_-]+$/.test(value)) throw new RequestError();
  let parsed; try { parsed = JSON.parse(atob(value.replaceAll('-', '+').replaceAll('_', '/'))); } catch { throw new RequestError(); }
  if (!Array.isArray(parsed) || parsed.length !== 2 || typeof parsed[0] !== 'number' || !Number.isFinite(parsed[0]) || parsed[0] <= 0 || typeof parsed[1] !== 'string' || !UUID.test(parsed[1])) throw new RequestError();
  return parsed;
}
const encodeCursor = row => btoa(JSON.stringify([row.created_at, row.id])).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
const columns = 'id,reference,type,plan,name,contact_method,contact,license_reference,message,created_at,status,admin_note';

export async function handlePublicRequests(request, env) {
  const url = new URL(request.url);
  const site = url.pathname === '/v1/public/site' && request.method === 'GET';
  const submit = url.pathname === '/v1/public/requests' && request.method === 'POST';
  if (!site && !submit) return undefined;
  try {
    if (url.search) throw new RequestError();
    if (!env.DB) return reply(503, { error: 'unavailable' });
    if (site) return reply(200, { patreon_url: await configuredPatreon(env) });
    if (request.headers.get('Origin') !== url.origin) return reply(403, { error: 'forbidden' });
    if (!env.PUBLIC_REQUEST_LIMITER) return reply(503, { error: 'unavailable' });
    if (!(await env.PUBLIC_REQUEST_LIMITER.limit({ key: request.headers.get('CF-Connecting-IP') ?? 'unknown' })).success) return reply(429, { error: 'rate_limited' });
    const input = normalized(await body(request));
    const fingerprint = await sha(JSON.stringify(input));
    const id = crypto.randomUUID(); const reference = 'SNREQ-' + id.replaceAll('-', '').slice(0, 16).toUpperCase();
    await env.DB.prepare(`INSERT INTO customer_requests (id,submission_id,reference,payload_hash,type,plan,name,contact_method,contact,license_reference,message,created_at,status,admin_note) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,'new','') ON CONFLICT(submission_id) DO NOTHING`)
      .bind(id, input.submission_id, reference, fingerprint, input.type, input.plan, input.name, input.contact_method, input.contact, input.license_reference, input.message, Date.now() / 1000).run();
    const row = await env.DB.prepare('SELECT reference,payload_hash FROM customer_requests WHERE submission_id=?1').bind(input.submission_id).first();
    if (!row) return reply(503, { error: 'unavailable' });
    if (row.payload_hash !== fingerprint) return reply(409, { error: 'submission_conflict' });
    return reply(201, { received: true, reference: row.reference });
  } catch (error) { return reply(error instanceof RequestError ? error.status : 503, { error: error instanceof RequestError ? (error.status === 413 ? 'body_too_large' : 'invalid_request') : 'unavailable' }); }
}

/** Parent must authenticate before calling this function. */
export async function handleAdminRequests(request, env) {
  const url = new URL(request.url);
  const isList = url.pathname === '/v1/admin/requests' && request.method === 'GET';
  const update = /^\/v1\/admin\/requests\/([^/]+)\/update$/.exec(url.pathname);
  const site = url.pathname === '/v1/admin/site' && ['GET', 'POST'].includes(request.method);
  if (!isList && !(update && request.method === 'POST') && !site) return undefined;
  try {
    if (!env.DB) return reply(503, { error: 'unavailable' });
    if (isList) {
      if ([...url.searchParams.keys()].some(key => !['cursor', 'status', 'search'].includes(key)) || [...new Set(url.searchParams.keys())].some(key => url.searchParams.getAll(key).length !== 1)) throw new RequestError();
      const status = url.searchParams.get('status') ?? 'all'; if (status !== 'all' && !STATUSES.includes(status)) throw new RequestError();
      const search = text(url.searchParams.get('search') ?? '', 160);
      const before = cursor(url.searchParams.get('cursor'));
      const predicates = []; const values = [];
      const bind = value => { values.push(value); return '?' + values.length; };
      if (status !== 'all') predicates.push('status=' + bind(status));
      if (search) {
        const term = '%' + search.replace(/[\\%_]/g, value => '\\' + value) + '%';
        const parameter = bind(term);
        predicates.push(`(name LIKE ${parameter} ESCAPE '\\' OR reference LIKE ${parameter} ESCAPE '\\' OR contact LIKE ${parameter} ESCAPE '\\')`);
      }
      if (before) { const time = bind(before[0]), id = bind(before[1]); predicates.push(`(created_at<${time} OR (created_at=${time} AND id<${id}))`); }
      const statement = env.DB.prepare(`SELECT ${columns} FROM customer_requests ${predicates.length ? 'WHERE ' + predicates.join(' AND ') : ''} ORDER BY created_at DESC,id DESC LIMIT 101`);
      const result = await (values.length ? statement.bind(...values) : statement).all();
      const requests = result.results.slice(0, 100);
      const count = await env.DB.prepare("SELECT COUNT(*) AS total FROM customer_requests WHERE status='new'").first();
      return reply(200, { requests, next_cursor: result.results.length > 100 ? encodeCursor(requests[99]) : null, new_count: Number(count?.total ?? 0) });
    }
    if (site) {
      if (url.search) throw new RequestError();
      if (request.method === 'GET') return reply(200, { patreon_url: await configuredPatreon(env) });
      const data = await body(request); keys(data, ['patreon_url'], ['patreon_url']); const value = patreonUrl(data.patreon_url);
      await env.DB.prepare("INSERT INTO site_settings(key,value) VALUES ('patreon_url',?1) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(value).run();
      return reply(200, { success: true, patreon_url: value || null });
    }
    if (url.search || !UUID.test(update[1])) throw new RequestError();
    const data = await body(request); keys(data, ['status', 'admin_note']);
    if (!Object.keys(data).length) throw new RequestError();
    const changes = []; const values = [];
    if (Object.hasOwn(data, 'status')) { if (!STATUSES.includes(data.status)) throw new RequestError(); values.push(data.status); changes.push('status=?' + values.length); }
    if (Object.hasOwn(data, 'admin_note')) { values.push(text(data.admin_note, 2000, false, true)); changes.push('admin_note=?' + values.length); }
    values.push(update[1].toLowerCase());
    const result = await env.DB.prepare(`UPDATE customer_requests SET ${changes.join(',')} WHERE id=?${values.length}`).bind(...values).run();
    return result.meta.changes ? reply(200, { success: true }) : reply(404, { error: 'not_found' });
  } catch (error) { return reply(error instanceof RequestError ? error.status : 503, { error: error instanceof RequestError ? (error.status === 413 ? 'body_too_large' : 'invalid_request') : 'unavailable' }); }
}
