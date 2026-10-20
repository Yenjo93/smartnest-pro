import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { mdiFullscreen } from "@mdi/js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { areaName, byDomain, nameOf } from "../ha";
import { icon } from "../ui/icon";
import { shown } from "../pages/hide";

/**
 * Live camera: HA's MJPEG stream (camera_proxy_stream) when the camera offers it, otherwise a snapshot refreshed
 * every two seconds. The other cameras sit underneath as thumbnails to switch between.
 */
@customElement("sn-camera-view")
export class SnCameraView extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @property() entity!: string;
  @state() private current?: string;
  @state() private snapshot = false;
  @state() private tick = 0;
  @state() private clock = new Date();
  private timer?: number;

  connectedCallback() {
    super.connectedCallback();
    this.timer = window.setInterval(() => {
      this.clock = new Date();
      if (this.snapshot) this.tick++;
    }, 2000);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.timer);
  }

  private get cam() {
    return this.current ?? this.entity;
  }

  private url(id: string, live: boolean): string | undefined {
    const pic = this.ctx.hass.states[id]?.attributes.entity_picture as string | undefined;
    if (!pic) return undefined;
    if (live && pic.includes("/api/camera_proxy/")) return pic.replace("/api/camera_proxy/", "/api/camera_proxy_stream/");
    return `${pic}${pic.includes("?") ? "&" : "?"}t=${this.tick}`;
  }

  private select(id: string) {
    this.current = id;
    this.snapshot = false;
  }

  private fullscreen() {
    const stage = this.renderRoot.querySelector(".stage") as HTMLElement | null;
    const anyStage = stage as any;
    (stage?.requestFullscreen?.() ?? anyStage?.webkitRequestFullscreen?.())?.catch?.(() => {});
  }

  render() {
    const { hass, t, lang } = this.ctx;
    const id = this.cam;
    const others = shown(this.ctx, "security", byDomain(hass, "camera"));
    const src = this.url(id, !this.snapshot);
    const area = areaName(hass, id);
    return html`
      <div class="stage">
        ${src
          ? html`<img
              src=${src}
              alt=${nameOf(hass, id)}
              @error=${() => {
                if (!this.snapshot) this.snapshot = true;
              }}
            />`
          : html`<div class="empty">${t("not_configured")}</div>`}
        <span class="live"><span class="dot"></span>${t("live")}</span>
        <button class="round fs" aria-label=${t("fullscreen")} @click=${this.fullscreen}>${icon(mdiFullscreen, 22)}</button>
        <span class="label">
          <b>${nameOf(hass, id)}</b>
          <small>${area ? `${area} · ` : ""}${this.clock.toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</small>
        </span>
      </div>
      ${others.length > 1
        ? html`<div class="thumbs">
            ${others.map(
              (c) => html`<button class="thumb ${c === id ? "on" : ""}" @click=${() => this.select(c)}>
                ${this.url(c, false) ? html`<img src=${this.url(c, false)!} alt="" loading="lazy" />` : nothing}
                <span>${nameOf(hass, c)}</span>
              </button>`,
            )}
          </div>`
        : nothing}
    `;
  }

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .stage {
        position: relative;
        aspect-ratio: 16 / 9;
        border-radius: 24px;
        overflow: hidden;
        background: #0b0b0b;
        box-shadow: 0 24px 50px -20px rgba(0, 0, 0, 0.6);
      }
      .stage:fullscreen {
        border-radius: 0;
      }
      .stage img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }
      .live {
        position: absolute;
        top: 14px;
        inset-inline-start: 14px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 32px;
        padding: 0 14px;
        border-radius: 999px;
        background: rgba(20, 18, 16, 0.55);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: #fff;
        font-size: 12px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ff5a4a;
        box-shadow: 0 0 10px #ff5a4a;
        animation: blink 1.4s ease-in-out infinite;
      }
      @keyframes blink {
        50% {
          opacity: 0.35;
        }
      }
      .fs {
        position: absolute;
        top: 10px;
        inset-inline-end: 10px;
        background: rgba(20, 18, 16, 0.55);
        border-color: rgba(255, 255, 255, 0.2);
        color: #fff;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }
      .label {
        position: absolute;
        bottom: 14px;
        inset-inline-start: 14px;
        display: grid;
        gap: 2px;
        padding: 10px 16px;
        border-radius: 16px;
        background: rgba(20, 18, 16, 0.55);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: #fff;
      }
      .label b {
        font-weight: 500;
        font-size: 15px;
      }
      .label small {
        font-size: 12px;
        opacity: 0.75;
        font-variant-numeric: tabular-nums;
      }
      .thumbs {
        display: flex;
        gap: 12px;
        margin-top: 16px;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .thumb {
        position: relative;
        flex: none;
        width: 170px;
        aspect-ratio: 16 / 10;
        padding: 0;
        border-radius: 16px;
        overflow: hidden;
        border: 2px solid transparent;
        background: #111;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s ease, border-color 0.2s ease;
      }
      .thumb.on {
        border-color: var(--sn-accent);
        opacity: 1;
      }
      .thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .thumb span {
        position: absolute;
        inset-inline-start: 8px;
        bottom: 6px;
        color: #fff;
        font-size: 11px;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
      }
    `,
  ];
}
