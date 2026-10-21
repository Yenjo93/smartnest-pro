// Read-only helpers over the `hass` object: names, areas, and the guesses that fill a room when the layout doesn't say.
import type { Hass, HassArea, HassEntity, RoomOverride } from "./types";

export const domainOf = (id: string) => id.split(".")[0];

/**
 * Names given on the dashboard. Kept here (set by the panel on every render) so every card, page and popup
 * picks them up through nameOf without passing the layout around.
 */
let nameOverrides: Record<string, string> = {};
export const setNameOverrides = (names: Record<string, string> | undefined) => (nameOverrides = names ?? {});

export const nameOf = (hass: Hass, id: string): string => {
  if (nameOverrides[id]) return nameOverrides[id];
  const s = hass.states[id];
  return (s?.attributes.friendly_name as string) || id.split(".")[1]?.replace(/_/g, " ") || id;
};

export const isOn = (s?: HassEntity): boolean =>
  !!s && !["off", "unavailable", "unknown", "idle", "standby", "docked", "closed", "locked", "paused"].includes(s.state);

export const unavailable = (s?: HassEntity) => !s || s.state === "unavailable" || s.state === "unknown";

export const num = (s?: HassEntity): number | undefined => {
  if (!s) return undefined;
  const n = parseFloat(s.state);
  return Number.isFinite(n) ? n : undefined;
};

/** Watts or kilowatts, whatever the sensor reports, as kW. */
export const powerKw = (s?: HassEntity): number | undefined => {
  const n = num(s);
  if (n === undefined) return undefined;
  const unit = String(s!.attributes.unit_of_measurement ?? "W");
  return unit === "kW" ? n : unit === "MW" ? n * 1000 : n / 1000;
};

/** Areas in name order. */
export const areas = (hass: Hass): HassArea[] =>
  Object.values(hass.areas ?? {}).sort((a, b) => a.name.localeCompare(b.name));

/** The area an entity is in: its own, or its device's. */
export const areaOf = (hass: Hass, id: string): string | undefined => {
  const reg = hass.entities?.[id];
  if (!reg) return undefined;
  if (reg.area_id) return reg.area_id;
  return reg.device_id ? hass.devices?.[reg.device_id]?.area_id ?? undefined : undefined;
};

/** Visible entities in an area: no hidden, technical, or user-hidden ones. */
export const entitiesIn = (hass: Hass, areaId: string, hidden: string[] = []): string[] =>
  Object.values(hass.entities ?? {})
    .filter((e) => !e.hidden && !e.entity_category && !hidden.includes(e.entity_id) && hass.states[e.entity_id])
    .filter((e) => areaOf(hass, e.entity_id) === areaId)
    .map((e) => e.entity_id);

/** Domains that show up as switchable "nodes" in a room. */
export const NODE_DOMAINS = ["light", "switch", "fan", "media_player", "vacuum", "cover", "lock", "humidifier"];

const firstSensor = (hass: Hass, ids: string[], deviceClass: string) =>
  ids.find((id) => domainOf(id) === "sensor" && hass.states[id]?.attributes.device_class === deviceClass);

export interface RoomInfo {
  id: string;
  name: string;
  size?: number;
  climate?: string;
  temperature?: number;
  humidity?: number;
  /** People in the room when a count sensor exists; otherwise 1/0 from a presence sensor. */
  people?: number;
  occupied?: boolean;
  nodes: string[];
  activeNodes: number;
}

/** What the room panel shows for an area: the layout's picks first, then guesses from the area's entities. */
export function roomInfo(hass: Hass, areaId: string, o: RoomOverride = {}): RoomInfo {
  const area = hass.areas?.[areaId];
  const ids = entitiesIn(hass, areaId, o.hidden);
  const climate = o.climate ?? ids.find((id) => domainOf(id) === "climate");
  const climateState = climate ? hass.states[climate] : undefined;
  const temperature =
    num(hass.states[o.temperature ?? firstSensor(hass, ids, "temperature") ?? ""]) ??
    (climateState?.attributes.current_temperature as number | undefined);
  const humidity =
    num(hass.states[o.humidity ?? firstSensor(hass, ids, "humidity") ?? ""]) ??
    (climateState?.attributes.current_humidity as number | undefined);
  const occId =
    o.occupancy ??
    ids.find((id) => domainOf(id) === "binary_sensor" && ["occupancy", "presence", "motion"].includes(hass.states[id]?.attributes.device_class));
  const occ = occId ? hass.states[occId] : undefined;
  let people: number | undefined;
  let occupied: boolean | undefined;
  if (occ) {
    const n = num(occ);
    if (n !== undefined && domainOf(occId!) !== "binary_sensor") {
      people = n;
      occupied = n > 0;
    } else {
      occupied = occ.state === "on";
    }
  }
  const nodes = ids.filter((id) => NODE_DOMAINS.includes(domainOf(id)));
  return {
    id: areaId,
    name: area?.name ?? areaId,
    size: o.size_m2,
    climate,
    temperature,
    humidity,
    people,
    occupied,
    nodes,
    activeNodes: nodes.filter((id) => isOn(hass.states[id])).length,
  };
}

/** Turns a device on or off the way its domain expects. */
export function toggle(hass: Hass, id: string): Promise<unknown> {
  const d = domainOf(id);
  const s = hass.states[id];
  if (d === "lock") return hass.callService("lock", s?.state === "locked" ? "unlock" : "lock", { entity_id: id });
  if (d === "cover") return hass.callService("cover", "toggle", { entity_id: id });
  if (d === "vacuum")
    return hass.callService("vacuum", s?.state === "cleaning" ? "return_to_base" : "start", { entity_id: id });
  if (d === "media_player") return hass.callService("media_player", isOn(s) ? "turn_off" : "turn_on", { entity_id: id });
  if (d === "scene" || d === "script") return hass.callService(d, "turn_on", { entity_id: id });
  return hass.callService("homeassistant", "toggle", { entity_id: id });
}

/** The thermostat's target, step and limits, with sane fallbacks. */
export function climateTarget(s?: HassEntity) {
  const a = s?.attributes ?? {};
  return {
    target: typeof a.temperature === "number" ? a.temperature : undefined,
    current: typeof a.current_temperature === "number" ? a.current_temperature : undefined,
    min: typeof a.min_temp === "number" ? a.min_temp : 16,
    max: typeof a.max_temp === "number" ? a.max_temp : 30,
    step: typeof a.target_temp_step === "number" ? a.target_temp_step : 0.5,
  };
}

export const setTemp = (hass: Hass, id: string, temperature: number) =>
  hass.callService("climate", "set_temperature", { entity_id: id, temperature });

/** Every visible entity of a domain, in name order. Hidden and technical entities stay out. */
export const byDomain = (hass: Hass, domain: string): string[] =>
  Object.keys(hass.states)
    .filter((id) => domainOf(id) === domain)
    .filter((id) => {
      const reg = hass.entities?.[id];
      return !reg || (!reg.hidden && !reg.entity_category);
    })
    .sort((a, b) => nameOf(hass, a).localeCompare(nameOf(hass, b)));

export const areaName = (hass: Hass, id: string): string | undefined => {
  const a = areaOf(hass, id);
  return a ? hass.areas?.[a]?.name : undefined;
};

/** Other entities of the same device: a vacuum's map and battery, a phone's battery sensor. */
export const siblings = (hass: Hass, id: string): string[] => {
  const dev = hass.entities?.[id]?.device_id;
  if (!dev) return [];
  return Object.values(hass.entities ?? {})
    .filter((e) => e.device_id === dev && e.entity_id !== id && hass.states[e.entity_id])
    .map((e) => e.entity_id);
};

/** "5 min", "3 h", "2 d" since a timestamp. */
export const since = (iso: string, lang: string): string => {
  const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto", style: "short" });
  if (s < 60) return rtf.format(0, "second");
  if (s < 3600) return rtf.format(-Math.round(s / 60), "minute");
  if (s < 86400) return rtf.format(-Math.round(s / 3600), "hour");
  return rtf.format(-Math.round(s / 86400), "day");
};
