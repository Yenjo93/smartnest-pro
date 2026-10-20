// Taking things off a page in edit mode, and the list that puts them back. Hiding only affects SmartNest:
// nothing is removed from Home Assistant.
import { css, html, nothing, type TemplateResult } from "lit";
import { mdiClose, mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js";
import type { Ctx } from "../ctx";
import { nameOf } from "../ha";
import { icon } from "../ui/icon";

export const hiddenOn = (ctx: Ctx, page: string): string[] => ctx.config.pages[page]?.hidden ?? [];

/** The ids still shown on a page. */
export const shown = (ctx: Ctx, page: string, ids: string[]): string[] => {
  const hidden = hiddenOn(ctx, page);
  return hidden.length ? ids.filter((id) => !hidden.includes(id)) : ids;
};

const setHidden = (ctx: Ctx, page: string, fn: (list: string[]) => string[]) =>
  ctx.update((d) => {
    const p = (d.pages[page] ??= {});
    p.hidden = fn(p.hidden ?? []);
  });

/**
 * Wraps an item so edit mode can show an ✕ on its corner. The ✕ is a sibling of the item, never inside it:
 * a button inside a button is invalid HTML and the parser would split them.
 */
export function hideable(ctx: Ctx, page: string, id: string, item: TemplateResult) {
  if (!ctx.editing) return item;
  return html`<div class="hideable">
    ${item}
    <button
      class="hide-x"
      aria-label=${ctx.t("hide")}
      title=${ctx.t("hide")}
      @click=${(e: Event) => {
        e.stopPropagation();
        setHidden(ctx, page, (l) => [...l, id]);
      }}
    >
      ${icon(mdiClose, 16)}
    </button>
  </div>`;
}

/** Header button in edit mode: how many are hidden, opening the list to bring them back. */
export function hiddenButton(ctx: Ctx, page: string, label: (id: string) => string = (id) => nameOf(ctx.hass, id)) {
  if (!ctx.editing) return nothing;
  const count = hiddenOn(ctx, page).length;
  return html`<button
    class="action"
    @click=${() =>
      ctx.showSheet({
        title: ctx.t("hidden_items"),
        icon: mdiEyeOffOutline,
        render: (c) => {
          const list = hiddenOn(c, page);
          return list.length
            ? html`<div class="restore-list">
                ${list.map(
                  (id) => html`<div class="restore">
                    <span>${label(id)}</span>
                    <button @click=${() => setHidden(c, page, (l) => l.filter((x) => x !== id))}>${icon(mdiEyeOutline, 18)}${c.t("show")}</button>
                  </div>`,
                )}
              </div>`
            : html`<div class="empty">${c.t("nothing_hidden")}</div>`;
        },
      })}
  >
    ${icon(mdiEyeOffOutline, 18)}${ctx.t("hidden_items")} · ${count}
  </button>`;
}

/** Styles for the ✕ badge; part of `shared` so every component has them. */
export const hideStyles = css`
  .hideable {
    position: relative;
    display: grid;
    min-width: 0;
  }
  .hideable > :first-child {
    animation: wiggle 0.5s ease-in-out infinite alternate;
  }
  @keyframes wiggle {
    from {
      transform: rotate(-0.4deg);
    }
    to {
      transform: rotate(0.4deg);
    }
  }
  .hide-x {
    position: absolute;
    top: -8px;
    inset-inline-end: -8px;
    z-index: 3;
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    padding: 0;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.85);
    background: #b5442f;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 6px 14px -4px rgba(0, 0, 0, 0.5);
  }
  .restore-list {
    display: grid;
    gap: 8px;
  }
  .restore {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 10px 10px 16px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.06);
  }
  .restore span {
    flex: 1;
  }
  .restore button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 38px;
    padding: 0 14px;
    border-radius: 999px;
    border: 0;
    background: var(--sn-accent);
    color: #1d2a12;
    cursor: pointer;
    font-size: 13px;
  }
`;
