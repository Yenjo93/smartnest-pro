import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { mdiBattery, mdiHomeVariantOutline, mdiMapMarkerOutline } from "@mdi/js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { icon } from "../ui/icon";
import { byDomain, nameOf, num, siblings, since } from "../ha";
import { pageHead, pageStyles } from "./page";
import { hiddenButton, hideable, shown } from "./hide";

/** Everyone in HA's People list: home or where they are, since when, and their phone's battery. */
@customElement("sn-family-page")
export class SnFamilyPage extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;

  /** The phone battery: a battery sensor on the device behind the person's tracker. */
  private battery(personId: string): number | undefined {
    const { hass } = this.ctx;
    const s = hass.states[personId];
    const trackers: string[] = [].concat(s.attributes.source ?? [], s.attributes.device_trackers ?? []);
    for (const tr of trackers) {
      const b = hass.states[tr]?.attributes.battery_level;
      if (typeof b === "number") return b;
      const sensor = siblings(hass, tr).find((e) => hass.states[e]?.attributes.device_class === "battery" && e.startsWith("sensor."));
      const n = sensor ? num(hass.states[sensor]) : undefined;
      if (n !== undefined) return n;
    }
    return undefined;
  }

  private person(id: string) {
    const { hass, t, lang } = this.ctx;
    const s = hass.states[id];
    const home = s.state === "home";
    const where = home ? t("home_state") : s.state === "not_home" ? t("away") : s.state;
    const pic = s.attributes.entity_picture as string | undefined;
    const name = nameOf(hass, id);
    const batt = this.battery(id);
    return html`<button class="glass person ${home ? "home" : ""}" @click=${() => this.ctx.openEntity(id)}>
      <span class="avatar">
        ${pic ? html`<img src=${pic} alt="" />` : html`<span class="initials">${name.slice(0, 1).toUpperCase()}</span>`}
        <span class="dot"></span>
      </span>
      <span class="name">${name}</span>
      <span class="where">${icon(home ? mdiHomeVariantOutline : mdiMapMarkerOutline, 15)}${where}</span>
      <span class="meta">
        <span>${since(s.last_changed, lang)}</span>
        ${batt !== undefined ? html`<span class=${batt < 20 ? "low" : ""}>${icon(mdiBattery, 14)}${Math.round(batt)}%</span>` : nothing}
      </span>
    </button>`;
  }

  render() {
    const { hass, t } = this.ctx;
    const people = shown(this.ctx, "family", byDomain(hass, "person"));
    const home = people.filter((id) => hass.states[id].state === "home").length;
    return html`
      ${pageHead(t("family"), [t("at_home", { n: home })], hiddenButton(this.ctx, "family"))}
      ${people.length
        ? html`<div class="grid" style="--min: 150px">${people.map((id) => hideable(this.ctx, "family", id, this.person(id)))}</div>`
        : html`<div class="glass"><div class="empty">${t("not_configured")}</div></div>`}
    `;
  }

  static styles = [
    shared,
    pageStyles,
    css`
      .person {
        display: grid;
        justify-items: center;
        gap: 8px;
        padding: 24px 16px 18px;
        font: inherit;
        cursor: pointer;
        text-align: center;
      }
      .avatar {
        position: relative;
        width: 92px;
        height: 92px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.2);
      }
      .person.home .avatar {
        border-color: var(--sn-accent);
        box-shadow: 0 0 22px var(--sn-accent-glow);
      }
      .avatar img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
      .initials {
        display: grid;
        place-items: center;
        height: 100%;
        font-size: 34px;
        font-weight: 300;
      }
      .dot {
        position: absolute;
        bottom: 4px;
        inset-inline-end: 4px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #8d867f;
        border: 3px solid var(--sn-glass-strong);
      }
      .person.home .dot {
        background: var(--sn-accent);
      }
      .name {
        margin-top: 6px;
        font-size: 18px;
      }
      .where {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: var(--sn-text-dim);
        text-transform: capitalize;
      }
      .person.home .where {
        color: var(--sn-accent);
      }
      .meta {
        display: flex;
        gap: 12px;
        font-size: 12px;
        color: var(--sn-text-faint);
      }
      .meta span {
        display: inline-flex;
        align-items: center;
        gap: 3px;
      }
      .meta .low {
        color: #f2a487;
      }
    `,
  ];
}
