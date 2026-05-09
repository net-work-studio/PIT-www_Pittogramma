import type { Metadata } from "next";
import AdvCard from "@/components/cards/adv-card";
import PageHeader from "@/components/shared/page-header";
import { buildLocalToday } from "@/lib/date-utils";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import { sanityFetch } from "@/sanity/lib/live";
import { FEED_QUERY } from "@/sanity/lib/queries";

const PAGE_TITLE = "Feed";
const PAGE_SUBTITLE = "Sponsors and partners supporting Pittogramma.";

export function generateMetadata(): Metadata {
  return mapSanityToMetadata({
    page: {
      title: PAGE_TITLE,
      description: PAGE_SUBTITLE,
    },
    baseUrl: siteDefaults.baseUrl,
    path: "/feed",
    siteDefaults,
  });
}

export default async function FeedPage() {
  const today = buildLocalToday();
  const { data: items } = await sanityFetch({
    query: FEED_QUERY,
    params: { today },
  });

  const advs = items ?? [];

  return (
    <>
      <PageHeader subtitle={PAGE_SUBTITLE} title={PAGE_TITLE} />
      <div className="space-y-10 pb-10">
        {advs.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            No active sponsors right now.
          </p>
        ) : (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {advs.map((adv) =>
              adv.cover?.image?.asset ? (
                <AdvCard
                  cover={adv.cover}
                  description={adv.description ?? undefined}
                  externalUrl={adv.externalUrl}
                  key={adv._id}
                  sponsorName={adv.sponsor?.name ?? ""}
                  title={adv.title ?? ""}
                />
              ) : null
            )}
          </section>
        )}
      </div>
    </>
  );
}
