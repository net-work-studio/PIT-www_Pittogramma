import type { Metadata } from "next";
import CtaCard from "@/components/cards/cta-card";
import RecentUpdates from "@/components/home/recent-updates";
import HomeGrid from "@/components/home-grid";
import FeaturedHero from "@/components/shared/featured-hero";
import PageHeader from "@/components/shared/page-header";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoModule } from "@/lib/types/seo";
import { sanityFetch } from "@/sanity/lib/live";
import {
  HOME_FEED_QUERY,
  HOME_PAGE_QUERY,
  RECENT_UPDATES_QUERY,
} from "@/sanity/lib/queries";
import type { HOME_FEED_QUERY_RESULT } from "@/sanity/types";

// 1 hero + 4 + 12 + 12 = 29 items, all rows full multiples of 4 (no orphans)
const FIRST_SECTION = 4;
const SECOND_SECTION = 12;
const THIRD_SECTION = 12;

const buildLocalToday = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

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
  const [{ data: homePage }, { data: feedItems }, { data: recentUpdates }] =
    await Promise.all([
      sanityFetch({ query: HOME_PAGE_QUERY }),
      sanityFetch({ query: HOME_FEED_QUERY, params: { today } }),
      sanityFetch({ query: RECENT_UPDATES_QUERY }),
    ]);

  const midCta = homePage?.midPageCta;
  const cta = homePage?.endOfPageCta;

  // Resolve featured: manual pick with fallback to latest
  // Note: featuredItem type from HOME_PAGE_QUERY is `null` until schema is deployed
  // and typegen re-run. Cast to feed item type for now.
  type FeedItem = HOME_FEED_QUERY_RESULT[number];
  const featuredItem: FeedItem | null =
    (homePage?.featuredItem as FeedItem | null) ?? feedItems?.[0] ?? null;
  const gridItems = ((feedItems ?? []) as FeedItem[]).filter(
    (item) => item._id !== featuredItem?._id
  );

  // Split feed into sections
  const firstSection = gridItems.slice(0, FIRST_SECTION);
  const secondSection = gridItems.slice(
    FIRST_SECTION,
    FIRST_SECTION + SECOND_SECTION
  );
  const thirdSection = gridItems.slice(
    FIRST_SECTION + SECOND_SECTION,
    FIRST_SECTION + SECOND_SECTION + THIRD_SECTION
  );

  const featuredSubtitle = (() => {
    if (!featuredItem) return null;
    if (featuredItem._type === "interview") {
      const names =
        featuredItem.people?.map((p) => p.name).join(", ") ||
        (featuredItem as FeedItem & { studio?: string }).studio ||
        (featuredItem as FeedItem & { typeFoundry?: string }).typeFoundry;
      return names ? `Interview to ${names}` : null;
    }
    // project or journal: bare author names
    const names = featuredItem.people?.map((p) => p.name).join(", ");
    return names || null;
  })();

  return (
    <>
      <PageHeader subtitle={homePage?.introText} title="Pittogramma" />

      <div className="flex flex-col gap-4">
        {/* Featured hero */}
        {featuredItem?.cover?.image?.asset && (
          <FeaturedHero
            contentType={
              featuredItem._type as "project" | "interview" | "journal"
            }
            cover={featuredItem.cover}
            href={
              featuredItem._type === "project"
                ? `/projects/${featuredItem.slug?.current ?? ""}`
                : featuredItem._type === "journal"
                  ? `/journal/${featuredItem.slug?.current ?? ""}`
                  : `/interviews/${featuredItem.slug?.current ?? ""}`
            }
            subtitle={featuredSubtitle}
            title={featuredItem.title ?? ""}
          />
        )}

        {/* Section 1: 1 row of 4 */}
        {firstSection.length > 0 && <HomeGrid items={firstSection} />}

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
        {secondSection.length > 0 && <HomeGrid items={secondSection} />}

        {/* Recent updates from archive */}
        {recentUpdates && recentUpdates.length > 0 && (
          <RecentUpdates items={recentUpdates} />
        )}

        {/* Section 3: 2 rows of 4 */}
        {thirdSection.length > 0 && <HomeGrid items={thirdSection} />}

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
