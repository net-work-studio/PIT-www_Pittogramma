import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Suspense } from "react";
import LegalPageContent from "@/components/modules/legal/legal-page-content";
import PageHeader from "@/components/shared/page-header";
import { staticPageMetadata } from "@/lib/seo/static-page-metadata";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import { IMPRESSUM_PAGE_QUERY } from "@/sanity/lib/queries";

export const metadata: Metadata = staticPageMetadata(
  "/impressum",
  "Legal Notice / Impressum",
  "Legal notice and publisher information for Pittogramma."
);

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
