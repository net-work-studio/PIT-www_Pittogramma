import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Suspense } from "react";
import LegalPageContent from "@/components/modules/legal/legal-page-content";
import PageHeader from "@/components/shared/page-header";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoModule } from "@/lib/types/seo";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
} from "@/sanity/lib/live";
import { IMPRESSUM_PAGE_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const { data: page } = await sanityFetchMetadata({
    perspective,
    query: IMPRESSUM_PAGE_QUERY,
  });

  return mapSanityToMetadata({
    baseUrl: siteDefaults.baseUrl,
    page: {
      description: "Legal notice and publisher information for Pittogramma.",
      seo: page?.seo as SeoModule | undefined,
      title: page?.title ?? "Legal Notice / Impressum",
    },
    path: "/impressum",
    siteDefaults,
  });
}

export default async function ImpressumPage() {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicImpressumPage />
      </Suspense>
    );
  }

  return <CachedImpressumPage perspective="published" stega={false} />;
}

async function DynamicImpressumPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedImpressumPage perspective={perspective} stega={stega} />;
}

async function CachedImpressumPage({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const { data: page } = await sanityFetch({
    perspective,
    query: IMPRESSUM_PAGE_QUERY,
    stega,
  });

  return (
    <>
      <PageHeader title={page?.title ?? "Legal Notice / Impressum"} />
      <section className="mx-auto w-full max-w-prose pb-16">
        {page?.content?.length ? (
          <LegalPageContent content={page.content} />
        ) : (
          <p className="text-muted-foreground">
            The legal notice for Pittogramma is being prepared and will be
            published here soon.
          </p>
        )}
      </section>
    </>
  );
}
