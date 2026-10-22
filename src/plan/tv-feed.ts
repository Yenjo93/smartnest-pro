// What's on the TV, on the TV in the plan: a camera (a capture card through Hyperion or go2rtc) shown on the
// screen. A still frame every few seconds normally; live video while the camera is zoomed into the TV's room.
import * as THREE from "three";
import type { Hass } from "../types";
import { mjpegUrl, snapshotUrl, startWebRtc, streamTypes } from "../ui/stream";

export type FeedMode = "still" | "live";

const STILL_MS = 5000;

/** A hidden media element: Safari only plays video that is in the page. */
function hidden<T extends HTMLElement>(el: T): T {
  el.style.cssText = "position:fixed;left:0;top:0;width:2px;height:2px;opacity:0;pointer-events:none;";
  document.body.appendChild(el);
  return el;
}

export class TvFeed {
  /** Set once the first picture is in; the TV's screen shows it. */
  texture?: THREE.Texture;
  mode?: FeedMode;
  private run = 0;
  private timer?: number;
  private stopRtc?: () => void;
  private el?: HTMLImageElement | HTMLVideoElement;
  private n = 0;

  constructor(
    private hass: () => Hass,
    readonly entity: string,
    /** A new picture is ready: repaint (and hook the texture up the first time). */
    private onFrame: (tex: THREE.Texture) => void,
  ) {}

  /** Live frames need re-uploading every frame; still ones don't. */
  get live() {
    return this.mode === "live" && !!this.texture;
  }

  set(mode: FeedMode | undefined) {
    if (mode === this.mode) return;
    this.stop();
    this.mode = mode;
    if (mode === "still") this.still();
    else if (mode === "live") this.startLive();
  }

  private show(el: HTMLImageElement | HTMLVideoElement) {
    if (!this.texture || this.texture.image !== el) {
      const old = this.texture;
      this.texture = el instanceof HTMLVideoElement ? new THREE.VideoTexture(el) : new THREE.Texture(el);
      this.texture.colorSpace = THREE.SRGBColorSpace;
      this.texture.minFilter = THREE.LinearFilter;
      this.texture.generateMipmaps = false;
      old?.dispose();
    }
    this.texture.needsUpdate = true;
    this.onFrame(this.texture);
  }

  private still() {
    const run = this.run;
    const load = () => {
      const url = snapshotUrl(this.hass(), this.entity, ++this.n);
      if (!url) return;
      const img = new Image();
      img.onload = () => run === this.run && this.show(img);
      img.src = url;
    };
    load();
    this.timer = window.setInterval(load, STILL_MS);
  }

  private async startLive() {
    const run = this.run;
    const hass = this.hass();
    if ((await streamTypes(hass, this.entity)).includes("web_rtc")) {
      const video = hidden(document.createElement("video"));
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      this.el = video;
      try {
        const stop = await startWebRtc(hass, this.entity, video, () => {
          if (run !== this.run) return;
          const m = this.mode;
          this.stop();
          this.set(m);
        });
        if (run !== this.run) return stop();
        this.stopRtc = stop;
        this.show(video);
        return;
      } catch {
        if (run !== this.run) return;
        video.remove();
        this.el = undefined;
      }
    }
    // No WebRTC (Hyperion and the like): HA's MJPEG stream into a hidden image, re-uploaded every frame.
    const url = mjpegUrl(hass, this.entity);
    if (!url) return this.still();
    const img = hidden(document.createElement("img"));
    this.el = img;
    img.onload = () => run === this.run && this.show(img);
    img.onerror = () => {
      if (run !== this.run) return;
      img.remove();
      this.el = undefined;
      this.still();
    };
    img.src = url;
    // Not every browser fires load for a multipart stream: take it as soon as a frame has decoded.
    this.timer = window.setInterval(() => {
      if (run === this.run && img.naturalWidth && this.texture?.image !== img) this.show(img);
    }, 300);
  }

  /** Called every animation frame while live: hands the newest video or MJPEG frame to the GPU. */
  frame() {
    if (this.texture && this.el instanceof HTMLImageElement) this.texture.needsUpdate = true;
  }

  stop() {
    this.run++;
    clearInterval(this.timer);
    this.timer = undefined;
    this.stopRtc?.();
    this.stopRtc = undefined;
    if (this.el) {
      // An image keeps the MJPEG connection open until its source is cleared.
      if (this.el instanceof HTMLImageElement) this.el.src = "";
      this.el.remove();
      this.el = undefined;
    }
    this.mode = undefined;
  }

  dispose() {
    this.stop();
    this.texture?.dispose();
    this.texture = undefined;
  }
}
