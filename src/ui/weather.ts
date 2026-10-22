import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  mdiWeatherCloudy,
  mdiWeatherFog,
  mdiWeatherHail,
  mdiWeatherLightning,
  mdiWeatherLightningRainy,
  mdiWeatherNight,
  mdiWeatherNightPartlyCloudy,
  mdiWeatherPartlyCloudy,
  mdiWeatherPouring,
  mdiWeatherRainy,
  mdiWeatherSnowy,
  mdiWeatherSnowyRainy,
  mdiWeatherSunny,
  mdiWeatherWindy,
  mdiWeatherWindyVariant,
  mdiWaterPercent,
  mdiWeatherDust,
} from "@mdi/js";
import type { Ctx } from "../ctx";
import type { Hass } from "../types";
import { shared } from "../styles";
import { icon } from "./icon";

const ICONS: Record<string, string> = {
  "clear-night": mdiWeatherNight,
  cloudy: mdiWeatherCloudy,
  exceptional: mdiWeatherDust,
  fog: mdiWeatherFog,
  hail: mdiWeatherHail,
  lightning: mdiWeatherLightning,
  "lightning-rainy": mdiWeatherLightningRainy,
  partlycloudy: mdiWeatherPartlyCloudy,
  pouring: mdiWeatherPouring,
  rainy: mdiWeatherRainy,
  snowy: mdiWeatherSnowy,
  "snowy-rainy": mdiWeatherSnowyRainy,
  sunny: mdiWeatherSunny,
  windy: mdiWeatherWindy,
  "windy-variant": mdiWeatherWindyVariant,
};

/** The weather icon for a condition; partly cloudy at night gets the moon. */
export function weatherIcon(condition: string | undefined, night = false): string {
  if (night && condition === "partlycloudy") return mdiWeatherNightPartlyCloudy;
  if (night && condition === "sunny") return mdiWeatherNight;
  return ICONS[condition ?? ""] ?? mdiWeatherPartlyCloudy;
}

/** The weather entity to show: the one picked in settings, else the first one Home Assistant has. */
export function weatherEntity(ctx: Pick<Ctx, "hass" | "config">): string | undefined {
  const picked = ctx.config.home.weather;
  if (picked && ctx.hass.states[picked]) return picked;
  return Object.keys(ctx.hass.states).find((id) => id.startsWith("weather.") && ctx.hass.states[id].state !== "unavailable");
}

export const isNight = (hass: Hass) => hass.states["sun.sun"]?.state === "below_horizon";

interface Day {
  datetime: string;
  condition?: string;
  temperature?: number;
  templow?: number;
  precipitation_probability?: number;
}

/** Now, and the next five days (Home Assistant's daily forecast, subscribed while open). */
@customElement("sn-weather-view")
export class SnWeatherView extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @property() entity!: string;
  @state() private days: Day[] = [];
  private unsub?: Promise<() => void>;

  connectedCallback() {
    super.connectedCallback();
    this.unsub = this.ctx.hass.connection
      .subscribeMessage<{ forecast?: Day[] }>((m) => (this.days = (m.forecast ?? []).slice(0, 5)), {
        type: "weather/subscribe_forecast",
        entity_id: this.entity,
        forecast_type: "daily",
      })
      .catch(() => () => {});
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsub?.then((u) => u());
    this.unsub = undefined;
  }

  render() {
    const { hass, t, lang } = this.ctx;
    const s = hass.states[this.entity];
    if (!s) return nothing;
    const a = s.attributes;
    const unit = a.temperature_unit ?? "°";
    return html`
      <div class="now">
        <span class="big-icon">${icon(weatherIcon(s.state, isNight(hass)), 64)}</span>
        <div>
          <div class="temp">${Math.round(a.temperature)}<small>${unit.replace(/[CF]$/, "")}</small></div>
          <div class="cond">${t(`w_${s.state}` as Parameters<typeof t>[0])}</div>
        </div>
        <div class="extra">
          ${a.humidity !== undefined ? html`<span>${icon(mdiWaterPercent, 16)}${Math.round(a.humidity)}%</span>` : nothing}
          ${a.wind_speed !== undefined ? html`<span>${icon(mdiWeatherWindy, 16)}${Math.round(a.wind_speed)} ${a.wind_speed_unit ?? ""}</span>` : nothing}
        </div>
      </div>
      <div class="days">
        ${this.days.map(
          (d) => html`<div class="day">
            <span class="dname">${new Date(d.datetime).toLocaleDateString(lang, { weekday: "short" })}</span>
            ${icon(weatherIcon(d.condition), 30)}
            <b>${d.temperature !== undefined ? Math.round(d.temperature) : "–"}°</b>
            <span class="low">${d.templow !== undefined ? `${Math.round(d.templow)}°` : ""}</span>
            ${d.precipitation_probability ? html`<span class="rain">${d.precipitation_probability}%</span>` : nothing}
          </div>`,
        )}
      </div>
    `;
  }

  static styles = [
    shared,
    css`
      :host {
        display: grid;
        gap: 22px;
      }
      .now {
        display: flex;
        align-items: center;
        gap: 18px;
        flex-wrap: wrap;
      }
      .big-icon {
        color: #ffd27a;
        filter: drop-shadow(0 0 18px rgba(255, 200, 100, 0.4));
      }
      .temp {
        font-size: 56px;
        font-weight: 300;
        line-height: 1;
      }
      .temp small {
        font-size: 24px;
        vertical-align: top;
      }
      .cond {
        color: var(--sn-text-dim);
        font-size: 15px;
      }
      .extra {
        display: grid;
        gap: 6px;
        margin-inline-start: auto;
        color: var(--sn-text-dim);
        font-size: 14px;
      }
      .extra span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .days {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px;
      }
      .day {
        display: grid;
        justify-items: center;
        gap: 6px;
        padding: 14px 6px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid var(--sn-glass-border);
        font-size: 13px;
      }
      .dname {
        color: var(--sn-text-dim);
      }
      .day b {
        font-size: 18px;
        font-weight: 500;
      }
      .low {
        color: var(--sn-text-dim);
      }
      .rain {
        color: #8fc4ff;
        font-size: 12px;
      }
    `,
  ];
}
