import type { Metadata } from "next";
import CtaCard from "@/components/cards/cta-card";
import FeaturedHero from "@/components/shared/featured-hero";
import SectionBreak from "@/components/home/section-break";
import HomeGrid from "@/components/home-grid";
import PageHeader from "@/components/shared/page-header";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoModule } from "@/lib/types/seo";
import { sanityFetch } from "@/sanity/lib/live";
import { HOME_FEED_QUERY, HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import type { HOME_FEED_QUERY_RESULT } from "@/sanity/types";

// Section sizes: 4 + 12 + 8 = 24 items
const FIRST_SECTION = 4;
const SECOND_SECTION = 12;

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
  const [{ data: homePage }, { data: feedItems }] = await Promise.all([
    sanityFetch({ query: HOME_PAGE_QUERY }),
    sanityFetch({ query: HOME_FEED_QUERY }),
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
  const thirdSection = gridItems.slice(FIRST_SECTION + SECOND_SECTION);

  const featuredDescription =
    featuredItem && "introText" in featuredItem
      ? (featuredItem.introText as string | null)
      : null;

  return (
    <>
      <PageHeader subtitle={homePage?.introText} title="Pittogramma" />

      <div className="flex flex-col gap-4">
        {/* Featured hero */}
        {featuredItem && featuredItem.cover && (
          <FeaturedHero
            contentType={featuredItem._type as "project" | "interview"}
            cover={featuredItem.cover}
            date={featuredItem.publishingDate?.date ?? null}
            description={featuredDescription}
            href={
              featuredItem._type === "project"
                ? `/projects/${featuredItem.slug?.current ?? ""}`
                : `/interviews/${featuredItem.slug?.current ?? ""}`
            }
            people={
              featuredItem.people?.map((p) => ({ name: p.name ?? "" })) ?? []
            }
            tags={featuredItem.tags?.map((t) => ({ name: t.name ?? "" })) ?? []}
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

        {/* Archive / Resource break — placeholder */}
        {thirdSection.length > 0 && <SectionBreak label="Archive break" />}

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
