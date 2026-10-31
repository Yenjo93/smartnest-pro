/** Signed, expiring owner sessions. No credentials are returned to browser JavaScript. */
const encoder = new TextEncoder();
const COOKIE = '__Host-smartnest_admin';
const SESSION_SECONDS = 8 * 60 * 60;
const hex = buffer => [...new Uint8Array(buffer)].map(v => v.toString(16).padStart(2, '0')).join('');

async function signingKey(env) {
  return crypto.subtle.importKey('raw', encoder.encode(env.SMARTNEST_ADMIN_TOKEN + '\0' + env.SMARTNEST_PANEL_PASSWORD), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export function panelConfigured(env) {
  return typeof env.SMARTNEST_PANEL_PASSWORD === 'string' && env.SMARTNEST_PANEL_PASSWORD.length >= 16;
}

export function sameOrigin(request) {
  return request.headers.get('Origin') === new URL(request.url).origin;
}

export async function passwordMatches(password, env) {
  if (!panelConfigured(env) || typeof password !== 'string' || password.length > 256) return false;
  const key = await signingKey(env);
  const expected = await crypto.subtle.sign('HMAC', key, encoder.encode(env.SMARTNEST_PANEL_PASSWORD));
  return crypto.subtle.verify('HMAC', key, expected, encoder.encode(password));
}

export async function sessionCookie(env) {
  const expiry = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const message = `${expiry}.${crypto.randomUUID()}`;
  const signature = hex(await crypto.subtle.sign('HMAC', await signingKey(env), encoder.encode(message)));
  return `${COOKIE}=${message}.${signature}; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_SECONDS}`;
}

export function clearCookie() {
  return `${COOKIE}=; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;
}

export async function sessionValid(request, env) {
  if (!panelConfigured(env)) return false;
  const cookies = (request.headers.get('Cookie') ?? '').split(';').map(value => value.trim());
  const values = cookies.filter(value => value.startsWith(COOKIE + '='));
  if (values.length !== 1) return false;
  const token = values[0].slice(COOKIE.length + 1);
  const match = /^(\d{10})\.([a-f0-9-]{36})\.([a-f0-9]{64})$/.exec(token);
  if (!match) return false;
  const expiry = Number(match[1]);
  const now = Math.floor(Date.now() / 1000);
  if (expiry <= now || expiry > now + SESSION_SECONDS) return false;
  const signature = new Uint8Array(match[3].match(/../g).map(byte => parseInt(byte, 16)));
  return crypto.subtle.verify('HMAC', await signingKey(env), signature, encoder.encode(`${match[1]}.${match[2]}`));
}

/** Calendar months from issuance, preserving UTC time and clamping month ends. */
export function planExpiry(plan, issuedAt) {
  const months = { '3_months': 3, '6_months': 6, '1_year': 12 };
  if (plan === 'lifetime') return null;
  if (!Object.hasOwn(months, plan)) throw new RangeError('Unknown plan');
  const date = new Date(issuedAt * 1000);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months[plan]);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return date.getTime() / 1000;
}
