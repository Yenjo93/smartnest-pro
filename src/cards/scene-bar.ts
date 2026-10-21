import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { mdiCog, mdiPlay, mdiPlus } from "@mdi/js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { icon } from "../ui/icon";
import { domainOf, nameOf, toggle } from "../ha";
import { scenesSettings } from "../settings";

/** The frosted bar of scene and script buttons across the top of the floor plan. */
@customElement("sn-scene-bar")
export class SnSceneBar extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @state() private fired?: string;

  private run(id: string) {
    toggle(this.ctx.hass, id);
    this.fired = id;
    setTimeout(() => (this.fired = undefined), 1400);
  }

  render() {
    const { config, hass, editing, t } = this.ctx;
    const ids = config.home.scenes.filter((id) => hass.states[id]);
    if (!ids.length && !editing) return nothing;
    return html`<div class="bar">
      ${ids.map((id) => {
        const s = hass.states[id];
        const ic = s.attributes.icon as string | undefined;
        return html`<button class="scene ${this.fired === id ? "fired" : ""}" @click=${() => this.run(id)} title=${nameOf(hass, id)}>
          <span class="dot">${icon(mdiPlay, 14)}</span>
          <span class="name">${nameOf(hass, id)}</span>
          ${domainOf(id) === "script" && ic ? nothing : nothing}
        </button>`;
      })}
      ${editing
        ? html`<button class="gear" aria-label=${t("scene_buttons")} title=${t("scene_buttons")} @click=${() => scenesSettings(this.ctx)}>
            ${icon(ids.length ? mdiCog : mdiPlus, 18)}${ids.length ? nothing : html`<span class="name">${t("scene_buttons")}</span>`}
          </button>`
        : nothing}
    </div>`;
  }

  static styles = [
    shared,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .bar {
        display: flex;
        gap: 6px;
        padding: 6px;
        max-width: 100%;
        overflow-x: auto;
        scrollbar-width: none;
        border-radius: 999px;
        background: var(--sn-glass);
        border: 1px solid var(--sn-glass-border);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        box-shadow: var(--sn-shadow), inset 0 1px 0 var(--sn-glass-hi);
      }
      .bar::-webkit-scrollbar {
        display: none;
      }
      .scene,
      .gear {
        flex: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 42px;
        padding: 0 16px 0 5px;
        border-radius: 999px;
        border: 0;
        background: transparent;
        color: var(--sn-text);
        font-size: 14px;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.15s ease;
      }
      .scene:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .scene:active {
        transform: scale(0.96);
      }
      .dot {
        display: grid;
        place-items: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.14);
        transition: background 0.3s ease, box-shadow 0.3s ease;
      }
      .scene.fired {
        background: color-mix(in srgb, var(--sn-accent) 25%, transparent);
      }
      .scene.fired .dot {
        background: var(--sn-accent);
        color: #1d1b30;
        box-shadow: 0 0 16px var(--sn-accent-glow);
      }
      .gear {
        padding: 0 12px;
        background: rgba(255, 255, 255, 0.08);
      }
      .name {
        white-space: nowrap;
      }
    `,
  ];
}
