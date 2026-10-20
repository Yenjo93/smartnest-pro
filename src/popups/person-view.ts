import { LitElement, css, html, nothing, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { mdiBattery, mdiHomeVariantOutline, mdiMapMarkerOutline } from "@mdi/js";
import leafletCss from "leaflet/dist/leaflet.css?inline";
import type { Map as LMap } from "leaflet";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { nameOf, num, siblings, since } from "../ha";
import { icon } from "../ui/icon";
import { history, type Point } from "./history";

const HOME_SVG = `<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="${mdiHomeVariantOutline}"/></svg>`;

/** A person: where they are on a map with today's route, how long they've been there, battery, and today's places. */
@customElement("sn-person-view")
export class SnPersonView extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @property() entity!: string;
  @state() private points?: Point[];
  private map?: LMap;

  private battery(): number | undefined {
    const { hass } = this.ctx;
    const s = hass.states[this.entity];
    const trackers: string[] = [].concat(s?.attributes.source ?? [], s?.attributes.device_trackers ?? []);
    for (const tr of trackers) {
      const b = hass.states[tr]?.attributes.battery_level;
      if (typeof b === "number") return b;
      const sensor = siblings(hass, tr).find((e) => e.startsWith("sensor.") && hass.states[e]?.attributes.device_class === "battery");
      const n = sensor ? num(hass.states[sensor]) : undefined;
      if (n !== undefined) return n;
    }
    return undefined;
  }

  async firstUpdated() {
    try {
      this.points = await history(this.ctx.hass, this.entity, 24, true);
    } catch {
      this.points = [];
    }
    await this.drawMap();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.map?.remove();
    this.map = undefined;
  }

  private async drawMap() {
    const { hass, dark } = this.ctx;
    const s = hass.states[this.entity];
    const el = this.renderRoot.querySelector(".map") as HTMLElement | null;
    const lat = s?.attributes.latitude;
    const lon = s?.attributes.longitude;
    if (!el || typeof lat !== "number" || typeof lon !== "number") return;
    const L = await import("leaflet");
    const map = L.map(el, { zoomControl: false, attributionControl: true }).setView([lat, lon], 14);
    this.map = map;
    // Esri's muted canvas maps: free without a key, and calm enough to sit under the glass look.
    const canvas = dark ? "Dark_Gray_Base" : "Light_Gray_Base";
    L.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${canvas}/MapServer/tile/{z}/{y}/{x}`, {
      maxZoom: 16,
      attribution: "Tiles © Esri, HERE, Garmin, © OpenStreetMap contributors",
    }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);

    const route = (this.points ?? [])
      .map((p) => p.a)
      .filter((a): a is Record<string, any> => !!a && typeof a.latitude === "number" && typeof a.longitude === "number")
      .map((a) => [a.latitude, a.longitude] as [number, number]);
    if (route.length > 1) {
      L.polyline(route, { color: "#9ccf6c", weight: 5, opacity: 0.9, lineCap: "round", lineJoin: "round" }).addTo(map);
      L.circleMarker(route[0], { radius: 6, color: "#fff", weight: 2, fillColor: "#9ccf6c", fillOpacity: 1 }).addTo(map);
    }

    const home = hass.states["zone.home"]?.attributes;
    const bounds = L.latLngBounds([[lat, lon], ...route]);
    if (typeof home?.latitude === "number") {
      L.marker([home.latitude, home.longitude], {
        icon: L.divIcon({ className: "", html: `<div class="pin-home">${HOME_SVG}</div>`, iconSize: [36, 36], iconAnchor: [18, 18] }),
      }).addTo(map);
      bounds.extend([home.latitude, home.longitude]);
    }

    const pic = s.attributes.entity_picture as string | undefined;
    const face = pic ? `<img src="${pic}" alt="">` : `<span>${nameOf(hass, this.entity).slice(0, 1).toUpperCase()}</span>`;
    L.marker([lat, lon], {
      icon: L.divIcon({ className: "", html: `<div class="pin-me">${face}</div>`, iconSize: [54, 54], iconAnchor: [27, 27] }),
      zIndexOffset: 1000,
    }).addTo(map);
    if (bounds.isValid() && !bounds.getNorthEast().equals(bounds.getSouthWest())) map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16 });
    // The popup animates in; measure again once it has its final size.
    setTimeout(() => map.invalidateSize(), 350);
  }

  /** Consecutive places from today's history: home, a zone name, or away. */
  private places() {
    const { t } = this.ctx;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const out: { at: number; label: string; home: boolean }[] = [];
    for (const p of this.points ?? []) {
      if (p.t < start.getTime() && out.length) out.length = 0;
      const label = p.s === "home" ? t("home_state") : p.s === "not_home" ? t("away") : p.s;
      if (out[out.length - 1]?.label !== label) out.push({ at: Math.max(p.t, start.getTime()), label, home: p.s === "home" });
    }
    return out.reverse();
  }

  render() {
    const { hass, t, lang } = this.ctx;
    const s = hass.states[this.entity];
    if (!s) return html`<div class="empty">${t("not_configured")}</div>`;
    const home = s.state === "home";
    const where = home ? t("home_state") : s.state === "not_home" ? t("away") : s.state;
    const pic = s.attributes.entity_picture as string | undefined;
    const batt = this.battery();
    const hasLoc = typeof s.attributes.latitude === "number";
    return html`<div class="layout">
      <div class="map-wrap">${hasLoc ? html`<div class="map"></div>` : html`<div class="empty">${t("no_location")}</div>`}</div>
      <aside>
        <div class="who">
          <span class="avatar ${home ? "home" : ""}">
            ${pic ? html`<img src=${pic} alt="" />` : html`<span>${nameOf(hass, this.entity).slice(0, 1).toUpperCase()}</span>`}
          </span>
          <div>
            <span class="where ${home ? "home" : ""}">${icon(home ? mdiHomeVariantOutline : mdiMapMarkerOutline, 16)}${where}</span>
            <span class="since">${since(s.last_changed, lang)}</span>
          </div>
        </div>
        ${batt !== undefined
          ? html`<div class="batt ${batt < 20 ? "low" : ""}">
              ${icon(mdiBattery, 18)}<span class="bar"><span style="width:${batt}%"></span></span><b>${Math.round(batt)}%</b>
            </div>`
          : nothing}
        <div class="today">
          <h4>${t("places_today")}</h4>
          ${this.points === undefined
            ? html`<div class="empty">…</div>`
            : html`<ol>
                ${this.places().map(
                  (p) => html`<li class=${p.home ? "home" : ""}>
                    <span class="time">${new Date(p.at).toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" })}</span>
                    <span class="place">${p.label}</span>
                  </li>`,
                )}
              </ol>`}
        </div>
      </aside>
    </div>`;
  }

  static styles = [
    unsafeCSS(leafletCss),
    shared,
    css`
      :host {
        display: block;
      }
      .layout {
        display: grid;
        grid-template-columns: minmax(0, 1.7fr) minmax(240px, 1fr);
        gap: 18px;
      }
      @media (max-width: 760px) {
        .layout {
          grid-template-columns: 1fr;
        }
      }
      .map-wrap {
        min-height: 420px;
        border-radius: 24px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.18);
        border: 1px solid var(--sn-glass-border);
        display: grid;
      }
      @media (max-width: 760px) {
        .map-wrap {
          min-height: 300px;
        }
      }
      .map {
        width: 100%;
        height: 100%;
        min-height: inherit;
        background: transparent;
        font-family: var(--sn-font);
      }
      .leaflet-control-attribution {
        font-size: 9px;
        background: rgba(255, 255, 255, 0.55) !important;
      }
      .leaflet-bar a {
        background: var(--sn-glass-strong);
        color: var(--sn-text);
        border-color: var(--sn-glass-border);
        backdrop-filter: blur(10px);
      }
      .pin-me {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        border: 3px solid #b5dc8f;
        box-shadow: 0 0 0 6px rgba(181, 220, 143, 0.35), 0 10px 20px rgba(0, 0, 0, 0.35);
        background: #3a3530;
        color: #fff;
        overflow: hidden;
        display: grid;
        place-items: center;
        font: 300 22px var(--sn-font);
      }
      .pin-me img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .pin-home {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #fff;
        color: #1d1b19;
        display: grid;
        place-items: center;
        box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
      }
      aside {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .who {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .who > div {
        display: grid;
        gap: 4px;
      }
      .avatar {
        display: grid;
        place-items: center;
        width: 76px;
        height: 76px;
        border-radius: 50%;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.2);
        font-size: 30px;
        font-weight: 300;
      }
      .avatar.home {
        border-color: var(--sn-accent);
        box-shadow: 0 0 22px var(--sn-accent-glow);
      }
      .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .where {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 20px;
        text-transform: capitalize;
      }
      .where.home {
        color: var(--sn-accent);
      }
      .since {
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .batt {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.06);
      }
      .batt .bar {
        position: relative;
        flex: 1;
        height: 8px;
        border-radius: 99px;
        background: rgba(255, 255, 255, 0.1);
        overflow: hidden;
      }
      .batt .bar span {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        background: var(--sn-accent);
        border-radius: 99px;
      }
      .batt.low .bar span {
        background: #e48a6b;
      }
      .today {
        flex: 1;
        padding: 14px 16px;
        border-radius: 20px;
        background: rgba(0, 0, 0, 0.14);
        border: 1px solid var(--sn-glass-border);
        overflow: auto;
        max-height: 300px;
      }
      h4 {
        margin: 0 0 10px;
        font-weight: 500;
        font-size: 14px;
        color: var(--sn-text-dim);
      }
      ol {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
      }
      li {
        position: relative;
        display: flex;
        gap: 14px;
        padding: 8px 0;
        padding-inline-start: 22px;
        font-size: 14px;
      }
      li::before {
        content: "";
        position: absolute;
        inset-inline-start: 4px;
        top: 14px;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--sn-text-faint);
      }
      li::after {
        content: "";
        position: absolute;
        inset-inline-start: 8px;
        top: 26px;
        bottom: -10px;
        width: 1px;
        background: var(--sn-glass-border);
      }
      li:last-child::after {
        display: none;
      }
      li.home::before {
        background: var(--sn-accent);
      }
      .time {
        min-width: 48px;
        color: var(--sn-text-dim);
        font-variant-numeric: tabular-nums;
      }
      .place {
        text-transform: capitalize;
      }
    `,
  ];
}
