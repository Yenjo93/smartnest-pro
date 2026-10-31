// Small form fields for the settings sheets. Native <select>s: long entity lists stay fast and touch-friendly.
import { css, html, nothing } from "lit";
import { mdiClose } from "@mdi/js";
import type { Ctx } from "../ctx";
import { domainOf, nameOf } from "../ha";
import { icon } from "./icon";

export const fieldStyles = css`
  .field-hint { font-size: 11px; line-height: 1.7; color: var(--sn-text-dim); }
  .field {
    display: grid;
    gap: 6px;
    margin-bottom: 16px;
  }
  .field > span {
    font-size: 13px;
    color: var(--sn-text-dim);
  }
  select,
  input[type="text"],
  input[type="number"],
  input[type="password"] {
    width: 100%;
    height: 44px;
    padding: 0 12px;
    border-radius: 14px;
    border: 1px solid var(--sn-glass-border);
    background: rgba(0, 0, 0, 0.18);
    color: var(--sn-text);
    font: inherit;
    font-size: 15px;
  }
  select option {
    color: #1d1b19;
    background: #fff;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 32px;
    padding: 0 6px 0 12px;
    border-radius: 999px;
    background: var(--sn-chip);
    border: 1px solid var(--sn-glass-border);
    font-size: 13px;
  }
  .tag button {
    all: unset;
    cursor: pointer;
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
  }
  .check {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    font-size: 15px;
  }
  .check input {
    width: 20px;
    height: 20px;
    accent-color: var(--sn-accent-strong);
  }
  h4 {
    margin: 22px 0 10px;
    font-weight: 500;
    font-size: 15px;
  }
`;

/** Entities whose domain is in `domains`, sorted by name; device_class narrows sensors. */
export function entityOptions(ctx: Ctx, domains: string[], deviceClass?: string[]): string[] {
  return Object.keys(ctx.hass.states)
    .filter((id) => domains.includes(domainOf(id)))
    .filter((id) => !deviceClass || deviceClass.includes(ctx.hass.states[id].attributes.device_class))
    .sort((a, b) => nameOf(ctx.hass, a).localeCompare(nameOf(ctx.hass, b)));
}

export function entityField(
  ctx: Ctx,
  label: string,
  value: string | undefined,
  options: string[],
  onChange: (v: string | undefined) => void,
) {
  return html`<label class="field">
    <span>${label}</span>
    <select @change=${(e: Event) => onChange((e.target as HTMLSelectElement).value || undefined)}>
      <option value="" ?selected=${!value}>${ctx.t("none")}</option>
      ${value && !options.includes(value) ? html`<option value=${value} selected>${value}</option>` : nothing}
      ${options.map((id) => html`<option value=${id} ?selected=${id === value}>${nameOf(ctx.hass, id)} · ${id}</option>`)}
    </select>
  </label>`;
}

export function multiField(ctx: Ctx, label: string, values: string[], options: string[], onChange: (v: string[]) => void) {
  return html`<div class="field">
    <span>${label}</span>
    ${values.length
      ? html`<div class="tags">
          ${values.map(
            (id) => html`<span class="tag"
              >${nameOf(ctx.hass, id)}
              <button aria-label=${ctx.t("delete")} @click=${() => onChange(values.filter((v) => v !== id))}>
                ${icon(mdiClose, 16)}
              </button></span
            >`,
          )}
        </div>`
      : nothing}
    <select
      @change=${(e: Event) => {
        const sel = e.target as HTMLSelectElement;
        if (sel.value) onChange([...values, sel.value]);
        sel.value = "";
      }}
    >
      <option value="" selected>${ctx.t("choose")}</option>
      ${options.filter((id) => !values.includes(id)).map((id) => html`<option value=${id}>${nameOf(ctx.hass, id)} · ${id}</option>`)}
    </select>
  </div>`;
}

function fieldHint(label: string): string {
  const ar = /[\u0600-\u06ff]/.test(label);
  const pick = (a: string, e: string) => ar ? a : e;
  if (/تعرفة|tariff/i.test(label)) return pick('تكلفة كيلوواط ساعة واحدة حسب مزود الكهرباء.', 'Your electricity price for one kilowatt-hour.');
  if (/ميزانية|budget/i.test(label)) return pick('الحد الشهري حسب العملة والتعرفة اللي اخترتها.', 'Your monthly target in the selected currency.');
  if (/طقس|weather/i.test(label)) return pick('اختار كيان الطقس الموجود في Home Assistant.', 'Choose an existing Home Assistant weather entity.');
  if (/رطوبة|humidity/i.test(label)) return pick('حساس الرطوبة اللي بدك تعرضه لهذه الغرفة.', 'The humidity sensor to display for this room.');
  if (/حرارة|temperature/i.test(label)) return pick('اختار الحساس المناسب؛ تأكد من وحدة القياس.', 'Choose the matching sensor and check its measurement unit.');
  if (/طاقة|energy|meter/i.test(label)) return pick('للاستهلاك اختار عداد الطاقة التراكمي بوحدة kWh.', 'For consumption, use a cumulative energy meter measured in kWh.');
  if (/قدرة|power/i.test(label)) return pick('حساس القدرة اللحظية بوحدة W أو kW.', 'An instantaneous power sensor measured in W or kW.');
  if (/رمز|pin/i.test(label)) return pick('لقفل أدوات الشاشة؛ مش بديل عن تسجيل دخول Home Assistant.', 'Locks screen controls; it does not replace Home Assistant sign-in.');
  if (/غرف|غرفة|room/i.test(label)) return pick('الغرف مرتبطة بمناطق Home Assistant. راجع الأجهزة بعد تغيير الربط.', 'Rooms correspond to Home Assistant areas. Review devices after changing links.');
  if (/لغة|language/i.test(label)) return pick('تلقائي يستعمل لغة حسابك في Home Assistant.', 'Automatic follows your Home Assistant language.');
  if (/مظهر|theme/i.test(label)) return pick('تلقائي يتبع الوضع الفاتح أو الداكن لجهازك.', 'Automatic follows the light or dark appearance of your device.');
  return pick('بتقدر ترجع تغيّر هالاختيار من الإعدادات بأي وقت.', 'You can change this choice again in Settings.');
}

export function selectField(label: string, value: string, options: [string, string][], onChange: (v: string) => void) {
  return html`<label class="field">
    <span>${label}</span>
    <small class="field-hint">${fieldHint(label)}</small>
    <select @change=${(e: Event) => onChange((e.target as HTMLSelectElement).value)}>
      ${options.map(([v, l]) => html`<option value=${v} ?selected=${v === value}>${l}</option>`)}
    </select>
  </label>`;
}

export function textField(label: string, value: string, onChange: (v: string) => void, type: "text" | "number" = "text") {
  return html`<label class="field">
    <span>${label}</span>
    <small class="field-hint">${fieldHint(label)}</small>
    <input type=${type} .value=${value} @change=${(e: Event) => onChange((e.target as HTMLInputElement).value)} />
  </label>`;
}
