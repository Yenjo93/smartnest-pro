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
export type ThemeMode = "auto" | "light" | "dark" | "purple";
/** The palette actually in use once "auto" is resolved. */
export type Palette = "light" | "dark" | "purple";

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
  /** The room's name on the dashboard, instead of the HA Area's. */
  name?: string;
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
    /** Name in the greeting at the top; empty means the signed-in user's first name. */
    greeting_name?: string;
    /** The dashboard's title in the top corner; empty means "SmartNest". */
    title?: string;
    language: Lang | "auto";
    theme: ThemeMode;
    /** No blur and lighter shadows, for slow phones. */
    reduce_effects: boolean;
    default_room?: string;
    /** Kiosk mode PIN: needed to edit or leave kiosk mode on a device that has it on. */
    kiosk_pin?: string;
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
  plan: Plan;
  /** Names shown on the dashboard instead of Home Assistant's, by entity id. */
  names?: Record<string, string>;
  /** Per robot vacuum: which floor plan it cleans and each plan room's segment number in the robot's own map. */
  robots?: Record<string, { floor?: string; segments: Record<string, number> }>;
  /** Per page: items taken off it in edit mode (entity ids, or area ids on the Rooms page). */
  pages: Record<string, { hidden?: string[] }>;
}

/**
 * The 3D floor plan. Everything is in metres on a top-down grid: x to the right, y down the page.
 * Walls aren't stored: they're generated wherever a room has an edge, and doors cut gaps into them.
 */
export interface PlanPoint {
  x: number;
  y: number;
}

export interface PlanRoom {
  id: string;
  /** Bounding box. For a plain rectangle room this IS the room; with `pts` it's kept in sync as their bounds. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Corners of a free-shape room, in order. Missing means the rectangle above. */
  pts?: PlanPoint[];
  /** The HA Area this room is: its devices, lights and sensors drive the room's effects. */
  area?: string;
}

/**
 * A gap in a wall: a doorway, or (with `open`) a stretch of wall taken out between two rooms.
 * New gaps store their centre and the wall's angle; older layouts used axis/line/at for straight walls only.
 */
export interface PlanDoor {
  id: string;
  x?: number;
  y?: number;
  /** Wall direction in degrees: 0 runs along x, 90 along y. */
  angle?: number;
  axis?: "h" | "v";
  line?: number;
  at?: number;
  width: number;
  /** A removed wall (open plan) rather than a doorway: no threshold, nothing to highlight. */
  open?: boolean;
}

/** A wall drawn on its own, not belonging to a room's outline. */
export interface PlanWall {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface PlanFurniture {
  id: string;
  /** Key in the furniture catalog (src/plan/furniture.ts). */
  type: string;
  /** Centre of its footprint, in metres. */
  x: number;
  y: number;
  /** Degrees, clockwise seen from above. */
  rot: number;
  /** The device it shows and controls: an AC's climate entity, a lamp's light, a TV's media player… */
  entity?: string;
  /**
   * Metres above the floor (or, for ceiling pieces, below the ceiling). Missing means the piece's own default:
   * 0 for floor furniture, mounting height for wall units like the AC.
   */
  z?: number;
  /** Size multiplier, 1 = catalog size. */
  scale?: number;
  /** Extra stretch along the piece's width only (a longer counter, a wider wardrobe), 1 = as built. */
  stretch?: number;
}

export interface PlanFloor {
  id: string;
  name: string;
  rooms: PlanRoom[];
  doors: PlanDoor[];
  /** Walls drawn on their own, in addition to the rooms' outlines. */
  walls?: PlanWall[];
  furniture?: PlanFurniture[];
  /** Wall height in metres for this floor's cut-away view. Default 1.05. */
  wallHeight?: number;
  /** A photo of the real plan to trace over in the editor; never shown in 3D. */
  underlay?: { url: string; x: number; y: number; width: number; opacity: number };
}

export interface Plan {
  floors: PlanFloor[];
  /** Where each device icon sits. Missing ones are laid out inside their room automatically. */
  devices: Record<string, { floor: string; x: number; y: number }>;
  /** Devices taken off the plan. */
  hidden: string[];
}
