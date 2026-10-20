// Popup bodies for devices that don't have a card of their own: switches, sensors, locks, alarms, scenes, images.
import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { mdiBackspaceOutline, mdiLock, mdiLockOpenVariant, mdiPlay, mdiPower, mdiShieldHome, mdiShieldLock, mdiShieldOff } from "@mdi/js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { domainOf, isOn, nameOf, since, toggle } from "../ha";
import { entityIcon, icon } from "../ui/icon";
import { noMenu, onHold } from "../ui/hold";
import { history, type Point } from "./history";

const viewStyles = css`
  :host {
    display: block;
  }
  .center {
    display: grid;
    justify-items: center;
    gap: 14px;
    padding: 8px 0 4px;
    text-align: center;
  }
  .big {
    display: grid;
    place-items: center;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 1px solid var(--sn-glass-border);
    background: rgba(255, 255, 255, 0.08);
    color: var(--sn-text-dim);
    cursor: pointer;
    -webkit-touch-callout: none;
    user-select: none;
    transition: transform 0.15s ease, background 0.3s ease, box-shadow 0.3s ease;
  }
  .big:active {
    transform: scale(0.95);
  }
  .big.on {
    background: radial-gradient(circle at 50% 40%, #e3f3d2, var(--sn-accent-strong));
    color: #1d2a12;
    box-shadow: 0 0 50px var(--sn-accent-glow);
  }
  .big.warn {
    background: radial-gradient(circle at 50% 40%, #ffd9c9, #e48a6b);
    color: #3a160b;
    box-shadow: 0 0 50px rgba(228, 138, 107, 0.45);
  }
  .state {
    font-size: 22px;
    text-transform: capitalize;
  }
  .hint {
    font-size: 13px;
    color: var(--sn-text-dim);
  }
`;

/** Big power button for switches, fans, outlets and anything else that turns on and off. */
@customElement("sn-toggle-view")
export class SnToggleView extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @property() entity!: string;
  render() {
    const { hass, t, lang } = this.ctx;
    const s = hass.states[this.entity];
    if (!s) return html`<div class="empty">${t("not_configured")}</div>`;
    const on = isOn(s);
    const d = domainOf(this.entity);
    const runOnly = d === "scene" || d === "script" || d === "button";
    return html`<div class="center">
      <button
        class="big ${on && !runOnly ? "on" : ""}"
        aria-pressed=${on}
        @click=${() => (d === "button" ? hass.callService("button", "press", { entity_id: this.entity }) : toggle(hass, this.entity))}
      >
        ${icon(runOnly ? mdiPlay : d === "switch" || d === "input_boolean" ? mdiPower : entityIcon(this.entity, s), 58)}
      </button>
      <span class="state">${runOnly ? t("run") : on ? t("on") : t("off")}</span>
      <span class="hint">${t("changed", { t: since(s.last_changed, lang) })}</span>
    </div>`;
  }
  static styles = [shared, viewStyles];
}

/** Big lock button: tap locks, unlocking needs a hold so it can't happen by accident. */
@customElement("sn-lock-view")
export class SnLockView extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @property() entity!: string;
  render() {
    const { hass, t, lang } = this.ctx;
    const s = hass.states[this.entity];
    if (!s) return html`<div class="empty">${t("not_configured")}</div>`;
    const locked = s.state === "locked";
    const id = this.entity;
    return html`<div class="center">
      <button
        class="big ${locked ? "on" : "warn"}"
        @click=${() => (locked ? this.ctx.toast(t("hold_unlock")) : hass.callService("lock", "lock", { entity_id: id }))}
        @pointerdown=${(e: PointerEvent) => locked && onHold(e, () => hass.callService("lock", "unlock", { entity_id: id }))}
        @contextmenu=${noMenu}
      >
        ${icon(locked ? mdiLock : mdiLockOpenVariant, 58)}
      </button>
      <span class="state">${locked ? t("locked") : t("unlocked")}</span>
      <span class="hint">${locked ? t("hold_unlock") : t("lock")} · ${since(s.last_changed, lang)}</span>
    </div>`;
  }
  static styles = [shared, viewStyles];
}

/** Alarm panel with its own keypad when the alarm needs a code. */
@customElement("sn-alarm-view")
export class SnAlarmView extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @property() entity!: string;
  @state() private code = "";

  private run(service: string) {
    const s = this.ctx.hass.states[this.entity];
    const data: Record<string, any> = { entity_id: this.entity };
    if (s.attributes.code_format && this.code) data.code = this.code;
    this.ctx.hass.callService("alarm_control_panel", service, data);
    this.code = "";
  }

  render() {
    const { hass, t } = this.ctx;
    const s = hass.states[this.entity];
    if (!s) return html`<div class="empty">${t("not_configured")}</div>`;
    const armed = s.state.startsWith("armed");
    const keypad = !!s.attributes.code_format;
    return html`<div class="center">
      <span class="big ${armed ? "on" : s.state === "triggered" ? "warn" : ""}">${icon(armed ? mdiShieldLock : mdiShieldOff, 58)}</span>
      <span class="state">${s.state.replace(/_/g, " ")}</span>
      ${keypad
        ? html`<div class="dots" aria-label=${t("enter_code")}>
              ${Array.from({ length: Math.max(4, this.code.length) }, (_, i) => html`<span class=${i < this.code.length ? "f" : ""}></span>`)}
            </div>
            <div class="pad">
              ${["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((k) =>
                k === ""
                  ? html`<span></span>`
                  : html`<button
                      @click=${() => (this.code = k === "⌫" ? this.code.slice(0, -1) : (this.code + k).slice(0, 10))}
                      aria-label=${k === "⌫" ? "backspace" : k}
                    >
                      ${k === "⌫" ? icon(mdiBackspaceOutline, 22) : k}
                    </button>`,
              )}
            </div>`
        : nothing}
      <div class="modes">
        <button class=${s.state === "armed_home" ? "on" : ""} @click=${() => this.run("alarm_arm_home")}>${icon(mdiShieldHome, 18)}${t("arm_home")}</button>
        <button class=${s.state === "armed_away" ? "on" : ""} @click=${() => this.run("alarm_arm_away")}>${icon(mdiShieldLock, 18)}${t("arm_away")}</button>
        <button class=${s.state === "disarmed" ? "on" : ""} @click=${() => this.run("alarm_disarm")}>${icon(mdiShieldOff, 18)}${t("disarm")}</button>
      </div>
    </div>`;
  }
  static styles = [
    shared,
    viewStyles,
    css`
      .big {
        cursor: default;
      }
      .dots {
        display: flex;
        gap: 10px;
        height: 14px;
      }
      .dots span {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 1.5px solid var(--sn-text-dim);
      }
      .dots span.f {
        background: var(--sn-text);
        border-color: var(--sn-text);
      }
      .pad {
        display: grid;
        grid-template-columns: repeat(3, 72px);
        gap: 12px;
      }
      .pad button {
        display: grid;
        place-items: center;
        height: 72px;
        border-radius: 50%;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text);
        font-size: 26px;
        font-weight: 300;
        cursor: pointer;
      }
      .pad button:active {
        background: rgba(255, 255, 255, 0.2);
      }
      .modes {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
      }
      .modes button {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 46px;
        padding: 0 18px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: var(--sn-chip);
        color: var(--sn-text);
        font-size: 14px;
        cursor: pointer;
      }
      .modes button.on {
        background: var(--sn-accent);
        color: #1d2a12;
        border-color: transparent;
      }
    `,
  ];
}

/** A sensor's value with its last 24 hours: a line for numbers, an on/off timeline for binary sensors. */
@customElement("sn-sensor-view")
export class SnSensorView extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @property() entity!: string;
  @state() private points?: Point[];

  firstUpdated() {
    history(this.ctx.hass, this.entity)
      .then((p) => (this.points = p))
      .catch(() => (this.points = []));
  }

  private line(points: Point[]) {
    const nums = points.map((p) => ({ t: p.t, v: parseFloat(p.s) })).filter((p) => Number.isFinite(p.v));
    if (nums.length < 2) return nothing;
    const W = 600;
    const H = 180;
    const t0 = Date.now() - 86_400_000;
    const min = Math.min(...nums.map((p) => p.v));
    const max = Math.max(...nums.map((p) => p.v));
    const span = max - min || 1;
    const x = (t: number) => ((Math.max(t, t0) - t0) / 86_400_000) * W;
    const y = (v: number) => H - 16 - ((v - min) / span) * (H - 36);
    let d = `M${x(nums[0].t)},${y(nums[0].v)}`;
    for (const p of nums.slice(1)) d += ` L${x(p.t)},${y(p.v)}`;
    d += ` L${W},${y(nums[nums.length - 1].v)}`;
    return html`<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#b5dc8f" stop-opacity="0.45"></stop>
          <stop offset="1" stop-color="#b5dc8f" stop-opacity="0"></stop>
        </linearGradient>
      </defs>
      ${svg`<path d="${d} L${W},${H} L${x(nums[0].t)},${H} Z" fill="url(#fill)"></path>
        <path d=${d} fill="none" stroke="#b5dc8f" stroke-width="2.5" vector-effect="non-scaling-stroke"></path>`}
    </svg>
    <div class="range"><span>${min.toFixed(1)}</span><span>${max.toFixed(1)}</span></div>`;
  }

  private timeline(points: Point[]) {
    const t0 = Date.now() - 86_400_000;
    const segs = points.map((p, i) => {
      const from = Math.max(p.t, t0);
      const to = points[i + 1]?.t ?? Date.now();
      return { on: p.s === "on", left: ((from - t0) / 86_400_000) * 100, width: ((to - from) / 86_400_000) * 100 };
    });
    return html`<div class="timeline">${segs.map((s) => html`<span class=${s.on ? "on" : ""} style="inset-inline-start:${s.left}%;width:${s.width}%"></span>`)}</div>`;
  }

  render() {
    const { hass, t, lang } = this.ctx;
    const s = hass.states[this.entity];
    if (!s) return html`<div class="empty">${t("not_configured")}</div>`;
    const binary = domainOf(this.entity) === "binary_sensor";
    const unit = s.attributes.unit_of_measurement ?? "";
    const value = binary ? (s.state === "on" ? t("on") : t("off")) : s.state;
    return html`
      <div class="value">${value}<small>${unit}</small></div>
      <div class="hint">${t("changed", { t: since(s.last_changed, lang) })}</div>
      <div class="box">
        <div class="label">${t("last_24h")}</div>
        ${this.points === undefined ? html`<div class="empty">…</div>` : binary ? this.timeline(this.points) : this.line(this.points)}
        <div class="axis"><span>-24h</span><span>-12h</span><span>${new Date().toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" })}</span></div>
      </div>
    `;
  }

  static styles = [
    shared,
    viewStyles,
    css`
      .value {
        font-size: 56px;
        font-weight: 300;
        letter-spacing: -0.03em;
        text-transform: capitalize;
      }
      .value small {
        font-size: 20px;
        margin-inline-start: 4px;
      }
      .box {
        margin-top: 18px;
        padding: 16px;
        border-radius: 22px;
        background: rgba(0, 0, 0, 0.16);
        border: 1px solid var(--sn-glass-border);
      }
      .label {
        font-size: 13px;
        color: var(--sn-text-dim);
        margin-bottom: 10px;
      }
      .chart {
        display: block;
        width: 100%;
        height: 180px;
        direction: ltr;
      }
      .range,
      .axis {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: var(--sn-text-faint);
        direction: ltr;
      }
      .axis {
        margin-top: 8px;
      }
      .timeline {
        position: relative;
        height: 40px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.06);
        overflow: hidden;
      }
      .timeline span {
        position: absolute;
        inset-block: 0;
      }
      .timeline span.on {
        background: var(--sn-accent);
      }
    `,
  ];
}

/** A picture entity (a robot's map): as big as the popup allows. */
@customElement("sn-image-view")
export class SnImageView extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @property() entity!: string;
  render() {
    const pic = this.ctx.hass.states[this.entity]?.attributes.entity_picture as string | undefined;
    return pic ? html`<img src=${pic} alt=${nameOf(this.ctx.hass, this.entity)} />` : html`<div class="empty">${this.ctx.t("not_configured")}</div>`;
  }
  static styles = [
    shared,
    css`
      img {
        display: block;
        width: 100%;
        max-height: 70vh;
        object-fit: contain;
        border-radius: 22px;
        background: rgba(0, 0, 0, 0.2);
      }
    `,
  ];
}
