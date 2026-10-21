import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { mdiBackspaceOutline, mdiCheck } from "@mdi/js";
import { shared } from "../styles";
import { icon } from "./icon";

/** A number pad for the kiosk PIN. Fires `ok` when the right PIN is entered; a wrong one shakes and clears. */
@customElement("sn-pin-pad")
export class SnPinPad extends LitElement {
  @property() pin = "";
  @property() wrongLabel = "";
  @state() private typed = "";
  @state() private wrong = false;

  private press(k: string) {
    this.wrong = false;
    if (k === "del") this.typed = this.typed.slice(0, -1);
    else if (k === "ok") this.check();
    else if (this.typed.length < 8) {
      this.typed += k;
      // Unlock as soon as the PIN is complete, no need to press ✓.
      if (this.typed === this.pin) this.check();
    }
  }

  private check() {
    if (this.typed === this.pin) {
      this.dispatchEvent(new CustomEvent("ok"));
      return;
    }
    this.wrong = true;
    this.typed = "";
  }

  private key = (e: KeyboardEvent) => {
    if (/^[0-9]$/.test(e.key)) this.press(e.key);
    else if (e.key === "Backspace") this.press("del");
    else if (e.key === "Enter") this.press("ok");
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this.key);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.key);
  }

  render() {
    const dots = Math.max(4, this.pin.length, this.typed.length);
    return html`
      <div class="dots ${this.wrong ? "shake" : ""}">
        ${Array.from({ length: dots }, (_, i) => html`<span class=${i < this.typed.length ? "on" : ""}></span>`)}
      </div>
      <div class="msg">${this.wrong ? this.wrongLabel : ""}</div>
      <div class="pad" dir="ltr">
        ${["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((k) => html`<button @click=${() => this.press(k)}>${k}</button>`)}
        <button class="fn" aria-label="⌫" @click=${() => this.press("del")}>${icon(mdiBackspaceOutline, 22)}</button>
        <button @click=${() => this.press("0")}>0</button>
        <button class="fn" aria-label="OK" @click=${() => this.press("ok")}>${icon(mdiCheck, 22)}</button>
      </div>
    `;
  }

  static styles = [
    shared,
    css`
      :host {
        display: grid;
        justify-items: center;
        gap: 10px;
        padding: 6px 0 4px;
      }
      .dots {
        display: flex;
        gap: 14px;
        height: 18px;
        align-items: center;
      }
      .dots span {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid var(--sn-text-dim);
        transition: background 0.15s ease, transform 0.15s ease;
      }
      .dots span.on {
        background: var(--sn-text);
        border-color: var(--sn-text);
        transform: scale(1.1);
      }
      .shake {
        animation: shake 0.4s ease;
      }
      @keyframes shake {
        20%,
        60% {
          transform: translateX(-8px);
        }
        40%,
        80% {
          transform: translateX(8px);
        }
      }
      .msg {
        min-height: 18px;
        font-size: 13px;
        color: #ff8a80;
      }
      .pad {
        display: grid;
        grid-template-columns: repeat(3, 72px);
        gap: 14px;
      }
      .pad button {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        border: 0;
        background: rgba(255, 255, 255, 0.1);
        color: var(--sn-text);
        font-size: 26px;
        font-weight: 300;
        cursor: pointer;
        display: grid;
        place-items: center;
        transition: background 0.12s ease, transform 0.12s ease;
        -webkit-tap-highlight-color: transparent;
      }
      .pad button:active {
        background: rgba(255, 255, 255, 0.28);
        transform: scale(0.94);
      }
      .pad button.fn {
        background: none;
      }
    `,
  ];
}
