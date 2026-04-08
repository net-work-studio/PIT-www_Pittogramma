import BaseCard from "@/components/cards/base-card";
import PageHeader from "@/components/shared/page-header";
import { sanityFetch } from "@/sanity/lib/live";
import { ADVS_QUERY } from "@/sanity/lib/queries";
import type { ADVS_QUERY_RESULT } from "@/sanity/types";

export default async function BillboardPage() {
  const { data: advs } = await sanityFetch({ query: ADVS_QUERY });

  return (
    <>
      <PageHeader title="Billboard" subtitle="Sponsored content" />
      <section className="grid grid-cols-1 gap-4 pb-10 md:grid-cols-3 xl:grid-cols-4">
        {advs.map((adv: ADVS_QUERY_RESULT[number]) => (
          <BaseCard
            badgeLabel={adv.tier ?? undefined}
            external
            href={adv.externalUrl ?? "#"}
            image={adv.cover}
            key={adv._id}
            title={adv.title}
            variant={
              adv.tier as "bronze" | "silver" | "gold" | undefined
            }
          />
        ))}
      </section>
    </>
  );
}
