import type { TemplateResult } from "lit";
import type { Hass, Lang, ProConfig } from "./types";
import type { Translate } from "./i18n";

export interface SheetSpec {
  title: string;
  render: (ctx: Ctx) => TemplateResult;
  /** Phone room sheet: starts at half height and can be dragged to full. */
  half?: boolean;
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
  phone: boolean;
  isAdmin: boolean;
  editing: boolean;
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
  toast(message: string): void;
}
