import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { mdiBellRing, mdiClose, mdiDoorOpen } from "@mdi/js";
import type { Ctx, SheetSpec } from "../ctx";
import { domainOf } from "../ha";
import { shared } from "../styles";
import { icon } from "../ui/icon";
import { onHold, noMenu } from "../ui/hold";
import "../ui/live-video";

/** Opens the door with whatever the house uses: a lock, a script, a button or a switch. */
export function openDoor(ctx: Ctx, id: string) {
  const d = domainOf(id);
  if (d === "lock") return ctx.hass.callService("lock", "unlock", { entity_id: id });
  if (d === "button" || d === "input_button") return ctx.hass.callService(d, "press", { entity_id: id });
  return ctx.hass.callService(d === "script" ? "script" : "homeassistant", "turn_on", { entity_id: id });
}

/** The popup a doorbell press opens on kiosk screens. */
export function doorSheet(ctx: Ctx): SheetSpec {
  return {
    title: ctx.t("someone_at_door"),
    icon: mdiBellRing,
    wide: true,
    render: (c) => html`<sn-door-view .ctx=${c}></sn-door-view>`,
  };
}

/**
 * Someone rang: the door camera live, and Open behind a hold so a child's tap or a bump can't open the door.
 */
@customElement("sn-door-view")
export class SnDoorView extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @state() private opened = false;

  render() {
    const { hass, t, config } = this.ctx;
    const door = config.door ?? {};
    return html`
      <div class="stage">
        ${door.camera && hass.states[door.camera]
          ? html`<sn-live-video .hass=${hass} .entity=${door.camera}></sn-live-video>`
          : html`<div class="empty">${t("not_configured")}</div>`}
      </div>
      <div class="actions">
        ${door.open && hass.states[door.open]
          ? html`<button
              class="open ${this.opened ? "done" : ""}"
              @pointerdown=${(e: PointerEvent) =>
                onHold(e, () => {
                  openDoor(this.ctx, door.open!);
                  this.opened = true;
                })}
              @click=${() => !this.opened && this.ctx.toast(t("hold_to_open"))}
              @contextmenu=${noMenu}
            >
              ${icon(mdiDoorOpen, 22)}${this.opened ? t("door_opened") : t("hold_to_open")}
            </button>`
          : nothing}
        <button class="close" @click=${() => this.ctx.closeSheet()}>${icon(mdiClose, 20)}${t("close")}</button>
      </div>
    `;
  }

  static styles = [
    shared,
    css`
      :host {
        display: grid;
        gap: 16px;
      }
      .stage {
        aspect-ratio: 16 / 9;
        border-radius: 22px;
        overflow: hidden;
        background: #0b0b0b;
        box-shadow: 0 24px 50px -20px rgba(0, 0, 0, 0.6);
      }
      .stage sn-live-video {
        width: 100%;
        height: 100%;
      }
      .empty {
        display: grid;
        place-items: center;
        height: 100%;
        color: var(--sn-text-dim);
      }
      .actions {
        display: flex;
        gap: 12px;
        justify-content: center;
      }
      .actions button {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        height: 56px;
        padding: 0 26px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.08);
        color: var(--sn-text);
        font: inherit;
        font-size: 15px;
        cursor: pointer;
        -webkit-user-select: none;
        user-select: none;
      }
      .actions .open {
        background: var(--sn-accent);
        border-color: transparent;
        color: #1d2a12;
      }
      .actions .open.done {
        background: rgba(181, 220, 143, 0.25);
        color: var(--sn-text);
      }
    `,
  ];
}
