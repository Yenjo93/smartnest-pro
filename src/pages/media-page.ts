import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { byDomain, isOn } from "../ha";
import { pageHead, pageStyles } from "./page";
import { hiddenButton, hideable, shown } from "./hide";
import "../cards/media-player";

/** TVs and speakers. Playing ones come first. */
@customElement("sn-media-page")
export class SnMediaPage extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;

  render() {
    const { hass, t } = this.ctx;
    const all = shown(this.ctx, "media", byDomain(hass, "media_player"));
    const rank = (id: string) => (hass.states[id].state === "playing" ? 0 : isOn(hass.states[id]) ? 1 : 2);
    const ids = [...all].sort((a, b) => rank(a) - rank(b));
    const playing = all.filter((id) => hass.states[id].state === "playing").length;
    return html`
      ${pageHead(t("media"), [playing ? t("n_playing", { n: playing }) : t("nothing_playing")], hiddenButton(this.ctx, "media"))}
      ${ids.length
        ? html`<div class="grid" style="--min: 340px">
            ${ids.map((id) => hideable(this.ctx, "media", id, html`<sn-media-player .ctx=${this.ctx} .entity=${id}></sn-media-player>`))}
          </div>`
        : html`<div class="glass"><div class="empty">${t("not_configured")}</div></div>`}
    `;
  }

  static styles = [shared, pageStyles, css``];
}
