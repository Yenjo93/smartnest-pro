// More furniture, built from the same soft blocks as furniture.ts. Every piece is centred on its footprint at
// y = 0 with its front facing +z; smart ones react to their linked device like the rest.
import * as THREE from "three";
import type { HassEntity } from "../types";
import { isOn } from "../ha";
import {
  add,
  cabinet,
  chair,
  coverPos,
  cyl,
  emissive,
  glowSprite,
  glowing,
  legs,
  mirrorMat,
  rb,
  smart,
  sofa,
  sphere,
  still,
  table,
  type BuildEnv,
  type Mats,
  type Piece,
} from "./furniture";

/** A drum that turns while the machine runs (washer-dryer stack uses two). */
function drum(m: Mats, g: THREE.Group, y: number) {
  const d = new THREE.Group();
  d.position.set(0, y, 0.311);
  g.add(d);
  add(d, new THREE.TorusGeometry(0.15, 0.022, 10, 28), m.metal, 0, 0, 0, false);
  add(d, new THREE.CircleGeometry(0.13, 28), m.glass, 0, 0, -0.002, false);
  add(d, rb(0.04, 0.11, 0.01, 0.004), m.fabric2, 0.03, 0, 0.002, false);
  return d;
}

function flames(m: Mats, g: THREE.Group, y: number, spread: number, n = 4) {
  const fire = emissive("#331100");
  const cones = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return add(g, new THREE.ConeGeometry(0.07, 0.24, 8), fire, Math.cos(a) * spread, y, Math.sin(a) * spread, false);
  });
  const glow = glowSprite(m, 1.4);
  glow.position.set(0, y + 0.15, 0);
  g.add(glow);
  return smart(g, {
    glows: [fire],
    sprites: [glow],
    color: "#ff7a2a",
    intensity: 2,
    loop: (t) => cones.forEach((c, i) => (c.scale.y = 0.75 + 0.4 * Math.abs(Math.sin(t * 6 + i * 1.9)))),
  });
}

export function buildExtra(type: string, m: Mats, env: BuildEnv): Piece | undefined {
  const g = new THREE.Group();
  switch (type) {
    // ----- kitchen -----
    case "counter_plain":
      add(g, rb(2.4, 0.58, 0.6, 0.02), m.white, 0, 0.29, 0);
      add(g, rb(2.42, 0.04, 0.62, 0.01), m.stone, 0, 0.6, 0);
      for (let i = 1; i < 4; i++) add(g, new THREE.BoxGeometry(0.008, 0.5, 0.01), m.metal, -1.2 + i * 0.6, 0.29, 0.301, false);
      return still(g);
    case "base_cabinet":
      add(g, rb(0.6, 0.58, 0.6, 0.02), m.white, 0, 0.29, 0);
      add(g, rb(0.62, 0.04, 0.62, 0.01), m.stone, 0, 0.6, 0);
      add(g, new THREE.BoxGeometry(0.15, 0.015, 0.02), m.metal, 0, 0.5, 0.31, false);
      return still(g);
    case "upper_cabinet":
      return still(cabinet(m, 0.8, 0.4, 0.35, m.white, 2));
    case "range_hood": {
      add(g, rb(0.9, 0.12, 0.5, 0.02), m.metal, 0, 0.06, 0);
      add(g, rb(0.3, 0.35, 0.25, 0.02), m.metal, 0, 0.29, -0.1);
      const lamp = emissive("#333333");
      for (const x of [-0.25, 0.25]) add(g, cyl(0.04, 0.04, 0.01, 12), lamp, x, -0.002, 0.05, false);
      const glow = glowSprite(m, 0.9);
      glow.position.set(0, -0.1, 0.05);
      return glowing(g, [lamp], "#ffe6b0", glow);
    }
    case "breakfast_table": {
      g.add(table(m, 0.8, 0.6, 0.47));
      for (const s of [-1, 1]) {
        const c = chair(m);
        c.position.set(0, 0, s * 0.5);
        c.rotation.y = s > 0 ? Math.PI : 0;
        g.add(c);
      }
      return still(g);
    }
    case "bar_table":
      add(g, cyl(0.35, 0.35, 0.04, 28), m.wood, 0, 0.72, 0);
      add(g, cyl(0.03, 0.03, 0.7, 8), m.metal, 0, 0.36, 0);
      add(g, cyl(0.2, 0.22, 0.02, 20), m.metal, 0, 0.01, 0);
      return still(g);
    case "dining_bench":
      add(g, rb(1.4, 0.06, 0.38, 0.02), m.wood, 0, 0.3, 0);
      legs(g, 1.4, 0.38, 0.28, m.woodDark, 0.08);
      return still(g);
    case "island_seats": {
      add(g, rb(1.6, 0.58, 0.8, 0.02), m.white, 0, 0.29, -0.3);
      add(g, rb(1.7, 0.04, 1.0, 0.01), m.stone, 0, 0.6, -0.2);
      for (const x of [-0.5, 0, 0.5]) {
        add(g, cyl(0.15, 0.15, 0.04, 18), m.fabric, x, 0.46, 0.45);
        add(g, cyl(0.018, 0.018, 0.44, 8), m.metal, x, 0.22, 0.45);
      }
      return still(g);
    }
    case "water_dispenser": {
      add(g, rb(0.32, 0.6, 0.32, 0.03), m.white, 0, 0.3, 0);
      const bottle = emissive("#bfe3ff", 0.15);
      bottle.transparent = true;
      bottle.opacity = 0.8;
      add(g, cyl(0.12, 0.12, 0.28, 20), bottle, 0, 0.74, 0);
      return glowing(g, [bottle], "#7fc4ff");
    }
    case "fruit_bowl":
      add(g, new THREE.SphereGeometry(0.13, 20, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), m.wood, 0, 0.1, 0);
      for (const [x, z, c] of [
        [0, 0, "#f2c84b"],
        [0.05, 0.03, "#e8664a"],
        [-0.05, 0.02, "#8fc75c"],
        [0.01, -0.05, "#f29a4b"],
      ] as [number, number, string][])
        add(g, sphere(0.04, 10, 8), new THREE.MeshStandardMaterial({ color: c, roughness: 0.7 }), x, 0.09, z, false);
      return still(g);

    // ----- living -----
    case "recliner": {
      const s = sofa(m, 0.9, 0.95, 1);
      g.add(s);
      add(g, rb(0.6, 0.06, 0.35, 0.03), m.fabric2, 0, 0.2, 0.62).rotation.x = -0.3;
      return still(g);
    }
    case "chaise":
      add(g, rb(0.7, 0.22, 1.6, 0.06), m.fabric2, 0, 0.12, 0);
      add(g, rb(0.62, 0.1, 1.5, 0.05), m.fabric, 0, 0.27, 0.03);
      add(g, rb(0.7, 0.35, 0.25, 0.08), m.fabric2, 0, 0.4, -0.68).rotation.x = -0.25;
      return still(g);
    case "ottoman_round":
      add(g, cyl(0.3, 0.3, 0.32, 28), m.fabric2, 0, 0.16, 0);
      return still(g);
    case "floor_cushion":
      add(g, rb(0.6, 0.12, 0.6, 0.06), m.fabric, 0, 0.06, 0);
      return still(g);
    case "bookcase_tall": {
      const h = Math.max(0.9, env.wallH * 0.92);
      add(g, rb(0.9, h, 0.35, 0.02), m.wood, 0, h / 2, 0);
      const colors = ["#c97b63", "#7d9bb5", "#d8b45a", "#8fae7a", "#a58cc4"];
      const rows = Math.max(3, Math.floor(h / 0.3));
      for (let r = 0; r < rows; r++)
        for (let i = 0; i < 6; i++)
          add(g, new THREE.BoxGeometry(0.07, 0.2, 0.2), new THREE.MeshStandardMaterial({ color: colors[(r + i) % 5], roughness: 0.8 }), -0.32 + i * 0.12, 0.15 + r * (h / rows), 0.08, false);
      return still(g);
    }
    case "vitrine": {
      add(g, rb(0.9, 0.95, 0.45, 0.02), m.woodDark, 0, 0.475, 0);
      add(g, new THREE.BoxGeometry(0.82, 0.85, 0.01), m.glass, 0, 0.5, 0.226, false);
      const light = emissive("#333333");
      add(g, new THREE.BoxGeometry(0.8, 0.01, 0.35), light, 0, 0.92, 0, false);
      for (const y of [0.35, 0.62]) add(g, new THREE.BoxGeometry(0.82, 0.01, 0.38), m.glass, 0, y, 0, false);
      const glow = glowSprite(m, 0.9);
      glow.position.set(0, 0.6, 0.2);
      return glowing(g, [light], "#fff2d8", glow);
    }
    case "room_divider":
      for (let i = 0; i < 4; i++) add(g, rb(0.34, 0.9, 0.03, 0.01), m.wood, -0.53 + i * 0.355, 0.45, (i % 2) * 0.05 - 0.025).rotation.y = (i % 2 ? 1 : -1) * 0.25;
      return still(g);
    case "floor_vase":
      add(g, cyl(0.1, 0.13, 0.5, 20), m.stone, 0, 0.25, 0);
      for (let i = 0; i < 5; i++) add(g, cyl(0.004, 0.004, 0.45, 4), m.woodDark, Math.sin(i) * 0.04, 0.7, Math.cos(i) * 0.04, false).rotation.z = Math.sin(i * 2) * 0.3;
      return still(g);
    case "bar_cart":
      for (const y of [0.12, 0.5]) add(g, rb(0.7, 0.02, 0.42, 0.01), m.glass, 0, y, 0, false);
      legs(g, 0.7, 0.42, 0.55, m.metal, 0.02, 0.01);
      for (let i = 0; i < 4; i++) add(g, cyl(0.035, 0.035, 0.26, 10), m.green, -0.24 + i * 0.16, 0.64, 0, false);
      return still(g);
    case "massage_chair":
      add(g, rb(0.8, 0.35, 1.0, 0.12), m.black, 0, 0.2, 0.1);
      add(g, rb(0.75, 0.7, 0.3, 0.14), m.black, 0, 0.6, -0.4).rotation.x = -0.3;
      for (const s of [-1, 1]) add(g, rb(0.14, 0.3, 0.7, 0.06), m.fabric2, s * 0.38, 0.45, 0);
      return still(g);
    case "rocking_chair":
      for (const s of [-1, 1]) add(g, new THREE.TorusGeometry(0.5, 0.02, 6, 24, Math.PI / 2.4), m.woodDark, s * 0.28, 0.52, 0).rotation.set(0, Math.PI / 2, Math.PI * 1.29);
      add(g, rb(0.56, 0.05, 0.5, 0.02), m.wood, 0, 0.3, 0);
      add(g, rb(0.56, 0.5, 0.05, 0.02), m.wood, 0, 0.56, -0.25).rotation.x = -0.2;
      return still(g);
    case "mirror_round":
      add(g, new THREE.TorusGeometry(0.29, 0.02, 8, 36), m.woodDark, 0, 0.3, 0);
      add(g, new THREE.CircleGeometry(0.28, 36), mirrorMat(), 0, 0.3, 0.005, false);
      return still(g);
    case "rug_runner":
      add(g, rb(2.5, 0.015, 0.8, 0.007), m.rug, 0, 0.008, 0, false);
      return still(g);
    case "record_player": {
      add(g, rb(0.45, 0.08, 0.35, 0.02), m.wood, 0, 0.04, 0);
      const plate = new THREE.Group();
      plate.position.set(-0.04, 0.085, 0);
      g.add(plate);
      add(plate, cyl(0.14, 0.14, 0.01, 32), m.black, 0, 0, 0, false);
      add(plate, cyl(0.04, 0.04, 0.012, 16), m.accent, 0, 0, 0, false);
      add(g, rb(0.015, 0.01, 0.18, 0.004), m.metal, 0.15, 0.1, -0.02, false).rotation.y = 0.4;
      return smart(g, { spin: [{ o: plate, axis: "y", speed: 3.5 }], isOn: (s) => s?.state === "playing" });
    }

    // ----- bedroom -----
    case "wardrobe_sliding": {
      add(g, rb(2.0, 0.95, 0.65, 0.02), m.white, 0, 0.475, 0);
      add(g, new THREE.PlaneGeometry(0.95, 0.88), mirrorMat(), -0.48, 0.48, 0.326, false);
      add(g, new THREE.BoxGeometry(0.95, 0.88, 0.01), m.wood, 0.48, 0.48, 0.325, false);
      return still(g);
    }
    case "chest":
      add(g, rb(0.9, 0.42, 0.45, 0.04), m.wood, 0, 0.21, 0);
      add(g, new THREE.BoxGeometry(0.92, 0.02, 0.47), m.woodDark, 0, 0.3, 0, false);
      return still(g);
    case "toy_box": {
      add(g, rb(0.7, 0.38, 0.4, 0.05), m.accent, 0, 0.19, 0);
      const colors = ["#e8664a", "#f2c84b", "#7d9bb5", "#8fc75c"];
      for (let i = 0; i < 4; i++) add(g, sphere(0.06, 10, 8), new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.6 }), -0.2 + i * 0.13, 0.42, 0, false);
      return still(g);
    }
    case "changing_table":
      g.add(cabinet(m, 0.9, 0.6, 0.55, m.white, 2));
      add(g, rb(0.8, 0.06, 0.5, 0.03), m.fabric, 0, 0.64, 0);
      return still(g);
    case "kids_bed":
      add(g, rb(0.9, 0.2, 1.7, 0.06), m.accent, 0, 0.1, 0);
      add(g, rb(0.82, 0.12, 1.6, 0.05), m.white, 0, 0.26, 0);
      add(g, rb(0.84, 0.06, 1.0, 0.04), m.fabric, 0, 0.34, 0.3);
      for (const s of [-1, 1]) add(g, rb(0.06, 0.25, 0.7, 0.03), m.accent, s * 0.45, 0.35, -0.3);
      add(g, rb(0.45, 0.08, 0.28, 0.04), m.white, 0, 0.36, -0.6);
      return still(g);
    case "nightstand_round":
      return still(table(m, 0.45, 0.45, 0.4, true));

    // ----- bath -----
    case "washer_dryer": {
      add(g, rb(0.6, 1.0, 0.62, 0.03), m.white, 0, 0.5, 0);
      add(g, new THREE.BoxGeometry(0.58, 0.01, 0.01), m.metal, 0, 0.5, 0.311, false);
      const d1 = drum(m, g, 0.26);
      const d2 = drum(m, g, 0.74);
      return smart(g, {
        spin: [
          { o: d1, axis: "z", speed: 9 },
          { o: d2, axis: "z", speed: -7 },
        ],
      });
    }
    case "bidet":
      add(g, rb(0.36, 0.3, 0.5, 0.08), m.white, 0, 0.15, 0.03);
      add(g, cyl(0.01, 0.01, 0.06, 6), m.metal, 0, 0.32, -0.18, false);
      return still(g);
    case "bath_cabinet":
      return still(cabinet(m, 0.4, 0.95, 0.35, m.white, 1));

    // ----- office -----
    case "standing_desk":
      add(g, rb(1.4, 0.04, 0.7, 0.02), m.wood, 0, 0.72, 0);
      for (const s of [-1, 1]) {
        add(g, rb(0.06, 0.7, 0.06, 0.01), m.black, s * 0.6, 0.36, 0);
        add(g, rb(0.06, 0.03, 0.6, 0.01), m.black, s * 0.6, 0.015, 0);
      }
      return still(g);
    case "whiteboard":
      add(g, rb(1.2, 0.8, 0.03, 0.01), m.metal, 0, 0.4, 0);
      add(g, new THREE.PlaneGeometry(1.14, 0.74), new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.2 }), 0, 0.4, 0.016, false);
      return still(g);
    case "meeting_table": {
      g.add(table(m, 2.2, 1.0, 0.47, false, m.white));
      for (let i = 0; i < 3; i++)
        for (const s of [-1, 1]) {
          const c = chair(m, m.black);
          c.position.set(-0.7 + i * 0.7, 0, s * 0.72);
          c.rotation.y = s > 0 ? Math.PI : 0;
          g.add(c);
        }
      return still(g);
    }
    case "office_cabinet":
      return still(cabinet(m, 0.8, 0.5, 0.45, m.metal, 2));
    case "bookshelf_ladder":
      for (let i = 0; i < 4; i++) add(g, rb(0.8 - i * 0.1, 0.02, 0.38 - i * 0.06, 0.01), m.wood, 0, 0.18 + i * 0.24, -i * 0.03);
      for (const s of [-1, 1]) add(g, rb(0.03, 1.0, 0.03, 0.01), m.woodDark, s * 0.38, 0.5, 0.08).rotation.x = -0.15;
      return still(g);

    // ----- outdoor -----
    case "garden_bench":
      add(g, rb(1.4, 0.06, 0.45, 0.02), m.wood, 0, 0.33, 0.04);
      add(g, rb(1.4, 0.32, 0.05, 0.02), m.wood, 0, 0.55, -0.2).rotation.x = -0.15;
      for (const s of [-1, 1]) add(g, rb(0.05, 0.45, 0.45, 0.01), m.black, s * 0.66, 0.25, 0);
      return still(g);
    case "fire_pit":
      add(g, cyl(0.5, 0.45, 0.3, 28), m.stone, 0, 0.15, 0);
      add(g, cyl(0.42, 0.42, 0.02, 28), m.black, 0, 0.31, 0, false);
      return flames(m, g, 0.42, 0.12, 5);
    case "trampoline":
      add(g, new THREE.TorusGeometry(1.15, 0.05, 8, 40), m.accent, 0, 0.45, 0).rotation.x = Math.PI / 2;
      add(g, cyl(1.1, 1.1, 0.01, 40), m.black, 0, 0.44, 0, false);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        add(g, cyl(0.02, 0.02, 0.44, 6), m.metal, Math.cos(a) * 1.15, 0.22, Math.sin(a) * 1.15);
      }
      return still(g);
    case "garden_swing": {
      for (const s of [-1, 1]) {
        add(g, cyl(0.03, 0.03, 1.3, 8), m.woodDark, s * 0.85, 0.6, -0.35).rotation.x = 0.25;
        add(g, cyl(0.03, 0.03, 1.3, 8), m.woodDark, s * 0.85, 0.6, 0.35).rotation.x = -0.25;
      }
      add(g, cyl(0.03, 0.03, 1.8, 8), m.woodDark, 0, 1.22, 0).rotation.z = Math.PI / 2;
      const seat = new THREE.Group();
      seat.position.set(0, 1.2, 0);
      g.add(seat);
      for (const s of [-0.5, 0.5]) add(seat, cyl(0.005, 0.005, 0.8, 4), m.metal, s, -0.4, 0, false);
      add(seat, rb(1.2, 0.06, 0.45, 0.02), m.fabric, 0, -0.8, 0);
      add(seat, rb(1.2, 0.35, 0.05, 0.02), m.fabric, 0, -0.62, -0.2);
      return still(g);
    }
    case "planter":
      add(g, rb(1.0, 0.4, 0.4, 0.03), m.woodDark, 0, 0.2, 0);
      for (let i = 0; i < 4; i++) add(g, new THREE.IcosahedronGeometry(0.15, 1), m.green, -0.36 + i * 0.24, 0.5, 0, false);
      return still(g);
    case "shed":
      add(g, rb(2.0, 0.95, 1.6, 0.02), m.wood, 0, 0.475, 0);
      add(g, new THREE.ConeGeometry(1.4, 0.4, 4, 1), m.woodDark, 0, 1.15, 0).rotation.y = Math.PI / 4;
      add(g, new THREE.BoxGeometry(0.7, 0.8, 0.02), m.woodDark, 0.4, 0.4, 0.81, false);
      return still(g);
    case "mailbox":
      add(g, cyl(0.03, 0.03, 0.7, 8), m.black, 0, 0.35, 0);
      add(g, rb(0.25, 0.22, 0.4, 0.08), m.black, 0, 0.8, 0);
      add(g, rb(0.02, 0.1, 0.04, 0.005), m.accent, 0.13, 0.86, -0.1, false);
      return still(g);
    case "lamp_post": {
      add(g, cyl(0.03, 0.04, 1.2, 10), m.black, 0, 0.6, 0);
      const bulb = emissive("#dddddd");
      add(g, sphere(0.12, 16, 12), bulb, 0, 1.28, 0);
      const glow = glowSprite(m, 1.4);
      glow.position.set(0, 1.28, 0);
      g.add(glow);
      return smart(g, { glows: [bulb], sprites: [glow], intensity: 1.5 });
    }
    case "wall_light_out": {
      add(g, rb(0.12, 0.2, 0.1, 0.02), m.black, 0, 0.1, 0);
      const pane = emissive("#cccccc");
      add(g, new THREE.PlaneGeometry(0.08, 0.14), pane, 0, 0.1, 0.051, false);
      const glow = glowSprite(m, 0.8);
      glow.position.set(0, 0.1, 0.1);
      g.add(glow);
      return smart(g, { glows: [pane], sprites: [glow], intensity: 1.6 });
    }
    case "gate": {
      for (const s of [-1, 1]) add(g, rb(0.12, 0.9, 0.12, 0.01), m.stone, s * 1.06, 0.45, 0);
      const leaf = new THREE.Group();
      g.add(leaf);
      for (let i = 0; i < 10; i++) add(leaf, rb(0.04, 0.75, 0.04, 0.008), m.black, -0.9 + i * 0.2, 0.42, 0);
      add(leaf, new THREE.BoxGeometry(1.95, 0.04, 0.04), m.black, 0, 0.75, 0, false);
      add(leaf, new THREE.BoxGeometry(1.95, 0.04, 0.04), m.black, 0, 0.1, 0, false);
      return {
        group: g,
        active: false,
        update(s?: HassEntity) {
          const open = s?.entity_id.startsWith("cover.") ? coverPos(s) : isOn(s) ? 1 : 0;
          leaf.position.x = open * 1.9;
        },
      };
    }
    case "motorcycle":
      for (const z of [-0.7, 0.7]) add(g, new THREE.TorusGeometry(0.28, 0.07, 8, 24), m.black, 0, 0.3, z).rotation.y = Math.PI / 2;
      add(g, rb(0.3, 0.3, 1.1, 0.1), m.accent, 0, 0.55, 0);
      add(g, rb(0.28, 0.08, 0.5, 0.04), m.black, 0, 0.75, -0.2);
      add(g, cyl(0.015, 0.015, 0.6, 6), m.metal, 0, 0.85, 0.55, false).rotation.z = Math.PI / 2;
      return still(g);
    case "kids_slide": {
      add(g, rb(0.6, 0.06, 0.6, 0.02), m.accent, 0, 0.8, -0.7);
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(g, cyl(0.025, 0.025, 0.8, 6), m.metal, sx * 0.27, 0.4, -0.7 + sz * 0.27);
      add(g, rb(0.5, 0.04, 1.5, 0.02), m.fabric, 0, 0.45, 0.35).rotation.x = -0.55;
      for (let i = 0; i < 4; i++) add(g, cyl(0.015, 0.015, 0.5, 6), m.metal, 0, 0.18 + i * 0.18, -1.0, false).rotation.z = Math.PI / 2;
      return still(g);
    }
    case "dog_house":
      add(g, rb(0.8, 0.55, 1.0, 0.02), m.wood, 0, 0.275, 0);
      add(g, new THREE.ConeGeometry(0.7, 0.3, 4, 1), m.woodDark, 0, 0.7, 0).rotation.y = Math.PI / 4;
      add(g, new THREE.CircleGeometry(0.18, 20), m.black, 0, 0.25, 0.501, false);
      return still(g);
    case "outdoor_heater": {
      add(g, cyl(0.2, 0.24, 0.05, 20), m.black, 0, 0.025, 0);
      add(g, cyl(0.03, 0.03, 1.1, 8), m.metal, 0, 0.6, 0);
      const head = emissive("#333333");
      add(g, cyl(0.06, 0.08, 0.2, 16), head, 0, 1.12, 0);
      add(g, new THREE.ConeGeometry(0.4, 0.15, 24, 1, true), m.metal, 0, 1.28, 0);
      const glow = glowSprite(m, 1.4);
      glow.position.set(0, 1.1, 0);
      return glowing(g, [head], "#ff6a2a", glow);
    }
    case "sunbed_double":
      add(g, rb(1.6, 0.3, 2.0, 0.08), m.woodDark, 0, 0.15, 0);
      add(g, rb(1.5, 0.12, 1.9, 0.06), m.white, 0, 0.36, 0);
      add(g, rb(1.5, 0.35, 0.3, 0.1), m.fabric, 0, 0.5, -0.8).rotation.x = -0.4;
      return still(g);

    // ----- structure -----
    case "spiral_stairs": {
      const h = env.wallH;
      add(g, cyl(0.06, 0.06, h, 12), m.metal, 0, h / 2, 0);
      const steps = 12;
      for (let i = 0; i < steps; i++) {
        const step = add(g, rb(0.75, 0.04, 0.3, 0.01), m.wood, 0, (h / steps) * (i + 1), 0);
        step.geometry.translate(0.4, 0, 0);
        step.rotation.y = (i / steps) * Math.PI * 1.75;
      }
      return still(g);
    }
    case "railing":
      add(g, rb(2.0, 0.04, 0.05, 0.01), m.woodDark, 0, 0.6, 0);
      for (let i = 0; i < 9; i++) add(g, cyl(0.012, 0.012, 0.6, 6), m.metal, -0.96 + i * 0.24, 0.3, 0);
      return still(g);
    case "glass_wall": {
      const h = env.wallH;
      add(g, new THREE.BoxGeometry(2.0, h, 0.03), m.glass, 0, h / 2, 0, false);
      add(g, new THREE.BoxGeometry(2.0, 0.03, 0.05), m.black, 0, h - 0.015, 0, false);
      add(g, new THREE.BoxGeometry(2.0, 0.03, 0.05), m.black, 0, 0.015, 0, false);
      return still(g);
    }
    case "column_square":
      add(g, rb(0.4, env.wallH, 0.4, 0.02), m.white, 0, env.wallH / 2, 0);
      return still(g);
    case "built_in_shelves": {
      const h = env.wallH;
      add(g, rb(1.6, h, 0.35, 0.01), m.white, 0, h / 2, 0);
      const n = Math.max(3, Math.floor(h / 0.3));
      for (let i = 1; i < n; i++) add(g, new THREE.BoxGeometry(1.5, 0.02, 0.3), m.wood, 0, (h / n) * i, 0.03, false);
      return still(g);
    }
    case "plant_hanging": {
      add(g, cyl(0.004, 0.004, 0.3, 4), m.metal, 0, -0.15, 0, false);
      add(g, new THREE.SphereGeometry(0.12, 16, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), m.white, 0, -0.32, 0, false);
      for (let i = 0; i < 6; i++) add(g, new THREE.IcosahedronGeometry(0.07, 0), m.green, Math.cos(i) * 0.1, -0.35 - (i % 3) * 0.08, Math.sin(i) * 0.1, false);
      return still(g);
    }
  }
  return undefined;
}
