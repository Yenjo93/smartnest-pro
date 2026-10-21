// Floor plan maths, kept free of three.js and Lit so the editor and the 3D view share it.
// Units are metres. x runs right, y runs down the page (z in 3D).
//
// Walls aren't stored for rooms: every room edge becomes a wall. Edges that lie on the same line (two rooms
// sharing a side, or a drawn wall along a room) are merged into one wall, then doorways and removed stretches
// are cut out. That works at any angle, so rooms can be any shape.
import type { PlanDoor, PlanFloor, PlanPoint, PlanRoom } from "../types";

export const GRID = 0.25;
export const WALL_T = 0.12;
export const WALL_H = 1.05;
export const DOOR_W = 0.9;

export const snap = (v: number, step = GRID) => Math.round(v / step) * step;

// ---------- rooms ----------

/** A room's corners in order, whether it's a rectangle or a free shape. */
export const roomPts = (r: PlanRoom): PlanPoint[] =>
  r.pts && r.pts.length >= 3
    ? r.pts
    : [
        { x: r.x, y: r.y },
        { x: r.x + r.w, y: r.y },
        { x: r.x + r.w, y: r.y + r.h },
        { x: r.x, y: r.y + r.h },
      ];

/** The bounding box of a set of points, as a room's x/y/w/h. */
export function bbox(pts: PlanPoint[]) {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

/** A free-shape room with its bounding box kept in sync. */
export const shapeRoom = (r: PlanRoom, pts: PlanPoint[]): PlanRoom => ({ ...r, pts, ...bbox(pts) });

/** Ray-casting point-in-polygon. */
export function inside(pts: PlanPoint[], x: number, y: number): boolean {
  let hit = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i];
    const b = pts[j];
    if (a.y > y !== b.y > y && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) hit = !hit;
  }
  return hit;
}

/** Area-weighted centre of a polygon. */
export function centroid(pts: PlanPoint[]): PlanPoint {
  let a = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const f = pts[j].x * pts[i].y - pts[i].x * pts[j].y;
    a += f;
    cx += (pts[j].x + pts[i].x) * f;
    cy += (pts[j].y + pts[i].y) * f;
  }
  if (Math.abs(a) < 1e-9) return { x: pts[0].x, y: pts[0].y };
  return { x: cx / (3 * a), y: cy / (3 * a) };
}

/** A spot inside the room for its label or a pin: the centre when it's inside, otherwise the nearest grid spot that is. */
export function innerPoint(r: PlanRoom): PlanPoint {
  const pts = roomPts(r);
  const c = centroid(pts);
  if (inside(pts, c.x, c.y)) return c;
  let best = c;
  let bd = Infinity;
  for (let x = r.x + 0.25; x < r.x + r.w; x += 0.25)
    for (let y = r.y + 0.25; y < r.y + r.h; y += 0.25) {
      if (!inside(pts, x, y)) continue;
      const d = (x - c.x) ** 2 + (y - c.y) ** 2;
      if (d < bd) {
        bd = d;
        best = { x, y };
      }
    }
  return best;
}

export const roomAt = (floor: PlanFloor, x: number, y: number): PlanRoom | undefined =>
  [...floor.rooms].reverse().find((r) => inside(roomPts(r), x, y));

export function bounds(floor: PlanFloor) {
  const pts = [
    ...floor.rooms.flatMap(roomPts),
    ...(floor.walls ?? []).flatMap((w) => [
      { x: w.x1, y: w.y1 },
      { x: w.x2, y: w.y2 },
    ]),
  ];
  if (!pts.length) return { x: 0, y: 0, w: 10, h: 8 };
  return bbox(pts);
}

// ---------- walls ----------

export interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Radians, in [0, π). */
  angle: number;
}

const EPS = 1e-6;

/** A line, so edges on the same line can be found and merged: direction angle in [0, π) and offset from the origin. */
function lineOf(x1: number, y1: number, x2: number, y2: number) {
  let a = Math.atan2(y2 - y1, x2 - x1);
  if (a < 0) a += Math.PI;
  if (a >= Math.PI - 1e-4) a -= Math.PI;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const c = -dy * x1 + dx * y1;
  return { a, dx, dy, c, key: `${Math.round(a * 2000)}:${Math.round(c * 100)}` };
}

type Line = ReturnType<typeof lineOf>;
const along = (l: Line, x: number, y: number) => l.dx * x + l.dy * y;
const off = (l: Line, x: number, y: number) => -l.dy * x + l.dx * y - l.c;
const at = (l: Line, t: number): PlanPoint => ({ x: l.dx * t - l.dy * l.c, y: l.dy * t + l.dx * l.c });

function union(list: [number, number][]): [number, number][] {
  const sorted = [...list].sort((a, b) => a[0] - b[0]);
  const out: [number, number][] = [];
  for (const [a, b] of sorted) {
    const last = out[out.length - 1];
    if (last && a <= last[1] + EPS) last[1] = Math.max(last[1], b);
    else out.push([a, b]);
  }
  return out;
}

function cut(list: [number, number][], gaps: [number, number][]): [number, number][] {
  let out = list;
  for (const [g0, g1] of gaps) {
    const next: [number, number][] = [];
    for (const [a, b] of out) {
      if (g1 <= a || g0 >= b) next.push([a, b]);
      else {
        if (g0 > a + EPS) next.push([a, g0]);
        if (g1 < b - EPS) next.push([g1, b]);
      }
    }
    out = next;
  }
  return out.filter(([a, b]) => b - a > 0.05);
}

/** A gap's centre and wall direction, for both the old straight-wall form and the new one. */
export function doorPos(d: PlanDoor): { x: number; y: number; angle: number } {
  if (d.x !== undefined && d.y !== undefined) return { x: d.x, y: d.y, angle: ((d.angle ?? 0) * Math.PI) / 180 };
  return d.axis === "v" ? { x: d.line ?? 0, y: d.at ?? 0, angle: Math.PI / 2 } : { x: d.at ?? 0, y: d.line ?? 0, angle: 0 };
}

interface LineGroup {
  line: Line;
  parts: [number, number][];
  /** Every room corner or wall end on this line: where a wall can be split into pieces to remove. */
  breaks: number[];
}

function lineGroups(floor: PlanFloor): Map<string, LineGroup> {
  const lines = new Map<string, LineGroup>();
  const addEdge = (x1: number, y1: number, x2: number, y2: number) => {
    if (Math.hypot(x2 - x1, y2 - y1) < 0.01) return;
    const l = lineOf(x1, y1, x2, y2);
    const g = lines.get(l.key) ?? { line: l, parts: [], breaks: [] };
    const t1 = along(l, x1, y1);
    const t2 = along(l, x2, y2);
    g.parts.push([Math.min(t1, t2), Math.max(t1, t2)]);
    lines.set(l.key, g);
  };
  for (const r of floor.rooms) {
    const pts = roomPts(r);
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % pts.length];
      addEdge(p.x, p.y, q.x, q.y);
    });
  }
  for (const w of floor.walls ?? []) addEdge(w.x1, w.y1, w.x2, w.y2);
  // Break points: any corner that sits on the line.
  const corners = [
    ...floor.rooms.flatMap(roomPts),
    ...(floor.walls ?? []).flatMap((w) => [
      { x: w.x1, y: w.y1 },
      { x: w.x2, y: w.y2 },
    ]),
  ];
  for (const g of lines.values()) {
    const ts = corners.filter((p) => Math.abs(off(g.line, p.x, p.y)) < 0.02).map((p) => along(g.line, p.x, p.y));
    g.breaks = [...new Set(ts.map((t) => Math.round(t * 1000) / 1000))].sort((a, b) => a - b);
  }
  return lines;
}

function gapsOn(floor: PlanFloor, l: Line, onlyOpen = false): [number, number][] {
  const out: [number, number][] = [];
  for (const d of floor.doors) {
    if (onlyOpen && !d.open) continue;
    const p = doorPos(d);
    let da = p.angle % Math.PI;
    if (da < 0) da += Math.PI;
    const diff = Math.min(Math.abs(da - l.a), Math.PI - Math.abs(da - l.a));
    if (diff > 0.01 || Math.abs(off(l, p.x, p.y)) > 0.03) continue;
    const t = along(l, p.x, p.y);
    out.push([t - d.width / 2, t + d.width / 2]);
  }
  return out;
}

/** Every wall of a floor: room edges and drawn walls, merged where they overlap, with doorways and openings cut out. */
export function walls(floor: PlanFloor): Segment[] {
  const out: Segment[] = [];
  for (const { line, parts } of lineGroups(floor).values()) {
    for (const [t0, t1] of cut(union(parts), gapsOn(floor, line))) {
      const a = at(line, t0);
      const b = at(line, t1);
      out.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, angle: line.a });
    }
  }
  return out;
}

/** The removed stretches of wall, for the editor to draw as dashed lines you can tap to restore. */
export function openings(floor: PlanFloor): (Segment & { id: string })[] {
  return floor.doors
    .filter((d) => d.open)
    .map((d) => {
      const p = doorPos(d);
      const dx = Math.cos(p.angle) * (d.width / 2);
      const dy = Math.sin(p.angle) * (d.width / 2);
      return { id: d.id, x1: p.x - dx, y1: p.y - dy, x2: p.x + dx, y2: p.y + dy, angle: p.angle };
    });
}

/** The doorways (not openings), with their ends, for thresholds and the editor. */
export function doorways(floor: PlanFloor): (Segment & { id: string })[] {
  return floor.doors
    .filter((d) => !d.open)
    .map((d) => {
      const p = doorPos(d);
      const dx = Math.cos(p.angle) * (d.width / 2);
      const dy = Math.sin(p.angle) * (d.width / 2);
      return { id: d.id, x1: p.x - dx, y1: p.y - dy, x2: p.x + dx, y2: p.y + dy, angle: p.angle };
    });
}

export interface WallHit {
  x: number;
  y: number;
  /** Degrees. */
  angle: number;
  /** The wall piece between the nearest corners on each side: what "remove wall" takes out. */
  piece: { x: number; y: number; width: number };
  /** Room for a door here, centred on the tap but kept inside the wall. */
  door?: { x: number; y: number };
}

/** The wall nearest a point, if close enough: where a doorway would go, and which stretch "remove" would open. */
export function nearestWall(floor: PlanFloor, x: number, y: number, maxDist = 0.4): WallHit | undefined {
  let best: (WallHit & { d: number }) | undefined;
  for (const { line, parts, breaks } of lineGroups(floor).values()) {
    const d = Math.abs(off(line, x, y));
    if (d > maxDist || (best && d >= best.d)) continue;
    const t = along(line, x, y);
    const span = union(parts).find(([a, b]) => t >= a - 0.05 && t <= b + 0.05);
    if (!span) continue;
    // The piece between the break points on either side of the tap.
    const lo = Math.max(span[0], ...breaks.filter((b) => b <= t + 1e-6));
    const hi = Math.min(span[1], ...breaks.filter((b) => b >= t - 1e-6));
    const mid = at(line, (lo + hi) / 2);
    const p = at(line, Math.min(Math.max(t, lo), hi));
    let door: PlanPoint | undefined;
    if (hi - lo >= DOOR_W + 0.1) {
      const tc = Math.min(hi - DOOR_W / 2, Math.max(lo + DOOR_W / 2, snap(t, 0.05)));
      door = at(line, tc);
    }
    best = { x: p.x, y: p.y, angle: (line.a * 180) / Math.PI, piece: { x: mid.x, y: mid.y, width: hi - lo }, door, d };
  }
  if (!best) return undefined;
  const { d: _d, ...hit } = best;
  return hit;
}

/** Does a gap sit on one of this room's edges? (So an open door sensor in the room lights that doorway.) */
export function gapTouchesRoom(d: PlanDoor, r: PlanRoom): boolean {
  const p = doorPos(d);
  const pts = roomPts(r);
  return pts.some((a, i) => {
    const b = pts[(i + 1) % pts.length];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    if (len < 0.01) return false;
    const t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / (len * len);
    if (t < -0.05 || t > 1.05) return false;
    const qx = a.x + t * (b.x - a.x);
    const qy = a.y + t * (b.y - a.y);
    return Math.hypot(p.x - qx, p.y - qy) < 0.05;
  });
}

// ---------- snapping ----------

/**
 * Snaps a moving or resizing rectangle's edges to the grid, and to the edges of the other rooms when they're
 * within `pull` metres, so neighbouring rooms meet exactly and share one wall.
 */
export function snapRect(r: PlanRoom, others: PlanRoom[], pull = 0.3): PlanRoom {
  const corners = others.flatMap(roomPts);
  const xs = corners.map((p) => p.x);
  const ys = corners.map((p) => p.y);
  const near = (v: number, list: number[]) => {
    let best = snap(v);
    let bd = pull;
    for (const t of list) {
      const d = Math.abs(t - v);
      if (d < bd) {
        bd = d;
        best = t;
      }
    }
    return best;
  };
  const x0 = near(r.x, xs);
  const y0 = near(r.y, ys);
  const x1 = near(r.x + r.w, xs);
  const y1 = near(r.y + r.h, ys);
  return { ...r, x: x0, y: y0, w: Math.max(GRID * 4, x1 - x0), h: Math.max(GRID * 4, y1 - y0) };
}

/** Snaps a corner being placed: onto another corner or wall end nearby, else onto the grid. */
export function snapPoint(floor: PlanFloor, x: number, y: number, pull = 0.3, step = 0.05): PlanPoint {
  let best: PlanPoint = { x: snap(x, step), y: snap(y, step) };
  let bd = pull;
  const targets = [
    ...floor.rooms.flatMap(roomPts),
    ...(floor.walls ?? []).flatMap((w) => [
      { x: w.x1, y: w.y1 },
      { x: w.x2, y: w.y2 },
    ]),
  ];
  for (const p of targets) {
    const d = Math.hypot(p.x - x, p.y - y);
    if (d < bd) {
      bd = d;
      best = { x: p.x, y: p.y };
    }
  }
  return best;
}

/** Spreads n icons evenly inside a room (any shape), away from the walls. */
export function layoutInRoom(r: PlanRoom, n: number, topStrip = 0): PlanPoint[] {
  if (!n) return [];
  const pts = roomPts(r);
  const box = { x: r.x, y: r.y + topStrip, w: r.w, h: r.h - topStrip };
  // Try finer and finer grids until enough cells fall inside the shape.
  for (let k = 1; k < 6; k++) {
    const cols = Math.max(1, Math.round(Math.sqrt((n * box.w) / Math.max(0.1, box.h)) * k));
    const rows = Math.max(1, Math.ceil((n * k * k) / cols));
    const spots: PlanPoint[] = [];
    for (let row = 0; row < rows; row++)
      for (let c = 0; c < cols; c++) {
        const x = box.x + ((c + 0.5) / cols) * box.w;
        const y = box.y + ((row + 0.5) / rows) * box.h;
        if (inside(pts, x, y)) spots.push({ x, y });
      }
    if (spots.length >= n) {
      const stride = spots.length / n;
      return Array.from({ length: n }, (_, i) => spots[Math.floor(i * stride)]);
    }
  }
  const c = innerPoint(r);
  return Array.from({ length: n }, () => c);
}
