import type { Metadata } from "next";
import BaseCard from "@/components/cards/base-card";
import CtaCard from "@/components/cards/cta-card";
import FilterBar from "@/components/feat/filter/filter";
import LoadMore from "@/components/feat/load-more/load-more";
import SortDropdown from "@/components/feat/sort/sort-dropdown";
import { isValidSort } from "@/components/feat/sort/sort-options";
import PageHeader from "@/components/shared/page-header";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoModule } from "@/lib/types/seo";
import type SanityImage from "@/components/modules/shared/sanity-image";
import { sanityFetch } from "@/sanity/lib/live";
import {
  getInterviewsFilteredQuery,
  INTERVIEWS_COUNT_QUERY,
  INTERVIEWS_PAGE_QUERY,
  INTERVIEWS_TAGS_QUERY,
} from "@/sanity/lib/queries";
import type {
  INTERVIEWS_FILTERED_QUERY_RESULT,
  INTERVIEWS_TAGS_QUERY_RESULT,
} from "@/sanity/types";

const PAGE_SIZE = 48;
const MAX_PAGE = 100;

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: INTERVIEWS_PAGE_QUERY,
    stega: false,
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

export default async function InterviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string; page?: string; sort?: string }>;
}) {
  const { tags: tagsParam, page: pageParam, sort: sortParam } =
    await searchParams;
  const sort = isValidSort(sortParam) ? sortParam : "newest";
  const tagSlugs = tagsParam?.split(",").filter(Boolean) ?? [];
  const hasTags = tagSlugs.length > 0;
  const parsedPage = Number.parseInt(pageParam ?? "1", 10);
  const requestedPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const page = Math.min(requestedPage, MAX_PAGE);
  const start = 0;
  const end = page * PAGE_SIZE;

  const [
    { data: interviews },
    { data: totalCount },
    { data: availableTags },
    { data: pageSettings },
  ] = await Promise.all([
    sanityFetch({
      query: getInterviewsFilteredQuery(sort),
      params: { tags: tagSlugs, hasTags, start, end },
    }),
    sanityFetch({
      query: INTERVIEWS_COUNT_QUERY,
      params: { tags: tagSlugs, hasTags },
    }),
    sanityFetch({ query: INTERVIEWS_TAGS_QUERY }),
    sanityFetch({ query: INTERVIEWS_PAGE_QUERY }),
  ]);

  const cta = pageSettings?.endOfPageCta;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const tags = (availableTags ?? []) as INTERVIEWS_TAGS_QUERY_RESULT;
  const uniqueTags = Array.from(
    new Map(tags.map((t) => [t._id, t])).values()
  );

  type SanityImageSource = Parameters<typeof SanityImage>[0]["source"];

  interface InterviewCard {
    authors: { name: string }[] | undefined;
    href: string;
    id: string;
    image: SanityImageSource;
    title: string;
  }

  const items = (interviews ?? []) as INTERVIEWS_FILTERED_QUERY_RESULT;
  const interviewCards: InterviewCard[] = items
    .filter((interview) => interview.slug?.current)
    .map((interview) => ({
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

  return (
    <>
      <PageHeader
        subtitle={pageSettings?.introText}
        title={pageSettings?.title ?? "Interviews"}
      />
      <div className="space-y-10 pb-10">
        <div className="flex items-start justify-between gap-4">
          <FilterBar
            availableTags={uniqueTags}
            totalCount={totalCount}
            label="interviews"
          />
          <SortDropdown />
        </div>
        {interviewCards.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            No results found
          </p>
        ) : (
          <section className="col-span-1 grid grid-cols-1 gap-4 md:grid-cols-3 lg:col-span-3 xl:grid-cols-4">
            {interviewCards.map((card) => (
              <BaseCard
                authors={card.authors}
                href={card.href}
                image={card.image}
                key={card.id}
                title={card.title}
              />
            ))}
          </section>
        )}
        <LoadMore currentPage={page} totalPages={totalPages} />
      </div>
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
    </>
  );
}
