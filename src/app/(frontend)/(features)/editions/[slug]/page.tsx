import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { defineQuery } from "next-sanity";

import EditionInfo from "@/components/modules/edition/edition-info";
import ShareLinks from "@/components/modules/project/share-links";
import MediaBlocks, {
  type MediaBlockShape,
} from "@/components/modules/shared/media-blocks";
import { JsonLd } from "@/components/seo/json-ld";
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
import { EDITION_QUERY } from "@/sanity/lib/queries";

export async function generateStaticParams() {
  const editionSlugsQuery = defineQuery(
    `*[_type == "edition" && defined(slug.current)] | order(_updatedAt desc) [0...100]{"slug": slug.current}`
  );
  const { data } = await sanityFetchStaticParams({ query: editionSlugsQuery });
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
  const { data: edition } = await sanityFetchMetadata({
    params: { slug },
    perspective,
    query: EDITION_QUERY,
  });

  if (!edition) {
    return {};
  }

  return mapSanityToMetadata({
    baseUrl: siteDefaults.baseUrl,
    page: {
      coverImage: edition.cover ?? undefined,
      description: edition.description ?? undefined,
      seo: edition.seo as SeoModule | undefined,
      title: edition.title,
    },
    path: `/editions/${slug}`,
    siteDefaults,
  });
}

export default async function EditionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, { perspective, stega }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  return (
    <CachedEditionPage perspective={perspective} slug={slug} stega={stega} />
  );
}

async function CachedEditionPage({
  slug,
  perspective,
  stega,
}: { slug: string } & DynamicFetchOptions) {
  "use cache";
  const { data: edition } = await sanityFetch({
    params: { slug },
    perspective,
    query: EDITION_QUERY,
    stega,
  });

  if (!edition) {
    notFound();
  }

  const imageUrl = edition.cover?.image?.asset
    ? urlForImage(edition.cover)?.url()
    : undefined;

  const editionUrl = `${siteDefaults.baseUrl}/editions/${slug}`;
  const datePublished = edition.publishingDate?.date ?? undefined;
  const year = datePublished
    ? new Date(datePublished).getFullYear()
    : undefined;

  const authorEntities = (edition.authors ?? [])
    .filter((a) => a.name)
    .map((a) => ({ "@type": "Person" as const, name: a.name as string }));

  const offers = edition.buyUrl
    ? { "@type": "Offer" as const, url: edition.buyUrl }
    : undefined;

  return (
    <>
      <JsonLd
        data={{
          author: authorEntities.length > 0 ? authorEntities : undefined,
          datePublished,
          description: edition.description ?? undefined,
          image: imageUrl,
          name: edition.title,
          offers,
          url: editionUrl,
        }}
        type="Book"
      />
      <div className="flex flex-col pt-6 lg:flex-row">
        <EditionInfo
          authors={edition.authors}
          buyUrl={edition.buyUrl}
          description={edition.description}
          designers={edition.designers}
          supporters={edition.supporters}
          title={edition.title}
          year={year}
        />
        <div className="w-full lg:w-2/3">
          <MediaBlocks
            blocks={(edition.gallery ?? []) as readonly MediaBlockShape[]}
            rounded="xl"
            showCaptions={false}
          />
          <ShareLinks title={edition.title ?? ""} url={editionUrl} />
        </div>
      </div>
    </>
  );
}
