// The sheets edit mode opens. Each reads the live draft from the ctx it is rendered with and writes through ctx.update.
import { html } from "lit";
import type { Ctx } from "./ctx";
import type { Pin } from "./types";
import { areas, nameOf, NODE_DOMAINS, entitiesIn } from "./ha";
import { entityField, entityOptions, multiField, selectField, textField } from "./ui/fields";

export function energySettings(ctx: Ctx) {
  ctx.showSheet({
    title: ctx.t("energy_usage"),
    render: (c) => {
      const h = c.config.home;
      const energy = entityOptions(c, ["sensor"], ["energy"]);
      return html`
        ${entityField(c, c.t("energy_meter"), h.energy, energy, (v) => c.update((d) => (d.home.energy = v)))}
        ${entityField(c, c.t("solar_power"), h.solar_power, entityOptions(c, ["sensor"], ["power"]), (v) =>
          c.update((d) => (d.home.solar_power = v)),
        )}
        ${entityField(c, c.t("solar_energy"), h.solar_energy, energy, (v) => c.update((d) => (d.home.solar_energy = v)))}
      `;
    },
  });
}

export function climateSettings(ctx: Ctx) {
  ctx.showSheet({
    title: ctx.t("climate_comfort"),
    render: (c) => html`
      ${entityField(c, c.t("climate_entity"), c.config.home.climate, entityOptions(c, ["climate"]), (v) =>
        c.update((d) => (d.home.climate = v)),
      )}
      ${entityField(c, c.t("humidity_sensor"), c.config.home.humidity, entityOptions(c, ["sensor"], ["humidity"]), (v) =>
        c.update((d) => (d.home.humidity = v)),
      )}
    `,
  });
}

export function devicesSettings(ctx: Ctx) {
  ctx.showSheet({
    title: ctx.t("smart_devices"),
    render: (c) =>
      multiField(c, c.t("favorite_devices"), c.config.home.devices, entityOptions(c, NODE_DOMAINS), (v) =>
        c.update((d) => (d.home.devices = v)),
      ),
  });
}

export function scenesSettings(ctx: Ctx) {
  ctx.showSheet({
    title: ctx.t("scenes"),
    render: (c) =>
      multiField(c, c.t("scene_buttons"), c.config.home.scenes, entityOptions(c, ["scene", "script"]), (v) =>
        c.update((d) => (d.home.scenes = v)),
      ),
  });
}

export function roomSettings(ctx: Ctx, areaId: string) {
  ctx.showSheet({
    title: `${ctx.t("room_settings")} · ${ctx.hass.areas?.[areaId]?.name ?? areaId}`,
    render: (c) => {
      const o = c.config.rooms[areaId] ?? {};
      const set = (fn: (r: NonNullable<typeof o>) => void) =>
        c.update((d) => {
          const r = (d.rooms[areaId] ??= {});
          fn(r);
        });
      const inRoom = entitiesIn(c.hass, areaId);
      // Sensors from the whole house: a room's sensor is often assigned to another area by mistake.
      return html`
        ${textField(c.t("size_m2"), o.size_m2?.toString() ?? "", (v) => set((r) => (r.size_m2 = v ? Number(v) : undefined)), "number")}
        ${entityField(c, c.t("climate_entity"), o.climate, entityOptions(c, ["climate"]), (v) => set((r) => (r.climate = v)))}
        ${entityField(c, c.t("temperature_sensor"), o.temperature, entityOptions(c, ["sensor"], ["temperature"]), (v) =>
          set((r) => (r.temperature = v)),
        )}
        ${entityField(c, c.t("humidity_sensor"), o.humidity, entityOptions(c, ["sensor"], ["humidity"]), (v) =>
          set((r) => (r.humidity = v)),
        )}
        ${entityField(c, c.t("occupancy_sensor"), o.occupancy, entityOptions(c, ["binary_sensor", "sensor"]).filter(
          (id) => !id.startsWith("sensor.") || !c.hass.states[id].attributes.device_class,
        ), (v) => set((r) => (r.occupancy = v)))}
        ${multiField(c, c.t("hidden_devices"), o.hidden ?? [], inRoom, (v) => set((r) => (r.hidden = v)))}
      `;
    },
  });
}

export function generalSettings(ctx: Ctx) {
  ctx.showSheet({
    title: ctx.t("settings"),
    render: (c) => {
      const s = c.config.settings;
      return html`
        ${textField(c.t("home_name"), s.home_name, (v) => c.update((d) => (d.settings.home_name = v)))}
        ${selectField(c.t("language"), s.language, [["auto", c.t("lang_auto")], ["en", "English"], ["ar", "العربية"]], (v) =>
          c.update((d) => (d.settings.language = v as typeof s.language)),
        )}
        ${selectField(c.t("theme"), s.theme, [["auto", c.t("theme_auto")], ["light", c.t("theme_light")], ["dark", c.t("theme_dark")]], (v) =>
          c.update((d) => (d.settings.theme = v as typeof s.theme)),
        )}
        ${selectField(c.t("default_room"), s.default_room ?? "", [["", c.t("none")], ...areas(c.hass).map((a) => [a.area_id, a.name] as [string, string])], (v) =>
          c.update((d) => (d.settings.default_room = v || undefined)),
        )}
        <label class="check">
          <input type="checkbox" .checked=${s.reduce_effects} @change=${(e: Event) =>
            c.update((d) => (d.settings.reduce_effects = (e.target as HTMLInputElement).checked))} />
          ${c.t("reduce_effects")}
        </label>
      `;
    },
  });
}

export function pinSettings(ctx: Ctx, pinId: string) {
  ctx.showSheet({
    title: ctx.t("pin"),
    render: (c) => {
      const pin = c.config.hero.pins.find((p) => p.id === pinId);
      if (!pin) return html``;
      const set = (fn: (p: Pin) => void) =>
        c.update((d) => {
          const p = d.hero.pins.find((x) => x.id === pinId);
          if (p) fn(p);
        });
      const kind = pin.entity ? "entity" : "area";
      return html`
        ${selectField(c.t("pin"), kind, [["area", c.t("pin_room")], ["entity", c.t("pin_device")]], (v) =>
          set((p) => {
            if (v === "area") p.entity = undefined;
            else {
              p.area = undefined;
              p.entity = p.entity ?? "";
            }
          }),
        )}
        ${kind === "area"
          ? selectField(c.t("pin_room"), pin.area ?? "", [["", c.t("none")], ...areas(c.hass).map((a) => [a.area_id, a.name] as [string, string])], (v) =>
              set((p) => (p.area = v || undefined)),
            )
          : entityField(c, c.t("pin_device"), pin.entity || undefined, entityOptions(c, [...NODE_DOMAINS, "climate", "sensor", "binary_sensor", "alarm_control_panel"]), (v) =>
              set((p) => (p.entity = v ?? "")),
            )}
        ${textField(c.t("label"), pin.label ?? "", (v) => set((p) => (p.label = v || undefined)))}
        <button
          class="danger"
          style="height:44px;padding:0 18px;border-radius:14px;border:0;background:#8a3b2e;color:#fff;font-size:15px;cursor:pointer"
          @click=${() => {
            c.update((d) => (d.hero.pins = d.hero.pins.filter((p) => p.id !== pinId)));
            c.closeSheet();
          }}
        >
          ${c.t("delete")}
        </button>
      `;
    },
  });
}

/** A pin's visible name: its own label, else its room or device name. */
export const pinLabel = (ctx: Ctx, pin: Pin) =>
  pin.label || (pin.area ? ctx.hass.areas?.[pin.area]?.name : pin.entity ? nameOf(ctx.hass, pin.entity) : "") || "•";
