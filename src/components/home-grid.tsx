import AdvCard from "@/components/cards/adv-card";
import BaseCard from "@/components/cards/base-card";
import { resolveJournalHeroCover } from "@/lib/cover-media-utils";
import { formatEventCardLocation } from "@/lib/event-location";
import { EVENT_TYPE_BADGE_VARIANT, getEventTypeLabel } from "@/lib/event-type";
import { getJournalLabelConfig } from "@/lib/journal-label";
import type {
  HOME_ADV_QUERY_RESULT,
  HOME_FEED_QUERY_RESULT,
} from "@/sanity/types";

type EditorialItem = HOME_FEED_QUERY_RESULT[number];
type AdvItem = HOME_ADV_QUERY_RESULT[number];
type BaseCardVariant = Parameters<typeof BaseCard>[0]["variant"];

export type HomeGridSlot =
  | { kind: "editorial"; item: EditorialItem }
  | { kind: "adv"; item: AdvItem };

function getEditorialHref(item: EditorialItem): string {
  if (item._type === "project") {
    return `/projects/${item.slug?.current ?? ""}`;
  }
  if (item._type === "journal") {
    return `/journal/${item.slug?.current ?? ""}`;
  }
  if (item._type === "event") {
    return `/events/${item.slug?.current ?? ""}`;
  }
  return `/interviews/${item.slug?.current ?? ""}`;
}

function getCardVariant(item: EditorialItem): BaseCardVariant {
  if (item._type !== "journal") {
    return item._type;
  }

  return getJournalLabelConfig(item.label)?.badgeVariant ?? "journal";
}

function getAuthors(item: EditorialItem) {
  if (item._type === "event") {
    const location = formatEventCardLocation(
      item.cardDestination === "external" ? "offline" : item.attendanceMode,
      item.locationName
    );
    return location ? [{ name: location }] : undefined;
  }

  if (item.people?.length) {
    return item.people.map((p) => ({ name: p.name ?? "" }));
  }

  if (
    item._type === "interview" &&
    item.interviewToType === "studio" &&
    item.studio
  ) {
    return [{ name: item.studio }];
  }

  if (
    item._type === "interview" &&
    item.interviewToType === "typeFoundry" &&
    item.typeFoundry
  ) {
    return [{ name: item.typeFoundry }];
  }
}

function renderSlot(slot: HomeGridSlot) {
  if (slot.kind === "adv") {
    const adv = slot.item;
    if (!adv.cover?.image?.asset) {
      return null;
    }
    return (
      <AdvCard
        cover={adv.cover}
        description={adv.description ?? undefined}
        externalUrl={adv.externalUrl}
        key={adv._id}
        sponsorName={adv.sponsor?.name ?? ""}
        title={adv.title ?? ""}
      />
    );
  }

  const { item } = slot;
  const isEvent = item._type === "event";
  const eventTypeLabel = isEvent ? getEventTypeLabel(item.type) : null;
  let cardVariant = getCardVariant(item);

  if (isEvent && eventTypeLabel) {
    cardVariant = EVENT_TYPE_BADGE_VARIANT;
  }

  return (
    <BaseCard
      authors={getAuthors(item)}
      badgeLabel={eventTypeLabel ?? undefined}
      external={isEvent && item.cardDestination === "external"}
      href={getEditorialHref(item)}
      image={
        item._type === "journal" ? resolveJournalHeroCover(item) : item.cover
      }
      key={item._id}
      title={item.title ?? ""}
      variant={cardVariant}
    />
  );
}

// Section assignment by breakpoint:
// base/sm (1-2 col, s1=4): S1=[0,3] S2=[4,15] S3=[16,27] hidden=[28,29]
// md (3 col, s1=6):         S1=[0,5] S2=[6,17] S3=[18,29]
// lg (4 col, s1=4):         S1=[0,3] S2=[4,15] S3=[16,27] hidden=[28,29]
// 2xl (6 col, s1=6):        S1=[0,5] S2=[6,17] S3=[18,29]
function getSlotClasses(index: number): string {
  if (index < 4) {
    return "order-1";
  }
  if (index < 6) {
    return "order-3 md:order-1 xl:order-3 3xl:order-1";
  }
  if (index < 16) {
    return "order-3";
  }
  if (index < 18) {
    return "order-5 md:order-3 xl:order-5 3xl:order-3";
  }
  if (index < 28) {
    return "order-5";
  }
  return "hidden md:block md:order-5 xl:hidden 3xl:block";
}

function getSlotKey(slot: HomeGridSlot): string {
  return slot.item._id;
}

interface HomeGridProps {
  afterSection1?: React.ReactNode;
  afterSection2?: React.ReactNode;
  afterSection3?: React.ReactNode;
  slots: HomeGridSlot[];
}

export default function HomeGrid({
  slots,
  afterSection1,
  afterSection2,
  afterSection3,
}: HomeGridProps) {
  return (
    <section className="grid 3xl:grid-cols-6 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {slots.map((slot, i) => (
        <div className={getSlotClasses(i)} key={getSlotKey(slot)}>
          {renderSlot(slot)}
        </div>
      ))}

      {afterSection1 && (
        <div className="order-2 3xl:col-span-6 col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-4">
          {afterSection1}
        </div>
      )}

      {afterSection2 && (
        <div className="order-4 3xl:col-span-6 col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-4">
          {afterSection2}
        </div>
      )}

      {afterSection3 && (
        <div className="order-6 3xl:col-span-6 col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-4">
          {afterSection3}
        </div>
      )}
    </section>
  );
}
