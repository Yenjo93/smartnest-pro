import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";

const COLOR_MODES = ["hs", "rgb", "rgbw", "rgbww", "xy"];

/** Which colour controls a light supports. */
export function lightCaps(attrs: Record<string, any> | undefined) {
  const modes: string[] = attrs?.supported_color_modes ?? [];
  return { color: modes.some((m) => COLOR_MODES.includes(m)), temp: modes.includes("color_temp") };
}

/** Quick colours, as hue/saturation. */
const SWATCHES: [number, number][] = [
  [30, 70],
  [0, 85],
  [330, 70],
  [275, 70],
  [220, 85],
  [190, 75],
  [130, 70],
  [50, 90],
];

/**
 * Colour for lights that have it: a hue/saturation wheel with quick swatches, and a warm-to-cool white slider
 * for lights with colour temperature. Values are sent when the finger lifts, so the bulb isn't flooded.
 */
@customElement("sn-light-color")
export class SnLightColor extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @property() entity!: string;
  @state() private tab?: "color" | "white";
  /** Wheel position while dragging. */
  @state() private live?: { h: number; s: number };
  @state() private liveK?: number;

  private send(data: Record<string, any>) {
    this.ctx.hass.callService("light", "turn_on", { entity_id: this.entity, ...data });
  }

  private wheel(e: PointerEvent) {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const pick = (ev: PointerEvent) => {
      const x = ev.clientX - (r.left + r.width / 2);
      const y = ev.clientY - (r.top + r.height / 2);
      const radius = r.width / 2;
      const h = ((Math.atan2(x, -y) * 180) / Math.PI + 360) % 360;
      const s = Math.min(100, (Math.hypot(x, y) / radius) * 100);
      return { h: Math.round(h), s: Math.round(s) };
    };
    el.setPointerCapture(e.pointerId);
    this.live = pick(e);
    const move = (ev: PointerEvent) => (this.live = pick(ev));
    const up = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      if (this.live) this.send({ hs_color: [this.live.h, this.live.s] });
      setTimeout(() => (this.live = undefined), 1200);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  }

  render() {
    const s = this.ctx.hass.states[this.entity];
    if (!s) return nothing;
    const { t } = this.ctx;
    const caps = lightCaps(s.attributes);
    if (!caps.color && !caps.temp) return nothing;
    const tab = this.tab ?? (caps.color && s.attributes.color_mode !== "color_temp" ? "color" : caps.temp ? "white" : "color");
    const hs = this.live ?? (s.attributes.hs_color ? { h: s.attributes.hs_color[0], s: s.attributes.hs_color[1] } : { h: 30, s: 0 });
    const minK = s.attributes.min_color_temp_kelvin ?? 2200;
    const maxK = s.attributes.max_color_temp_kelvin ?? 6500;
    const k = this.liveK ?? s.attributes.color_temp_kelvin ?? Math.round((minK + maxK) / 2);
    const a = (hs.h * Math.PI) / 180;
    const rr = hs.s / 100;
    return html`
      ${caps.color && caps.temp
        ? html`<div class="tabs" role="tablist">
            <button role="tab" aria-selected=${tab === "color"} class=${tab === "color" ? "on" : ""} @click=${() => (this.tab = "color")}>${t("color")}</button>
            <button role="tab" aria-selected=${tab === "white"} class=${tab === "white" ? "on" : ""} @click=${() => (this.tab = "white")}>${t("temperature")}</button>
          </div>`
        : nothing}
      ${tab === "color"
        ? html`<div class="wheel" @pointerdown=${(e: PointerEvent) => this.wheel(e)}>
              <span class="knob" style="left:${50 + Math.sin(a) * rr * 50}%; top:${50 - Math.cos(a) * rr * 50}%; background:hsl(${hs.h} ${Math.max(20, hs.s)}% ${100 - hs.s / 2}%)"></span>
            </div>
            <div class="swatches">
              ${SWATCHES.map(
                ([h, sat]) => html`<button
                  class="sw ${Math.abs(h - hs.h) < 6 && Math.abs(sat - hs.s) < 8 ? "on" : ""}"
                  style="background:hsl(${h} ${sat}% 60%)"
                  aria-label="hue ${h}"
                  @click=${() => this.send({ hs_color: [h, sat] })}
                ></button>`,
              )}
            </div>`
        : html`<div class="temp">
            <div class="kelvin"><b>${k}</b> K · ${k < 3200 ? t("warm") : k > 5000 ? t("cool") : t("neutral")}</div>
            <input
              type="range"
              min=${minK}
              max=${maxK}
              step="50"
              .value=${String(k)}
              aria-label=${t("temperature")}
              @input=${(e: Event) => (this.liveK = Number((e.target as HTMLInputElement).value))}
              @change=${(e: Event) => {
                this.send({ color_temp_kelvin: Number((e.target as HTMLInputElement).value) });
                setTimeout(() => (this.liveK = undefined), 1200);
              }}
            />
            <div class="swatches">
              ${[minK, Math.round((minK * 2 + maxK) / 3 / 50) * 50, Math.round((minK + maxK * 2) / 3 / 50) * 50, maxK].map(
                (kv) => html`<button
                  class="sw ${Math.abs(kv - k) < 150 ? "on" : ""}"
                  style="background:${kv < 3200 ? "#ffcf8a" : kv < 4200 ? "#ffe7c2" : kv < 5300 ? "#fff6ea" : "#dfeaff"}"
                  aria-label="${kv} K"
                  @click=${() => this.send({ color_temp_kelvin: kv })}
                ></button>`,
              )}
            </div>
          </div>`}
    `;
  }

  static styles = [
    shared,
    css`
      :host {
        display: grid;
        justify-items: center;
        gap: 16px;
      }
      .tabs {
        display: flex;
        gap: 6px;
        padding: 5px;
        border-radius: 14px;
        background: rgba(0, 0, 0, 0.18);
        width: min(320px, 100%);
      }
      .tabs button {
        flex: 1;
        height: 38px;
        border-radius: 10px;
        border: 0;
        background: none;
        color: var(--sn-text-dim);
        font-size: 14px;
        cursor: pointer;
      }
      .tabs button.on {
        background: rgba(255, 255, 255, 0.14);
        color: var(--sn-text);
      }
      .wheel {
        position: relative;
        width: min(240px, 70vw);
        aspect-ratio: 1;
        border-radius: 50%;
        background: radial-gradient(circle, #fff 0%, rgba(255, 255, 255, 0) 70%),
          conic-gradient(from 0deg, #ff3b30, #ffcc00, #4cd964, #34c2ff, #3a5bff, #c644fc, #ff3b30);
        box-shadow: 0 18px 40px -16px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.3);
        touch-action: none;
        cursor: crosshair;
      }
      .knob {
        position: absolute;
        width: 30px;
        height: 30px;
        margin: -15px 0 0 -15px;
        border-radius: 50%;
        border: 3px solid #fff;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
        pointer-events: none;
      }
      .swatches {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .sw {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.35);
        cursor: pointer;
        transition: transform 0.15s ease;
      }
      .sw.on {
        border-color: #fff;
        transform: scale(1.15);
        box-shadow: 0 0 0 3px var(--sn-accent-glow);
      }
      .temp {
        display: grid;
        gap: 14px;
        width: min(320px, 100%);
        justify-items: center;
      }
      .kelvin {
        font-size: 14px;
        color: var(--sn-text-dim);
      }
      .kelvin b {
        color: var(--sn-text);
        font-size: 22px;
        font-weight: 400;
      }
      .temp input {
        width: 100%;
        height: 34px;
        -webkit-appearance: none;
        appearance: none;
        border-radius: 999px;
        background: linear-gradient(90deg, #ffb46b, #fff3e0 50%, #cfe0ff);
        outline: none;
      }
      .temp input::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #fff;
        border: 3px solid rgba(0, 0, 0, 0.25);
      }
      .temp input::-moz-range-thumb {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: #fff;
        border: 3px solid rgba(0, 0, 0, 0.25);
      }
    `,
  ];
}
