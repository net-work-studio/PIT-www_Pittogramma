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

export default function HomeGrid({ slots }: { slots: HomeGridSlot[] }) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {slots.map((slot) => {
        if (slot.kind === "adv") {
          const adv = slot.item;
          if (!adv.cover?.image?.asset) return null;
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
        const href =
          item._type === "project"
            ? `/projects/${item.slug?.current ?? ""}`
            : item._type === "journal"
              ? `/journal/${item.slug?.current ?? ""}`
              : `/interviews/${item.slug?.current ?? ""}`;

        const variant =
          item._type === "journal"
            ? item.label === "articles"
              ? "article"
              : item.label === "diary"
                ? "diary"
                : item.label === "baseline"
                  ? "baseline"
                  : "journal"
            : item._type;

        return (
          <BaseCard
            authors={
              item.people?.length
                ? item.people.map((p) => ({ name: p.name ?? "" }))
                : item._type === "interview" &&
                    item.interviewToType === "studio" &&
                    item.studio
                  ? [{ name: item.studio }]
                  : item._type === "interview" &&
                      item.interviewToType === "typeFoundry" &&
                      item.typeFoundry
                    ? [{ name: item.typeFoundry }]
                    : undefined
            }
            href={href}
            image={item.cover}
            key={item._id}
            title={item.title ?? ""}
            variant={variant}
          />
        );
      })}
    </section>
  );
}
