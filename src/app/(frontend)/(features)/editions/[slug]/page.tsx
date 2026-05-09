import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
import { sanityFetch } from "@/sanity/lib/live";
import { EDITION_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: edition } = await sanityFetch({
    query: EDITION_QUERY,
    params: { slug },
    stega: false,
  });

  if (!edition) {
    return {};
  }

  return mapSanityToMetadata({
    page: {
      title: edition.title,
      description: edition.description ?? undefined,
      coverImage: edition.cover ?? undefined,
      seo: edition.seo as SeoModule | undefined,
    },
    baseUrl: siteDefaults.baseUrl,
    path: `/editions/${slug}`,
    siteDefaults,
  });
}

export default async function EditionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: edition } = await sanityFetch({
    query: EDITION_QUERY,
    params: { slug },
  });

  if (!edition) {
    notFound();
  }

  const imageUrl = edition.cover?.image
    ? urlForImage(edition.cover.image)?.url()
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
          name: edition.title,
          author: authorEntities.length > 0 ? authorEntities : undefined,
          datePublished,
          image: imageUrl,
          description: edition.description ?? undefined,
          url: editionUrl,
          offers,
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
            blocks={
              (edition.gallery ?? []) as ReadonlyArray<MediaBlockShape>
            }
            rounded={{ single: "3xl", multi: "xl" }}
            showCaptions={false}
          />
          <ShareLinks title={edition.title ?? ""} url={editionUrl} />
        </div>
      </div>
    </>
  );
}
