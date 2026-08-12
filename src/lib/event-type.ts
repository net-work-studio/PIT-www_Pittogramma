export type EventType = "talk" | "workshop" | "5+1" | "event";

export const EVENT_TYPE_BADGE_VARIANT = "event-type" as const;
export const EVENT_TYPE_DETAIL_BADGE_VARIANT = "detail-event" as const;

const TYPE_LABELS: Record<EventType, string> = {
  "5+1": "5+1",
  event: "EVENT",
  talk: "TALK",
  workshop: "WORKSHOP",
};

export function isEventType(type: string): type is EventType {
  return Object.hasOwn(TYPE_LABELS, type);
}

export function getEventTypeLabel(
  type: string | null | undefined
): string | null {
  if (!type) {
    return null;
  }

  if (!isEventType(type)) {
    return null;
  }

  return TYPE_LABELS[type];
}
