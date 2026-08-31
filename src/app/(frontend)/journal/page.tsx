import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type ReactNode, Suspense } from "react";
import BaseCard from "@/components/cards/base-card";
import CtaCard from "@/components/cards/cta-card";
import FilterSheet from "@/components/feat/filter/filter-sheet";
import LoadMore from "@/components/feat/load-more/load-more";
import SortDropdown from "@/components/feat/sort/sort-dropdown";
import { isValidSort } from "@/components/feat/sort/sort-options";
import JournalPageSkeleton from "@/components/modules/shared/journal-page-skeleton";
import type SanityImage from "@/components/modules/shared/sanity-image";
import FeaturedHero from "@/components/shared/featured-hero";
import PageHeader from "@/components/shared/page-header";
import {
  getJournalHeroCover,
  resolveJournalHeroCover,
} from "@/lib/cover-media-utils";
import { getJournalLabelConfig } from "@/lib/journal-label";
import { JOURNAL_LABELS } from "@/lib/journal-labels";
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
  getJournalFilteredQuery,
  JOURNAL_COUNT_QUERY,
  JOURNAL_PAGE_QUERY,
} from "@/sanity/lib/queries";
import type { JOURNAL_QUERY_RESULT } from "@/sanity/types";

const PAGE_SIZE = 48;
const MAX_PAGE = 100;

const JOURNAL_LABEL_OPTIONS = JOURNAL_LABELS.map((opt) => ({
  _id: opt.value,
  name: opt.title,
  slug: opt.value,
}));

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const { data: page } = await sanityFetchMetadata({
    query: JOURNAL_PAGE_QUERY,
    perspective,
  });

  return mapSanityToMetadata({
    page: {
      title: page?.title ?? "Journal",
      description: page?.introText ?? undefined,
      seo: page?.seo as SeoModule | undefined,
    },
    baseUrl: siteDefaults.baseUrl,
    path: "/journal",
    siteDefaults,
  });
}

// Layer 1: Page is SYNC, always uses Suspense
export default function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string; page?: string; sort?: string }>;
}) {
  return (
    <Suspense fallback={<JournalPageSkeleton />}>
      <DynamicJournalPage searchParams={searchParams} />
    </Suspense>
  );
}

// Layer 2: Dynamic — awaits searchParams + getDynamicFetchOptions
async function DynamicJournalPage({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string; page?: string; sort?: string }>;
}) {
  const [sp, { perspective, stega }] = await Promise.all([
    searchParams,
    getDynamicFetchOptions(),
  ]);
  return (
    <CachedJournalPage
      pageParam={sp.page}
      perspective={perspective}
      sortParam={sp.sort}
      stega={stega}
      tagsParam={sp.tags}
    />
  );
}

// Layer 3: Cached — has 'use cache', ALL fetching + rendering logic
async function CachedJournalPage({
  tagsParam,
  pageParam,
  sortParam,
  perspective,
  stega,
}: {
  tagsParam?: string;
  pageParam?: string;
  sortParam?: string;
} & DynamicFetchOptions) {
  "use cache";

  const sort = isValidSort(sortParam) ? sortParam : "newest";
  const tagSlugs = tagsParam?.split(",").filter(Boolean) ?? [];
  const hasTags = tagSlugs.length > 0;
  const parsedPage = Number.parseInt(pageParam ?? "1", 10);
  const requestedPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  if (requestedPage > MAX_PAGE) {
    notFound();
  }
  const page = requestedPage;
  const start = 0;
  const end = page * PAGE_SIZE;

  const [{ data: articles }, { data: totalCount }, { data: pageSettings }] =
    await Promise.all([
      sanityFetch({
        query: getJournalFilteredQuery(sort),
        params: { tags: tagSlugs, hasTags, start, end },
        perspective,
        stega,
      }),
      sanityFetch({
        query: JOURNAL_COUNT_QUERY,
        params: { tags: tagSlugs, hasTags },
        perspective,
        stega,
      }),
      sanityFetch({ query: JOURNAL_PAGE_QUERY, perspective, stega }),
    ]);

  const featuredArticle =
    pageSettings?.featuredArticle ??
    (articles as JOURNAL_QUERY_RESULT)?.[0] ??
    null;
  const cta = pageSettings?.endOfPageCta;
  const totalPages = Math.max(1, Math.ceil((totalCount ?? 0) / PAGE_SIZE));
  if (page > totalPages) {
    notFound();
  }

  type SanityImageSource = Parameters<typeof SanityImage>[0]["source"];

  interface JournalCard {
    authors: { name: string }[] | undefined;
    badgeLabel: string | undefined;
    badgeVariant: Parameters<typeof BaseCard>[0]["variant"];
    href: string;
    id: string;
    image: SanityImageSource;
    title: string;
  }

  const items = (articles ?? []) as JOURNAL_QUERY_RESULT;
  const journalCards: JournalCard[] = items
    .filter((article) => article._id !== featuredArticle?._id)
    .map((article) => {
      const labelConfig = getJournalLabelConfig(article.label);
      return {
        authors: article.authors?.length
          ? article.authors.map((a) => ({ name: a.name ?? "" }))
          : undefined,
        badgeLabel: labelConfig?.label,
        badgeVariant: labelConfig?.badgeVariant ?? "article",
        href: `/journal/${article.slug?.current ?? ""}`,
        id: article._id,
        image: resolveJournalHeroCover(article),
        title: article.title ?? "",
      };
    });

  let featuredHero: ReactNode = null;
  if (featuredArticle) {
    const heroCover = getJournalHeroCover(featuredArticle);
    if (heroCover) {
      const featuredLabelConfig = getJournalLabelConfig(featuredArticle.label);

      featuredHero = (
        <FeaturedHero
          badgeLabel={featuredLabelConfig?.label}
          badgeVariant={featuredLabelConfig?.badgeVariant}
          contentType="journal"
          cover={heroCover}
          href={`/journal/${featuredArticle.slug?.current ?? ""}`}
          subtitle={
            featuredArticle.authors?.map((a) => a.name).join(", ") ?? undefined
          }
          title={featuredArticle.title ?? ""}
          variant="compact"
        />
      );
    }
  }

  return (
    <>
      {featuredHero}
      <PageHeader
        subtitle={pageSettings?.introText}
        title={pageSettings?.title ?? "Journal"}
      />
      <div className="space-y-10 pb-10">
        <div className="flex items-center justify-between gap-4">
          <p
            aria-live="polite"
            className="font-mono text-muted-foreground text-xs uppercase"
          >
            {totalCount} {totalCount === 1 ? "article" : "articles"}
          </p>
          <div className="flex items-center justify-end gap-2">
            <FilterSheet availableTags={JOURNAL_LABEL_OPTIONS} label="articles" />
            <SortDropdown />
          </div>
        </div>

        <section>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {journalCards.map((card) => (
              <BaseCard
                authors={card.authors}
                badgeLabel={card.badgeLabel}
                href={card.href}
                image={card.image}
                key={card.id}
                title={card.title}
                variant={card.badgeVariant}
              />
            ))}
          </div>
        </section>

        <LoadMore currentPage={page} totalPages={totalPages} />
      </div>
      {cta ? (
        <div className="mt-auto pt-10">
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
        </div>
      ) : null}
    </>
  );
}
