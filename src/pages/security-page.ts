import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  mdiDoorClosed,
  mdiDoorOpen,
  mdiGarage,
  mdiGarageOpen,
  mdiLock,
  mdiLockOpenVariant,
  mdiShieldHome,
  mdiShieldLock,
  mdiShieldOff,
  mdiWindowClosedVariant,
  mdiWindowOpenVariant,
} from "@mdi/js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { icon } from "../ui/icon";
import { areaName, byDomain, nameOf, since } from "../ha";
import { onHold, noMenu } from "../ui/hold";
import { moreInfo } from "../cards/devices-card";
import { pageHead, pageStyles } from "./page";

const OPENINGS = ["door", "window", "garage_door", "opening"];

/** Alarm, locks, doors and windows, and camera snapshots. Unlocking needs a hold, so a stray tap can't open the door. */
@customElement("sn-security-page")
export class SnSecurityPage extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  /** Bumped every 10 s so camera snapshots refresh. */
  @state() private tick = 0;
  private timer?: number;

  connectedCallback() {
    super.connectedCallback();
    this.timer = window.setInterval(() => this.tick++, 10_000);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.timer);
  }

  private lock(id: string) {
    const { hass, t } = this.ctx;
    const s = hass.states[id];
    const locked = s.state === "locked";
    return html`<button
      class="glass tile lock ${locked ? "ok" : "warn"}"
      @click=${() => (locked ? this.ctx.toast(t("confirm_unlock")) : hass.callService("lock", "lock", { entity_id: id }))}
      @pointerdown=${(e: PointerEvent) => locked && onHold(e, () => hass.callService("lock", "unlock", { entity_id: id }))}
      @contextmenu=${noMenu}
    >
      <span class="ic">${icon(locked ? mdiLock : mdiLockOpenVariant, 24)}</span>
      <span class="name">${nameOf(hass, id)}</span>
      <span class="st">${locked ? t("locked") : t("unlocked")}</span>
    </button>`;
  }

  private opening(id: string) {
    const { hass, t, lang } = this.ctx;
    const s = hass.states[id];
    const open = s.state === "on";
    const dc = s.attributes.device_class;
    const ic = dc === "window" ? (open ? mdiWindowOpenVariant : mdiWindowClosedVariant) : dc === "garage_door" ? (open ? mdiGarageOpen : mdiGarage) : open ? mdiDoorOpen : mdiDoorClosed;
    return html`<button class="glass tile ${open ? "warn" : "ok"}" @click=${() => moreInfo(this, id)}>
      <span class="ic">${icon(ic, 24)}</span>
      <span class="name">${nameOf(hass, id)}</span>
      <span class="st">${open ? t("st_open") : t("st_closed")} · ${since(s.last_changed, lang)}</span>
    </button>`;
  }

  private alarm(id: string) {
    const { hass, t } = this.ctx;
    const s = hass.states[id];
    const armed = s.state.startsWith("armed");
    const needsCode = !!s.attributes.code_format && s.attributes.code_arm_required !== false;
    // With a code, HA's own keypad dialog handles it.
    const run = (service: string) => () =>
      needsCode || (service === "alarm_disarm" && s.attributes.code_format) ? moreInfo(this, id) : hass.callService("alarm_control_panel", service, { entity_id: id });
    return html`<div class="glass alarm ${armed ? "armed" : ""} ${s.state === "triggered" ? "triggered" : ""}">
      <span class="shield">${icon(armed ? mdiShieldLock : mdiShieldOff, 34)}</span>
      <div class="ainfo">
        <span class="name">${nameOf(hass, id)}</span>
        <span class="st">${s.state.replace(/_/g, " ")}</span>
      </div>
      <div class="abtns">
        <button class=${s.state === "armed_home" ? "on" : ""} @click=${run("alarm_arm_home")}>${icon(mdiShieldHome, 18)}${t("arm_home")}</button>
        <button class=${s.state === "armed_away" ? "on" : ""} @click=${run("alarm_arm_away")}>${icon(mdiShieldLock, 18)}${t("arm_away")}</button>
        <button class=${s.state === "disarmed" ? "on" : ""} @click=${run("alarm_disarm")}>${icon(mdiShieldOff, 18)}${t("disarm")}</button>
      </div>
    </div>`;
  }

  private camera(id: string) {
    const { hass } = this.ctx;
    const pic = hass.states[id].attributes.entity_picture as string | undefined;
    const area = areaName(hass, id);
    return html`<button class="glass cam" @click=${() => moreInfo(this, id)}>
      ${pic ? html`<img src="${pic}${pic.includes("?") ? "&" : "?"}t=${this.tick}" alt="" loading="lazy" />` : nothing}
      <span class="cam-label">${nameOf(hass, id)}${area ? html`<small>${area}</small>` : nothing}</span>
    </button>`;
  }

  render() {
    const { hass, t } = this.ctx;
    const alarms = byDomain(hass, "alarm_control_panel");
    const locks = byDomain(hass, "lock");
    const openings = byDomain(hass, "binary_sensor").filter((id) => OPENINGS.includes(hass.states[id].attributes.device_class));
    const cams = byDomain(hass, "camera");
    const unlocked = locks.filter((id) => hass.states[id].state !== "locked");
    const open = openings.filter((id) => hass.states[id].state === "on");
    const any = alarms.length + locks.length + openings.length + cams.length;
    return html`
      ${pageHead(
        t("security"),
        [
          locks.length ? (unlocked.length ? t("n_unlocked", { n: unlocked.length }) : t("all_locked")) : undefined,
          openings.length ? (open.length ? t("n_open", { n: open.length }) : t("all_closed")) : undefined,
        ],
        unlocked.length
          ? html`<button class="action" @click=${() => hass.callService("lock", "lock", { entity_id: unlocked })}>${icon(mdiLock, 18)}${t("lock_all")}</button>`
          : undefined,
      )}
      ${!any ? html`<div class="glass"><div class="empty">${t("not_configured")}</div></div>` : nothing}
      ${alarms.map((id) => this.alarm(id))}
      ${locks.length ? html`<div class="section">${t("locks")}</div><div class="grid" style="--min: 180px">${locks.map((id) => this.lock(id))}</div>` : nothing}
      ${openings.length
        ? html`<div class="section">${t("doors_windows")}</div>
            <div class="grid" style="--min: 180px">${[...open, ...openings.filter((id) => !open.includes(id))].map((id) => this.opening(id))}</div>`
        : nothing}
      ${cams.length ? html`<div class="section">${t("cameras")}</div><div class="grid" style="--min: 280px">${cams.map((id) => this.camera(id))}</div>` : nothing}
    `;
  }

  static styles = [
    shared,
    pageStyles,
    css`
      .tile {
        display: grid;
        gap: 6px;
        padding: 16px;
        text-align: start;
        font: inherit;
        cursor: pointer;
        -webkit-touch-callout: none;
        user-select: none;
      }
      .tile .ic {
        display: grid;
        place-items: center;
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.08);
      }
      .tile.ok .ic {
        color: var(--sn-accent);
      }
      .tile.warn .ic {
        background: rgba(242, 164, 135, 0.22);
        color: #f6b49b;
      }
      .name {
        font-size: 15px;
      }
      .st {
        font-size: 12px;
        color: var(--sn-text-dim);
      }
      .alarm {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
        padding: 18px 20px;
        margin-bottom: 8px;
      }
      .shield {
        display: grid;
        place-items: center;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.08);
      }
      .alarm.armed .shield {
        background: rgba(181, 220, 143, 0.25);
        color: var(--sn-accent);
        box-shadow: 0 0 24px var(--sn-accent-glow);
      }
      .alarm.triggered .shield {
        background: #b5442f;
        color: #fff;
      }
      .ainfo {
        flex: 1;
        display: grid;
        gap: 4px;
        min-width: 140px;
      }
      .ainfo .st {
        text-transform: capitalize;
      }
      .abtns {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .abtns button {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 44px;
        padding: 0 16px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: var(--sn-chip);
        color: var(--sn-text);
        font-size: 13px;
        cursor: pointer;
      }
      .abtns button.on {
        background: var(--sn-accent);
        color: #1d2a12;
        border-color: transparent;
      }
      .cam {
        position: relative;
        padding: 0;
        overflow: hidden;
        aspect-ratio: 16 / 10;
        cursor: pointer;
        font: inherit;
      }
      .cam img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .cam-label {
        position: absolute;
        inset-inline-start: 12px;
        bottom: 12px;
        display: grid;
        padding: 8px 14px;
        border-radius: 14px;
        background: rgba(20, 18, 16, 0.55);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: #fff;
        font-size: 13px;
        text-align: start;
      }
      .cam-label small {
        opacity: 0.7;
        font-size: 11px;
      }
    `,
  ];
}
