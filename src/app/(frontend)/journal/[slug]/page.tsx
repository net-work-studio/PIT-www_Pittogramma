import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { defineQuery } from "next-sanity";

import JournalContent from "@/components/modules/journal/journal-content";
import ShareLinks from "@/components/modules/project/share-links";
import EditorialPageHero from "@/components/modules/shared/editorial-page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { getCachedLocalToday } from "@/lib/cached-date-utils";
import { DetailPageBadge } from "@/lib/content-type-badge";
import {
  buildLocalToday,
  formatEventDate,
  isPublicationDateReached,
} from "@/lib/date-utils";
import { getJournalLabelConfig } from "@/lib/journal-label";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoModule } from "@/lib/types/seo";
import { urlForImage } from "@/sanity/lib/image";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
} from "@/sanity/lib/live";
import { JOURNAL_ARTICLE_QUERY } from "@/sanity/lib/queries";

export async function generateStaticParams() {
  const journalSlugsQuery = defineQuery(
    `*[_type == "journal" && defined(slug.current) && defined(publishingDate.date) && publishingDate.date <= $today] | order(_updatedAt desc) [0...100]{"slug": slug.current}`
  );
  const { data } = await sanityFetchStaticParams({
    params: { today: buildLocalToday() },
    query: journalSlugsQuery,
  });
  return data as { slug: string }[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, { perspective }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  const { data: article } = await sanityFetchMetadata({
    params: { slug },
    perspective,
    query: JOURNAL_ARTICLE_QUERY,
  });
  const today = await getCachedLocalToday();

  if (
    !article ||
    (perspective === "published" &&
      !isPublicationDateReached(article.publishingDate?.date, today))
  ) {
    return {};
  }

  return mapSanityToMetadata({
    baseUrl: siteDefaults.baseUrl,
    page: {
      coverImage: article.cover ?? undefined,
      description: article.excerpt ?? undefined,
      seo: article.seo as SeoModule | undefined,
      title: article.title,
    },
    path: `/journal/${slug}`,
    siteDefaults,
  });
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, { perspective, stega }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  return (
    <CachedJournalArticlePage
      perspective={perspective}
      slug={slug}
      stega={stega}
    />
  );
}

async function CachedJournalArticlePage({
  slug,
  perspective,
  stega,
}: { slug: string } & DynamicFetchOptions) {
  "use cache";
  const today = await getCachedLocalToday();
  const { data: article } = await sanityFetch({
    params: { slug },
    perspective,
    query: JOURNAL_ARTICLE_QUERY,
    stega,
  });

  if (
    !article ||
    (perspective === "published" &&
      !isPublicationDateReached(article.publishingDate?.date, today))
  ) {
    notFound();
  }

  const imageUrl = article.cover?.image?.asset
    ? urlForImage(article.cover)?.url()
    : undefined;
  const authors = article.authors?.filter((author) => Boolean(author?.name));
  const articleUrl = `${siteDefaults.baseUrl}/journal/${slug}`;
  const labelConfig = getJournalLabelConfig(article.label);

  return (
    <>
      <JsonLd
        data={{
          author: authors?.length
            ? authors.map((author) => ({
                "@type": "Person",
                name: author.name,
                url: author.slug?.current
                  ? `${siteDefaults.baseUrl}/designers/${author.slug.current}`
                  : undefined,
              }))
            : undefined,
          dateModified: article._updatedAt,
          datePublished: article.publishingDate?.date,
          description: article.excerpt,
          headline: article.title,
          image: imageUrl,
          mainEntityOfPage: {
            "@id": articleUrl,
            "@type": "WebPage",
          },
          publisher: {
            "@id": `${siteDefaults.baseUrl}#organization`,
          },
          url: articleUrl,
        }}
        type="Article"
      />

      <div className="flex flex-col pb-12">
        <EditorialPageHero
          badge={
            labelConfig ? (
              <DetailPageBadge
                label={labelConfig.label}
                type={labelConfig.badgeVariant}
              />
            ) : null
          }
          byline={authors?.map((author) => author.name).join(", ")}
          cover={article.cover}
          date={
            article.publishingDate?.date
              ? formatEventDate(article.publishingDate.date)
              : undefined
          }
          title={article.title}
        />

        <div className="py-16 lg:py-24">
          <JournalContent content={article.content} />
        </div>

        <div className="px-2.5">
          <ShareLinks title={article.title ?? ""} url={articleUrl} />
        </div>
      </div>
    </>
  );
}
