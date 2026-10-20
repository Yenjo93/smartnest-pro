import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { mdiFlash, mdiSolarPower } from "@mdi/js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { icon } from "../ui/icon";
import { byDomain, nameOf, powerKw } from "../ha";
import { pageHead, pageStyles } from "./page";
import "../cards/energy-card";

type Stat = { start: number | string; change?: number | null };
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

/** Daily totals from the recorder, keyed by local day. */
async function loadDays(ctx: Ctx, ids: string[], from: Date): Promise<Record<string, Map<string, number>>> {
  const res = await ctx.hass.callWS<Record<string, Stat[]>>({
    type: "recorder/statistics_during_period",
    start_time: from.toISOString(),
    end_time: new Date().toISOString(),
    statistic_ids: ids,
    period: "day",
    types: ["change"],
    units: { energy: "kWh" },
  });
  const out: Record<string, Map<string, number>> = {};
  for (const id of ids) {
    const m = new Map<string, number>();
    for (const row of res[id] ?? []) {
      const t = typeof row.start === "number" ? row.start : Date.parse(row.start);
      const k = dayKey(new Date(t));
      m.set(k, (m.get(k) ?? 0) + (row.change ?? 0));
    }
    out[id] = m;
  }
  return out;
}

@customElement("sn-energy-page")
export class SnEnergyPage extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @state() private days?: Record<string, Map<string, number>>;
  private loadedFor?: string;

  updated() {
    const { energy, solar_energy } = this.ctx.config.home;
    const ids = [energy, solar_energy].filter(Boolean) as string[];
    const key = ids.join();
    if (!ids.length || key === this.loadedFor) return;
    this.loadedFor = key;
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), Math.min(1, now.getDate() - 6));
    loadDays(this.ctx, ids, from)
      .then((d) => (this.days = d))
      .catch(() => (this.days = undefined));
  }

  render() {
    const { hass, t, config, lang } = this.ctx;
    const { energy, solar_energy, solar_power } = config.home;
    const grid = energy ? this.days?.[energy] : undefined;
    const solar = solar_energy ? this.days?.[solar_energy] : undefined;
    const today = new Date();
    const day = (offset: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() - offset);
      return d;
    };
    const val = (m: Map<string, number> | undefined, d: Date) => m?.get(dayKey(d));
    const month = grid ? [...grid.entries()].filter(([k]) => k.startsWith(`${today.getFullYear()}-${today.getMonth()}-`)).reduce((a, [, v]) => a + v, 0) : undefined;
    const week = Array.from({ length: 7 }, (_, i) => day(6 - i));
    const weekMax = Math.max(0.1, ...week.map((d) => (val(grid, d) ?? 0) + (val(solar, d) ?? 0)));
    const fmt = (v?: number) => (v === undefined ? "–" : v.toFixed(1));

    const consumers = byDomain(hass, "sensor")
      .filter((id) => hass.states[id].attributes.device_class === "power" && id !== solar_power)
      .map((id) => ({ id, kw: powerKw(hass.states[id]) ?? 0 }))
      .filter((c) => c.kw > 0.001)
      .sort((a, b) => b.kw - a.kw)
      .slice(0, 8);
    const topMax = consumers[0]?.kw ?? 1;
    const solarNow = solar_power ? powerKw(hass.states[solar_power]) : undefined;

    if (!energy) return html`${pageHead(t("energy"))}<div class="glass"><div class="empty">${t("no_energy")}</div></div>`;
    return html`
      ${pageHead(t("energy"), [solarNow !== undefined ? html`${icon(mdiSolarPower, 16)}${t("eco_solar", { kw: solarNow.toFixed(1) })}` : undefined])}
      <div class="stats">
        <div class="glass stat"><span>${t("today")}</span><b>${fmt(val(grid, today))}<small>kWh</small></b></div>
        <div class="glass stat"><span>${t("yesterday")}</span><b>${fmt(val(grid, day(1)))}<small>kWh</small></b></div>
        <div class="glass stat"><span>${t("this_month")}</span><b>${fmt(month)}<small>kWh</small></b></div>
        ${solar_energy ? html`<div class="glass stat sun"><span>${t("solar_today")}</span><b>${fmt(val(solar, today))}<small>kWh</small></b></div>` : nothing}
      </div>
      <div class="cols">
        <sn-energy-card .ctx=${this.ctx}></sn-energy-card>
        <div class="glass card week">
          <h3>${t("last_7_days")}</h3>
          <div class="bars">
            ${week.map((d) => {
              const g = val(grid, d) ?? 0;
              const s = val(solar, d) ?? 0;
              return html`<div class="col">
                <span class="v">${(g + s).toFixed(0)}</span>
                <div class="stack" style="height:${((g + s) / weekMax) * 100}%">
                  ${s ? html`<span class="s" style="flex:${s}"></span>` : nothing}
                  <span class="g" style="flex:${g || 0.0001}"></span>
                </div>
                <span class="d">${d.toLocaleDateString(lang, { weekday: "short" })}</span>
              </div>`;
            })}
          </div>
        </div>
      </div>
      ${consumers.length
        ? html`<div class="section">${t("top_consumers")}</div>
            <div class="glass card list">
              ${consumers.map(
                (c) => html`<div class="row">
                  <span class="ic">${icon(mdiFlash, 16)}</span>
                  <span class="name">${nameOf(hass, c.id)}</span>
                  <span class="bar"><span style="width:${(c.kw / topMax) * 100}%"></span></span>
                  <span class="kw">${c.kw >= 1 ? `${c.kw.toFixed(2)} kW` : `${Math.round(c.kw * 1000)} W`}</span>
                </div>`,
              )}
            </div>`
        : nothing}
    `;
  }

  static styles = [
    shared,
    pageStyles,
    css`
      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
        gap: 14px;
        margin-bottom: 16px;
      }
      .stat {
        display: grid;
        gap: 6px;
        padding: 16px 18px;
      }
      .stat span {
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .stat b {
        font-size: 30px;
        font-weight: 300;
      }
      .stat small {
        font-size: 13px;
        margin-inline-start: 3px;
      }
      .stat.sun b {
        color: var(--sn-accent);
      }
      .cols {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 16px;
      }
      h3 {
        margin: 0 0 14px;
        font-size: 19px;
        font-weight: 400;
      }
      .bars {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 10px;
        height: 220px;
      }
      .col {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        gap: 6px;
        min-height: 0;
      }
      .stack {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 38px;
        min-height: 4px;
        border-radius: 10px;
        overflow: hidden;
      }
      .stack .g {
        background: rgba(255, 255, 255, 0.55);
      }
      .stack .s {
        background: var(--sn-accent);
      }
      .v,
      .d {
        font-size: 11px;
        color: var(--sn-text-dim);
      }
      .list {
        display: grid;
        gap: 12px;
      }
      .row {
        display: grid;
        grid-template-columns: auto minmax(90px, 1fr) 2fr auto;
        align-items: center;
        gap: 12px;
        font-size: 14px;
      }
      .ic {
        color: var(--sn-accent);
      }
      .kw {
        font-size: 13px;
        color: var(--sn-text-dim);
        min-width: 64px;
        text-align: end;
      }
    `,
  ];
}
