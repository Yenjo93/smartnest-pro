import { LitElement, css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import type { Hass } from "../types";
import { mjpegUrl, snapshotUrl, startWebRtc, streamTypes, type StreamMode } from "./stream";

/**
 * A camera, as smooth as it can be: WebRTC, else HA's MJPEG stream, else a snapshot every 2 s. Plays only while it
 * is on screen and the page is visible, so a grid of cameras on a wall tablet doesn't keep every stream open.
 */
@customElement("sn-live-video")
export class SnLiveVideo extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property() entity!: string;
  /** "cover" fills a tile; "contain" shows the whole picture (popups). */
  @property({ reflect: true }) fit: "cover" | "contain" = "contain";
  @state() private mode?: StreamMode;
  @state() private tick = 0;
  @query("video") private video?: HTMLVideoElement;

  private stopRtc?: () => void;
  /** Kept from the start: the picture's access token changes every few minutes, which would restart the stream. */
  private mjpeg?: string;
  private playing?: string;
  private timer?: number;
  private seen = false;
  private run = 0;
  private io = new IntersectionObserver(([e]) => {
    this.seen = e.isIntersecting;
    this.sync();
  });
  private vis = () => this.sync();

  connectedCallback() {
    super.connectedCallback();
    this.io.observe(this);
    document.addEventListener("visibilitychange", this.vis);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.io.disconnect();
    document.removeEventListener("visibilitychange", this.vis);
    this.stop();
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has("entity")) this.sync();
  }

  /** Starts or stops the stream to match: on screen, page visible, this entity. */
  private sync() {
    const want = this.seen && document.visibilityState === "visible" && this.entity ? this.entity : undefined;
    if (want === this.playing) return;
    this.stop();
    if (want) this.start(want);
  }

  private stop() {
    this.run++;
    this.stopRtc?.();
    this.stopRtc = undefined;
    clearInterval(this.timer);
    this.timer = undefined;
    this.playing = undefined;
    this.mode = undefined;
  }

  private async start(entity: string) {
    const run = ++this.run;
    this.playing = entity;
    const types = await streamTypes(this.hass, entity);
    if (run !== this.run) return;
    if (types.includes("web_rtc")) {
      this.mode = "webrtc";
      await this.updateComplete;
      try {
        const stop = await startWebRtc(this.hass, entity, this.video!, () => {
          // The connection died: start again from scratch.
          if (run !== this.run) return;
          this.stopRtc = undefined;
          this.playing = undefined;
          this.sync();
        });
        if (run !== this.run) stop();
        else this.stopRtc = stop;
        return;
      } catch {
        if (run !== this.run) return;
      }
    }
    this.mjpeg = mjpegUrl(this.hass, entity);
    this.mode = this.mjpeg ? "mjpeg" : "snapshot";
    if (this.mode === "snapshot") this.timer = window.setInterval(() => this.tick++, 2000);
  }

  render() {
    const id = this.playing;
    if (!id || !this.mode) return html`<div class="wait"></div>`;
    if (this.mode === "webrtc") return html`<video autoplay muted playsinline disablepictureinpicture></video>`;
    const src = this.mode === "mjpeg" ? this.mjpeg : snapshotUrl(this.hass, id, this.tick);
    return src
      ? html`<img
          src=${src}
          alt=""
          @error=${() => {
            // The MJPEG stream failed (some cameras only give snapshots): refresh a snapshot instead.
            if (this.mode === "mjpeg") {
              this.mode = "snapshot";
              this.timer = window.setInterval(() => this.tick++, 2000);
            }
          }}
        />`
      : nothing;
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
      background: #0b0b0b;
      overflow: hidden;
    }
    video,
    img,
    .wait {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    :host([fit="cover"]) video,
    :host([fit="cover"]) img {
      object-fit: cover;
    }
  `;
}
