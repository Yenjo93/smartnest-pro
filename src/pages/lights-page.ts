import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { mdiLightbulbGroupOff } from "@mdi/js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { entityIcon, icon } from "../ui/icon";
import { areaOf, areas, byDomain, isOn, nameOf, toggle } from "../ha";
import { hasLevel, noMenu, onHold } from "../ui/hold";
import { pageHead, pageStyles } from "./page";

/** All lights grouped by room. Tap toggles, hold opens the brightness popup. */
@customElement("sn-lights-page")
export class SnLightsPage extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;

  private tile(id: string) {
    const { hass } = this.ctx;
    const s = hass.states[id];
    const on = isOn(s);
    const pct = on && typeof s.attributes.brightness === "number" ? Math.round((s.attributes.brightness / 255) * 100) : on ? 100 : 0;
    const color = s.attributes.rgb_color as number[] | undefined;
    return html`<button
      class="glass light ${on ? "on" : ""}"
      style=${on && color ? `--glow: rgb(${color.join(",")})` : ""}
      @click=${() => toggle(hass, id)}
      @pointerdown=${(e: PointerEvent) => hasLevel(id, s) && onHold(e, () => this.ctx.openLevel(id))}
      @contextmenu=${noMenu}
    >
      <span class="bulb">${icon(entityIcon(id, s), 26)}</span>
      <span class="name">${nameOf(hass, id)}</span>
      <span class="pct">${on ? `${pct}%` : this.ctx.t("off")}</span>
      <span class="bar"><span style="width:${pct}%"></span></span>
    </button>`;
  }

  render() {
    const { hass, t } = this.ctx;
    const all = byDomain(hass, "light");
    const on = all.filter((id) => isOn(hass.states[id]));
    const groups = areas(hass)
      .map((a) => ({ name: a.name, ids: all.filter((id) => areaOf(hass, id) === a.area_id) }))
      .filter((g) => g.ids.length);
    const loose = all.filter((id) => !areaOf(hass, id));
    if (loose.length) groups.push({ name: t("other"), ids: loose });
    return html`
      ${pageHead(t("lights"), [t("n_lights_on", { n: on.length })], on.length
        ? html`<button class="action" @click=${() => hass.callService("light", "turn_off", { entity_id: on })}>
            ${icon(mdiLightbulbGroupOff, 18)}${t("all_off")}
          </button>`
        : undefined)}
      ${all.length
        ? groups.map((g) => html`<div class="section">${g.name}</div><div class="grid" style="--min: 150px">${g.ids.map((id) => this.tile(id))}</div>`)
        : html`<div class="glass"><div class="empty">${t("not_configured")}</div></div>`}
    `;
  }

  static styles = [
    shared,
    pageStyles,
    css`
      .section:first-of-type {
        margin-top: 0;
      }
      .light {
        display: grid;
        gap: 8px;
        padding: 16px;
        text-align: start;
        font: inherit;
        cursor: pointer;
        -webkit-touch-callout: none;
        user-select: none;
        transition: transform 0.15s ease, background 0.2s ease;
      }
      .light:active {
        transform: scale(0.97);
      }
      .bulb {
        display: grid;
        place-items: center;
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text-dim);
      }
      .light.on {
        background: var(--sn-glass-strong);
      }
      .light.on .bulb {
        background: var(--glow, #f6e7b8);
        color: #2a2416;
        box-shadow: 0 0 22px var(--glow, rgba(246, 231, 184, 0.7));
      }
      .name {
        font-size: 14px;
        margin-top: 4px;
      }
      .pct {
        font-size: 12px;
        color: var(--sn-text-dim);
      }
    `,
  ];
}
