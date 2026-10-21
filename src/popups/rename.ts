import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { mdiCheck, mdiClose, mdiPencilOutline, mdiRestore } from "@mdi/js";
import type { Ctx } from "../ctx";
import { shared } from "../styles";
import { nameOf } from "../ha";
import { icon } from "../ui/icon";

/** The ✏️ row at the top of a device popup: give the device its own name on the dashboard. Admins only. */
@customElement("sn-rename")
export class SnRename extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @property() entity!: string;
  @state() private editing = false;
  @state() private value = "";

  private start() {
    this.value = nameOf(this.ctx.hass, this.entity);
    this.editing = true;
    this.updateComplete.then(() => {
      const input = this.renderRoot.querySelector("input");
      input?.focus();
      input?.select();
    });
  }

  private save() {
    const v = this.value.trim();
    const original = this.ctx.hass.states[this.entity]?.attributes.friendly_name as string | undefined;
    // Typing Home Assistant's own name back is the same as resetting.
    this.ctx.rename(this.entity, v && v !== original ? v : undefined);
    this.editing = false;
  }

  render() {
    const { t, config, hass } = this.ctx;
    const custom = !!config.names?.[this.entity];
    const original = (hass.states[this.entity]?.attributes.friendly_name as string | undefined) ?? this.entity;
    if (!this.editing)
      return html`<div class="row">
        <button class="pen" @click=${() => this.start()}>${icon(mdiPencilOutline, 16)}${t("rename")}</button>
        ${custom ? html`<span class="orig">${t("ha_name", { name: original })}</span>` : nothing}
      </div>`;
    return html`<div class="row edit">
      <input
        .value=${this.value}
        maxlength="60"
        placeholder=${original}
        @input=${(e: Event) => (this.value = (e.target as HTMLInputElement).value)}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === "Enter") this.save();
          if (e.key === "Escape") this.editing = false;
        }}
      />
      <button class="ok" aria-label=${t("save")} @click=${() => this.save()}>${icon(mdiCheck, 18)}</button>
      ${custom
        ? html`<button class="soft" aria-label=${t("reset_name")} title=${t("reset_name")} @click=${() => {
            this.ctx.rename(this.entity, undefined);
            this.editing = false;
          }}>${icon(mdiRestore, 18)}</button>`
        : nothing}
      <button class="soft" aria-label=${t("cancel")} @click=${() => (this.editing = false)}>${icon(mdiClose, 18)}</button>
    </div>`;
  }

  static styles = [
    shared,
    css`
      :host {
        display: block;
        margin: -4px 0 14px;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .pen {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 32px;
        padding: 0 12px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.06);
        color: var(--sn-text-dim);
        font-size: 12px;
        cursor: pointer;
      }
      .orig {
        font-size: 12px;
        color: var(--sn-text-faint);
      }
      input {
        flex: 1;
        min-width: 160px;
        height: 42px;
        padding: 0 14px;
        border-radius: 14px;
        border: 1px solid var(--sn-accent);
        background: rgba(0, 0, 0, 0.2);
        color: var(--sn-text);
        font: inherit;
        font-size: 15px;
        outline: none;
      }
      .ok,
      .soft {
        display: grid;
        place-items: center;
        width: 42px;
        height: 42px;
        border-radius: 14px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text);
        cursor: pointer;
      }
      .ok {
        background: var(--sn-accent);
        color: #1d1b30;
        border-color: transparent;
      }
    `,
  ];
}
