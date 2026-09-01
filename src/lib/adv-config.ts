// Single source of truth for ADV tier configuration. Used by both the
// schema-level validators and the feed dialog to keep caps and ordering in lock-step.

import type { INDEX_GOLD_QUERY_RESULT } from "@/sanity/types";

export type AdvTier = "gold" | "silver" | "bronze";

// Visible slot capacity per tier. Surplus active campaigns are sorted in by
// dateStart asc and silently dropped past the cap, per the plan's
// "first-booked-first-served, surplus simply doesn't render" rule.
export const TIER_CAPS: Record<AdvTier, number> = {
  bronze: 5,
  gold: 1,
  silver: 2,
};

// Tier priority used for both feed dialog concatenation order and the FEED_QUERY
// GROQ sort priority. If you change this, also update the `select(...)` clause
// in FEED_QUERY in src/sanity/lib/queries.ts.
export const TIER_ORDER: readonly AdvTier[] = ["gold", "silver", "bronze"];

// Phase 5: gold injection at row 1 / position 3 on /interviews and /projects
// index pages. 1-indexed, matches the surface matrix in plans/adv-system.md.
export const INDEX_GOLD_POSITION = 3;

export type IndexGold = INDEX_GOLD_QUERY_RESULT[number];

export type IndexSlot<T> =
  | { kind: "editorial"; item: T }
  | { kind: "adv"; item: IndexGold };

// Splices a gold ADV at the 1-indexed `goldPosition` of the editorial array.
// When editorial is shorter than the target position (e.g., only 2 results),
// the gold appends at the end rather than throwing. The ADV is overlayed on
// top of editorial — pagination math (`totalCount`, `totalPages`) continues
// to use editorial counts only.
export function buildIndexSlots<T>(
  editorial: T[],
  gold: IndexGold | undefined,
  goldPosition: number = INDEX_GOLD_POSITION
): IndexSlot<T>[] {
  const slots: IndexSlot<T>[] = editorial.map((item) => ({
    item,
    kind: "editorial",
  }));
  if (gold) {
    const insertAt = Math.min(goldPosition - 1, slots.length);
    slots.splice(insertAt, 0, { item: gold, kind: "adv" });
  }
  return slots;
}
