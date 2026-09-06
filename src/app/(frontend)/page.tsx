import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { connection } from "next/server";
import { Suspense } from "react";
import CtaCard from "@/components/cards/cta-card";
import RecentUpdates from "@/components/home/recent-updates";
import HomeGrid, { type HomeGridSlot } from "@/components/home-grid";
import FeaturedHero from "@/components/shared/featured-hero";
import PageHeader from "@/components/shared/page-header";
import { getCachedLocalToday } from "@/lib/cached-date-utils";
import { getJournalHeroCover, hasCoverMedia } from "@/lib/cover-media-utils";
import { isUpcomingEvent } from "@/lib/date-utils";
import { formatEventCardLocation } from "@/lib/event-location";
import { getJournalLabelConfig } from "@/lib/journal-label";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoModule } from "@/lib/types/seo";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
} from "@/sanity/lib/live";
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

// Total stream slots = 30 (max needed at 3/6-col breakpoints).
// At base-2 breakpoints (2/4-col), items 28-29 are hidden via CSS.
const TOTAL_STREAM_SLOTS = 30;

// ADV injection positions (1-indexed, absolute in the stream).
const ADV_GOLD_POS = 3;
const ADV_SILVER_A_POS = 7;
const ADV_SILVER_B_POS = 15;

type EditorialItem = HOME_FEED_QUERY_RESULT[number];
type AdvItem = HOME_ADV_QUERY_RESULT[number];

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

function isHomepageEligible(item: EditorialItem, today: string): boolean {
  if (item._type !== "event") {
    return true;
  }

  return isUpcomingEvent(item.dateStart, item.dateEnd, today);
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

  if (featuredItem._type === "event") {
    return formatEventCardLocation(
      featuredItem.cardDestination === "external"
        ? "offline"
        : featuredItem.attendanceMode,
      featuredItem.locationName
    );
  }

  const names = featuredItem.people?.map((p) => p.name).join(", ");
  return names || null;
}

function getFeaturedBadge(item: EditorialItem | null) {
  if (!item) {
    return { label: undefined, variant: undefined };
  }
  if (item._type === "project") {
    return { label: "Project", variant: undefined };
  }
  if (item._type === "interview") {
    return { label: "Interview", variant: undefined };
  }
  if (item._type === "event") {
    return { label: "Event", variant: "event" as const };
  }
  const config = getJournalLabelConfig(item.label);
  return { label: config?.label, variant: config?.badgeVariant };
}

function getFeaturedCover(item: EditorialItem | null) {
  if (!item) {
    return null;
  }
  if (item._type === "journal") {
    return getJournalHeroCover(item);
  }
  return hasCoverMedia(item.cover) ? item.cover : null;
}

// Builds a flat stream of slots by interleaving editorial items and ADVs
// at fixed absolute positions. Always produces exactly `totalSlots` entries
// (or fewer if editorial pool is exhausted).
function buildHomeStream(
  editorial: EditorialItem[],
  injections: Map<number, AdvItem>,
  totalSlots: number
): HomeGridSlot[] {
  const slots: HomeGridSlot[] = [];
  let cursor = 0;
  for (let position = 1; position <= totalSlots; position += 1) {
    const adv = injections.get(position);
    if (adv) {
      slots.push({ item: adv, kind: "adv" });
      continue;
    }
    const item = editorial[cursor];
    if (!item) {
      break;
    }
    slots.push({ item, kind: "editorial" });
    cursor += 1;
  }
  return slots;
}

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const { data: page } = await sanityFetchMetadata({
    perspective,
    query: HOME_PAGE_QUERY,
  });

  return mapSanityToMetadata({
    baseUrl: siteDefaults.baseUrl,
    page: {
      description: siteDefaults.description,
      seo: page?.seo as SeoModule | undefined,
      title: siteDefaults.title,
    },
    path: "/",
    siteDefaults,
  });
}

export default async function Home() {
  const { isEnabled: isDraftMode } = await draftMode();
  return (
    <>
      {isDraftMode ? (
        <Suspense>
          <DynamicHome />
        </Suspense>
      ) : (
        <CachedHome perspective="published" stega={false} />
      )}
      <Suspense>
        <DynamicMarker />
      </Suspense>
    </>
  );
}

async function DynamicMarker() {
  await connection();
  return null;
}

async function DynamicHome() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedHome perspective={perspective} stega={stega} />;
}

async function CachedHome({ perspective, stega }: DynamicFetchOptions) {
  "use cache";
  const today = await getCachedLocalToday();
  const [
    { data: homePage },
    { data: feedItems },
    { data: recentUpdates },
    { data: homeAdvs },
  ] = await Promise.all([
    sanityFetch({ perspective, query: HOME_PAGE_QUERY, stega }),
    sanityFetch({
      params: { today },
      perspective,
      query: HOME_FEED_QUERY,
      stega,
    }),
    sanityFetch({ perspective, query: RECENT_UPDATES_QUERY, stega }),
    sanityFetch({
      params: { today },
      perspective,
      query: HOME_ADV_QUERY,
      stega,
    }),
  ]);

  const midCta = homePage?.midPageCta;
  const cta = homePage?.endOfPageCta;

  // Resolve featured: manual pick with fallback to latest editorial.
  const selectedFeatured = homePage?.featuredItem as unknown as
    | EditorialItem
    | null
    | undefined;
  const featuredItem: EditorialItem | null =
    (selectedFeatured && isHomepageEligible(selectedFeatured, today)
      ? selectedFeatured
      : null) ??
    (feedItems?.[0] as unknown as EditorialItem | undefined) ??
    null;
  const editorialPool = (
    (feedItems ?? []) as unknown as EditorialItem[]
  ).filter((item) => item._id !== featuredItem?._id);

  // Bucket ADVs by tier; only inject those with a valid cover image.
  const advs = (homeAdvs ?? []) as AdvItem[];
  const golds = advs.filter((a) => a.tier === "gold");
  const silvers = advs.filter((a) => a.tier === "silver");

  const injections = new Map<number, AdvItem>();
  if (golds[0]?.cover?.image?.asset) {
    injections.set(ADV_GOLD_POS, golds[0]);
  }
  if (silvers[0]?.cover?.image?.asset) {
    injections.set(ADV_SILVER_A_POS, silvers[0]);
  }
  if (silvers[1]?.cover?.image?.asset) {
    injections.set(ADV_SILVER_B_POS, silvers[1]);
  }

  const stream = buildHomeStream(editorialPool, injections, TOTAL_STREAM_SLOTS);

  const featuredSubtitle = getFeaturedSubtitle(featuredItem);
  const featuredBadge = getFeaturedBadge(featuredItem);
  const featuredCover = getFeaturedCover(featuredItem);

  return (
    <>
      {featuredItem && featuredCover ? (
        <FeaturedHero
          badgeLabel={featuredBadge.label}
          badgeVariant={featuredBadge.variant}
          contentType={
            featuredItem._type as "project" | "interview" | "journal" | "event"
          }
          cover={featuredCover}
          external={
            featuredItem._type === "event" &&
            featuredItem.cardDestination === "external"
          }
          href={getEditorialHref(featuredItem)}
          imageFillWidth={1600}
          subtitle={featuredSubtitle}
          title={featuredItem.title ?? ""}
        />
      ) : null}

      <PageHeader subtitle={homePage?.introText} title="Pittogramma" />

      <HomeGrid
        afterSection1={
          midCta ? (
            <CtaCard
              buttonText={midCta.buttonText}
              externalUrl={midCta.externalUrl}
              headline={midCta.headline}
              imgDark={midCta.imgDark}
              imgLight={midCta.imgLight}
              internalLink={midCta.internalLink}
              linkType={midCta.linkType}
              variant={midCta.variant}
            />
          ) : undefined
        }
        afterSection2={
          recentUpdates && recentUpdates.length > 0 ? (
            <RecentUpdates items={recentUpdates} />
          ) : undefined
        }
        afterSection3={
          cta ? (
            <CtaCard
              buttonText={cta.buttonText}
              externalUrl={cta.externalUrl}
              headline={cta.headline}
              imgDark={cta.imgDark}
              imgLight={cta.imgLight}
              internalLink={cta.internalLink}
              linkType={cta.linkType}
              variant={cta.variant}
            />
          ) : undefined
        }
        slots={stream}
      />
    </>
  );
}
