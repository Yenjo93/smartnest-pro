import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { mdiClose, mdiAccountGroupOutline, mdiCog, mdiDoorOpen, mdiMinus, mdiPlus, mdiThermometer, mdiTune, mdiWaterOutline } from "@mdi/js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { entityIcon, icon } from "../ui/icon";
import { climateTarget, isOn, nameOf, roomInfo, setTemp, toggle, unavailable } from "../ha";
import { roomSettings } from "../settings";
import { hasLevel, noMenu, onHold } from "../ui/hold";

const TICKS = 64;

@customElement("sn-room-panel")
export class SnRoomPanel extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @property() area?: string;
  /** Inside the phone sheet: no outer glass, the sheet already has one. */
  @property({ type: Boolean, reflect: true }) bare = false;
  private pending?: number;
  private sendTimer?: number;

  /** + and − are sent after a short pause, so tapping three times is one call to the thermostat. */
  private nudge(id: string, dir: 1 | -1) {
    const s = this.ctx.hass.states[id];
    const { target, min, max, step } = climateTarget(s);
    const base = this.pending ?? target ?? 22;
    this.pending = Math.min(max, Math.max(min, Math.round((base + dir * step) * 10) / 10));
    this.requestUpdate();
    clearTimeout(this.sendTimer);
    this.sendTimer = window.setTimeout(() => {
      if (this.pending !== undefined) setTemp(this.ctx.hass, id, this.pending);
      setTimeout(() => {
        this.pending = undefined;
        this.requestUpdate();
      }, 1500);
    }, 600);
  }

  private zonal(id: string) {
    const { t, hass, editing } = this.ctx;
    const s = hass.states[id];
    const { target: haTarget, min, max } = climateTarget(s);
    const target = this.pending ?? haTarget;
    const frac = target !== undefined ? (target - min) / (max - min) : 0;
    const off = s?.state === "off";
    // Ticks along the upper half of an ellipse; the lit band is centered on the target.
    const ticks = Array.from({ length: TICKS + 1 }, (_, i) => {
      const a = Math.PI + (i / TICKS) * Math.PI;
      const x = 160 + 140 * Math.cos(a);
      const y = 120 + 90 * Math.sin(a);
      const x2 = 160 + 128 * Math.cos(a);
      const y2 = 120 + 80 * Math.sin(a);
      const pos = i / TICKS;
      const lit = !off && Math.abs(pos - frac) < 0.18;
      return svg`<line x1=${x} y1=${y} x2=${x2} y2=${y2} stroke=${lit ? "#e9f6dc" : "rgba(255,255,255,0.35)"} stroke-width=${lit ? 1.6 : 1} stroke-linecap="round"></line>`;
    });
    const bandX = 160 + 134 * Math.cos(Math.PI + frac * Math.PI);
    return html`<div class="zone">
      <div class="zone-head">
        <span>${t("zonal_climate")}</span>
        <button
          class="round light"
          aria-label=${t("settings")}
          @click=${() => (editing && this.area ? roomSettings(this.ctx, this.area) : this.ctx.openEntity(id))}
        >
          ${icon(editing ? mdiCog : mdiTune, 18)}
        </button>
      </div>
      <div class="arc">
        <svg viewBox="0 0 320 150">
          <defs>
            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"></feGaussianBlur></filter>
          </defs>
          ${!off ? svg`<ellipse cx=${bandX} cy="44" rx="58" ry="16" fill="#b5dc8f" opacity="0.75" filter="url(#blur)"></ellipse>` : nothing}
          ${ticks}
        </svg>
        <button class="round pm minus" aria-label="-" @click=${() => this.nudge(id, -1)}>${icon(mdiMinus)}</button>
        <button class="round pm plus" aria-label="+" @click=${() => this.nudge(id, 1)}>${icon(mdiPlus)}</button>
        <div class="temp">${target !== undefined ? target.toFixed(1) : "–"}<small>°C</small></div>
      </div>
    </div>`;
  }

  private node(id: string) {
    const s = this.ctx.hass.states[id];
    const on = isOn(s);
    const pic = s?.attributes.entity_picture as string | undefined;
    const level = hasLevel(id, s);
    const area = this.area!;
    const node = html`<div class="node ${on ? "on" : ""}">
      <button
        class="pic"
        @click=${() => this.ctx.openEntity(id)}
        @pointerdown=${(e: PointerEvent) => level && onHold(e, () => this.ctx.openLevel(id))}
        @contextmenu=${noMenu}
      >
        ${pic ? html`<img src=${pic} alt="" loading="lazy" />` : icon(entityIcon(id, s), 40)}
      </button>
      <span class="nname">${nameOf(this.ctx.hass, id)}</span>
      <button class="switch" ?on=${on} ?disabled=${unavailable(s)} aria-pressed=${on} @click=${() => toggle(this.ctx.hass, id)}></button>
    </div>`;
    if (!this.ctx.editing) return node;
    // Hidden per room, so the room settings' "Hidden devices" list brings them back.
    return html`<div class="hideable">
      ${node}
      <button
        class="hide-x"
        aria-label=${this.ctx.t("hide")}
        @click=${() =>
          this.ctx.update((d) => {
            const r = (d.rooms[area] ??= {});
            r.hidden = [...(r.hidden ?? []), id];
          })}
      >
        ${icon(mdiClose, 16)}
      </button>
    </div>`;
  }

  render() {
    const { t, hass, config, editing } = this.ctx;
    const area = this.area;
    if (!area || !hass.areas?.[area]) return html`<div class="wrap glass"><div class="empty">${t("no_rooms")}</div></div>`;
    const info = roomInfo(hass, area, config.rooms[area]);
    const people =
      info.people !== undefined ? (info.people > 0 ? t("taken_people", { n: info.people }) : t("free")) : info.occupied !== undefined ? (info.occupied ? t("taken") : t("free")) : undefined;
    return html`<div class="wrap ${this.bare ? "" : "glass"}">
      <div class="top">
        ${this.bare ? html`<span class="spacer"></span>` : html`<span class="round">${icon(mdiDoorOpen, 20)}</span><h2>${info.name}</h2>`}
        <div class="meta">
          <span class="chip small">ID: ${area}</span>
          ${info.size ? html`<span class="chip small">${info.size} m²</span>` : nothing}
        </div>
        ${editing && !this.bare
          ? html`<button class="round gear" aria-label=${t("room_settings")} @click=${() => roomSettings(this.ctx, area)}>${icon(mdiCog, 18)}</button>`
          : nothing}
      </div>
      <div class="chips">
        ${info.temperature !== undefined
          ? html`<span class="chip"><span class="ic">${icon(mdiThermometer, 14)}</span>${info.temperature.toFixed(1)} °C</span>`
          : nothing}
        ${people ? html`<span class="chip"><span class="ic">${icon(mdiAccountGroupOutline, 14)}</span>${people}</span>` : nothing}
        ${info.humidity !== undefined
          ? html`<span class="chip"><span class="ic">${icon(mdiWaterOutline, 14)}</span>${t("humidity", { h: Math.round(info.humidity) })}</span>`
          : nothing}
      </div>
      ${info.climate ? this.zonal(info.climate) : html`<div class="zone"><div class="empty">${t("no_climate")}</div></div>`}
      <div class="nodes">
        <div class="nodes-head">${t("nodes_in_room")}</div>
        ${info.nodes.length
          ? html`<div class="grid">${info.nodes.map((id) => this.node(id))}</div>`
          : html`<div class="empty">${t("no_nodes")}</div>`}
      </div>
    </div>`;
  }

  static styles = [
    shared,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .wrap {
        height: 100%;
        padding: 18px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        background: var(--sn-glass-light);
      }
      :host([bare]) .wrap {
        padding: 0;
        background: none;
      }
      .top {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
      h2 {
        flex: 1;
        margin: 0;
        font-size: 22px;
        font-weight: 400;
        white-space: nowrap;
      }
      .spacer {
        flex: 1;
      }
      .meta {
        display: flex;
        gap: 6px;
        order: 3;
      }
      .chip.small {
        height: 28px;
        padding: 0 10px;
        font-size: 11px;
        color: var(--sn-text-dim);
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .zone {
        padding: 16px;
        border-radius: 24px;
        background: linear-gradient(160deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.12));
        border: 1px solid var(--sn-glass-border);
      }
      .zone-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: var(--sn-text-dim);
      }
      .arc {
        position: relative;
        margin-top: 4px;
      }
      .arc svg {
        display: block;
        width: 100%;
        direction: ltr;
      }
      .pm {
        position: absolute;
        top: 46%;
        width: 48px;
        height: 48px;
        background: rgba(40, 36, 32, 0.75);
        color: #fff;
      }
      .plus {
        left: 0;
      }
      .minus {
        right: 0;
      }
      .temp {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 4%;
        text-align: center;
        font-size: 50px;
        font-weight: 300;
        letter-spacing: -0.03em;
        direction: ltr;
        /* Sits over the + and − buttons' row; taps must reach them. */
        pointer-events: none;
      }
      .temp small {
        font-size: 20px;
      }
      .nodes {
        padding: 16px;
        border-radius: 24px;
        background: rgba(0, 0, 0, 0.12);
        border: 1px solid var(--sn-glass-border);
      }
      .nodes-head {
        font-size: 14px;
        color: var(--sn-text-dim);
        margin-bottom: 12px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
        gap: 10px;
      }
      .node {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 10px 8px 12px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid var(--sn-glass-border);
        text-align: center;
      }
      .node.on {
        background: rgba(255, 255, 255, 0.12);
      }
      .pic {
        all: unset;
        -webkit-touch-callout: none;
        user-select: none;
        cursor: pointer;
        display: grid;
        place-items: center;
        width: 100%;
        height: 72px;
        color: var(--sn-text-dim);
      }
      .node.on .pic {
        color: var(--sn-accent);
      }
      .pic img {
        max-width: 100%;
        max-height: 72px;
        object-fit: contain;
        border-radius: 10px;
      }
      .nname {
        font-size: 12px;
        line-height: 1.25;
        min-height: 2.5em;
      }
    `,
  ];
}
