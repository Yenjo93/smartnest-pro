// The sheets edit mode opens. Each reads the live draft from the ctx it is rendered with and writes through ctx.update.
import { html } from "lit";
import type { Ctx } from "./ctx";
import { areas, NODE_DOMAINS, entitiesIn } from "./ha";
import { entityField, entityOptions, multiField, selectField, textField } from "./ui/fields";
import { doorSheet } from "./popups/door-view";

export function energySettings(ctx: Ctx) {
  ctx.showSheet({
    title: ctx.t("energy_usage"),
    render: (c) => {
      const update = (fn: (draft: typeof c.config) => void) => c.editing ? c.update(fn) : c.saveLayout(fn);
      const h = c.config.home;
      const energy = entityOptions(c, ["sensor"], ["energy"]);
      const ar = c.lang === "ar";
      const experience = c.config.experience ?? {};
      const setExperience = (key: "tariff" | "currency" | "monthly_budget" | "power_alert_kw" | "power_entity", value: string | number | undefined) => update(draft => { Object.assign((draft.experience ??= {}), { [key]: value }); });
      const numberField = (key: "tariff" | "monthly_budget" | "power_alert_kw", title: string) => html`<label class="field"><span>${title}</span><input type="number" min="0" max="100000000" step="0.01" .value=${String(experience[key] ?? "")} @change=${(event: Event) => { const text = (event.target as HTMLInputElement).value; const value = Number(text); if (!text) setExperience(key, undefined); else if (Number.isFinite(value) && value >= 0 && value <= 100000000) setExperience(key, value); }}></label>`;
      return html`
        ${entityField(c, c.t("energy_meter"), h.energy, energy, (v) => update((d) => (d.home.energy = v)))}
        ${entityField(c, c.t("solar_power"), h.solar_power, entityOptions(c, ["sensor"], ["power"]), (v) =>
          update((d) => (d.home.solar_power = v)),
        )}
        ${entityField(c, c.t("solar_energy"), h.solar_energy, energy, (v) => update((d) => (d.home.solar_energy = v)))}
        ${entityField(c, ar ? "حساس القدرة اللحظية للبيت (W أو kW)" : "Home live power sensor (W or kW)", (experience as typeof experience & { power_entity?: string }).power_entity, entityOptions(c, ["sensor"], ["power"]), value => setExperience("power_entity", value))}
        ${numberField("tariff", ar ? "تعرفة كل kWh" : "Price per kWh")}
        ${textField(ar ? "العملة (مثل ₪ أو $)" : "Currency (for example ₪ or $)", experience.currency ?? "", value => setExperience("currency", value.trim().slice(0, 12) || undefined))}
        ${numberField("monthly_budget", ar ? "ميزانية الكهرباء الشهرية بالعملة المدخلة" : "Monthly electricity budget in your currency")}
        ${numberField("power_alert_kw", ar ? "تنبيه عند تجاوز القدرة (kW)" : "Power alert threshold (kW)")}
        <p>${ar ? "التكلفة تقديرية حسب التعرفة المدخلة، بدون الرسوم الثابتة والضرائب. التنبيه يستخدم حساس القدرة المختار فقط." : "Costs are estimates from your entered tariff, excluding fixed fees and taxes. Alerts use only your selected power sensor."}</p>
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
      const hidden = (c.config.pages.rooms?.hidden ?? []).includes(areaId);
      return html`
        ${textField(c.t("room_name"), o.name ?? "", (v) => set((r) => (r.name = v.trim() || undefined)))}
        <label class="check">
          <input type="checkbox" .checked=${hidden} @change=${(e: Event) => {
            const on = (e.target as HTMLInputElement).checked;
            c.update((d) => {
              const p = (d.pages.rooms ??= {});
              const list = (p.hidden ?? []).filter((x) => x !== areaId);
              p.hidden = on ? [...list, areaId] : list;
            });
          }} />
          ${c.t("hide_room")}
        </label>
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
        ${selectField(c.t("theme"), s.theme, [["auto", c.t("theme_auto")], ["light", c.t("theme_light")], ["dark", c.t("theme_dark")], ["purple", c.t("theme_purple")]], (v) =>
          c.update((d) => (d.settings.theme = v as typeof s.theme)),
        )}
        ${selectField(c.t("default_room"), s.default_room ?? "", [["", c.t("none")], ...areas(c.hass).map((a) => [a.area_id, a.name] as [string, string])], (v) =>
          c.update((d) => (d.settings.default_room = v || undefined)),
        )}
        ${entityField(c, c.t("weather"), c.config.home.weather, entityOptions(c, ["weather"]), (v) => c.update((d) => (d.home.weather = v)))}
        <h4>${c.t("energy_usage")}</h4>
        ${entityField(c, c.t("energy_meter"), c.config.home.energy, entityOptions(c, ["sensor"], ["energy"]), (v) => c.update((d) => (d.home.energy = v)))}
        ${entityField(c, c.t("solar_power"), c.config.home.solar_power, entityOptions(c, ["sensor"], ["power"]), (v) =>
          c.update((d) => (d.home.solar_power = v)),
        )}
        ${entityField(c, c.t("solar_energy"), c.config.home.solar_energy, entityOptions(c, ["sensor"], ["energy"]), (v) =>
          c.update((d) => (d.home.solar_energy = v)),
        )}
        <h4>${c.t("floor_plan")}</h4>
        ${multiField(c, c.t("hidden_devices"), c.config.plan.hidden, [], (v) => c.update((d) => (d.plan.hidden = v)))}
        <h4>${c.t("front_door")}</h4>
        ${entityField(c, c.t("doorbell"), c.config.door?.doorbell, entityOptions(c, ["binary_sensor", "event"]), (v) =>
          c.update((d) => (d.door = { ...d.door, doorbell: v })),
        )}
        ${entityField(c, c.t("door_camera"), c.config.door?.camera, entityOptions(c, ["camera"]), (v) => c.update((d) => (d.door = { ...d.door, camera: v })))}
        ${entityField(c, c.t("door_open"), c.config.door?.open, entityOptions(c, ["lock", "script", "button", "input_button", "switch"]), (v) =>
          c.update((d) => (d.door = { ...d.door, open: v })),
        )}
        <p style="margin:0;font-size:13px;color:var(--sn-text-dim)">${c.t("door_hint")}</p>
        <button style="justify-self:start;height:40px;padding:0 18px;border-radius:999px;border:1px solid var(--sn-glass-border);background:rgba(255,255,255,0.08);color:var(--sn-text);font:inherit;font-size:14px;cursor:pointer" @click=${() => c.showSheet({ ...doorSheet(c), back: undefined })}>${c.t("door_test")}</button>
        <h4>${c.t("kiosk_mode")}</h4>
        <label class="field">
          <span>${c.t("kiosk_pin")}</span>
          <input
            type="password"
            inputmode="numeric"
            autocomplete="off"
            maxlength="8"
            .value=${s.kiosk_pin ?? ""}
            @input=${(e: Event) => {
              const el = e.target as HTMLInputElement;
              el.value = el.value.replace(/\D/g, "");
            }}
            @change=${(e: Event) => c.update((d) => (d.settings.kiosk_pin = (e.target as HTMLInputElement).value || undefined))}
          />
        </label>
        <label class="check">
          <input type="checkbox" .checked=${c.kiosk} ?disabled=${!s.kiosk_pin && !c.kiosk} @change=${(e: Event) =>
            c.setKiosk((e.target as HTMLInputElement).checked)} />
          ${c.t("kiosk_on_device")}
        </label>
        <p style="margin:0;font-size:13px;color:var(--sn-text-dim)">${c.t(s.kiosk_pin ? "kiosk_hint" : "kiosk_need_pin")}</p>
        <h4>${c.t("display")}</h4>
        <label class="check">
          <input type="checkbox" .checked=${s.reduce_effects} @change=${(e: Event) =>
            c.update((d) => (d.settings.reduce_effects = (e.target as HTMLInputElement).checked))} />
          ${c.t("reduce_effects")}
        </label>
      `;
    },
  });
}
