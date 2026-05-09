// Single source of truth for ADV tier configuration. Used by both the
// schema-level validators and the /feed page to keep caps and ordering in lock-step.

export type AdvTier = "gold" | "silver" | "bronze";

// Visible slot capacity per tier. Surplus active campaigns are sorted in by
// dateStart asc and silently dropped past the cap, per the plan's
// "first-booked-first-served, surplus simply doesn't render" rule.
export const TIER_CAPS: Record<AdvTier, number> = {
  gold: 1,
  silver: 2,
  bronze: 5,
};

// Tier priority used for both /feed concatenation order and the FEED_QUERY
// GROQ sort priority. If you change this, also update the `select(...)` clause
// in FEED_QUERY in src/sanity/lib/queries.ts.
export const TIER_ORDER: readonly AdvTier[] = ["gold", "silver", "bronze"];
