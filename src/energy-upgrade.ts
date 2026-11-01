import type { Hass, ProConfig } from './types';

export type TariffSlot = { start: string; end: string; rate: number };
export type HourStat = { start: string | number; change?: number | null };
const time = (value: string) => /^(?:[01]\d|2[0-3]):00$/.test(value) ? Number(value.slice(0, 2)) : value === '24:00' ? 24 : NaN;
/** Hour-boundary slots avoid pretending to know the consumption within a recorder hour. */
export function validTariffSchedule(slots: TariffSlot[]): boolean {
  if (!Array.isArray(slots) || slots.length > 24) return false;
  const hours = new Set<number>();
  for (const slot of slots) {
    if (!slot || typeof slot.start !== 'string' || typeof slot.end !== 'string' || typeof slot.rate !== 'number' || !Number.isFinite(slot.rate) || slot.rate < 0) return false;
    const start = time(slot.start), end = time(slot.end);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start === 24 || start === end) return false;
    const length = (end - start + 24) % 24 || 24;
    for (let i = 0; i < length; i++) { const hour = (start + i) % 24; if (hours.has(hour)) return false; hours.add(hour); }
  }
  return true;
}
export function tariffAt(date: Date, fallback?: number, slots: TariffSlot[] = []): number | undefined {
  if (!validTariffSchedule(slots)) return undefined;
  const hour = date.getHours();
  const match = slots.find(slot => { const start = time(slot.start), end = time(slot.end); return start < end ? hour >= start && hour < end : hour >= start || hour < end; });
  const rate = match?.rate ?? fallback;
  return typeof rate === 'number' && Number.isFinite(rate) && rate >= 0 ? rate : undefined;
}
export function statTime(value: string | number): number {
  return typeof value === 'number' ? (value < 1e12 ? value * 1000 : value) : Date.parse(value);
}
export function recordedCost(rows: HourStat[], fallback?: number, slots: TariffSlot[] = []) {
  const seen = new Set<number>(); let energy = 0, cost = 0, points = 0, missingRate = false;
  for (const row of rows) {
    const at = statTime(row.start), value = row.change;
    if (!Number.isFinite(at) || seen.has(at) || typeof value !== 'number' || !Number.isFinite(value) || value < 0) continue;
    seen.add(at); energy += value; points++;
    const rate = tariffAt(new Date(at), fallback, slots);
    if (rate === undefined) missingRate = true; else cost += value * rate;
  }
  return { energy: points ? energy : undefined, cost: points && !missingRate ? cost : undefined, points, missingRate };
}
/** Average demand across complete local 00:00–06:00 nights, never extrapolated from a partial night. */
export function nightBaseline(rows: HourStat[], now = new Date()) {
  const days = new Map<string, Map<number, number>>(), invalid = new Set<string>(), seen = new Set<number>();
  for (const row of rows) {
    const at = statTime(row.start), date = new Date(at), value = row.change;
    if (!Number.isFinite(at) || date.getHours() >= 6 || date.getMinutes() !== 0 || at + 3600000 > now.getTime() || typeof value !== 'number' || !Number.isFinite(value) || value < 0) continue;
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    if (seen.has(at)) continue; seen.add(at);
    const hours = days.get(key) ?? new Map<number, number>(); if (hours.has(date.getHours())) invalid.add(key); hours.set(date.getHours(), value); days.set(key, hours);
  }
  const complete = [...days.entries()].filter(([key, hours]) => !invalid.has(key) && hours.size === 6 && [0, 1, 2, 3, 4, 5].every(hour => hours.has(hour))).map(([, hours]) => hours);
  return { nights: complete.length, averageKw: complete.length ? complete.reduce((sum, hours) => sum + [...hours.values()].reduce((a, b) => a + b, 0), 0) / (complete.length * 6) : undefined };
}
export function entityArea(hass: Hass, id: string): string | undefined {
  const entry = hass.entities?.[id]; return entry?.area_id ?? (entry?.device_id ? hass.devices?.[entry.device_id]?.area_id : undefined) ?? undefined;
}
/** One recorder meter per registered device avoids adding multiple tariff sub-meters for that same device. */
export function deviceEnergyIds(hass: Hass, excluded: string[] = []): string[] {
  const devices = new Set<string>(), excludedDevices = new Set(excluded.map(id => hass.entities?.[id]?.device_id).filter(Boolean));
  return Object.values(hass.states).filter(entity => {
    if (excluded.includes(entity.entity_id) || entity.attributes.device_class !== 'energy' || !['total', 'total_increasing'].includes(entity.attributes.state_class) || !['kWh', 'Wh'].includes(entity.attributes.unit_of_measurement)) return false;
    const device = hass.entities?.[entity.entity_id]?.device_id;
    if (!device || excludedDevices.has(device) || devices.has(device)) return false;
    devices.add(device); return true;
  }).map(entity => entity.entity_id).slice(0, 40);
}
export function longOpen(lastChanged: string, minutes: number, now = Date.now()): number | undefined {
  const changed = Date.parse(lastChanged), elapsed = (now - changed) / 60000;
  return Number.isFinite(elapsed) && elapsed >= Math.max(1, minutes) ? Math.floor(elapsed) : undefined;
}
export function maintenanceUsage(task: { usage_entity?: string; usage_interval?: number; usage_baseline?: number }, hass: Hass) {
  if (!task.usage_entity || !(typeof task.usage_interval === 'number' && task.usage_interval > 0)) return undefined;
  const entity = hass.states[task.usage_entity];
  if (!entity || ['unknown', 'unavailable', ''].includes(entity.state)) return undefined;
  const current = Number(entity.state), baseline = task.usage_baseline;
  if (!Number.isFinite(current) || typeof baseline !== 'number' || !Number.isFinite(baseline) || current < baseline) return undefined;
  return { current, used: current - baseline, due: current - baseline >= task.usage_interval, unit: String(entity.attributes.unit_of_measurement ?? '') };
}
const object = (value: unknown): value is Record<string, any> => !!value && typeof value === 'object' && !Array.isArray(value);
/** Validate before normalize: unknown versions and malformed nested geometry must never be silently replaced. */
export function backupIssues(raw: unknown): string[] {
  const errors: string[] = [];
  if (!object(raw) || raw.version !== 1) return ['version'];
  for (const key of ['settings', 'hero', 'rooms', 'home', 'plan']) if (!object(raw[key])) errors.push(key);
  if (object(raw.settings)) { if (raw.settings.language !== undefined && !['auto','ar','en'].includes(raw.settings.language)) errors.push('language'); if (raw.settings.theme !== undefined && !['auto','light','dark','purple'].includes(raw.settings.theme)) errors.push('theme'); }
  if (!object(raw.plan) || !Array.isArray(raw.plan.floors) || raw.plan.floors.length > 50) return [...errors, 'floors'];
  const numeric = (value: unknown) => typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= 1e5;
  if (raw.plan.devices !== undefined && !object(raw.plan.devices)) errors.push('devices');
  else for (const marker of Object.values(raw.plan.devices ?? {})) if (!object(marker) || typeof marker.floor !== 'string' || !numeric(marker.x) || !numeric(marker.y)) errors.push('device_position');
  const floorIds = new Set<string>();
  for (const floor of raw.plan.floors) {
    if (!object(floor) || typeof floor.id !== 'string' || !Array.isArray(floor.rooms)) { errors.push('floor'); continue; }
    if (floorIds.has(floor.id)) errors.push('duplicate_floor'); floorIds.add(floor.id);
    for (const list of ['rooms', 'furniture', 'walls', 'doors']) { if (floor[list] !== undefined && (!Array.isArray(floor[list]) || floor[list].length > 2000)) errors.push(list); const ids = new Set<string>(); for (const item of Array.isArray(floor[list]) ? floor[list] : []) { if (!object(item) || typeof item.id !== 'string' || !item.id || ids.has(item.id)) errors.push('duplicate_item'); else ids.add(item.id); } }
    for (const room of floor.rooms) {
      if (!object(room) || typeof room.id !== 'string' || !['x', 'y', 'w', 'h'].every(key => numeric(room[key])) || room.w <= 0 || room.h <= 0 || (room.pts !== undefined && (!Array.isArray(room.pts) || room.pts.length < 3 || room.pts.some((point: unknown) => !object(point) || !numeric(point.x) || !numeric(point.y))))) errors.push('room');
    }
    for (const item of Array.isArray(floor.furniture) ? floor.furniture : []) if (!object(item) || typeof item.id !== 'string' || typeof item.type !== 'string' || !numeric(item.x) || !numeric(item.y) || (item.rot !== undefined && !numeric(item.rot))) errors.push('furniture');
    for (const wall of Array.isArray(floor.walls) ? floor.walls : []) if (!object(wall) || typeof wall.id !== 'string' || !['x1','y1','x2','y2'].every(key => numeric(wall[key]))) errors.push('wall');
    for (const door of Array.isArray(floor.doors) ? floor.doors : []) if (!object(door) || typeof door.id !== 'string' || !numeric(door.width) || door.width <= 0 || (door.x !== undefined ? !numeric(door.x) || !numeric(door.y) : !['h','v'].includes(door.axis) || !numeric(door.line) || !numeric(door.at))) errors.push('door');
  }
  return [...new Set(errors)];
}
export function backupSummary(config: ProConfig) {
  return { floors: config.plan.floors.length, rooms: config.plan.floors.reduce((sum, floor) => sum + floor.rooms.length, 0), furniture: config.plan.floors.reduce((sum, floor) => sum + (floor.furniture?.length ?? 0), 0), favorites: config.home.devices.length };
}

/** Explicit link fields only: labels, URLs, notes and area IDs are not entity references. */
export function missingConfigEntities(config: ProConfig, states: Record<string, unknown>): string[] {
  const links = new Set<string>();
  const add = (value: unknown) => {
    if (typeof value === 'string' && /^[a-z_]+\.[a-z0-9_]+$/.test(value) && !Object.prototype.hasOwnProperty.call(states, value)) links.add(value);
  };
  const many = (values?: readonly unknown[]) => values?.forEach(add);
  const home = config.home;
  [home?.energy, home?.solar_power, home?.solar_energy, home?.weather, home?.climate, home?.humidity].forEach(add);
  many(home?.devices); many(home?.scenes);
  config.hero?.pins?.forEach(pin => add(pin.entity));
  Object.values(config.rooms ?? {}).forEach(room => {
    [room.occupancy, room.climate, room.temperature, room.humidity].forEach(add); many(room.hidden);
  });
  Object.keys(config.plan?.devices ?? {}).forEach(add); many(config.plan?.hidden);
  config.plan?.floors?.forEach(floor => floor.furniture?.forEach(item => { add(item.entity); add(item.source); }));
  [config.door?.doorbell, config.door?.camera, config.door?.open].forEach(add);
  const experience = config.experience;
  add(experience?.power_entity); many(experience?.critical_entities);
  experience?.maintenance?.forEach(task => { add(task.entity); add(task.usage_entity); });
  [experience?.quick_scenes?.leave, experience?.quick_scenes?.sleep].forEach(add);
  Object.keys(config.names ?? {}).forEach(add); Object.keys(config.aliases ?? {}).forEach(add);
  Object.keys(config.robots ?? {}).forEach(add);
  Object.values(config.pages ?? {}).forEach(page => many(page.hidden));
  Object.values(config.access?.users ?? {}).forEach(user => many(user.entities));
  return [...links].sort();
}
