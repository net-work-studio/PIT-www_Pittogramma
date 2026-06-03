import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Suspense } from "react";

import BaseCard from "@/components/cards/base-card";
import CtaCard from "@/components/cards/cta-card";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoModule } from "@/lib/types/seo";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
} from "@/sanity/lib/live";
import { EDITIONS_LIST_QUERY, EDITIONS_PAGE_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const { data: page } = await sanityFetchMetadata({
    query: EDITIONS_PAGE_QUERY,
    perspective,
  });

  return mapSanityToMetadata({
    page: {
      title: page?.title ?? "Editions",
      seo: page?.seo as SeoModule | undefined,
    },
    baseUrl: siteDefaults.baseUrl,
    path: "/editions",
    siteDefaults,
  });
}

export default async function EditionsPage() {
  const { isEnabled: isDraftMode } = await draftMode();
  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicEditionsPage />
      </Suspense>
    );
  }
  return <CachedEditionsPage perspective="published" stega={false} />;
}

async function DynamicEditionsPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedEditionsPage perspective={perspective} stega={stega} />;
}

async function CachedEditionsPage({ perspective, stega }: DynamicFetchOptions) {
  "use cache";
  const [{ data: editions }, { data: pageSettings }] = await Promise.all([
    sanityFetch({ query: EDITIONS_LIST_QUERY, perspective, stega }),
    sanityFetch({ query: EDITIONS_PAGE_QUERY, perspective, stega }),
  ]);

  const items = editions ?? [];
  const cta = pageSettings?.endOfPageCta;

  return (
    <>
      <div className="space-y-10 pt-6 pb-10">
        {items.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            No editions yet
          </p>
        ) : (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {items.map((edition) => (
              <BaseCard
                href={`/editions/${edition.slug.current}`}
                image={edition.cover}
                key={edition._id}
                title={edition.title ?? ""}
              />
            ))}
          </section>
        )}
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
