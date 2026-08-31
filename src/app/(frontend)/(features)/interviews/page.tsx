import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AdvCard from "@/components/cards/adv-card";
import BaseCard from "@/components/cards/base-card";
import CtaCard from "@/components/cards/cta-card";
import FilterSheet from "@/components/feat/filter/filter-sheet";
import LoadMore from "@/components/feat/load-more/load-more";
import SortDropdown from "@/components/feat/sort/sort-dropdown";
import { isValidSort } from "@/components/feat/sort/sort-options";
import type SanityImage from "@/components/modules/shared/sanity-image";
import PageHeader from "@/components/shared/page-header";
import { buildIndexSlots } from "@/lib/adv-config";
import { buildLocalToday } from "@/lib/date-utils";
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
  getInterviewsFilteredQuery,
  INDEX_GOLD_QUERY,
  INTERVIEWS_COUNT_QUERY,
  INTERVIEWS_PAGE_QUERY,
  INTERVIEWS_TAGS_QUERY,
  TAG_IDS_BY_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import type {
  INTERVIEWS_FILTERED_QUERY_RESULT,
  INTERVIEWS_TAGS_QUERY_RESULT,
} from "@/sanity/types";

const PAGE_SIZE = 48;
const MAX_PAGE = 20;

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const { data: page } = await sanityFetchMetadata({
    query: INTERVIEWS_PAGE_QUERY,
    perspective,
  });

  return mapSanityToMetadata({
    page: {
      title: page?.title ?? "Interviews",
      description: page?.introText,
      seo: page?.seo as SeoModule | undefined,
    },
    baseUrl: siteDefaults.baseUrl,
    path: "/interviews",
    siteDefaults,
  });
}

// Layer 1: Page is SYNC, always uses Suspense
export default function InterviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string; page?: string; sort?: string }>;
}) {
  return (
    <Suspense>
      <DynamicInterviewsPage searchParams={searchParams} />
    </Suspense>
  );
}

// Layer 2: Dynamic — awaits searchParams + getDynamicFetchOptions
async function DynamicInterviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string; page?: string; sort?: string }>;
}) {
  const [sp, { perspective, stega }] = await Promise.all([
    searchParams,
    getDynamicFetchOptions(),
  ]);
  return (
    <CachedInterviewsPage
      pageParam={sp.page}
      perspective={perspective}
      sortParam={sp.sort}
      stega={stega}
      tagsParam={sp.tags}
      today={buildLocalToday()}
    />
  );
}

// Layer 3: Cached — has 'use cache', ALL fetching + rendering logic
async function CachedInterviewsPage({
  tagsParam,
  pageParam,
  sortParam,
  perspective,
  stega,
  today,
}: {
  tagsParam?: string;
  pageParam?: string;
  sortParam?: string;
  today: string;
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
  const includeFuture = perspective !== "published";
  const tagIdsPromise = hasTags
    ? sanityFetch({
        query: TAG_IDS_BY_SLUGS_QUERY,
        params: { slugs: tagSlugs },
        perspective,
        stega,
      })
    : Promise.resolve({ data: [] as string[] });
  const interviewsPromise = tagIdsPromise.then(({ data: tagIds }) =>
    sanityFetch({
      query: getInterviewsFilteredQuery(sort),
      params: { end, hasTags, includeFuture, start, tagIds, today },
      perspective,
      stega,
    })
  );
  const totalCountPromise = tagIdsPromise.then(({ data: tagIds }) =>
    sanityFetch({
      query: INTERVIEWS_COUNT_QUERY,
      params: { hasTags, includeFuture, tagIds, today },
      perspective,
      stega,
    })
  );

  const [
    { data: interviews },
    { data: totalCount },
    { data: availableTags },
    { data: pageSettings },
    { data: goldAdv },
  ] = await Promise.all([
    interviewsPromise,
    totalCountPromise,
    sanityFetch({
      params: { includeFuture, today },
      perspective,
      query: INTERVIEWS_TAGS_QUERY,
      stega,
    }),
    sanityFetch({ query: INTERVIEWS_PAGE_QUERY, perspective, stega }),
    sanityFetch({
      query: INDEX_GOLD_QUERY,
      params: { today },
      perspective,
      stega,
    }),
  ]);

  const cta = pageSettings?.endOfPageCta;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  if (page > totalPages) {
    notFound();
  }

  const tags = (availableTags ?? []).filter(
    (tag): tag is NonNullable<INTERVIEWS_TAGS_QUERY_RESULT[number]> =>
      tag !== null
  );
  const uniqueTags = Array.from(new Map(tags.map((t) => [t._id, t])).values());

  type SanityImageSource = Parameters<typeof SanityImage>[0]["source"];

  interface InterviewCard {
    authors: { name: string }[] | undefined;
    href: string;
    id: string;
    image: SanityImageSource;
    title: string;
  }

  const items = (interviews ?? []) as INTERVIEWS_FILTERED_QUERY_RESULT;
  const interviewCards: InterviewCard[] = items.map((interview) => ({
    authors: interview.designersAndProfessionals?.length
      ? interview.designersAndProfessionals.map((d) => ({
          name: d.name ?? "",
        }))
      : undefined,
    href: `/interviews/${interview.slug?.current ?? ""}`,
    id: interview._id,
    image: interview.cover,
    title: interview.title ?? "",
  }));

  // Inject gold ADV at row 1 / position 3 on every render. The query caps at
  // a single active gold, so the ADV appears exactly once in the rendered
  // list. Pagination math (totalCount, totalPages) uses editorial counts only.
  const slots = buildIndexSlots(interviewCards, goldAdv?.[0]);

  return (
    <>
      <PageHeader
        subtitle={pageSettings?.introText}
        title={pageSettings?.title ?? "Interviews"}
      />
      <div className="space-y-10 pb-10">
        <div className="flex items-center justify-between gap-4">
          <p
            aria-live="polite"
            className="font-mono text-muted-foreground text-xs uppercase"
          >
            {totalCount} {totalCount === 1 ? "interview" : "interviews"}
          </p>
          <div className="flex items-center justify-end gap-2">
            <FilterSheet availableTags={uniqueTags} label="interviews" />
            <SortDropdown />
          </div>
        </div>
        {interviewCards.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            No results found
          </p>
        ) : (
          <section className="grid 3xl:grid-cols-6 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {slots.map((slot) => {
              if (slot.kind === "adv") {
                const adv = slot.item;
                if (!adv.cover?.image?.asset) {
                  return null;
                }
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
              const card = slot.item;
              return (
                <BaseCard
                  authors={card.authors}
                  href={card.href}
                  image={card.image}
                  key={card.id}
                  title={card.title}
                />
              );
            })}
          </section>
        )}
        <LoadMore currentPage={page} totalPages={totalPages} />
      </div>
      {cta && (
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
      )}
    </>
  );
}
