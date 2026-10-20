import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { mdiArrowDown, mdiArrowUp, mdiCog, mdiServer } from "@mdi/js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { icon } from "../ui/icon";
import { energySettings } from "../settings";

type Stat = { start: number | string; change?: number | null };

/** Hourly kWh for today and yesterday, from the recorder's long-term statistics (what HA's Energy dashboard uses). */
async function loadHours(ctx: Ctx, id: string): Promise<{ today: number[]; yesterday: number[] }> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 1);
  const res = await ctx.hass.callWS<Record<string, Stat[]>>({
    type: "recorder/statistics_during_period",
    start_time: start.toISOString(),
    end_time: new Date().toISOString(),
    statistic_ids: [id],
    period: "hour",
    types: ["change"],
    units: { energy: "kWh" },
  });
  const today = new Array(24).fill(0);
  const yesterday = new Array(24).fill(0);
  const midnight = start.getTime() + 86_400_000;
  for (const row of res[id] ?? []) {
    const t = typeof row.start === "number" ? row.start : Date.parse(row.start);
    const hour = new Date(t).getHours();
    (t >= midnight ? today : yesterday)[hour] += row.change ?? 0;
  }
  return { today, yesterday };
}

@customElement("sn-energy-card")
export class SnEnergyCard extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @state() private hours?: { today: number[]; yesterday: number[] };
  private loadedFor?: string;
  private timer?: number;

  connectedCallback() {
    super.connectedCallback();
    this.timer = window.setInterval(() => this.refresh(true), 10 * 60_000);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.timer);
  }

  updated() {
    this.refresh(false);
  }

  private async refresh(force: boolean) {
    const id = this.ctx?.config.home.energy;
    if (!id || (!force && this.loadedFor === id)) return;
    this.loadedFor = id;
    try {
      this.hours = await loadHours(this.ctx, id);
    } catch {
      this.hours = undefined;
    }
  }

  private chart(today: number[], yesterday: number[]) {
    const now = new Date().getHours();
    const W = 300;
    const H = 110;
    const max = Math.max(0.1, ...today, ...yesterday);
    const x = (i: number) => (i / 24) * W;
    const y = (v: number) => H - 14 - (v / max) * (H - 30);
    const step = (vals: number[], upto: number) => {
      let d = "";
      for (let i = 0; i <= upto && i < 24; i++) d += `${i ? "L" : "M"}${x(i)},${y(vals[i])} L${x(i + 1)},${y(vals[i])} `;
      return d;
    };
    // The two hungriest hours so far today get the hatched highlight.
    const peaks = today
      .map((v, i) => [v, i] as const)
      .filter(([, i]) => i <= now)
      .sort((a, b) => b[0] - a[0])
      .slice(0, 2)
      .filter(([v]) => v > 0)
      .map(([, i]) => i);
    return svg`
      <defs>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <rect width="6" height="6" fill="rgba(181,220,143,0.12)"></rect>
          <line x1="0" y1="0" x2="0" y2="6" stroke="#b5dc8f" stroke-width="2.4"></line>
        </pattern>
        <linearGradient id="fadeHatch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity="1"></stop>
          <stop offset="1" stop-color="#fff" stop-opacity="0.15"></stop>
        </linearGradient>
        <mask id="m"><rect width="${W}" height="${H}" fill="url(#fadeHatch)"></rect></mask>
      </defs>
      ${peaks.map(
        (i) => svg`<g mask="url(#m)"><rect x=${x(i)} y=${y(today[i])} width=${W / 24} height=${H - 14 - y(today[i])} fill="url(#hatch)"></rect></g>
          <circle cx=${x(i)} cy=${y(today[i])} r="2.4" fill="#d9f2bf"></circle>
          <circle cx=${x(i + 1)} cy=${y(today[i])} r="2.4" fill="#d9f2bf"></circle>`,
      )}
      <path d=${step(yesterday, 23)} fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.2"></path>
      <path d=${step(today, now)} fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.4" stroke-dasharray="2.5 3"></path>
      ${today.slice(0, now + 1).map((v, i) => (i % 3 === 0 ? svg`<circle cx=${x(i)} cy=${y(v)} r="2" fill="#e8e8e8"></circle>` : nothing))}
    `;
  }

  render() {
    const { t, config, editing } = this.ctx;
    const id = config.home.energy;
    const h = this.hours;
    const now = new Date().getHours();
    const total = h ? h.today.reduce((a, b) => a + b, 0) : undefined;
    const ySame = h ? h.yesterday.slice(0, now + 1).reduce((a, b) => a + b, 0) : 0;
    const delta = h && ySame > 0 ? Math.round(((total! - ySame) / ySame) * 100) : undefined;
    return html`
      <div class="card">
        <div class="head">
          <span class="badge">${icon(mdiServer, 22)}</span>
          <div>
            <h3>${t("energy_usage")}</h3>
            ${delta !== undefined
              ? html`<span class="delta ${delta > 0 ? "up" : ""}"
                  ><span class="dot">${icon(delta > 0 ? mdiArrowUp : mdiArrowDown, 14)}</span>${t("vs_yesterday", {
                    pct: delta > 0 ? `+${delta}` : delta,
                  })}</span
                >`
              : nothing}
          </div>
          ${editing
            ? html`<button class="round gear" aria-label=${t("settings")} @click=${() => energySettings(this.ctx)}>${icon(mdiCog, 18)}</button>`
            : nothing}
        </div>
        ${!id
          ? html`<div class="empty">${t("no_energy")}</div>`
          : html`
              <div class="value">${total !== undefined ? total.toFixed(1) : "–"}<small>kWh</small></div>
              ${h
                ? html`<svg class="chart" viewBox="0 0 300 110" preserveAspectRatio="none">${this.chart(h.today, h.yesterday)}</svg>
                    <div class="axis"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div>`
                : html`<div class="empty">${t("not_configured")}</div>`}
            `}
      </div>
    `;
  }

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .card {
        height: 100%;
        padding: 22px 22px 18px;
        border-radius: 34px;
        background: var(--sn-ink);
        color: #f5f5f5;
        box-shadow: 0 24px 50px -20px rgba(0, 0, 0, 0.6);
      }
      .head {
        display: flex;
        gap: 14px;
        align-items: flex-start;
      }
      .head > div {
        flex: 1;
        display: grid;
        gap: 6px;
      }
      .badge {
        display: grid;
        place-items: center;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: #1e1e1e;
      }
      h3 {
        margin: 4px 0 0;
        font-weight: 400;
        font-size: 21px;
      }
      .delta {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        width: max-content;
        padding: 3px 12px 3px 3px;
        border-radius: 999px;
        background: #1c1c1c;
        font-size: 12px;
        color: #cfcfcf;
      }
      .delta .dot {
        display: grid;
        place-items: center;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #34452a;
        color: var(--sn-accent);
      }
      .delta.up .dot {
        background: #4a2f26;
        color: #f2a487;
      }
      .value {
        margin: 18px 0 8px;
        font-size: 52px;
        font-weight: 300;
        letter-spacing: -0.03em;
        line-height: 1;
      }
      .value small {
        font-size: 15px;
        letter-spacing: 0;
        margin-inline-start: 2px;
      }
      .chart {
        display: block;
        width: 100%;
        height: 110px;
        direction: ltr;
      }
      .axis {
        display: flex;
        justify-content: space-between;
        direction: ltr;
        font-size: 11px;
        color: #8c8c8c;
      }
      .empty {
        color: #7d7d7d;
      }
      .round {
        border-color: #2a2a2a;
        background: #1c1c1c;
        color: #eee;
      }
    `,
  ];
}
