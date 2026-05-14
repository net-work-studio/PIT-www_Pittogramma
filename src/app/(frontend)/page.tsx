import type { Metadata } from "next";
import CtaCard from "@/components/cards/cta-card";
import RecentUpdates from "@/components/home/recent-updates";
import HomeGrid, { type HomeGridSlot } from "@/components/home-grid";
import FeaturedHero from "@/components/shared/featured-hero";
import PageHeader from "@/components/shared/page-header";
import { buildLocalToday } from "@/lib/date-utils";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoModule } from "@/lib/types/seo";
import { sanityFetch } from "@/sanity/lib/live";
import {
  HOME_ADV_QUERY,
  HOME_FEED_QUERY,
  HOME_PAGE_QUERY,
  RECENT_UPDATES_QUERY,
} from "@/sanity/lib/queries";
import type {
  HOME_ADV_QUERY_RESULT,
  HOME_FEED_QUERY_RESULT,
} from "@/sanity/types";

// 1 hero + 4 + 12 + 12 = 29 items, all rows full multiples of 4 (no orphans)
const FIRST_SECTION = 4;
const SECOND_SECTION = 12;
const THIRD_SECTION = 12;

// ADV injection positions (1-indexed) per the surface matrix in plans/adv-system.md.
const GOLD_S1_POSITION = 3;
const SILVER_S2_POSITION_A = 3;
const SILVER_S2_POSITION_B = 11;

type EditorialItem = HOME_FEED_QUERY_RESULT[number];
type AdvItem = HOME_ADV_QUERY_RESULT[number];

function getEditorialHref(item: EditorialItem): string {
  if (item._type === "project") {
    return `/projects/${item.slug?.current ?? ""}`;
  }
  if (item._type === "journal") {
    return `/journal/${item.slug?.current ?? ""}`;
  }
  return `/interviews/${item.slug?.current ?? ""}`;
}

function getFeaturedSubtitle(
  featuredItem: EditorialItem | null
): string | null {
  if (!featuredItem) {
    return null;
  }

  if (featuredItem._type === "interview") {
    const names =
      featuredItem.people?.map((p) => p.name).join(", ") ||
      (featuredItem as EditorialItem & { studio?: string }).studio ||
      (featuredItem as EditorialItem & { typeFoundry?: string }).typeFoundry;
    return names ? `Interview to ${names}` : null;
  }

  const names = featuredItem.people?.map((p) => p.name).join(", ");
  return names || null;
}

// Walks an editorial cursor and injects ADVs at fixed 1-indexed positions.
// Returns the assembled slots and how many editorial items were consumed,
// so the next section can pick up where this one left off.
function assembleSection({
  total,
  injections,
  editorial,
}: {
  total: number;
  injections: Map<number, AdvItem>;
  editorial: EditorialItem[];
}): { slots: HomeGridSlot[]; editorialConsumed: number } {
  const slots: HomeGridSlot[] = [];
  let cursor = 0;
  for (let position = 1; position <= total; position++) {
    const adv = injections.get(position);
    if (adv) {
      slots.push({ kind: "adv", item: adv });
      continue;
    }
    const editorialItem = editorial[cursor];
    if (!editorialItem) {
      break;
    }
    slots.push({ kind: "editorial", item: editorialItem });
    cursor++;
  }
  return { slots, editorialConsumed: cursor };
}

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: HOME_PAGE_QUERY,
    stega: false,
  });

  return mapSanityToMetadata({
    page: {
      title: siteDefaults.title,
      description: siteDefaults.description,
      seo: page?.seo as SeoModule | undefined,
    },
    baseUrl: siteDefaults.baseUrl,
    path: "/",
    siteDefaults,
  });
}

export default async function Home() {
  const today = buildLocalToday();
  const [
    { data: homePage },
    { data: feedItems },
    { data: recentUpdates },
    { data: homeAdvs },
  ] = await Promise.all([
    sanityFetch({ query: HOME_PAGE_QUERY }),
    sanityFetch({ query: HOME_FEED_QUERY, params: { today } }),
    sanityFetch({ query: RECENT_UPDATES_QUERY }),
    sanityFetch({ query: HOME_ADV_QUERY, params: { today } }),
  ]);

  const midCta = homePage?.midPageCta;
  const cta = homePage?.endOfPageCta;

  // Resolve featured: manual pick with fallback to latest editorial.
  // The hero is always editorial — ADVs never enter this pool.
  // Note: featuredItem type from HOME_PAGE_QUERY is `null` until schema is deployed
  // and typegen re-run. Cast to feed item type for now.
  const featuredItem: EditorialItem | null =
    (homePage?.featuredItem as EditorialItem | null) ?? feedItems?.[0] ?? null;
  const editorialPool = ((feedItems ?? []) as EditorialItem[]).filter(
    (item) => item._id !== featuredItem?._id
  );

  // Bucket ADVs by tier. Query already orders within tier by dateStart asc,
  // so silvers[0] is the oldest-booked (best slot) and silvers[1] takes p11.
  const advs = (homeAdvs ?? []) as AdvItem[];
  const golds = advs.filter((a) => a.tier === "gold");
  const silvers = advs.filter((a) => a.tier === "silver");
  const goldForS1P3 = golds[0] ?? null;
  const silverForS2P3 = silvers[0] ?? null;
  const silverForS2P11 = silvers[1] ?? null;

  const s1Injections = new Map<number, AdvItem>();
  if (goldForS1P3) {
    s1Injections.set(GOLD_S1_POSITION, goldForS1P3);
  }

  const s2Injections = new Map<number, AdvItem>();
  if (silverForS2P3) {
    s2Injections.set(SILVER_S2_POSITION_A, silverForS2P3);
  }
  if (silverForS2P11) {
    s2Injections.set(SILVER_S2_POSITION_B, silverForS2P11);
  }

  let offset = 0;
  const s1 = assembleSection({
    total: FIRST_SECTION,
    injections: s1Injections,
    editorial: editorialPool.slice(offset),
  });
  offset += s1.editorialConsumed;

  const s2 = assembleSection({
    total: SECOND_SECTION,
    injections: s2Injections,
    editorial: editorialPool.slice(offset),
  });
  offset += s2.editorialConsumed;

  const s3 = assembleSection({
    total: THIRD_SECTION,
    injections: new Map(),
    editorial: editorialPool.slice(offset),
  });

  const featuredSubtitle = getFeaturedSubtitle(featuredItem);

  return (
    <>
      {featuredItem?.cover?.image?.asset && (
        <FeaturedHero
          contentType={
            featuredItem._type as "project" | "interview" | "journal"
          }
          cover={featuredItem.cover}
          href={getEditorialHref(featuredItem)}
          subtitle={featuredSubtitle}
          title={featuredItem.title ?? ""}
        />
      )}

      <PageHeader subtitle={homePage?.introText} title="Pittogramma" />

      <div className="flex flex-col gap-4">
        {/* Section 1: 1 row of 4 */}
        {s1.slots.length > 0 && <HomeGrid slots={s1.slots} />}

        {/* Mid-page CTA */}
        {midCta && (
          <CtaCard
            buttonText={midCta.buttonText}
            externalUrl={midCta.externalUrl}
            headline={midCta.headline}
            image={midCta.image}
            internalLink={midCta.internalLink}
            linkType={midCta.linkType}
            variant={midCta.variant}
          />
        )}

        {/* Section 2: 3 rows of 4 */}
        {s2.slots.length > 0 && <HomeGrid slots={s2.slots} />}

        {/* Recent updates from archive */}
        {recentUpdates && recentUpdates.length > 0 && (
          <RecentUpdates items={recentUpdates} />
        )}

        {/* Section 3: 2 rows of 4 */}
        {s3.slots.length > 0 && <HomeGrid slots={s3.slots} />}

        {/* Final CTA */}
        {cta && (
          <CtaCard
            buttonText={cta.buttonText}
            externalUrl={cta.externalUrl}
            headline={cta.headline}
            image={cta.image}
            internalLink={cta.internalLink}
            linkType={cta.linkType}
            variant={cta.variant}
          />
        )}
      </div>
    </>
  );
}
