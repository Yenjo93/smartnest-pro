import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
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
  mdiLockOutline,
  mdiExitToApp,
} from "@mdi/js";
import type { Ctx, SheetSpec } from "./ctx";
import type { Hass, Palette, PanelInfo, ProConfig } from "./types";
import { clone, normalize } from "./config";
import { resolveLang, translator } from "./i18n";
import { areas, nameOf, powerKw, roomInfo, setNameOverrides } from "./ha";
import { installFonts, shared, tokens } from "./styles";
import { generalSettings } from "./settings";
import { textField } from "./ui/fields";
import { icon } from "./ui/icon";
import { entitySheet } from "./popups/entity-popup";
import { doorSheet } from "./popups/door-view";
import { lightCaps } from "./ui/light-color";
import { isNight, weatherEntity, weatherIcon } from "./ui/weather";

const hasColour = (attrs?: Record<string, any>) => {
  const c = lightCaps(attrs);
  return c.color || c.temp;
};
import "./ui/sheet";
import "./ui/level";
import "./ui/pin-pad";
import "./ui/screensaver";
import "./plan/floorplan";
import "./cards/energy-card";
import "./cards/climate-card";
import "./cards/devices-card";
import "./cards/room-panel";
import "./cards/scene-bar";
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
/** Kiosk mode is per screen: the wall tablet, not every phone and computer. */
const KIOSK_KEY = "sn-kiosk";
/** Home Assistant's sidebar setting from before kiosk mode, put back when it ends. */
const KIOSK_DOCK_KEY = "sn-kiosk-dock";
const SAVER_MS = 2 * 60_000;
const store = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string | null) => {
    try {
      if (v === null) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    } catch {
      /* private mode: kiosk mode lasts until the page reloads */
    }
  },
};

/** `?kiosk` in the address turns kiosk mode on for this screen (handy for a non-admin wall tablet), `?kiosk=0` off. */
function kioskFromUrl(): boolean {
  const q = new URLSearchParams(location.search);
  if (q.has("kiosk")) store.set(KIOSK_KEY, q.get("kiosk") === "0" ? null : "1");
  return store.get(KIOSK_KEY) === "1";
}

@customElement("smartnest-pro-panel")
export class SmartNestProPanel extends LitElement {
  @property({ attribute: false }) hass?: Hass;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) panel?: PanelInfo;

  @state() private config?: ProConfig;
  @state() private draft?: ProConfig;
  @state() private page: Page = "home";
  /** +1 when the new page is further down the menu, -1 when it's above: the page slides in from that side. */
  @state() private navDir = 1;
  private navOrder: Page[] = [];
  @state() private room?: string;
  @state() private sheet?: SheetSpec;
  @state() private toastMsg?: string;
  /** The room panel floating over the Home plan. */
  @state() private panelOpen = false;
  @state() private width = 1200;
  @state() private query = "";
  @state() private loadError?: string;
  @state() private kiosk = kioskFromUrl();
  /** The PIN was entered: editing is open until it's saved or cancelled. */
  @state() private unlocked = false;
  /** Kiosk screens rest on the screensaver after a while untouched. */
  @state() private saver = false;
  private idleTimer?: number;
  private idle = () => {
    clearTimeout(this.idleTimer);
    this.idleTimer = window.setTimeout(() => this.sleep(), SAVER_MS);
  };

  private unsub?: () => void;
  private resize = new ResizeObserver(([e]) => (this.width = e.contentRect.width));
  private toastTimer?: number;

  connectedCallback() {
    super.connectedCallback();
    this.resize.observe(this);
    for (const ev of ["pointerdown", "keydown", "wheel"]) window.addEventListener(ev, this.idle, { capture: true, passive: true });
    this.idle();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    for (const ev of ["pointerdown", "keydown", "wheel"]) window.removeEventListener(ev, this.idle, { capture: true });
    clearTimeout(this.idleTimer);
    this.resize.disconnect();
    this.unsub?.();
    this.unsub = undefined;
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has("hass") && this.hass && !this.config && !this.loadError) this.load();
    if (changed.has("hass")) this.checkDoorbell();
  }

  /** The last doorbell press seen ("" while not ringing); undefined until the first look, so loading doesn't ring. */
  private bellSeen?: string;
  private bellSheet?: SheetSpec;
  private bellTimer?: number;

  /** A doorbell press opens the door camera on kiosk screens (the wall tablet), and closes it again after 90 s. */
  private checkDoorbell() {
    const id = this.config?.door?.doorbell;
    const s = id ? this.hass?.states[id] : undefined;
    // An event entity's state is the time of its last event; a binary sensor is on while ringing.
    const now = !s || s.state === "unavailable" ? "" : id!.startsWith("event.") ? s.state : s.state === "on" ? s.last_changed : "";
    const prev = this.bellSeen;
    this.bellSeen = now;
    if (prev === undefined || !now || now === prev || !this.kiosk || !this.live) return;
    this.bellSheet = doorSheet(this.ctx());
    this.sheet = this.bellSheet;
    this.saver = false;
    this.idle();
    clearTimeout(this.bellTimer);
    this.bellTimer = window.setTimeout(() => {
      if (this.sheet === this.bellSheet) this.sheet = undefined;
    }, 90_000);
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has("kiosk") || (changed.has("hass") && !changed.get("hass"))) this.applySidebar();
  }

  /** Hides Home Assistant's sidebar on this screen in kiosk mode (its own "always hidden" setting), and puts the
   * old setting back after. */
  private applySidebar() {
    const dock = (this.hass as (Hass & { dockedSidebar?: string }) | undefined)?.dockedSidebar;
    if (!this.hass) return;
    const set = (d: string) => this.dispatchEvent(new CustomEvent("hass-dock-sidebar", { bubbles: true, composed: true, detail: { dock: d } }));
    if (this.kiosk) {
      if (dock === "always_hidden") return;
      if (store.get(KIOSK_DOCK_KEY) === null) store.set(KIOSK_DOCK_KEY, dock ?? "docked");
      set("always_hidden");
    } else {
      const before = store.get(KIOSK_DOCK_KEY);
      if (before === null) return;
      store.set(KIOSK_DOCK_KEY, null);
      if (before !== "always_hidden") set(before);
    }
  }

  /** Off to the screensaver: kiosk screens only, never mid-edit; open popups close (their live video stops). */
  private sleep() {
    if (!this.kiosk || this.draft || !this.live) return;
    if (this.sheet && this.sheet === this.bellSheet) return this.idle();
    this.sheet = undefined;
    this.saver = true;
  }

  private wake() {
    this.saver = false;
    this.go("home");
    this.idle();
  }

  private setKiosk(on: boolean) {
    store.set(KIOSK_KEY, on ? "1" : null);
    this.kiosk = on;
    if (on) this.unlocked = !!this.draft;
  }

  /** The PIN pad, then what the PIN opens: editing (admins) or leaving kiosk mode. */
  private unlock(c: Ctx) {
    const pin = c.config.settings.kiosk_pin ?? "";
    const menu = () =>
      this.sheet = {
        title: c.t("kiosk_mode"),
        icon: mdiLockOutline,
        render: (cc) => html`<div class="more-grid" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr))">
          ${this.hass!.user?.is_admin && !this.phone
            ? html`<button @click=${() => {
                this.unlocked = true;
                this.sheet = undefined;
                this.startEdit();
              }}><span>${icon(mdiPencilOutline, 26)}</span>${cc.t("edit")}</button>`
            : nothing}
          <button @click=${() => {
            this.sheet = undefined;
            this.setKiosk(false);
          }}><span>${icon(mdiExitToApp, 26)}</span>${cc.t("exit_kiosk")}</button>
        </div>`,
      };
    if (!pin) return menu();
    this.sheet = {
      title: c.t("enter_pin"),
      icon: mdiLockOutline,
      render: (cc) => html`<sn-pin-pad .pin=${pin} .wrongLabel=${cc.t("wrong_pin")} @ok=${menu}></sn-pin-pad>`,
    };
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
    const hidden = cfg.pages.rooms?.hidden ?? [];
    const list = areas(hass).filter((a) => !hidden.includes(a.area_id));
    return list.find((a) => roomInfo(hass, a.area_id, cfg.rooms[a.area_id]).occupied)?.area_id ?? list[0]?.area_id;
  }

  /** The hass object with room (Area) names swapped for the dashboard's own, so every page shows them. */
  private named?: { src: Hass; key: string; out: Hass };
  private withRoomNames(hass: Hass, config: ProConfig): Hass {
    const renamed = Object.entries(config.rooms).filter(([, r]) => r.name);
    if (!renamed.length || !hass.areas) return hass;
    const key = JSON.stringify(renamed.map(([id, r]) => [id, r.name]));
    if (this.named && this.named.src === hass && this.named.key === key) return this.named.out;
    const areas = { ...hass.areas };
    for (const [id, r] of renamed) if (areas[id]) areas[id] = { ...areas[id], name: r.name! };
    const out = { ...hass, areas } as Hass;
    this.named = { src: hass, key, out };
    return out;
  }

  private ctx(): Ctx {
    const config = this.live!;
    setNameOverrides(config.names);
    const lang = resolveLang(config.settings.language, this.hass!.language ?? "en");
    const room = this.room && this.hass!.areas?.[this.room] ? this.room : this.defaultRoom(config);
    const theme = config.settings.theme;
    const palette: Palette = theme === "purple" ? "purple" : theme === "dark" || (theme === "auto" && !!this.hass!.themes?.darkMode) ? "dark" : "light";
    const ctx: Ctx = {
      hass: this.withRoomNames(this.hass!, config),
      config,
      t: translator(lang),
      lang,
      rtl: lang === "ar",
      dark: palette !== "light",
      palette,
      phone: this.phone,
      // Kiosk mode: no admin buttons (rename, room settings…) until the PIN is entered.
      isAdmin: !!this.hass!.user?.is_admin && (!this.kiosk || this.unlocked),
      editing: !!this.draft,
      kiosk: this.kiosk,
      setKiosk: (on) => this.setKiosk(on),
      assetBase: this.panel?.config?.asset_base ?? "/smartnest_pro_static/static/",
      room,
      selectRoom: (id) => {
        this.room = id;
        if (this.phone) this.openRoomSheet(id);
        else this.panelOpen = true;
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
          titleFor: (c) => nameOf(c.hass, id),
          medium: hasColour(this.hass!.states[id]?.attributes),
          render: (c) => html`<sn-level .ctx=${c} .entity=${id}></sn-level>`,
          back: this.sheet,
        }),
      toast: (m) => this.toast(m),
      rename: (id, name) => this.rename(id, name),
      saveLayout: (fn) => this.saveLayout(fn),
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

  /** Dashboard names: part of the draft in edit mode, saved straight away otherwise (admins only, like all saving). */
  private rename(id: string, name: string | undefined) {
    this.saveLayout((cfg) => {
      const names = { ...(cfg.names ?? {}) };
      if (name && name.trim()) names[id] = name.trim();
      else delete names[id];
      cfg.names = names;
    });
  }

  private async saveLayout(apply: (cfg: ProConfig) => void) {
    if (this.draft) {
      const next = clone(this.draft);
      apply(next);
      this.draft = next;
      return;
    }
    const next = clone(this.config!);
    apply(next);
    const t = translator(resolveLang(next.settings.language, this.hass!.language ?? "en"));
    try {
      await this.hass!.callWS({ type: "smartnest_pro/config/save", config: next });
      this.config = next;
      this.toast(t("saved"));
    } catch {
      this.toast(t("save_failed"));
    }
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
    this.unlocked = false;
  }

  private async save(t: Ctx["t"]) {
    if (!this.draft) return;
    try {
      await this.hass!.callWS({ type: "smartnest_pro/config/save", config: this.draft });
      this.config = this.draft;
      this.draft = undefined;
      this.sheet = undefined;
      this.unlocked = false;
      this.toast(t("saved"));
    } catch {
      this.toast(t("save_failed"));
    }
  }

  private greeting(c: Ctx) {
    const h = new Date().getHours();
    const hello = h < 12 ? c.t("good_morning") : h < 18 ? c.t("good_afternoon") : c.t("good_evening");
    const name = c.config.settings.greeting_name || this.hass!.user?.name?.split(" ")[0] || c.config.settings.home_name;
    return html`<div class="greet"><span>${hello}</span>${
      c.isAdmin
        ? html`<button class="greet-name" title=${c.t("rename")} @click=${() => this.renameTop(c)}>${name}</button>`
        : html`<strong>${name}</strong>`
    }</div>`;
  }

  /** The names at the top: the greeting's name and the dashboard title. Saved straight away. */
  private renameTop(c: Ctx) {
    c.showSheet({
      title: c.t("names_on_top"),
      render: (cc) => html`
        ${textField(cc.t("greeting_name"), cc.config.settings.greeting_name ?? "", (v) => cc.saveLayout((d) => (d.settings.greeting_name = v.trim() || undefined)))}
        ${textField(cc.t("dashboard_title"), cc.config.settings.title ?? "", (v) => cc.saveLayout((d) => (d.settings.title = v.trim() || undefined)))}
        <p style="margin:0;font-size:13px;color:var(--sn-text-dim)">${cc.t("names_on_top_hint")}</p>
      `,
    });
  }

  /** Temperature and sky now; a tap opens the five-day forecast. */
  private weatherChip(c: Ctx) {
    const id = weatherEntity(c);
    const s = id ? c.hass.states[id] : undefined;
    if (!id || !s || typeof s.attributes.temperature !== "number") return nothing;
    return html`<button
      class="eco wx"
      @click=${() =>
        c.showSheet({
          title: c.t("weather"),
          icon: weatherIcon(s.state),
          render: (cc) => html`<sn-weather-view .ctx=${cc} .entity=${id}></sn-weather-view>`,
        })}
    >
      <span class="leaf">${icon(weatherIcon(s.state, isNight(c.hass)), 18)}</span>${Math.round(s.attributes.temperature)}°
    </button>`;
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

  private lockButton(c: Ctx) {
    return html`<button class="round lock" aria-label=${c.t("kiosk_mode")} title=${c.t("kiosk_mode")} @click=${() => this.unlock(c)}>${icon(mdiLockOutline, 18)}</button>`;
  }

  private editControls(c: Ctx) {
    if (this.kiosk && !c.editing) return this.lockButton(c);
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
    if (page !== this.page) this.navDir = this.navOrder.indexOf(page) >= this.navOrder.indexOf(this.page) ? 1 : -1;
    this.page = page;
    this.sheet = undefined;
    this.renderRoot.querySelector("main")?.scrollTo({ top: 0 });
  }

  /** A fresh wrapper per page, so its entrance animation plays on every page change. */
  private animated(page: unknown) {
    return keyed(this.page, html`<div class="page" style="--dir: ${this.navDir}">${page}</div>`);
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
    const count = tabs.length + (rest.length ? 1 : 0);
    const at = inMore ? tabs.length : tabs.findIndex((n) => n.page === this.page);
    return html`<nav class="tabbar glass">
      <span
        class="tab-ind"
        style="width: calc((100% - 16px) / ${count}); transform: translateX(${at * 100 * (c.rtl ? -1 : 1)}%); opacity: ${at < 0 ? 0 : 1}"
      ></span>
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

  /** Home on a tablet or desktop: the floor plan fills the page, with the scenes bar on top and the room panel
   * sliding in from the side when a room is tapped. */
  private homeWide(c: Ctx) {
    return html`<div class="home-plan">
      <sn-floorplan class="plan" .ctx=${c} @unfocus=${() => (this.panelOpen = false)}></sn-floorplan>
      <div class="plan-top">
        ${this.greeting(c)}
        <sn-scene-bar .ctx=${c}></sn-scene-bar>
      </div>
      ${this.panelOpen && c.room
        ? html`<aside class="room-float">
            <button class="round close" aria-label=${c.t("cancel")} @click=${this.closePanel}>${icon(mdiClose, 18)}</button>
            <sn-room-panel .ctx=${c} .area=${c.room}></sn-room-panel>
          </aside>`
        : nothing}
    </div>`;
  }

  private closePanel = () => {
    this.panelOpen = false;
    (this.renderRoot.querySelector("sn-floorplan") as (HTMLElement & { unfocus(): void }) | null)?.unfocus();
  };

  private homePhone(c: Ctx) {
    const hiddenRooms = c.config.pages.rooms?.hidden ?? [];
    const list = areas(c.hass).filter((a) => !hiddenRooms.includes(a.area_id));
    return html`<div class="home-phone">
      <sn-scene-bar .ctx=${c}></sn-scene-bar>
      <sn-floorplan class="plan" .ctx=${c}></sn-floorplan>
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
    </div>`;
  }

  render() {
    if (this.loadError) return html`<div class="center">${this.loadError}<button class="pill" @click=${() => this.load()}>↻</button></div>`;
    if (!this.hass || !this.live) return html`<div class="center"><div class="spinner"></div></div>`;
    const c = this.ctx();
    const s = c.config.settings;
    this.toggleAttribute("dark", c.palette !== "light");
    this.setAttribute("palette", c.palette);
    this.toggleAttribute("lowfx", s.reduce_effects);
    this.toggleAttribute("phone", this.phone);
    this.dir = c.rtl ? "rtl" : "ltr";
    this.lang = c.lang;

    this.navOrder = this.navItems(c).map((n) => n.page);
    if (!this.navOrder.includes(this.page)) this.page = "home";
    const page = this.renderPage(c);

    return html`
      <div class="bg"></div>
      ${this.phone
        ? html`<div class="shell-phone">
            <header class="top-phone">
              ${this.narrow && !this.kiosk
                ? html`<button class="round" aria-label=${c.t("open_menu")} @click=${() =>
                    this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true }))}>${icon(mdiMenu)}</button>`
                : nothing}
              ${this.greeting(c)} ${this.weatherChip(c)} ${this.ecoChip(c)}
              ${this.kiosk ? html`<span class="spacer"></span>${this.lockButton(c)}` : nothing}
            </header>
            <main>${this.animated(page)}</main>
            ${this.tabbar(c)}
          </div>`
        : html`<div class="shell">
            <div class="brand">
              ${this.narrow && !this.kiosk
                ? html`<button class="round" aria-label=${c.t("open_menu")} @click=${() =>
                    this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true }))}>${icon(mdiMenu)}</button>`
                : html`<svg class="logo" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3 2 11.5h3V21h5.5v-6h3v6H19v-9.5h3z"></path></svg>`}
              <span>${c.config.settings.title || "SmartNest"}</span>
            </div>
            <header class="top">
              ${this.search(c)} ${this.weatherChip(c)} ${this.ecoChip(c)}
              <span class="spacer"></span>
              ${this.editControls(c)}
            </header>
            <nav class="rail glass">
              <div class="rail-scroll">
                <span class="ind" style="transform: translateY(${this.navItems(c).findIndex((n) => n.page === this.page) * 58}px)"></span>
                ${this.navItems(c).map(
                  (n) => html`<button class=${this.page === n.page ? "on" : ""} aria-label=${n.label} title=${n.label} @click=${() => this.go(n.page)}>
                    ${icon(n.icon, 20)}
                  </button>`,
                )}
              </div>
            </nav>
            <main>${this.animated(page)}</main>
          </div>`}
      <sn-sheet .spec=${this.sheet} .ctx=${c} ?phone=${this.phone} @close=${() => (this.sheet = this.sheet?.back)}></sn-sheet>
      ${this.toastMsg ? html`<div class="toast glass">${this.toastMsg}</div>` : nothing}
      ${this.saver ? html`<sn-screensaver .ctx=${c} @wake=${() => this.wake()}></sn-screensaver>` : nothing}
    `;
  }

  static styles = [
    tokens,
    shared,
    css`
      :host {
        display: block;
        position: relative;
        /* dvh: the visible height on iPad and phones, so the panel never sits taller than the screen and drifts. */
        min-height: 100vh;
        height: 100vh;
        min-height: 100dvh;
        height: 100dvh;
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
      .wx {
        cursor: pointer;
        font: inherit;
        font-size: 15px;
      }
      .wx .leaf {
        color: #ffd27a;
      }
      :host(:not([dark])) .wx .leaf {
        color: #b9771a;
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
      /*
       * The glass pill never scrolls itself: a blurred, rounded box that scrolls gets a square compositing layer
       * drawn over its buttons. The scrolling happens in .rail-scroll inside it.
       */
      .rail {
        align-self: start;
        max-height: 100%;
        display: flex;
        /* 48px buttons + 8px padding each side + the 1px glass border each side. */
        width: 66px;
        padding: 8px;
        border-radius: 33px;
        background: rgba(255, 255, 255, 0.14);
        border-color: rgba(255, 255, 255, 0.25);
        overflow: hidden;
      }
      .rail-scroll {
        position: relative;
        display: grid;
        gap: 10px;
        justify-items: center;
        align-content: start;
        width: 100%;
        max-height: 100%;
        overflow-y: auto;
        overscroll-behavior: contain;
        scrollbar-width: none;
        border-radius: 24px;
      }
      .rail-scroll::-webkit-scrollbar {
        display: none;
      }
      .ind {
        position: absolute;
        top: 0;
        left: 0;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 6px 16px -6px rgba(0, 0, 0, 0.35);
        transition: transform 0.45s cubic-bezier(0.3, 1.3, 0.5, 1);
      }
      .rail button {
        position: relative;
        z-index: 1;
        transition: color 0.3s ease;
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
        color: #1d1b19;
      }
      .rail button:not(.on):hover {
        background: rgba(255, 255, 255, 0.12);
      }

      /* Page change: the new page rises in from the side of the menu it came from. */
      .page {
        animation: page-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
      }
      .shell .page {
        height: 100%;
        --from: translate3d(0, calc(var(--dir) * 22px), 0) scale(0.985);
      }
      .shell-phone .page {
        --from: translate3d(calc(var(--dir) * 32px), 0, 0);
      }
      :host([dir="rtl"]) .shell-phone .page {
        --from: translate3d(calc(var(--dir) * -32px), 0, 0);
      }
      @keyframes page-in {
        /* No filter here: a filtered ancestor would switch off the cards' glass blur for the length of the animation. */
        from {
          opacity: 0;
          transform: var(--from);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      main {
        position: relative;
        min-height: 0;
        min-width: 0;
      }
      .shell main {
        overflow: auto;
      }

      /* ---------- Home, wide: the plan is the page ---------- */
      .shell main {
        container-type: inline-size;
      }
      .home-plan {
        position: relative;
        height: 100%;
        min-height: 520px;
        border-radius: 32px;
        overflow: hidden;
        background: radial-gradient(90% 80% at 50% 45%, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0) 70%);
        border: 1px solid var(--sn-glass-border);
        box-shadow: inset 0 1px 0 var(--sn-glass-hi);
      }
      .home-plan .plan {
        position: absolute;
        inset: 0;
        border-radius: 0;
      }
      .plan-top {
        position: absolute;
        top: 18px;
        inset-inline: 22px;
        z-index: 6;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        pointer-events: none;
      }
      .plan-top > * {
        pointer-events: auto;
      }
      .plan-top sn-scene-bar {
        min-width: 0;
        max-width: 64%;
      }
      .greet {
        display: grid;
        gap: 2px;
        color: var(--sn-text-on-bg);
        text-shadow: 0 2px 18px rgba(0, 0, 0, 0.18);
      }
      .greet span {
        font-size: 18px;
        font-weight: 300;
        color: var(--sn-text-on-bg-dim);
      }
      .greet-name {
        all: unset;
        cursor: pointer;
        font-size: 34px;
        font-weight: 400;
        letter-spacing: -0.02em;
        line-height: 1.05;
        border-bottom: 1px dashed transparent;
      }
      .greet-name:hover {
        border-bottom-color: currentColor;
      }
      .top-phone .greet-name {
        font-size: 28px;
      }
      .greet strong {
        font-size: 34px;
        font-weight: 400;
        letter-spacing: -0.02em;
        line-height: 1.05;
      }
      .room-float {
        position: absolute;
        top: 92px;
        /* Leaves the plan's zoom and rotate buttons uncovered below it. */
        bottom: 66px;
        inset-inline-end: 16px;
        z-index: 7;
        width: min(380px, 42%);
        display: flex;
        animation: slide-in 0.45s cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      :host([dir="rtl"]) .room-float {
        animation-name: slide-in-rtl;
      }
      .room-float sn-room-panel {
        flex: 1;
        min-height: 0;
      }
      .room-float .close {
        position: absolute;
        top: -14px;
        inset-inline-start: -14px;
        z-index: 2;
        width: 36px;
        height: 36px;
        background: var(--sn-glass-strong);
        color: var(--sn-text);
        backdrop-filter: var(--sn-blur);
        -webkit-backdrop-filter: var(--sn-blur);
      }
      @keyframes slide-in {
        from {
          opacity: 0;
          transform: translateX(40px);
        }
      }
      @keyframes slide-in-rtl {
        from {
          opacity: 0;
          transform: translateX(-40px);
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
      .home-phone .plan {
        height: 62vh;
        min-height: 320px;
        margin: 0 -16px;
        border-radius: 0;
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
      .tab-ind {
        position: absolute;
        top: 8px;
        bottom: 8px;
        inset-inline-start: 8px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.14);
        transition: transform 0.45s cubic-bezier(0.3, 1.25, 0.5, 1), opacity 0.2s ease;
      }
      .tabbar button {
        position: relative;
        z-index: 1;
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
