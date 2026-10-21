// Soft low-poly furniture built in code, in the active theme's colours. Smart pieces react to their device:
// the AC glows and blows, fans spin, lamps light up, screens come on, curtains open, robots drive.
//
// Every piece is built around its footprint centre at y = 0. Ceiling pieces are built hanging DOWN from y = 0
// (the scene puts that at the ceiling). The front of a piece faces +z.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { HassEntity, Palette } from "../types";
import { isOn } from "../ha";

export interface Mats {
  fabric: THREE.MeshStandardMaterial;
  fabric2: THREE.MeshStandardMaterial;
  wood: THREE.MeshStandardMaterial;
  woodDark: THREE.MeshStandardMaterial;
  white: THREE.MeshStandardMaterial;
  stone: THREE.MeshStandardMaterial;
  metal: THREE.MeshStandardMaterial;
  black: THREE.MeshStandardMaterial;
  glass: THREE.MeshStandardMaterial;
  green: THREE.MeshStandardMaterial;
  rug: THREE.MeshStandardMaterial;
  water: THREE.MeshStandardMaterial;
  accent: THREE.MeshStandardMaterial;
  glow: THREE.Texture;
}

const COLORS: Record<Palette, Record<string, string>> = {
  light: { fabric: "#d9cfc2", fabric2: "#bfb2a1", wood: "#cfae86", woodDark: "#8d7055", white: "#f6f3ee", stone: "#5d5852", metal: "#a7a19a", black: "#2a2725", green: "#86ad62", rug: "#c6d6b4", water: "#9fd3ee", accent: "#b5dc8f" },
  dark: { fabric: "#6b625a", fabric2: "#564e47", wood: "#9b7b5a", woodDark: "#6b5440", white: "#d8d1c8", stone: "#2f2b28", metal: "#8c857e", black: "#151312", green: "#6f9550", rug: "#4e5a45", water: "#5f9fc8", accent: "#9ccf6c" },
  purple: { fabric: "#9c92ec", fabric2: "#7b70d4", wood: "#b1a4f2", woodDark: "#6a5fc4", white: "#ece9ff", stone: "#3b3480", metal: "#bdb5ff", black: "#1b1740", green: "#8fd1a8", rug: "#5b52b8", water: "#8fb8ff", accent: "#ff8a3d" },
};

export function makeMats(p: Palette, glow: THREE.Texture): Mats {
  const c = COLORS[p];
  const m = (color: string, rough = 0.85, extra: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: rough, ...extra });
  return {
    fabric: m(c.fabric, 0.95),
    fabric2: m(c.fabric2, 0.95),
    wood: m(c.wood, 0.7),
    woodDark: m(c.woodDark, 0.7),
    white: m(c.white, 0.6),
    stone: m(c.stone, 0.5),
    metal: m(c.metal, 0.35, { metalness: 0.4 }),
    black: m(c.black, 0.4),
    glass: m("#dff1ff", 0.1, { transparent: true, opacity: 0.25 }),
    green: m(c.green, 0.9),
    rug: m(c.rug, 1),
    water: m(c.water, 0.2, { transparent: true, opacity: 0.85 }),
    accent: m(c.accent, 0.6),
    glow,
  };
}

// ---------- building blocks ----------

const rb = (w: number, h: number, d: number, r = 0.03) =>
  new RoundedBoxGeometry(w, h, d, 2, Math.max(0.002, Math.min(r, Math.min(w, h, d) / 2 - 0.001)));
const cyl = (rt: number, rbot: number, h: number, seg = 20) => new THREE.CylinderGeometry(rt, rbot, h, seg);
const sphere = (r: number, w = 16, h = 12) => new THREE.SphereGeometry(r, w, h);

function add(g: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, shadow = true) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = shadow;
  m.receiveShadow = true;
  g.add(m);
  return m;
}

/** A material that lights up: its own copy, so one lamp glowing doesn't light every lamp. */
const emissive = (color = "#fbf6ec", rough = 0.6) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, emissive: "#000000", side: THREE.DoubleSide });

/** A soft round glow that always faces the camera: the light a lamp throws. */
function glowSprite(m: Mats, size: number) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: m.glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
  s.scale.set(size, size, 1);
  s.visible = false;
  s.renderOrder = 3;
  return s;
}

function legs(g: THREE.Object3D, w: number, d: number, h: number, mat: THREE.Material, inset = 0.06, r = 0.022) {
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(g, cyl(r, r, h, 10), mat, sx * (w / 2 - inset), h / 2, sz * (d / 2 - inset));
}

/** Seating with a back along -z and arms on the sides. */
function sofa(m: Mats, w: number, d: number, seats: number, fabric = m.fabric, frame = m.fabric2) {
  const g = new THREE.Group();
  add(g, rb(w, 0.2, d, 0.05), frame, 0, 0.12, 0);
  const cw = (w - 0.36) / seats;
  for (let i = 0; i < seats; i++) add(g, rb(cw - 0.03, 0.1, d - 0.28, 0.04), fabric, -w / 2 + 0.18 + cw * (i + 0.5), 0.27, 0.08);
  add(g, rb(w, 0.32, 0.2, 0.06), frame, 0, 0.36, -d / 2 + 0.1);
  for (const s of [-1, 1]) add(g, rb(0.18, 0.28, d, 0.06), frame, s * (w / 2 - 0.09), 0.28, 0);
  return g;
}

function chair(m: Mats, seat = m.fabric) {
  const g = new THREE.Group();
  add(g, rb(0.44, 0.05, 0.44, 0.02), seat, 0, 0.3, 0);
  add(g, rb(0.44, 0.3, 0.05, 0.02), seat, 0, 0.48, -0.2);
  legs(g, 0.44, 0.44, 0.28, m.woodDark, 0.04, 0.015);
  return g;
}

function table(m: Mats, w: number, d: number, h: number, round = false, top = m.wood) {
  const g = new THREE.Group();
  if (round) {
    add(g, cyl(w / 2, w / 2, 0.05, 36), top, 0, h, 0);
    add(g, cyl(0.04, 0.04, h, 10), m.woodDark, 0, h / 2, 0);
    add(g, cyl(0.22, 0.25, 0.03, 24), m.woodDark, 0, 0.015, 0);
  } else {
    add(g, rb(w, 0.05, d, 0.025), top, 0, h, 0);
    legs(g, w, d, h - 0.02, m.woodDark);
  }
  return g;
}

/** Chairs along both long sides of a table, `n` per side. */
function seatsAround(g: THREE.Group, m: Mats, w: number, d: number, n: number) {
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + (w / n) * (i + 0.5);
    for (const s of [-1, 1]) {
      const c = chair(m);
      c.position.set(x, 0, s * (d / 2 + 0.2));
      c.rotation.y = s > 0 ? Math.PI : 0;
      g.add(c);
    }
  }
}

function cabinet(m: Mats, w: number, h: number, d: number, body = m.white, doors = 2) {
  const g = new THREE.Group();
  add(g, rb(w, h, d, 0.025), body, 0, h / 2, 0);
  for (let i = 1; i < doors; i++) add(g, new THREE.BoxGeometry(0.008, h * 0.92, 0.01), m.metal, -w / 2 + (w / doors) * i, h / 2, d / 2 + 0.001, false);
  for (let i = 0; i < doors; i++) add(g, new THREE.BoxGeometry(0.012, Math.min(0.18, h * 0.3), 0.02), m.metal, -w / 2 + (w / doors) * (i + 0.5) + 0.05, h * 0.55, d / 2 + 0.01, false);
  return g;
}

function plant(m: Mats, h: number, pot = m.white) {
  const g = new THREE.Group();
  add(g, cyl(0.14, 0.11, 0.24, 18), pot, 0, 0.12, 0);
  const n = Math.max(3, Math.round(h * 5));
  for (let i = 0; i < n; i++) {
    const a = i * 2.4;
    const r = 0.06 + (i / n) * 0.08;
    add(g, new THREE.IcosahedronGeometry(0.1 + 0.04 * Math.abs(Math.sin(i)), 1), m.green, Math.cos(a) * r, 0.3 + (i / n) * h, Math.sin(a) * r);
  }
  return g;
}

function tree(m: Mats, h: number, pine = false) {
  const g = new THREE.Group();
  add(g, cyl(0.06, 0.09, h * 0.45, 10), m.woodDark, 0, h * 0.22, 0);
  if (pine) for (let i = 0; i < 3; i++) add(g, new THREE.ConeGeometry(0.55 - i * 0.14, h * 0.35, 12), m.green, 0, h * (0.45 + i * 0.18), 0);
  else
    for (const [x, y, z, r] of [
      [0, 0.75, 0, 0.55],
      [0.3, 0.65, 0.15, 0.38],
      [-0.28, 0.62, -0.1, 0.4],
      [0.05, 0.95, -0.2, 0.36],
    ])
      add(g, new THREE.IcosahedronGeometry(r, 1), m.green, x, y * h, z);
  return g;
}

function screenPanel(g: THREE.Object3D, w: number, h: number, x: number, y: number, z: number, frame: THREE.Material) {
  add(g, rb(w + 0.06, h + 0.06, 0.04, 0.015), frame, x, y, z);
  const mat = emissive("#0b0b10", 0.2);
  add(g, new THREE.PlaneGeometry(w, h), mat, x, y, z + 0.021, false);
  return mat;
}

const mirrorMat = () => new THREE.MeshStandardMaterial({ color: "#dfe9f2", metalness: 0.9, roughness: 0.05 });

// ---------- reactions ----------

export interface Piece {
  group: THREE.Group;
  /** True while something moves (fan blades, airflow, the robot…): the scene keeps animating then. */
  active: boolean;
  update(s?: HassEntity): void;
  tick?(dt: number, t: number): void;
}

const still = (group: THREE.Group): Piece => ({ group, active: false, update() {} });

/** Light colour of a light entity, as a three.js colour; a warm white for plain on/off things. */
function lightColor(s?: HassEntity, fallback = "#ffd9a0"): THREE.Color {
  const rgb = s?.attributes.rgb_color as number[] | undefined;
  if (rgb) return new THREE.Color().setRGB(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, THREE.SRGBColorSpace);
  return new THREE.Color(fallback);
}

/** "On" for anything: lights and switches, playing media, a washer drawing power, an open sensor. */
function running(s?: HassEntity): boolean {
  if (!s) return false;
  if (s.state === "playing" || s.state === "cleaning" || s.state === "mowing") return true;
  const n = parseFloat(s.state);
  if (Number.isFinite(n) && s.entity_id.startsWith("sensor.")) return n > 5;
  return isOn(s);
}

interface SmartParts {
  /** Materials that glow when on. */
  glows?: THREE.MeshStandardMaterial[];
  sprites?: THREE.Sprite[];
  /** Fixed glow colour; without it lights use the bulb's colour. */
  color?: string;
  intensity?: number;
  spin?: { o: THREE.Object3D; axis: "x" | "y" | "z"; speed: number }[];
  /** Called every frame while on: moving water, blinking LEDs, mist… */
  loop?: (t: number, dt: number) => void;
  /** Called on every state change, for anything beyond on/off. */
  apply?: (s: HassEntity | undefined, on: boolean) => void;
  isOn?: (s?: HassEntity) => boolean;
}

/** Wires a piece's glowing, spinning and looping parts to its device's state. */
function smart(group: THREE.Group, p: SmartParts): Piece {
  const piece: Piece = {
    group,
    active: false,
    update(s) {
      const on = (p.isOn ?? running)(s);
      const level = on ? (typeof s?.attributes.brightness === "number" ? 0.35 + 0.65 * (s.attributes.brightness / 255) : 1) : 0;
      const col = p.color ? new THREE.Color(p.color) : lightColor(s);
      for (const g of p.glows ?? []) {
        g.emissive.copy(on ? col : new THREE.Color(0, 0, 0));
        g.emissiveIntensity = (p.intensity ?? 1.1) * level;
      }
      for (const sp of p.sprites ?? []) {
        sp.visible = on;
        sp.material.color.copy(col);
        sp.material.opacity = 0.3 + 0.55 * level;
      }
      p.apply?.(s, on);
      piece.active = on && (!!p.spin?.length || !!p.loop);
    },
    tick(dt, t) {
      for (const sp of p.spin ?? []) sp.o.rotation[sp.axis] += sp.speed * dt;
      p.loop?.(t, dt);
    },
  };
  return piece;
}

/** Appliances that only glow when on: stove burners, oven window, toaster… */
function glowing(g: THREE.Group, mats: THREE.MeshStandardMaterial[], color: string, sprite?: THREE.Sprite): Piece {
  if (sprite) g.add(sprite);
  return smart(g, { glows: mats, sprites: sprite ? [sprite] : [], color, intensity: 1.4 });
}

/** Rising puffs of steam or mist, shown only while on. */
function steam(m: Mats, g: THREE.Group, y: number) {
  const puffs = Array.from({ length: 3 }, () => {
    const s = glowSprite(m, 0.18);
    g.add(s);
    return s;
  });
  return {
    show: (on: boolean) => puffs.forEach((p) => (p.visible = on)),
    loop: (t: number) =>
      puffs.forEach((p, i) => {
        const k = (t * 0.6 + i / 3) % 1;
        p.position.set(Math.sin(t + i) * 0.02, y + k * 0.3, 0);
        p.material.opacity = Math.sin(k * Math.PI) * 0.45;
        p.material.color.set("#ffffff");
        p.scale.setScalar(0.12 + k * 0.2);
      }),
  };
}

// ---------- smart pieces ----------

function lamp(m: Mats, kind: "floor" | "table" | "desk" | "ceiling" | "pendant" | "chandelier" | "spot"): Piece {
  const g = new THREE.Group();
  const shade = emissive("#fbf6ec", 0.8);
  let y: number;
  let size = 1;
  switch (kind) {
    case "floor":
      add(g, cyl(0.15, 0.17, 0.03), m.black, 0, 0.015, 0);
      add(g, cyl(0.012, 0.012, 0.7, 8), m.metal, 0, 0.38, 0);
      y = 0.75;
      add(g, cyl(0.12, 0.18, 0.2, 24), shade, 0, y, 0);
      break;
    case "table":
      add(g, cyl(0.07, 0.09, 0.16, 16), m.white, 0, 0.08, 0);
      y = 0.24;
      add(g, cyl(0.09, 0.13, 0.13, 20), shade, 0, y, 0);
      size = 0.8;
      break;
    case "desk":
      add(g, cyl(0.07, 0.08, 0.02, 16), m.black, 0, 0.01, 0);
      add(g, cyl(0.008, 0.008, 0.28, 6), m.black, 0, 0.15, -0.04).rotation.x = 0.3;
      y = 0.28;
      add(g, cyl(0.03, 0.07, 0.07, 16), shade, 0, y, 0.03);
      size = 0.6;
      break;
    case "ceiling":
      y = -0.07;
      add(g, cyl(0.24, 0.22, 0.04, 28), shade, 0, y, 0, false);
      size = 1.6;
      break;
    case "pendant": {
      add(g, cyl(0.005, 0.005, 0.28, 6), m.black, 0, -0.14, 0, false);
      y = -0.33;
      const dome = add(g, new THREE.SphereGeometry(0.2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), shade, 0, y, 0, false);
      dome.scale.y = 0.6;
      size = 1.2;
      break;
    }
    case "chandelier":
      add(g, cyl(0.005, 0.005, 0.2, 6), m.metal, 0, -0.1, 0, false);
      add(g, new THREE.TorusGeometry(0.3, 0.012, 8, 32), m.metal, 0, -0.24, 0, false).rotation.x = Math.PI / 2;
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        add(g, sphere(0.05, 12, 8), shade, Math.cos(a) * 0.3, -0.21, Math.sin(a) * 0.3, false);
      }
      y = -0.22;
      size = 1.9;
      break;
    default:
      add(g, cyl(0.06, 0.06, 0.03, 16), m.white, 0, -0.015, 0, false);
      y = -0.04;
      add(g, cyl(0.04, 0.04, 0.01, 16), shade, 0, y, 0, false);
      size = 0.8;
  }
  const glow = glowSprite(m, size);
  glow.position.set(0, y, 0);
  g.add(glow);
  return smart(g, { glows: [shade], sprites: [glow], intensity: 1.3 });
}

/** Three soft sheets that drift out of a vent and fade, over and over. */
function airflow(m: Mats, parent: THREE.Object3D, w: number, y: number, z: number, drop = 0.35) {
  const flows = Array.from({ length: 3 }, () => {
    const f = new THREE.Mesh(
      new THREE.PlaneGeometry(w, 0.35),
      new THREE.MeshBasicMaterial({ map: m.glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0, side: THREE.DoubleSide }),
    );
    f.rotation.x = -0.9;
    f.visible = false;
    parent.add(f);
    return f;
  });
  return {
    set(on: boolean, col: THREE.Color) {
      for (const f of flows) {
        f.visible = on;
        f.material.color.copy(col);
      }
    },
    loop(t: number) {
      flows.forEach((f, i) => {
        const p = (t * 0.55 + i / 3) % 1;
        f.position.set(0, y - p * drop, z + p * 0.55);
        f.scale.set(1 + p * 0.5, 1 + p * 0.6, 1);
        f.material.opacity = Math.sin(p * Math.PI) * 0.55;
      });
    },
  };
}

function climateMode(s?: HassEntity) {
  const action = s?.attributes.hvac_action as string | undefined;
  const mode = s?.state;
  const on = !!s && mode !== "off" && mode !== "unavailable" && action !== "off" && action !== "idle";
  const heat = action === "heating" || (!action && mode === "heat");
  return { on, color: new THREE.Color(heat ? "#ff9a5c" : "#7fb6ff") };
}

function ac(m: Mats, standing: boolean): Piece {
  const g = new THREE.Group();
  const louver = emissive("#2b2b2b", 0.4);
  const led = emissive("#444444");
  let flow: ReturnType<typeof airflow>;
  if (standing) {
    add(g, rb(0.42, 0.95, 0.32, 0.08), m.white, 0, 0.475, 0);
    add(g, rb(0.3, 0.5, 0.02, 0.01), louver, 0, 0.6, 0.161, false);
    add(g, sphere(0.012, 8, 8), led, 0, 0.9, 0.16, false);
    flow = airflow(m, g, 0.35, 0.55, 0.2, 0.15);
  } else {
    add(g, rb(0.95, 0.24, 0.24, 0.06), m.white, 0, 0.12, 0);
    add(g, rb(0.8, 0.025, 0.03, 0.01), louver, 0, 0.04, 0.12, false);
    add(g, sphere(0.012, 8, 8), led, 0.38, 0.17, 0.12, false);
    flow = airflow(m, g, 0.8, -0.02, 0.16);
  }
  const piece: Piece = {
    group: g,
    active: false,
    update(s) {
      const { on, color } = climateMode(s);
      louver.emissive.copy(on ? color : new THREE.Color(0, 0, 0));
      louver.emissiveIntensity = 1.4;
      led.emissive.set(on ? "#7dff9a" : "#000000");
      led.emissiveIntensity = 1.4;
      flow.set(on, color);
      piece.active = on;
    },
    tick: (_dt, t) => flow.loop(t),
  };
  return piece;
}

function fan(m: Mats, kind: "ceiling" | "floor" | "purifier"): Piece {
  const g = new THREE.Group();
  const rotor = new THREE.Group();
  const led = emissive("#444444");
  if (kind === "ceiling") {
    add(g, cyl(0.01, 0.01, 0.1, 6), m.metal, 0, -0.05, 0, false);
    rotor.position.set(0, -0.11, 0);
    g.add(rotor);
    add(rotor, cyl(0.07, 0.07, 0.06, 16), m.white, 0, 0, 0, false);
    for (let i = 0; i < 5; i++) {
      const blade = add(rotor, rb(0.5, 0.012, 0.11, 0.005), m.wood, 0, 0, 0, false);
      blade.geometry.translate(0.3, 0, 0);
      blade.rotation.y = (i / 5) * Math.PI * 2;
    }
  } else if (kind === "floor") {
    add(g, cyl(0.16, 0.18, 0.03), m.black, 0, 0.015, 0);
    add(g, cyl(0.012, 0.012, 0.55, 8), m.metal, 0, 0.3, 0);
    const head = new THREE.Group();
    head.position.set(0, 0.62, 0);
    g.add(head);
    add(head, cyl(0.17, 0.17, 0.05, 24), m.glass, 0, 0, 0).rotation.x = Math.PI / 2;
    rotor.position.set(0, 0, 0.01);
    head.add(rotor);
    for (let i = 0; i < 3; i++) {
      const blade = add(rotor, rb(0.13, 0.06, 0.01, 0.004), m.white, 0, 0, 0, false);
      blade.geometry.translate(0.07, 0, 0);
      blade.rotation.z = (i / 3) * Math.PI * 2;
    }
  } else {
    add(g, cyl(0.15, 0.16, 0.55, 28), m.white, 0, 0.275, 0);
    add(g, cyl(0.12, 0.12, 0.01, 24), m.black, 0, 0.555, 0);
    rotor.position.set(0, 0.56, 0);
    g.add(rotor);
    for (let i = 0; i < 6; i++) {
      const blade = add(rotor, rb(0.09, 0.008, 0.03, 0.004), m.metal, 0, 0, 0, false);
      blade.geometry.translate(0.05, 0, 0);
      blade.rotation.y = (i / 6) * Math.PI * 2;
    }
    add(g, new THREE.TorusGeometry(0.15, 0.006, 6, 32), led, 0, 0.35, 0, false).rotation.x = Math.PI / 2;
  }
  const spin = { o: rotor as THREE.Object3D, axis: (kind === "floor" ? "z" : "y") as "y" | "z", speed: 0 };
  return smart(g, {
    glows: [led],
    color: "#7dd3ff",
    spin: [spin],
    apply(s, on) {
      const pct = typeof s?.attributes.percentage === "number" ? s.attributes.percentage : 66;
      spin.speed = on ? 3 + (pct / 100) * 14 : 0;
    },
  });
}

/** Screens: on lights them, playing makes the picture gently change colour. */
function screenReact(g: THREE.Group, screen: THREE.MeshStandardMaterial, glow?: THREE.Sprite, base = "#8fb4ff"): Piece {
  const col = new THREE.Color(base);
  const piece: Piece = {
    group: g,
    active: false,
    update(s) {
      const on = running(s) || s?.state === "on" || s?.state === "idle" || s?.state === "paused";
      screen.emissive.copy(on ? col : new THREE.Color(0, 0, 0));
      screen.emissiveIntensity = on ? 0.9 : 0;
      if (glow) {
        glow.visible = on;
        glow.material.opacity = 0.35;
        glow.material.color.copy(col);
      }
      piece.active = s?.state === "playing";
    },
    tick(_dt, t) {
      const c = new THREE.Color().setHSL(0.6 + 0.06 * Math.sin(t * 0.7), 0.6, 0.62);
      screen.emissive.copy(c);
      screen.emissiveIntensity = 0.9 * (0.75 + 0.25 * Math.sin(t * 3.1) * Math.sin(t * 1.7));
      glow?.material.color.copy(c);
    },
  };
  return piece;
}

function tv(m: Mats, unit: boolean): Piece {
  const g = new THREE.Group();
  let screen: THREE.MeshStandardMaterial;
  if (unit) {
    add(g, rb(1.8, 0.3, 0.45, 0.03), m.woodDark, 0, 0.15, 0);
    screen = screenPanel(g, 1.24, 0.56, 0, 0.66, -0.12, m.black);
  } else screen = screenPanel(g, 1.32, 0.6, 0, 0.34, -0.01, m.black);
  const glow = glowSprite(m, 1.6);
  glow.position.set(0, unit ? 0.66 : 0.34, 0.12);
  g.add(glow);
  return screenReact(g, screen, glow);
}

const coverPos = (s?: HassEntity) =>
  (typeof s?.attributes.current_position === "number" ? s.attributes.current_position : s?.state === "open" ? 100 : 0) / 100;

/** Fabric curtain panels that gather to the sides as the cover opens. Height follows the walls. */
function curtain(m: Mats, h: number): Piece {
  const g = new THREE.Group();
  add(g, cyl(0.012, 0.012, 2.0, 6), m.metal, 0, h - 0.03, 0, false).rotation.z = Math.PI / 2;
  const mat = new THREE.MeshStandardMaterial({ color: m.fabric.color.clone().offsetHSL(0, 0, 0.06), roughness: 1, side: THREE.DoubleSide });
  const panels: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const p = new THREE.Group();
    p.position.set(side * 1.0, 0, 0);
    g.add(p);
    for (let i = 0; i < 8; i++) add(p, rb(0.12, h - 0.08, 0.04, 0.02), mat, -side * (0.06 + i * 0.12), (h - 0.08) / 2 + 0.02, (i % 2) * 0.03 - 0.015);
    panels.push(p);
  }
  return {
    group: g,
    active: false,
    update(s) {
      const pos = coverPos(s);
      for (const p of panels) p.scale.x = 1 - 0.78 * pos;
    },
  };
}

/** Blinds (slats that tilt open) and roller shades (fabric that rolls up). */
function shade(m: Mats, roller: boolean): Piece {
  const g = new THREE.Group();
  const h = 0.75;
  add(g, rb(1.6, 0.06, 0.08, 0.02), m.white, 0, h, 0);
  const slats: THREE.Mesh[] = [];
  let cloth: THREE.Mesh | undefined;
  if (roller) {
    cloth = add(g, new THREE.BoxGeometry(1.5, 1, 0.01), m.fabric, 0, h, 0.01, false);
    cloth.geometry.translate(0, -0.5, 0);
  } else for (let i = 0; i < 12; i++) slats.push(add(g, new THREE.BoxGeometry(1.52, 0.006, 0.07), m.white, 0, h - 0.06 - i * 0.06, 0.01, false));
  return {
    group: g,
    active: false,
    update(s) {
      const pos = coverPos(s);
      if (cloth) cloth.scale.y = Math.max(0.04, (h - 0.02) * (1 - pos));
      for (const sl of slats) sl.rotation.x = (1 - pos) * 0.05 + pos * 1.35;
    },
  };
}

/** Doors, windows and the garage door: a sensor or cover opens them; a lock shows red or green. */
function opening(m: Mats, kind: "door" | "window" | "garage", wallH: number): Piece {
  const g = new THREE.Group();
  const hinge = new THREE.Group();
  const led = emissive("#444444");
  let panel: THREE.Mesh;
  let panelH = 0;
  if (kind === "garage") {
    panelH = Math.min(0.9, wallH - 0.05);
    panel = add(g, rb(2.5, panelH, 0.06, 0.02), m.white, 0, panelH / 2, 0);
    for (let i = 1; i < 4; i++) add(panel, new THREE.BoxGeometry(2.45, 0.01, 0.01), m.metal, 0, -panelH / 2 + (panelH / 4) * i, 0.031, false);
  } else if (kind === "door") {
    const h = Math.min(0.95, wallH - 0.05);
    hinge.position.set(-0.45, 0, 0);
    g.add(hinge);
    panel = add(hinge, rb(0.88, h, 0.05, 0.015), m.wood, 0.44, h / 2, 0);
    add(hinge, sphere(0.02, 8, 8), m.metal, 0.8, h * 0.5, 0.04, false);
    add(hinge, rb(0.05, 0.08, 0.02, 0.008), led, 0.8, h * 0.58, 0.035, false);
  } else {
    add(g, rb(1.4, 0.04, 0.12, 0.01), m.white, 0, 0, 0);
    add(g, rb(1.4, 0.04, 0.12, 0.01), m.white, 0, 0.55, 0);
    hinge.position.set(-0.68, 0.02, 0);
    g.add(hinge);
    panel = add(hinge, new THREE.BoxGeometry(0.66, 0.5, 0.02), m.glass, 0.34, 0.27, 0, false);
    add(g, new THREE.BoxGeometry(0.66, 0.5, 0.02), m.glass, 0.35, 0.29, 0, false);
  }
  return {
    group: g,
    active: false,
    update(s) {
      const domain = s?.entity_id.split(".")[0];
      if (domain === "lock") {
        led.emissive.set(s!.state === "locked" ? "#7dff9a" : "#ff6a4a");
        led.emissiveIntensity = 1.4;
        hinge.rotation.y = 0;
        return;
      }
      const open = domain === "cover" ? coverPos(s) : s?.state === "on" ? 1 : 0;
      if (kind === "garage") panel.position.y = panelH / 2 + open * 0.85;
      else hinge.rotation.y = -open * (kind === "door" ? 1.4 : 0.9);
    },
  };
}

function robot(m: Mats, mower: boolean): Piece {
  const g = new THREE.Group();
  const bot = new THREE.Group();
  g.add(bot);
  if (mower) {
    add(bot, rb(0.55, 0.16, 0.42, 0.08), m.accent, 0, 0.1, 0);
    for (const s of [-1, 1]) add(bot, cyl(0.08, 0.08, 0.05, 16), m.black, 0.18, 0.08, s * 0.23).rotation.x = Math.PI / 2;
  } else {
    add(bot, cyl(0.17, 0.17, 0.07, 28), m.white, 0, 0.04, 0);
    add(bot, cyl(0.06, 0.06, 0.02, 20), m.black, 0.02, 0.085, 0);
  }
  const led = emissive("#333333");
  add(bot, sphere(0.015, 8, 8), led, -0.1, mower ? 0.19 : 0.08, 0, false);
  const range = mower ? 1.6 : 0.9;
  const piece: Piece = {
    group: g,
    active: false,
    update(s) {
      const busy = s?.state === "cleaning" || s?.state === "mowing";
      led.emissive.set(busy ? "#7dff9a" : s?.state === "error" ? "#ff5a4a" : s?.state === "docked" ? "#7fb6ff" : "#000");
      led.emissiveIntensity = 1.4;
      piece.active = busy;
      if (!busy) {
        bot.position.set(0, 0, 0);
        bot.rotation.y = 0;
      }
    },
    tick(_dt, t) {
      // A lazy figure-of-eight near where it was placed.
      bot.position.set(Math.sin(t * 0.5) * range, 0, Math.sin(t * 1.0) * range * 0.5);
      bot.rotation.y = Math.atan2(Math.cos(t * 0.5) * 0.45, Math.cos(t * 1.0) * 0.45);
    },
  };
  return piece;
}

function speaker(m: Mats, round: boolean): Piece {
  const g = new THREE.Group();
  const body = round ? add(g, cyl(0.08, 0.09, 0.16, 24), m.fabric2, 0, 0.08, 0) : add(g, rb(0.24, 0.42, 0.24, 0.05), m.black, 0, 0.21, 0);
  const ring = emissive("#444444");
  if (round) add(g, new THREE.TorusGeometry(0.07, 0.008, 6, 28), ring, 0, 0.162, 0, false).rotation.x = Math.PI / 2;
  else add(g, rb(0.2, 0.32, 0.01, 0.005), m.fabric, 0, 0.22, 0.121, false);
  const glow = glowSprite(m, 0.7);
  glow.position.set(0, round ? 0.2 : 0.25, 0.1);
  g.add(glow);
  return smart(g, {
    glows: [ring],
    sprites: [glow],
    color: "#9fb0ff",
    isOn: (s) => s?.state === "playing",
    loop(t) {
      const beat = 1 + 0.04 * Math.max(0, Math.sin(t * 7.5));
      body.scale.set(beat, 1, beat);
      glow.material.opacity = 0.2 + 0.3 * Math.max(0, Math.sin(t * 7.5));
    },
    apply(_s, on) {
      if (!on) body.scale.set(1, 1, 1);
    },
  });
}

/** Front-loading machines: the drum turns while running. */
function drumMachine(m: Mats): Piece {
  const g = new THREE.Group();
  add(g, rb(0.6, 0.62, 0.6, 0.04), m.white, 0, 0.31, 0);
  const drum = new THREE.Group();
  drum.position.set(0, 0.3, 0.301);
  g.add(drum);
  add(drum, new THREE.TorusGeometry(0.17, 0.025, 10, 28), m.metal, 0, 0, 0, false);
  add(drum, new THREE.CircleGeometry(0.15, 28), m.glass, 0, 0, -0.002, false);
  add(drum, rb(0.05, 0.13, 0.01, 0.004), m.fabric2, 0.04, 0, 0.002, false);
  const led = emissive("#444444");
  add(g, sphere(0.01, 8, 8), led, 0.22, 0.56, 0.3, false);
  return smart(g, { glows: [led], color: "#7dff9a", spin: [{ o: drum, axis: "z", speed: 9 }] });
}

// ---------- the catalog ----------

export interface BuildEnv {
  /** The floor's wall height: curtains, doors, columns and stairs size to it. */
  wallH: number;
}

/** Builds a catalog piece. Unknown types become a plain block, so an old layout never breaks the plan. */
export function buildPiece(type: string, m: Mats, env: BuildEnv): Piece {
  const g = new THREE.Group();
  switch (type) {
    // ----- smart -----
    case "ac":
      return ac(m, false);
    case "ac_floor":
      return ac(m, true);
    case "ceiling_fan":
      return fan(m, "ceiling");
    case "floor_fan":
      return fan(m, "floor");
    case "air_purifier":
      return fan(m, "purifier");
    case "humidifier": {
      add(g, cyl(0.12, 0.14, 0.3, 24), m.white, 0, 0.15, 0);
      const water = emissive("#bfe3ff", 0.2);
      add(g, cyl(0.1, 0.1, 0.12, 24), water, 0, 0.2, 0, false);
      const mist = steam(m, g, 0.34);
      return smart(g, { glows: [water], color: "#7fc4ff", loop: (t) => mist.loop(t), apply: (_s, on) => mist.show(on) });
    }
    case "radiator": {
      const hot = emissive(m.white.color.getStyle(), 0.6);
      for (let i = 0; i < 9; i++) add(g, rb(0.09, 0.5, 0.1, 0.03), hot, -0.44 + i * 0.11, 0.32, 0);
      const glow = glowSprite(m, 1.2);
      glow.position.set(0, 0.35, 0.15);
      return glowing(g, [hot], "#ff8a4a", glow);
    }
    case "water_heater": {
      add(g, cyl(0.22, 0.22, 0.9, 28), m.white, 0, 0.45, 0);
      const dial = emissive("#333333");
      add(g, cyl(0.04, 0.04, 0.02, 16), dial, 0, 0.6, 0.22, false).rotation.x = Math.PI / 2;
      return glowing(g, [dial], "#ff8a4a");
    }
    case "floor_lamp":
      return lamp(m, "floor");
    case "table_lamp":
      return lamp(m, "table");
    case "desk_lamp":
      return lamp(m, "desk");
    case "ceiling_light":
      return lamp(m, "ceiling");
    case "kitchen_light":
      return lamp(m, "pendant");
    case "chandelier":
      return lamp(m, "chandelier");
    case "spotlight":
      return lamp(m, "spot");
    case "led_strip": {
      const strip = emissive("#444444", 0.3);
      add(g, new THREE.BoxGeometry(2.0, 0.015, 0.02), strip, 0, 0, 0, false);
      const glows = [-0.7, 0, 0.7].map((x) => {
        const s = glowSprite(m, 0.8);
        s.position.set(x, 0, 0.05);
        g.add(s);
        return s;
      });
      return smart(g, { glows: [strip], sprites: glows, intensity: 2 });
    }
    case "tv_unit":
      return tv(m, true);
    case "tv_wall":
      return tv(m, false);
    case "projector": {
      add(g, cyl(0.005, 0.005, 0.15, 6), m.metal, 0, -0.075, 0, false);
      add(g, rb(0.32, 0.1, 0.28, 0.03), m.white, 0, -0.2, 0, false);
      const lens = emissive("#222222");
      add(g, cyl(0.04, 0.04, 0.03, 16), lens, 0, -0.2, 0.15, false).rotation.x = Math.PI / 2;
      const beam = new THREE.Mesh(
        new THREE.ConeGeometry(0.5, 2.2, 4, 1, true),
        new THREE.MeshBasicMaterial({ color: "#cfe0ff", transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
      );
      beam.rotation.x = -Math.PI / 2;
      beam.position.set(0, -0.2, 1.25);
      g.add(beam);
      return smart(g, { glows: [lens], color: "#cfe0ff", apply: (_s, on) => (beam.material.opacity = on ? 0.08 : 0) });
    }
    case "projector_screen": {
      add(g, cyl(0.03, 0.03, 2.0, 12), m.black, 0, 0.62, 0).rotation.z = Math.PI / 2;
      const cloth = emissive("#f4f4f4", 0.9);
      const sheet = add(g, new THREE.BoxGeometry(1.9, 1, 0.01), cloth, 0, 0.6, 0.02, false);
      sheet.geometry.translate(0, -0.5, 0);
      sheet.scale.y = 0.58;
      return smart(g, {
        glows: [cloth],
        color: "#9fb8ff",
        intensity: 0.5,
        isOn: (s) => s?.state === "playing",
        apply: (s) => {
          if (s?.entity_id.startsWith("cover.")) sheet.scale.y = Math.max(0.02, 0.58 * (1 - coverPos(s)));
        },
      });
    }
    case "soundbar": {
      add(g, rb(0.9, 0.08, 0.1, 0.03), m.black, 0, 0.04, 0);
      const bar = emissive("#333333");
      add(g, new THREE.BoxGeometry(0.1, 0.008, 0.005), bar, 0, 0.04, 0.051, false);
      return smart(g, { glows: [bar], color: "#9fb0ff", isOn: (s) => s?.state === "playing" || s?.state === "on" });
    }
    case "speaker":
      return speaker(m, false);
    case "speaker_round":
      return speaker(m, true);
    case "curtain":
      return curtain(m, Math.max(0.6, env.wallH - 0.02));
    case "blinds":
      return shade(m, false);
    case "roller_shade":
      return shade(m, true);
    case "window":
      return opening(m, "window", env.wallH);
    case "door_smart":
      return opening(m, "door", env.wallH);
    case "garage_door":
      return opening(m, "garage", env.wallH);
    case "camera": {
      add(g, rb(0.06, 0.06, 0.04, 0.01), m.white, 0, 0, -0.06);
      add(g, rb(0.08, 0.08, 0.16, 0.03), m.white, 0, -0.03, 0.02).rotation.x = 0.35;
      const rec = emissive("#330000");
      add(g, sphere(0.012, 8, 8), rec, 0.025, 0, 0.1, false);
      return smart(g, {
        glows: [rec],
        color: "#ff3b30",
        intensity: 2,
        isOn: (s) => !!s && s.state !== "unavailable" && s.state !== "off",
        loop: (t) => (rec.emissiveIntensity = Math.sin(t * 4) > 0 ? 2 : 0.2),
      });
    }
    case "doorbell": {
      add(g, rb(0.08, 0.14, 0.03, 0.015), m.black, 0, 0.07, 0);
      const ring = emissive("#333333");
      add(g, new THREE.TorusGeometry(0.022, 0.005, 6, 20), ring, 0, 0.04, 0.016, false);
      const glow = glowSprite(m, 0.5);
      glow.position.set(0, 0.05, 0.05);
      g.add(glow);
      return smart(g, { glows: [ring], sprites: [glow], color: "#7fb6ff", intensity: 2, loop: (t) => (glow.material.opacity = 0.3 + 0.4 * Math.abs(Math.sin(t * 5))) });
    }
    case "thermostat": {
      add(g, cyl(0.06, 0.06, 0.03, 28), m.white, 0, 0.06, 0).rotation.x = Math.PI / 2;
      const disp = emissive("#222222");
      add(g, new THREE.CircleGeometry(0.045, 24), disp, 0, 0.06, 0.016, false);
      return {
        group: g,
        active: false,
        update(s) {
          const { on, color } = climateMode(s);
          disp.emissive.copy(on ? color : new THREE.Color("#556677"));
          disp.emissiveIntensity = on ? 1.3 : 0.4;
        },
      };
    }
    case "smoke_detector": {
      add(g, cyl(0.08, 0.08, 0.035, 24), m.white, 0, -0.02, 0, false);
      const led = emissive("#333333");
      add(g, sphere(0.01, 8, 8), led, 0.04, -0.04, 0, false);
      const glow = glowSprite(m, 1.2);
      glow.position.set(0, -0.05, 0);
      g.add(glow);
      return smart(g, { glows: [led], sprites: [glow], color: "#ff3b30", intensity: 2, loop: (t) => (glow.material.opacity = 0.2 + 0.6 * Math.abs(Math.sin(t * 6))) });
    }
    case "robot":
      return robot(m, false);
    case "robot_mower":
      return robot(m, true);
    case "washer":
    case "dryer":
      return drumMachine(m);
    case "dishwasher": {
      add(g, rb(0.6, 0.6, 0.6, 0.03), m.white, 0, 0.3, 0);
      add(g, new THREE.BoxGeometry(0.4, 0.02, 0.02), m.metal, 0, 0.52, 0.31, false);
      const led = emissive("#333333");
      add(g, new THREE.BoxGeometry(0.08, 0.01, 0.005), led, 0.18, 0.56, 0.302, false);
      return glowing(g, [led], "#7dff9a");
    }
    case "coffee_machine": {
      add(g, rb(0.26, 0.32, 0.3, 0.04), m.black, 0, 0.16, 0);
      add(g, rb(0.12, 0.08, 0.12, 0.02), m.white, 0, 0.05, 0.08);
      const led = emissive("#333333");
      add(g, sphere(0.01, 8, 8), led, 0.08, 0.28, 0.151, false);
      const puff = steam(m, g, 0.2);
      return smart(g, { glows: [led], color: "#ffb347", loop: (t) => puff.loop(t), apply: (_s, on) => puff.show(on) });
    }
    case "kettle": {
      const base = emissive(m.metal.color.getStyle(), 0.35);
      add(g, cyl(0.07, 0.09, 0.2, 20), m.white, 0, 0.12, 0);
      add(g, cyl(0.09, 0.09, 0.02, 20), base, 0, 0.01, 0);
      const puff = steam(m, g, 0.24);
      return smart(g, { glows: [base], color: "#7fb6ff", loop: (t) => puff.loop(t), apply: (_s, on) => puff.show(on) });
    }
    case "ev_charger": {
      add(g, rb(0.26, 0.36, 0.1, 0.04), m.white, 0, 0.18, 0);
      const ring = emissive("#333333");
      add(g, new THREE.TorusGeometry(0.06, 0.008, 6, 24), ring, 0, 0.22, 0.051, false);
      return smart(g, { glows: [ring], color: "#7dff9a", intensity: 1.6, loop: (t) => (ring.emissiveIntensity = 0.8 + 0.8 * Math.abs(Math.sin(t * 2))) });
    }
    case "router": {
      add(g, rb(0.24, 0.04, 0.14, 0.015), m.black, 0, 0.02, 0);
      for (const x of [-0.08, 0.08]) add(g, cyl(0.006, 0.006, 0.16, 6), m.black, x, 0.1, -0.06, false);
      const leds = [0, 1, 2].map((i) => {
        const l = emissive("#333333");
        add(g, sphere(0.006, 6, 6), l, -0.03 + i * 0.03, 0.03, 0.071, false);
        return l;
      });
      return smart(g, { glows: leds, color: "#7dff9a", intensity: 2, loop: (t) => leds.forEach((l, i) => (l.emissiveIntensity = Math.sin(t * 9 + i * 2) > 0 ? 2 : 0.3)) });
    }
    case "pet_feeder": {
      add(g, cyl(0.12, 0.14, 0.32, 24), m.white, 0, 0.16, 0);
      add(g, cyl(0.1, 0.1, 0.06, 24), m.glass, 0, 0.32, 0);
      add(g, rb(0.18, 0.05, 0.12, 0.03), m.metal, 0, 0.03, 0.16);
      const led = emissive("#333333");
      add(g, sphere(0.01, 8, 8), led, 0, 0.25, 0.13, false);
      return glowing(g, [led], "#7dff9a");
    }
    case "aquarium": {
      add(g, rb(1.2, 0.4, 0.45, 0.03), m.woodDark, 0, 0.2, 0);
      const water = emissive(m.water.color.getStyle(), 0.2);
      water.transparent = true;
      water.opacity = 0.75;
      add(g, rb(1.18, 0.4, 0.43, 0.01), water, 0, 0.6, 0, false);
      const fish = [0, 1, 2].map((i) => add(g, sphere(0.03, 8, 6), m.accent, 0, 0.55 + i * 0.08, 0, false));
      const glow = glowSprite(m, 1.2);
      glow.position.set(0, 0.6, 0.2);
      g.add(glow);
      return smart(g, {
        glows: [water],
        sprites: [glow],
        color: "#6fc4ff",
        intensity: 0.8,
        loop: (t) => fish.forEach((f, i) => f.position.set(Math.sin(t * (0.5 + i * 0.2) + i) * 0.45, f.position.y, Math.cos(t * 0.7 + i) * 0.1)),
      });
    }

    // ----- living -----
    case "sofa":
      return still(sofa(m, 2.1, 0.9, 3));
    case "loveseat":
      return still(sofa(m, 1.5, 0.85, 2));
    case "armchair":
      return still(sofa(m, 0.85, 0.85, 1));
    case "sofa_l": {
      const main = sofa(m, 2.5, 0.9, 3);
      main.position.z = -0.4;
      g.add(main);
      add(g, rb(0.85, 0.22, 0.8, 0.05), m.fabric2, 0.825, 0.12, 0.45);
      add(g, rb(0.75, 0.1, 0.7, 0.04), m.fabric, 0.8, 0.27, 0.45);
      return still(g);
    }
    case "sofa_u": {
      const back = sofa(m, 3.0, 0.9, 3);
      back.position.z = -0.65;
      g.add(back);
      for (const s of [-1, 1]) {
        add(g, rb(0.85, 0.22, 1.3, 0.05), m.fabric2, s * 1.075, 0.12, 0.45);
        add(g, rb(0.75, 0.1, 1.2, 0.04), m.fabric, s * 1.05, 0.27, 0.45);
      }
      return still(g);
    }
    case "bean_bag":
      add(g, sphere(0.4, 20, 14), m.fabric, 0, 0.22, 0).scale.set(1, 0.55, 1);
      return still(g);
    case "pouf":
      add(g, cyl(0.24, 0.25, 0.3, 24), m.fabric2, 0, 0.15, 0);
      return still(g);
    case "coffee_table":
      return still(table(m, 1.1, 0.6, 0.3));
    case "coffee_round":
      return still(table(m, 0.8, 0.8, 0.3, true));
    case "side_table":
      return still(table(m, 0.45, 0.45, 0.36, true));
    case "console_table":
      return still(table(m, 1.2, 0.35, 0.55));
    case "sideboard":
      return still(cabinet(m, 1.8, 0.5, 0.45, m.wood, 3));
    case "tv_stand":
      return still(cabinet(m, 1.8, 0.3, 0.45, m.woodDark, 3));
    case "bookshelf": {
      add(g, rb(1.0, 0.95, 0.35, 0.02), m.wood, 0, 0.475, 0);
      const colors = ["#c97b63", "#7d9bb5", "#d8b45a", "#8fae7a", "#a58cc4"];
      for (let row = 0; row < 3; row++)
        for (let i = 0; i < 7; i++)
          add(g, new THREE.BoxGeometry(0.07, 0.2, 0.2), new THREE.MeshStandardMaterial({ color: colors[(row * 3 + i) % colors.length], roughness: 0.8 }), -0.38 + i * 0.12, 0.2 + row * 0.3, 0.08, false);
      return still(g);
    }
    case "shelf_wall": {
      add(g, rb(1.0, 0.03, 0.25, 0.01), m.wood, 0, 0, 0);
      for (let i = 0; i < 4; i++) add(g, new THREE.BoxGeometry(0.06, 0.18, 0.16), i % 2 ? m.accent : m.fabric2, -0.3 + i * 0.09, 0.1, 0, false);
      add(g, cyl(0.05, 0.04, 0.1, 12), m.white, 0.3, 0.06, 0, false);
      return still(g);
    }
    case "wall_cabinets":
      return still(cabinet(m, 2.4, 0.4, 0.35, m.white, 4));
    case "fireplace": {
      add(g, rb(1.4, 0.7, 0.4, 0.03), m.white, 0, 0.35, 0);
      add(g, rb(0.8, 0.4, 0.05, 0.02), m.black, 0, 0.28, 0.18, false);
      const fire = emissive("#331100");
      const flames = [-0.2, 0, 0.2].map((x) => add(g, new THREE.ConeGeometry(0.07, 0.2, 8), fire, x, 0.22, 0.16, false));
      const glow = glowSprite(m, 1.3);
      glow.position.set(0, 0.3, 0.3);
      g.add(glow);
      return smart(g, {
        glows: [fire],
        sprites: [glow],
        color: "#ff7a2a",
        intensity: 2,
        loop: (t) => flames.forEach((f, i) => (f.scale.y = 0.8 + 0.35 * Math.abs(Math.sin(t * 6 + i * 1.7)))),
      });
    }
    case "piano":
      add(g, rb(1.5, 0.75, 0.55, 0.03), m.black, 0, 0.375, -0.05);
      add(g, rb(1.4, 0.04, 0.2, 0.01), m.white, 0, 0.48, 0.28);
      add(g, rb(0.9, 0.05, 0.35, 0.02), m.black, 0, 0.3, 0.6);
      return still(g);
    case "mirror_floor":
      add(g, rb(0.6, 1.0, 0.04, 0.02), m.wood, 0, 0.5, 0);
      add(g, new THREE.PlaneGeometry(0.5, 0.9), mirrorMat(), 0, 0.5, 0.021, false);
      return still(g);
    case "wall_art":
      add(g, rb(1.0, 0.6, 0.03, 0.01), m.woodDark, 0, 0.3, 0);
      add(g, new THREE.PlaneGeometry(0.9, 0.5), new THREE.MeshStandardMaterial({ color: m.accent.color, roughness: 0.9 }), 0, 0.3, 0.016, false);
      add(g, new THREE.CircleGeometry(0.12, 24), m.fabric, -0.15, 0.32, 0.017, false);
      return still(g);
    case "clock_wall":
      add(g, cyl(0.2, 0.2, 0.03, 32), m.white, 0, 0.2, 0).rotation.x = Math.PI / 2;
      add(g, new THREE.BoxGeometry(0.015, 0.14, 0.01), m.black, 0, 0.25, 0.02, false);
      add(g, new THREE.BoxGeometry(0.1, 0.012, 0.01), m.black, 0.04, 0.2, 0.02, false);
      return still(g);
    case "rug":
      add(g, rb(2.2, 0.015, 1.5, 0.007), m.rug, 0, 0.008, 0, false);
      return still(g);
    case "rug_round":
      add(g, cyl(0.9, 0.9, 0.015, 40), m.rug, 0, 0.008, 0, false);
      return still(g);
    case "bath_mat":
      add(g, rb(0.8, 0.012, 0.5, 0.006), m.rug, 0, 0.006, 0, false);
      return still(g);
    case "plant":
      return still(plant(m, 0.25));
    case "plant_tall":
      return still(plant(m, 0.7, m.stone));
    case "cactus":
      add(g, cyl(0.1, 0.08, 0.14, 14), m.wood, 0, 0.07, 0);
      add(g, cyl(0.05, 0.05, 0.3, 12), m.green, 0, 0.29, 0);
      add(g, cyl(0.03, 0.03, 0.12, 10), m.green, 0.07, 0.3, 0).rotation.z = -0.6;
      return still(g);
    case "candle": {
      const flame = emissive("#331100");
      for (const [x, h] of [
        [-0.06, 0.14],
        [0.05, 0.1],
        [0, 0.18],
      ]) {
        add(g, cyl(0.03, 0.03, h, 12), m.white, x, h / 2, x * 0.5);
        add(g, new THREE.ConeGeometry(0.012, 0.035, 8), flame, x, h + 0.02, x * 0.5, false);
      }
      const glow = glowSprite(m, 0.5);
      glow.position.set(0, 0.2, 0);
      g.add(glow);
      return smart(g, { glows: [flame], sprites: [glow], color: "#ffb347", intensity: 2 });
    }
    case "pillar":
      add(g, cyl(0.18, 0.18, env.wallH, 20), m.white, 0, env.wallH / 2, 0);
      return still(g);
    case "stairs": {
      const steps = 10;
      const h = env.wallH;
      for (let i = 0; i < steps; i++) add(g, rb(1.0, (h / steps) * (i + 1), 2.6 / steps, 0.01), m.wood, 0, ((h / steps) * (i + 1)) / 2, 1.3 - (2.6 / steps) * (i + 0.5));
      return still(g);
    }

    // ----- bedroom -----
    case "bed_king":
    case "bed_double":
    case "bed_single":
    case "crib": {
      const w = type === "bed_king" ? 2.0 : type === "bed_double" ? 1.7 : type === "crib" ? 0.7 : 1.0;
      const d = type === "bed_king" ? 2.2 : type === "bed_double" ? 2.1 : type === "crib" ? 1.3 : 2.0;
      add(g, rb(w, 0.22, d, 0.04), m.wood, 0, 0.11, 0);
      add(g, rb(w - 0.08, 0.14, d - 0.12, 0.06), m.white, 0, 0.29, 0.02);
      add(g, rb(w - 0.02, 0.07, d * 0.58, 0.04), m.fabric, 0, 0.37, d * 0.19);
      if (type === "crib") for (let i = 0; i < 9; i++) for (const s of [-1, 1]) add(g, cyl(0.01, 0.01, 0.35, 6), m.wood, s * (w / 2), 0.4, -d / 2 + (d / 8) * i, false);
      else add(g, rb(w, 0.5, 0.08, 0.04), m.fabric2, 0, 0.33, -d / 2 + 0.04);
      const pillows = type === "bed_single" || type === "crib" ? [0] : [-w / 4, w / 4];
      for (const x of pillows) add(g, rb(w / pillows.length - 0.16, 0.09, 0.32, 0.04), m.white, x, 0.41, -d / 2 + 0.3);
      return still(g);
    }
    case "bunk_bed": {
      for (const y of [0, 0.55]) {
        add(g, rb(1.0, 0.08, 2.0, 0.02), m.wood, 0, y + 0.2, 0);
        add(g, rb(0.92, 0.1, 1.9, 0.04), m.white, 0, y + 0.29, 0);
        add(g, rb(0.94, 0.05, 1.1, 0.03), m.fabric, 0, y + 0.35, 0.35);
      }
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(g, rb(0.06, 1.0, 0.06, 0.01), m.wood, sx * 0.47, 0.5, sz * 0.97);
      return still(g);
    }
    case "nightstand":
      return still(cabinet(m, 0.45, 0.36, 0.4, m.wood, 1));
    case "dresser":
      add(g, rb(1.2, 0.5, 0.5, 0.02), m.wood, 0, 0.25, 0);
      for (let i = 0; i < 3; i++) add(g, new THREE.BoxGeometry(1.1, 0.006, 0.01), m.woodDark, 0, 0.12 + i * 0.13, 0.251, false);
      return still(g);
    case "vanity": {
      g.add(table(m, 1.1, 0.5, 0.45));
      add(g, rb(0.6, 0.55, 0.03, 0.02), m.wood, 0, 0.78, -0.22);
      add(g, new THREE.PlaneGeometry(0.52, 0.47), mirrorMat(), 0, 0.78, -0.204, false);
      const st = chair(m);
      st.position.z = 0.45;
      st.rotation.y = Math.PI;
      g.add(st);
      return still(g);
    }
    case "wardrobe":
      return still(cabinet(m, 1.4, 0.95, 0.6, m.white, 2));
    case "wardrobe_big":
      return still(cabinet(m, 2.4, 0.95, 0.6, m.white, 4));
    case "clothes_rack": {
      for (const s of [-1, 1]) add(g, cyl(0.012, 0.012, 0.8, 8), m.metal, s * 0.58, 0.4, 0);
      add(g, cyl(0.01, 0.01, 1.16, 8), m.metal, 0, 0.8, 0).rotation.z = Math.PI / 2;
      const colors = ["#c97b63", "#7d9bb5", "#d8b45a", "#8fae7a", "#a58cc4", "#e7e2da"];
      for (let i = 0; i < 9; i++) add(g, rb(0.04, 0.42, 0.34, 0.015), new THREE.MeshStandardMaterial({ color: colors[i % colors.length], roughness: 1 }), -0.48 + i * 0.12, 0.56, 0, false);
      return still(g);
    }
    case "shoe_rack":
      return still(cabinet(m, 0.9, 0.45, 0.3, m.wood, 2));
    case "bench":
      add(g, rb(1.2, 0.08, 0.4, 0.03), m.fabric, 0, 0.36, 0);
      legs(g, 1.2, 0.4, 0.32, m.woodDark);
      return still(g);

    // ----- kitchen -----
    case "counter":
    case "counter_sink":
    case "counter_corner": {
      const corner = type === "counter_corner";
      const w = type === "counter" ? 2.4 : 1.2;
      add(g, rb(w, 0.58, 0.6, 0.02), m.white, 0, 0.29, corner ? -0.3 : 0);
      add(g, rb(w + 0.02, 0.04, 0.62, 0.01), m.stone, 0, 0.6, corner ? -0.3 : 0);
      if (corner) {
        add(g, rb(0.6, 0.58, 0.6, 0.02), m.white, -0.3, 0.29, 0.3);
        add(g, rb(0.62, 0.04, 0.62, 0.01), m.stone, -0.3, 0.6, 0.3);
      } else add(g, rb(0.5, 0.02, 0.38, 0.01), m.metal, type === "counter" ? -0.6 : 0, 0.615, 0, false);
      if (type === "counter") {
        add(g, rb(0.6, 0.01, 0.45, 0.01), m.black, 0.55, 0.62, 0, false);
        for (const [x, z] of [
          [0.42, -0.1],
          [0.68, -0.1],
          [0.42, 0.12],
          [0.68, 0.12],
        ])
          add(g, new THREE.TorusGeometry(0.06, 0.006, 6, 20), m.metal, x, 0.627, z, false).rotation.x = Math.PI / 2;
      }
      return still(g);
    }
    case "island":
      add(g, rb(1.5, 0.58, 0.8, 0.02), m.white, 0, 0.29, 0);
      add(g, rb(1.6, 0.04, 0.9, 0.01), m.stone, 0, 0.6, 0);
      return still(g);
    case "stove": {
      add(g, rb(0.75, 0.6, 0.65, 0.02), m.white, 0, 0.3, 0);
      add(g, rb(0.75, 0.02, 0.65, 0.01), m.black, 0, 0.61, 0);
      const fire = emissive("#222222");
      for (const [x, z] of [
        [-0.17, -0.15],
        [0.17, -0.15],
        [-0.17, 0.15],
        [0.17, 0.15],
      ])
        add(g, new THREE.TorusGeometry(0.08, 0.008, 6, 24), fire, x, 0.625, z, false).rotation.x = Math.PI / 2;
      add(g, new THREE.BoxGeometry(0.6, 0.3, 0.01), m.glass, 0, 0.3, 0.326, false);
      return glowing(g, [fire], "#ff6a2a");
    }
    case "oven_tall": {
      add(g, rb(0.65, 0.95, 0.62, 0.02), m.white, 0, 0.475, 0);
      const win = emissive("#151515", 0.2);
      add(g, new THREE.PlaneGeometry(0.5, 0.3), win, 0, 0.45, 0.311, false);
      add(g, new THREE.PlaneGeometry(0.5, 0.22), m.black, 0, 0.75, 0.311, false);
      const glow = glowSprite(m, 0.7);
      glow.position.set(0, 0.45, 0.4);
      return glowing(g, [win], "#ff9a3a", glow);
    }
    case "microwave": {
      add(g, rb(0.5, 0.28, 0.38, 0.02), m.white, 0, 0.14, 0);
      const win = emissive("#151515", 0.2);
      add(g, new THREE.PlaneGeometry(0.3, 0.18), win, -0.05, 0.14, 0.191, false);
      return glowing(g, [win], "#ffd27a");
    }
    case "toaster": {
      add(g, rb(0.28, 0.18, 0.16, 0.04), m.metal, 0, 0.09, 0);
      const slots = emissive("#222222");
      for (const x of [-0.05, 0.05]) add(g, new THREE.BoxGeometry(0.03, 0.005, 0.11), slots, x, 0.181, 0, false);
      return glowing(g, [slots], "#ff6a2a");
    }
    case "fridge":
    case "fridge_double": {
      const w = type === "fridge" ? 0.75 : 0.95;
      add(g, rb(w, 0.98, 0.7, 0.04), m.white, 0, 0.49, 0);
      if (type === "fridge") {
        add(g, new THREE.BoxGeometry(0.7, 0.008, 0.01), m.metal, 0, 0.66, 0.351, false);
        add(g, rb(0.02, 0.25, 0.03, 0.008), m.metal, 0.28, 0.45, 0.36, false);
      } else {
        add(g, new THREE.BoxGeometry(0.008, 0.94, 0.01), m.metal, 0, 0.49, 0.351, false);
        for (const x of [-0.04, 0.04]) add(g, rb(0.02, 0.25, 0.03, 0.008), m.metal, x, 0.45, 0.36, false);
      }
      return still(g);
    }
    case "wine_fridge": {
      add(g, rb(0.6, 0.6, 0.6, 0.03), m.black, 0, 0.3, 0);
      const inner = emissive("#222233", 0.2);
      add(g, new THREE.PlaneGeometry(0.48, 0.5), inner, 0, 0.3, 0.301, false);
      return glowing(g, [inner], "#7fb6ff");
    }
    case "pantry":
      return still(cabinet(m, 0.9, 0.98, 0.6, m.white, 2));
    case "trash":
      add(g, cyl(0.15, 0.13, 0.4, 20), m.metal, 0, 0.2, 0);
      add(g, cyl(0.155, 0.155, 0.03, 20), m.black, 0, 0.41, 0);
      return still(g);
    case "dining":
      g.add(table(m, 1.5, 0.85, 0.47));
      seatsAround(g, m, 1.5, 0.85, 3);
      return still(g);
    case "dining_4":
      g.add(table(m, 1.1, 0.8, 0.47));
      seatsAround(g, m, 1.1, 0.8, 2);
      return still(g);
    case "table_round":
    case "outdoor_table": {
      const outdoor = type === "outdoor_table";
      g.add(table(m, 1.0, 1.0, 0.47, true, outdoor ? m.white : m.wood));
      for (let i = 0; i < 4; i++) {
        const c = chair(m, outdoor ? m.white : m.fabric);
        const a = (i / 4) * Math.PI * 2 + (outdoor ? Math.PI / 4 : 0);
        c.position.set(Math.sin(a) * 0.65, 0, Math.cos(a) * 0.65);
        c.rotation.y = a + Math.PI;
        g.add(c);
      }
      return still(g);
    }
    case "bar_counter":
      add(g, rb(1.8, 0.72, 0.4, 0.02), m.woodDark, 0, 0.36, 0.05);
      add(g, rb(1.85, 0.04, 0.5, 0.01), m.stone, 0, 0.74, 0);
      return still(g);
    case "stool":
      add(g, cyl(0.17, 0.17, 0.05, 20), m.fabric, 0, 0.46, 0);
      add(g, cyl(0.02, 0.02, 0.44, 8), m.metal, 0, 0.22, 0);
      add(g, cyl(0.15, 0.15, 0.02, 20), m.metal, 0, 0.01, 0);
      return still(g);
    case "chair":
      return still(chair(m));

    // ----- bathroom -----
    case "toilet":
      add(g, rb(0.36, 0.26, 0.46, 0.08), m.white, 0, 0.13, 0.08);
      add(g, rb(0.4, 0.32, 0.16, 0.03), m.white, 0, 0.32, -0.26);
      return still(g);
    case "basin":
    case "vanity_double": {
      const w = type === "basin" ? 0.7 : 1.4;
      add(g, rb(w, 0.5, 0.45, 0.02), m.wood, 0, 0.25, 0);
      for (const x of type === "basin" ? [0] : [-0.35, 0.35]) {
        add(g, rb(0.5, 0.06, 0.34, 0.05), m.white, x, 0.53, 0.02);
        add(g, cyl(0.012, 0.012, 0.12, 8), m.metal, x, 0.6, -0.16, false);
      }
      return still(g);
    }
    case "bathtub":
      add(g, rb(1.7, 0.4, 0.78, 0.12), m.white, 0, 0.2, 0);
      add(g, rb(1.5, 0.02, 0.6, 0.1), m.water, 0, 0.36, 0, false);
      return still(g);
    case "jacuzzi": {
      add(g, cyl(0.8, 0.8, 0.42, 40), m.white, 0, 0.21, 0);
      const water = emissive(m.water.color.getStyle(), 0.2);
      add(g, cyl(0.7, 0.7, 0.02, 40), water, 0, 0.4, 0, false);
      const bubbles = Array.from({ length: 10 }, (_, i) => add(g, sphere(0.03, 8, 6), m.white, Math.cos(i) * 0.5, 0.41, Math.sin(i * 1.3) * 0.5, false));
      return smart(g, {
        glows: [water],
        color: "#6fc4ff",
        intensity: 0.7,
        loop: (t) => bubbles.forEach((b, i) => b.scale.setScalar(0.5 + 0.6 * Math.abs(Math.sin(t * 5 + i)))),
      });
    }
    case "shower":
      add(g, rb(0.95, 0.04, 0.95, 0.02), m.white, 0, 0.02, 0);
      add(g, new THREE.BoxGeometry(0.95, 0.95, 0.01), m.glass, 0, 0.5, 0.47, false);
      add(g, new THREE.BoxGeometry(0.01, 0.95, 0.95), m.glass, 0.47, 0.5, 0, false);
      add(g, cyl(0.08, 0.08, 0.01, 16), m.metal, -0.3, 0.92, -0.3, false);
      return still(g);
    case "mirror_wall": {
      add(g, rb(0.8, 0.6, 0.03, 0.02), m.white, 0, 0.3, 0);
      add(g, new THREE.PlaneGeometry(0.72, 0.52), mirrorMat(), 0, 0.3, 0.016, false);
      const light = emissive("#cccccc");
      add(g, new THREE.BoxGeometry(0.6, 0.02, 0.02), light, 0, 0.62, 0.02, false);
      return glowing(g, [light], "#fff2d8");
    }
    case "towel_rail": {
      const hot = emissive(m.metal.color.getStyle(), 0.35);
      for (const s of [-1, 1]) add(g, cyl(0.012, 0.012, 0.6, 8), hot, s * 0.28, 0.3, 0, false);
      for (let i = 0; i < 6; i++) add(g, cyl(0.008, 0.008, 0.56, 8), hot, 0, 0.05 + i * 0.1, 0, false).rotation.z = Math.PI / 2;
      add(g, rb(0.4, 0.3, 0.03, 0.01), m.fabric, 0.05, 0.35, 0.02, false);
      return glowing(g, [hot], "#ff8a4a");
    }
    case "laundry_basket":
      add(g, cyl(0.2, 0.17, 0.45, 20), m.wood, 0, 0.225, 0);
      add(g, sphere(0.16, 12, 8), m.white, 0, 0.42, 0).scale.y = 0.4;
      return still(g);

    // ----- office -----
    case "desk":
      add(g, rb(1.3, 0.04, 0.65, 0.02), m.wood, 0, 0.52, 0);
      for (const s of [-1, 1]) add(g, rb(0.04, 0.5, 0.6, 0.01), m.metal, s * 0.6, 0.25, 0);
      return still(g);
    case "desk_l":
      add(g, rb(1.6, 0.04, 0.65, 0.02), m.wood, 0, 0.52, -0.475);
      add(g, rb(0.65, 0.04, 0.95, 0.02), m.wood, -0.475, 0.52, 0.325);
      add(g, rb(0.04, 0.5, 0.6, 0.01), m.metal, 0.75, 0.25, -0.475);
      add(g, rb(0.6, 0.5, 0.04, 0.01), m.metal, -0.475, 0.25, 0.75);
      return still(g);
    case "office_chair":
      add(g, rb(0.5, 0.08, 0.5, 0.03), m.black, 0, 0.42, 0);
      add(g, rb(0.48, 0.5, 0.06, 0.03), m.black, 0, 0.72, -0.22);
      add(g, cyl(0.025, 0.025, 0.35, 8), m.metal, 0, 0.22, 0);
      for (let i = 0; i < 5; i++) add(g, rb(0.28, 0.025, 0.04, 0.01), m.metal, 0, 0.04, 0, false).rotation.y = (i / 5) * Math.PI * 2;
      return still(g);
    case "monitor": {
      add(g, rb(0.2, 0.015, 0.14, 0.005), m.black, 0, 0.008, 0);
      add(g, rb(0.03, 0.18, 0.02, 0.005), m.black, 0, 0.1, -0.03);
      return screenReact(g, screenPanel(g, 0.56, 0.32, 0, 0.32, -0.02, m.black), undefined, "#9fc0ff");
    }
    case "laptop": {
      add(g, rb(0.34, 0.015, 0.24, 0.006), m.metal, 0, 0.008, 0);
      const lid = new THREE.Group();
      lid.position.set(0, 0.015, -0.12);
      lid.rotation.x = -0.35;
      g.add(lid);
      add(lid, rb(0.34, 0.22, 0.01, 0.006), m.metal, 0, 0.11, 0);
      const scr = emissive("#0b0b10", 0.2);
      add(lid, new THREE.PlaneGeometry(0.3, 0.18), scr, 0, 0.11, 0.006, false);
      return screenReact(g, scr);
    }
    case "printer": {
      add(g, rb(0.45, 0.2, 0.38, 0.03), m.white, 0, 0.1, 0);
      add(g, new THREE.BoxGeometry(0.3, 0.01, 0.1), m.fabric, 0, 0.21, 0.12, false);
      const led = emissive("#333333");
      add(g, sphere(0.008, 6, 6), led, 0.18, 0.2, 0.17, false);
      return glowing(g, [led], "#7dff9a");
    }
    case "server_rack": {
      add(g, rb(0.6, 0.98, 0.8, 0.02), m.black, 0, 0.49, 0);
      const leds = Array.from({ length: 6 }, (_, i) => {
        const l = emissive("#222222");
        add(g, new THREE.BoxGeometry(0.4, 0.012, 0.005), l, 0, 0.15 + i * 0.13, 0.401, false);
        return l;
      });
      return smart(g, { glows: leds, color: "#7dff9a", intensity: 1.6, loop: (t) => leds.forEach((l, i) => (l.emissiveIntensity = Math.sin(t * 7 + i * 1.3) > -0.3 ? 1.6 : 0.2)) });
    }
    case "game_console": {
      add(g, rb(0.28, 0.06, 0.18, 0.02), m.white, 0, 0.03, 0);
      const strip = emissive("#222222");
      add(g, new THREE.BoxGeometry(0.2, 0.004, 0.004), strip, 0, 0.061, 0.06, false);
      return glowing(g, [strip], "#7fb6ff");
    }
    case "filing_cabinet":
      add(g, rb(0.45, 0.7, 0.6, 0.02), m.metal, 0, 0.35, 0);
      for (let i = 0; i < 3; i++) add(g, new THREE.BoxGeometry(0.16, 0.02, 0.02), m.black, 0, 0.15 + i * 0.22, 0.31, false);
      return still(g);

    // ----- outdoor -----
    case "outdoor_sofa":
      return still(sofa(m, 2.0, 0.85, 3, m.white, m.woodDark));
    case "lounger": {
      add(g, rb(0.65, 0.08, 1.9, 0.03), m.wood, 0, 0.18, 0.05);
      add(g, rb(0.6, 0.06, 0.6, 0.03), m.white, 0, 0.36, -0.72).rotation.x = -0.6;
      add(g, rb(0.6, 0.06, 1.2, 0.03), m.white, 0, 0.25, 0.25);
      legs(g, 0.65, 1.9, 0.16, m.woodDark, 0.05);
      return still(g);
    }
    case "parasol":
      add(g, cyl(0.2, 0.22, 0.05, 20), m.stone, 0, 0.025, 0);
      add(g, cyl(0.02, 0.02, 1.3, 8), m.metal, 0, 0.65, 0);
      add(g, new THREE.ConeGeometry(1.1, 0.35, 8, 1, true), m.white, 0, 1.25, 0);
      return still(g);
    case "bbq": {
      add(g, rb(1.0, 0.5, 0.6, 0.03), m.black, 0, 0.45, 0);
      legs(g, 0.95, 0.55, 0.22, m.metal, 0.06);
      const coals = emissive("#221100");
      add(g, new THREE.BoxGeometry(0.8, 0.01, 0.45), coals, 0, 0.71, 0, false);
      const glow = glowSprite(m, 1.1);
      glow.position.set(0, 0.8, 0);
      return glowing(g, [coals], "#ff5a1a", glow);
    }
    case "pool": {
      add(g, rb(4.0, 0.1, 2.2, 0.04), m.white, 0, 0.05, 0);
      const water = emissive(m.water.color.getStyle(), 0.15);
      water.transparent = true;
      water.opacity = 0.9;
      const surf = add(g, new THREE.PlaneGeometry(3.7, 1.9, 24, 12), water, 0, 0.11, 0, false);
      surf.rotation.x = -Math.PI / 2;
      const pos = surf.geometry.attributes.position as THREE.BufferAttribute;
      const base = Float32Array.from(pos.array as Float32Array);
      return smart(g, {
        glows: [water],
        color: "#6fc4ff",
        intensity: 0.6,
        loop: (t) => {
          for (let i = 0; i < pos.count; i++) pos.setZ(i, base[i * 3 + 2] + 0.015 * Math.sin(t * 2 + base[i * 3] * 3 + base[i * 3 + 1] * 2));
          pos.needsUpdate = true;
        },
      });
    }
    case "tree":
      return still(tree(m, 1.6));
    case "pine":
      return still(tree(m, 1.6, true));
    case "hedge":
      add(g, rb(2.0, 0.6, 0.6, 0.2), m.green, 0, 0.3, 0);
      return still(g);
    case "flower_bed": {
      add(g, rb(1.5, 0.2, 0.6, 0.03), m.woodDark, 0, 0.1, 0);
      const colors = ["#e88aa0", "#f2c84b", "#a58cc4", "#ffffff"];
      for (let i = 0; i < 12; i++) add(g, sphere(0.06, 8, 6), new THREE.MeshStandardMaterial({ color: colors[i % 4], roughness: 0.9 }), -0.6 + (i % 6) * 0.24, 0.25, i < 6 ? -0.12 : 0.12, false);
      const drops = Array.from({ length: 6 }, () => {
        const s = glowSprite(m, 0.15);
        g.add(s);
        return s;
      });
      return smart(g, {
        sprites: drops,
        color: "#9fd3ff",
        loop: (t) => drops.forEach((d, i) => d.position.set(-0.6 + i * 0.24, 0.6 - ((t * 1.5 + i * 0.3) % 1) * 0.4, 0)),
      });
    }
    case "fence":
      for (let i = 0; i < 11; i++) add(g, rb(0.08, 0.7, 0.04, 0.01), m.wood, -0.95 + i * 0.19, 0.35, 0);
      for (const y of [0.2, 0.55]) add(g, new THREE.BoxGeometry(2.0, 0.05, 0.03), m.woodDark, 0, y, -0.035, false);
      return still(g);
    case "car": {
      add(g, rb(1.8, 0.45, 4.3, 0.18), m.accent, 0, 0.38, 0);
      add(g, rb(1.6, 0.4, 2.2, 0.16), m.accent, 0, 0.75, -0.2);
      add(g, rb(1.62, 0.3, 2.0, 0.1), m.glass, 0, 0.78, -0.2, false);
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(g, cyl(0.3, 0.3, 0.22, 20), m.black, sx * 0.85, 0.3, sz * 1.4).rotation.z = Math.PI / 2;
      const lights = emissive("#333333");
      for (const sx of [-0.6, 0.6]) add(g, rb(0.3, 0.08, 0.02, 0.02), lights, sx, 0.5, 2.15, false);
      return smart(g, { glows: [lights], color: "#ffffff", intensity: 1.4, isOn: (s) => s?.state === "home" || s?.state === "on" || running(s) });
    }
    case "bicycle":
      for (const z of [-0.55, 0.55]) add(g, new THREE.TorusGeometry(0.3, 0.025, 8, 28), m.black, 0, 0.32, z).rotation.y = Math.PI / 2;
      add(g, cyl(0.015, 0.015, 1.1, 8), m.accent, 0, 0.45, 0).rotation.x = Math.PI / 2;
      add(g, cyl(0.015, 0.015, 0.5, 8), m.accent, 0, 0.55, 0.25);
      add(g, rb(0.08, 0.04, 0.2, 0.02), m.black, 0, 0.8, -0.15);
      return still(g);
    default:
      add(g, rb(0.5, 0.4, 0.5, 0.05), m.fabric2, 0, 0.2, 0);
      return still(g);
  }
}
