import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { mdiAccountGroupOutline, mdiThermometer, mdiWaterOutline } from "@mdi/js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { icon } from "../ui/icon";
import { areas, roomInfo } from "../ha";
import "../cards/room-panel";
import { pageHead, pageStyles } from "./page";
import { hiddenButton, hideable, shown } from "./hide";

/** Every area as a card; the chosen one opens beside the grid (or in a sheet on phones). */
@customElement("sn-rooms-page")
export class SnRoomsPage extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;

  render() {
    const { hass, config, t, room, phone } = this.ctx;
    const visible = shown(this.ctx, "rooms", areas(hass).map((a) => a.area_id));
    const list = areas(hass).filter((a) => visible.includes(a.area_id));
    const head = pageHead(t("rooms"), [], hiddenButton(this.ctx, "rooms", (id) => hass.areas?.[id]?.name ?? id));
    if (!list.length) return html`${head}<div class="glass"><div class="empty">${t("no_rooms")}</div></div>`;
    return html`${head}<div class="layout ${phone ? "phone" : ""}">
      <div class="grid">
        ${list.map((a) => {
          const r = roomInfo(hass, a.area_id, config.rooms[a.area_id]);
          return hideable(this.ctx, "rooms", a.area_id, html`<button class="glass room ${a.area_id === room && !phone ? "sel" : ""}" @click=${() => this.ctx.selectRoom(a.area_id)}>
            <span class="name">${r.name}</span>
            <span class="stats">
              ${r.temperature !== undefined ? html`<span>${icon(mdiThermometer, 14)}${r.temperature.toFixed(1)}°</span>` : nothing}
              ${r.humidity !== undefined ? html`<span>${icon(mdiWaterOutline, 14)}${Math.round(r.humidity)}%</span>` : nothing}
              ${r.occupied !== undefined
                ? html`<span class=${r.occupied ? "occ" : ""}>${icon(mdiAccountGroupOutline, 14)}${r.people ?? (r.occupied ? "•" : "0")}</span>`
                : nothing}
            </span>
            <span class="foot">
              <span>${t("devices_count", { n: r.nodes.length })}</span>
              ${r.activeNodes ? html`<span class="on">${t("devices_on", { n: r.activeNodes })}</span>` : nothing}
            </span>
          </button>`);
        })}
      </div>
      ${phone ? nothing : html`<sn-room-panel .ctx=${this.ctx} .area=${room}></sn-room-panel>`}
    </div>`;
  }

  static styles = [
    shared,
    pageStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .layout {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr minmax(340px, 400px);
        gap: 20px;
        height: 100%;
        min-height: 0;
      }
      .layout.phone {
        display: block;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
        gap: 16px;
        align-content: start;
        overflow: auto;
        padding: 2px;
      }
      .phone .grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
      sn-room-panel {
        overflow: auto;
        border-radius: var(--sn-radius);
      }
      .room {
        display: flex;
        flex-direction: column;
        gap: 14px;
        min-height: 150px;
        padding: 18px;
        text-align: start;
        cursor: pointer;
        font: inherit;
        transition: transform 0.15s ease, background 0.2s ease;
      }
      .room:active {
        transform: scale(0.98);
      }
      .room.sel {
        background: var(--sn-glass-strong);
        border-color: rgba(181, 220, 143, 0.6);
      }
      .name {
        font-size: 18px;
      }
      .stats {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .stats span {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .stats .occ {
        color: var(--sn-accent);
      }
      .foot {
        margin-top: auto;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: var(--sn-text-faint);
      }
      .foot .on {
        color: var(--sn-accent);
      }
    `,
  ];
}
