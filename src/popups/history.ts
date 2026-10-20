import type { Hass } from "../types";

export interface Point {
  /** ms since epoch */
  t: number;
  s: string;
  a?: Record<string, any>;
}

/** State history from the recorder. With `attrs`, each point carries its attributes (a person's coordinates). */
export async function history(hass: Hass, id: string, hours = 24, attrs = false): Promise<Point[]> {
  const res = await hass.callWS<Record<string, any[]>>({
    type: "history/history_during_period",
    start_time: new Date(Date.now() - hours * 3_600_000).toISOString(),
    end_time: new Date().toISOString(),
    entity_ids: [id],
    minimal_response: !attrs,
    no_attributes: !attrs,
    significant_changes_only: false,
  });
  // The compressed format uses s / a / lu (seconds); older servers send full state objects.
  return (res[id] ?? []).map((e) => ({
    t: typeof e.lu === "number" ? e.lu * 1000 : Date.parse(e.last_updated ?? e.last_changed),
    s: e.s ?? e.state,
    a: e.a ?? e.attributes,
  }));
}
