// Press-and-hold: fires after a short hold without moving, and swallows the click that follows so the tap action
// (toggle, open dialog) doesn't run too.
import type { HassEntity } from "../types";
import { domainOf } from "../ha";

const HOLD_MS = 450;

export function onHold(e: PointerEvent, fn: () => void): void {
  if (e.button !== 0) return;
  const el = e.currentTarget as HTMLElement;
  const x = e.clientX;
  const y = e.clientY;
  const timer = window.setTimeout(() => {
    cleanup();
    el.addEventListener("click", swallow, { capture: true, once: true });
    navigator.vibrate?.(10);
    fn();
  }, HOLD_MS);
  const move = (ev: PointerEvent) => {
    if (Math.hypot(ev.clientX - x, ev.clientY - y) > 8) cleanup();
  };
  const cleanup = () => {
    clearTimeout(timer);
    el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerup", cleanup);
    el.removeEventListener("pointercancel", cleanup);
    el.removeEventListener("pointerleave", cleanup);
  };
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerup", cleanup);
  el.addEventListener("pointercancel", cleanup);
  el.addEventListener("pointerleave", cleanup);
}

function swallow(e: Event) {
  e.stopPropagation();
  e.preventDefault();
}

/** Stops the long-press menu (copy, save image) from popping up over the hold. */
export const noMenu = (e: Event) => e.preventDefault();

const SET_POSITION = 4;

/** Devices with a level the hold popup can set: dimmable lights and covers that report a position. */
export function hasLevel(id: string, s?: HassEntity): boolean {
  if (!s) return false;
  const d = domainOf(id);
  if (d === "light") return (s.attributes.supported_color_modes ?? []).some((m: string) => m !== "onoff");
  if (d === "cover") return ((s.attributes.supported_features ?? 0) & SET_POSITION) !== 0 || typeof s.attributes.current_position === "number";
  return false;
}
