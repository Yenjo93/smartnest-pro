import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { mdiFlash, mdiSolarPower, mdiCog } from "@mdi/js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { icon } from "../ui/icon";
import { byDomain, nameOf, powerKw } from "../ha";
import { pageHead, pageStyles } from "./page";
import { hiddenButton, hideable, shown } from "./hide";
import "../cards/energy-card";
import { energySettings } from "../settings";

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
      if (!Number.isFinite(t) || typeof row.change !== "number" || !Number.isFinite(row.change)) continue;
      const k = dayKey(new Date(t));
      m.set(k, (m.get(k) ?? 0) + row.change);
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
  private requestVersion = 0;
  private timer?: number;
  @state() private loading = false;
  @state() private statisticsError = false;

  connectedCallback() {
    super.connectedCallback();
    this.timer = window.setInterval(() => this.refresh(true), 10 * 60_000);
  }

  disconnectedCallback() {
    clearInterval(this.timer);
    this.requestVersion++;
    super.disconnectedCallback();
  }

  updated() { this.refresh(false); }

  private async refresh(force: boolean) {
    const { energy, solar_energy } = this.ctx.config.home;
    const ids = [...new Set([energy, solar_energy].filter(Boolean) as string[])];
    const key = ids.join() + dayKey(new Date());
    if (!ids.length) { this.days = undefined; this.loadedFor = undefined; return; }
    if (!force && key === this.loadedFor) return;
    this.loadedFor = key;
    const request = ++this.requestVersion;
    this.loading = true;
    this.statisticsError = false;
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    try {
      const days = await loadDays(this.ctx, ids, from);
      if (request === this.requestVersion && this.isConnected) this.days = days;
    } catch {
      if (request === this.requestVersion && this.isConnected) { this.days = undefined; this.statisticsError = true; }
    } finally {
      if (request === this.requestVersion && this.isConnected) this.loading = false;
    }
  }

  private text(ar: string, en: string) { return this.ctx.lang === "ar" ? ar : en; }

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
    const monthDays = Array.from({ length: today.getDate() }, (_, index) => new Date(today.getFullYear(), today.getMonth(), index + 1));
    const monthSamples = monthDays.map(date => val(grid, date)).filter((value): value is number => value !== undefined);
    const month = monthSamples.length ? monthSamples.reduce((sum, value) => sum + value, 0) : undefined;
    const completeMonth = monthSamples.length === monthDays.length;
    const previousMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    const comparableDays = Math.min(today.getDate() - 1, previousMonthLastDay);
    const currentComparable = Array.from({ length: comparableDays }, (_, i) => val(grid, new Date(today.getFullYear(), today.getMonth(), i + 1)));
    const previousComparable = Array.from({ length: comparableDays }, (_, i) => val(grid, new Date(today.getFullYear(), today.getMonth() - 1, i + 1)));
    const comparable = comparableDays > 0 && currentComparable.every(value => value !== undefined) && previousComparable.every(value => value !== undefined);
    const currentSum = currentComparable.reduce<number>((sum, value) => sum + (value ?? 0), 0);
    const previousSum = previousComparable.reduce<number>((sum, value) => sum + (value ?? 0), 0);
    const monthlyDelta = comparable && previousSum > 0 ? (currentSum - previousSum) / previousSum * 100 : undefined;
    const experience = config.experience ?? {};
    const tariff = typeof experience.tariff === "number" && Number.isFinite(experience.tariff) && experience.tariff >= 0 ? experience.tariff : undefined;
    const currency = experience.currency?.trim() || this.text("عملة", "currency");
    const monitoredPower = (experience as typeof experience & { power_entity?: string }).power_entity;
    const livePower = monitoredPower ? powerKw(hass.states[monitoredPower]) : undefined;
    const budget = typeof experience.monthly_budget === "number" && experience.monthly_budget > 0 ? experience.monthly_budget : undefined;
    const cost = month !== undefined && tariff !== undefined ? month * tariff : undefined;
    const budgetPercent = cost !== undefined && budget ? cost / budget * 100 : undefined;
    const alertThreshold = typeof experience.power_alert_kw === "number" && experience.power_alert_kw > 0 ? experience.power_alert_kw : undefined;
    const powerAlert = livePower !== undefined && alertThreshold !== undefined && livePower > alertThreshold;
    const week = Array.from({ length: 7 }, (_, i) => day(6 - i));
    const weekMax = Math.max(0.1, ...week.map((d) => (val(grid, d) ?? 0) + (val(solar, d) ?? 0)));
    const fmt = (v?: number) => (v === undefined ? "–" : v.toFixed(1));

    const consumers = shown(this.ctx, "energy", byDomain(hass, "sensor"))
      .filter((id) => hass.states[id].attributes.device_class === "power" && id !== solar_power)
      .map((id) => ({ id, kw: powerKw(hass.states[id]) ?? 0 }))
      .filter((c) => c.kw > 0.001)
      .sort((a, b) => b.kw - a.kw)
      .slice(0, 8);
    const topMax = consumers[0]?.kw ?? 1;
    const solarNow = solar_power ? powerKw(hass.states[solar_power]) : undefined;

    if (!energy) return html`${pageHead(t("energy"))}<div class="glass"><div class="empty">${t("no_energy")}<p>${this.text("اختار عداد طاقة تراكمي من إعدادات الطاقة لعرض الاستهلاك والتكلفة الفعلية.", "Choose a cumulative energy meter in energy settings to show recorded consumption and estimated cost.")}</p>${this.ctx.isAdmin ? html`<button class="pill" @click=${() => energySettings(this.ctx)}>${icon(mdiCog, 16)}${t("settings")}</button>` : nothing}</div></div>`;
    return html`
      ${pageHead(t("energy"), [solarNow !== undefined ? html`${icon(mdiSolarPower, 16)}${t("eco_solar", { kw: solarNow.toFixed(1) })}` : undefined], hiddenButton(this.ctx, "energy"))}
      ${this.loading ? html`<p class="status-note" role="status">${this.text("عم نقرأ إحصائيات الطاقة المسجلة…", "Loading recorded energy statistics…")}</p>` : nothing}
      ${this.statisticsError ? html`<div class="glass energy-note" role="status">${this.text("تعذّر قراءة إحصائيات Home Assistant. تأكد من تفعيل Recorder وإحصائيات عداد الطاقة.", "Home Assistant statistics could not be read. Check Recorder and the energy meter statistics.")}<button class="pill" @click=${() => this.refresh(true)}>${this.text("إعادة المحاولة", "Retry")}</button></div>` : nothing}
      ${powerAlert ? html`<div class="glass energy-alert" role="alert">${this.text("الاستهلاك اللحظي أعلى من الحد المحدد", "Current power exceeds your configured limit")}: ${livePower!.toFixed(2)} kW / ${alertThreshold!.toFixed(2)} kW</div>` : nothing}
      <div class="stats">
        <div class="glass stat"><span>${t("today")}</span><b>${fmt(val(grid, today))}<small>kWh</small></b></div>
        <div class="glass stat"><span>${t("yesterday")}</span><b>${fmt(val(grid, day(1)))}<small>kWh</small></b></div>
        <div class="glass stat"><span>${t("this_month")}</span><b>${fmt(month)}<small>kWh</small></b></div>
        <div class="glass stat"><span>${this.text("القدرة الآن", "Power now")}</span><b>${fmt(livePower)}<small>kW</small></b>${!monitoredPower ? html`<small>${this.text("اختار حساس القدرة من الإعدادات", "Choose a power sensor in settings")}</small>` : livePower === undefined ? html`<small>${this.text("حساس القدرة غير متاح", "Power sensor unavailable")}</small>` : nothing}</div>
        <div class="glass stat"><span>${this.text("تكلفة تقديرية حسب الاستهلاك الحالي", "Estimated cost at the current rate")}</span><b>${livePower !== undefined && tariff !== undefined ? (Math.max(0, livePower) * tariff).toFixed(2) : "–"}<small>${currency}/${this.text("ساعة", "hour")}</small></b>${tariff === undefined ? html`<small>${this.text("أدخل تعرفة kWh في الإعدادات", "Set your kWh tariff in settings")}</small>` : nothing}</div>
        <div class="glass stat"><span>${this.text("تكلفة الاستهلاك المسجل هذا الشهر", "Recorded month-to-date cost")}</span><b>${cost === undefined ? "–" : cost.toFixed(2)}<small>${currency}</small></b>${!completeMonth && month !== undefined ? html`<small>${this.text("بعض الأيام بدون بيانات؛ الإجمالي غير مكتمل", "Some days have no data; this total is incomplete")}</small>` : nothing}</div>
        ${solar_energy ? html`<div class="glass stat sun"><span>${t("solar_today")}</span><b>${fmt(val(solar, today))}<small>kWh</small></b></div>` : nothing}
      </div>
      <div class="energy-insights">
        <div class="glass card"><h3>${this.text("مقارنة الشهر الماضي", "Previous-month comparison")}</h3>${monthlyDelta === undefined ? html`<p>${this.text("نحتاج بيانات كاملة للأيام المقابلة حتى نعرض مقارنة دقيقة.", "Complete data for matching days is needed for an accurate comparison.")}</p>` : html`<b class="comparison">${monthlyDelta > 0 ? "+" : ""}${monthlyDelta.toFixed(1)}%</b><p>${this.text(`مقارنة أول ${comparableDays} أيام مكتملة من الشهرين؛ اليوم الحالي مستثنى.`, `Comparing the first ${comparableDays} completed days in each month; today is excluded.`)}</p>`}</div>
        <div class="glass card"><h3>${this.text("ميزانية الطاقة الشهرية", "Monthly energy budget")}</h3>${budgetPercent === undefined ? html`<p>${this.text("حدد التعرفة والميزانية وعدّاد الطاقة من الإعدادات لعرض التقدم.", "Set your tariff, budget and energy meter in settings to track progress.")}</p>` : html`<div class="budget-head"><b>${cost!.toFixed(2)} / ${budget!.toFixed(2)} ${currency}</b><span>${budgetPercent.toFixed(0)}%</span></div><progress max="100" .value=${Math.min(100, Math.max(0, budgetPercent))} aria-label=${this.text("نسبة استهلاك الميزانية", "Budget used")}></progress><p>${!completeMonth ? this.text("التقدم مبني على الأيام المتاحة فقط.", "Progress is based only on days with data.") : budgetPercent > 100 ? this.text("تجاوزت الميزانية المحددة.", "Your configured budget has been exceeded.") : this.text("تقدير حسب التعرفة المدخلة؛ لا يشمل الرسوم والضرائب.", "Estimate from your entered tariff; excludes fixed fees and taxes.")}</p>`}</div>
      </div>
      ${this.ctx.isAdmin ? html`<button class="pill configure" @click=${() => energySettings(this.ctx)}>${icon(mdiCog, 16)}${this.text("إعدادات الطاقة والتكلفة", "Energy and cost settings")}</button>` : nothing}
      <div class="cols">
        <sn-energy-card .ctx=${this.ctx}></sn-energy-card>
        <div class="glass card week">
          <h3>${t("last_7_days")}</h3>
          <div class="bars">
            ${week.map((d) => {
              const gridValue = val(grid, d);
              const solarValue = val(solar, d);
              const hasData = gridValue !== undefined || solarValue !== undefined;
              const g = gridValue ?? 0;
              const s = solarValue ?? 0;
              return html`<div class="col">
                <span class="v">${hasData ? (g + s).toFixed(0) : "–"}</span>
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
                (c) => hideable(this.ctx, "energy", c.id, html`<div class="row" @click=${() => this.ctx.openEntity(c.id)}>
                  <span class="ic">${icon(mdiFlash, 16)}</span>
                  <span class="name">${nameOf(hass, c.id)}</span>
                  <span class="bar"><span style="width:${(c.kw / topMax) * 100}%"></span></span>
                  <span class="kw">${c.kw >= 1 ? `${c.kw.toFixed(2)} kW` : `${Math.round(c.kw * 1000)} W`}</span>
                </div>`),
              )}
            </div>`
        : nothing}
    `;
  }

  static styles = [
    shared,
    pageStyles,
    css`
      .energy-insights { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 14px; margin-bottom: 16px; }
      .energy-insights p, .status-note { color: var(--sn-text-dim); font-size: 12px; line-height: 1.8; }
      .energy-note, .energy-alert { padding: 16px; margin-bottom: 14px; font-size: 13px; line-height: 1.8; }
      .energy-alert { border-color: #d49351; color: var(--sn-warm, #ffad75); }
      .energy-note .pill { margin-inline-start: 12px; }
      .configure { margin-bottom: 16px; }
      .comparison { font-size: 32px; font-weight: 400; }
      .budget-head { display: flex; justify-content: space-between; gap: 10px; font-size: 13px; }
      progress { display: block; width: 100%; height: 10px; margin-top: 14px; accent-color: var(--sn-accent); }
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
        cursor: pointer;
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
