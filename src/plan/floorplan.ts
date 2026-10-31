import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  mdiAccountGroupOutline,
  mdiClose,
  mdiFloorPlan,
  mdiInformationOutline,
  mdiLightningBolt,
  mdiMagnifyMinusOutline,
  mdiMagnifyPlusOutline,
  mdiPalette,
  mdiPencilRuler,
  mdiPower,
  mdiTimerOutline,
  mdiTune,
  mdiFitToScreenOutline,
  mdiArrowExpand,
  mdiCrosshairsGps,
  mdiEyeOutline,
  mdiWall,
  mdiRotateLeft,
  mdiRotateRight,
} from "@mdi/js";
import type { Ctx } from "../ctx";
import type { PlanFloor } from "../types";
import { shared } from "../styles";
import { entityIcon, icon } from "../ui/icon";
import { noMenu, onHold, hasLevel } from "../ui/hold";
import { domainOf, entitiesIn, isOn, nameOf, since, toggle } from "../ha";
import { WALL_H, bounds, innerPoint, roomAt, roomPts } from "./geometry";
import { cameraAlerts, placedDevices, roomLive, type RoomLive } from "./live";
import type { Mark } from "./scene";
import type { PlanScene } from "./scene";
// Plain object (no three.js), so the menu can list views before the 3D code has loaded.
const VIEW_ANGLES = { top: 88, high: 66, normal: 52, low: 32, eye: 12 } as const;
type ViewKey = keyof typeof VIEW_ANGLES;
import { openPlanEditor } from "./editor";

const COLORS: [number, number, number][] = [
  [120, 160, 255],
  [255, 255, 255],
  [255, 214, 170],
  [255, 138, 61],
];
const TIMER_MINUTES = [15, 30, 60, 120];

/** Per-screen preferences (view angle, tap-to-zoom); storage can be missing in private mode, so never throw. */
const readPref = (k: string): string | null => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const writePref = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* not available: the choice just isn't remembered */
  }
};
const colorModeCount = (ring: string | undefined, id: string, normal: number) => (ring === `${id}|color` ? COLORS.length : normal);

/** The Home hero: the house as a live 3D plan. */
@customElement("sn-floorplan")
export class SnFloorplan extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  /** The expanded, near full-screen copy in a popup. */
  @property({ type: Boolean, reflect: true }) big = false;
  /**
   * Room picking (the robot's room picker): taps choose rooms instead of switching devices or zooming,
   * device icons are hidden, and picked rooms glow. Fires "room-pick" with the plan room id.
   */
  @property({ type: Boolean, reflect: true }) pick = false;
  @property({ attribute: false }) picked?: Set<string>;
  /** Rooms that can be picked; the rest are dimmed. */
  @property({ attribute: false }) pickable?: Set<string>;
  /** Show this floor (by id) instead of the floor tabs' choice. */
  @property() fixedFloor?: string;
  @state() private floorId?: string;
  @state() private ring?: string;
  @state() private timerMenu = false;
  @state() private timers: Record<string, number> = {};
  @state() private drag?: { id: string; x: number; y: number };
  @state() private failed = false;
  private scene?: PlanScene;
  private loading?: Promise<void>;
  private builtKey = "";
  private effectsKey = "";
  private alertsKey = "";
  private palette = "";
  private resize = new ResizeObserver(([e]) => this.scene?.resize(e.contentRect.width, e.contentRect.height));
  private pointers = new Map<number, { x: number; y: number }>();
  private gesture?: { moved: boolean; pinch?: number; twist?: number; rotate?: boolean; hold?: number; held?: boolean };
  /** When on, tapping a device glides to it and opens its controls instead of switching it. Per screen. */
  @state() private tapZoom = readPref("sn-plan-tapzoom") === "1";
  @state() private view: ViewKey = ((readPref("sn-plan-view") as ViewKey) in VIEW_ANGLES ? readPref("sn-plan-view") : "normal") as ViewKey;
  @state() private viewMenu = false;
  @state() private flat: boolean | undefined = readPref("sn-plan-flat") === null ? undefined : readPref("sn-plan-flat") === "1";
  private lastHass?: unknown;

  private get isFlat() {
    return this.flat ?? (this.ctx.config.settings as { plan_view?: string }).plan_view === "2d";
  }

  private get lightQuality() {
    const settings = this.ctx.config.settings as typeof this.ctx.config.settings & { performance?: string };
    if (settings.reduce_effects || settings.performance === "light") return true;
    if (settings.performance === "high") return false;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    return (typeof memory === "number" && memory <= 4) || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4);
  }

  private text(ar: string, en: string) { return this.ctx.lang === "ar" ? ar : en; }

  private summaryHass?: unknown;
  private summaryConfig?: unknown;
  private summaryCache = new Map<string, string>();

  private floorSummary(floor: PlanFloor) {
    if (this.summaryHass !== this.ctx.hass || this.summaryConfig !== this.ctx.config) {
      this.summaryHass = this.ctx.hass;
      this.summaryConfig = this.ctx.config;
      this.summaryCache.clear();
    }
    const cached = this.summaryCache.get(floor.id);
    if (cached !== undefined) return cached;
    const lives = this.lives(floor);
    const occupied = lives.filter(live => live.occupied).length;
    const ids = new Set(floor.rooms.flatMap(room => room.area ? entitiesIn(this.ctx.hass, room.area, this.ctx.config.rooms[room.area]?.hidden) : []));
    const lights = [...ids].filter(id => domainOf(id) === "light" && isOn(this.ctx.hass.states[id])).length;
    const summary = this.text(`${occupied} غرف مشغولة · ${lights} أضواء`, `${occupied} occupied · ${lights} lights`);
    this.summaryCache.set(floor.id, summary);
    return summary;
  }
  /** The room the camera is zoomed into, if any. */
  private focusRoom?: string;
  /** Where the ring sits when it was opened from a piece of furniture. */
  private ringAt?: { x: number; y: number };

  private get floor(): PlanFloor | undefined {
    const floors = this.ctx.config.plan.floors;
    return floors.find((f) => f.id === (this.fixedFloor ?? this.floorId)) ?? floors[0];
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.resize.disconnect();
    this.scene?.dispose();
    this.scene = undefined;
    this.loading = undefined;
    this.builtKey = "";
  }

  /** three.js is only fetched once there's a plan to show. */
  private async ensureScene() {
    if (this.scene || this.loading) return this.loading;
    const host = this.renderRoot.querySelector(".canvas") as HTMLElement | null;
    if (!host) return;
    this.loading = import("./scene")
      .then(({ PlanScene }) => {
        if (!this.isConnected) return;
        const scene = new PlanScene(host, this.ctx.palette, true);
        scene.onRender = () => this.requestUpdate();
        // TVs show what's on them on the Home plan, not in the robot's room picker.
        if (!this.pick) scene.hass = () => this.ctx.hass;
        this.scene = scene;
        const saved = Number(readPref("sn-plan-azimuth"));
        if (Number.isFinite(saved) && readPref("sn-plan-azimuth") !== null) scene.setAzimuth(saved);
        if (this.view !== "normal") scene.setElevation(VIEW_ANGLES[this.view], false);
        this.palette = this.ctx.palette;
        this.resize.observe(host);
        const r = host.getBoundingClientRect();
        scene.resize(r.width, r.height);
        this.sync();
      })
      .catch(() => {
        this.failed = true;
      });
    return this.loading;
  }

  updated() {
    if (this.floor?.rooms.length) this.ensureScene();
    this.sync();
  }

  /** Rebuilds the model when the plan changed, and repaints the effects when the house changed. */
  private sync() {
    const scene = this.scene;
    const floor = this.floor;
    if (!scene || !floor) return;
    scene.setQuality(this.lightQuality);
    scene.setFlatView(this.isFlat);
    if (this.palette !== this.ctx.palette) {
      this.palette = this.ctx.palette;
      scene.setPalette(this.ctx.palette);
      this.builtKey = "";
    }
    const key = JSON.stringify([floor.id, floor.rooms, floor.doors, floor.furniture, floor.walls, floor.wallHeight]);
    if (key !== this.builtKey) {
      this.builtKey = key;
      this.effectsKey = "";
      this.alertsKey = "";
      this.lastHass = undefined;
      scene.build(floor);
    }
    const lives = this.lives(floor);
    const alerts = this.pick ? [] : cameraAlerts(this.ctx.hass, floor);
    const marks: Record<string, Mark> = {};
    for (const a of alerts) if (a.roomId) marks[a.roomId] = "alert";
    if (this.pick)
      for (const r of floor.rooms) {
        if (this.picked?.has(r.id)) marks[r.id] = "on";
        else if (this.pickable && !this.pickable.has(r.id)) marks[r.id] = "dim";
      }
    const ek = JSON.stringify([lives, marks]);
    if (ek !== this.effectsKey) {
      this.effectsKey = ek;
      scene.setMarks(marks);
      scene.setEffects(lives);
    }
    const ak = alerts.map((a) => a.id).join();
    if (ak !== this.alertsKey) {
      this.alertsKey = ak;
      scene.setAlerts(new Set(alerts.map((a) => a.id)));
    }
    if (this.lastHass !== this.ctx.hass) {
      this.lastHass = this.ctx.hass;
      scene.setStates(this.ctx.hass.states);
    }
  }

  private lives(floor: PlanFloor): RoomLive[] {
    return floor.rooms.map((r) => roomLive(this.ctx.hass, this.ctx.config, r.id, r.area));
  }

  // ---------- pan, pinch, wheel, tap ----------

  private down = (e: PointerEvent) => {
    if ((e.target as Element).closest(".dev, .ring, .ui")) return;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.pointers.size === 1) {
      // Right mouse button or Shift + drag turns the view; on touch it's a two-finger twist.
      this.gesture = { moved: false, rotate: e.button === 2 || e.shiftKey };
      // Holding a linked piece of furniture opens its ring, like holding a device icon.
      const hit = !this.ctx.editing && !this.pick && this.scene ? this.pickAt(e) : undefined;
      if (hit?.entity) {
        const g = this.gesture;
        g.hold = window.setTimeout(() => {
          if (g.moved) return;
          g.held = true;
          navigator.vibrate?.(10);
          this.ringAt = this.scene!.piecePos(hit.id);
          this.openRing(hit.entity!);
        }, 450);
      }
    }
    if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()];
      this.gesture = { moved: true, pinch: Math.hypot(a.x - b.x, a.y - b.y), twist: Math.atan2(b.y - a.y, b.x - a.x) };
    }
  };

  private move = (e: PointerEvent) => {
    const prev = this.pointers.get(e.pointerId);
    if (!prev || !this.scene) return;
    const cur = { x: e.clientX, y: e.clientY };
    this.pointers.set(e.pointerId, cur);
    if (this.pointers.size === 2 && this.gesture?.pinch) {
      const [a, b] = [...this.pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      this.scene.zoomBy(d / this.gesture.pinch);
      this.gesture.pinch = d;
      const ang = Math.atan2(b.y - a.y, b.x - a.x);
      let delta = ang - (this.gesture.twist ?? ang);
      if (delta > Math.PI) delta -= 2 * Math.PI;
      if (delta < -Math.PI) delta += 2 * Math.PI;
      this.gesture.twist = ang;
      if (Math.abs(delta) > 0.002) this.scene.rotateBy((-delta * 180) / Math.PI, false);
      return;
    }
    const dx = cur.x - prev.x;
    const dy = cur.y - prev.y;
    if (this.gesture && !this.gesture.moved && Math.hypot(dx, dy) < 3) return;
    if (this.gesture) {
      this.gesture.moved = true;
      clearTimeout(this.gesture.hold);
    }
    if (this.gesture?.rotate) this.scene.rotateBy(dx * 0.4, false);
    else this.scene.pan(dx, dy);
  };

  private pickAt(e: PointerEvent) {
    const host = this.renderRoot.querySelector(".canvas")!.getBoundingClientRect();
    return this.scene!.pickFurniture(e.clientX - host.left, e.clientY - host.top);
  }

  private up = (e: PointerEvent) => {
    const g = this.gesture;
    if (g) clearTimeout(g.hold);
    if (g?.rotate || g?.twist !== undefined) this.saveAngle();
    const wasTap = this.pointers.size === 1 && g && !g.moved && !g.held;
    this.pointers.delete(e.pointerId);
    if (!wasTap || !this.scene || !this.floor) return;
    if (this.ring) {
      this.ring = undefined;
      return;
    }
    if (this.pick) {
      const host = this.renderRoot.querySelector(".canvas")!.getBoundingClientRect();
      const p = this.scene.unproject(e.clientX - host.left, e.clientY - host.top);
      const room = roomAt(this.floor, p.x, p.y);
      if (room && (!this.pickable || this.pickable.has(room.id)))
        this.dispatchEvent(new CustomEvent("room-pick", { detail: room.id, bubbles: true, composed: true }));
      return;
    }
    // A linked piece of furniture works its device: tap the AC to switch it, the lamp to light it.
    const hit = !this.ctx.editing ? this.pickAt(e) : undefined;
    if (hit?.entity && this.ctx.hass.states[hit.entity]) {
      // Cameras and sensors (the electric panel) have nothing to switch: a tap opens them.
      if (["camera", "sensor"].includes(domainOf(hit.entity))) {
        this.ctx.openEntity(hit.entity);
        return;
      }
      if (this.tapZoom) this.focusDevice(hit.entity, this.scene.piecePos(hit.id));
      else toggle(this.ctx.hass, hit.entity);
      return;
    }
    const host = this.renderRoot.querySelector(".canvas")!.getBoundingClientRect();
    const p = this.scene.unproject(e.clientX - host.left, e.clientY - host.top);
    const room = roomAt(this.floor, p.x, p.y);
    if (room && room.id !== this.focusRoom) {
      this.focusRoom = room.id;
      // On a tablet or desktop the room panel slides in over the plan's side: keep the room clear of it.
      const panel = this.ctx.phone || this.big ? 0 : Math.min(380, this.clientWidth * 0.42) / 2 + 8;
      this.scene.flyTo(room, this.floor, this.ctx.rtl ? -panel : panel);
      if (room.area) this.ctx.selectRoom(room.area);
    } else {
      this.unfocus();
    }
  };

  private saveAngle() {
    window.setTimeout(() => this.scene && writePref("sn-plan-azimuth", String(Math.round(this.scene.azimuthDeg * 10) / 10)), 600);
  }

  private rotate(deg: number) {
    this.scene?.rotateBy(deg);
    this.saveAngle();
  }

  /** Glides into the device's room, centred on the device, and opens its ring of controls. */
  private focusDevice(id: string, pos?: { x: number; y: number }) {
    const floor = this.floor;
    if (!floor || !pos || !this.scene) return;
    const room = roomAt(floor, pos.x, pos.y);
    this.focusRoom = room?.id;
    const panel = this.ctx.phone || this.big ? 0 : Math.min(380, this.clientWidth * 0.42) / 2 + 8;
    this.scene.flyTo(room, floor, this.ctx.rtl ? -panel : panel, pos);
    // On a phone the room sheet would cover the device; there the ring is enough.
    if (room?.area && !this.ctx.phone) this.ctx.selectRoom(room.area);
    this.ringAt = pos;
    this.openRing(id);
  }

  /** Wall height straight from the plan in edit mode, so it's one tap away rather than at the bottom of the editor. */
  private bumpWalls(floorId: string, delta: number) {
    this.ctx.update((d) => {
      const f = d.plan.floors.find((x) => x.id === floorId);
      if (f) f.wallHeight = Math.min(3, Math.max(0.5, Math.round(((f.wallHeight ?? WALL_H) + delta) * 100) / 100));
    });
  }

  /** Back to the whole floor (tapping outside the rooms, the same room again, or closing the room panel). */
  unfocus() {
    this.focusRoom = undefined;
    if (this.scene && this.floor) this.scene.flyTo(undefined, this.floor);
    this.dispatchEvent(new CustomEvent("unfocus"));
  }

  private wheel = (e: WheelEvent) => {
    e.preventDefault();
    this.scene?.zoomBy(e.deltaY < 0 ? 1.1 : 1 / 1.1);
  };

  // ---------- device icons ----------

  private devDown(e: PointerEvent, id: string) {
    e.stopPropagation();
    if (!this.ctx.editing) {
      onHold(e, () => {
        this.ringAt = undefined;
        this.openRing(id);
      });
      return;
    }
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const host = this.renderRoot.querySelector(".canvas")!.getBoundingClientRect();
    const move = (ev: PointerEvent) => {
      const p = this.scene!.unproject(ev.clientX - host.left, ev.clientY - host.top);
      this.drag = { id, x: p.x, y: p.y };
    };
    const up = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      const d = this.drag;
      this.drag = undefined;
      if (d && this.floor) {
        const floor = this.floor.id;
        this.ctx.update((cfg) => (cfg.plan.devices[d.id] = { floor, x: Math.round(d.x * 100) / 100, y: Math.round(d.y * 100) / 100 }));
      }
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  }

  private async openRing(id: string) {
    this.ring = id;
    this.timerMenu = false;
    try {
      this.timers = await this.ctx.hass.callWS<Record<string, number>>({ type: "smartnest_pro/timer/list" });
    } catch {
      this.timers = {};
    }
  }

  private setTimer(id: string, minutes?: number) {
    const hass = this.ctx.hass;
    if (minutes) hass.callWS({ type: "smartnest_pro/timer/set", entity_id: id, minutes }).catch(() => this.ctx.toast(this.ctx.t("save_failed")));
    else hass.callWS({ type: "smartnest_pro/timer/cancel", entity_id: id });
    this.timers = { ...this.timers, [id]: minutes ? minutes * 60 : 0 };
    this.timerMenu = false;
    if (minutes) this.ctx.toast(this.ctx.t("timer_set", { n: minutes }));
  }

  private ringView(id: string, left: number, top: number) {
    const { hass, t } = this.ctx;
    const s = hass.states[id];
    const d = domainOf(id);
    const on = isOn(s);
    const left_ = this.timers[id];
    type Btn = { icon: string; label: string; run: () => void; active?: boolean; color?: string };
    const btns: Btn[] = [];
    if (hasLevel(id, s)) btns.push({ icon: mdiTune, label: t("brightness"), run: () => ((this.ring = undefined), this.ctx.openLevel(id)) });
    if (d !== "lock" && d !== "vacuum") btns.push({ icon: mdiTimerOutline, label: t("timer"), active: !!left_, run: () => (this.timerMenu = !this.timerMenu) });
    if (d === "light" && (s.attributes.supported_color_modes ?? []).some((m: string) => ["hs", "rgb", "rgbw", "rgbww", "xy"].includes(m)))
      btns.push({ icon: mdiPalette, label: t("customize_color"), run: () => (this.timerMenu = false, this.ring = `${id}|color`) });
    btns.push({ icon: mdiInformationOutline, label: t("open_in_ha"), run: () => ((this.ring = undefined), this.ctx.openEntity(id)) });
    const colorMode = this.ring === `${id}|color`;
    // Buttons sit on an arc beside the device, like the reference: on its right, or its left near the right edge,
    // and swung lower when the device is close to the top.
    const R = 80;
    const width = (this.renderRoot.querySelector(".canvas") as HTMLElement | null)?.clientWidth ?? 600;
    const side = left > width * 0.62 ? -1 : 1;
    const step = 46;
    const count = colorModeCount(this.ring, id, btns.length);
    const start = top < 110 ? -10 : -((count - 1) * step) / 2;
    return html`<div class="ring" style="left:${left}px; top:${top}px" @pointerdown=${(e: Event) => e.stopPropagation()}>
      <span class="halo"></span>
      <button class="core ${on ? "on" : ""}" aria-label=${t("on")} @click=${() => toggle(hass, id)}>${icon(d === "light" ? mdiPower : entityIcon(id, s), 30)}</button>
      ${(colorMode
        ? COLORS.map((rgb): Btn => ({
            icon: "",
            label: `rgb(${rgb})`,
            color: `rgb(${rgb.join(",")})`,
            run: () => {
              hass.callService("light", "turn_on", { entity_id: id, rgb_color: rgb });
              this.ring = id;
            },
          }))
        : btns
      ).map((b, i) => {
        const a = ((start + i * step) * Math.PI) / 180;
        return html`<button
          class="orb ${b.active ? "active" : ""}"
          style="transform: translate(${side * Math.cos(a) * R}px, ${Math.sin(a) * R}px); animation-delay:${i * 40}ms; ${b.color ? `--swatch:${b.color}` : ""}"
          aria-label=${b.label}
          title=${b.label}
          @click=${b.run}
        >
          ${b.color ? html`<span class="swatch"></span>` : icon(b.icon, 18)}
        </button>`;
      })}
      ${this.timerMenu
        ? html`<div class="timer-menu">
            ${TIMER_MINUTES.map((m) => html`<button @click=${() => this.setTimer(id, m)}>${m < 60 ? `${m}m` : `${m / 60}h`}</button>`)}
            ${left_ ? html`<button class="off" @click=${() => this.setTimer(id)}>${icon(mdiClose, 14)}</button>` : nothing}
          </div>`
        : nothing}
      <span class="ring-name">${nameOf(hass, id)}${left_ ? html` · ${Math.ceil(left_ / 60)}m` : nothing}</span>
    </div>`;
  }

  // ---------- render ----------

  private placeholder() {
    const { t, isAdmin, phone, editing } = this.ctx;
    return html`<div class="placeholder glass">
      ${icon(mdiFloorPlan, 54)}
      <span>${t("draw_plan")}</span>
      ${isAdmin && !phone
        ? editing
          ? html`<button class="pill" @click=${() => openPlanEditor(this.ctx)}>${icon(mdiPencilRuler, 18)}${t("edit_plan")}</button>`
          : html`<small>${t("draw_plan_hint")}</small>`
        : nothing}
    </div>`;
  }

  render() {
    const { config, hass, t, editing, room } = this.ctx;
    const floor = this.floor;
    if (!floor || !floor.rooms.length) return this.placeholder();
    const scene = this.scene;
    const linked = new Set((floor.furniture ?? []).map((f) => f.entity).filter(Boolean));
    // Devices that have a piece of furniture are controlled through it: no floating icon on top.
    const devices = scene && !this.pick ? placedDevices(hass, config, floor).filter((d) => !linked.has(d.id)) : [];
    const lives = new Map(this.lives(floor).map((l) => [l.roomId, l]));
    const b = bounds(floor);
    const view = scene?.viewRect();
    const floors = config.plan.floors;
    const ringDev = this.ring?.split("|")[0];

    return html`
      <div class="canvas" @contextmenu=${(e: Event) => e.preventDefault()} @pointerdown=${this.down} @pointermove=${this.move} @pointerup=${this.up} @pointercancel=${this.up} @wheel=${this.wheel}>
        ${this.failed ? html`<div class="empty">${t("plan_failed")}</div>` : !scene ? html`<div class="plan-loading" role="status"><svg viewBox="${b.x - 1} ${b.y - 1} ${b.w + 2} ${b.h + 2}" aria-hidden="true">${floor.rooms.map(room => svg`<polygon points=${roomPts(room).map(point => `${point.x},${point.y}`).join(" ")}></polygon>`)}</svg><span>${this.text("عم نجهّز مخطط بيتك…", "Preparing your home plan…")}</span></div>` : nothing}
      </div>
      ${scene
        ? html`<div class="overlay">
            ${floor.rooms.map((r) => {
              const live = lives.get(r.id);
              if (!r.area || (config.pages.rooms?.hidden ?? []).includes(r.area)) return nothing;
              // Rectangles keep the label in their top strip (icons stay clear of it); shapes use an inner point.
              const lp = r.pts ? innerPoint(r) : { x: r.x + r.w / 2, y: r.y + 0.35 };
              const p = scene.project(lp.x, lp.y, 0.02);
              const name = hass.areas?.[r.area]?.name ?? r.area;
              return html`<div class="label ${r.area === room ? "sel" : ""}" style="left:${p.left}px; top:${p.top}px">
                <b>${name}</b>
                ${live?.temperature !== undefined ? html`<span>${live.temperature.toFixed(1)}°</span>` : nothing}
              </div>`;
            })}
            ${(floor.furniture ?? []).filter(piece => (piece as typeof piece & { label?: string }).label).map(piece => {
              const position = scene.project(piece.x, piece.y, (piece.z ?? 0) + 0.1);
              return html`<span class="piece-label" style="left:${position.left}px;top:${position.top}px">${(piece as typeof piece & { label?: string }).label}</span>`;
            })}
            ${floor.rooms.map((r) => {
              const live = lives.get(r.id);
              if (!live?.occupied || this.pick) return nothing;
              const c = innerPoint(r);
              const p = scene.project(c.x, c.y, 0.02);
              return html`<div class="presence" style="left:${p.left}px; top:${p.top}px">
                <span class="pulse"></span>
                ${live.people ? html`<span class="count">${icon(mdiAccountGroupOutline, 13)}${live.people}</span>` : nothing}
              </div>`;
            })}
            ${(this.pick ? [] : (floor.furniture ?? []).filter((f) => f.type === "electric_panel" && f.entity && hass.states[f.entity])).map((f) => {
              const w = Number(hass.states[f.entity!].state) * (hass.states[f.entity!].attributes.unit_of_measurement === "kW" ? 1000 : 1);
              if (!Number.isFinite(w)) return nothing;
              const p = scene.project(f.x, f.y, 0.75);
              return html`<button class="power" style="left:${p.left}px; top:${p.top}px" @click=${() => this.ctx.openEntity(f.entity!)}>
                ${icon(mdiLightningBolt, 13)}${w >= 1000 ? `${(w / 1000).toFixed(1)} kW` : `${Math.round(w)} W`}
              </button>`;
            })}
            ${(this.pick ? [] : cameraAlerts(hass, floor)).map((a) => {
              const p = scene.project(a.x, a.y, 0.9);
              // Kept inside the plan: an outdoor camera often sits right at its edge.
              const left = Math.min(Math.max(p.left, 86), this.clientWidth - 86);
              const top = Math.min(Math.max(p.top, 150), this.clientHeight - 10);
              return html`<button
                class="alert"
                style="left:${left}px; top:${top}px"
                @click=${() => a.camera && this.ctx.openEntity(a.camera)}
              >
                ${a.image ? html`<img src=${a.image} alt="" />` : nothing}
                <span><b>${t("person_seen")}</b>${a.camera ? nameOf(hass, a.camera) : ""}${a.since ? ` · ${since(a.since, this.ctx.lang)}` : ""}</span>
              </button>`;
            })}
            ${devices.map((d) => {
              const pos = this.drag?.id === d.id ? this.drag : d;
              const p = scene.project(pos.x, pos.y, 0.25);
              const s = hass.states[d.id];
              const on = isOn(s);
              const rgb = s?.attributes.rgb_color as number[] | undefined;
              return html`<button
                class="dev ${on ? "on" : ""} ${editing ? "editing" : ""} ${ringDev === d.id ? "ringed" : ""}"
                style="left:${p.left}px; top:${p.top}px; ${on && rgb ? `--glow: rgb(${rgb.join(",")})` : ""}"
                aria-label=${nameOf(hass, d.id)}
                title=${nameOf(hass, d.id)}
                @pointerdown=${(e: PointerEvent) => this.devDown(e, d.id)}
                @click=${() => !editing && (this.tapZoom ? this.focusDevice(d.id, d) : toggle(hass, d.id))}
                @contextmenu=${noMenu}
              >
                ${icon(entityIcon(d.id, s), 15)}
                ${this.timers[d.id] ? html`<span class="tdot"></span>` : nothing}
              </button>
              ${editing
                ? html`<button
                    class="dev-x"
                    style="left:${p.left + 14}px; top:${p.top - 14}px"
                    aria-label=${t("hide")}
                    @click=${() => this.ctx.update((cfg) => cfg.plan.hidden.push(d.id))}
                  >
                    ${icon(mdiClose, 11)}
                  </button>`
                : nothing}`;
            })}
            ${ringDev && (devices.some((d) => d.id === ringDev) || this.ringAt)
              ? (() => {
                  const d = devices.find((x) => x.id === ringDev) ?? this.ringAt!;
                  const p = scene.project(d.x, d.y, 0.45);
                  return this.ringView(ringDev, p.left, p.top);
                })()
              : nothing}
          </div>`
        : nothing}

      ${floors.length > 1 && !this.fixedFloor
        ? html`<div class="ui floors ${this.ctx.phone ? "top" : ""}">
            ${floors.map(
              (f) => html`<button class=${f.id === floor.id ? "on" : ""} title=${this.floorSummary(f)} @click=${() => ((this.floorId = f.id), (this.ring = undefined))}><span>${f.name}</span><small>${this.floorSummary(f)}</small></button>`,
            )}
          </div>`
        : nothing}

      <div class="ui tools">
        <button class="tool" aria-pressed=${this.isFlat} title=${this.text("تبديل عرض المخطط", "Switch plan view")} @click=${() => { this.flat = !this.isFlat; writePref("sn-plan-flat", this.flat ? "1" : "0"); this.scene?.setFlatView(this.flat); }}>${this.isFlat ? "2D" : "3D"}</button>
        ${editing && !this.pick
          ? html`<div class="walls" title=${t("wall_height")}>
                <button aria-label="−" @click=${() => this.bumpWalls(floor.id, -0.1)}>−</button>
                <span>${icon(mdiWall, 16)}${(floor.wallHeight ?? WALL_H).toFixed(2)} m</span>
                <button aria-label="+" @click=${() => this.bumpWalls(floor.id, 0.1)}>+</button>
              </div>
              <button class="tool wide" @click=${() => openPlanEditor(this.ctx)}>${icon(mdiPencilRuler, 18)}${t("edit_plan")}</button>`
          : nothing}
        ${this.pick ? nothing : html`<button
          class="tool ${this.tapZoom ? "on" : ""}"
          aria-pressed=${this.tapZoom}
          aria-label=${t("tap_zoom")}
          title=${this.tapZoom ? t("tap_zoom_on") : t("tap_zoom_off")}
          @click=${() => {
            this.tapZoom = !this.tapZoom;
            writePref("sn-plan-tapzoom", this.tapZoom ? "1" : "0");
            this.ctx.toast(this.tapZoom ? t("tap_zoom_on") : t("tap_zoom_off"));
          }}
        >
          ${icon(mdiCrosshairsGps, 20)}
        </button>`}
        <div class="view-wrap" ?hidden=${this.isFlat}>
          <button class="tool ${this.viewMenu ? "on" : ""}" aria-label=${t("view")} title=${t("view")} @click=${() => (this.viewMenu = !this.viewMenu)}>
            ${icon(mdiEyeOutline, 20)}
          </button>
          ${this.viewMenu
            ? html`<div class="view-menu">
                ${(Object.keys(VIEW_ANGLES) as ViewKey[]).map(
                  (k) => html`<button
                    class=${k === this.view ? "on" : ""}
                    @click=${() => {
                      this.view = k;
                      this.viewMenu = false;
                      writePref("sn-plan-view", k);
                      this.scene?.setElevation(VIEW_ANGLES[k], !this.ctx.config.settings.reduce_effects);
                    }}
                  >
                    <span class="angle" style="--a:${VIEW_ANGLES[k]}deg"></span>${t(`view_${k}` as const)}
                  </button>`,
                )}
              </div>`
            : nothing}
        </div>
        <button class="tool" ?hidden=${this.isFlat} aria-label=${t("rotate_left")} title=${t("rotate_left")} @click=${() => this.rotate(-45)}>${icon(mdiRotateLeft, 20)}</button>
        <button class="tool" ?hidden=${this.isFlat} aria-label=${t("rotate_right")} title=${t("rotate_right")} @click=${() => this.rotate(45)}>${icon(mdiRotateRight, 20)}</button>
        <button class="tool" aria-label="zoom in" @click=${() => scene?.zoomBy(1.25)}>${icon(mdiMagnifyPlusOutline, 20)}</button>
        <button class="tool" aria-label="zoom out" @click=${() => scene?.zoomBy(0.8)}>${icon(mdiMagnifyMinusOutline, 20)}</button>
        <button class="tool" aria-label="fit" @click=${() => scene?.reset(floor)}>${icon(mdiFitToScreenOutline, 20)}</button>
        ${this.big || this.pick
          ? nothing
          : html`<button
              class="tool"
              aria-label=${t("expand")}
              title=${t("expand")}
              @click=${() =>
                this.ctx.showSheet({
                  title: t("floor_plan"),
                  icon: mdiFloorPlan,
                  wide: true,
                  render: (c) => html`<sn-floorplan big .ctx=${c}></sn-floorplan>`,
                })}
            >
              ${icon(mdiArrowExpand, 20)}
            </button>`}
      </div>

      ${view && !this.ctx.phone && !this.pick
        ? html`<svg class="ui mini" viewBox="${b.x - 0.5} ${b.y - 0.5} ${b.w + 1} ${b.h + 1}" preserveAspectRatio="xMidYMid meet">
            ${floor.rooms.map((r) => svg`<polygon points=${roomPts(r).map((q) => `${q.x},${q.y}`).join(" ")} class=${r.area && r.area === room ? "sel" : ""}></polygon>`)}
            <rect class="view" x=${view.x} y=${view.y} width=${view.w} height=${view.h}></rect>
          </svg>`
        : nothing}
    `;
  }

  static styles = [
    shared,
    css`
      :host {
        position: relative;
        display: block;
        min-height: 0;
      }
      :host([big]) {
        height: min(74vh, 760px);
      }
      :host([pick]) {
        height: 300px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(0, 0, 0, 0.1);
      }
      :host([pick]) .tools {
        bottom: 8px;
        inset-inline-end: 8px;
        gap: 6px;
      }
      :host([pick]) .tool {
        min-width: 36px;
        height: 36px;
      }
      :host {
        overflow: hidden;
        border-radius: var(--sn-radius);
        -webkit-touch-callout: none;
        user-select: none;
      }
      .canvas {
        position: absolute;
        inset: 0;
        touch-action: none;
        cursor: grab;
      }
      .canvas:active {
        cursor: grabbing;
      }
      .overlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      .overlay > * {
        pointer-events: auto;
      }
      .label {
        position: absolute;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: baseline;
        gap: 6px;
        padding: 3px 10px;
        border-radius: 999px;
        background: rgba(20, 16, 40, 0.28);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        color: #fff;
        font-size: 11px;
        white-space: nowrap;
        pointer-events: none;
      }
      .label b {
        font-weight: 500;
      }
      .label span {
        opacity: 0.8;
      }
      .label.sel {
        background: var(--sn-accent);
        color: #1d1b30;
      }
      .power {
        position: absolute;
        transform: translate(-50%, -100%);
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 24px;
        padding: 0 10px;
        border-radius: 999px;
        border: 1px solid rgba(255, 210, 120, 0.5);
        background: rgba(20, 18, 16, 0.7);
        color: #ffd27a;
        font: inherit;
        font-size: 11px;
        font-variant-numeric: tabular-nums;
        cursor: pointer;
        pointer-events: auto;
      }
      .alert {
        position: absolute;
        transform: translate(-50%, calc(-100% - 10px));
        display: grid;
        width: 150px;
        padding: 0;
        border: 2px solid #ff4a3d;
        border-radius: 14px;
        overflow: hidden;
        background: rgba(20, 16, 15, 0.82);
        color: #fff;
        font: inherit;
        font-size: 11px;
        text-align: start;
        cursor: pointer;
        pointer-events: auto;
        box-shadow: 0 0 0 0 rgba(255, 74, 61, 0.6);
        animation: alert-ring 1.6s ease-out infinite;
        z-index: 3;
      }
      .alert img {
        width: 100%;
        aspect-ratio: 16 / 10;
        object-fit: cover;
        display: block;
      }
      .alert span {
        display: grid;
        gap: 1px;
        padding: 6px 9px;
        opacity: 0.85;
      }
      .alert b {
        color: #ff8a80;
        font-weight: 500;
        font-size: 12px;
      }
      @keyframes alert-ring {
        70% {
          box-shadow: 0 0 0 12px rgba(255, 74, 61, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(255, 74, 61, 0);
        }
      }
      .presence {
        position: absolute;
        width: 0;
        height: 0;
        pointer-events: none;
      }
      .pulse {
        position: absolute;
        left: -26px;
        top: -16px;
        width: 52px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid var(--sn-accent);
        animation: pulse 2.4s ease-out infinite;
      }
      @keyframes pulse {
        from {
          transform: scale(0.4);
          opacity: 0.9;
        }
        to {
          transform: scale(1.8);
          opacity: 0;
        }
      }
      .count {
        position: absolute;
        left: -18px;
        top: 14px;
        display: inline-flex;
        align-items: center;
        gap: 3px;
        padding: 2px 7px;
        border-radius: 999px;
        background: var(--sn-accent);
        color: #1d1b30;
        font-size: 11px;
        font-weight: 600;
      }
      .dev {
        position: absolute;
        transform: translate(-50%, -50%);
        display: grid;
        place-items: center;
        width: 30px;
        height: 30px;
        padding: 0;
        border-radius: 50%;
        border: 1.5px solid rgba(255, 255, 255, 0.85);
        background: rgba(30, 26, 60, 0.35);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        color: #fff;
        cursor: pointer;
        touch-action: none;
        transition: transform 0.2s ease, background 0.25s ease, box-shadow 0.25s ease;
      }
      .dev:active {
        transform: translate(-50%, -50%) scale(0.9);
      }
      .dev.on {
        background: var(--glow, #fff3d6);
        color: #2a2416;
        box-shadow: 0 0 18px var(--glow, rgba(255, 230, 170, 0.8));
      }
      .dev.editing {
        cursor: move;
        outline: 1.5px dashed rgba(255, 255, 255, 0.7);
        outline-offset: 3px;
      }
      .dev.ringed {
        opacity: 0;
      }
      .tdot {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--sn-warm, #ff8a3d);
        border: 2px solid #fff;
      }
      .dev-x {
        position: absolute;
        transform: translate(-50%, -50%);
        display: grid;
        place-items: center;
        width: 20px;
        height: 20px;
        padding: 0;
        border-radius: 50%;
        border: 1.5px solid #fff;
        background: #b5442f;
        color: #fff;
        cursor: pointer;
      }
      .ring {
        position: absolute;
        width: 0;
        height: 0;
        z-index: 5;
      }
      .halo {
        position: absolute;
        left: -82px;
        top: -82px;
        width: 164px;
        height: 164px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.35);
        background: radial-gradient(circle, rgba(140, 160, 255, 0.28), rgba(140, 160, 255, 0) 70%);
        animation: grow 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2);
      }
      .core {
        position: absolute;
        left: -32px;
        top: -32px;
        width: 64px;
        height: 64px;
        display: grid;
        place-items: center;
        padding: 0;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.9);
        background: rgba(40, 34, 90, 0.65);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: #fff;
        cursor: pointer;
        box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.6);
        animation: grow 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.3);
      }
      .core.on {
        background: var(--sn-warm, #ff8a3d);
        border-color: #fff;
        box-shadow: 0 0 30px var(--sn-warm, #ff8a3d);
      }
      .orb {
        position: absolute;
        left: -19px;
        top: -19px;
        width: 38px;
        height: 38px;
        display: grid;
        place-items: center;
        padding: 0;
        border-radius: 50%;
        border: 1.5px solid rgba(255, 255, 255, 0.85);
        background: rgba(255, 255, 255, 0.92);
        color: #2a2650;
        cursor: pointer;
        animation: pop 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.4) both;
      }
      .orb.active {
        background: var(--sn-warm, #ff8a3d);
        color: #fff;
      }
      .swatch {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: var(--swatch);
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
      }
      @keyframes grow {
        from {
          transform: scale(0.3);
          opacity: 0;
        }
      }
      @keyframes pop {
        from {
          opacity: 0;
          scale: 0.2;
        }
      }
      .timer-menu {
        position: absolute;
        left: 0;
        top: 74px;
        transform: translateX(-50%);
        display: flex;
        gap: 6px;
        padding: 6px;
        border-radius: 999px;
        background: var(--sn-glass-strong);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        border: 1px solid var(--sn-glass-border);
        animation: grow 0.25s ease;
      }
      .timer-menu button {
        height: 32px;
        min-width: 42px;
        padding: 0 10px;
        border-radius: 999px;
        border: 0;
        background: rgba(255, 255, 255, 0.12);
        color: var(--sn-text);
        font-size: 12px;
        cursor: pointer;
      }
      .timer-menu .off {
        display: grid;
        place-items: center;
        min-width: 32px;
        background: #b5442f;
      }
      .ring-name {
        position: absolute;
        left: 0;
        top: -62px;
        transform: translateX(-50%);
        padding: 4px 12px;
        border-radius: 999px;
        background: rgba(20, 16, 40, 0.55);
        color: #fff;
        font-size: 12px;
        white-space: nowrap;
      }
      .ui {
        position: absolute;
        z-index: 4;
      }
      /* Beside the minimap, leaving the bottom-right for the (longer, in edit mode) toolbar. */
      .piece-label { position: absolute; transform: translate(-50%, 12px); color: var(--sn-text); background: var(--sn-bg, #26232c); border: 1px solid var(--sn-glass-border); border-radius: 7px; padding: 3px 6px; font-size: 10px; pointer-events: none; white-space: nowrap; }
      .plan-loading { position: absolute; inset: 0; display: grid; place-items: center; padding: 36px; color: var(--sn-text-dim); font-size: 12px; pointer-events: none; }
      .plan-loading svg { width: 100%; height: 80%; fill: color-mix(in srgb, var(--sn-accent) 12%, transparent); stroke: var(--sn-text-dim); stroke-width: .05; }
      .floors small { display: block; font-size: 9px; font-weight: 400; opacity: .75; margin-top: 3px; }
      [hidden] { display: none !important; }
      .floors {
        bottom: 12px;
        inset-inline-start: 136px;
        display: flex;
        gap: 6px;
        padding: 5px;
        border-radius: 999px;
        background: var(--sn-glass);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        border: 1px solid var(--sn-glass-border);
      }
      .floors.top {
        top: 12px;
        bottom: auto;
        left: 12px;
        transform: none;
      }
      .floors button {
        height: 34px;
        padding: 0 14px;
        border-radius: 999px;
        border: 0;
        background: none;
        color: var(--sn-text);
        font-size: 13px;
        cursor: pointer;
      }
      .floors button.on {
        background: #fff;
        color: #1d1b30;
      }
      .tools {
        bottom: 12px;
        inset-inline-end: 12px;
        display: flex;
        gap: 8px;
      }
      .tool {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-width: 40px;
        height: 40px;
        padding: 0 10px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: var(--sn-glass);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        color: var(--sn-text-on-bg);
        cursor: pointer;
        font-size: 13px;
      }
      .view-wrap {
        position: relative;
      }
      .view-menu {
        position: absolute;
        bottom: 50px;
        inset-inline-end: 0;
        display: grid;
        gap: 4px;
        min-width: 170px;
        padding: 6px;
        border-radius: 18px;
        background: var(--sn-glass-strong);
        border: 1px solid var(--sn-glass-border);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        box-shadow: var(--sn-shadow);
        animation: grow 0.2s ease;
        transform-origin: bottom right;
      }
      .view-menu button {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 40px;
        padding: 0 12px;
        border-radius: 12px;
        border: 0;
        background: none;
        color: var(--sn-text);
        font-size: 14px;
        text-align: start;
        cursor: pointer;
      }
      .view-menu button.on {
        background: var(--sn-accent);
        color: #1d1b30;
      }
      /* A little line tilted at the view's angle, as a hint of what it looks like. */
      .angle {
        width: 18px;
        height: 2px;
        border-radius: 1px;
        background: currentColor;
        transform: rotate(calc(-1 * var(--a)));
      }
      .walls {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        height: 40px;
        padding: 0 4px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: var(--sn-glass);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        color: var(--sn-text-on-bg);
        font-size: 13px;
      }
      .walls span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 0 6px;
        white-space: nowrap;
      }
      .walls button {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 0;
        background: rgba(255, 255, 255, 0.12);
        color: inherit;
        font-size: 18px;
        cursor: pointer;
      }
      .tool.on {
        background: var(--sn-accent);
        color: #1d1b30;
        border-color: transparent;
        box-shadow: 0 0 14px var(--sn-accent-glow);
      }
      .tool.wide {
        padding: 0 16px;
        background: var(--sn-accent);
        color: #1d1b30;
        border-color: transparent;
      }
      .mini {
        bottom: 12px;
        inset-inline-start: 12px;
        width: 110px;
        height: 84px;
        padding: 6px;
        border-radius: 14px;
        background: var(--sn-glass);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        border: 1px solid var(--sn-glass-border);
        pointer-events: none;
      }
      .mini rect,
      .mini polygon {
        fill: none;
        stroke: var(--sn-text-on-bg);
        stroke-opacity: 0.7;
        stroke-width: 0.12;
      }
      .mini polygon.sel {
        fill: var(--sn-accent);
        fill-opacity: 0.35;
      }
      .mini rect.view {
        fill: rgba(255, 255, 255, 0.08);
        stroke: var(--sn-accent);
        stroke-width: 0.18;
        stroke-dasharray: 0.4 0.3;
      }
      .placeholder {
        position: absolute;
        inset: 0;
        margin: auto;
        width: min(340px, 90%);
        height: max-content;
        display: grid;
        justify-items: center;
        gap: 12px;
        padding: 32px 26px;
        text-align: center;
        color: var(--sn-text-dim);
      }
      .placeholder small {
        font-size: 12px;
        color: var(--sn-text-faint);
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 42px;
        padding: 0 18px;
        border-radius: 999px;
        border: 0;
        background: var(--sn-accent);
        color: #1d1b30;
        font-size: 14px;
        cursor: pointer;
      }
    `,
  ];
}
