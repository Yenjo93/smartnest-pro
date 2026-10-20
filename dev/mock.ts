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
add("person.omar", "home", { friendly_name: "Omar", source: "device_tracker.omar_phone" });
add("person.lina", "Work", { friendly_name: "Lina", source: "device_tracker.lina_phone" });
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
add("light.bedside", "on", { friendly_name: "Bedside Lamp", brightness: 90, supported_color_modes: ["hs"], color_mode: "hs", rgb_color: [255, 170, 90] }, "master_bedroom");
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
      if (data.hs_color) extra.hs_color = data.hs_color;
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
    else if (service === "media_play_pause") set(id, s.state === "playing" ? "paused" : "playing");
    else if (service === "set_fan_speed") set(id, s.state, { fan_speed: data.fan_speed });
    else if (service === "pause") set(id, "paused");
    else if (domain === "alarm_control_panel") set(id, service === "alarm_disarm" ? "disarmed" : service === "alarm_arm_home" ? "armed_home" : "armed_away");
    else if (service === "volume_set") set(id, s.state, { volume_level: data.volume_level });
  }
  notify();
  return Promise.resolve();
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
    case "smartnest_pro/config/get":
      return { config: saved };
    case "smartnest_pro/config/save":
      saved = msg.config;
      configSubs.forEach((cb) => cb({ config: saved }));
      return null;
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
        if (msg.type === "smartnest_pro/config/subscribe") configSubs.add(cb);
        return () => configSubs.delete(cb);
      },
    },
  });
  notify = () => onChange(build());
  return build();
}
