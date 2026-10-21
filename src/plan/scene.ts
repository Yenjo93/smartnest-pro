// The 3D floor plan: three.js scene, fixed isometric camera, pan and zoom, and the live room effects.
// Renders only when something changed, so a wall tablet isn't spinning its GPU for a still picture.
import * as THREE from "three";
import type { HassEntity, Palette, PlanFloor, PlanRoom } from "../types";
import { buildPiece, makeMats, type Mats, type Piece } from "./furniture";
import { WALL_H, WALL_T, bounds, doorPos, gapTouchesRoom, innerPoint, roomPts, walls } from "./geometry";
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
const ELEVATION = THREE.MathUtils.degToRad(52);
export const DEFAULT_AZIMUTH = 38;

/** A soft round glow drawn once and reused for every room's light pool. */
function glowTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.55)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

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
  private anim = 0;
  private clock = new THREE.Clock();
  private tween = 0;
  private spin = 0;
  /** View direction around the house, in radians. Turned by the rotate buttons and the two-finger twist. */
  private azimuth = THREE.MathUtils.degToRad(DEFAULT_AZIMUTH);
  /** The current floor's wall height. */
  private wallH = WALL_H;
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
      Math.sin(this.azimuth) * Math.cos(ELEVATION) * d,
      Math.sin(ELEVATION) * d,
      Math.cos(this.azimuth) * Math.cos(ELEVATION) * d,
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
      piece.group.scale.setScalar(f.scale && f.scale > 0 ? f.scale : 1);
      piece.group.rotation.y = -THREE.MathUtils.degToRad(f.rot || 0);
      piece.group.userData.furnitureId = f.id;
      this.furnitureRoot.add(piece.group);
      this.pieces.set(f.id, { piece, entity: f.entity, x: f.x, y: f.y });
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
  setEffects(lives: RoomLive[]) {
    for (const live of lives) {
      const m = this.rooms.get(live.roomId);
      if (!m) continue;
      const col = m.base.clone();
      if (live.climate === "cool") col.lerp(COOL, 0.32);
      else if (live.climate === "heat") col.lerp(WARM, 0.3);
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
    this.render();
    this.animate();
  }

  private animate() {
    const moving = [...this.pieces.values()].some((p) => p.piece.active);
    if (!moving) {
      cancelAnimationFrame(this.anim);
      this.anim = 0;
      return;
    }
    if (this.anim) return;
    this.clock.getDelta();
    const loop = () => {
      const dt = Math.min(0.05, this.clock.getDelta());
      const t = this.clock.elapsedTime;
      let any = false;
      for (const { piece } of this.pieces.values())
        if (piece.active) {
          piece.tick?.(dt, t);
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
    this.build({ id: "", name: "", rooms: [], doors: [] });
    this.glow.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
