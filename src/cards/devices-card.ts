import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { mdiCog, mdiDevices, mdiTune } from "@mdi/js";
import type { Ctx } from "../ctx";
import type { HassEntity } from "../types";
import { shared } from "../styles";
import { entityIcon, icon } from "../ui/icon";
import { domainOf, isOn, nameOf, toggle, unavailable } from "../ha";
import { devicesSettings } from "../settings";
import { hasLevel, noMenu, onHold } from "../ui/hold";

/** Opens Home Assistant's own device dialog. */
export const moreInfo = (el: Element, entityId: string) =>
  el.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));

const COLOR_MODES = ["hs", "rgb", "rgbw", "rgbww", "xy"];
const isColor = (s: HassEntity) => (s.attributes.supported_color_modes ?? []).some((m: string) => COLOR_MODES.includes(m));
const isDimmable = (s: HassEntity) => (s.attributes.supported_color_modes ?? []).some((m: string) => m !== "onoff");

/** Drag across an element to pick 0..1; the value is sent on release. */
function dragFraction(e: PointerEvent, rtl: boolean, onMove: (f: number) => void, onDone: (f: number) => void) {
  const el = e.currentTarget as HTMLElement;
  const r = el.getBoundingClientRect();
  const frac = (ev: PointerEvent) => {
    const f = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
    return rtl ? 1 - f : f;
  };
  el.setPointerCapture(e.pointerId);
  let last = frac(e);
  onMove(last);
  const move = (ev: PointerEvent) => onMove((last = frac(ev)));
  const up = () => {
    el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerup", up);
    el.removeEventListener("pointercancel", up);
    onDone(last);
  };
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerup", up);
  el.addEventListener("pointercancel", up);
}

@customElement("sn-devices-card")
export class SnDevicesCard extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  /** Live value while a slider is dragged, keyed by entity. */
  @state() private live: Record<string, number> = {};

  private setLive(id: string, v?: number) {
    const next = { ...this.live };
    if (v === undefined) delete next[id];
    else next[id] = v;
    this.live = next;
  }

  private head(id: string, s: HassEntity) {
    return html`<div class="tile-head">
      <button class="name" @click=${() => toggle(this.ctx.hass, id)}>${nameOf(this.ctx.hass, id)}</button>
      <button class="round gear" aria-label=${this.ctx.t("settings")} @click=${() => moreInfo(this, id)}>${icon(mdiTune, 18)}</button>
    </div>`;
  }

  private lamp(id: string, s: HassEntity) {
    const { t, hass, rtl } = this.ctx;
    const live = this.live[id];
    const clip = `clip-${id.replace(/\W/g, "_")}`;
    const pct = live !== undefined ? Math.round(live * 100) : isOn(s) ? Math.round(((s.attributes.brightness ?? 255) / 255) * 100) : 0;
    return html`<div class="tile ${isOn(s) ? "on" : ""}">
      ${this.head(id, s)}
      <div class="pct">${pct}<small>%</small></div>
      <div class="sub">${t("intensity")}</div>
      <div
        class="ramp"
        @pointerdown=${(e: PointerEvent) =>
          dragFraction(e, rtl, (f) => this.setLive(id, f), (f) => {
            hass.callService("light", "turn_on", { entity_id: id, brightness_pct: Math.max(1, Math.round(f * 100)) });
            setTimeout(() => this.setLive(id), 1200);
          })}
      >
        <svg viewBox="0 0 100 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id="rg" x1="0" x2="1">
              <stop offset="0" stop-color="#b5dc8f" stop-opacity="0.9"></stop>
              <stop offset="1" stop-color="#e5f4d6"></stop>
            </linearGradient>
            <clipPath id=${clip}><rect width=${pct} height="60"></rect></clipPath>
          </defs>
          <polygon points="0,60 100,0 100,60" fill="rgba(255,255,255,0.08)"></polygon>
          <polygon points="0,60 100,0 100,60" fill="url(#rg)" clip-path="url(#${clip})"></polygon>
        </svg>
        <div class="cols"><span></span><span></span><span></span></div>
      </div>
      <div class="labels"><span>${t("low")}</span><span>${t("medium")}</span><span>${t("high")}</span></div>
    </div>`;
  }

  private strip(id: string, s: HassEntity) {
    const { t, hass, rtl } = this.ctx;
    const live = this.live[id];
    const hue = live !== undefined ? live * 360 : (s.attributes.hs_color?.[0] ?? 45);
    const on = isOn(s);
    return html`<div class="tile ${on ? "on" : ""}">
      ${this.head(id, s)}
      <div class="swatch" style="--c: hsl(${hue} 80% 55%); opacity:${on ? 1 : 0.45}"></div>
      <div
        class="hue"
        @pointerdown=${(e: PointerEvent) =>
          dragFraction(e, rtl, (f) => this.setLive(id, f), (f) => {
            hass.callService("light", "turn_on", { entity_id: id, hs_color: [Math.round(f * 360), 85] });
            setTimeout(() => this.setLive(id), 1200);
          })}
      >
        <span class="knob" style="inset-inline-start: calc(${hue / 360} * (100% - 26px))"></span>
      </div>
      <div class="sub center">${t("customize_color")}</div>
    </div>`;
  }

  private speaker(id: string, s: HassEntity) {
    const { hass, rtl } = this.ctx;
    const live = this.live[id];
    const vol = live ?? (typeof s.attributes.volume_level === "number" ? s.attributes.volume_level : 0);
    return html`<div class="tile ${isOn(s) ? "on" : ""}">
      ${this.head(id, s)}
      <div
        class="vol"
        @pointerdown=${(e: PointerEvent) =>
          dragFraction(e, rtl, (f) => this.setLive(id, f), (f) => {
            hass.callService("media_player", "volume_set", { entity_id: id, volume_level: Math.round(f * 100) / 100 });
            setTimeout(() => this.setLive(id), 1200);
          })}
      >
        <div class="fill" style="width:${vol * 100}%"></div>
        <div class="cols"><span></span><span></span><span></span><span></span></div>
      </div>
      <div class="labels four"><span>20%</span><span>40%</span><span>60%</span><span>100%</span></div>
    </div>`;
  }

  private plain(id: string, s: HassEntity) {
    const on = isOn(s);
    return html`<div class="tile ${on ? "on" : ""}">
      ${this.head(id, s)}
      <div class="plain">
        <span class="big-ic">${icon(entityIcon(id, s), 34)}</span>
        <button class="switch" ?on=${on} aria-pressed=${on} @click=${() => toggle(this.ctx.hass, id)}></button>
      </div>
    </div>`;
  }

  /** Holding a tile (but not its slider, switch or gear) opens the level popup. */
  private hold(e: PointerEvent, id: string) {
    if ((e.target as Element).closest(".ramp, .hue, .vol, .switch, .gear")) return;
    if (!hasLevel(id, this.ctx.hass.states[id])) return;
    onHold(e, () => this.ctx.openLevel(id));
  }

  private tile(id: string) {
    return html`<div class="hold" @pointerdown=${(e: PointerEvent) => this.hold(e, id)} @contextmenu=${noMenu}>${this.inner(id)}</div>`;
  }

  private inner(id: string) {
    const s = this.ctx.hass.states[id];
    if (unavailable(s))
      return html`<div class="tile off"><div class="tile-head"><span class="name">${nameOf(this.ctx.hass, id)}</span></div><div class="empty">${this.ctx.t("not_configured")}</div></div>`;
    const d = domainOf(id);
    if (d === "light" && isColor(s!)) return this.strip(id, s!);
    if (d === "light" && isDimmable(s!)) return this.lamp(id, s!);
    if (d === "media_player" && s!.attributes.volume_level !== undefined) return this.speaker(id, s!);
    return this.plain(id, s!);
  }

  render() {
    const { t, config, editing } = this.ctx;
    const ids = config.home.devices;
    return html`<div class="glass card">
      <div class="card-head">
        <span class="round">${icon(mdiDevices, 20)}</span>
        <h3>${t("smart_devices")}</h3>
        ${editing
          ? html`<button class="round gear" aria-label=${t("settings")} @click=${() => devicesSettings(this.ctx)}>${icon(mdiCog, 18)}</button>`
          : nothing}
      </div>
      ${ids.length ? html`<div class="row">${ids.map((id) => this.tile(id))}</div>` : html`<div class="empty">${t("pick_in_edit")}</div>`}
    </div>`;
  }

  static styles = [
    shared,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .card {
        height: 100%;
        padding: 20px 22px 22px;
      }
      .row {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: minmax(200px, 1fr);
        gap: 14px;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        margin: 0 -4px;
        padding: 0 4px 2px;
      }
      .row::-webkit-scrollbar {
        display: none;
      }
      .hold {
        display: flex;
        scroll-snap-align: start;
        -webkit-touch-callout: none;
        user-select: none;
      }
      .tile {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 230px;
        padding: 16px;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid var(--sn-glass-border);
      }
      .tile-head {
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }
      .name {
        all: unset;
        flex: 1;
        cursor: pointer;
        font-size: 14px;
        line-height: 1.3;
      }
      .gear {
        width: 38px;
        height: 38px;
        background: rgba(0, 0, 0, 0.25);
      }
      .pct {
        margin-top: 10px;
        font-size: 34px;
        font-weight: 300;
        line-height: 1;
      }
      .pct small {
        font-size: 18px;
      }
      .sub {
        font-size: 11px;
        color: var(--sn-text-faint);
        margin-top: 4px;
      }
      .sub.center {
        text-align: center;
        margin-top: 10px;
      }
      .ramp,
      .vol {
        position: relative;
        margin-top: auto;
        height: 74px;
        border-radius: 10px;
        overflow: hidden;
        touch-action: none;
        cursor: ew-resize;
      }
      .ramp svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }
      .ramp svg:dir(rtl) {
        transform: scaleX(-1);
      }
      .cols {
        position: absolute;
        inset: 0;
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
        gap: 4px;
        pointer-events: none;
      }
      .cols span {
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.03);
      }
      .vol {
        height: 110px;
        margin-top: 14px;
      }
      .vol .fill {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        background: linear-gradient(90deg, rgba(181, 220, 143, 0.85), rgba(181, 220, 143, 0.25));
        border-radius: 10px;
      }
      .labels {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        margin-top: 8px;
        font-size: 10px;
        color: var(--sn-text-faint);
        text-align: center;
      }
      .labels.four {
        grid-template-columns: repeat(4, 1fr);
      }
      .swatch {
        margin-top: 14px;
        height: 84px;
        border-radius: 16px;
        background: linear-gradient(110deg, #f1efe9 0%, var(--c) 100%);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
      }
      .hue {
        position: relative;
        margin-top: 14px;
        height: 26px;
        border-radius: 999px;
        background: linear-gradient(90deg, #f33, #fd3, #3f6, #3df, #36f, #d3f, #f33);
        touch-action: none;
        cursor: ew-resize;
      }
      .hue:dir(rtl) {
        background: linear-gradient(-90deg, #f33, #fd3, #3f6, #3df, #36f, #d3f, #f33);
      }
      .knob {
        position: absolute;
        top: 0;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: #fff;
        border: 3px solid rgba(0, 0, 0, 0.25);
      }
      .plain {
        margin-top: auto;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
      }
      .big-ic {
        color: var(--sn-text-dim);
      }
      .tile.on .big-ic {
        color: var(--sn-accent);
      }
    `,
  ];
}
