import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { mdiPause, mdiPlay, mdiPower, mdiSkipNext, mdiSkipPrevious, mdiVolumeHigh } from "@mdi/js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { entityIcon, icon } from "../ui/icon";
import { areaName, byDomain, isOn, nameOf } from "../ha";
import { pageHead, pageStyles } from "./page";

// media_player supported_features bits
const PAUSE = 1;
const VOLUME_SET = 4;
const PREVIOUS = 16;
const NEXT = 32;
const TURN_ON = 128;
const PLAY = 16384;

/** TVs and speakers: artwork, what's playing, transport buttons and a volume slider. Playing ones come first. */
@customElement("sn-media-page")
export class SnMediaPage extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @state() private liveVol: Record<string, number> = {};

  private volDrag(e: PointerEvent, id: string) {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const rtl = this.ctx.rtl;
    const frac = (ev: PointerEvent) => {
      const f = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
      return rtl ? 1 - f : f;
    };
    el.setPointerCapture(e.pointerId);
    this.liveVol = { ...this.liveVol, [id]: frac(e) };
    const move = (ev: PointerEvent) => (this.liveVol = { ...this.liveVol, [id]: frac(ev) });
    const up = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      this.ctx.hass.callService("media_player", "volume_set", { entity_id: id, volume_level: Math.round(this.liveVol[id] * 100) / 100 });
      setTimeout(() => {
        const { [id]: _, ...rest } = this.liveVol;
        this.liveVol = rest;
      }, 1500);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  }

  private player(id: string) {
    const { hass, t } = this.ctx;
    const s = hass.states[id];
    const a = s.attributes;
    const f: number = a.supported_features ?? 0;
    const on = isOn(s);
    const playing = s.state === "playing";
    const art = a.entity_picture as string | undefined;
    const title = a.media_title as string | undefined;
    const sub = [a.media_artist, a.app_name ?? a.source].filter(Boolean).join(" · ");
    const vol = this.liveVol[id] ?? (typeof a.volume_level === "number" ? a.volume_level : undefined);
    const call = (service: string) => () => hass.callService("media_player", service, { entity_id: id });
    return html`<div class="glass player ${playing ? "playing" : ""}">
      <div class="art" style=${art && on ? `--art: url("${art}")` : ""}>
        ${art && on ? html`<img src=${art} alt="" loading="lazy" />` : icon(entityIcon(id, s), 46)}
      </div>
      <div class="body">
        <div class="head">
          <div class="titles">
            <span class="dev">${nameOf(hass, id)}${areaName(hass, id) ? html` · ${areaName(hass, id)}` : nothing}</span>
            <span class="title">${on ? title ?? s.state : t("off")}</span>
            ${on && sub ? html`<span class="sub">${sub}</span>` : nothing}
          </div>
          ${f & TURN_ON || on
            ? html`<button class="round small ${on ? "lit" : ""}" aria-label=${t("on")} @click=${call(on ? "turn_off" : "turn_on")}>${icon(mdiPower, 18)}</button>`
            : nothing}
        </div>
        ${on
          ? html`<div class="transport">
              ${f & PREVIOUS ? html`<button class="round" aria-label="previous" @click=${call("media_previous_track")}>${icon(mdiSkipPrevious)}</button>` : nothing}
              ${f & (PLAY | PAUSE)
                ? html`<button class="round big" aria-label=${playing ? "pause" : "play"} @click=${call("media_play_pause")}>${icon(playing ? mdiPause : mdiPlay, 26)}</button>`
                : nothing}
              ${f & NEXT ? html`<button class="round" aria-label="next" @click=${call("media_next_track")}>${icon(mdiSkipNext)}</button>` : nothing}
            </div>
            ${f & VOLUME_SET && vol !== undefined
              ? html`<div class="vol">
                  ${icon(mdiVolumeHigh, 18)}
                  <div class="vtrack" @pointerdown=${(e: PointerEvent) => this.volDrag(e, id)}>
                    <span style="width:${vol * 100}%"></span>
                  </div>
                  <span class="vnum">${Math.round(vol * 100)}</span>
                </div>`
              : nothing}`
          : nothing}
      </div>
    </div>`;
  }

  render() {
    const { hass, t } = this.ctx;
    const all = byDomain(hass, "media_player");
    const rank = (id: string) => (hass.states[id].state === "playing" ? 0 : isOn(hass.states[id]) ? 1 : 2);
    const ids = [...all].sort((a, b) => rank(a) - rank(b));
    const playing = all.filter((id) => hass.states[id].state === "playing").length;
    return html`
      ${pageHead(t("media"), [playing ? t("n_playing", { n: playing }) : t("nothing_playing")])}
      ${ids.length
        ? html`<div class="grid" style="--min: 340px">${ids.map((id) => this.player(id))}</div>`
        : html`<div class="glass"><div class="empty">${t("not_configured")}</div></div>`}
    `;
  }

  static styles = [
    shared,
    pageStyles,
    css`
      .player {
        display: flex;
        gap: 16px;
        padding: 16px;
        overflow: hidden;
      }
      .art {
        position: relative;
        flex: none;
        display: grid;
        place-items: center;
        width: 120px;
        height: 120px;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text-dim);
        overflow: hidden;
      }
      .art img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .playing .art {
        box-shadow: 0 10px 30px -8px rgba(0, 0, 0, 0.5);
      }
      .body {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .head {
        display: flex;
        gap: 8px;
      }
      .titles {
        flex: 1;
        min-width: 0;
        display: grid;
        gap: 2px;
      }
      .dev {
        font-size: 12px;
        color: var(--sn-text-faint);
      }
      .title {
        font-size: 17px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: capitalize;
      }
      .sub {
        font-size: 13px;
        color: var(--sn-text-dim);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .round.small {
        width: 36px;
        height: 36px;
      }
      .round.lit {
        background: var(--sn-accent);
        color: #1d2a12;
      }
      .transport {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .round.big {
        width: 54px;
        height: 54px;
        background: #fff;
        color: #1d1b19;
      }
      .vol {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--sn-text-dim);
      }
      .vtrack {
        position: relative;
        flex: 1;
        height: 26px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.1);
        overflow: hidden;
        touch-action: none;
        cursor: ew-resize;
      }
      .vtrack span {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        background: linear-gradient(90deg, rgba(181, 220, 143, 0.5), var(--sn-accent));
      }
      .vnum {
        min-width: 26px;
        font-size: 12px;
        text-align: end;
      }
    `,
  ];
}
