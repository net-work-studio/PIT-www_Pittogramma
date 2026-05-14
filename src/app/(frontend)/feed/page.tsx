import type { Metadata } from "next";
import AdvCard from "@/components/cards/adv-card";
import CommunityCard from "@/components/cards/community-card";
import PageHeader from "@/components/shared/page-header";
import { type AdvTier, TIER_CAPS, TIER_ORDER } from "@/lib/adv-config";
import { buildLocalToday } from "@/lib/date-utils";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import { sanityFetch } from "@/sanity/lib/live";
import { FEED_COMMUNITY_QUERY, FEED_QUERY } from "@/sanity/lib/queries";

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
  const [advsRes, communityRes] = await Promise.all([
    sanityFetch({ query: FEED_QUERY, params: { today } }),
    sanityFetch({ query: FEED_COMMUNITY_QUERY, params: { today } }),
  ]);

  const allAdvs = advsRes.data ?? [];
  const communityItems = communityRes.data ?? [];

  // The query already orders gold → silver → bronze, then dateStart asc;
  // we just slice each tier to its visible cap and concatenate in tier order.
  const byTier: Record<AdvTier, typeof allAdvs> = {
    gold: [],
    silver: [],
    bronze: [],
  };
  for (const adv of allAdvs) {
    if (adv.tier === "gold" || adv.tier === "silver" || adv.tier === "bronze") {
      byTier[adv.tier].push(adv);
    }
  }
  const advs = TIER_ORDER.flatMap((tier) =>
    byTier[tier].slice(0, TIER_CAPS[tier])
  );

  const hasAdvs = advs.some((adv) => adv.cover?.image?.asset);
  const hasCommunity = communityItems.some((item) => item.cover?.image?.asset);
  const hasItems = hasAdvs || hasCommunity;

  return (
    <>
      <PageHeader subtitle={PAGE_SUBTITLE} title={PAGE_TITLE} />
      <div className="space-y-10 pb-10">
        {hasItems ? (
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
            {communityItems.map((item) =>
              item.cover?.image?.asset ? (
                <CommunityCard
                  cover={item.cover}
                  description={item.description ?? undefined}
                  externalUrl={item.externalUrl}
                  key={item._id}
                  partnerName={item.partner?.name ?? null}
                  title={item.title ?? ""}
                />
              ) : null
            )}
          </section>
        ) : (
          <p className="py-20 text-center text-muted-foreground">
            No active sponsors or community items right now.
          </p>
        )}
      </div>
    </>
  );
}
