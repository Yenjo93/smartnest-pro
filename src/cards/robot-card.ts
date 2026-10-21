import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { mdiMapOutline, mdiBattery, mdiHomeImportOutline, mdiMapMarkerQuestionOutline, mdiPause, mdiPlay, mdiRobotMower, mdiRobotVacuum } from "@mdi/js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { icon } from "../ui/icon";
import { domainOf, nameOf, num, siblings } from "../ha";
import type { Key } from "../i18n";
import "./robot-rooms";

/** One robot vacuum or mower: status, battery, suction, the map when the integration provides one, and controls. */
@customElement("sn-robot-card")
export class SnRobotCard extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @property() entity!: string;
  /** Inside a popup: no outer glass. */
  @property({ type: Boolean, reflect: true }) bare = false;

  render() {
    const id = this.entity;
    if (!this.ctx.hass.states[id]) return html`<div class="empty">${this.ctx.t("not_configured")}</div>`;
    const { hass, t } = this.ctx;
    const s = hass.states[id];
    const mower = domainOf(id) === "lawn_mower";
    const sib = siblings(hass, id);
    const map = sib.find((e) => domainOf(e) === "image" || domainOf(e) === "camera");
    const mapUrl = map ? (hass.states[map].attributes.entity_picture as string | undefined) : undefined;
    const battery =
      (typeof s.attributes.battery_level === "number" ? s.attributes.battery_level : undefined) ??
      num(hass.states[sib.find((e) => hass.states[e]?.attributes.device_class === "battery") ?? ""]);
    const speeds: string[] = s.attributes.fan_speed_list ?? [];
    const busy = ["cleaning", "mowing", "returning"].includes(s.state);
    const key = `st_${s.state}` as Key;
    const label = ["cleaning", "docked", "returning", "idle", "paused", "error", "mowing"].includes(s.state) ? t(key) : s.state;
    const call = (service: string) => () => hass.callService(mower ? "lawn_mower" : "vacuum", service, { entity_id: id });
    return html`<div class="robot ${this.bare ? "" : "glass"}">
      <div class="top">
        <span class="avatar ${busy ? "busy" : ""}">${icon(mower ? mdiRobotMower : mdiRobotVacuum, 44)}</span>
        <div class="info">
          <h2>${nameOf(hass, id)}</h2>
          <span class="state ${s.state}">${label}</span>
        </div>
        ${battery !== undefined
          ? html`<span class="batt">${icon(mdiBattery, 16)}${t("battery", { n: Math.round(battery) })}
              <span class="bar"><span style="width:${battery}%"></span></span></span>`
          : nothing}
      </div>
      ${mapUrl && this.ctx.config.plan.floors.some((f) => f.rooms.length) && !mower
        ? html`<button class="map-link" @click=${() => this.ctx.openEntity(map!)}>${icon(mdiMapOutline, 16)}${t("robot_map")}</button>`
        : mapUrl
        ? html`<button class="map" @click=${() => this.ctx.openEntity(map!)}><img src=${mapUrl} alt=${t("map")} loading="lazy" /></button>`
        : nothing}
      ${!mower ? html`<sn-robot-rooms .ctx=${this.ctx} .entity=${id}></sn-robot-rooms>` : nothing}
      <div class="controls">
        ${busy
          ? html`<button class="ctl primary" @click=${call("pause")}>${icon(mdiPause)}${t("pause")}</button>`
          : html`<button class="ctl primary" @click=${call(mower ? "start_mowing" : "start")}>${icon(mdiPlay)}${t("start")}</button>`}
        <button class="ctl" @click=${call(mower ? "dock" : "return_to_base")}>${icon(mdiHomeImportOutline)}${t("dock")}</button>
        ${!mower ? html`<button class="ctl" @click=${call("locate")}>${icon(mdiMapMarkerQuestionOutline)}${t("locate")}</button>` : nothing}
      </div>
    </div>`;
  }

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      :host([bare]) .robot {
        padding: 0;
      }
      .bar {
        position: relative;
        height: 8px;
        border-radius: 99px;
        background: rgba(255, 255, 255, 0.1);
        overflow: hidden;
      }
      .bar > span {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        border-radius: 99px;
        background: var(--sn-accent);
      }
      .robot {
        display: grid;
        gap: 18px;
        padding: 22px;
      }
      .top {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
      }
      .avatar {
        display: grid;
        place-items: center;
        width: 76px;
        height: 76px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text-dim);
      }
      .avatar.busy {
        background: rgba(181, 220, 143, 0.2);
        color: var(--sn-accent);
        box-shadow: 0 0 26px var(--sn-accent-glow);
        animation: pulse 2s ease-in-out infinite;
      }
      @keyframes pulse {
        50% {
          box-shadow: 0 0 6px var(--sn-accent-glow);
        }
      }
      .info {
        flex: 1;
        display: grid;
        gap: 4px;
      }
      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 400;
      }
      .state {
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .state.cleaning,
      .state.mowing {
        color: var(--sn-accent);
      }
      .state.error {
        color: #f2a487;
      }
      .batt {
        display: grid;
        grid-template-columns: auto auto;
        align-items: center;
        gap: 4px 6px;
        font-size: 12px;
        color: var(--sn-text-dim);
      }
      .batt .bar {
        grid-column: 1 / -1;
        width: 110px;
      }
      .map-link {
        justify-self: start;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 32px;
        padding: 0 12px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.06);
        color: var(--sn-text-dim);
        font-size: 12px;
        cursor: pointer;
      }
      .map {
        all: unset;
        cursor: zoom-in;
        border-radius: 20px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.2);
      }
      .map img {
        display: block;
        width: 100%;
        max-height: 320px;
        object-fit: contain;
      }
      .speeds {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .speeds span {
        margin-inline-end: 6px;
      }
      .speeds button {
        height: 34px;
        padding: 0 14px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: var(--sn-chip);
        color: var(--sn-text);
        font-size: 13px;
        text-transform: capitalize;
        cursor: pointer;
      }
      .speeds button.on {
        background: var(--sn-accent);
        color: #1d2a12;
        border-color: transparent;
      }
      .controls {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      .ctl {
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-width: 110px;
        height: 50px;
        border-radius: 18px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text);
        font-size: 14px;
        cursor: pointer;
      }
      .ctl.primary {
        background: var(--sn-accent);
        color: #1d2a12;
        border-color: transparent;
      }
    `,
  ];
}
