// The 3D floor plan: three.js scene, fixed isometric camera, pan and zoom, and the live room effects.
// Renders only when something changed, so a wall tablet isn't spinning its GPU for a still picture.
import * as THREE from "three";
import type { Hass, HassEntity, Palette, PlanFloor, PlanRoom } from "../types";
import { buildPiece, makeMats, type Mats, type Piece } from "./furniture";
import { WALL_H, WALL_T, bounds, doorPos, gapTouchesRoom, innerPoint, inside, roomPts, walls } from "./geometry";
import { TvFeed } from "./tv-feed";
import { item, pieceZ } from "./catalog";
import type { RoomLive } from "./live";

interface Colors {
  floor: string;
  wallSide: string;
  wallTop: string;
  base: string;
  sky: string;
  ground: string;
  sun: number;
  hemi: number;
}

const PALETTES: Record<Palette, Colors> = {
  light: { floor: "#ece6de", wallSide: "#d6cdc2", wallTop: "#fbf8f4", base: "#b5aca2", sky: "#ffffff", ground: "#a89f95", sun: 1.5, hemi: 1.6 },
  dark: { floor: "#3a3530", wallSide: "#4d4740", wallTop: "#6e665d", base: "#1c1a18", sky: "#d8d0c6", ground: "#2a2622", sun: 1.0, hemi: 1.2 },
  purple: { floor: "#3d3680", wallSide: "#4a42a0", wallTop: "#8076e0", base: "#1e1a4c", sky: "#c9c2ff", ground: "#2a2466", sun: 1.0, hemi: 1.4 },
};
const COOL = new THREE.Color("#6fa8ff");
const WARM = new THREE.Color("#ff9a5c");
const AMBER = new THREE.Color("#ffb347");

/** Isometric-ish view: looking down 52° from above, turned 38° around. */
/** View heights to pick from, in degrees above the floor. */
export const VIEWS = { top: 88, high: 66, normal: 52, low: 32, eye: 12 } as const;
export type View = keyof typeof VIEWS;
export const DEFAULT_AZIMUTH = 38;

/** A soft round glow made once and reused for every room's light pool. Built from raw pixels, not a 2D canvas:
 * Safari's fingerprinting protection adds random coloured noise to canvas pixels handed to WebGL, which showed as
 * rainbow speckles wherever a light was on. */
function glowTexture(): THREE.Texture {
  const size = 128;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.min(1, Math.hypot(x + 0.5 - size / 2, y + 0.5 - size / 2) / (size / 2));
      // The same falloff as before: 1 at the centre, 0.55 at 35%, 0 at the edge.
      const a = d < 0.35 ? 1 - (0.45 * d) / 0.35 : 0.55 * (1 - (d - 0.35) / 0.65);
      const i = (y * size + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = 255;
      data[i + 3] = Math.round(a * 255);
    }
  }
  const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  t.colorSpace = THREE.SRGBColorSpace;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.needsUpdate = true;
  return t;
}

/** Room highlights: "on"/"dim" for the robot's room picker, "alert" when a camera there sees someone. */
export type Mark = "on" | "dim" | "alert";
const ALERT_FLOOR = new THREE.Color("#e0463c");

interface RoomMeshes {
  floor: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
  pool: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
  doors: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[];
  base: THREE.Color;
}

export class PlanScene {
  readonly renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 500);
  private group = new THREE.Group();
  private target = new THREE.Vector3();
  private colors: Colors;
  private glow = glowTexture();
  private rooms = new Map<string, RoomMeshes>();
  private frame = 0;
  private size = { w: 1, h: 1 };
  /** World units visible vertically at zoom 1; set when a floor is fitted. */
  private span = 10;
  private palette: Palette;
  private mats?: Mats;
  private pieces = new Map<string, { piece: Piece; entity?: string; x: number; y: number }>();
  private furnitureRoot = new THREE.Group();
  /** Screens showing a camera (what's on the TV), by furniture id, with the room they stand in. */
  private feeds = new Map<string, { feed: TvFeed; room?: string }>();
  /** The room the camera is zoomed into: TVs there play live. */
  private liveRoom?: string;
  /** Home Assistant, for the TV feeds. Left unset (robot room picker), screens just glow. */
  hass?: () => Hass;
  private anim = 0;
  private clock = new THREE.Clock();
  private tween = 0;
  private spin = 0;
  /** View direction around the house, in radians. Turned by the rotate buttons and the two-finger twist. */
  private azimuth = THREE.MathUtils.degToRad(DEFAULT_AZIMUTH);
  private elevation = THREE.MathUtils.degToRad(VIEWS.normal);
  private tilt = 0;
  /** The current floor's wall height. */
  private wallH = WALL_H;
  private lightQuality = false;
  private flatView = false;
  private viewBeforeFlat?: { elevation: number; azimuth: number };
  private hemi: THREE.HemisphereLight;
  private sun: THREE.DirectionalLight;
  /** Called after every render, so the HTML icons can follow the camera. */
  onRender?: () => void;

  constructor(
    private host: HTMLElement,
    palette: Palette,
    private shadows = true,
  ) {
    this.colors = PALETTES[palette];
    this.palette = palette;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.domElement.style.display = "block";
    host.appendChild(this.renderer.domElement);

    this.hemi = new THREE.HemisphereLight(this.colors.sky, this.colors.ground, this.colors.hemi);
    this.sun = new THREE.DirectionalLight("#ffffff", this.colors.sun);
    this.sun.castShadow = shadows;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.radius = 4;
    this.sun.shadow.bias = -0.0008;
    this.scene.add(this.hemi, this.sun, this.sun.target, this.group);
  }

  /** Live quality changes never require rebuilding the plan or losing camera position. */
  setQuality(light: boolean) {
    if (this.lightQuality === light) return;
    this.lightQuality = light;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, light ? 1 : 2));
    this.renderer.shadowMap.enabled = this.shadows && !light;
    this.sun.castShadow = this.shadows && !light;
    this.resize(this.size.w, this.size.h);
  }

  /** A true orthographic overhead projection; walls hide so they cannot cover the rooms. */
  setFlatView(flat: boolean) {
    if (this.flatView === flat) return;
    this.flatView = flat;
    cancelAnimationFrame(this.tilt);
    cancelAnimationFrame(this.spin);
    if (flat) {
      this.viewBeforeFlat = { elevation: this.elevation, azimuth: this.azimuth };
      this.elevation = THREE.MathUtils.degToRad(89.99);
      this.azimuth = 0;
    } else if (this.viewBeforeFlat) {
      this.elevation = this.viewBeforeFlat.elevation;
      this.azimuth = this.viewBeforeFlat.azimuth;
      this.viewBeforeFlat = undefined;
    }
    this.group.children.forEach(child => { if (child.userData.planWall) child.visible = !flat; });
    this.placeCamera();
    this.render();
  }

  setPalette(p: Palette) {
    this.palette = p;
    this.colors = PALETTES[p];
    this.hemi.color.set(this.colors.sky);
    this.hemi.groundColor.set(this.colors.ground);
    this.hemi.intensity = this.colors.hemi;
    this.sun.intensity = this.colors.sun;
  }

  resize(w: number, h: number) {
    this.size = { w: Math.max(1, w), h: Math.max(1, h) };
    this.renderer.setSize(this.size.w, this.size.h, false);
    this.renderer.domElement.style.width = `${this.size.w}px`;
    this.renderer.domElement.style.height = `${this.size.h}px`;
    this.updateFrustum();
    this.render();
  }

  private updateFrustum() {
    const aspect = this.size.w / this.size.h;
    const half = this.span / 2;
    this.camera.left = -half * aspect;
    this.camera.right = half * aspect;
    this.camera.top = half;
    this.camera.bottom = -half;
    this.camera.updateProjectionMatrix();
  }

  private placeCamera() {
    const d = 60;
    const off = new THREE.Vector3(
      Math.sin(this.azimuth) * Math.cos(this.elevation) * d,
      Math.sin(this.elevation) * d,
      Math.cos(this.azimuth) * Math.cos(this.elevation) * d,
    );
    this.camera.position.copy(this.target).add(off);
    this.camera.lookAt(this.target);
    this.camera.updateMatrixWorld();
  }

  /** Rebuilds the floor's meshes. Call when the plan itself changes, not for state changes. */
  build(floor: PlanFloor) {
    for (const child of [...this.group.children]) {
      this.group.remove(child);
      child.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
    }
    this.rooms.clear();
    this.pieces.clear();
    for (const { feed } of this.feeds.values()) feed.dispose();
    this.feeds.clear();
    this.furnitureRoot = new THREE.Group();
    this.group.add(this.furnitureRoot);
    if (this.mats) for (const v of Object.values(this.mats)) if (v instanceof THREE.Material) v.dispose();
    this.mats = makeMats(this.palette, this.glow);
    this.wallH = floor.wallHeight && floor.wallHeight > 0.3 ? floor.wallHeight : WALL_H;
    for (const f of floor.furniture ?? []) {
      const piece = buildPiece(f.type, this.mats, { wallH: this.wallH });
      // Ceiling pieces hang from the ceiling; everything else stands its height above the floor.
      const z = pieceZ(f.type, f.z);
      const y = item(f.type)?.mount === "ceiling" ? this.wallH - z : z;
      piece.group.position.set(f.x, y, f.y);
      const sc = f.scale && f.scale > 0 ? f.scale : 1;
      const st = f.stretch && f.stretch > 0 ? f.stretch : 1;
      piece.group.scale.set(sc * st, sc, sc);
      piece.group.rotation.y = -THREE.MathUtils.degToRad(f.rot || 0);
      piece.group.userData.furnitureId = f.id;
      this.furnitureRoot.add(piece.group);
      this.pieces.set(f.id, { piece, entity: f.entity, x: f.x, y: f.y });
      if (f.source && piece.setPicture && this.hass) {
        const feed = new TvFeed(this.hass, f.source, (tex) => {
          piece.setPicture!(tex);
          this.render();
        });
        this.feeds.set(f.id, { feed, room: floor.rooms.find((r) => inside(roomPts(r), f.x, f.y))?.id });
      }
    }
    const b = bounds(floor);
    const cx = b.x + b.w / 2;
    const cz = b.y + b.h / 2;
    const c = this.colors;

    // A slab under the whole floor, a little bigger than the rooms, so the plan reads as one model.
    if (floor.rooms.length) {
      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(b.w + 0.6, 0.18, b.h + 0.6),
        new THREE.MeshStandardMaterial({ color: c.base, roughness: 0.95 }),
      );
      slab.position.set(cx, -0.13, cz);
      slab.receiveShadow = true;
      this.group.add(slab);
    }

    for (const r of floor.rooms) {
      const base = new THREE.Color(c.floor);
      const pts = roomPts(r);
      const shape = new THREE.Shape(pts.map((p) => new THREE.Vector2(p.x, p.y)));
      // Built flat in x/y, then turned so plan y runs along 3D z and the slab sits just below y = 0.
      const floorGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: false }).rotateX(Math.PI / 2);
      const floorMesh = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ color: base.clone(), roughness: 0.9 }));
      floorMesh.receiveShadow = true;
      floorMesh.userData.roomId = r.id;
      // The light pool takes the room's own shape, with the glow centred in it.
      const poolGeo = new THREE.ShapeGeometry(shape);
      const centre = innerPoint(r);
      const R = Math.max(r.w, r.h) * 0.62;
      const pos = poolGeo.attributes.position as THREE.BufferAttribute;
      const uv = new Float32Array(pos.count * 2);
      for (let i = 0; i < pos.count; i++) {
        uv[i * 2] = (pos.getX(i) - centre.x) / (2 * R) + 0.5;
        uv[i * 2 + 1] = (pos.getY(i) - centre.y) / (2 * R) + 0.5;
      }
      poolGeo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
      poolGeo.rotateX(Math.PI / 2);
      const pool = new THREE.Mesh(
        poolGeo,
        new THREE.MeshBasicMaterial({ map: this.glow, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0, side: THREE.DoubleSide }),
      );
      pool.position.y = 0.02;
      pool.visible = false;
      pool.renderOrder = 2;
      this.group.add(floorMesh, pool);
      this.rooms.set(r.id, { floor: floorMesh, pool, doors: [], base });
    }

    const side = new THREE.MeshStandardMaterial({ color: c.wallSide, roughness: 0.85 });
    const top = new THREE.MeshStandardMaterial({ color: c.wallTop, roughness: 0.7 });
    // BoxGeometry faces: +x, -x, +y (top), -y, +z, -z
    const mats = [side, side, top, side, side, side];
    for (const s of walls(floor)) {
      const len = Math.hypot(s.x2 - s.x1, s.y2 - s.y1) + WALL_T;
      const wall = new THREE.Mesh(new THREE.BoxGeometry(len, this.wallH, WALL_T), mats);
      wall.position.set((s.x1 + s.x2) / 2, this.wallH / 2, (s.y1 + s.y2) / 2);
      wall.rotation.y = -s.angle;
      wall.userData.planWall = true;
      wall.visible = !this.flatView;
      wall.castShadow = true;
      wall.receiveShadow = true;
      this.group.add(wall);
    }

    // Door thresholds: invisible until a room on either side reports an open door or window.
    for (const d of floor.doors) {
      if (d.open) continue;
      const p = doorPos(d);
      const strip = new THREE.Mesh(
        new THREE.PlaneGeometry(d.width, WALL_T * 2.5).rotateX(-Math.PI / 2).rotateY(-p.angle),
        new THREE.MeshBasicMaterial({ color: AMBER, transparent: true, opacity: 0, depthWrite: false }),
      );
      strip.position.set(p.x, 0.025, p.y);
      strip.visible = false;
      this.group.add(strip);
      for (const r of floor.rooms) if (gapTouchesRoom(d, r)) this.rooms.get(r.id)?.doors.push(strip);
    }

    // Fit: the plan's footprint, seen from the camera, fills the view with a margin.
    this.target.set(cx, 0, cz);
    this.placeCamera();
    const corners = [
      [b.x, 0, b.y],
      [b.x + b.w, 0, b.y],
      [b.x, 0, b.y + b.h],
      [b.x + b.w, 0, b.y + b.h],
      [b.x, this.wallH, b.y],
      [b.x + b.w, this.wallH, b.y + b.h],
    ].map(([x, y, z]) => new THREE.Vector3(x, y, z).applyMatrix4(this.camera.matrixWorldInverse));
    const w = Math.max(...corners.map((v) => v.x)) - Math.min(...corners.map((v) => v.x));
    const h = Math.max(...corners.map((v) => v.y)) - Math.min(...corners.map((v) => v.y));
    const aspect = this.size.w / this.size.h;
    this.span = Math.max(h, w / aspect) * 1.04 || 10;
    this.camera.zoom = 1;
    this.updateFrustum();

    const sunOff = new THREE.Vector3(-6, 14, 4);
    this.sun.position.copy(this.target).add(sunOff);
    this.sun.target.position.copy(this.target);
    const sc = this.sun.shadow.camera;
    const r = Math.max(b.w, b.h) * 0.8 + 2;
    sc.left = -r;
    sc.right = r;
    sc.top = r;
    sc.bottom = -r;
    sc.far = 60;
    sc.updateProjectionMatrix();
    this.render();
  }

  /** Light pools, AC tints and open-door highlights. Cheap: only colours and opacities change. */
  /** Room highlights for picking (the robot's room picker): "on" glows in the accent colour, "dim" darkens. */
  private marks = new Map<string, Mark>();
  private lastLives: RoomLive[] = [];

  setMarks(marks: Record<string, Mark>) {
    this.marks = new Map(Object.entries(marks));
    this.setEffects(this.lastLives);
  }

  setEffects(lives: RoomLive[]) {
    this.lastLives = lives;
    const pick = new THREE.Color(this.palette === "purple" ? "#7d90ff" : "#9ccf6c");
    for (const live of lives) {
      const m = this.rooms.get(live.roomId);
      if (!m) continue;
      const col = m.base.clone();
      if (live.climate === "cool") col.lerp(COOL, 0.32);
      else if (live.climate === "heat") col.lerp(WARM, 0.3);
      const mark = this.marks.get(live.roomId);
      if (mark === "on") col.lerp(pick, 0.6);
      else if (mark === "dim") col.multiplyScalar(0.72);
      else if (mark === "alert") col.lerp(ALERT_FLOOR, 0.45);
      m.floor.material.color.copy(col);
      if (live.light) {
        m.pool.visible = true;
        m.pool.material.color.setRGB(live.light.rgb[0] / 255, live.light.rgb[1] / 255, live.light.rgb[2] / 255, THREE.SRGBColorSpace);
        m.pool.material.opacity = 0.18 + 0.6 * live.light.level;
      } else {
        m.pool.visible = false;
      }
    }
    // A door between two rooms lights up when either side reports something open.
    const lit = new Set<THREE.Mesh>();
    for (const live of lives) if (live.open) this.rooms.get(live.roomId)?.doors.forEach((d) => lit.add(d));
    for (const m of this.rooms.values())
      for (const d of m.doors) {
        d.visible = lit.has(d);
        d.material.opacity = d.visible ? 0.85 : 0;
      }
    this.render();
  }

  /** Feeds every linked piece its device's state, and starts or stops the animation loop as needed. */
  setStates(states: Record<string, HassEntity>) {
    for (const { piece, entity } of this.pieces.values()) piece.update(entity ? states[entity] : undefined);
    this.syncFeeds();
    this.render();
    this.animate();
  }

  /** Cameras that see someone pulse red. */
  setAlerts(ids: Set<string>) {
    for (const [id, { piece }] of this.pieces) piece.setAlert?.(ids.has(id));
    this.render();
    this.animate();
  }

  /** TVs that are on show their camera: live in the zoomed-in room, a still frame elsewhere; off ones stop. */
  private syncFeeds() {
    for (const [id, { feed, room }] of this.feeds) {
      const piece = this.pieces.get(id)?.piece;
      const mode = !piece?.screenOn ? undefined : this.liveRoom && room === this.liveRoom ? "live" : "still";
      if (mode === feed.mode) continue;
      feed.set(mode);
      if (!mode) piece?.setPicture?.(null);
    }
    this.animate();
  }

  private animate() {
    const moving = [...this.pieces.values()].some((p) => p.piece.active) || [...this.feeds.values()].some((f) => f.feed.mode === "live");
    if (!moving) {
      cancelAnimationFrame(this.anim);
      this.anim = 0;
      return;
    }
    if (this.anim) return;
    this.clock.getDelta();
    let last = 0;
    const loop = (now: number) => {
      // 30 fps is plenty for spinning fans and flowing power, and halves the work on a wall tablet that's on all day.
      if (now - last < (this.lightQuality ? 66 : 32)) {
        this.anim = requestAnimationFrame(loop);
        return;
      }
      last = now;
      const dt = Math.min(0.08, this.clock.getDelta());
      const t = this.clock.elapsedTime;
      let any = false;
      for (const { piece } of this.pieces.values())
        if (piece.active) {
          piece.tick?.(dt, t);
          any = true;
        }
      for (const { feed } of this.feeds.values())
        if (feed.mode === "live") {
          feed.frame();
          any = true;
        }
      this.renderer.render(this.scene, this.camera);
      this.anim = any ? requestAnimationFrame(loop) : 0;
    };
    this.anim = requestAnimationFrame(loop);
  }

  /** The furniture piece under a pixel, if any. */
  pickFurniture(px: number, py: number): { id: string; entity?: string } | undefined {
    const ndc = new THREE.Vector2((px / this.size.w) * 2 - 1, -(py / this.size.h) * 2 + 1);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(ndc, this.camera);
    for (const hit of ray.intersectObject(this.furnitureRoot, true)) {
      let o: THREE.Object3D | null = hit.object;
      while (o && !o.userData.furnitureId) o = o.parent;
      if (o && (o as THREE.Sprite).isSprite !== true) {
        const id = o.userData.furnitureId as string;
        return { id, entity: this.pieces.get(id)?.entity };
      }
    }
    return undefined;
  }

  /** Where a piece stands, in plan metres. */
  piecePos(id: string) {
    const p = this.pieces.get(id);
    return p && { x: p.x, y: p.y };
  }

  /**
   * Glides the camera to frame a room, or back to the whole floor without one. The view eases in and out
   * over ~0.7 s; the HTML icons follow every frame.
   */
  flyTo(room: PlanRoom | undefined, floor: PlanFloor, shiftPx = 0, focus?: { x: number; y: number }) {
    if (this.liveRoom !== room?.id) {
      this.liveRoom = room?.id;
      this.syncFeeds();
    }
    const b = room ? { x: room.x, y: room.y, w: room.w, h: room.h } : bounds(floor);
    const toTarget = focus ? new THREE.Vector3(focus.x, 0, focus.y) : new THREE.Vector3(b.x + b.w / 2, 0, b.y + b.h / 2);
    let toZoom = 1;
    if (room) {
      // How much of the fitted view this room fills, seen from the camera.
      const pts = [
        [b.x, 0, b.y],
        [b.x + b.w, 0, b.y],
        [b.x, 0, b.y + b.h],
        [b.x + b.w, 0, b.y + b.h],
        [b.x, this.wallH, b.y],
      ].map(([x, y, z]) => new THREE.Vector3(x, y, z).applyMatrix4(this.camera.matrixWorldInverse));
      const w = Math.max(...pts.map((v) => v.x)) - Math.min(...pts.map((v) => v.x));
      const h = Math.max(...pts.map((v) => v.y)) - Math.min(...pts.map((v) => v.y));
      const aspect = this.size.w / this.size.h;
      toZoom = THREE.MathUtils.clamp(Math.min(this.span / h, (this.span * aspect) / w) * 0.78 * (focus ? 1.35 : 1), 1, 5);
    }
    if (shiftPx) {
      // Leave room for a side panel: the room centres in what's left of the view.
      const right = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 0);
      toTarget.addScaledVector(right, (shiftPx * this.span) / toZoom / this.size.h);
      toTarget.y = 0;
    }
    const fromTarget = this.target.clone();
    const fromZoom = this.camera.zoom;
    const start = performance.now();
    const ms = 700;
    cancelAnimationFrame(this.tween);
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / ms);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      this.target.lerpVectors(fromTarget, toTarget, e);
      this.camera.zoom = fromZoom + (toZoom - fromZoom) * e;
      this.camera.updateProjectionMatrix();
      this.placeCamera();
      this.renderer.render(this.scene, this.camera);
      this.onRender?.();
      this.tween = k < 1 ? requestAnimationFrame(step) : 0;
    };
    this.tween = requestAnimationFrame(step);
  }

  get azimuthDeg() {
    return THREE.MathUtils.radToDeg(this.azimuth);
  }

  /** Glides the camera up or down to a view height (top-down, eye level…). */
  setElevation(deg: number, animate = true) {
    cancelAnimationFrame(this.tilt);
    const to = THREE.MathUtils.degToRad(deg);
    if (!animate) {
      this.elevation = to;
      this.placeCamera();
      this.render();
      return;
    }
    const from = this.elevation;
    const start = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / 650);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      this.elevation = from + (to - from) * e;
      this.placeCamera();
      this.renderer.render(this.scene, this.camera);
      this.onRender?.();
      this.tilt = k < 1 ? requestAnimationFrame(step) : 0;
    };
    this.tilt = requestAnimationFrame(step);
  }

  /** Sets the view angle straight away (restoring a saved one). */
  setAzimuth(deg: number) {
    this.azimuth = THREE.MathUtils.degToRad(deg);
    this.placeCamera();
    this.render();
  }

  /** Turns the view around the point in the middle of the screen; animated for button presses. */
  rotateBy(deg: number, animate = true) {
    cancelAnimationFrame(this.spin);
    const from = this.azimuth;
    const to = from + THREE.MathUtils.degToRad(deg);
    if (!animate) {
      this.azimuth = to;
      this.placeCamera();
      this.render();
      return;
    }
    const start = performance.now();
    const ms = 550;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      this.azimuth = from + (to - from) * e;
      this.placeCamera();
      this.renderer.render(this.scene, this.camera);
      this.onRender?.();
      this.spin = k < 1 ? requestAnimationFrame(step) : 0;
    };
    this.spin = requestAnimationFrame(step);
  }

  /** Moves the view by a screen-pixel drag. */
  pan(dx: number, dy: number) {
    const perPx = this.span / this.camera.zoom / this.size.h;
    const right = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 1);
    this.target.addScaledVector(right, -dx * perPx).addScaledVector(up, dy * perPx);
    this.target.y = 0;
    this.placeCamera();
    this.render();
  }

  zoomBy(f: number) {
    this.camera.zoom = THREE.MathUtils.clamp(this.camera.zoom * f, 0.6, 5);
    this.camera.updateProjectionMatrix();
    this.render();
  }

  get zoom() {
    return this.camera.zoom;
  }

  /** Back to the fitted view. */
  reset(floor: PlanFloor) {
    const b = bounds(floor);
    this.target.set(b.x + b.w / 2, 0, b.y + b.h / 2);
    this.camera.zoom = 1;
    this.camera.updateProjectionMatrix();
    this.placeCamera();
    this.render();
  }

  /** Plan coordinates (metres, at a height) to pixels in the canvas. */
  project(x: number, y: number, height = 0): { left: number; top: number } {
    const v = new THREE.Vector3(x, height, y).project(this.camera);
    return { left: ((v.x + 1) / 2) * this.size.w, top: ((1 - v.y) / 2) * this.size.h };
  }

  /** A pixel in the canvas to plan coordinates on the floor. */
  unproject(px: number, py: number): { x: number; y: number } {
    const ndc = new THREE.Vector2((px / this.size.w) * 2 - 1, -(py / this.size.h) * 2 + 1);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(ndc, this.camera);
    const hit = new THREE.Vector3();
    ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit);
    return { x: hit.x, y: hit.z };
  }

  /** Where the visible area sits on the plan, for the minimap's frame. */
  viewRect() {
    const a = this.unproject(0, 0);
    const b = this.unproject(this.size.w, this.size.h);
    const c = this.unproject(this.size.w, 0);
    const d = this.unproject(0, this.size.h);
    const xs = [a.x, b.x, c.x, d.x];
    const ys = [a.y, b.y, c.y, d.y];
    return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
  }

  render() {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.renderer.render(this.scene, this.camera);
      this.onRender?.();
    });
  }

  dispose() {
    cancelAnimationFrame(this.frame);
    cancelAnimationFrame(this.anim);
    cancelAnimationFrame(this.tween);
    cancelAnimationFrame(this.spin);
    cancelAnimationFrame(this.tilt);
    this.build({ id: "", name: "", rooms: [], doors: [] });
    this.glow.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
