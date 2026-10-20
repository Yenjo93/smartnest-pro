import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { mdiAutorenew, mdiCog, mdiFire, mdiLeaf, mdiPower, mdiSnowflake, mdiWavesArrowRight, mdiWeatherWindy } from "@mdi/js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { icon } from "../ui/icon";
import { climateTarget, nameOf, num, setTemp, unavailable } from "../ha";
import { climateSettings } from "../settings";

const SWEEP = 300;
const START = 120; // degrees, clockwise from 3 o'clock: the gap sits at the bottom
const R = 82;
const C = 100;

const polar = (deg: number, r = R) => {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
};
const arc = (from: number, to: number) => {
  const [x1, y1] = polar(from);
  const [x2, y2] = polar(to);
  return `M${x1},${y1} A${R},${R} 0 ${to - from > 180 ? 1 : 0} 1 ${x2},${y2}`;
};

@customElement("sn-climate-card")
export class SnClimateCard extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  /** A specific thermostat (Climate page). Without it, the card shows the one picked for the Home page. */
  @property() entity?: string;
  /** Target while dragging; sent to HA on release so the thermostat isn't flooded. */
  @state() private dragTarget?: number;

  private angleToTemp(e: PointerEvent, min: number, max: number, step: number) {
    const svgEl = this.renderRoot.querySelector("svg.ring") as SVGSVGElement;
    const r = svgEl.getBoundingClientRect();
    const deg = (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
    let rel = (deg - START + 720) % 360;
    if (rel > SWEEP) rel = rel - SWEEP < (360 - SWEEP) / 2 ? SWEEP : 0;
    const v = min + (rel / SWEEP) * (max - min);
    return Math.round(v / step) * step;
  }

  private down(e: PointerEvent, id: string) {
    const { min, max, step } = climateTarget(this.ctx.hass.states[id]);
    const el = e.currentTarget as SVGElement;
    el.setPointerCapture(e.pointerId);
    this.dragTarget = this.angleToTemp(e, min, max, step);
    const move = (ev: PointerEvent) => {
      this.dragTarget = this.angleToTemp(ev, min, max, step);
    };
    const up = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      if (this.dragTarget !== undefined) setTemp(this.ctx.hass, id, this.dragTarget);
      // Keep showing the new target until HA reports it back.
      setTimeout(() => (this.dragTarget = undefined), 1500);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  }

  private modes(id: string) {
    const s = this.ctx.hass.states[id];
    const hvac: string[] = s.attributes.hvac_modes ?? [];
    const presets: string[] = s.attributes.preset_modes ?? [];
    const t = this.ctx.t;
    const out: { key: string; label: string; icon: string; active: boolean; run: () => void }[] = [];
    const svc = (mode: string) => () => this.ctx.hass.callService("climate", "set_hvac_mode", { entity_id: id, hvac_mode: mode });
    const auto = hvac.includes("auto") ? "auto" : hvac.includes("heat_cool") ? "heat_cool" : undefined;
    const eco = s.attributes.preset_mode === "eco";
    if (auto) out.push({ key: "auto", label: t("mode_auto"), icon: mdiAutorenew, active: s.state === auto && !eco, run: svc(auto) });
    if (hvac.includes("cool")) out.push({ key: "cool", label: t("mode_cool"), icon: mdiSnowflake, active: s.state === "cool" && !eco, run: svc("cool") });
    if (hvac.includes("heat")) out.push({ key: "heat", label: t("mode_heat"), icon: mdiFire, active: s.state === "heat" && !eco, run: svc("heat") });
    if (presets.includes("eco"))
      out.push({
        key: "eco",
        label: t("mode_eco"),
        icon: mdiLeaf,
        active: eco,
        run: () => this.ctx.hass.callService("climate", "set_preset_mode", { entity_id: id, preset_mode: "eco" }),
      });
    if (hvac.includes("off")) out.push({ key: "off", label: t("mode_off"), icon: mdiPower, active: s.state === "off", run: svc("off") });
    return out;
  }

  render() {
    const { t, config, editing, hass } = this.ctx;
    const id = this.entity ?? config.home.climate;
    const s = id ? hass.states[id] : undefined;
    const gear = editing && !this.entity
      ? html`<button class="round gear" aria-label=${t("settings")} @click=${() => climateSettings(this.ctx)}>${icon(mdiCog, 18)}</button>`
      : nothing;
    const head = html`<div class="card-head">
      <span class="round">${icon(mdiWeatherWindy, 20)}</span>
      <h3>${this.entity ? nameOf(hass, this.entity) : t("climate_comfort")}</h3>
      ${gear}
    </div>`;
    if (!id || unavailable(s)) return html`<div class="glass card">${head}<div class="empty">${t("not_configured")}</div></div>`;

    const { target: haTarget, current, min, max } = climateTarget(s);
    const target = this.dragTarget ?? haTarget;
    const humidity = (this.entity ? undefined : num(hass.states[config.home.humidity ?? ""])) ?? s!.attributes.current_humidity;
    const frac = target !== undefined ? Math.min(1, Math.max(0, (target - min) / (max - min))) : 0;
    const end = START + frac * SWEEP;
    const [kx, ky] = polar(end);
    const ticks = Array.from({ length: 31 }, (_, i) => START + (i / 30) * SWEEP);
    const off = s!.state === "off";

    return html`<div class="glass card">
      ${head}
      <div class="body">
        <div class="dial">
          <svg class="ring" viewBox="0 0 200 200" @pointerdown=${(e: PointerEvent) => this.down(e, id)}>
            <defs>
              <linearGradient id="g" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stop-color="#e3f3d2"></stop>
                <stop offset="1" stop-color="#9ccf6c"></stop>
              </linearGradient>
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"></feGaussianBlur></filter>
            </defs>
            <circle cx="100" cy="100" r="64" fill="rgba(255,255,255,0.06)"></circle>
            <path d=${arc(START, START + SWEEP)} stroke="rgba(255,255,255,0.12)" stroke-width="20" fill="none" stroke-linecap="round"></path>
            ${ticks.map((a) => {
              const [x1, y1] = polar(a, R - 3);
              const [x2, y2] = polar(a, R + 3);
              return svg`<line x1=${x1} y1=${y1} x2=${x2} y2=${y2} stroke="rgba(255,255,255,0.25)" stroke-width="1"></line>`;
            })}
            ${!off && frac > 0
              ? svg`<path d=${arc(START, end)} stroke="url(#g)" stroke-width="20" fill="none" stroke-linecap="round" opacity="0.35" filter="url(#glow)"></path>
                 <path d=${arc(START, end)} stroke="url(#g)" stroke-width="16" fill="none" stroke-linecap="round"></path>`
              : nothing}
            <circle cx=${kx} cy=${ky} r="13" fill="#d9eec4" stroke="rgba(255,255,255,0.8)" stroke-width="2"></circle>
          </svg>
          <div class="center">
            <div class="now">${current !== undefined ? current.toFixed(1) : "–"}°</div>
            ${target !== undefined ? html`<div class="target">${t("target", { t: target })}</div>` : nothing}
          </div>
          ${humidity !== undefined
            ? html`<span class="chip hum"><span class="ic">${icon(mdiWavesArrowRight, 14)}</span>${Math.round(humidity)}% HR</span>`
            : nothing}
        </div>
        <div class="modes">
          ${this.modes(id).map(
            (m) => html`<button class="mode ${m.active ? "on" : ""}" @click=${m.run}>${icon(m.icon, 16)}<span>${m.label}</span></button>`,
          )}
        </div>
      </div>
    </div>`;
  }

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .card {
        height: 100%;
        padding: 20px 22px 22px;
      }
      .body {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .dial {
        position: relative;
        flex: 1;
        min-width: 0;
        max-width: 230px;
        aspect-ratio: 1;
      }
      .ring {
        width: 100%;
        height: 100%;
        touch-action: none;
        cursor: grab;
        direction: ltr;
      }
      .center {
        position: absolute;
        inset: 0;
        display: grid;
        place-content: center;
        text-align: center;
        pointer-events: none;
      }
      .now {
        font-size: 44px;
        font-weight: 300;
        letter-spacing: -0.03em;
        line-height: 1;
      }
      .target {
        margin-top: 4px;
        font-size: 11px;
        color: var(--sn-text-dim);
      }
      .hum {
        position: absolute;
        top: -4%;
        inset-inline-end: -6%;
        height: 30px;
        font-size: 12px;
        background: var(--sn-glass-strong);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
      }
      .modes {
        display: grid;
        gap: 6px;
        padding: 6px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.05);
        min-width: 96px;
      }
      .mode {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 38px;
        padding: 0 12px;
        border: 0;
        border-radius: 14px;
        background: transparent;
        color: var(--sn-text-dim);
        font-size: 13px;
        cursor: pointer;
        transition: background 0.2s ease, color 0.2s ease;
      }
      .mode.on {
        background: rgba(255, 255, 255, 0.14);
        color: var(--sn-text);
      }
      .mode.on .icon {
        color: var(--sn-accent);
      }
    `,
  ];
}
