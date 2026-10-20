import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { mdiArrowCollapseDown, mdiArrowCollapseUp, mdiPower, mdiStop } from "@mdi/js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { domainOf, isOn } from "../ha";
import { entityIcon, icon } from "./icon";

const PRESETS = [0, 25, 50, 75, 100];

/** The hold popup: a big vertical slider for a light's brightness or a curtain's position, plus quick presets. */
@customElement("sn-level")
export class SnLevel extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @property() entity!: string;
  /** Shown while dragging and until HA reports the new value back. */
  @state() private live?: number;
  private clearTimer?: number;

  private current(): number {
    const s = this.ctx.hass.states[this.entity];
    if (!s) return 0;
    if (domainOf(this.entity) === "cover") return typeof s.attributes.current_position === "number" ? s.attributes.current_position : s.state === "open" ? 100 : 0;
    return isOn(s) ? Math.round(((s.attributes.brightness ?? 255) / 255) * 100) : 0;
  }

  private send(pct: number) {
    const { hass } = this.ctx;
    const id = this.entity;
    this.live = pct;
    if (domainOf(id) === "cover") hass.callService("cover", "set_cover_position", { entity_id: id, position: pct });
    else if (pct === 0) hass.callService("light", "turn_off", { entity_id: id });
    else hass.callService("light", "turn_on", { entity_id: id, brightness_pct: pct });
    clearTimeout(this.clearTimer);
    this.clearTimer = window.setTimeout(() => (this.live = undefined), 1500);
  }

  private drag(e: PointerEvent) {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const pct = (ev: PointerEvent) => Math.round(Math.min(1, Math.max(0, (r.bottom - ev.clientY) / r.height)) * 100);
    el.setPointerCapture(e.pointerId);
    clearTimeout(this.clearTimer);
    this.live = pct(e);
    const move = (ev: PointerEvent) => (this.live = pct(ev));
    const up = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      this.send(this.live ?? 0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  }

  private key(e: KeyboardEvent) {
    const v = this.live ?? this.current();
    if (e.key === "ArrowUp" || e.key === "ArrowRight") this.send(Math.min(100, v + 5));
    else if (e.key === "ArrowDown" || e.key === "ArrowLeft") this.send(Math.max(0, v - 5));
    else return;
    e.preventDefault();
  }

  render() {
    const { t, hass } = this.ctx;
    const id = this.entity;
    const s = hass.states[id];
    if (!s) return html`<div class="empty">${t("not_configured")}</div>`;
    const cover = domainOf(id) === "cover";
    const pct = this.live ?? this.current();
    const svc = (service: string) => () => hass.callService("cover", service, { entity_id: id });
    return html`
      <div class="wrap">
        <div class="value">${pct}<small>%</small></div>
        <div class="sub">${cover ? (pct === 0 ? t("closed") : pct === 100 ? t("opened") : t("position")) : pct === 0 ? t("off") : t("brightness")}</div>
        <div
          class="track ${cover ? "cover" : ""}"
          role="slider"
          tabindex="0"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${pct}
          aria-label=${cover ? t("position") : t("brightness")}
          @pointerdown=${this.drag}
          @keydown=${this.key}
        >
          <div class="fill" style="height:${pct}%"></div>
          <span class="ic">${icon(entityIcon(id, s), 30)}</span>
        </div>
        <div class="presets">
          ${PRESETS.map((p) => html`<button class=${p === pct ? "on" : ""} @click=${() => this.send(p)}>${p}%</button>`)}
        </div>
        ${cover
          ? html`<div class="actions">
              <button class="round" aria-label=${t("open")} @click=${svc("open_cover")}>${icon(mdiArrowCollapseUp)}</button>
              <button class="round" aria-label=${t("stop")} @click=${svc("stop_cover")}>${icon(mdiStop)}</button>
              <button class="round" aria-label=${t("close")} @click=${svc("close_cover")}>${icon(mdiArrowCollapseDown)}</button>
            </div>`
          : html`<div class="actions">
              <button class="round ${isOn(s) ? "lit" : ""}" aria-label=${t("on")} @click=${() =>
                hass.callService("light", "toggle", { entity_id: id })}>${icon(mdiPower)}</button>
            </div>`}
      </div>
    `;
  }

  static styles = [
    shared,
    css`
      .wrap {
        display: grid;
        justify-items: center;
        gap: 14px;
        padding: 4px 0 8px;
      }
      .value {
        font-size: 56px;
        font-weight: 300;
        line-height: 1;
        letter-spacing: -0.03em;
        direction: ltr;
      }
      .value small {
        font-size: 22px;
      }
      .sub {
        margin-top: -8px;
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .track {
        position: relative;
        width: 120px;
        height: min(320px, 42vh);
        border-radius: 34px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--sn-glass-border);
        touch-action: none;
        cursor: ns-resize;
        outline: none;
      }
      .track:focus-visible {
        box-shadow: 0 0 0 3px var(--sn-accent-glow);
      }
      .fill {
        position: absolute;
        inset: auto 0 0 0;
        background: linear-gradient(0deg, #9ccf6c, #e3f3d2);
        box-shadow: 0 0 24px var(--sn-accent-glow);
        transition: height 0.12s ease-out;
      }
      .track.cover .fill {
        background: repeating-linear-gradient(0deg, #d8d2ca 0 14px, #c7c0b7 14px 16px);
        box-shadow: none;
      }
      .ic {
        position: absolute;
        left: 50%;
        bottom: 18px;
        transform: translateX(-50%);
        color: #1d1b19;
        mix-blend-mode: normal;
      }
      .presets {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .presets button {
        height: 36px;
        min-width: 54px;
        padding: 0 10px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: var(--sn-chip);
        color: var(--sn-text);
        font-size: 13px;
        cursor: pointer;
      }
      .presets button.on {
        background: var(--sn-accent);
        color: #1d2a12;
        border-color: transparent;
      }
      .actions {
        display: flex;
        gap: 12px;
      }
      .round.lit {
        background: var(--sn-accent);
        color: #1d2a12;
      }
    `,
  ];
}
