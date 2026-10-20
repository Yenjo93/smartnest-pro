// Minimal slice of the Home Assistant frontend `hass` object that the panel relies on.
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

/** Entity registry entry as the frontend exposes it (hass.entities). */
export interface HassEntityReg {
  entity_id: string;
  device_id?: string;
  area_id?: string | null;
  /** "config" / "diagnostic": technical entities, not for the family. */
  entity_category?: string | null;
  hidden?: boolean;
}

export interface HassDevice {
  id: string;
  name?: string;
  area_id?: string | null;
}

export interface HassArea {
  area_id: string;
  name: string;
  icon?: string | null;
}

export interface Hass {
  states: Record<string, HassEntity>;
  areas?: Record<string, HassArea>;
  entities?: Record<string, HassEntityReg>;
  devices?: Record<string, HassDevice>;
  user?: { id: string; name: string; is_admin: boolean };
  themes?: { darkMode?: boolean };
  language: string;
  callService(domain: string, service: string, data?: Record<string, any>): Promise<any>;
  callWS<T = any>(msg: Record<string, any>): Promise<T>;
  fetchWithAuth(path: string, init?: RequestInit): Promise<Response>;
  connection: {
    subscribeMessage<T = any>(cb: (msg: T) => void, msg: Record<string, any>): Promise<() => void>;
  };
}

export interface PanelInfo {
  config?: { asset_base?: string; version?: string };
}

export type Lang = "en" | "ar";
export type ThemeMode = "auto" | "light" | "dark";

/** A marker on the house image. Bound to a room (selects it in the room panel) or to one device (toggles it). */
export interface Pin {
  id: string;
  /** Percent of the image's width and height, so pins survive any screen size. */
  x: number;
  y: number;
  area?: string;
  entity?: string;
  label?: string;
}

/** Extras an HA Area doesn't carry. Every field is optional: the panel guesses from the area's entities. */
export interface RoomOverride {
  size_m2?: number;
  occupancy?: string;
  climate?: string;
  temperature?: string;
  humidity?: string;
  hidden?: string[];
}

export interface ProConfig {
  version: 1;
  settings: {
    home_name: string;
    language: Lang | "auto";
    theme: ThemeMode;
    /** No blur and lighter shadows, for slow phones. */
    reduce_effects: boolean;
    default_room?: string;
  };
  hero: { image?: string; pins: Pin[] };
  home: {
    /** Total grid consumption meter (kWh, total_increasing): the hourly chart and today's total. */
    energy?: string;
    /** Solar production right now (W or kW), shown on the ECO chip. */
    solar_power?: string;
    /** Solar energy meter (kWh, total_increasing): today's share of solar in the ECO chip. */
    solar_energy?: string;
    climate?: string;
    humidity?: string;
    devices: string[];
    scenes: string[];
  };
  rooms: Record<string, RoomOverride>;
  /** Per page: items taken off it in edit mode (entity ids, or area ids on the Rooms page). */
  pages: Record<string, { hidden?: string[] }>;
}
