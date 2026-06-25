export type EventType = "talk" | "workshop" | "5+1" | "event";

export const EVENT_TYPE_BADGE_VARIANT = "event-type" as const;

const TYPE_LABELS: Record<EventType, string> = {
  talk: "TALK",
  workshop: "WORKSHOP",
  "5+1": "5+1",
  event: "EVENT",
};

export function getEventTypeLabel(
  type: string | null | undefined
): string | null {
  if (!type) {
    return null;
  }

  if (!(type in TYPE_LABELS)) {
    return null;
  }

  return TYPE_LABELS[type as EventType];
}
