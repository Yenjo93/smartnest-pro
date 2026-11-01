import type { Hass, Plan, ProConfig } from './types';

export interface UserPreferences {
  favorites: string[];
  favorites_configured?: boolean;
  screen_favorites?: string[];
  wall_display?: boolean;
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
    return { ...defaults(), ...raw, favorites: Array.isArray(raw.favorites) ? raw.favorites.filter((id: unknown) => typeof id === 'string') : [], screen_favorites: Array.isArray(raw.screen_favorites) ? raw.screen_favorites.filter((id: unknown)=>typeof id==='string') : undefined, page_order: Array.isArray(raw.page_order) ? raw.page_order.filter((id: unknown) => typeof id === 'string') : [], font_scale: Math.min(1.5, Math.max(0.9, Number(raw.font_scale) || 1)) };
  } catch { return defaults(); }
}
export function savePreferences(h: Hass, patch: Partial<UserPreferences>, persist = true): boolean {
  try { const next = { ...getPreferences(h), ...patch, ...(Object.prototype.hasOwnProperty.call(patch, 'favorites') ? { favorites_configured: true } : {}) }; localStorage.setItem(key(h), JSON.stringify(next)); window.dispatchEvent(new CustomEvent('sn-preferences-change')); if (persist) { const { favorites_configured, screen_start_page, screen_favorites, wall_display, ...preferences } = patch; void h.callWS({ type: 'smartnest_pro/preferences/save', preferences }).catch(() => {}); } return true; }
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
  const count = kind === 'two_floors' ? 2 : kind === 'auto' ? Math.max(1, Math.ceil(areas.length / 6)) : 1;
  const perFloor = ['wall_tablet','studio'].includes(kind) ? 1 : kind === 'auto' ? Math.min(6, Math.max(1, areas.length)) : 3;
  const ar = lang === 'ar';
  return { floors: Array.from({ length: count }, (_, f) => ({
    id: crypto.randomUUID(), name: ar ? (f ? 'الطابق العلوي' : 'الطابق الأرضي') : (f ? 'Upper floor' : 'Ground floor'),
    rooms: Array.from({ length: kind === 'auto' ? Math.max(0, Math.min(perFloor, areas.length - f * perFloor)) : perFloor }, (_, r) => ({ id: crypto.randomUUID(), x: (r % 2) * 5, y: Math.floor(r / 2) * 4, w: kind === 'wall_tablet' ? 8 : 5, h: kind === 'wall_tablet' ? 6 : 4, area: areas[f * perFloor + r]?.area_id })),
    doors: [], walls: [], furniture: [], wallHeight: 1.05,
  })), devices: {}, hidden: [] };
}
export interface AccessScope { restricted: boolean; areas: string[]; entities: string[]; guest_expired: boolean; guest_until?: number; child_mode?: boolean }
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

/** Normalize Arabic spelling/diacritics alongside English without changing display names. */
export function searchText(value: string): string {
  return value.normalize('NFKD').replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').toLocaleLowerCase().trim();
}
export function searchMatches(hass: Hass, config: ProConfig, entityId: string, query: string): boolean {
  const words=searchText(query).split(/\s+/).filter(Boolean);
  const haystack=searchText([entityId,config.names?.[entityId],hass.states[entityId]?.attributes.friendly_name,...(Array.isArray(config.aliases?.[entityId])?config.aliases![entityId]:[])].filter(Boolean).join(' '));
  return words.every(word=>haystack.includes(word));
}
export function setupSuggestions(hass: Hass): Pick<ProConfig,'home'|'rooms'> {
  const visible=Object.values(hass.states).filter(entity=>!hass.entities?.[entity.entity_id]?.hidden&&!hass.entities?.[entity.entity_id]?.entity_category);
  const first=(predicate:(entity:typeof visible[number])=>boolean)=>visible.find(predicate)?.entity_id;
  const roomFor=(id:string)=>{const registry=hass.entities?.[id];return registry?.area_id??(registry?.device_id?hass.devices?.[registry.device_id]?.area_id:undefined);};
  const rooms:ProConfig['rooms']={};
  for(const area of Object.values(hass.areas??{})){
    const rows=visible.filter(entity=>roomFor(entity.entity_id)===area.area_id);
    const find=(domain:string,deviceClass?:string)=>rows.find(entity=>entity.entity_id.startsWith(domain+'.')&&(!deviceClass||entity.attributes.device_class===deviceClass))?.entity_id;
    rooms[area.area_id]={climate:find('climate'),temperature:find('sensor','temperature'),humidity:find('sensor','humidity'),occupancy:rows.find(entity=>entity.entity_id.startsWith('binary_sensor.')&&['occupancy','motion','presence'].includes(entity.attributes.device_class))?.entity_id};
  }
  return {home:{devices:visible.filter(entity=>/^(light|switch|climate|cover|vacuum|media_player)\./.test(entity.entity_id)).slice(0,6).map(entity=>entity.entity_id),scenes:visible.filter(entity=>entity.entity_id.startsWith('scene.')).slice(0,4).map(entity=>entity.entity_id),weather:first(entity=>entity.entity_id.startsWith('weather.')),energy:first(entity=>entity.attributes.device_class==='energy'&&entity.attributes.state_class==='total_increasing'&&entity.attributes.unit_of_measurement==='kWh'),climate:first(entity=>entity.entity_id.startsWith('climate.'))},rooms};
}

export function favoriteIds(preferences:UserPreferences):string[]{return preferences.screen_favorites??preferences.favorites;}

export function actionNeedsConfirmation(domain:string,service:string,data:Record<string,unknown>,criticalEntities:string[]):boolean{
 const targets=typeof data.entity_id==='string'?[data.entity_id]:Array.isArray(data.entity_id)?data.entity_id:[];
 const security=(domain==='lock'&&['unlock','open'].includes(service))||(domain==='alarm_control_panel'&&service==='alarm_disarm');
 const zero=(key:string)=>data[key]!==undefined&&Number(data[key])===0;
 const turnsOff=['turn_off','toggle','close_cover','stop'].includes(service)||(service==='set_hvac_mode'&&data.hvac_mode==='off')||(service==='set_percentage'&&zero('percentage'))||(domain==='light'&&service==='turn_on'&&(zero('brightness')||zero('brightness_pct')));
 return security||(turnsOff&&targets.some(id=>criticalEntities.includes(String(id))));
}
