import type { ProConfig } from "./types";

export const defaultConfig = (): ProConfig => ({
  version: 1,
  settings: { home_name: "", language: "auto", theme: "auto", reduce_effects: false },
  hero: { pins: [] },
  home: { devices: [], scenes: [] },
  rooms: {},
});

/** Fills anything a saved layout is missing, so older or hand-edited layouts never crash the panel. */
export function normalize(raw: unknown): ProConfig {
  const base = defaultConfig();
  if (!raw || typeof raw !== "object") return base;
  const c = raw as Partial<ProConfig>;
  return {
    version: 1,
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
  };
}

export const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

export const newId = () => Math.random().toString(36).slice(2, 10);
