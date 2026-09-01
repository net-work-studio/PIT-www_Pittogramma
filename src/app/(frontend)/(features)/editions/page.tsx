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
    perspective,
    query: EDITIONS_PAGE_QUERY,
  });

  return mapSanityToMetadata({
    baseUrl: siteDefaults.baseUrl,
    page: {
      seo: page?.seo as SeoModule | undefined,
      title: page?.title ?? "Editions",
    },
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
    sanityFetch({ perspective, query: EDITIONS_LIST_QUERY, stega }),
    sanityFetch({ perspective, query: EDITIONS_PAGE_QUERY, stega }),
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
