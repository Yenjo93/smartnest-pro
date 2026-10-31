// A fake Home Assistant for local development: areas, devices, services, the SmartNest WebSocket API and uploads.
import type { Hass, HassEntity, HassEntityReg, ProConfig } from "../src/types";

const now = () => new Date().toISOString();
const states: Record<string, HassEntity> = {};
const entities: Record<string, HassEntityReg> = {};
const add = (entity_id: string, state: string, attributes: Record<string, any>, area?: string) => {
  states[entity_id] = { entity_id, state, attributes, last_changed: now(), last_updated: now() };
  entities[entity_id] = { entity_id, area_id: area ?? null };
};

const areasList = {
  main_hall: { area_id: "main_hall", name: "Main Hall" },
  kitchen: { area_id: "kitchen", name: "Kitchen" },
  master_bedroom: { area_id: "master_bedroom", name: "Master Bedroom" },
  office: { area_id: "office", name: "Office" },
  terrace: { area_id: "terrace", name: "Terrace" },
};

const ac = (name: string, temp: number, cur: number, hum: number) => ({
  friendly_name: name,
  temperature: temp,
  current_temperature: cur,
  current_humidity: hum,
  hvac_modes: ["off", "auto", "cool", "heat"],
  preset_modes: ["none", "eco"],
  preset_mode: "none",
  min_temp: 16,
  max_temp: 30,
  target_temp_step: 0.5,
});

add("climate.main_hall", "cool", ac("Main Hall AC", 22.5, 22.5, 48), "main_hall");
add("sensor.main_hall_temperature", "22.5", { friendly_name: "Main Hall Temperature", device_class: "temperature", unit_of_measurement: "°C" }, "main_hall");
add("sensor.main_hall_humidity", "48", { friendly_name: "Main Hall Humidity", device_class: "humidity", unit_of_measurement: "%" }, "main_hall");
add("sensor.main_hall_people", "2", { friendly_name: "Main Hall People" }, "main_hall");
add("media_player.oled_tv", "on", { friendly_name: "Smart OLED TV 65\"", device_class: "tv", volume_level: 0.3, supported_features: 16437 | 384, app_name: "Netflix" }, "main_hall");
add("media_player.sonos_era", "playing", {
  friendly_name: "Sonos Era 300", volume_level: 0.55, supported_features: 16437 | 128 | 256, media_title: "Weightless", media_artist: "Marconi Union",
  entity_picture: "/static/house-default.jpg",
}, "main_hall");
add("vacuum.cleanbot", "docked", {
  friendly_name: "Aether CleanBot V4", battery_level: 92, fan_speed: "balanced", fan_speed_list: ["quiet", "balanced", "turbo", "max"],
}, "main_hall");
add("image.cleanbot_map", "2026-10-20T08:00:00Z", { friendly_name: "CleanBot Map", entity_picture: "/dev/robot-map.svg" });
entities["vacuum.cleanbot"].device_id = "dev_robot";
entities["image.cleanbot_map"].device_id = "dev_robot";
add("select.cleanbot_mop_mode", "standard", { friendly_name: "Mop mode", options: ["off", "standard", "deep", "deep_plus"] });
entities["select.cleanbot_mop_mode"].device_id = "dev_robot";
add("zone.home", "2", { friendly_name: "Home", latitude: 32.0853, longitude: 34.7818, radius: 100 });
add("person.omar", "home", { friendly_name: "Omar", source: "device_tracker.omar_phone", latitude: 32.0853, longitude: 34.7818 });
add("person.lina", "Work", { friendly_name: "Lina", source: "device_tracker.lina_phone", latitude: 32.0741, longitude: 34.7922 });
add("person.adam", "home", { friendly_name: "Adam", source: "device_tracker.adam_phone" });
add("person.maya", "not_home", { friendly_name: "Maya", source: "device_tracker.maya_phone" });
add("device_tracker.omar_phone", "home", { friendly_name: "Omar's phone", battery_level: 81 });
add("device_tracker.lina_phone", "Work", { friendly_name: "Lina's phone", battery_level: 46 });
add("device_tracker.adam_phone", "home", { friendly_name: "Adam's phone", battery_level: 12 });
add("device_tracker.maya_phone", "not_home", { friendly_name: "Maya's phone" });
add("alarm_control_panel.house", "disarmed", { friendly_name: "House Alarm", supported_features: 3 });
add("binary_sensor.front_door", "off", { friendly_name: "Front Door", device_class: "door" }, "terrace");
add("binary_sensor.garage", "on", { friendly_name: "Garage", device_class: "garage_door" });
add("binary_sensor.kitchen_window", "on", { friendly_name: "Kitchen Window", device_class: "window" }, "kitchen");
add("binary_sensor.bedroom_window", "off", { friendly_name: "Bedroom Window", device_class: "window" }, "master_bedroom");
add("lock.back_door", "unlocked", { friendly_name: "Back Door" }, "kitchen");
add("camera.front", "idle", { friendly_name: "Front Camera", entity_picture: "/static/house-default.jpg" }, "terrace");
add("camera.garden", "idle", { friendly_name: "Garden Camera", entity_picture: "/dev/robot-map.svg" }, "terrace");
add("sensor.oven_power", "2100", { friendly_name: "Oven", device_class: "power", unit_of_measurement: "W" }, "kitchen");
add("sensor.ac_power", "1450", { friendly_name: "Main Hall AC", device_class: "power", unit_of_measurement: "W" }, "main_hall");
add("sensor.fridge_power", "120", { friendly_name: "Fridge", device_class: "power", unit_of_measurement: "W" }, "kitchen");
add("sensor.tv_power", "95", { friendly_name: "TV", device_class: "power", unit_of_measurement: "W" }, "main_hall");
add("fan.bedroom", "on", { friendly_name: "Bedroom Fan", percentage: 40 }, "master_bedroom");
add("light.bedside", "on", {
  friendly_name: "Bedside Lamp", brightness: 90, supported_color_modes: ["hs", "color_temp"], color_mode: "hs", hs_color: [28, 65], rgb_color: [255, 170, 90],
  min_color_temp_kelvin: 2200, max_color_temp_kelvin: 6500, color_temp_kelvin: 3000,
}, "master_bedroom");
add("light.hue_master_lamp", "on", { friendly_name: "Hue Master Lamp", brightness: 82, supported_color_modes: ["brightness"], color_mode: "brightness" }, "main_hall");
add("light.led_strip_frame", "on", { friendly_name: "LED Strip Frame", brightness: 200, supported_color_modes: ["hs"], color_mode: "hs", hs_color: [48, 85] }, "main_hall");
add("media_player.studio_speaker", "playing", { friendly_name: "Pro Max Studio Speaker", volume_level: 0.2 }, "office");

add("climate.kitchen", "off", ac("Kitchen AC", 23, 24.1, 52), "kitchen");
add("light.kitchen", "off", { friendly_name: "Kitchen Lights", supported_color_modes: ["brightness"] }, "kitchen");
add("switch.coffee_machine", "off", { friendly_name: "Coffee Machine", device_class: "outlet" }, "kitchen");
add("binary_sensor.kitchen_motion", "off", { friendly_name: "Kitchen Motion", device_class: "motion" }, "kitchen");

add("climate.master_bedroom", "heat", ac("Bedroom AC", 21, 20.4, 45), "master_bedroom");
add("light.bedroom_ceiling", "off", { friendly_name: "Bedroom Ceiling", supported_color_modes: ["brightness"] }, "master_bedroom");
add("cover.bedroom_blinds", "open", { friendly_name: "Bedroom Blinds", current_position: 70, supported_features: 15 }, "master_bedroom");
add("cover.main_hall_curtain", "closed", { friendly_name: "Main Hall Curtain", current_position: 0, supported_features: 15 }, "main_hall");
add("binary_sensor.bedroom_presence", "on", { friendly_name: "Bedroom Presence", device_class: "occupancy" }, "master_bedroom");

add("light.office_desk", "on", { friendly_name: "Desk Lamp", brightness: 160, supported_color_modes: ["brightness"] }, "office");
add("sensor.office_temperature", "23.8", { friendly_name: "Office Temperature", device_class: "temperature", unit_of_measurement: "°C" }, "office");

add("light.terrace", "off", { friendly_name: "Terrace Lights", supported_color_modes: ["onoff"] }, "terrace");
add("lock.front_door", "locked", { friendly_name: "Front Door" }, "terrace");

add("sensor.grid_energy", "8421.4", { friendly_name: "Grid Energy", device_class: "energy", unit_of_measurement: "kWh", state_class: "total_increasing" });
add("sensor.solar_power", "3800", { friendly_name: "Solar Power", device_class: "power", unit_of_measurement: "W" });
add("sensor.solar_energy", "2210.2", { friendly_name: "Solar Energy", device_class: "energy", unit_of_measurement: "kWh", state_class: "total_increasing" });
add("sensor.home_humidity", "51", { friendly_name: "Home Humidity", device_class: "humidity", unit_of_measurement: "%" });
add("scene.good_morning", "unknown", { friendly_name: "Good morning" });
add("scene.movie_night", "unknown", { friendly_name: "Movie night" });
add("scene.away", "unknown", { friendly_name: "Away" });
add("script.good_night", "off", { friendly_name: "Good night" });

const demoConfig: ProConfig = {
  version: 1,
  settings: { home_name: "Nort Residence", language: "auto", theme: "auto", reduce_effects: false },
  hero: {
    // Local only: the reference render isn't in the repo. Without it the demo shows the "add a picture" placeholder.
    image: "/static/house-default.jpg",
    pins: [
      { id: "p1", x: 50, y: 22, entity: "sensor.solar_power", label: "Solar" },
      { id: "p2", x: 24, y: 58, area: "main_hall" },
      { id: "p3", x: 62, y: 80, entity: "lock.front_door" },
      { id: "p4", x: 74, y: 40, area: "master_bedroom" },
    ],
  },
  home: {
    energy: "sensor.grid_energy",
    solar_power: "sensor.solar_power",
    solar_energy: "sensor.solar_energy",
    climate: "climate.main_hall",
    humidity: "sensor.home_humidity",
    devices: ["light.hue_master_lamp", "light.led_strip_frame", "media_player.studio_speaker", "switch.coffee_machine"],
    scenes: ["scene.good_morning", "scene.movie_night", "scene.away", "script.good_night"],
  },
  rooms: {
    main_hall: { size_m2: 48, occupancy: "sensor.main_hall_people" },
  },
  pages: {},
  plan: {
    floors: [
      {
        id: "g",
        name: "Ground",
        wallHeight: 1.45,
        rooms: [
          { id: "r1", x: 0, y: 0, w: 7, h: 5, area: "main_hall" },
          { id: "r2", x: 7, y: 0, w: 4, h: 3.5, area: "kitchen" },
          { id: "r3", x: 7, y: 3.5, w: 4, h: 3, area: "office" },
          {
            id: "r4", x: 0, y: 5, w: 7, h: 3, area: "terrace",
            pts: [{ x: 0, y: 5 }, { x: 7, y: 5 }, { x: 7, y: 8 }, { x: 1.5, y: 8 }, { x: 0, y: 6.5 }],
          },
        ],
        doors: [
          { id: "d1", x: 7, y: 1.75, angle: 90, width: 3.5, open: true },
          { id: "d2", axis: "v", line: 7, at: 4.25, width: 0.9 },
          { id: "d3", axis: "h", line: 5, at: 3.5, width: 1.4 },
          { id: "d4", axis: "h", line: 8, at: 3, width: 1.2 },
        ],
        furniture: [
          { id: "f1", type: "rug", x: 2.6, y: 2.6, rot: 0 },
          { id: "f2", type: "tv_unit", x: 2.6, y: 0.3, rot: 0, entity: "media_player.oled_tv" },
          { id: "f3", type: "sofa", x: 2.6, y: 3.9, rot: 180 },
          { id: "f4", type: "coffee_table", x: 2.6, y: 2.6, rot: 0 },
          { id: "f5", type: "armchair", x: 0.8, y: 2.4, rot: 90 },
          { id: "f6", type: "ac", x: 2.6, y: 0.16, rot: 0, z: 1.08, entity: "climate.main_hall" },
          { id: "f7", type: "floor_lamp", x: 0.45, y: 4.5, rot: 0, entity: "light.hue_master_lamp" },
          { id: "f8", type: "curtain", x: 0.08, y: 2.5, rot: 90, entity: "cover.main_hall_curtain" },
          { id: "f9", type: "robot", x: 5.4, y: 3.2, rot: 0, entity: "vacuum.cleanbot" },
          { id: "f10", type: "speaker", x: 4.2, y: 0.3, rot: 0, entity: "media_player.sonos_era" },
          { id: "f11", type: "plant", x: 6.6, y: 4.6, rot: 0 },
          { id: "f12", type: "bookshelf", x: 6.8, y: 1.6, rot: 270 },
          { id: "f13", type: "counter", x: 9.0, y: 0.33, rot: 0 },
          { id: "f14", type: "fridge", x: 10.6, y: 0.4, rot: 0 },
          { id: "f15", type: "island", x: 9.0, y: 2.2, rot: 0 },
          { id: "f16", type: "kitchen_light", x: 9.0, y: 2.2, rot: 0, entity: "light.kitchen" },
          { id: "f17", type: "stool", x: 8.6, y: 2.95, rot: 0 },
          { id: "f18", type: "stool", x: 9.4, y: 2.95, rot: 0 },
          { id: "f19", type: "desk", x: 9.4, y: 3.9, rot: 0 },
          { id: "f20", type: "chair", x: 9.4, y: 4.55, rot: 180 },
          { id: "f21", type: "table_lamp", x: 10.6, y: 3.85, rot: 0, entity: "light.office_desk" },
          { id: "f22", type: "speaker", x: 7.4, y: 6.1, rot: 45, entity: "media_player.studio_speaker" },
          { id: "f23", type: "plant", x: 10.6, y: 6.1, rot: 0 },
          { id: "f24", type: "dining", x: 2.4, y: 6.5, rot: 0 },
          { id: "f25", type: "ceiling_light", x: 5.6, y: 6.5, rot: 0, entity: "light.terrace" },
          { id: "f26", type: "plant", x: 6.5, y: 7.5, rot: 0 },
          { id: "f27", type: "led_strip", x: 2.6, y: 0.05, rot: 0, z: 0.25, entity: "light.led_strip_frame" },
          { id: "f28", type: "air_purifier", x: 0.4, y: 0.4, rot: 0, entity: "fan.bedroom" },
          { id: "f29", type: "chandelier", x: 2.4, y: 6.5, rot: 0 },
          { id: "f30", type: "coffee_machine", x: 8.2, y: 0.3, rot: 0, entity: "switch.coffee_machine" },
          { id: "f31", type: "wall_cabinets", x: 9.0, y: 0.2, rot: 0, z: 0.95 },
          { id: "f32", type: "camera", x: 6.8, y: 7.85, rot: 180, entity: "camera.front" },
          { id: "f33", type: "lounger", x: 5.6, y: 7.0, rot: 0 },
        ],
      },
      {
        id: "f1",
        name: "First",
        rooms: [
          { id: "r5", x: 0, y: 0, w: 5, h: 4.5, area: "master_bedroom" },
          { id: "r6", x: 5, y: 0, w: 3, h: 2.5 },
        ],
        doors: [{ id: "d5", axis: "v", line: 5, at: 1.2, width: 0.9 }],
        furniture: [
          { id: "b1", type: "bed_double", x: 2.5, y: 1.25, rot: 0 },
          { id: "b2", type: "nightstand", x: 1.25, y: 0.35, rot: 0 },
          { id: "b3", type: "nightstand", x: 3.75, y: 0.35, rot: 0 },
          { id: "b4", type: "table_lamp", x: 3.75, y: 0.35, rot: 0, entity: "light.bedside" },
          { id: "b5", type: "wardrobe", x: 3.9, y: 4.15, rot: 180 },
          { id: "b6", type: "ceiling_fan", x: 2.5, y: 2.9, rot: 0, entity: "fan.bedroom" },
          { id: "b7", type: "curtain", x: 0.08, y: 2.6, rot: 90, entity: "cover.bedroom_blinds" },
          { id: "b8", type: "ac", x: 1.4, y: 4.34, rot: 180, entity: "climate.master_bedroom" },
          { id: "b9", type: "rug", x: 2.5, y: 2.9, rot: 0 },
          { id: "b10", type: "toilet", x: 7.6, y: 0.45, rot: 0 },
          { id: "b11", type: "basin", x: 6.0, y: 0.3, rot: 0 },
          { id: "b12", type: "shower", x: 7.45, y: 1.95, rot: 0 },
        ],
      },
    ],
    devices: {},
    hidden: [],
  },
};

const params = new URLSearchParams(location.search);
let saved: unknown = params.has("empty") ? null : demoConfig;
const configSubs = new Set<(m: any) => void>();
let notify: () => void = () => {};

function set(id: string, state: string, attrs: Record<string, any> = {}) {
  const s = states[id];
  if (!s) return;
  states[id] = { ...s, state, attributes: { ...s.attributes, ...attrs }, last_updated: now() };
}

function callService(domain: string, service: string, data: Record<string, any> = {}) {
  const ids: string[] = [].concat(data.entity_id ?? []);
  for (const id of ids) {
    const s = states[id];
    if (!s) continue;
    if (service === "toggle" && domain === "cover") set(id, s.state === "open" ? "closed" : "open", { current_position: s.state === "open" ? 0 : 100 });
    else if (service === "toggle") set(id, s.state === "off" || s.state === "idle" || s.state === "unknown" ? "on" : "off");
    else if (service === "turn_on" && domain === "light") {
      const extra: Record<string, any> = {};
      if (data.brightness_pct !== undefined) extra.brightness = Math.round((data.brightness_pct / 100) * 255);
      if (data.hs_color) Object.assign(extra, { hs_color: data.hs_color, color_mode: "hs", rgb_color: hsRgb(data.hs_color[0], data.hs_color[1]) });
      if (data.color_temp_kelvin) Object.assign(extra, { color_temp_kelvin: data.color_temp_kelvin, color_mode: "color_temp", rgb_color: undefined });
      if (data.rgb_color) extra.rgb_color = data.rgb_color;
      set(id, "on", extra);
    } else if (service === "turn_on") set(id, domain === "scene" ? now() : "on");
    else if (service === "turn_off") set(id, "off");
    else if (service === "lock") set(id, "locked");
    else if (service === "unlock") set(id, "unlocked");
    else if (service === "start") set(id, "cleaning");
    else if (service === "return_to_base") set(id, "docked");
    else if (service === "set_temperature") set(id, s.state, { temperature: data.temperature });
    else if (service === "set_hvac_mode") set(id, data.hvac_mode, { preset_mode: "none" });
    else if (service === "set_preset_mode") set(id, s.state === "off" ? "auto" : s.state, { preset_mode: data.preset_mode });
    else if (service === "set_cover_position") set(id, data.position > 0 ? "open" : "closed", { current_position: data.position });
    else if (service === "open_cover") set(id, "open", { current_position: 100 });
    else if (service === "close_cover") set(id, "closed", { current_position: 0 });
    else if (service === "send_command") {
      console.info("mock send_command", JSON.stringify(data));
      set(id, "cleaning");
    } else if (service === "select_option") set(id, data.option);
    else if (service === "media_play_pause") set(id, s.state === "playing" ? "paused" : "playing");
    else if (service === "set_fan_speed") set(id, s.state, { fan_speed: data.fan_speed });
    else if (service === "pause") set(id, "paused");
    else if (domain === "alarm_control_panel") set(id, service === "alarm_disarm" ? "disarmed" : service === "alarm_arm_home" ? "armed_home" : "armed_away");
    else if (service === "volume_set") set(id, s.state, { volume_level: data.volume_level });
  }
  notify();
  return Promise.resolve();
}

/** 24 hours of fake history: a drive to work for people, a wavy line for numbers, on/off blocks for binary sensors. */
function historyFor(id: string) {
  const now = Date.now() / 1000;
  const start = now - 86_400;
  const s = states[id];
  const rows: any[] = [];
  if (id.startsWith("person.")) {
    const home = [32.0853, 34.7818];
    const dest = [s?.attributes.latitude ?? 32.0741, s?.attributes.longitude ?? 34.7922];
    rows.push({ s: "home", a: { latitude: home[0], longitude: home[1] }, lu: start });
    if (s?.state !== "home") {
      for (let i = 0; i <= 12; i++) {
        const f = i / 12;
        const wob = Math.sin(f * Math.PI * 3) * 0.002;
        rows.push({ s: i < 12 ? "not_home" : s.state, a: { latitude: home[0] + (dest[0] - home[0]) * f + wob, longitude: home[1] + (dest[1] - home[1]) * f - wob }, lu: now - 3 * 3600 + i * 300 });
      }
    } else {
      rows.push({ s: "not_home", a: { latitude: 32.08, longitude: 34.79 }, lu: now - 6 * 3600 });
      rows.push({ s: "home", a: { latitude: home[0], longitude: home[1] }, lu: now - 2 * 3600 });
    }
  } else if (id.startsWith("binary_sensor.")) {
    for (let t = start, on = false; t < now; t += 3600 * (1 + ((t / 3600) % 3)), on = !on) rows.push({ s: on ? "on" : "off", lu: t });
  } else {
    const base = parseFloat(s?.state ?? "0") || 20;
    for (let t = start; t <= now; t += 900) rows.push({ s: String(+(base + Math.sin(t / 7000) * base * 0.08).toFixed(2)), lu: t });
  }
  return { [id]: rows };
}

function hsRgb(h: number, s: number): [number, number, number] {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return Math.round(255 * (1 - (s / 100) * Math.max(0, Math.min(k, 4 - k, 1))));
  };
  return [f(5), f(3), f(1)];
}

/** Daily totals for the last 40 days, for the Energy page. */
function dailyStatistics(ids: string[]) {
  const out: Record<string, any[]> = {};
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (const id of ids) {
    const rows = [];
    for (let i = 40; i >= 0; i--) {
      const d = new Date(start);
      d.setDate(d.getDate() - i);
      const base = id.includes("solar") ? 9 + ((i * 5) % 7) : 16 + ((i * 7) % 9);
      rows.push({ start: d.getTime(), end: d.getTime() + 86_400_000, change: i === 0 ? base * 0.45 : base });
    }
    out[id] = rows;
  }
  return out;
}

/** A believable day: low at night, peaks around breakfast and dinner. */
function statistics() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 1);
  const rows = [];
  const shape = (h: number) => 0.25 + 0.9 * Math.exp(-((h - 7.5) ** 2) / 3) + 1.1 * Math.exp(-((h - 19) ** 2) / 4) + 0.3 * Math.exp(-((h - 13) ** 2) / 6);
  for (let t = start.getTime(); t < Date.now(); t += 3_600_000) {
    const d = new Date(t);
    const yesterday = t < start.getTime() + 86_400_000;
    rows.push({ start: t, end: t + 3_600_000, change: +(shape(d.getHours()) * (yesterday ? 1.12 : 1) * (0.9 + ((d.getHours() * 7) % 5) / 25)).toFixed(3) });
  }
  return { "sensor.grid_energy": rows };
}

async function callWS(msg: Record<string, any>): Promise<any> {
  switch (msg.type) {
    case "smartnest_pro/license/status":
      return { valid: !params.has("unlicensed"), reason: params.has("unlicensed") ? "invalid" : "active" };
    case "smartnest_pro/timer/list":
      return {};
    case "smartnest_pro/timer/set":
    case "smartnest_pro/timer/cancel":
      return null;
    case "smartnest_pro/config/get":
      return { config: saved };
    case "smartnest_pro/config/save":
      saved = msg.config;
      configSubs.forEach((cb) => cb({ config: saved }));
      return null;
    case "call_service":
      if (msg.domain === "roborock" && msg.service === "get_maps")
        return { response: { [msg.target.entity_id]: { maps: [{ flag: 0, name: "Ground", rooms: { "16": "Main Hall", "17": "Kitchen", "18": "Office", "19": "Terrace" } }] } } };
      throw new Error("mock: unknown service");
    case "history/history_during_period":
      return historyFor(msg.entity_ids[0]);
    case "recorder/statistics_during_period":
      return msg.period === "day" ? dailyStatistics(msg.statistic_ids) : statistics();
    default:
      throw new Error(`mock: unknown ${msg.type}`);
  }
}

export function makeHass(onChange: (h: Hass) => void, role: "admin" | "user" = "admin"): Hass {
  const build = (): Hass => ({
    states: { ...states },
    areas: areasList,
    entities,
    devices: {},
    user: { id: "u1", name: params.get("name") ?? "Omar Saadi", is_admin: role === "admin" },
    themes: { darkMode: params.has("dark") },
    language: params.get("lang") ?? "en",
    callService,
    callWS,
    fetchWithAuth: async (_path, init) => {
      const file = (init?.body as FormData).get("file") as File;
      return new Response(JSON.stringify({ url: URL.createObjectURL(file) }), { status: 200 });
    },
    connection: {
      subscribeMessage: async (cb, msg) => {
        if (msg.type === "smartnest_pro/license/subscribe") {
          cb({ valid: !params.has("unlicensed"), reason: params.has("unlicensed") ? "invalid" : "active" } as any);
          return () => {};
        }
        if (msg.type === "smartnest_pro/config/subscribe") configSubs.add(cb);
        return () => configSubs.delete(cb);
      },
    },
  });
  notify = () => onChange(build());
  return build();
}
