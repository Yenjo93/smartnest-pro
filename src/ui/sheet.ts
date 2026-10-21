import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { mdiClose } from "@mdi/js";
import type { Ctx, SheetSpec } from "../ctx";
import { shared } from "../styles";
import { fieldStyles } from "./fields";
import { icon } from "./icon";

/**
 * A bottom sheet on phones, a centered dialog on bigger screens. With `half`, a phone sheet opens at half height
 * and is dragged up to full or down to close.
 */
@customElement("sn-sheet")
export class SnSheet extends LitElement {
  @property({ attribute: false }) spec?: SheetSpec;
  @property({ type: Boolean, reflect: true }) phone = false;
  @state() private full = false;
  @state() private dragY = 0;
  private startY?: number;

  /** A new object on every change, so the sheet's content redraws with live values and the latest draft. */
  @property({ attribute: false }) ctx!: Ctx;

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has("spec")) this.full = false;
  }

  private close() {
    this.dispatchEvent(new CustomEvent("close"));
  }

  private down = (e: PointerEvent) => {
    if (!this.phone) return;
    this.startY = e.clientY;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  private move = (e: PointerEvent) => {
    if (this.startY === undefined) return;
    this.dragY = e.clientY - this.startY;
  };
  private up = () => {
    if (this.startY === undefined) return;
    const dy = this.dragY;
    this.startY = undefined;
    this.dragY = 0;
    if (dy < -60) this.full = true;
    else if (dy > 80) {
      if (this.full && this.spec?.half) this.full = false;
      else this.close();
    }
  };

  render() {
    const spec = this.spec;
    if (!spec) return nothing;
    const half = this.phone && spec.half && !this.full;
    return html`
      <div class="scrim" @click=${this.close}></div>
      <section
        class="panel glass ${half ? "half" : ""} ${spec.wide ? "wide" : ""} ${spec.medium ? "medium" : ""}"
        role="dialog"
        aria-label=${spec.title}
        style=${this.dragY ? `transform: translateY(${Math.max(this.dragY, -80)}px); transition: none` : ""}
      >
        <header @pointerdown=${this.down} @pointermove=${this.move} @pointerup=${this.up} @pointercancel=${this.up}>
          ${this.phone ? html`<div class="grab"></div>` : nothing}
          ${spec.icon ? html`<span class="hicon">${icon(spec.icon, 22)}</span>` : nothing}
          <div class="titles">
            <h2>${spec.titleFor?.(this.ctx) ?? spec.title}</h2>
            ${spec.subtitle ? html`<span class="subtitle">${spec.subtitle}</span>` : nothing}
          </div>
          <button class="round" aria-label="close" @click=${this.close}>${icon(mdiClose)}</button>
        </header>
        <div class="body">${spec.render(this.ctx)}</div>
      </section>
    `;
  }

  static styles = [
    shared,
    fieldStyles,
    css`
      :host {
        position: fixed;
        inset: 0;
        z-index: 50;
        display: grid;
        place-items: center;
        pointer-events: none;
      }
      .scrim {
        position: absolute;
        inset: 0;
        background: rgba(20, 16, 12, 0.42);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        pointer-events: auto;
        animation: fade 0.2s ease;
      }
      .panel {
        position: relative;
        width: min(560px, calc(100vw - 32px));
        max-height: min(80vh, 760px);
        display: flex;
        flex-direction: column;
        pointer-events: auto;
        background: var(--sn-glass-strong);
        animation: pop 0.28s cubic-bezier(0.2, 0.9, 0.3, 1.1);
      }
      :host([phone]) {
        place-items: end stretch;
      }
      :host([phone]) .panel {
        width: 100%;
        max-height: calc(100vh - 40px - env(safe-area-inset-top));
        height: calc(100vh - 40px - env(safe-area-inset-top));
        border-radius: 28px 28px 0 0;
        padding-bottom: env(safe-area-inset-bottom);
        transition: height 0.3s cubic-bezier(0.2, 0.9, 0.3, 1), transform 0.25s ease;
        animation: rise 0.32s cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      :host([phone]) .panel:not(.half) {
        height: auto;
      }
      :host([phone]) .panel.half {
        height: 55vh;
      }
      header {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 18px 18px 8px 22px;
        touch-action: none;
      }
      .grab {
        position: absolute;
        top: 7px;
        left: 50%;
        width: 40px;
        height: 5px;
        margin-left: -20px;
        border-radius: 3px;
        background: var(--sn-text-faint);
      }
      .titles {
        flex: 1;
        min-width: 0;
        display: grid;
        gap: 2px;
      }
      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .subtitle {
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .hicon {
        display: grid;
        place-items: center;
        flex: none;
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--sn-glass-border);
        color: var(--sn-accent);
      }
      .panel.medium {
        width: min(760px, calc(100vw - 48px));
      }
      .panel.wide {
        width: min(980px, calc(100vw - 48px));
        max-height: min(90vh, 900px);
      }
      .more-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }
      .more-grid button {
        display: grid;
        justify-items: center;
        gap: 8px;
        padding: 16px 6px;
        border-radius: 20px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.07);
        color: var(--sn-text);
        font-size: 13px;
        cursor: pointer;
      }
      .more-grid button.on {
        background: rgba(181, 220, 143, 0.22);
        border-color: rgba(181, 220, 143, 0.6);
      }
      .body {
        overflow: auto;
        padding: 8px 22px 22px;
        overscroll-behavior: contain;
      }
      @keyframes fade {
        from {
          opacity: 0;
        }
      }
      @keyframes pop {
        from {
          opacity: 0;
          transform: scale(0.96) translateY(8px);
        }
      }
      @keyframes rise {
        from {
          transform: translateY(100%);
        }
      }
    `,
  ];
}
