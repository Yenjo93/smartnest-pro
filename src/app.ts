import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  mdiCheck,
  mdiClose,
  mdiCog,
  mdiDoorOpen,
  mdiHomeOutline,
  mdiLeaf,
  mdiMagnify,
  mdiMenu,
  mdiPencilOutline,
  mdiViewGridOutline,
  mdiThermostat,
  mdiLightbulbGroupOutline,
  mdiRobotVacuum,
  mdiAccountGroupOutline,
  mdiLightningBolt,
  mdiShieldHomeOutline,
  mdiPlayCircleOutline,
  mdiDotsHorizontal,
} from "@mdi/js";
import type { Ctx, SheetSpec } from "./ctx";
import type { Hass, PanelInfo, ProConfig } from "./types";
import { clone, normalize } from "./config";
import { resolveLang, translator } from "./i18n";
import { areas, nameOf, powerKw, roomInfo } from "./ha";
import { installFonts, shared, tokens } from "./styles";
import { generalSettings } from "./settings";
import { icon } from "./ui/icon";
import { entitySheet } from "./popups/entity-popup";
import "./ui/sheet";
import "./ui/level";
import "./cards/house-hero";
import "./cards/energy-card";
import "./cards/climate-card";
import "./cards/devices-card";
import "./cards/room-panel";
import "./cards/scenes-card";
import "./pages/rooms-page";
import "./pages/climate-page";
import "./pages/lights-page";
import "./pages/robot-page";
import "./pages/family-page";
import "./pages/energy-page";
import "./pages/security-page";
import "./pages/media-page";

installFonts();

type Page = "home" | "rooms" | "climate" | "lights" | "robot" | "family" | "energy" | "security" | "media";
/** Phone tab bar: these first, the rest under "More". */
const PHONE_TABS: Page[] = ["home", "rooms", "climate", "lights"];
const PHONE_MAX = 760;

@customElement("smartnest-pro-panel")
export class SmartNestProPanel extends LitElement {
  @property({ attribute: false }) hass?: Hass;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) panel?: PanelInfo;

  @state() private config?: ProConfig;
  @state() private draft?: ProConfig;
  @state() private page: Page = "home";
  @state() private room?: string;
  @state() private sheet?: SheetSpec;
  @state() private toastMsg?: string;
  @state() private width = 1200;
  @state() private query = "";
  @state() private loadError?: string;

  private unsub?: () => void;
  private resize = new ResizeObserver(([e]) => (this.width = e.contentRect.width));
  private toastTimer?: number;

  connectedCallback() {
    super.connectedCallback();
    this.resize.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.resize.disconnect();
    this.unsub?.();
    this.unsub = undefined;
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has("hass") && this.hass && !this.config && !this.loadError) this.load();
  }

  private async load() {
    const hass = this.hass!;
    this.loadError = "";
    try {
      const res = await hass.callWS<{ config: unknown }>({ type: "smartnest_pro/config/get" });
      this.config = normalize(res.config);
      this.unsub = await hass.connection.subscribeMessage<{ config: unknown }>(
        (msg) => {
          if (!this.draft) this.config = normalize(msg.config);
        },
        { type: "smartnest_pro/config/subscribe" },
      );
    } catch (err: any) {
      this.loadError = err?.message ?? "SmartNest failed to load";
    }
  }

  private get phone() {
    return this.width < PHONE_MAX;
  }

  private get live(): ProConfig | undefined {
    return this.draft ?? this.config;
  }

  private defaultRoom(cfg: ProConfig): string | undefined {
    const hass = this.hass!;
    if (cfg.settings.default_room && hass.areas?.[cfg.settings.default_room]) return cfg.settings.default_room;
    const list = areas(hass);
    return list.find((a) => roomInfo(hass, a.area_id, cfg.rooms[a.area_id]).occupied)?.area_id ?? list[0]?.area_id;
  }

  private ctx(): Ctx {
    const config = this.live!;
    const lang = resolveLang(config.settings.language, this.hass!.language ?? "en");
    const room = this.room && this.hass!.areas?.[this.room] ? this.room : this.defaultRoom(config);
    const ctx: Ctx = {
      hass: this.hass!,
      config,
      t: translator(lang),
      lang,
      rtl: lang === "ar",
      dark: config.settings.theme === "dark" || (config.settings.theme === "auto" && !!this.hass!.themes?.darkMode),
      phone: this.phone,
      isAdmin: !!this.hass!.user?.is_admin,
      editing: !!this.draft,
      assetBase: this.panel?.config?.asset_base ?? "/smartnest_pro_static/static/",
      room,
      selectRoom: (id) => {
        this.room = id;
        if (this.phone) this.openRoomSheet(id);
      },
      update: (fn) => {
        const next = clone(this.draft ?? this.config!);
        fn(next);
        this.draft = next;
      },
      showSheet: (spec) => (this.sheet = spec),
      closeSheet: () => (this.sheet = undefined),
      openEntity: (id) => (this.sheet = { ...entitySheet(ctx, id), back: this.sheet }),
      openLevel: (id) =>
        (this.sheet = {
          title: nameOf(this.hass!, id),
          render: (c) => html`<sn-level .ctx=${c} .entity=${id}></sn-level>`,
          back: this.sheet,
        }),
      toast: (m) => this.toast(m),
    };
    return ctx;
  }

  private openRoomSheet(id: string) {
    this.sheet = {
      title: this.hass!.areas?.[id]?.name ?? id,
      half: true,
      render: (c) => html`<sn-room-panel bare .ctx=${c} .area=${id}></sn-room-panel>`,
    };
  }

  private toast(message: string) {
    this.toastMsg = message;
    clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => (this.toastMsg = undefined), 2600);
  }

  private startEdit() {
    this.draft = clone(this.config!);
  }

  private cancelEdit() {
    this.draft = undefined;
    this.sheet = undefined;
  }

  private async save(t: Ctx["t"]) {
    if (!this.draft) return;
    try {
      await this.hass!.callWS({ type: "smartnest_pro/config/save", config: this.draft });
      this.config = this.draft;
      this.draft = undefined;
      this.sheet = undefined;
      this.toast(t("saved"));
    } catch {
      this.toast(t("save_failed"));
    }
  }

  private greeting(c: Ctx) {
    const h = new Date().getHours();
    const hello = h < 12 ? c.t("good_morning") : h < 18 ? c.t("good_afternoon") : c.t("good_evening");
    const name = this.hass!.user?.name?.split(" ")[0] ?? c.config.settings.home_name;
    return html`<div class="greet"><span>${hello}</span><strong>${name}</strong></div>`;
  }

  private ecoChip(c: Ctx) {
    const id = c.config.home.solar_power;
    if (!id) return nothing;
    const kw = powerKw(this.hass!.states[id]);
    if (kw === undefined) return nothing;
    return html`<span class="eco ${kw > 0.05 ? "lit" : ""}"
      ><span class="leaf">${icon(mdiLeaf, 16)}</span>${c.t("eco_solar", { kw: kw.toFixed(1) })}</span
    >`;
  }

  private search(c: Ctx) {
    const q = this.query.trim().toLowerCase();
    const results = q
      ? [
          ...areas(c.hass)
            .filter((a) => a.name.toLowerCase().includes(q))
            .map((a) => ({ key: a.area_id, label: a.name, icon: mdiDoorOpen, go: () => (c.selectRoom(a.area_id), (this.page = this.phone ? this.page : "rooms")) })),
          ...Object.keys(c.hass.states)
            .filter((id) => nameOf(c.hass, id).toLowerCase().includes(q))
            .slice(0, 8)
            .map((id) => ({ key: id, label: nameOf(c.hass, id), icon: mdiMagnify, go: () => c.openEntity(id) })),
        ].slice(0, 10)
      : [];
    return html`<div class="search">
      ${icon(mdiMagnify, 18)}
      <input
        .value=${this.query}
        placeholder=${c.t("search")}
        @input=${(e: Event) => (this.query = (e.target as HTMLInputElement).value)}
        @keydown=${(e: KeyboardEvent) => e.key === "Escape" && (this.query = "")}
      />
      ${results.length
        ? html`<div class="results glass">
            ${results.map(
              (r) => html`<button
                @click=${() => {
                  this.query = "";
                  r.go();
                }}
              >
                ${icon(r.icon, 16)}${r.label}
              </button>`,
            )}
          </div>`
        : nothing}
    </div>`;
  }

  private editControls(c: Ctx) {
    if (!c.isAdmin || this.phone) return nothing;
    if (!c.editing)
      return html`<button class="pill" @click=${this.startEdit}>${icon(mdiPencilOutline, 18)}${c.t("edit")}</button>`;
    return html`<div class="edit-bar">
      <button class="pill" @click=${() => generalSettings(c)}>${icon(mdiCog, 18)}${c.t("settings")}</button>
      <button class="pill" @click=${this.cancelEdit}>${icon(mdiClose, 18)}${c.t("cancel")}</button>
      <button class="pill primary" @click=${() => this.save(c.t)}>${icon(mdiCheck, 18)}${c.t("save")}</button>
    </div>`;
  }

  /** Pages with nothing to show (no vacuum, no people…) stay out of the menu. */
  private navItems(c: Ctx): { page: Page; icon: string; label: string }[] {
    const has = (...domains: string[]) => Object.keys(c.hass.states).some((id) => domains.includes(id.split(".")[0]));
    const items: { page: Page; icon: string; label: string; show: boolean }[] = [
      { page: "home", icon: mdiHomeOutline, label: c.t("home"), show: true },
      { page: "rooms", icon: mdiViewGridOutline, label: c.t("rooms"), show: true },
      { page: "climate", icon: mdiThermostat, label: c.t("climate"), show: has("climate", "fan") },
      { page: "lights", icon: mdiLightbulbGroupOutline, label: c.t("lights"), show: has("light") },
      { page: "robot", icon: mdiRobotVacuum, label: c.t("robot"), show: has("vacuum", "lawn_mower") },
      { page: "family", icon: mdiAccountGroupOutline, label: c.t("family"), show: has("person") },
      { page: "energy", icon: mdiLightningBolt, label: c.t("energy"), show: true },
      { page: "security", icon: mdiShieldHomeOutline, label: c.t("security"), show: has("lock", "alarm_control_panel", "camera", "binary_sensor") },
      { page: "media", icon: mdiPlayCircleOutline, label: c.t("media"), show: has("media_player") },
    ];
    return items.filter((i) => i.show);
  }

  private go(page: Page) {
    this.page = page;
    this.sheet = undefined;
    this.renderRoot.querySelector("main")?.scrollTo({ top: 0 });
  }

  private renderPage(c: Ctx) {
    switch (this.page) {
      case "rooms":
        return html`<sn-rooms-page .ctx=${c}></sn-rooms-page>`;
      case "climate":
        return html`<sn-climate-page .ctx=${c}></sn-climate-page>`;
      case "lights":
        return html`<sn-lights-page .ctx=${c}></sn-lights-page>`;
      case "robot":
        return html`<sn-robot-page .ctx=${c}></sn-robot-page>`;
      case "family":
        return html`<sn-family-page .ctx=${c}></sn-family-page>`;
      case "energy":
        return html`<sn-energy-page .ctx=${c}></sn-energy-page>`;
      case "security":
        return html`<sn-security-page .ctx=${c}></sn-security-page>`;
      case "media":
        return html`<sn-media-page .ctx=${c}></sn-media-page>`;
      default:
        return this.phone ? this.homePhone(c) : this.homeWide(c);
    }
  }

  private tabbar(c: Ctx) {
    const items = this.navItems(c);
    const tabs = items.filter((n) => PHONE_TABS.includes(n.page));
    const rest = items.filter((n) => !PHONE_TABS.includes(n.page));
    const inMore = rest.some((n) => n.page === this.page);
    return html`<nav class="tabbar glass">
      ${tabs.map(
        (n) => html`<button class=${this.page === n.page ? "on" : ""} @click=${() => this.go(n.page)}>${icon(n.icon, 22)}<span>${n.label}</span></button>`,
      )}
      ${rest.length
        ? html`<button
            class=${inMore ? "on" : ""}
            @click=${() =>
              (this.sheet = {
                title: c.t("more"),
                render: () => html`<div class="more-grid">
                  ${rest.map(
                    (n) => html`<button class=${this.page === n.page ? "on" : ""} @click=${() => this.go(n.page)}>
                      <span>${icon(n.icon, 26)}</span>${n.label}
                    </button>`,
                  )}
                </div>`,
              })}
          >
            ${icon(inMore ? rest.find((n) => n.page === this.page)!.icon : mdiDotsHorizontal, 22)}<span>${inMore ? rest.find((n) => n.page === this.page)!.label : c.t("more")}</span>
          </button>`
        : nothing}
    </nav>`;
  }

  private homeWide(c: Ctx) {
    return html`<div class="home">
      <div class="col-left">
        ${this.greeting(c)}
        <sn-energy-card .ctx=${c}></sn-energy-card>
      </div>
      <sn-house-hero class="hero" .ctx=${c}></sn-house-hero>
      <div class="col-side">
        <sn-room-panel .ctx=${c} .area=${c.room}></sn-room-panel>
        <sn-scenes-card .ctx=${c}></sn-scenes-card>
      </div>
      <sn-climate-card class="climate" .ctx=${c}></sn-climate-card>
      <sn-devices-card class="devices" .ctx=${c}></sn-devices-card>
    </div>`;
  }

  private homePhone(c: Ctx) {
    const hiddenRooms = c.config.pages.rooms?.hidden ?? [];
    const list = areas(c.hass).filter((a) => !hiddenRooms.includes(a.area_id));
    return html`<div class="home-phone">
      <sn-house-hero class="hero" .ctx=${c}></sn-house-hero>
      ${list.length
        ? html`<div class="room-chips">
            ${list.map((a) => {
              const r = roomInfo(c.hass, a.area_id, c.config.rooms[a.area_id]);
              return html`<button class="room-chip ${r.occupied ? "occ" : ""}" @click=${() => c.selectRoom(a.area_id)}>
                <b>${a.name}</b>
                <span>${[r.temperature !== undefined ? `${r.temperature.toFixed(1)}°` : "", r.people ? `${r.people} 👤` : ""].filter(Boolean).join(" · ") || "—"}</span>
              </button>`;
            })}
          </div>`
        : nothing}
      <sn-energy-card .ctx=${c}></sn-energy-card>
      <sn-climate-card .ctx=${c}></sn-climate-card>
      <sn-devices-card .ctx=${c}></sn-devices-card>
      <sn-scenes-card .ctx=${c}></sn-scenes-card>
    </div>`;
  }

  render() {
    if (this.loadError) return html`<div class="center">${this.loadError}<button class="pill" @click=${() => this.load()}>↻</button></div>`;
    if (!this.hass || !this.live) return html`<div class="center"><div class="spinner"></div></div>`;
    const c = this.ctx();
    const s = c.config.settings;
    const dark = s.theme === "dark" || (s.theme === "auto" && !!this.hass.themes?.darkMode);
    this.toggleAttribute("dark", dark);
    this.toggleAttribute("lowfx", s.reduce_effects);
    this.toggleAttribute("phone", this.phone);
    this.dir = c.rtl ? "rtl" : "ltr";
    this.lang = c.lang;

    if (!this.navItems(c).some((n) => n.page === this.page)) this.page = "home";
    const page = this.renderPage(c);

    return html`
      <div class="bg"></div>
      ${this.phone
        ? html`<div class="shell-phone">
            <header class="top-phone">
              ${this.narrow
                ? html`<button class="round" aria-label=${c.t("open_menu")} @click=${() =>
                    this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true }))}>${icon(mdiMenu)}</button>`
                : nothing}
              ${this.greeting(c)} ${this.ecoChip(c)}
            </header>
            <main>${page}</main>
            ${this.tabbar(c)}
          </div>`
        : html`<div class="shell">
            <div class="brand">
              ${this.narrow
                ? html`<button class="round" aria-label=${c.t("open_menu")} @click=${() =>
                    this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true }))}>${icon(mdiMenu)}</button>`
                : html`<svg class="logo" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3 2 11.5h3V21h5.5v-6h3v6H19v-9.5h3z"></path></svg>`}
              <span>SmartNest</span>
            </div>
            <header class="top">
              ${this.search(c)} ${this.ecoChip(c)}
              <span class="spacer"></span>
              ${this.editControls(c)}
            </header>
            <nav class="rail glass">
              ${this.navItems(c).map(
                (n) => html`<button class=${this.page === n.page ? "on" : ""} aria-label=${n.label} title=${n.label} @click=${() => this.go(n.page)}>
                  ${icon(n.icon, 20)}
                </button>`,
              )}
            </nav>
            <main>${page}</main>
          </div>`}
      <sn-sheet .spec=${this.sheet} .ctx=${c} ?phone=${this.phone} @close=${() => (this.sheet = this.sheet?.back)}></sn-sheet>
      ${this.toastMsg ? html`<div class="toast glass">${this.toastMsg}</div>` : nothing}
    `;
  }

  static styles = [
    tokens,
    shared,
    css`
      :host {
        display: block;
        position: relative;
        min-height: 100vh;
        height: 100vh;
        overflow: hidden;
        color: var(--sn-text-on-bg);
      }
      .bg {
        position: absolute;
        inset: 0;
        background: var(--sn-bg);
        z-index: 0;
      }
      .center {
        position: relative;
        display: grid;
        place-items: center;
        gap: 12px;
        height: 100%;
        background: var(--sn-bg);
      }
      .spinner {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, 0.25);
        border-top-color: #fff;
        animation: spin 0.9s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* ---------- wide: rail + top bar + page ---------- */
      .shell {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 72px 1fr;
        grid-template-rows: 72px 1fr;
        gap: 12px 24px;
        height: 100%;
        padding: 18px 24px 24px 20px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 22px;
        font-weight: 500;
        white-space: nowrap;
        color: var(--sn-text-on-bg);
      }
      .logo {
        width: 34px;
        height: 34px;
        color: var(--sn-accent-strong);
        filter: drop-shadow(0 0 10px var(--sn-accent-glow));
      }
      .top {
        display: flex;
        align-items: center;
        gap: 14px;
        min-width: 0;
        padding-inline-start: 110px;
      }
      .spacer {
        flex: 1;
      }
      .search {
        position: relative;
        display: flex;
        align-items: center;
        gap: 10px;
        width: min(380px, 40%);
        height: 48px;
        padding: 0 18px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.16);
        border: 1px solid rgba(255, 255, 255, 0.25);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        color: var(--sn-text-on-bg-dim);
      }
      .search input {
        flex: 1;
        min-width: 0;
        border: 0;
        outline: 0;
        background: none;
        color: var(--sn-text-on-bg);
        font: inherit;
        font-size: 14px;
      }
      .search input::placeholder {
        color: var(--sn-text-on-bg-dim);
      }
      .results {
        position: absolute;
        top: 56px;
        inset-inline: 0;
        z-index: 20;
        display: grid;
        padding: 6px;
        background: var(--sn-glass-strong);
        border-radius: 20px;
      }
      .results button {
        all: unset;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 14px;
        cursor: pointer;
        font-size: 14px;
      }
      .results button:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .eco {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        height: 48px;
        padding: 0 18px 0 6px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.16);
        border: 1px solid rgba(255, 255, 255, 0.25);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        font-size: 14px;
        white-space: nowrap;
        color: var(--sn-text-on-bg);
      }
      .leaf {
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.18);
        border: 1px solid rgba(255, 255, 255, 0.35);
      }
      .eco.lit .leaf {
        background: rgba(181, 220, 143, 0.35);
        box-shadow: 0 0 14px var(--sn-accent-glow);
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 44px;
        padding: 0 18px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.25);
        background: rgba(255, 255, 255, 0.16);
        color: var(--sn-text-on-bg);
        font-size: 14px;
        cursor: pointer;
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
      }
      .pill.primary {
        background: var(--sn-accent);
        color: #1d2a12;
        border-color: transparent;
      }
      .edit-bar {
        display: flex;
        gap: 8px;
      }
      .rail {
        align-self: start;
        max-height: 100%;
        overflow-y: auto;
        scrollbar-width: none;
        display: grid;
        gap: 10px;
        justify-items: center;
        width: 64px;
        padding: 8px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.14);
        border-color: rgba(255, 255, 255, 0.25);
      }
      .rail button {
        display: grid;
        place-items: center;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 1px solid transparent;
        background: none;
        color: var(--sn-text-on-bg);
        cursor: pointer;
      }
      .rail button.on {
        background: #fff;
        color: #1d1b19;
        box-shadow: 0 6px 16px -6px rgba(0, 0, 0, 0.35);
      }
      main {
        position: relative;
        min-height: 0;
        min-width: 0;
      }
      .shell main {
        overflow: auto;
      }

      /* ---------- Home, wide ---------- */
      .shell main {
        container-type: inline-size;
      }
      .home {
        display: grid;
        grid-template-columns: minmax(300px, 340px) minmax(0, 1fr) minmax(330px, 380px);
        grid-template-rows: minmax(0, 1fr) auto;
        grid-template-areas:
          "left hero side"
          "climate devices side";
        gap: 20px;
        height: 100%;
        min-height: 640px;
      }
      .col-left {
        grid-area: left;
        display: flex;
        flex-direction: column;
        gap: 22px;
        min-height: 0;
        z-index: 1;
      }
      .greet {
        display: grid;
        gap: 4px;
        color: var(--sn-text-on-bg);
      }
      .greet span {
        font-size: 26px;
        font-weight: 300;
        color: var(--sn-text-on-bg-dim);
      }
      .greet strong {
        font-size: 44px;
        font-weight: 400;
        letter-spacing: -0.02em;
        line-height: 1.05;
      }
      .hero {
        grid-area: hero;
        min-height: 0;
        margin-inline: -70px -20px;
      }
      .col-side {
        grid-area: side;
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-height: 0;
      }
      .col-side sn-room-panel {
        flex: 1;
        min-height: 0;
        overflow: auto;
        border-radius: var(--sn-radius);
      }
      .climate {
        grid-area: climate;
      }
      .devices {
        grid-area: devices;
      }
      @container (max-width: 1080px) {
        .home {
          grid-template-columns: minmax(290px, 310px) minmax(0, 1fr) minmax(300px, 330px);
          gap: 16px;
        }
      }
      /* Portrait tablets, or a landscape tablet with HA's sidebar open: two columns, the page scrolls. */
      @container (max-width: 940px) {
        .home {
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          grid-template-rows: auto;
          grid-template-areas:
            "left hero"
            "climate side"
            "devices devices";
          height: auto;
          min-height: 0;
        }
        .hero {
          min-height: 380px;
          margin-inline: -20px 0;
        }
        .col-side sn-room-panel {
          flex: none;
          overflow: visible;
        }
        .climate {
          align-self: start;
        }
      }
      @media (max-width: 1180px) {
        .top {
          padding-inline-start: 60px;
        }
      }

      /* ---------- phone ---------- */
      .shell-phone {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .top-phone {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: calc(14px + env(safe-area-inset-top)) 16px 6px;
      }
      .top-phone .greet {
        flex: 1;
      }
      .top-phone .greet span {
        font-size: 15px;
      }
      .top-phone .greet strong {
        font-size: 28px;
      }
      .top-phone .eco {
        height: 40px;
        font-size: 12px;
        padding-inline-end: 12px;
      }
      .top-phone .leaf {
        width: 30px;
        height: 30px;
      }
      .top-phone .round {
        color: var(--sn-text-on-bg);
      }
      .shell-phone main {
        flex: 1;
        overflow: auto;
        padding: 0 16px calc(96px + env(safe-area-inset-bottom));
        -webkit-overflow-scrolling: touch;
      }
      .home-phone {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .home-phone .hero {
        height: 40vh;
        min-height: 240px;
        margin: 0 -16px;
      }
      .room-chips {
        display: flex;
        gap: 10px;
        overflow-x: auto;
        margin: 0 -16px;
        padding: 0 16px 2px;
        scrollbar-width: none;
      }
      .room-chips::-webkit-scrollbar {
        display: none;
      }
      .room-chip {
        flex: none;
        display: grid;
        gap: 2px;
        min-width: 116px;
        padding: 10px 16px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.25);
        background: rgba(255, 255, 255, 0.16);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
        color: var(--sn-text-on-bg);
        text-align: start;
        cursor: pointer;
      }
      .room-chip b {
        font-weight: 500;
        font-size: 14px;
      }
      .room-chip span {
        font-size: 12px;
        color: var(--sn-text-on-bg-dim);
      }
      .room-chip.occ {
        border-color: rgba(181, 220, 143, 0.7);
      }
      .tabbar {
        position: absolute;
        left: 16px;
        right: 16px;
        bottom: calc(12px + env(safe-area-inset-bottom));
        z-index: 10;
        display: flex;
        justify-content: space-around;
        padding: 8px;
        border-radius: 999px;
        background: var(--sn-glass-strong);
      }
      .tabbar button {
        display: grid;
        justify-items: center;
        gap: 2px;
        flex: 1;
        padding: 6px 0;
        border: 0;
        border-radius: 999px;
        background: none;
        color: var(--sn-text-dim);
        font-size: 11px;
        cursor: pointer;
      }
      .tabbar button.on {
        color: var(--sn-text);
        background: rgba(255, 255, 255, 0.12);
      }
      .tabbar button.on .icon {
        color: var(--sn-accent);
      }

      .toast {
        position: fixed;
        left: 50%;
        bottom: 28px;
        transform: translateX(-50%);
        z-index: 60;
        padding: 12px 22px;
        border-radius: 999px;
        background: var(--sn-glass-strong);
        font-size: 14px;
        animation: toast 0.25s ease;
      }
      :host([phone]) .toast {
        bottom: calc(96px + env(safe-area-inset-bottom));
      }
      @keyframes toast {
        from {
          opacity: 0;
          transform: translate(-50%, 10px);
        }
      }
    `,
  ];
}
