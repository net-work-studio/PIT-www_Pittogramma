export type EventType = "talk" | "workshop" | "5+1" | "event";

interface EventTypeBadge {
  label: string;
  variant: "event-type";
}

const TYPE_LABELS: Record<EventType, string> = {
  talk: "TALK",
  workshop: "WORKSHOP",
  "5+1": "5+1",
  event: "EVENT",
};

export function getEventTypeBadge(
  type: string | null | undefined
): EventTypeBadge | null {
  if (!type) {
    return null;
  }

  switch (type as EventType) {
    case "talk":
      return { label: TYPE_LABELS.talk, variant: "event-type" };
    case "workshop":
      return { label: TYPE_LABELS.workshop, variant: "event-type" };
    case "5+1":
      return { label: TYPE_LABELS["5+1"], variant: "event-type" };
    case "event":
      return { label: TYPE_LABELS.event, variant: "event-type" };
    default: {
      const _exhaustive: never = type as never;
      return null;
    }
  }
}
