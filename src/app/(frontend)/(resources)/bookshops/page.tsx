import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import CtaCard from "@/components/cards/cta-card";
import ResourcesHeader from "@/components/navigation/resources-header";
import { BookshopsContent } from "@/components/resources/bookshops-content";
import {
  getEnabledViews,
  isResourceEnabled,
  isSearchEnabled,
} from "@/lib/feature-flags";
import { RESOURCE_PAGE_DEFAULTS } from "@/lib/resource-page";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import { utmSettingsFromSiteSettings } from "@/lib/tracked-link";
import type { SeoModule } from "@/lib/types/seo";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
} from "@/sanity/lib/live";
import {
  BOOKSHOPS_PAGE_QUERY,
  BOOKSHOPS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const { data: page } = await sanityFetchMetadata({
    perspective,
    query: BOOKSHOPS_PAGE_QUERY,
  });

  const defaults = RESOURCE_PAGE_DEFAULTS.bookshops;
  return mapSanityToMetadata({
    baseUrl: siteDefaults.baseUrl,
    page: {
      description: page?.introText ?? defaults.introText,
      seo: page?.seo as SeoModule | undefined,
      title: page?.title ?? defaults.title,
    },
    path: defaults.route,
    siteDefaults,
  });
}

export default async function Page() {
  if (!isResourceEnabled("bookshops")) {
    redirect("/");
  }
  const { isEnabled: isDraftMode } = await draftMode();
  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicBookshopsPage />
      </Suspense>
    );
  }
  return <CachedBookshopsPage perspective="published" stega={false} />;
}

async function DynamicBookshopsPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedBookshopsPage perspective={perspective} stega={stega} />;
}

async function CachedBookshopsPage({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const [{ data: bookshops }, { data: settings }, { data: pageSettings }] =
    await Promise.all([
      sanityFetch({ perspective, query: BOOKSHOPS_QUERY, stega }),
      sanityFetch({ perspective, query: SITE_SETTINGS_QUERY, stega }),
      sanityFetch({ perspective, query: BOOKSHOPS_PAGE_QUERY, stega }),
    ]);

  const utmSettings = utmSettingsFromSiteSettings(settings);
  const defaults = RESOURCE_PAGE_DEFAULTS.bookshops;
  const cta = pageSettings?.endOfPageCta;

  return (
    <>
      <ResourcesHeader
        intro={pageSettings?.introText ?? defaults.introText}
        title={defaults.title}
      />
      <BookshopsContent
        bookshops={bookshops}
        enabledViews={getEnabledViews("bookshops")}
        searchEnabled={isSearchEnabled("bookshops")}
        utmSettings={utmSettings}
      />
      {cta ? (
        <div className="pt-10 pb-10">
          <CtaCard
            buttonText={cta.buttonText}
            externalUrl={cta.externalUrl}
            headline={cta.headline}
            image={cta.image}
            internalLink={cta.internalLink}
            linkType={cta.linkType}
            variant={cta.variant}
          />
        </div>
      ) : null}
    </>
  );
}
