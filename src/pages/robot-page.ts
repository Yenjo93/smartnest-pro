import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { byDomain } from "../ha";
import { pageHead, pageStyles } from "./page";
import { hiddenButton, hideable, shown } from "./hide";
import "../cards/robot-card";

/** Robot vacuums and mowers. */
@customElement("sn-robot-page")
export class SnRobotPage extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;

  render() {
    const { hass, t } = this.ctx;
    const ids = shown(this.ctx, "robot", [...byDomain(hass, "vacuum"), ...byDomain(hass, "lawn_mower")]);
    return html`
      ${pageHead(t("robot"), [], hiddenButton(this.ctx, "robot"))}
      ${ids.length
        ? html`<div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(min(360px, 100%), 620px))">
            ${ids.map((id) => hideable(this.ctx, "robot", id, html`<sn-robot-card .ctx=${this.ctx} .entity=${id}></sn-robot-card>`))}
          </div>`
        : html`<div class="glass"><div class="empty">${t("not_configured")}</div></div>`}
    `;
  }

  static styles = [shared, pageStyles, css``];
}
