import type { ProConfig } from "./types";

export const defaultConfig = (): ProConfig => ({
  version: 1,
  settings: { home_name: "", language: "auto", theme: "auto", reduce_effects: false },
  hero: { pins: [] },
  home: { devices: [], scenes: [] },
  rooms: {},
  pages: {},
  plan: { floors: [], devices: {}, hidden: [] },
});

/** Fills anything a saved layout is missing, so older or hand-edited layouts never crash the panel. */
export function normalize(raw: unknown): ProConfig {
  const base = defaultConfig();
  if (!raw || typeof raw !== "object") return base;
  const c = raw as Partial<ProConfig>;
  return {
    version: 1,
    experience: c.experience && typeof c.experience === "object" ? {...c.experience,critical_entities:Array.isArray(c.experience.critical_entities)?c.experience.critical_entities.filter(id=>typeof id==='string').slice(0,1000):[]} : {},
    access: c.access && typeof c.access === "object" ? c.access : undefined,
    settings: { ...base.settings, ...(c.settings ?? {}) },
    hero: {
      image: c.hero?.image,
      pins: Array.isArray(c.hero?.pins) ? c.hero!.pins.filter((p) => p && typeof p.x === "number" && typeof p.y === "number") : [],
    },
    home: {
      ...base.home,
      ...(c.home ?? {}),
      devices: Array.isArray(c.home?.devices) ? c.home!.devices : [],
      scenes: Array.isArray(c.home?.scenes) ? c.home!.scenes : [],
    },
    rooms: c.rooms && typeof c.rooms === "object" ? c.rooms : {},
    pages: c.pages && typeof c.pages === "object" ? c.pages : {},
    door: c.door && typeof c.door === "object" ? { ...c.door } : undefined,
    names: c.names && typeof c.names === "object" ? c.names : {},
    aliases: c.aliases && typeof c.aliases==='object'&&!Array.isArray(c.aliases)?Object.fromEntries(Object.entries(c.aliases).filter(([id,list])=>/^[a-z_]+\.[a-z0-9_]+$/.test(id)&&Array.isArray(list)).slice(0,1000).map(([id,list])=>[id,(list as unknown[]).filter((value):value is string=>typeof value==='string').slice(0,8).map(value=>value.trim().slice(0,60)).filter(Boolean)])):{},
    robots: c.robots && typeof c.robots === "object" ? c.robots : {},
    plan: {
      floors: Array.isArray(c.plan?.floors)
        ? c.plan!.floors.map((f) => ({
            ...f,
            rooms: Array.isArray(f.rooms) ? f.rooms : [],
            doors: Array.isArray(f.doors) ? f.doors : [],
            furniture: Array.isArray(f.furniture) ? f.furniture : [],
            walls: Array.isArray(f.walls) ? f.walls : [],
          }))
        : [],
      devices: c.plan?.devices && typeof c.plan.devices === "object" ? c.plan.devices : {},
      hidden: Array.isArray(c.plan?.hidden) ? c.plan!.hidden : [],
    },
  };
}

export const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

export const newId = () => Math.random().toString(36).slice(2, 10);
