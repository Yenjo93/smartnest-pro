import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { mdiFan, mdiPower } from "@mdi/js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { icon } from "../ui/icon";
import { areaName, byDomain, isOn, nameOf, toggle } from "../ha";
import { pageHead, pageStyles } from "./page";
import { hiddenButton, hideable, shown } from "./hide";
import "../cards/climate-card";

/** Every thermostat in the house with its own dial, and the fans below. */
@customElement("sn-climate-page")
export class SnClimatePage extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;

  render() {
    const { hass, t } = this.ctx;
    const acs = shown(this.ctx, "climate", byDomain(hass, "climate"));
    const fans = shown(this.ctx, "climate", byDomain(hass, "fan"));
    const running = acs.filter((id) => hass.states[id].state !== "off");
    return html`
      ${pageHead(t("climate"), [t("n_running", { n: running.length })], html`${running.length
        ? html`<button class="action" @click=${() => hass.callService("climate", "turn_off", { entity_id: running })}>
            ${icon(mdiPower, 18)}${t("all_ac_off")}
          </button>`
        : nothing}${hiddenButton(this.ctx, "climate")}`)}
      ${acs.length
        ? html`<div class="grid" style="--min: 340px">
            ${acs.map(
              (id) => hideable(this.ctx, "climate", id, html`<div class="wrap">
                ${areaName(hass, id) ? html`<span class="area">${areaName(hass, id)}</span>` : nothing}
                <sn-climate-card .ctx=${this.ctx} .entity=${id}></sn-climate-card>
              </div>`),
            )}
          </div>`
        : html`<div class="glass"><div class="empty">${t("not_configured")}</div></div>`}
      ${fans.length
        ? html`<div class="section">${t("fans")}</div>
            <div class="grid" style="--min: 200px">
              ${fans.map((id) => {
                const s = hass.states[id];
                const on = isOn(s);
                return hideable(this.ctx, "climate", id, html`<div class="glass card fan ${on ? "on" : ""}">
                  <span class="spin">${icon(mdiFan, 30)}</span>
                  <span class="name">${nameOf(hass, id)}<small>${typeof s.attributes.percentage === "number" && on ? `${s.attributes.percentage}%` : on ? t("on") : t("off")}</small></span>
                  <button class="switch" ?on=${on} aria-pressed=${on} @click=${() => toggle(hass, id)}></button>
                </div>`);
              })}
            </div>`
        : nothing}
    `;
  }

  static styles = [
    shared,
    pageStyles,
    css`
      .wrap {
        position: relative;
      }
      .area {
        position: absolute;
        top: 24px;
        inset-inline-end: 22px;
        z-index: 1;
        font-size: 12px;
        color: var(--sn-text-dim);
      }
      .fan {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .fan .name {
        flex: 1;
        display: grid;
        font-size: 14px;
      }
      .fan small {
        color: var(--sn-text-dim);
        font-size: 12px;
      }
      .fan .spin {
        color: var(--sn-text-dim);
      }
      .fan.on .spin {
        color: var(--sn-accent);
        animation: spin 1.6s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ];
}
