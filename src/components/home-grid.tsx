import BaseCard from "@/components/cards/base-card";
import type { HOME_FEED_QUERY_RESULT } from "@/sanity/types";

export default function HomeGrid({ items }: { items: HOME_FEED_QUERY_RESULT }) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const href =
          item._type === "project"
            ? `/projects/${item.slug?.current ?? ""}`
            : `/interviews/${item.slug?.current ?? ""}`;

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
            variant={item._type}
          />
        );
      })}
    </section>
  );
}
