import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Ctx } from "../ctx";
import { nameOf } from "../ha";
import { icon } from "./icon";
import { isNight, weatherEntity, weatherIcon } from "./weather";

/**
 * The wall tablet's resting screen: a big clock, the date, the weather and who's home, drifting slowly so nothing
 * burns into the screen, and dimmer at night. A tap fires `wake` (on click, so the finger that lifts doesn't also
 * press whatever is under the saver).
 */
@customElement("sn-screensaver")
export class SnScreensaver extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @state() private now = new Date();
  @state() private drift = { x: 0, y: 0 };
  private timer?: number;

  connectedCallback() {
    super.connectedCallback();
    this.timer = window.setInterval(() => {
      this.now = new Date();
      // A new spot every minute.
      if (this.now.getSeconds() < 2) this.drift = { x: (Math.random() - 0.5) * 16, y: (Math.random() - 0.5) * 14 };
    }, 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.timer);
  }

  private wake = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("wake"));
  };

  render() {
    const { hass, lang, t } = this.ctx;
    const w = weatherEntity(this.ctx);
    const ws = w ? hass.states[w] : undefined;
    const people = Object.keys(hass.states).filter((id) => id.startsWith("person.") && hass.states[id].state === "home");
    const h = this.now.getHours();
    const night = h >= 22 || h < 6;
    return html`<div
      class="saver ${night ? "night" : ""}"
      @click=${this.wake}
    >
      <div class="content" style="transform: translate(${this.drift.x}vw, ${this.drift.y}vh)">
        <div class="clock">${this.now.toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" })}</div>
        <div class="date">${this.now.toLocaleDateString(lang, { weekday: "long", day: "numeric", month: "long" })}</div>
        ${ws && typeof ws.attributes.temperature === "number"
          ? html`<div class="weather">
              ${icon(weatherIcon(ws.state, isNight(hass)), 34)}
              <b>${Math.round(ws.attributes.temperature)}°</b>
              <span>${t(`w_${ws.state}` as Parameters<typeof t>[0])}</span>
            </div>`
          : nothing}
        <div class="people">
          ${people.length
            ? people.map((id) => {
                const pic = hass.states[id].attributes.entity_picture as string | undefined;
                const name = nameOf(hass, id);
                return html`<div class="person">
                  ${pic ? html`<img src=${pic} alt="" />` : html`<span class="initial">${name.slice(0, 1)}</span>`}
                  <small>${name.split(" ")[0]}</small>
                </div>`;
              })
            : html`<small class="nobody">${t("nobody_home")}</small>`}
        </div>
      </div>
    </div>`;
  }

  static styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 50;
      animation: fade 0.8s ease;
    }
    @keyframes fade {
      from {
        opacity: 0;
      }
    }
    .saver {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      background: radial-gradient(circle at 50% 40%, #1d1a17, #050404 70%);
      color: #f4efe8;
      cursor: pointer;
      -webkit-user-select: none;
      user-select: none;
      transition: opacity 1s ease;
    }
    .saver.night .content {
      opacity: 0.45;
    }
    .content {
      display: grid;
      justify-items: center;
      gap: 14px;
      transition: transform 3s ease, opacity 1s ease;
    }
    .clock {
      font-size: clamp(90px, 18vw, 220px);
      font-weight: 200;
      letter-spacing: -0.02em;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .date {
      font-size: clamp(18px, 2.4vw, 28px);
      opacity: 0.7;
    }
    .weather {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      margin-top: 10px;
      font-size: 20px;
      color: #ffd27a;
    }
    .weather b {
      color: #f4efe8;
      font-weight: 400;
      font-size: 30px;
    }
    .weather span {
      color: #f4efe8;
      opacity: 0.7;
    }
    .people {
      display: flex;
      gap: 18px;
      margin-top: 22px;
    }
    .person {
      display: grid;
      justify-items: center;
      gap: 6px;
      font-size: 13px;
      opacity: 0.85;
    }
    .person img,
    .initial {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(181, 220, 143, 0.7);
      box-shadow: 0 0 18px rgba(181, 220, 143, 0.25);
    }
    .initial {
      display: grid;
      place-items: center;
      background: #2a2622;
      font-size: 22px;
    }
    .nobody {
      opacity: 0.6;
    }
  `;
}
