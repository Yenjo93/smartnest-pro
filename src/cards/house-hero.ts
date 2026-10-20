import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { mdiHomeModern, mdiImageEditOutline, mdiImageRemoveOutline, mdiMapMarkerPlusOutline } from "@mdi/js";
import type { Ctx } from "../ctx";
import type { Pin } from "../types";
import { shared } from "../styles";
import { entityIcon, icon } from "../ui/icon";
import { domainOf, isOn, nameOf, powerKw, roomInfo, toggle, unavailable } from "../ha";
import { newId } from "../config";
import { pinLabel, pinSettings } from "../settings";
import { hasLevel, noMenu, onHold } from "../ui/hold";

/**
 * The house picture with floating pins. Pins sit at x%/y% of the image itself (not the box around it),
 * so they stay on the same window or roof at any screen size. Edit mode drags them and swaps the picture.
 */
@customElement("sn-house-hero")
export class SnHouseHero extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @state() private dragging?: { id: string; x: number; y: number };
  @state() private uploading = false;
  /** The picture's fitted size: the frame is sized to it exactly, so pin percentages land on the picture. */
  @state() private fit?: { w: number; h: number };
  private moved = false;
  private resize = new ResizeObserver(() => this.measure());

  connectedCallback() {
    super.connectedCallback();
    this.resize.observe(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.resize.disconnect();
  }

  private measure() {
    const img = this.img;
    const stage = this.renderRoot.querySelector(".stage") as HTMLElement | null;
    if (!img?.naturalWidth || !stage) return;
    const scale = Math.min(stage.clientWidth / img.naturalWidth, stage.clientHeight / img.naturalHeight);
    const w = Math.floor(img.naturalWidth * scale);
    const h = Math.floor(img.naturalHeight * scale);
    if (w !== this.fit?.w || h !== this.fit?.h) this.fit = { w, h };
  }

  private get img() {
    return this.renderRoot.querySelector("img.house") as HTMLImageElement | null;
  }

  private placeholder() {
    const { t, isAdmin, phone } = this.ctx;
    return html`<div class="placeholder glass">
      ${icon(mdiHomeModern, 54)}
      <span>${t("upload_house")}</span>
      ${isAdmin && !phone ? html`<small>${t("upload_house_hint")}</small>` : nothing}
    </div>`;
  }

  private status(pin: Pin): string | undefined {
    const { hass, config, t } = this.ctx;
    if (pin.area) {
      const r = roomInfo(hass, pin.area, config.rooms[pin.area]);
      const bits = [r.temperature !== undefined ? `${r.temperature.toFixed(1)}°C` : "", r.nodes.length ? t("devices_count", { n: r.nodes.length }) : ""];
      return bits.filter(Boolean).join(" · ") || undefined;
    }
    if (pin.entity) {
      const s = hass.states[pin.entity];
      if (unavailable(s)) return undefined;
      const d = domainOf(pin.entity);
      if (d === "lock") return s!.state === "locked" ? t("locked") : t("unlocked");
      if (d === "sensor" && s!.attributes.device_class === "power") {
        const kw = powerKw(s);
        return kw !== undefined ? `${kw.toFixed(1)}kW` : undefined;
      }
      if (d === "sensor") return `${s!.state}${s!.attributes.unit_of_measurement ? ` ${s!.attributes.unit_of_measurement}` : ""}`;
      if (d === "climate") return s!.attributes.current_temperature !== undefined ? `${s!.attributes.current_temperature}°C` : s!.state;
      return isOn(s) ? t("on") : t("off");
    }
    return undefined;
  }

  private tap(pin: Pin) {
    if (this.ctx.editing) {
      if (!this.moved) pinSettings(this.ctx, pin.id);
      return;
    }
    if (pin.area) this.ctx.selectRoom(pin.area);
    else if (pin.entity) {
      const d = domainOf(pin.entity);
      if (["light", "switch", "fan", "cover", "lock"].includes(d)) toggle(this.ctx.hass, pin.entity);
      else this.ctx.openEntity(pin.entity);
    }
  }

  private pointFromEvent(e: PointerEvent) {
    const r = this.img!.getBoundingClientRect();
    return {
      x: Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)),
      y: Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)),
    };
  }

  private down(e: PointerEvent, pin: Pin) {
    if (!this.ctx.editing) {
      const id = pin.entity;
      if (id && hasLevel(id, this.ctx.hass.states[id])) onHold(e, () => this.ctx.openLevel(id));
      return;
    }
    if (!this.img) return;
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    this.moved = false;
    const startX = e.clientX;
    const startY = e.clientY;
    const move = (ev: PointerEvent) => {
      if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > 4) this.moved = true;
      if (this.moved) this.dragging = { id: pin.id, ...this.pointFromEvent(ev) };
    };
    const up = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      const d = this.dragging;
      if (d) {
        this.ctx.update((draft) => {
          const p = draft.hero.pins.find((x) => x.id === d.id);
          if (p) {
            p.x = Math.round(d.x * 10) / 10;
            p.y = Math.round(d.y * 10) / 10;
          }
        });
      }
      this.dragging = undefined;
      // The click that follows a drag must not open the pin's settings.
      setTimeout(() => (this.moved = false), 0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  }

  private addPin() {
    const id = newId();
    this.ctx.update((d) => d.hero.pins.push({ id, x: 50, y: 50 }));
    pinSettings(this.ctx, id);
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
      this.ctx.update((d) => (d.hero.image = url));
    } catch {
      this.ctx.toast(this.ctx.t("upload_failed"));
    } finally {
      this.uploading = false;
    }
  }

  private pinIcon(pin: Pin) {
    if (pin.entity) return entityIcon(pin.entity, this.ctx.hass.states[pin.entity]);
    return undefined;
  }

  render() {
    const { config, editing, t, hass, room } = this.ctx;
    return html`
      <div class="stage">
        ${config.hero.image ? html`<div class="frame" style=${this.fit ? `width:${this.fit.w}px;height:${this.fit.h}px` : "visibility:hidden"}>
          <img class="house" src=${config.hero.image} alt="" draggable="false" @load=${() => this.measure()} />
          ${config.hero.pins.map((pin) => {
            const pos = this.dragging?.id === pin.id ? this.dragging : pin;
            const active = (pin.area && pin.area === room) || (pin.entity && isOn(hass.states[pin.entity]));
            const status = this.status(pin);
            const ic = this.pinIcon(pin);
            return html`<button
              class="pin ${active ? "active" : ""} ${editing ? "editing" : ""} ${pos.x > 70 ? "flip" : ""}"
              style="left:${pos.x}%; top:${pos.y}%"
              @pointerdown=${(e: PointerEvent) => this.down(e, pin)}
              @contextmenu=${noMenu}
              @click=${() => this.tap(pin)}
            >
              <span class="dot">${ic ? icon(ic, 16) : html`<span class="core"></span>`}</span>
              <span class="label"><b>${pinLabel(this.ctx, pin)}</b>${status ? html`<i>${status}</i>` : nothing}</span>
            </button>`;
          })}
        </div>` : this.placeholder()}
      </div>
      ${editing
        ? html`<div class="tools">
            <button class="tool" @click=${this.addPin}>${icon(mdiMapMarkerPlusOutline, 18)}${t("add_pin")}</button>
            <label class="tool">
              ${icon(mdiImageEditOutline, 18)}${this.uploading ? t("uploading") : t("change_image")}
              <input type="file" accept="image/png,image/jpeg,image/webp" hidden @change=${this.upload} />
            </label>
            ${config.hero.image
              ? html`<button class="tool" @click=${() => this.ctx.update((d) => (d.hero.image = undefined))}>
                  ${icon(mdiImageRemoveOutline, 18)}${t("reset_image")}
                </button>`
              : nothing}
          </div>`
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
      .stage {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
      }
      .frame {
        position: relative;
        direction: ltr;
      }
      .house {
        display: block;
        width: 100%;
        height: 100%;
        user-select: none;
        -webkit-user-drag: none;
        /* Soft edges so any render, beige or not, melts into the backdrop in both themes. */
        filter: var(--sn-hero-filter);
        -webkit-mask-image: radial-gradient(closest-side, #000 var(--sn-hero-fade), transparent 100%);
        mask-image: radial-gradient(closest-side, #000 var(--sn-hero-fade), transparent 100%);
        -webkit-mask-size: 118% 118%;
        mask-size: 118% 118%;
        -webkit-mask-position: center;
        mask-position: center;
      }
      .pin {
        position: absolute;
        transform: translate(-22px, -50%);
        display: flex;
        align-items: center;
        gap: 10px;
        height: 46px;
        padding: 0 16px 0 5px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.35);
        background: rgba(120, 112, 104, 0.42);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        box-shadow: 0 10px 24px -10px rgba(30, 24, 18, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        color: #fff;
        cursor: pointer;
        white-space: nowrap;
        touch-action: none;
        -webkit-touch-callout: none;
        user-select: none;
        transition: background 0.2s ease, transform 0.2s ease;
      }
      .pin.flip {
        transform: translate(calc(-100% + 22px), -50%);
        flex-direction: row-reverse;
        padding: 0 5px 0 16px;
      }
      .pin.editing {
        cursor: grab;
        outline: 1.5px dashed rgba(255, 255, 255, 0.7);
        outline-offset: 3px;
      }
      .dot {
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.18);
        border: 1px solid rgba(255, 255, 255, 0.35);
      }
      .core {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
      }
      .pin.active .dot {
        background: var(--sn-accent);
        color: #1d2a12;
        box-shadow: 0 0 18px var(--sn-accent-glow);
      }
      .pin.active .core {
        border-color: #1d2a12;
      }
      .label {
        display: flex;
        align-items: baseline;
        gap: 6px;
        font-size: 13px;
      }
      .label b {
        font-weight: 500;
      }
      .label i {
        font-style: normal;
        font-size: 11px;
        opacity: 0.75;
      }
      .tools {
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        padding: 6px;
        border-radius: 999px;
        background: var(--sn-glass-strong);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        border: 1px solid var(--sn-glass-border);
      }
      .tool {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 40px;
        padding: 0 14px;
        border: 0;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.1);
        color: var(--sn-text);
        font-size: 13px;
        cursor: pointer;
        white-space: nowrap;
      }
      .placeholder {
        display: grid;
        justify-items: center;
        gap: 10px;
        max-width: 320px;
        padding: 34px 28px;
        text-align: center;
        color: var(--sn-text-dim);
        font-size: 15px;
      }
      .placeholder small {
        font-size: 12px;
        color: var(--sn-text-faint);
      }
      @media (max-width: 600px) {
        .pin {
          height: 36px;
          padding-inline-end: 10px;
          gap: 6px;
        }
        .dot {
          width: 28px;
          height: 28px;
        }
        .label i {
          display: none;
        }
      }
    `,
  ];
}
