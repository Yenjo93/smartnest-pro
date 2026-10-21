import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  mdiCheck,
  mdiClose,
  mdiDelete,
  mdiDoorOpen,
  mdiImageOutline,
  mdiPencilRuler,
  mdiPlus,
  mdiRotate3dVariant,
  mdiRotateLeft,
  mdiRotateRight,
  mdiSofaOutline,
  mdiSquareOutline,
  mdiUndo,
  mdiVectorPolygon,
  mdiWall,
  mdiWallSconceFlatOutline,
} from "@mdi/js";
import { CATALOG, CATEGORIES, item, itemName, pieceZ, type Category } from "./catalog";
import { entityOptions, fieldStyles } from "../ui/fields";
import { areas, nameOf } from "../ha";
import type { Ctx } from "../ctx";
import type { PlanFloor, PlanPoint, PlanRoom } from "../types";
import { shared } from "../styles";
import { icon } from "../ui/icon";
import { newId } from "../config";
import {
  DOOR_W,
  GRID,
  WALL_H,
  bounds,
  doorPos,
  doorways,
  innerPoint,
  nearestWall,
  openings,
  roomPts,
  shapeRoom,
  snap,
  snapPoint,
  snapRect,
  walls,
} from "./geometry";

export function openPlanEditor(ctx: Ctx) {
  ctx.showSheet({
    title: ctx.t("edit_plan"),
    icon: mdiPencilRuler,
    wide: true,
    render: (c) => html`<sn-plan-editor .ctx=${c}></sn-plan-editor>`,
  });
}

type Tool = "room" | "shape" | "wall" | "door" | "open" | "furniture" | "photo";
type Drag =
  | { kind: "draw"; x0: number; y0: number; rect: PlanRoom }
  | { kind: "move"; start: PlanPoint; orig: PlanRoom; room: PlanRoom }
  | { kind: "vertex"; index: number; room: PlanRoom }
  | { kind: "photo"; dx: number; dy: number; x: number; y: number }
  | { kind: "fmove"; id: string; dx: number; dy: number; x: number; y: number };

const polyAttr = (pts: PlanPoint[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");
const polyArea = (pts: PlanPoint[]) =>
  Math.abs(pts.reduce((a, p, i) => a + p.x * pts[(i + 1) % pts.length].y - pts[(i + 1) % pts.length].x * p.y, 0)) / 2;

/**
 * Top-down editor: rectangles or free shapes for rooms, walls drawn at any angle, doorways and open-plan
 * openings cut into walls, furniture, and a photo of the real plan to trace over.
 */
@customElement("sn-plan-editor")
export class SnPlanEditor extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @state() private floorId?: string;
  @state() private tool: Tool = "room";
  @state() private selected?: string;
  @state() private selVertex?: number;
  @state() private drag?: Drag;
  @state() private uploading = false;
  /** Catalog piece waiting to be placed with the next tap. */
  @state() private placing?: string;
  @state() private category: Category = "smart";
  @state() private selFurn?: string;
  @state() private search = "";
  /** Corners tapped so far for a new free-shape room. */
  @state() private shapePts: PlanPoint[] = [];
  /** Where the wall being drawn starts (the last corner tapped). */
  @state() private wallStart?: PlanPoint;
  @state() private selWall?: string;
  /** Pointer position on the board, for the rubber-band line while drawing. */
  @state() private cursor?: PlanPoint;
  /**
   * Slider values while a slider is being dragged. The 3D view rebuilds the whole floor for these, which is
   * too heavy to do on every pixel on a tablet, so the layout only changes when the slider is let go.
   */
  @state() private live: { wall?: number; z?: number; scale?: number; stretch?: number } = {};

  private get floor(): PlanFloor | undefined {
    const floors = this.ctx.config.plan.floors;
    return floors.find((f) => f.id === this.floorId) ?? floors[0];
  }

  /** An empty floor stands in until the first edit creates one, so drawing works from the start. */
  private get floorOrEmpty(): PlanFloor {
    return this.floor ?? { id: "", name: "", rooms: [], doors: [] };
  }

  /** Edits the current floor in the draft layout; creates the first floor on demand. */
  private edit(fn: (f: PlanFloor) => void) {
    const id = this.floor?.id;
    this.ctx.update((d) => {
      let f = d.plan.floors.find((x) => x.id === id) ?? d.plan.floors[0];
      if (!f) {
        f = { id: newId(), name: this.ctx.t("floor_n", { n: 1 }), rooms: [], doors: [], walls: [], furniture: [] };
        d.plan.floors.push(f);
      }
      fn(f);
    });
  }

  private setRoom(room: PlanRoom) {
    this.edit((f) => (f.rooms = f.rooms.map((r) => (r.id === room.id ? { ...room, area: r.area } : r))));
  }

  private setTool(t: Tool) {
    this.tool = t;
    this.selected = undefined;
    this.selVertex = undefined;
    this.selFurn = undefined;
    this.selWall = undefined;
    this.shapePts = [];
    this.wallStart = undefined;
  }

  private point(e: PointerEvent) {
    const svgEl = this.renderRoot.querySelector("svg.board") as SVGSVGElement;
    const pt = svgEl.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svgEl.getScreenCTM()!.inverse());
    return { x: p.x, y: p.y };
  }

  private view() {
    const f = this.floor;
    const b = f && (f.rooms.length || f.walls?.length) ? bounds(f) : { x: 0, y: 0, w: 0, h: 0 };
    const x0 = Math.min(0, b.x) - 2;
    const y0 = Math.min(0, b.y) - 2;
    const x1 = Math.max(16, b.x + b.w) + 2;
    const y1 = Math.max(10, b.y + b.h) + 2;
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }

  /** The floor without one room, so a room's own corners don't pull it while it's edited. */
  private without(id: string): PlanFloor {
    const f = this.floorOrEmpty;
    return { ...f, rooms: f.rooms.filter((r) => r.id !== id) };
  }

  private down = (e: PointerEvent) => {
    const p = this.point(e);
    const floor = this.floorOrEmpty;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    const target = e.target as Element;

    switch (this.tool) {
      case "door": {
        const w = nearestWall(floor, p.x, p.y);
        const existing = floor.doors.find((d) => !d.open && Math.hypot(doorPos(d).x - p.x, doorPos(d).y - p.y) < DOOR_W * 0.6);
        if (existing) this.edit((f) => (f.doors = f.doors.filter((d) => d.id !== existing.id)));
        else if (w?.door) {
          const door = w.door;
          this.edit((f) => f.doors.push({ id: newId(), x: door.x, y: door.y, angle: w.angle, width: DOOR_W }));
        }
        return;
      }
      case "open": {
        const openEl = target.closest("[data-open]") as SVGElement | null;
        if (openEl) {
          this.edit((f) => (f.doors = f.doors.filter((d) => d.id !== openEl.dataset.open)));
          return;
        }
        const w = nearestWall(floor, p.x, p.y);
        if (w && w.piece.width > 0.1) this.edit((f) => f.doors.push({ id: newId(), x: w.piece.x, y: w.piece.y, angle: w.angle, width: w.piece.width, open: true }));
        return;
      }
      case "wall": {
        const wallEl = target.closest("[data-wall]") as SVGElement | null;
        if (wallEl && !this.wallStart) {
          this.selWall = wallEl.dataset.wall;
          return;
        }
        this.selWall = undefined;
        const q = snapPoint(floor, p.x, p.y);
        if (!this.wallStart) {
          this.wallStart = q;
          return;
        }
        const s = this.wallStart;
        // Tapping the last corner again finishes the run of walls.
        if (Math.hypot(q.x - s.x, q.y - s.y) < 0.1) {
          this.wallStart = undefined;
          return;
        }
        this.edit((f) => (f.walls = [...(f.walls ?? []), { id: newId(), x1: s.x, y1: s.y, x2: q.x, y2: q.y }]));
        this.wallStart = q;
        return;
      }
      case "shape": {
        const q = snapPoint(floor, p.x, p.y);
        const pts = this.shapePts;
        if (pts.length >= 3 && Math.hypot(q.x - pts[0].x, q.y - pts[0].y) < 0.3) {
          this.finishShape();
          return;
        }
        if (pts.length && Math.hypot(q.x - pts[pts.length - 1].x, q.y - pts[pts.length - 1].y) < 0.05) return;
        this.shapePts = [...pts, q];
        return;
      }
      case "furniture": {
        const fEl = target.closest("[data-furn]") as SVGElement | null;
        const f = fEl ? floor.furniture?.find((x) => x.id === fEl.dataset.furn) : undefined;
        if (f) {
          this.selFurn = f.id;
          this.drag = { kind: "fmove", id: f.id, dx: p.x - f.x, dy: p.y - f.y, x: f.x, y: f.y };
          return;
        }
        if (this.placing) {
          const id = newId();
          const type = this.placing;
          const x = snap(p.x, 0.05);
          const y = snap(p.y, 0.05);
          this.edit((fl) => (fl.furniture = [...(fl.furniture ?? []), { id, type, x, y, rot: 0 }]));
          this.selFurn = id;
          this.placing = undefined;
          return;
        }
        this.selFurn = undefined;
        return;
      }
      case "photo": {
        const u = floor.underlay;
        if (u) this.drag = { kind: "photo", dx: p.x - u.x, dy: p.y - u.y, x: u.x, y: u.y };
        return;
      }
    }

    // Rooms: corners, edge midpoints, whole rooms, or a new rectangle.
    const sel = floor.rooms.find((r) => r.id === this.selected);
    const vEl = target.closest("[data-vertex]") as SVGElement | null;
    const mEl = target.closest("[data-mid]") as SVGElement | null;
    if (sel && vEl) {
      this.selVertex = Number(vEl.dataset.vertex);
      this.drag = { kind: "vertex", index: this.selVertex, room: shapeRoom(sel, roomPts(sel).map((q) => ({ ...q }))) };
      return;
    }
    if (sel && mEl) {
      // A new corner in the middle of that edge, straight into dragging it.
      const i = Number(mEl.dataset.mid);
      const pts = roomPts(sel).map((q) => ({ ...q }));
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      pts.splice(i + 1, 0, { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
      this.selVertex = i + 1;
      this.drag = { kind: "vertex", index: i + 1, room: shapeRoom(sel, pts) };
      return;
    }
    const roomEl = target.closest("[data-room]") as SVGElement | null;
    const r = roomEl ? floor.rooms.find((x) => x.id === roomEl.dataset.room) : undefined;
    if (r) {
      this.selected = r.id;
      this.selVertex = undefined;
      this.drag = { kind: "move", start: p, orig: r, room: r };
      return;
    }
    const x0 = snap(p.x);
    const y0 = snap(p.y);
    this.selected = undefined;
    this.selVertex = undefined;
    this.drag = { kind: "draw", x0, y0, rect: { id: newId(), x: x0, y: y0, w: 0, h: 0 } };
  };

  private move = (e: PointerEvent) => {
    const p = this.point(e);
    if (this.tool === "shape" || this.tool === "wall") this.cursor = snapPoint(this.floorOrEmpty, p.x, p.y);
    const d = this.drag;
    if (!d) return;
    switch (d.kind) {
      case "draw": {
        const x = snap(p.x);
        const y = snap(p.y);
        this.drag = { ...d, rect: { ...d.rect, x: Math.min(d.x0, x), y: Math.min(d.y0, y), w: Math.abs(x - d.x0), h: Math.abs(y - d.y0) } };
        return;
      }
      case "move": {
        const dx = snap(p.x - d.start.x, 0.05);
        const dy = snap(p.y - d.start.y, 0.05);
        const o = d.orig;
        this.drag = {
          ...d,
          room: { ...o, x: o.x + dx, y: o.y + dy, pts: o.pts?.map((q) => ({ x: q.x + dx, y: q.y + dy })) },
        };
        return;
      }
      case "vertex": {
        const q = snapPoint(this.without(d.room.id), p.x, p.y);
        const pts = roomPts(d.room).map((v, i) => (i === d.index ? q : v));
        this.drag = { ...d, room: shapeRoom(d.room, pts) };
        return;
      }
      case "photo":
      case "fmove":
        this.drag = { ...d, x: snap(p.x - d.dx, 0.05), y: snap(p.y - d.dy, 0.05) };
        return;
    }
  };

  private up = () => {
    const d = this.drag;
    this.drag = undefined;
    if (!d) return;
    switch (d.kind) {
      case "draw": {
        if (d.rect.w < 1 || d.rect.h < 1) return;
        const r = snapRect(d.rect, this.floorOrEmpty.rooms);
        this.selected = r.id;
        this.edit((f) => f.rooms.push(r));
        return;
      }
      case "move": {
        const others = this.without(d.room.id);
        if (!d.room.pts) {
          this.setRoom(snapRect(d.room, others.rooms));
          return;
        }
        // Pull the shape onto a neighbour's corner when one of its corners lands close to one.
        let fix = { x: 0, y: 0 };
        for (const v of d.room.pts) {
          const s = snapPoint(others, v.x, v.y, 0.3, 0.05);
          if (s.x !== snap(v.x, 0.05) || s.y !== snap(v.y, 0.05)) {
            fix = { x: s.x - v.x, y: s.y - v.y };
            break;
          }
        }
        this.setRoom(shapeRoom(d.room, d.room.pts.map((v) => ({ x: v.x + fix.x, y: v.y + fix.y }))));
        return;
      }
      case "vertex":
        this.setRoom(d.room);
        return;
      case "photo":
        this.edit((f) => f.underlay && ((f.underlay.x = d.x), (f.underlay.y = d.y)));
        return;
      case "fmove":
        this.edit((f) => (f.furniture = (f.furniture ?? []).map((x) => (x.id === d.id ? { ...x, x: d.x, y: d.y } : x))));
        return;
    }
  };

  private finishShape() {
    const pts = this.shapePts;
    if (pts.length < 3) return;
    const room = shapeRoom({ id: newId(), x: 0, y: 0, w: 0, h: 0 }, pts);
    this.edit((f) => f.rooms.push(room));
    this.shapePts = [];
    // Straight on to linking it to an area.
    this.tool = "room";
    this.selected = room.id;
  }

  private deleteVertex() {
    const r = this.floorOrEmpty.rooms.find((x) => x.id === this.selected);
    if (!r || this.selVertex === undefined) return;
    const pts = roomPts(r).filter((_, i) => i !== this.selVertex);
    if (pts.length < 3) return;
    this.setRoom(shapeRoom(r, pts));
    this.selVertex = undefined;
  }

  private setFurn(id: string, fn: (f: NonNullable<PlanFloor["furniture"]>[number]) => void) {
    this.edit((fl) => (fl.furniture = (fl.furniture ?? []).map((x) => (x.id === id ? (fn(x), x) : x))));
  }

  private furniturePanel() {
    const { t, lang, hass } = this.ctx;
    const sel = this.floor?.furniture?.find((f) => f.id === this.selFurn);
    const it = sel ? item(sel.type) : undefined;
    if (sel) {
      const opts = it?.domains ? entityOptions(this.ctx, it.domains) : [];
      const ceiling = it?.mount === "ceiling";
      const z = this.live.z ?? pieceZ(sel.type, sel.z);
      const scale = this.live.scale ?? sel.scale ?? 1;
      const clampZ = (v: number) => Math.min(2.5, Math.max(0, Math.round(v * 100) / 100));
      const clampS = (v: number) => Math.min(2.5, Math.max(0.4, Math.round(v * 100) / 100));
      const setZ = (v: number) => this.setFurn(sel.id, (f) => (f.z = clampZ(v)));
      const setScale = (v: number) => this.setFurn(sel.id, (f) => (f.scale = clampS(v)));
      const bumpZ = (dv: number) => this.setFurn(sel.id, (f) => (f.z = clampZ(pieceZ(f.type, f.z) + dv)));
      const bumpScale = (dv: number) => this.setFurn(sel.id, (f) => (f.scale = clampS((f.scale ?? 1) + dv)));
      const stretch = this.live.stretch ?? sel.stretch ?? 1;
      const clampL = (v: number) => Math.min(4, Math.max(0.25, Math.round(v * 100) / 100));
      const setLen = (v: number) => this.setFurn(sel.id, (f) => (f.stretch = clampL(v)));
      const bumpLen = (dv: number) => this.setFurn(sel.id, (f) => (f.stretch = clampL((f.stretch ?? 1) + dv)));
      const width = (it?.w ?? 0.5) * scale * stretch;
      return html`<div class="panel">
        <span class="fname">${itemName(sel.type, lang)}</span>
        <div class="rot">
          <button aria-label="-15°" @click=${() => this.setFurn(sel.id, (f) => (f.rot = ((f.rot || 0) - 15 + 360) % 360))}>${icon(mdiRotateLeft, 18)}</button>
          <button aria-label="90°" @click=${() => this.setFurn(sel.id, (f) => (f.rot = ((f.rot || 0) + 90) % 360))}>${icon(mdiRotate3dVariant, 18)}90°</button>
          <button aria-label="+15°" @click=${() => this.setFurn(sel.id, (f) => (f.rot = ((f.rot || 0) + 15) % 360))}>${icon(mdiRotateRight, 18)}</button>
        </div>
        ${it?.domains
          ? html`<label class="field inline grow">
              <span>${t("link_device")}</span>
              <select @change=${(e: Event) => {
                const v = (e.target as HTMLSelectElement).value || undefined;
                this.setFurn(sel.id, (f) => (f.entity = v));
              }}>
                <option value="" ?selected=${!sel.entity}>${t("none")}</option>
                ${opts.map((id) => html`<option value=${id} ?selected=${id === sel.entity}>${nameOf(hass, id)} · ${id}</option>`)}
              </select>
            </label>`
          : nothing}
        <button class="danger" @click=${() => {
          this.edit((fl) => (fl.furniture = (fl.furniture ?? []).filter((f) => f.id !== sel.id)));
          this.selFurn = undefined;
        }}>${icon(mdiDelete, 18)}</button>
        <div class="sliders">
          ${this.stepper(ceiling ? t("hang_down") : t("height_above_floor"), `${z.toFixed(2)} m`, z, 0, 2.5, 0.01, 0.05, "z", setZ, bumpZ)}
          ${this.stepper(t("size"), `${Math.round(scale * 100)}%`, scale, 0.4, 2.5, 0.05, 0.1, "scale", setScale, bumpScale)}
          ${this.stepper(t("length"), `${width.toFixed(2)} m`, stretch, 0.25, 4, 0.05, 0.1, "stretch", setLen, bumpLen)}
          <button class="reset" @click=${() => this.setFurn(sel.id, (f) => ((f.z = undefined), (f.scale = undefined), (f.stretch = undefined)))}>${t("reset")}</button>
        </div>
      </div>`;
    }
    return html`<div class="catalog">
      <div class="cats">
        <input
          class="search"
          type="search"
          placeholder=${t("search_furniture")}
          .value=${this.search}
          @input=${(e: Event) => (this.search = (e.target as HTMLInputElement).value)}
        />
        ${CATEGORIES.map(
          (c) => html`<button class=${c.key === this.category && !this.search ? "on" : ""} @click=${() => ((this.category = c.key), (this.search = ""))}>${c.name[lang]}</button>`,
        )}
      </div>
      <div class="items">
        ${CATALOG.filter((c) => {
          const q = this.search.trim().toLowerCase();
          return q ? c.name.en.toLowerCase().includes(q) || c.name.ar.includes(q) || c.type.includes(q) : c.category === this.category;
        }).map(
          (c) => html`<button class="item ${this.placing === c.type ? "on" : ""}" @click=${() => (this.placing = this.placing === c.type ? undefined : c.type)}>
            ${icon(c.icon, 26)}<span>${c.name[lang]}</span>
          </button>`,
        )}
      </div>
    </div>`;
  }

  private async upload(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    this.uploading = true;
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await this.ctx.hass.fetchWithAuth("/api/smartnest_pro/upload", { method: "POST", body });
      if (!res.ok) throw new Error(String(res.status));
      const { url } = await res.json();
      const v = this.view();
      this.edit((f) => (f.underlay = { url, x: v.x + 2, y: v.y + 2, width: 12, opacity: 0.5 }));
      this.tool = "photo";
    } catch {
      this.ctx.toast(this.ctx.t("upload_failed"));
    } finally {
      this.uploading = false;
    }
  }

  private addFloor() {
    const id = newId();
    this.ctx.update((d) => d.plan.floors.push({ id, name: this.ctx.t("floor_n", { n: d.plan.floors.length + 1 }), rooms: [], doors: [], walls: [], furniture: [] }));
    this.floorId = id;
    this.setTool(this.tool);
  }

  private removeFloor(id: string) {
    this.ctx.update((d) => (d.plan.floors = d.plan.floors.filter((f) => f.id !== id)));
    this.floorId = undefined;
    this.setTool(this.tool);
  }

  /** A slider with − and + buttons. Dragging only moves the number; the layout changes on release or a button press. */
  private stepper(
    label: string,
    shown: string,
    value: number,
    min: number,
    max: number,
    step: number,
    nudge: number,
    key: "wall" | "z" | "scale" | "stretch",
    commit: (v: number) => void,
    /** Adds to the saved value itself, so quick taps each count even before the screen catches up. */
    bump: (delta: number) => void,
  ) {
    return html`<div class="slider ${key === "wall" ? "wall" : ""}">
      <span>${label} <b>${shown}</b></span>
      <div class="step-row">
        <button class="nudge" aria-label="−" @click=${() => bump(-nudge)}>−</button>
        <input
          type="range"
          min=${min}
          max=${max}
          step=${step}
          .value=${String(value)}
          @input=${(e: Event) => (this.live = { ...this.live, [key]: Number((e.target as HTMLInputElement).value) })}
          @change=${(e: Event) => {
            commit(Number((e.target as HTMLInputElement).value));
            this.live = { ...this.live, [key]: undefined };
          }}
        />
        <button class="nudge" aria-label="+" @click=${() => bump(nudge)}>+</button>
      </div>
    </div>`;
  }

  private toolPanel() {
    const { t, hass } = this.ctx;
    const floor = this.floorOrEmpty;
    switch (this.tool) {
      case "shape":
        return html`<div class="panel">
          <span class="fname">${t("points_n", { n: this.shapePts.length })}</span>
          <button class="soft" ?disabled=${!this.shapePts.length} @click=${() => (this.shapePts = this.shapePts.slice(0, -1))}>${icon(mdiUndo, 18)}${t("undo_point")}</button>
          <button class="soft" ?disabled=${!this.shapePts.length} @click=${() => (this.shapePts = [])}>${icon(mdiClose, 18)}${t("cancel")}</button>
          <button class="ok" ?disabled=${this.shapePts.length < 3} @click=${() => this.finishShape()}>${icon(mdiCheck, 18)}${t("finish_room")}</button>
        </div>`;
      case "wall":
        return this.selWall
          ? html`<div class="panel">
              <span class="fname">${t("wall")}</span>
              <button class="danger" @click=${() => {
                const id = this.selWall;
                this.edit((f) => (f.walls = (f.walls ?? []).filter((w) => w.id !== id)));
                this.selWall = undefined;
              }}>${icon(mdiDelete, 18)}${t("delete")}</button>
            </div>`
          : this.wallStart
            ? html`<div class="panel">
                <button class="ok" @click=${() => (this.wallStart = undefined)}>${icon(mdiCheck, 18)}${t("done")}</button>
              </div>`
            : nothing;
      case "photo": {
        const u = floor.underlay;
        return html`<div class="panel">
          <label class="upload">
            ${icon(mdiImageOutline, 18)}${this.uploading ? t("uploading") : u ? t("change_image") : t("upload_plan_photo")}
            <input type="file" accept="image/png,image/jpeg,image/webp" hidden @change=${this.upload} />
          </label>
          ${u
            ? html`<label class="field inline"
                  ><span>${t("photo_width")}</span>
                  <input type="number" min="2" max="80" step="0.1" .value=${String(u.width)} @change=${(e: Event) =>
                    this.edit((f) => f.underlay && (f.underlay.width = Math.max(1, Number((e.target as HTMLInputElement).value) || u.width)))} />
                </label>
                <label class="field inline"
                  ><span>${t("photo_opacity")}</span>
                  <input type="range" min="0.1" max="1" step="0.05" .value=${String(u.opacity)} @input=${(e: Event) =>
                    this.edit((f) => f.underlay && (f.underlay.opacity = Number((e.target as HTMLInputElement).value)))} />
                </label>
                <button class="danger" @click=${() => this.edit((f) => (f.underlay = undefined))}>${icon(mdiDelete, 18)}</button>`
            : nothing}
        </div>`;
      }
      case "furniture":
        return this.furniturePanel();
      case "room": {
        const sel = floor.rooms.find((r) => r.id === this.selected);
        if (!sel) return nothing;
        const pts = roomPts(sel);
        return html`<div class="panel">
          <label class="field inline grow">
            <span>${t("pin_room")}</span>
            <select @change=${(e: Event) => {
              const area = (e.target as HTMLSelectElement).value || undefined;
              this.edit((f) => (f.rooms = f.rooms.map((r) => (r.id === sel.id ? { ...r, area } : r))));
            }}>
              <option value="" ?selected=${!sel.area}>${t("unlinked")}</option>
              ${areas(hass).map((a) => html`<option value=${a.area_id} ?selected=${a.area_id === sel.area}>${a.name}</option>`)}
            </select>
          </label>
          ${this.selVertex !== undefined && pts.length > 3
            ? html`<button class="soft" @click=${() => this.deleteVertex()}>${icon(mdiClose, 18)}${t("delete_point")}</button>`
            : nothing}
          <button class="danger" @click=${() => {
            this.edit((f) => (f.rooms = f.rooms.filter((r) => r.id !== sel.id)));
            this.selected = undefined;
          }}>${icon(mdiDelete, 18)}${t("delete")}</button>
        </div>`;
      }
      default:
        return nothing;
    }
  }

  render() {
    const { t, hass, config } = this.ctx;
    const floor = this.floorOrEmpty;
    const v = this.view();
    const d = this.drag;
    const liveRooms = floor.rooms.map((r) => (d && "room" in d && d.room.id === r.id ? d.room : r));
    if (d?.kind === "draw" && d.rect.w > 0 && d.rect.h > 0) liveRooms.push(d.rect);
    const preview: PlanFloor = { ...floor, rooms: liveRooms };
    const sel = liveRooms.find((r) => r.id === this.selected);
    const u = floor.underlay;
    const ux = d?.kind === "photo" ? d.x : u?.x;
    const uy = d?.kind === "photo" ? d.y : u?.y;
    const hints: Record<Tool, string> = {
      room: t("hint_room"),
      shape: t("hint_shape"),
      wall: t("hint_wall"),
      door: t("hint_door"),
      open: t("hint_open"),
      furniture: this.placing ? t("hint_place") : t("hint_furniture"),
      photo: t("hint_photo"),
    };
    const furn = (floor.furniture ?? []).map((f) => (d?.kind === "fmove" && d.id === f.id ? { ...f, x: d.x, y: d.y } : f));
    const tools: [Tool, string, string][] = [
      ["room", mdiSquareOutline, t("tool_room")],
      ["shape", mdiVectorPolygon, t("tool_shape")],
      ["wall", mdiWall, t("tool_wall")],
      ["door", mdiDoorOpen, t("tool_door")],
      ["open", mdiWallSconceFlatOutline, t("tool_open")],
      ["furniture", mdiSofaOutline, t("tool_furniture")],
      ["photo", mdiImageOutline, t("tool_photo")],
    ];
    const selPts = sel ? roomPts(sel) : [];

    return html`
      <div class="bar">
        <div class="floors">
          ${config.plan.floors.map(
            (f) => html`<button class=${f.id === this.floor?.id ? "on" : ""} @click=${() => ((this.floorId = f.id), this.setTool(this.tool))}>${f.name}</button>`,
          )}
          <button class="add" aria-label=${t("add_floor")} title=${t("add_floor")} @click=${this.addFloor}>${icon(mdiPlus, 18)}</button>
        </div>
        <div class="tools" role="group">
          ${tools.map(([k, ic, label]) => html`<button class=${this.tool === k ? "on" : ""} @click=${() => this.setTool(k)}>${icon(ic, 18)}${label}</button>`)}
        </div>
      </div>
      <p class="hint">${hints[this.tool]}</p>

      <svg
        class="board tool-${this.tool}"
        viewBox="${v.x} ${v.y} ${v.w} ${v.h}"
        @pointerdown=${this.down}
        @pointermove=${this.move}
        @pointerup=${this.up}
        @pointercancel=${this.up}
        @pointerleave=${() => (this.cursor = undefined)}
      >
        <defs>
          <pattern id="minor" width=${GRID * 2} height=${GRID * 2} patternUnits="userSpaceOnUse">
            <path d="M ${GRID * 2} 0 L 0 0 0 ${GRID * 2}" fill="none" class="g1"></path>
          </pattern>
          <pattern id="major" width="1" height="1" patternUnits="userSpaceOnUse">
            <rect width="1" height="1" fill="url(#minor)"></rect>
            <path d="M 1 0 L 0 0 0 1" fill="none" class="g2"></path>
          </pattern>
        </defs>
        <rect x=${v.x} y=${v.y} width=${v.w} height=${v.h} fill="url(#major)"></rect>
        ${u ? svg`<image href=${u.url} x=${ux} y=${uy} width=${u.width} opacity=${u.opacity} preserveAspectRatio="xMinYMin meet" class="underlay"></image>` : nothing}
        ${liveRooms.map((r) => {
          const name = r.area ? hass.areas?.[r.area]?.name ?? r.area : t("unlinked");
          const pts = roomPts(r);
          const c = innerPoint(r);
          const size = r.pts ? `${polyArea(pts).toFixed(1)} m²` : `${r.w.toFixed(2)} × ${r.h.toFixed(2)} m`;
          return svg`<g data-room=${r.id} class="room ${r.id === this.selected ? "sel" : ""} ${r.area ? "" : "loose"}">
            <polygon points=${polyAttr(pts)}></polygon>
            <text x=${c.x} y=${c.y} font-size=${Math.min(0.5, r.w / 6)}>${name}</text>
            <text class="dim" x=${c.x} y=${c.y + 0.5} font-size="0.32">${size}</text>
          </g>`;
        })}
        ${walls(preview).map((s) => svg`<line class="wall" x1=${s.x1} y1=${s.y1} x2=${s.x2} y2=${s.y2}></line>`)}
        ${(floor.walls ?? []).map(
          (w) => svg`<line data-wall=${w.id} class="wall-hit ${w.id === this.selWall ? "sel" : ""}" x1=${w.x1} y1=${w.y1} x2=${w.x2} y2=${w.y2}></line>`,
        )}
        ${openings(floor).map((o) => svg`<line data-open=${o.id} class="open-line" x1=${o.x1} y1=${o.y1} x2=${o.x2} y2=${o.y2}></line>`)}
        ${doorways(floor).map((o) => svg`<line class="door" x1=${o.x1} y1=${o.y1} x2=${o.x2} y2=${o.y2}></line>`)}
        ${furn.map((f) => {
          const it = item(f.type);
          const w = it?.w ?? 0.5;
          const dd = it?.d ?? 0.5;
          const s = (Math.min(w, dd) * 0.7) / 24;
          return svg`<g data-furn=${f.id} class="furn ${f.id === this.selFurn ? "sel" : ""} ${f.entity ? "linked" : ""}" transform="translate(${f.x} ${f.y}) rotate(${f.rot || 0}) scale(${(f.scale ?? 1) * (f.stretch ?? 1)} ${f.scale ?? 1})">
            <rect x=${-w / 2} y=${-dd / 2} width=${w} height=${dd} rx="0.05"></rect>
            ${it ? svg`<path d=${it.icon} transform="translate(${-12 * s} ${-12 * s}) scale(${s})"></path>` : nothing}
          </g>`;
        })}
        ${sel && this.tool === "room"
          ? svg`${selPts.map((q, i) => {
              const n = selPts[(i + 1) % selPts.length];
              return svg`<g data-mid=${i} class="mid"><circle cx=${(q.x + n.x) / 2} cy=${(q.y + n.y) / 2} r="0.2"></circle>
                <path d="M ${(q.x + n.x) / 2 - 0.1} ${(q.y + n.y) / 2} h 0.2 M ${(q.x + n.x) / 2} ${(q.y + n.y) / 2 - 0.1} v 0.2"></path></g>`;
            })}
            ${selPts.map((q, i) => svg`<circle data-vertex=${i} class="vertex ${i === this.selVertex ? "on" : ""}" cx=${q.x} cy=${q.y} r="0.26"></circle>`)}`
          : nothing}
        ${this.tool === "shape" && this.shapePts.length
          ? svg`<polyline class="draft" points=${polyAttr(this.cursor ? [...this.shapePts, this.cursor] : this.shapePts)}></polyline>
            ${this.shapePts.map((q, i) => svg`<circle class="ptdot ${i === 0 && this.shapePts.length >= 3 ? "close" : ""}" cx=${q.x} cy=${q.y} r=${i === 0 ? 0.24 : 0.15}></circle>`)}`
          : nothing}
        ${this.tool === "wall" && this.wallStart
          ? svg`<circle class="ptdot" cx=${this.wallStart.x} cy=${this.wallStart.y} r="0.18"></circle>
            ${this.cursor ? svg`<line class="draft-wall" x1=${this.wallStart.x} y1=${this.wallStart.y} x2=${this.cursor.x} y2=${this.cursor.y}></line>` : nothing}`
          : nothing}
        ${(this.tool === "shape" || this.tool === "wall") && this.cursor ? svg`<circle class="cursor" cx=${this.cursor.x} cy=${this.cursor.y} r="0.1"></circle>` : nothing}
      </svg>

      ${this.toolPanel()}

      ${this.floor
        ? html`<div class="panel floor">
            <label class="field inline grow">
              <span>${t("floor_name")}</span>
              <input type="text" .value=${this.floor.name} @change=${(e: Event) => this.edit((f) => (f.name = (e.target as HTMLInputElement).value || f.name))} />
            </label>
            ${(() => {
              const wall = this.live.wall ?? this.floor!.wallHeight ?? WALL_H;
              const clampW = (v: number) => Math.min(3, Math.max(0.5, Math.round(v * 100) / 100));
              return this.stepper(
                t("wall_height"),
                `${wall.toFixed(2)} m`,
                wall,
                0.5,
                3,
                0.05,
                0.05,
                "wall",
                (v) => this.edit((f) => (f.wallHeight = clampW(v))),
                (dv) => this.edit((f) => (f.wallHeight = clampW((f.wallHeight ?? WALL_H) + dv))),
              );
            })()}
            <button class="danger" @click=${() => this.removeFloor(this.floor!.id)}>${icon(mdiDelete, 18)}${t("delete_floor")}</button>
          </div>`
        : nothing}
    `;
  }

  static styles = [
    shared,
    fieldStyles,
    css`
      :host {
        display: grid;
        gap: 12px;
      }
      .bar {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: space-between;
      }
      .floors,
      .tools {
        display: flex;
        gap: 6px;
        padding: 5px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid var(--sn-glass-border);
      }
      .floors button,
      .tools button {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 36px;
        padding: 0 14px;
        border-radius: 999px;
        border: 0;
        background: none;
        color: var(--sn-text);
        font-size: 13px;
        cursor: pointer;
      }
      .floors button.on,
      .tools button.on {
        background: var(--sn-accent);
        color: #1d1b30;
      }
      .floors .add {
        padding: 0 10px;
      }
      .hint {
        margin: 0;
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .board {
        width: 100%;
        height: min(56vh, 560px);
        border-radius: 20px;
        background: rgba(0, 0, 0, 0.18);
        border: 1px solid var(--sn-glass-border);
        touch-action: none;
        cursor: crosshair;
        direction: ltr;
        user-select: none;
        -webkit-user-select: none;
      }
      .board.tool-photo {
        cursor: move;
      }
      .g1 {
        stroke: rgba(255, 255, 255, 0.06);
        stroke-width: 0.02;
      }
      .g2 {
        stroke: rgba(255, 255, 255, 0.14);
        stroke-width: 0.03;
      }
      .underlay {
        pointer-events: none;
      }
      .room polygon {
        fill: rgba(255, 255, 255, 0.1);
        stroke: rgba(255, 255, 255, 0.25);
        stroke-width: 0.03;
        cursor: move;
      }
      .room.loose polygon {
        fill: rgba(255, 180, 120, 0.1);
      }
      .room.sel polygon {
        fill: color-mix(in srgb, var(--sn-accent) 28%, transparent);
        stroke: var(--sn-accent);
        stroke-width: 0.06;
      }
      .room text {
        fill: var(--sn-text);
        text-anchor: middle;
        dominant-baseline: middle;
        pointer-events: none;
      }
      .room text.dim {
        fill: var(--sn-text-dim);
      }
      .wall {
        stroke: var(--sn-text);
        stroke-width: 0.12;
        stroke-linecap: square;
        pointer-events: none;
      }
      .door {
        stroke: var(--sn-warm, #ff8a3d);
        stroke-width: 0.12;
        stroke-dasharray: 0.12 0.1;
        pointer-events: none;
      }
      .furn {
        pointer-events: none;
      }
      .tool-furniture .furn {
        pointer-events: auto;
        cursor: move;
      }
      .furn rect {
        fill: rgba(255, 255, 255, 0.16);
        stroke: rgba(255, 255, 255, 0.45);
        stroke-width: 0.025;
      }
      .furn.linked rect {
        stroke: var(--sn-accent);
      }
      .furn.sel rect {
        fill: color-mix(in srgb, var(--sn-accent) 35%, transparent);
        stroke: var(--sn-accent);
        stroke-width: 0.05;
      }
      .furn path {
        fill: var(--sn-text);
        opacity: 0.85;
      }
      .sliders {
        flex-basis: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        gap: 18px;
      }
      .slider {
        display: grid;
        gap: 6px;
        flex: 1;
        min-width: 180px;
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .slider b {
        color: var(--sn-text);
        font-weight: 500;
        margin-inline-start: 6px;
      }
      .slider input {
        width: 100%;
        accent-color: var(--sn-accent-strong);
      }
      .slider.wall {
        max-width: 340px;
      }
      .step-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .nudge {
        flex: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text);
        font-size: 18px;
        cursor: pointer;
      }
      .reset {
        height: 38px;
        padding: 0 14px;
        border-radius: 12px;
        border: 1px solid var(--sn-glass-border);
        background: none;
        color: var(--sn-text-dim);
        cursor: pointer;
      }
      .search {
        flex: none;
        width: 170px;
        height: 34px;
        padding: 0 12px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(0, 0, 0, 0.18);
        color: var(--sn-text);
        font: inherit;
        font-size: 13px;
      }
      .catalog {
        display: grid;
        gap: 10px;
        padding: 12px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--sn-glass-border);
      }
      .cats {
        display: flex;
        gap: 6px;
        overflow-x: auto;
      }
      .cats button {
        height: 34px;
        padding: 0 14px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: none;
        color: var(--sn-text);
        font-size: 13px;
        cursor: pointer;
        white-space: nowrap;
      }
      .cats button.on {
        background: var(--sn-accent);
        color: #1d1b30;
        border-color: transparent;
      }
      .items {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
        gap: 8px;
        max-height: 260px;
        overflow-y: auto;
      }
      .item {
        display: grid;
        justify-items: center;
        gap: 6px;
        padding: 12px 6px;
        border-radius: 16px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.06);
        color: var(--sn-text);
        font-size: 12px;
        text-align: center;
        cursor: pointer;
      }
      .item.on {
        background: color-mix(in srgb, var(--sn-accent) 30%, transparent);
        border-color: var(--sn-accent);
      }
      .fname {
        font-size: 15px;
        align-self: center;
      }
      .rot {
        display: flex;
        gap: 6px;
      }
      .rot button {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 44px;
        padding: 0 12px;
        border-radius: 14px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text);
        cursor: pointer;
      }
      .handle {
        fill: #fff;
        stroke: var(--sn-accent-strong);
        stroke-width: 0.06;
        cursor: nwse-resize;
      }
      .panel {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        gap: 12px;
        padding: 12px 14px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--sn-glass-border);
      }
      .field.inline {
        margin: 0;
        min-width: 140px;
      }
      .field.grow {
        flex: 1;
      }
      .upload,
      .danger {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 44px;
        padding: 0 16px;
        border-radius: 14px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text);
        font-size: 14px;
        cursor: pointer;
      }
      .danger {
        background: #8a3b2e;
        border-color: transparent;
        color: #fff;
      }
      input[type="range"] {
        width: 160px;
        accent-color: var(--sn-accent-strong);
      }
      .wall-hit {
        stroke: transparent;
        stroke-width: 0.35;
        pointer-events: none;
      }
      .tool-wall .wall-hit {
        pointer-events: stroke;
        cursor: pointer;
      }
      .wall-hit.sel {
        stroke: color-mix(in srgb, var(--sn-accent) 55%, transparent);
      }
      .open-line {
        stroke: var(--sn-accent);
        stroke-width: 0.08;
        stroke-dasharray: 0.18 0.14;
        pointer-events: none;
      }
      .tool-open .open-line {
        pointer-events: stroke;
        stroke-width: 0.3;
        stroke-opacity: 0.6;
        cursor: pointer;
      }
      .vertex {
        fill: #fff;
        stroke: var(--sn-accent-strong);
        stroke-width: 0.06;
        cursor: move;
      }
      .vertex.on {
        fill: var(--sn-accent);
      }
      .mid circle {
        fill: rgba(255, 255, 255, 0.25);
        stroke: #fff;
        stroke-width: 0.03;
        cursor: copy;
      }
      .mid path {
        stroke: #fff;
        stroke-width: 0.04;
        pointer-events: none;
      }
      .draft,
      .draft-wall {
        fill: color-mix(in srgb, var(--sn-accent) 18%, transparent);
        stroke: var(--sn-accent);
        stroke-width: 0.08;
        stroke-dasharray: 0.2 0.12;
        pointer-events: none;
      }
      .draft-wall {
        stroke-width: 0.12;
        stroke-dasharray: none;
      }
      .ptdot {
        fill: var(--sn-accent);
        stroke: #fff;
        stroke-width: 0.04;
        pointer-events: none;
      }
      .ptdot.close {
        fill: #fff;
        stroke: var(--sn-accent-strong);
        stroke-width: 0.08;
      }
      .cursor {
        fill: #fff;
        pointer-events: none;
      }
      .tool-shape,
      .tool-wall,
      .tool-door,
      .tool-open {
        cursor: crosshair;
      }
      .tool-shape .room,
      .tool-wall .room,
      .tool-door .room,
      .tool-open .room,
      .tool-furniture .room {
        pointer-events: none;
      }
      .soft,
      .ok {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 44px;
        padding: 0 16px;
        border-radius: 14px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text);
        font-size: 14px;
        cursor: pointer;
      }
      .ok {
        background: var(--sn-accent);
        color: #1d1b30;
        border-color: transparent;
      }
      .soft:disabled,
      .ok:disabled {
        opacity: 0.4;
        cursor: default;
      }
      .tools {
        flex-wrap: wrap;
      }
    `,
  ];
}
