import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Suspense } from "react";
import CtaCard from "@/components/cards/cta-card";
import DesignerList from "@/components/modules/designer/designer-list";
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
import { DESIGNERS_PAGE_QUERY, DESIGNERS_QUERY } from "@/sanity/lib/queries";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const { data: page } = await sanityFetchMetadata({
    perspective,
    query: DESIGNERS_PAGE_QUERY,
  });

  return mapSanityToMetadata({
    baseUrl: siteDefaults.baseUrl,
    page: {
      description: page?.introText,
      seo: page?.seo as SeoModule | undefined,
      title: page?.title ?? "Designers",
    },
    path: "/designers",
    siteDefaults,
  });
}

export default async function DesignersPage() {
  const { isEnabled: isDraftMode } = await draftMode();
  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicDesignersPage />
      </Suspense>
    );
  }
  return <CachedDesignersPage perspective="published" stega={false} />;
}

async function DynamicDesignersPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedDesignersPage perspective={perspective} stega={stega} />;
}

async function CachedDesignersPage({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const [{ data: designers }, { data: pageSettings }] = await Promise.all([
    sanityFetch({ perspective, query: DESIGNERS_QUERY, stega }),
    sanityFetch({ perspective, query: DESIGNERS_PAGE_QUERY, stega }),
  ]);

  const cta = pageSettings?.endOfPageCta;

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-7.5">
        <PageHeader
          className="pb-0"
          subtitle={pageSettings?.introText}
          title={pageSettings?.title ?? "Designers"}
        />
      </div>
      <div className="space-y-5 pt-30">
        <Suspense fallback={<div className="h-96" />}>
          <DesignerList designers={designers} />
        </Suspense>
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
      </div>
    </>
  );
}
