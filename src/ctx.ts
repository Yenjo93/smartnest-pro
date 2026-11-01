import type { TemplateResult } from "lit";
import type { Hass, Lang, Palette, ProConfig } from "./types";
import type { Translate } from "./i18n";

export interface SheetSpec {
  title: string;
  /** A title that follows the latest layout (a device's name after renaming it). */
  titleFor?: (ctx: Ctx) => string;
  render: (ctx: Ctx) => TemplateResult;
  /** Phone room sheet: starts at half height and can be dragged to full. */
  half?: boolean;
  /** Camera and map popups: a wider dialog on tablets and desktops. */
  wide?: boolean;
  /** Colour lights: brightness and colour side by side. */
  medium?: boolean;
  /** Header icon (mdi path) and a line under the title, e.g. the room. */
  icon?: string;
  subtitle?: string;
  /** The sheet to return to when this one closes (a hold popup opened from the room sheet). */
  back?: SheetSpec;
}

/** Everything a component needs, handed down as one object. A new object is made on every change. */
export interface Ctx {
  hass: Hass;
  config: ProConfig;
  t: Translate;
  lang: Lang;
  rtl: boolean;
  dark: boolean;
  /** "dark" is also true for the purple palette; this tells them apart. */
  palette: Palette;
  phone: boolean;
  isAdmin: boolean;
  childMode?: boolean;
  /** Focus the entity on the plan without executing a device command. */
  focusEntity?(entityId: string): void;
  editing: boolean;
  /** Kiosk mode on this screen: Home Assistant's sidebar hidden, editing behind the PIN. */
  kiosk: boolean;
  setKiosk(on: boolean): void;
  assetBase: string;
  /** The room the side panel shows. */
  room?: string;
  selectRoom(areaId: string): void;
  /** Mutates the draft layout while editing. */
  update(fn: (draft: ProConfig) => void): void;
  showSheet(spec: SheetSpec): void;
  closeSheet(): void;
  /** Hold popup: set a light's brightness or a curtain's position. */
  openLevel(entityId: string): void;
  /** SmartNest's own popup for any device, person or camera. */
  openEntity(entityId: string): void;
  toast(message: string): void;
  /** Gives a device a dashboard name (undefined goes back to Home Assistant's). Saves straight away outside edit mode. */
  rename(entityId: string, name: string | undefined): void;
  /** Changes the layout and saves it straight away (or into the draft in edit mode). For small settings like these. */
  saveLayout(fn: (cfg: ProConfig) => void): void;
  restoreLayout?(config: ProConfig): Promise<void>;
  previewLayout?(config: ProConfig): void;
}
