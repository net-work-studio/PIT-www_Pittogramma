import type { Metadata } from "next";
import BaseCard from "@/components/cards/base-card";
import CtaCard from "@/components/cards/cta-card";
import FeaturedArticle from "@/components/journal/featured-article";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { mapSanityToMetadata } from "@/lib/seo/mapSanityToMetadata";
import { siteDefaults } from "@/lib/seo/siteDefaults";
import type { SeoModule } from "@/lib/types/seo";
import { getBlurDataUrl, urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { JOURNAL_PAGE_QUERY, JOURNAL_QUERY } from "@/sanity/lib/queries";
import type { JOURNAL_QUERY_RESULT } from "@/sanity/types";

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

export default async function JournalPage() {
  const [{ data: articles }, { data: pageSettings }] = await Promise.all([
    sanityFetch({ query: JOURNAL_QUERY }),
    sanityFetch({ query: JOURNAL_PAGE_QUERY }),
  ]);

  const featuredArticle = pageSettings?.featuredArticle;
  const cta = pageSettings?.endOfPageCta;

  // Build featured article image URL
  const featuredImage = featuredArticle?.cover?.image
    ? urlFor(featuredArticle.cover.image).width(1600).height(1200).url()
    : "";

  const featuredDate = featuredArticle?.publishingDate?.date ?? null;

  interface JournalCard {
    authors: { name: string }[] | undefined;
    blurDataURL: string | undefined;
    href: string;
    id: string;
    image: string;
    title: string;
  }

  const journalCards: JournalCard[] = articles
    .filter(
      (article: JOURNAL_QUERY_RESULT[number]) =>
        article.slug?.current && article._id !== featuredArticle?._id
    )
    .map((article: JOURNAL_QUERY_RESULT[number]) => {
      const image = article.cover?.image
        ? urlFor(article.cover.image).width(1200).height(900).url()
        : "";

      return {
        authors: article.authors?.length
          ? article.authors.map((a) => ({ name: a.name ?? "" }))
          : undefined,
        blurDataURL: getBlurDataUrl(article.cover),
        href: `/journal/${article.slug?.current ?? ""}`,
        id: article._id,
        image,
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
        {featuredArticle && featuredImage && (
          <FeaturedArticle
            authors={
              featuredArticle.authors?.map((a: { name: string | null }) => ({
                name: a.name ?? "",
              })) ?? []
            }
            blurDataURL={getBlurDataUrl(featuredArticle.cover)}
            date={featuredDate}
            excerpt={featuredArticle.excerpt}
            href={`/journal/${featuredArticle.slug?.current ?? ""}`}
            image={featuredImage}
            tags={
              featuredArticle.tagSelector?.tags?.map((t: { name: string }) => ({
                name: t.name ?? "",
              })) ?? []
            }
            title={featuredArticle.title ?? ""}
          />
        )}

        {/* Section divider */}
        {featuredArticle && featuredImage && (
          <div className="flex items-center gap-4 border-t pt-4">
            <span className="font-mono text-muted-foreground text-sm uppercase">
              Read more
            </span>
          </div>
        )}

        <div>
          <Button className="font-mono uppercase">Filters</Button>
        </div>

        <section>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {journalCards.map((card) => (
              <BaseCard
                authors={card.authors}
                blurDataURL={card.blurDataURL}
                href={card.href}
                image={card.image}
                key={card.id}
                title={card.title}
                variant="article"
              />
            ))}
          </div>
        </section>

        <div className="flex items-center justify-center gap-2">
          <Button className="rounded-full font-mono uppercase">1</Button>
          <Button className="rounded-full font-mono uppercase">2</Button>
          <Button className="rounded-full font-mono uppercase">3</Button>
        </div>
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
