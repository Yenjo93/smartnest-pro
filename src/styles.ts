import { css } from "lit";
import outfitUrl from "@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2?url";
import { hideStyles } from "./pages/hide";
import alexandriaArUrl from "@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2?url";

/**
 * Fonts must be declared in the page, not in a shadow root, or the browser ignores them.
 * Outfit for Latin; Alexandria only for Arabic code points, so mixed text keeps Outfit's digits and letters.
 */
export function installFonts(): void {
  if (document.getElementById("sn-pro-fonts")) return;
  const style = document.createElement("style");
  style.id = "sn-pro-fonts";
  style.textContent = `
    @font-face { font-family: "SN Outfit"; font-style: normal; font-display: swap; font-weight: 100 900;
      src: url(${outfitUrl}) format("woff2-variations"); }
    @font-face { font-family: "SN Alexandria"; font-style: normal; font-display: swap; font-weight: 100 900;
      src: url(${alexandriaArUrl}) format("woff2-variations");
      unicode-range: U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0898-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC; }
  `;
  document.head.appendChild(style);
}

/** Design tokens. Light is the reference look: taupe backdrop with smoky glass cards and white text. */
export const tokens = css`
  :host {
    --sn-font: "SN Outfit", "SN Alexandria", system-ui, -apple-system, "Segoe UI", sans-serif;
    --sn-accent: #b5dc8f;
    --sn-accent-strong: #9ccf6c;
    --sn-accent-glow: rgba(181, 220, 143, 0.55);
    --sn-bg: radial-gradient(120% 90% at 70% 10%, #d8d0c6 0%, #b8afa5 45%, #8e867e 100%);
    --sn-text-on-bg: #fbf8f4;
    --sn-text-on-bg-dim: rgba(251, 248, 244, 0.62);
    --sn-glass: rgba(74, 68, 62, 0.46);
    --sn-glass-strong: rgba(58, 53, 48, 0.62);
    --sn-glass-light: rgba(255, 255, 255, 0.16);
    --sn-glass-border: rgba(255, 255, 255, 0.16);
    --sn-glass-hi: rgba(255, 255, 255, 0.28);
    --sn-text: #f6f2ed;
    --sn-text-dim: rgba(246, 242, 237, 0.62);
    --sn-text-faint: rgba(246, 242, 237, 0.38);
    --sn-ink: #0b0b0b;
    --sn-chip: rgba(255, 255, 255, 0.1);
    --sn-shadow: 0 18px 40px -18px rgba(40, 32, 24, 0.45);
    --sn-blur: blur(22px) saturate(140%);
    --sn-radius: 28px;
    --sn-radius-sm: 18px;
    --sn-hero-filter: none;
    --sn-hero-fade: 72%;
    color-scheme: light;
  }
  :host([dark]) {
    --sn-bg: radial-gradient(120% 90% at 70% 10%, #34302c 0%, #1f1d1b 50%, #121110 100%);
    --sn-text-on-bg: #f3efe9;
    --sn-text-on-bg-dim: rgba(243, 239, 233, 0.55);
    --sn-glass: rgba(255, 255, 255, 0.06);
    --sn-glass-strong: rgba(255, 255, 255, 0.09);
    --sn-glass-light: rgba(255, 255, 255, 0.08);
    --sn-glass-border: rgba(255, 255, 255, 0.09);
    --sn-glass-hi: rgba(255, 255, 255, 0.16);
    --sn-shadow: 0 18px 40px -18px rgba(0, 0, 0, 0.7);
    --sn-hero-filter: brightness(0.78) contrast(1.06) saturate(0.9);
    --sn-hero-fade: 55%;
    color-scheme: dark;
  }
  :host([lowfx]) {
    --sn-blur: none;
    --sn-glass: rgba(74, 68, 62, 0.9);
    --sn-glass-strong: rgba(58, 53, 48, 0.95);
  }
  :host([dark][lowfx]) {
    --sn-glass: #2a2724;
    --sn-glass-strong: #322e2b;
  }
  /* Night purple: deep indigo with lavender glass, a blue accent and an orange "warm" accent. */
  :host([palette="purple"]) {
    --sn-bg: radial-gradient(70% 55% at 15% 100%, rgba(214, 120, 220, 0.38) 0%, rgba(214, 120, 220, 0) 70%),
      radial-gradient(120% 90% at 70% 0%, #4d43a6 0%, #29235f 45%, #15122f 100%);
    --sn-text-on-bg: #f4f2ff;
    --sn-text-on-bg-dim: rgba(226, 222, 255, 0.6);
    --sn-glass: rgba(118, 106, 214, 0.2);
    --sn-glass-strong: rgba(64, 54, 150, 0.62);
    --sn-glass-light: rgba(150, 140, 240, 0.14);
    --sn-glass-border: rgba(200, 190, 255, 0.16);
    --sn-glass-hi: rgba(220, 214, 255, 0.24);
    --sn-text: #f4f2ff;
    --sn-text-dim: rgba(226, 222, 255, 0.62);
    --sn-text-faint: rgba(226, 222, 255, 0.38);
    --sn-ink: #110e29;
    --sn-chip: rgba(160, 150, 255, 0.12);
    --sn-accent: #9fb0ff;
    --sn-accent-strong: #7d90ff;
    --sn-accent-glow: rgba(140, 160, 255, 0.55);
    --sn-warm: #ff8a3d;
    --sn-shadow: 0 18px 40px -18px rgba(8, 4, 30, 0.8);
    --sn-hero-filter: none;
    --sn-hero-fade: 72%;
  }
  :host([palette="purple"][lowfx]) {
    --sn-glass: #2c2670;
    --sn-glass-strong: #352e85;
  }
`;

/** The frosted card every panel sits on, plus small shared pieces. Included by each component. */
const sharedBase = css`
  :host {
    font-family: var(--sn-font);
    -webkit-tap-highlight-color: transparent;
  }
  * {
    box-sizing: border-box;
  }
  .glass {
    position: relative;
    background: var(--sn-glass);
    backdrop-filter: var(--sn-blur);
    -webkit-backdrop-filter: var(--sn-blur);
    border: 1px solid var(--sn-glass-border);
    border-radius: var(--sn-radius);
    box-shadow: var(--sn-shadow), inset 0 1px 0 var(--sn-glass-hi);
    color: var(--sn-text);
  }
  .card-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  .card-head h3 {
    flex: 1;
    margin: 0;
    font-size: 19px;
    font-weight: 400;
    letter-spacing: -0.01em;
  }
  .round {
    display: grid;
    place-items: center;
    flex: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid var(--sn-glass-border);
    background: var(--sn-chip);
    color: inherit;
    cursor: pointer;
    padding: 0;
    font: inherit;
    transition: transform 0.15s ease, background 0.2s ease;
  }
  .round:active {
    transform: scale(0.94);
  }
  .round.light {
    background: #fff;
    color: #1d1b19;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 34px;
    padding: 0 14px 0 6px;
    border-radius: 999px;
    background: var(--sn-chip);
    border: 1px solid var(--sn-glass-border);
    font-size: 13px;
    white-space: nowrap;
  }
  .chip .ic {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }
  .empty {
    display: grid;
    place-items: center;
    min-height: 90px;
    padding: 12px;
    color: var(--sn-text-faint);
    font-size: 13px;
    text-align: center;
  }
  .gear {
    width: 38px;
    height: 38px;
  }
  :host-context([wall-display]) button:not(.switch){min-height:var(--sn-target-size,52px);}
  button {
    font-family: inherit;
  }
  .switch {
    position: relative;
    width: 52px;
    height: 30px;
    border-radius: 999px;
    border: 1px solid var(--sn-glass-border);
    background: rgba(255, 255, 255, 0.12);
    cursor: pointer;
    padding: 0;
    transition: background 0.25s ease, box-shadow 0.25s ease;
  }
  .switch::after {
    content: "";
    position: absolute;
    top: 3px;
    inset-inline-start: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #fff;
    transition: inset-inline-start 0.25s cubic-bezier(0.3, 1.4, 0.5, 1);
  }
  .switch[on] {
    background: var(--sn-accent);
    box-shadow: 0 0 16px var(--sn-accent-glow);
  }
  .switch[on]::after {
    inset-inline-start: 25px;
  }
  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
      animation: none !important;
    }
  }
`;

export const shared = [sharedBase, hideStyles];
