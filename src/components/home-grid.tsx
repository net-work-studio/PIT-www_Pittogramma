import AdvCard from "@/components/cards/adv-card";
import BaseCard from "@/components/cards/base-card";
import type {
  HOME_ADV_QUERY_RESULT,
  HOME_FEED_QUERY_RESULT,
} from "@/sanity/types";

type EditorialItem = HOME_FEED_QUERY_RESULT[number];
type AdvItem = HOME_ADV_QUERY_RESULT[number];

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
  return `/interviews/${item.slug?.current ?? ""}`;
}

function getCardVariant(item: EditorialItem) {
  if (item._type !== "journal") {
    return item._type;
  }

  if (item.label === "articles") {
    return "article";
  }
  if (item.label === "diary") {
    return "diary";
  }
  if (item.label === "baseline") {
    return "baseline";
  }

  return "journal";
}

function getAuthors(item: EditorialItem) {
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

  return;
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

  const item = slot.item;

  return (
    <BaseCard
      authors={getAuthors(item)}
      href={getEditorialHref(item)}
      image={item.cover}
      key={item._id}
      title={item.title ?? ""}
      variant={getCardVariant(item)}
    />
  );
}

export default function HomeGrid({ slots }: { slots: HomeGridSlot[] }) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {slots.map(renderSlot)}
    </section>
  );
}
