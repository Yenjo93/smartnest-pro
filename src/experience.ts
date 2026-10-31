import type { Hass, Plan, ProConfig } from './types';

export interface UserPreferences {
  favorites: string[];
  favorites_configured?: boolean;
  start_page: string;
  screen_start_page?: string;
  page_order: string[];
  simple_mode: boolean;
  font_scale: number;
  high_contrast: boolean;
}
const defaults = (): UserPreferences => ({ favorites: [], start_page: 'home', page_order: [], simple_mode: false, font_scale: 1, high_contrast: false });
const key = (h: Hass) => `smartnest.preferences.v1.${h.user?.id ?? 'guest'}`;
export function getPreferences(h: Hass): UserPreferences {
  try {
    const raw = JSON.parse(localStorage.getItem(key(h)) ?? '{}');
    return { ...defaults(), ...raw, favorites: Array.isArray(raw.favorites) ? raw.favorites.filter((id: unknown) => typeof id === 'string') : [], page_order: Array.isArray(raw.page_order) ? raw.page_order.filter((id: unknown) => typeof id === 'string') : [], font_scale: Math.min(1.5, Math.max(0.9, Number(raw.font_scale) || 1)) };
  } catch { return defaults(); }
}
export function savePreferences(h: Hass, patch: Partial<UserPreferences>, persist = true): boolean {
  try { const next = { ...getPreferences(h), ...patch, ...(Object.prototype.hasOwnProperty.call(patch, 'favorites') ? { favorites_configured: true } : {}) }; localStorage.setItem(key(h), JSON.stringify(next)); window.dispatchEvent(new CustomEvent('sn-preferences-change')); if (persist) { const { favorites_configured, screen_start_page, ...preferences } = patch; void h.callWS({ type: 'smartnest_pro/preferences/save', preferences }).catch(() => {}); } return true; }
  catch { return false; }
}
export function lightweight(config: ProConfig): boolean {
  if (config.settings.performance === 'light') return true;
  if (config.settings.performance === 'high') return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return !!config.settings.reduce_effects || !!nav.connection?.saveData || (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) || navigator.hardwareConcurrency <= 4;
}
export function planTemplate(kind: string, hass: Hass, lang: string): Plan {
  if (kind === 'empty') return { floors: [], devices: {}, hidden: [] };
  const areas = Object.values(hass.areas ?? {});
  const count = kind === 'two_floors' ? 2 : 1;
  const perFloor = kind === 'wall_tablet' ? 1 : 3;
  const ar = lang === 'ar';
  return { floors: Array.from({ length: count }, (_, f) => ({
    id: crypto.randomUUID(), name: ar ? (f ? 'الطابق العلوي' : 'الطابق الأرضي') : (f ? 'Upper floor' : 'Ground floor'),
    rooms: Array.from({ length: perFloor }, (_, r) => ({ id: crypto.randomUUID(), x: (r % 2) * 5, y: Math.floor(r / 2) * 4, w: kind === 'wall_tablet' ? 8 : 5, h: kind === 'wall_tablet' ? 6 : 4, area: areas[f * 3 + r]?.area_id })),
    doors: [], walls: [], furniture: [], wallHeight: 1.05,
  })), devices: {}, hidden: [] };
}
export interface AccessScope { restricted: boolean; areas: string[]; entities: string[]; guest_expired: boolean; guest_until?: number }
export function scopedHass(h: Hass, scope?: AccessScope): Hass {
  if (!scope?.restricted || h.user?.is_admin) return h;
  const allowed = (id: string) => {
    if (scope.guest_expired) return false;
    if (scope.entities.includes(id)) return true;
    const reg = h.entities?.[id];
    const area = reg?.area_id ?? (reg?.device_id ? h.devices?.[reg.device_id]?.area_id : undefined);
    return !!area && scope.areas.includes(area) && !id.startsWith('scene.') && !id.startsWith('script.');
  };
  const states = Object.fromEntries(Object.entries(h.states).filter(([id]) => allowed(id)));
  const entities = Object.fromEntries(Object.entries(h.entities ?? {}).filter(([id]) => allowed(id)));
  const deviceIds = new Set(Object.values(entities).map(e => e.device_id));
  return { ...h, states, entities, devices: Object.fromEntries(Object.entries(h.devices ?? {}).filter(([id]) => deviceIds.has(id))), areas: Object.fromEntries(Object.entries(h.areas ?? {}).filter(([id]) => scope.areas.includes(id))) };
}

export function isPreviewMutation(type: string): boolean {
  return type === 'call_service' || type === 'smartnest_pro/action' || /^smartnest_pro\/(?:timer|schedule)\/(?:set|add|cancel)$/.test(type) || type === 'smartnest_pro/config/save' || type === 'smartnest_pro/preferences/save';
}
