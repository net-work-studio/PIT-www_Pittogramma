import type { Metadata } from "next";
import BaseCard from "@/components/cards/base-card";
import CtaCard from "@/components/cards/cta-card";
import FilterBar from "@/components/feat/filter/filter";
import LoadMore from "@/components/feat/load-more/load-more";
import SortDropdown from "@/components/feat/sort/sort-dropdown";
import { isValidSort } from "@/components/feat/sort/sort-options";
import type SanityImage from "@/components/modules/shared/sanity-image";
import FeaturedHero from "@/components/shared/featured-hero";
import PageHeader from "@/components/shared/page-header";
import { getJournalLabelConfig } from "@/lib/journal-label";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoModule } from "@/lib/types/seo";
import { sanityFetch } from "@/sanity/lib/live";
import {
  getJournalFilteredQuery,
  JOURNAL_COUNT_QUERY,
  JOURNAL_PAGE_QUERY,
} from "@/sanity/lib/queries";
import type { JOURNAL_QUERY_RESULT } from "@/sanity/types";

const PAGE_SIZE = 48;

const JOURNAL_LABEL_OPTIONS = [
  { _id: "articles", name: "Articles", slug: "articles" },
  { _id: "diary", name: "Diary", slug: "diary" },
  { _id: "baseline", name: "Baseline", slug: "baseline" },
];

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: JOURNAL_PAGE_QUERY,
    stega: false,
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

export default async function JournalPage({
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
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const start = 0;
  const end = page * PAGE_SIZE;

  const [
    { data: articles },
    { data: totalCount },
    { data: pageSettings },
  ] = await Promise.all([
    sanityFetch({
      query: getJournalFilteredQuery(sort),
      params: { tags: tagSlugs, hasTags, start, end },
    }),
    sanityFetch({
      query: JOURNAL_COUNT_QUERY,
      params: { tags: tagSlugs, hasTags },
    }),
    sanityFetch({ query: JOURNAL_PAGE_QUERY }),
  ]);

  const featuredArticle = pageSettings?.featuredArticle;
  const cta = pageSettings?.endOfPageCta;
  const totalPages = Math.max(1, Math.ceil((totalCount ?? 0) / PAGE_SIZE));

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
    .filter(
      (article) =>
        article.slug?.current && article._id !== featuredArticle?._id
    )
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
        image: article.cover,
        title: article.title ?? "",
      };
    });

  return (
    <>
      <PageHeader
        onlySeoTitle
        subtitle={pageSettings?.introText ?? undefined}
        title={pageSettings?.title ?? "Journal"}
      />
      <div className="space-y-10 pb-10">
        {featuredArticle?.cover?.image?.asset && (() => {
          const featuredLabelConfig = getJournalLabelConfig(featuredArticle.label);
          return (
            <FeaturedHero
              badgeLabel={featuredLabelConfig?.label}
              badgeVariant={featuredLabelConfig?.badgeVariant}
              contentType="journal"
              cover={featuredArticle.cover}
              href={`/journal/${featuredArticle.slug?.current ?? ""}`}
              subtitle={featuredArticle.excerpt}
              title={featuredArticle.title ?? ""}
            />
          );
        })()}

        {/* Section divider */}
        {featuredArticle?.cover?.image?.asset && (
          <div className="flex items-center gap-4 border-t pt-4" />
        )}

        <div className="flex items-start justify-between gap-4">
          <FilterBar
            availableTags={JOURNAL_LABEL_OPTIONS}
            label="articles"
            totalCount={totalCount}
          />
          <SortDropdown />
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
