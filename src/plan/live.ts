// What each room on the plan should show right now, worked out from Home Assistant's state.
import type { Hass, PlanFloor, ProConfig } from "../types";
import { domainOf, entitiesIn, isOn, roomInfo } from "../ha";
import { inside, layoutInRoom, roomPts } from "./geometry";

const OPENINGS = ["door", "window", "garage_door", "opening"];
/** Devices that get an icon on the plan. */
const PLAN_DOMAINS = ["light", "switch", "fan", "media_player", "vacuum", "cover", "lock", "climate", "humidifier"];

export interface RoomLive {
  roomId: string;
  /** Strongest light in the room: its colour (r,g,b 0-255) and brightness 0..1; undefined when all are off. */
  light?: { rgb: [number, number, number]; level: number };
  /** AC running: "cool" or "heat". */
  climate?: "cool" | "heat";
  temperature?: number;
  occupied: boolean;
  people?: number;
  /** A door or window sensor in this room reports open. */
  open: boolean;
}

/** A light's colour as rgb: its own colour, or a warm white from its colour temperature. */
function lightRgb(attrs: Record<string, any>): [number, number, number] {
  if (Array.isArray(attrs.rgb_color)) return attrs.rgb_color as [number, number, number];
  const k = attrs.color_temp_kelvin as number | undefined;
  if (k) {
    // Rough warm-to-cool white between 2200 K and 6500 K.
    const f = Math.min(1, Math.max(0, (k - 2200) / 4300));
    return [255, Math.round(196 + 50 * f), Math.round(140 + 110 * f)];
  }
  return [255, 214, 160];
}

export function roomLive(hass: Hass, config: ProConfig, roomId: string, area?: string): RoomLive {
  if (!area || !hass.areas?.[area]) return { roomId, occupied: false, open: false };
  const ids = entitiesIn(hass, area, config.rooms[area]?.hidden);
  const info = roomInfo(hass, area, config.rooms[area]);
  let light: RoomLive["light"];
  for (const id of ids.filter((i) => domainOf(i) === "light")) {
    const s = hass.states[id];
    if (!isOn(s)) continue;
    const level = typeof s.attributes.brightness === "number" ? s.attributes.brightness / 255 : 1;
    if (!light || level > light.level) light = { rgb: lightRgb(s.attributes), level };
  }
  const ac = info.climate ? hass.states[info.climate] : undefined;
  const action = ac?.attributes.hvac_action as string | undefined;
  const mode = ac?.state;
  const climate =
    action === "cooling" || (!action && mode === "cool") ? "cool" : action === "heating" || (!action && mode === "heat") ? "heat" : undefined;
  const open = ids.some(
    (id) => domainOf(id) === "binary_sensor" && OPENINGS.includes(hass.states[id]?.attributes.device_class) && hass.states[id].state === "on",
  );
  return { roomId, light, climate, temperature: info.temperature, occupied: !!info.occupied, people: info.people, open };
}

export interface PlacedDevice {
  id: string;
  x: number;
  y: number;
  roomId: string;
}

/** Every device icon on a floor: saved spots first, the rest spread out inside their room. */
export function placedDevices(hass: Hass, config: ProConfig, floor: PlanFloor): PlacedDevice[] {
  const out: PlacedDevice[] = [];
  const hidden = config.plan.hidden;
  for (const r of floor.rooms) {
    if (!r.area || !hass.areas?.[r.area]) continue;
    const ids = entitiesIn(hass, r.area, config.rooms[r.area]?.hidden).filter(
      (id) => PLAN_DOMAINS.includes(domainOf(id)) && !hidden.includes(id),
    );
    const loose = ids.filter((id) => config.plan.devices[id]?.floor !== floor.id);
    // The top strip of each room is kept free for its name label.
    const strip = Math.min(0.8, r.h * 0.25);
    const spots = layoutInRoom(r, loose.length, strip);
    loose.forEach((id, i) => out.push({ id, ...spots[i], roomId: r.id }));
    for (const id of ids) {
      const p = config.plan.devices[id];
      if (p?.floor === floor.id) out.push({ id, x: p.x, y: p.y, roomId: r.id });
    }
  }
  return out;
}

/** A camera on the plan that sees someone right now. */
export interface CameraAlert {
  /** The camera piece of furniture. */
  id: string;
  camera?: string;
  /** The room it stands in; none for outdoor cameras. */
  roomId?: string;
  x: number;
  y: number;
  /** The latest detection snapshot (Frigate's image entity), when there is one. */
  image?: string;
  since?: string;
}

/** A sibling entity of a camera: Frigate's `binary_sensor.<cam>_person_occupancy`, `image.<cam>_person`. */
function frigateSibling(hass: Hass, cam: string, domain: string, suffix: string): string | undefined {
  const base = cam.split(".")[1];
  const named = `${domain}.${base}${suffix}`;
  if (hass.states[named]) return named;
  const dev = hass.entities?.[cam]?.device_id;
  if (!dev) return undefined;
  return Object.values(hass.entities ?? {}).find((e) => e.device_id === dev && e.entity_id.startsWith(`${domain}.`) && e.entity_id.endsWith(suffix))?.entity_id;
}

/**
 * Cameras on this floor that see a person. Outdoor ones (outside every room) always count; indoor ones only
 * while nobody is home, so the family moving around doesn't light the house up red.
 */
export function cameraAlerts(hass: Hass, floor: PlanFloor): CameraAlert[] {
  const home = Object.keys(hass.states).some((id) => id.startsWith("person.") && hass.states[id].state === "home");
  const out: CameraAlert[] = [];
  for (const f of floor.furniture ?? []) {
    if (f.type !== "camera" || !f.entity) continue;
    const cam = domainOf(f.entity) === "camera" ? f.entity : undefined;
    const sensor = cam ? frigateSibling(hass, cam, "binary_sensor", "_person_occupancy") : f.entity;
    const s = sensor ? hass.states[sensor] : undefined;
    if (s?.state !== "on") continue;
    const room = floor.rooms.find((r) => inside(roomPts(r), f.x, f.y));
    if (room && home) continue;
    const img = cam ? frigateSibling(hass, cam, "image", "_person") : undefined;
    out.push({
      id: f.id,
      camera: cam,
      roomId: room?.id,
      x: f.x,
      y: f.y,
      image: img ? (hass.states[img]?.attributes.entity_picture as string | undefined) : undefined,
      since: s.last_changed,
    });
  }
  return out;
}
