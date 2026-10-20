import { html, svg } from "lit";
import {
  mdiAirConditioner,
  mdiBlindsHorizontal,
  mdiCeilingLight,
  mdiFan,
  mdiHomeOutline,
  mdiLightbulbOutline,
  mdiLockOutline,
  mdiPowerPlugOutline,
  mdiRobotVacuum,
  mdiFlash,
  mdiSolarPower,
  mdiSpeaker,
  mdiThermometer,
  mdiTelevision,
  mdiToggleSwitchOutline,
  mdiWaterPercent,
} from "@mdi/js";
import type { HassEntity } from "../types";
import { domainOf } from "../ha";

export const icon = (path: string, size = 20) =>
  html`<svg class="icon" width=${size} height=${size} viewBox="0 0 24 24" aria-hidden="true" style="display:block;flex:none">
    ${svg`<path fill="currentColor" d=${path}></path>`}
  </svg>`;

/** An icon that fits a device when it has no picture of its own. */
export function entityIcon(id: string, s?: HassEntity): string {
  const d = domainOf(id);
  const dc = s?.attributes.device_class;
  if (d === "light") return id.includes("ceiling") ? mdiCeilingLight : mdiLightbulbOutline;
  if (d === "media_player") return dc === "tv" || /tv|oled/i.test(id) ? mdiTelevision : mdiSpeaker;
  if (d === "vacuum") return mdiRobotVacuum;
  if (d === "fan") return mdiFan;
  if (d === "climate") return mdiAirConditioner;
  if (d === "lock") return mdiLockOutline;
  if (d === "cover") return mdiBlindsHorizontal;
  if (d === "humidifier") return mdiWaterPercent;
  if (d === "sensor" && dc === "power") return /solar|pv/i.test(id) ? mdiSolarPower : mdiFlash;
  if (d === "sensor" && dc === "temperature") return mdiThermometer;
  if (d === "switch") return dc === "outlet" ? mdiPowerPlugOutline : mdiToggleSwitchOutline;
  return mdiHomeOutline;
}
