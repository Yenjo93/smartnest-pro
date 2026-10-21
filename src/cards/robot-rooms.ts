// Room cleaning for robot vacuums (Roborock and others that clean by "segment"): pick rooms on a small top-down
// plan, set suction, mop mode and how many passes, then send the robot. Each plan room is linked once to the
// robot's own room number; Roborock's rooms can be read straight from the robot to make that quick.
import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { mdiCog, mdiMagnify, mdiPlay, mdiSelectAll } from "@mdi/js";
import type { Ctx } from "../ctx";
import type { PlanFloor } from "../types";
import { shared } from "../styles";
import { icon } from "../ui/icon";
import { fieldStyles } from "../ui/fields";
import { domainOf, nameOf, siblings } from "../ha";
import { bounds, innerPoint, roomPts } from "../plan/geometry";

type RobotRoom = { id: number; name: string; map?: string };

/** Reads the rooms the robot knows (Roborock's get_maps service). Throws when the integration doesn't offer it. */
async function robotRooms(ctx: Ctx, entity: string): Promise<RobotRoom[]> {
  const res = await ctx.hass.callWS<{ response?: Record<string, { maps?: { name?: string; rooms?: Record<string, string> }[] }> }>({
    type: "call_service",
    domain: "roborock",
    service: "get_maps",
    target: { entity_id: entity },
    return_response: true,
  });
  const maps = res.response?.[entity]?.maps ?? [];
  return maps.flatMap((m) => Object.entries(m.rooms ?? {}).map(([id, name]) => ({ id: Number(id), name, map: m.name })));
}

/** The floor this robot cleans: the one chosen in setup, else the floor where its furniture piece stands, else the first. */
function robotFloor(ctx: Ctx, entity: string): PlanFloor | undefined {
  const floors = ctx.config.plan.floors;
  const chosen = ctx.config.robots?.[entity]?.floor;
  return (
    floors.find((f) => f.id === chosen) ??
    floors.find((f) => (f.furniture ?? []).some((p) => p.entity === entity)) ??
    floors.find((f) => f.rooms.length)
  );
}

const roomName = (ctx: Ctx, floor: PlanFloor, roomId: string) => {
  const r = floor.rooms.find((x) => x.id === roomId);
  return (r?.area && ctx.hass.areas?.[r.area]?.name) || ctx.t("unlinked");
};

@customElement("sn-robot-rooms")
export class SnRobotRooms extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @property() entity!: string;
  /** Selected plan room ids (or robot room ids when there's no plan). */
  @state() private picked = new Set<string>();
  @state() private repeat = 1;
  /** Robot rooms read from the robot, for robots without a floor plan link yet. */
  @state() private direct?: RobotRoom[];
  private triedDirect = false;

  private toggle(key: string) {
    const next = new Set(this.picked);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this.picked = next;
  }

  private segments(floor: PlanFloor | undefined): number[] {
    const map = this.ctx.config.robots?.[this.entity]?.segments ?? {};
    if (floor && Object.keys(map).length) return [...this.picked].map((k) => map[k]).filter((n) => Number.isFinite(n));
    return [...this.picked].map(Number).filter((n) => Number.isFinite(n));
  }

  private clean(floor: PlanFloor | undefined) {
    const segs = this.segments(floor);
    if (!segs.length) return;
    // Roborock's segment clean: rooms plus how many passes over each.
    this.ctx.hass.callService("vacuum", "send_command", {
      entity_id: this.entity,
      command: "app_segment_clean",
      params: [{ segments: segs, repeat: this.repeat }],
    });
    this.ctx.toast(this.ctx.t("cleaning_n", { n: segs.length }));
  }

  updated() {
    // No plan rooms linked yet: offer the robot's own room list instead.
    const mapped = Object.keys(this.ctx.config.robots?.[this.entity]?.segments ?? {}).length;
    if (!mapped && !this.triedDirect) {
      this.triedDirect = true;
      robotRooms(this.ctx, this.entity)
        .then((r) => (this.direct = r))
        .catch(() => (this.direct = []));
    }
  }

  private selects() {
    // Mop mode, mop intensity, route… whatever select entities the robot's integration adds.
    const { hass } = this.ctx;
    return siblings(hass, this.entity)
      .filter((id) => domainOf(id) === "select" && Array.isArray(hass.states[id]?.attributes.options))
      .slice(0, 3);
  }

  render() {
    const { t, hass, isAdmin } = this.ctx;
    const s = hass.states[this.entity];
    if (!s) return nothing;
    const floor = robotFloor(this.ctx, this.entity);
    const map = this.ctx.config.robots?.[this.entity]?.segments ?? {};
    const mapped = floor ? floor.rooms.filter((r) => Number.isFinite(map[r.id])) : [];
    const usePlan = !!floor && mapped.length > 0;
    const speeds: string[] = s.attributes.fan_speed_list ?? [];
    const b = floor ? bounds(floor) : undefined;
    const count = this.segments(floor).length;

    return html`<div class="box">
      <div class="head">
        <h4>${t("clean_rooms")}</h4>
        ${usePlan
          ? html`<button class="mini" @click=${() => (this.picked = this.picked.size ? new Set() : new Set(mapped.map((r) => r.id)))}>
              ${icon(mdiSelectAll, 16)}${this.picked.size ? t("clear") : t("all")}
            </button>`
          : nothing}
        ${isAdmin
          ? html`<button class="mini" aria-label=${t("robot_setup")} title=${t("robot_setup")} @click=${() =>
              this.ctx.showSheet({
                title: t("robot_setup"),
                icon: mdiCog,
                render: (c) => html`<sn-robot-setup .ctx=${c} .entity=${this.entity}></sn-robot-setup>`,
              })}>${icon(mdiCog, 16)}</button>`
          : nothing}
      </div>

      ${usePlan && b
        ? html`<svg class="plan" viewBox="${b.x - 0.3} ${b.y - 0.3} ${b.w + 0.6} ${b.h + 0.6}">
            ${floor!.rooms.map((r) => {
              const on = this.picked.has(r.id);
              const ok = Number.isFinite(map[r.id]);
              const c = innerPoint(r);
              return svg`<g class="r ${on ? "on" : ""} ${ok ? "" : "off"}" @click=${() => ok && this.toggle(r.id)}>
                <polygon points=${roomPts(r).map((p) => `${p.x},${p.y}`).join(" ")}></polygon>
                <text x=${c.x} y=${c.y} font-size=${Math.min(0.55, Math.max(0.28, r.w / 7))}>${roomName(this.ctx, floor!, r.id)}</text>
              </g>`;
            })}
          </svg>`
        : this.direct?.length
          ? html`<div class="chips">
              ${this.direct.map(
                (r) => html`<button class=${this.picked.has(String(r.id)) ? "on" : ""} @click=${() => this.toggle(String(r.id))}>${r.name}</button>`,
              )}
            </div>`
          : html`<div class="hint">${isAdmin ? t("robot_rooms_hint") : t("not_configured")}</div>`}

      ${speeds.length
        ? html`<div class="row"><span>${t("fan_speed")}</span>
            ${speeds.map(
              (sp) => html`<button class=${sp === s.attributes.fan_speed ? "on" : ""} @click=${() =>
                hass.callService("vacuum", "set_fan_speed", { entity_id: this.entity, fan_speed: sp })}>${sp.replace(/_/g, " ")}</button>`,
            )}
          </div>`
        : nothing}
      ${this.selects().map((id) => {
        const st = hass.states[id];
        return html`<div class="row"><span>${nameOf(hass, id)}</span>
          ${(st.attributes.options as string[]).map(
            (o) => html`<button class=${o === st.state ? "on" : ""} @click=${() => hass.callService("select", "select_option", { entity_id: id, option: o })}>${o.replace(/_/g, " ")}</button>`,
          )}
        </div>`;
      })}
      <div class="row"><span>${t("passes")}</span>
        ${[1, 2, 3].map((n) => html`<button class=${n === this.repeat ? "on" : ""} @click=${() => (this.repeat = n)}>${n}×</button>`)}
      </div>

      <button class="go" ?disabled=${!count} @click=${() => this.clean(floor)}>
        ${icon(mdiPlay, 18)}${count ? t("clean_selected", { n: count }) : t("pick_rooms")}
      </button>
    </div>`;
  }

  static styles = [
    shared,
    css`
      .box {
        display: grid;
        gap: 12px;
        padding: 14px;
        border-radius: 20px;
        background: rgba(0, 0, 0, 0.12);
        border: 1px solid var(--sn-glass-border);
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      h4 {
        flex: 1;
        margin: 0;
        font-size: 15px;
        font-weight: 500;
      }
      .mini {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 32px;
        padding: 0 10px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: rgba(255, 255, 255, 0.06);
        color: var(--sn-text-dim);
        font-size: 12px;
        cursor: pointer;
      }
      .plan {
        width: 100%;
        max-height: 260px;
        direction: ltr;
      }
      .r polygon {
        fill: rgba(255, 255, 255, 0.08);
        stroke: rgba(255, 255, 255, 0.45);
        stroke-width: 0.06;
        cursor: pointer;
        transition: fill 0.2s ease;
      }
      .r.on polygon {
        fill: color-mix(in srgb, var(--sn-accent) 45%, transparent);
        stroke: var(--sn-accent);
      }
      .r.off polygon {
        fill: rgba(0, 0, 0, 0.15);
        stroke-dasharray: 0.15 0.12;
        cursor: default;
      }
      .r text {
        fill: var(--sn-text);
        text-anchor: middle;
        dominant-baseline: middle;
        pointer-events: none;
      }
      .r.off text {
        fill: var(--sn-text-faint);
      }
      .chips,
      .row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
      }
      .row span {
        min-width: 70px;
        margin-inline-end: 4px;
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .chips button,
      .row button {
        height: 34px;
        padding: 0 14px;
        border-radius: 999px;
        border: 1px solid var(--sn-glass-border);
        background: var(--sn-chip);
        color: var(--sn-text);
        font-size: 13px;
        text-transform: capitalize;
        cursor: pointer;
      }
      .chips button.on,
      .row button.on {
        background: var(--sn-accent);
        color: #1d1b30;
        border-color: transparent;
      }
      .hint {
        font-size: 13px;
        color: var(--sn-text-dim);
      }
      .go {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 50px;
        border-radius: 18px;
        border: 0;
        background: var(--sn-accent);
        color: #1d1b30;
        font-size: 15px;
        cursor: pointer;
      }
      .go:disabled {
        opacity: 0.45;
        cursor: default;
      }
    `,
  ];
}

/** Admin setup: which floor the robot cleans, and which of the robot's rooms each plan room is. */
@customElement("sn-robot-setup")
export class SnRobotSetup extends LitElement {
  @property({ attribute: false }) ctx!: Ctx;
  @property() entity!: string;
  @state() private rooms?: RobotRoom[];
  @state() private loading = false;
  @state() private failed = false;

  private save(fn: (r: { floor?: string; segments: Record<string, number> }) => void) {
    const id = this.entity;
    this.ctx.saveLayout((cfg) => {
      const robots = { ...(cfg.robots ?? {}) };
      const r = { floor: robots[id]?.floor, segments: { ...(robots[id]?.segments ?? {}) } };
      fn(r);
      robots[id] = r;
      cfg.robots = robots;
    });
  }

  private async fetch(floor?: PlanFloor) {
    this.loading = true;
    this.failed = false;
    try {
      this.rooms = await robotRooms(this.ctx, this.entity);
      // Link plan rooms whose names match the robot's, for any that aren't linked yet.
      if (floor && this.rooms.length) {
        const current = this.ctx.config.robots?.[this.entity]?.segments ?? {};
        const matches: Record<string, number> = {};
        for (const r of floor.rooms) {
          if (Number.isFinite(current[r.id])) continue;
          const name = roomName(this.ctx, floor, r.id).toLowerCase();
          const hit = this.rooms.find((x) => x.name.toLowerCase() === name || name.includes(x.name.toLowerCase()) || x.name.toLowerCase().includes(name));
          if (hit) matches[r.id] = hit.id;
        }
        if (Object.keys(matches).length) this.save((r) => Object.assign(r.segments, matches));
      }
    } catch {
      this.failed = true;
    } finally {
      this.loading = false;
    }
  }

  render() {
    const { t, config } = this.ctx;
    const floor = robotFloor(this.ctx, this.entity);
    const map = config.robots?.[this.entity]?.segments ?? {};
    return html`
      <p class="lead">${t("robot_setup_hint")}</p>
      ${config.plan.floors.length > 1
        ? html`<label class="field">
            <span>${t("robot_floor")}</span>
            <select @change=${(e: Event) => {
              const v = (e.target as HTMLSelectElement).value;
              this.save((r) => (r.floor = v));
            }}>
              ${config.plan.floors.map((f) => html`<option value=${f.id} ?selected=${f.id === floor?.id}>${f.name}</option>`)}
            </select>
          </label>`
        : nothing}
      <button class="fetch" ?disabled=${this.loading} @click=${() => this.fetch(floor)}>
        ${icon(mdiMagnify, 18)}${this.loading ? t("loading") : t("read_robot_rooms")}
      </button>
      ${this.failed ? html`<p class="warn">${t("robot_rooms_failed")}</p>` : nothing}
      ${!floor
        ? html`<p class="warn">${t("draw_plan")}</p>`
        : html`<div class="list">
            ${floor.rooms.map((r) => {
              const v = map[r.id];
              return html`<label class="line">
                <span>${roomName(this.ctx, floor, r.id)}</span>
                ${this.rooms?.length
                  ? html`<select @change=${(e: Event) => {
                      const n = (e.target as HTMLSelectElement).value;
                      this.save((x) => (n ? (x.segments[r.id] = Number(n)) : delete x.segments[r.id]));
                    }}>
                      <option value="" ?selected=${!Number.isFinite(v)}>${t("none")}</option>
                      ${this.rooms.map((x) => html`<option value=${x.id} ?selected=${x.id === v}>${x.name} · ${x.id}${x.map ? ` (${x.map})` : ""}</option>`)}
                    </select>`
                  : html`<input
                      type="number"
                      min="1"
                      placeholder="#"
                      .value=${Number.isFinite(v) ? String(v) : ""}
                      @change=${(e: Event) => {
                        const n = (e.target as HTMLInputElement).value;
                        this.save((x) => (n ? (x.segments[r.id] = Number(n)) : delete x.segments[r.id]));
                      }}
                    />`}
              </label>`;
            })}
          </div>`}
    `;
  }

  static styles = [
    shared,
    fieldStyles,
    css`
      :host {
        display: grid;
        gap: 14px;
      }
      .lead,
      .warn {
        margin: 0;
        font-size: 13px;
        color: var(--sn-text-dim);
        line-height: 1.5;
      }
      .warn {
        color: #f6b49b;
      }
      .fetch {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 46px;
        border-radius: 14px;
        border: 0;
        background: var(--sn-accent);
        color: #1d1b30;
        font-size: 14px;
        cursor: pointer;
      }
      .list {
        display: grid;
        gap: 8px;
      }
      .line {
        display: grid;
        grid-template-columns: 1fr 1.4fr;
        align-items: center;
        gap: 12px;
        font-size: 14px;
      }
    `,
  ];
}
