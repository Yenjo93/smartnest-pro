// Which popup a device gets. Everything opens in SmartNest's own sheet; HA's dialog stays one tap away at the bottom.
import { html, nothing } from "lit";
import { mdiOpenInNew } from "@mdi/js";
import type { Ctx, SheetSpec } from "../ctx";
import { areaName, domainOf, nameOf } from "../ha";
import { entityIcon, icon } from "../ui/icon";
import { hasLevel } from "../ui/hold";
import { moreInfo } from "../cards/devices-card";
import "./views";
import "./camera-view";
import "./person-view";
import "../ui/level";
import "../cards/climate-card";
import "../cards/media-player";
import "../cards/robot-card";

const TOGGLES = ["switch", "fan", "input_boolean", "light", "cover", "humidifier", "siren", "scene", "script", "button", "automation"];

function body(c: Ctx, id: string) {
  const d = domainOf(id);
  const s = c.hass.states[id];
  if ((d === "light" || d === "cover") && hasLevel(id, s)) return html`<sn-level .ctx=${c} .entity=${id}></sn-level>`;
  switch (d) {
    case "camera":
      return html`<sn-camera-view .ctx=${c} .entity=${id}></sn-camera-view>`;
    case "person":
      return html`<sn-person-view .ctx=${c} .entity=${id}></sn-person-view>`;
    case "climate":
      return html`<sn-climate-card bare .ctx=${c} .entity=${id}></sn-climate-card>`;
    case "media_player":
      return html`<sn-media-player bare .ctx=${c} .entity=${id}></sn-media-player>`;
    case "vacuum":
    case "lawn_mower":
      return html`<sn-robot-card bare .ctx=${c} .entity=${id}></sn-robot-card>`;
    case "lock":
      return html`<sn-lock-view .ctx=${c} .entity=${id}></sn-lock-view>`;
    case "alarm_control_panel":
      return html`<sn-alarm-view .ctx=${c} .entity=${id}></sn-alarm-view>`;
    case "image":
      return html`<sn-image-view .ctx=${c} .entity=${id}></sn-image-view>`;
    case "sensor":
    case "binary_sensor":
    case "number":
    case "input_number":
      return html`<sn-sensor-view .ctx=${c} .entity=${id}></sn-sensor-view>`;
  }
  if (TOGGLES.includes(d)) return html`<sn-toggle-view .ctx=${c} .entity=${id}></sn-toggle-view>`;
  return html`<sn-sensor-view .ctx=${c} .entity=${id}></sn-sensor-view>`;
}

export function entitySheet(ctx: Ctx, id: string): SheetSpec {
  const d = domainOf(id);
  return {
    title: nameOf(ctx.hass, id),
    subtitle: areaName(ctx.hass, id),
    icon: entityIcon(id, ctx.hass.states[id]),
    wide: d === "camera" || d === "person",
    render: (c) => html`
      ${body(c, id)}
      ${c.isAdmin || d !== "person"
        ? html`<div style="display:flex;justify-content:center;margin-top:18px">
            <button
              style="display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 16px;border-radius:999px;border:1px solid var(--sn-glass-border);background:transparent;color:var(--sn-text-dim);font:inherit;font-size:13px;cursor:pointer"
              @click=${(e: Event) => {
                moreInfo(e.currentTarget as Element, id);
                c.closeSheet();
              }}
            >
              ${icon(mdiOpenInNew, 16)}${c.t("open_in_ha")}
            </button>
          </div>`
        : nothing}
    `,
  };
}
