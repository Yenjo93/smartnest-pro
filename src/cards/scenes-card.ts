import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { mdiCog, mdiPalette, mdiPlay } from "@mdi/js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { icon } from "../ui/icon";
import { nameOf, toggle } from "../ha";
import { scenesSettings } from "../settings";

/** Quick scene and script buttons: the slot the reference design used for an AI assistant. */
@customElement("sn-scenes-card")
export class SnScenesCard extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @state() private fired?: string;

  private run(id: string) {
    toggle(this.ctx.hass, id);
    this.fired = id;
    setTimeout(() => (this.fired = undefined), 1200);
  }

  render() {
    const { t, config, editing, hass } = this.ctx;
    const ids = config.home.scenes;
    return html`<div class="glass card">
      <div class="card-head">
        <span class="round">${icon(mdiPalette, 20)}</span>
        <h3>${t("scenes")}</h3>
        ${editing
          ? html`<button class="round gear" aria-label=${t("settings")} @click=${() => scenesSettings(this.ctx)}>${icon(mdiCog, 18)}</button>`
          : nothing}
      </div>
      ${ids.length
        ? html`<div class="row">
            ${ids.map(
              (id) => html`<button class="scene ${this.fired === id ? "fired" : ""}" ?disabled=${!hass.states[id]} @click=${() => this.run(id)}>
                <span class="play">${icon(mdiPlay, 16)}</span>${nameOf(hass, id)}
              </button>`,
            )}
          </div>`
        : html`<div class="empty">${t("pick_in_edit")}</div>`}
    </div>`;
  }

  static styles = [
    shared,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .card {
        padding: 18px 20px;
      }
      .card-head {
        margin-bottom: 12px;
      }
      .row {
        display: flex;
        gap: 10px;
        overflow-x: auto;
        scrollbar-width: none;
        padding-bottom: 2px;
      }
      .row::-webkit-scrollbar {
        display: none;
      }
      .scene {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        flex: none;
        height: 48px;
        padding: 0 18px 0 6px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text);
        font-size: 14px;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.15s ease;
      }
      .scene:active {
        transform: scale(0.97);
      }
      .scene:disabled {
        opacity: 0.4;
      }
      .play {
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.12);
      }
      .scene.fired {
        background: rgba(181, 220, 143, 0.28);
      }
      .scene.fired .play {
        background: var(--sn-accent);
        color: #1d2a12;
      }
    `,
  ];
}
