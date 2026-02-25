import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JournalArticleCta from "@/components/modules/journal/journal-article-cta";
import JournalContent from "@/components/modules/journal/journal-content";
import ShareLinks from "@/components/modules/project/share-links";
import SanityImage from "@/components/modules/shared/sanity-image";
import { JsonLd } from "@/components/seo/json-ld";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoModule } from "@/lib/types/seo";
import { urlForImage } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { JOURNAL_ARTICLE_QUERY } from "@/sanity/lib/queries";

const WHITESPACE_RE = /\s+/;

function estimateReadingTime(
  content: NonNullable<
    Awaited<
      ReturnType<typeof sanityFetch<typeof JOURNAL_ARTICLE_QUERY>>
    >["data"]
  >["content"]
): number {
  if (!content) {
    return 0;
  }
  const words = content.reduce(
    (count: number, block: (typeof content)[number]) => {
      if (block._type === "block" && block.children) {
        return (
          count +
          block.children.reduce(
            (acc: number, child: (typeof block.children)[number]) => {
              return acc + (child.text?.split(WHITESPACE_RE).length ?? 0);
            },
            0
          )
        );
      }
      return count;
    },
    0
  );
  return Math.max(1, Math.ceil(words / 200));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: article } = await sanityFetch({
    query: JOURNAL_ARTICLE_QUERY,
    params: { slug },
    stega: false,
  });

  if (!article) {
    return {};
  }

  return mapSanityToMetadata({
    page: {
      title: article.title,
      description: article.excerpt ?? undefined,
      coverImage: article.cover ?? undefined,
      seo: article.seo as SeoModule | undefined,
    },
    baseUrl: siteDefaults.baseUrl,
    path: `/journal/${slug}`,
    siteDefaults,
  });
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: article } = await sanityFetch({
    query: JOURNAL_ARTICLE_QUERY,
    params: { slug },
  });

  if (!article) {
    notFound();
  }

  const imageUrl = article.cover?.image
    ? urlForImage(article.cover.image)?.url()
    : undefined;

  const authors = article.authors
    ?.map((author: { name: string }) => author.name)
    .filter(Boolean);

  const readingTime = estimateReadingTime(article.content);
  const articleUrl = `${siteDefaults.baseUrl}/journal/${slug}`;

  return (
    <>
      <JsonLd
        data={{
          name: article.title,
          description: article.excerpt,
          author: authors?.length
            ? authors.map((name: string) => ({
                "@type": "Person",
                name,
              }))
            : undefined,
          image: imageUrl,
          url: articleUrl,
        }}
        type="Article"
      />

      <div className="flex flex-col">
        {/* Hero Section */}
        <div className="order-1 flex flex-col gap-6 px-2.5 pt-6 lg:flex-row lg:gap-10 lg:pt-16">
          {/* Title + Excerpt + Metadata */}
          <div className="flex flex-1 flex-col justify-between gap-8">
            <hgroup className="flex flex-col gap-2">
              <h1 className="text-2xl leading-tight lg:text-[2rem]">
                {article.title}
              </h1>
              {article.excerpt ? (
                <p className="text-base text-muted-foreground leading-tight lg:text-[2rem]">
                  {article.excerpt}
                </p>
              ) : null}
            </hgroup>

            {/* Desktop metadata */}
            <dl className="hidden flex-col gap-1 lg:flex">
              {article.publishingDate?.date ? (
                <div className="flex gap-x-8">
                  <dt className="w-28 shrink-0 font-mono text-muted-foreground text-sm uppercase">
                    Date
                  </dt>
                  <dd className="text-sm">{article.publishingDate.date}</dd>
                </div>
              ) : null}
              {readingTime > 0 ? (
                <div className="flex gap-x-8">
                  <dt className="w-28 shrink-0 font-mono text-muted-foreground text-sm uppercase">
                    Read Time
                  </dt>
                  <dd className="text-sm">{readingTime} min</dd>
                </div>
              ) : null}
              {authors?.length ? (
                <div className="flex gap-x-8">
                  <dt className="w-28 shrink-0 font-mono text-muted-foreground text-sm uppercase">
                    {authors.length > 1 ? "Authors" : "Author"}
                  </dt>
                  <dd className="text-sm">{authors.join(", ")}</dd>
                </div>
              ) : null}
              {article.tagSelector?.tags?.length ? (
                <div className="flex gap-x-8">
                  <dt className="w-28 shrink-0 font-mono text-muted-foreground text-sm uppercase">
                    Topics
                  </dt>
                  <dd>
                    <ul className="flex flex-col">
                      {article.tagSelector.tags.map(
                        (tag: { _id: string; name: string }) => (
                          <li className="text-sm underline" key={tag._id}>
                            {tag.name}
                          </li>
                        )
                      )}
                    </ul>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          {/* Cover image */}
          <div className="w-full lg:w-[49%] lg:shrink-0">
            <AspectRatio
              className="relative w-full overflow-hidden rounded-lg"
              ratio={4 / 3}
            >
              <SanityImage
                className="rounded-lg object-cover"
                fill
                priority
                source={article.cover}
              />
            </AspectRatio>
            {article.cover?.alt ? (
              <p className="mt-1.5 font-mono text-[0.5rem] text-muted-foreground uppercase">
                {article.cover.alt}
              </p>
            ) : null}
          </div>
        </div>

        {/* Mobile metadata */}
        <dl className="order-2 mt-6 flex flex-col gap-1 px-2.5 lg:hidden">
          {article.publishingDate?.date ? (
            <div className="flex gap-x-12">
              <dt className="w-[138px] shrink-0 font-mono text-muted-foreground text-sm uppercase">
                Date
              </dt>
              <dd className="text-sm">{article.publishingDate.date}</dd>
            </div>
          ) : null}
          {readingTime > 0 ? (
            <div className="flex gap-x-12">
              <dt className="w-[138px] shrink-0 font-mono text-muted-foreground text-sm uppercase">
                Read Time
              </dt>
              <dd className="text-sm">{readingTime} min</dd>
            </div>
          ) : null}
          {authors?.length ? (
            <div className="flex gap-x-12">
              <dt className="w-[138px] shrink-0 font-mono text-muted-foreground text-sm uppercase">
                {authors.length > 1 ? "Authors" : "Author"}
              </dt>
              <dd className="text-sm">{authors.join(", ")}</dd>
            </div>
          ) : null}
          {article.tagSelector?.tags?.length ? (
            <div className="flex gap-x-12">
              <dt className="w-[138px] shrink-0 font-mono text-muted-foreground text-sm uppercase">
                Topics
              </dt>
              <dd>
                <ul className="flex flex-col">
                  {article.tagSelector.tags.map(
                    (tag: { _id: string; name: string }) => (
                      <li className="text-sm underline" key={tag._id}>
                        {tag.name}
                      </li>
                    )
                  )}
                </ul>
              </dd>
            </div>
          ) : null}
        </dl>

        {/* Article Content */}
        <div className="order-3 py-10 lg:py-16">
          <JournalContent content={article.content} />
        </div>

        {/* Newsletter CTA */}
        <div className="order-4 px-2.5">
          <JournalArticleCta />
        </div>

        {/* Share Links */}
        <div className="order-5 px-2.5">
          <ShareLinks title={article.title ?? ""} url={articleUrl} />
        </div>
      </div>
    </>
  );
}
