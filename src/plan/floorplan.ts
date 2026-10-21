import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  mdiAccountGroupOutline,
  mdiClose,
  mdiFloorPlan,
  mdiInformationOutline,
  mdiMagnifyMinusOutline,
  mdiMagnifyPlusOutline,
  mdiPalette,
  mdiPencilRuler,
  mdiPower,
  mdiTimerOutline,
  mdiTune,
  mdiFitToScreenOutline,
  mdiArrowExpand,
} from "@mdi/js";
import type { Ctx } from "../ctx";
import type { PlanFloor } from "../types";
import { shared } from "../styles";
import { entityIcon, icon } from "../ui/icon";
import { noMenu, onHold, hasLevel } from "../ui/hold";
import { domainOf, isOn, nameOf, toggle } from "../ha";
import { bounds, innerPoint, roomAt, roomPts } from "./geometry";
import { placedDevices, roomLive, type RoomLive } from "./live";
import type { PlanScene } from "./scene";
import { openPlanEditor } from "./editor";

const COLORS: [number, number, number][] = [
  [120, 160, 255],
  [255, 255, 255],
  [255, 214, 170],
  [255, 138, 61],
];
const TIMER_MINUTES = [15, 30, 60, 120];
const colorModeCount = (ring: string | undefined, id: string, normal: number) => (ring === `${id}|color` ? COLORS.length : normal);

/** The Home hero: the house as a live 3D plan. */
@customElement("sn-floorplan")
export class SnFloorplan extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  /** The expanded, near full-screen copy in a popup. */
  @property({ type: Boolean, reflect: true }) big = false;
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
  private palette = "";
  private resize = new ResizeObserver(([e]) => this.scene?.resize(e.contentRect.width, e.contentRect.height));
  private pointers = new Map<number, { x: number; y: number }>();
  private gesture?: { moved: boolean; pinch?: number; hold?: number; held?: boolean };
  private lastHass?: unknown;
  /** The room the camera is zoomed into, if any. */
  private focusRoom?: string;
  /** Where the ring sits when it was opened from a piece of furniture. */
  private ringAt?: { x: number; y: number };

  private get floor(): PlanFloor | undefined {
    const floors = this.ctx.config.plan.floors;
    return floors.find((f) => f.id === this.floorId) ?? floors[0];
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
        const scene = new PlanScene(host, this.ctx.palette, !this.ctx.config.settings.reduce_effects);
        scene.onRender = () => this.requestUpdate();
        this.scene = scene;
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
    if (this.palette !== this.ctx.palette) {
      this.palette = this.ctx.palette;
      scene.setPalette(this.ctx.palette);
      this.builtKey = "";
    }
    const key = JSON.stringify([floor.id, floor.rooms, floor.doors, floor.furniture, floor.wallHeight]);
    if (key !== this.builtKey) {
      this.builtKey = key;
      this.effectsKey = "";
      this.lastHass = undefined;
      scene.build(floor);
    }
    const lives = this.lives(floor);
    const ek = JSON.stringify(lives);
    if (ek !== this.effectsKey) {
      this.effectsKey = ek;
      scene.setEffects(lives);
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
      this.gesture = { moved: false };
      // Holding a linked piece of furniture opens its ring, like holding a device icon.
      const hit = !this.ctx.editing && this.scene ? this.pick(e) : undefined;
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
      this.gesture = { moved: true, pinch: Math.hypot(a.x - b.x, a.y - b.y) };
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
      return;
    }
    const dx = cur.x - prev.x;
    const dy = cur.y - prev.y;
    if (this.gesture && !this.gesture.moved && Math.hypot(dx, dy) < 3) return;
    if (this.gesture) {
      this.gesture.moved = true;
      clearTimeout(this.gesture.hold);
    }
    this.scene.pan(dx, dy);
  };

  private pick(e: PointerEvent) {
    const host = this.renderRoot.querySelector(".canvas")!.getBoundingClientRect();
    return this.scene!.pickFurniture(e.clientX - host.left, e.clientY - host.top);
  }

  private up = (e: PointerEvent) => {
    const g = this.gesture;
    if (g) clearTimeout(g.hold);
    const wasTap = this.pointers.size === 1 && g && !g.moved && !g.held;
    this.pointers.delete(e.pointerId);
    if (!wasTap || !this.scene || !this.floor) return;
    if (this.ring) {
      this.ring = undefined;
      return;
    }
    // A linked piece of furniture works its device: tap the AC to switch it, the lamp to light it.
    const hit = !this.ctx.editing ? this.pick(e) : undefined;
    if (hit?.entity && this.ctx.hass.states[hit.entity]) {
      toggle(this.ctx.hass, hit.entity);
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
    const devices = scene ? placedDevices(hass, config, floor).filter((d) => !linked.has(d.id)) : [];
    const lives = new Map(this.lives(floor).map((l) => [l.roomId, l]));
    const b = bounds(floor);
    const view = scene?.viewRect();
    const floors = config.plan.floors;
    const ringDev = this.ring?.split("|")[0];

    return html`
      <div class="canvas" @pointerdown=${this.down} @pointermove=${this.move} @pointerup=${this.up} @pointercancel=${this.up} @wheel=${this.wheel}>
        ${this.failed ? html`<div class="empty">${t("plan_failed")}</div>` : nothing}
      </div>
      ${scene
        ? html`<div class="overlay">
            ${floor.rooms.map((r) => {
              const live = lives.get(r.id);
              if (!r.area) return nothing;
              // Rectangles keep the label in their top strip (icons stay clear of it); shapes use an inner point.
              const lp = r.pts ? innerPoint(r) : { x: r.x + r.w / 2, y: r.y + 0.35 };
              const p = scene.project(lp.x, lp.y, 0.02);
              const name = hass.areas?.[r.area]?.name ?? r.area;
              return html`<div class="label ${r.area === room ? "sel" : ""}" style="left:${p.left}px; top:${p.top}px">
                <b>${name}</b>
                ${live?.temperature !== undefined ? html`<span>${live.temperature.toFixed(1)}°</span>` : nothing}
              </div>`;
            })}
            ${floor.rooms.map((r) => {
              const live = lives.get(r.id);
              if (!live?.occupied) return nothing;
              const c = innerPoint(r);
              const p = scene.project(c.x, c.y, 0.02);
              return html`<div class="presence" style="left:${p.left}px; top:${p.top}px">
                <span class="pulse"></span>
                ${live.people ? html`<span class="count">${icon(mdiAccountGroupOutline, 13)}${live.people}</span>` : nothing}
              </div>`;
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
                @click=${() => !editing && toggle(hass, d.id)}
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

      ${floors.length > 1
        ? html`<div class="ui floors ${this.ctx.phone ? "top" : ""}">
            ${floors.map(
              (f) => html`<button class=${f.id === floor.id ? "on" : ""} @click=${() => ((this.floorId = f.id), (this.ring = undefined))}>${f.name}</button>`,
            )}
          </div>`
        : nothing}

      <div class="ui tools">
        ${editing ? html`<button class="tool wide" @click=${() => openPlanEditor(this.ctx)}>${icon(mdiPencilRuler, 18)}${t("edit_plan")}</button>` : nothing}
        <button class="tool" aria-label="zoom in" @click=${() => scene?.zoomBy(1.25)}>${icon(mdiMagnifyPlusOutline, 20)}</button>
        <button class="tool" aria-label="zoom out" @click=${() => scene?.zoomBy(0.8)}>${icon(mdiMagnifyMinusOutline, 20)}</button>
        <button class="tool" aria-label="fit" @click=${() => scene?.reset(floor)}>${icon(mdiFitToScreenOutline, 20)}</button>
        ${this.big
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

      ${view && !this.ctx.phone
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
      .floors {
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
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
