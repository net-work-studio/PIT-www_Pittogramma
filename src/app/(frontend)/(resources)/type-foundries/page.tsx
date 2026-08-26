import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CtaCard from "@/components/cards/cta-card";
import ResourcesHeader from "@/components/navigation/resources-header";
import { TypeFoundriesContent } from "@/components/resources/type-foundries-content";
import {
  getEnabledResources,
  getFeatureAvailability,
} from "@/lib/feature-availability";
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
  SITE_SETTINGS_QUERY,
  TYPE_FOUNDRIES_PAGE_QUERY,
  TYPE_FOUNDRIES_QUERY,
} from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const { data: page } = await sanityFetchMetadata({
    perspective,
    query: TYPE_FOUNDRIES_PAGE_QUERY,
  });

  const defaults = RESOURCE_PAGE_DEFAULTS.typeFoundries;
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
  const { isEnabled: isDraftMode } = await draftMode();
  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicTypeFoundriesPage />
      </Suspense>
    );
  }
  return <CachedTypeFoundriesPage perspective="published" stega={false} />;
}

async function DynamicTypeFoundriesPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedTypeFoundriesPage perspective={perspective} stega={stega} />;
}

async function CachedTypeFoundriesPage({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const [{ data: foundries }, { data: settings }, { data: pageSettings }] =
    await Promise.all([
      sanityFetch({ perspective, query: TYPE_FOUNDRIES_QUERY, stega }),
      sanityFetch({ perspective, query: SITE_SETTINGS_QUERY, stega }),
      sanityFetch({ perspective, query: TYPE_FOUNDRIES_PAGE_QUERY, stega }),
    ]);

  const utmSettings = utmSettingsFromSiteSettings(settings);
  const availability = getFeatureAvailability(settings);
  const resourceAvailability = availability.resources["type-foundries"];
  if (!resourceAvailability.published) {
    notFound();
  }
  const defaults = RESOURCE_PAGE_DEFAULTS.typeFoundries;
  const cta = pageSettings?.endOfPageCta;

  return (
    <>
      <ResourcesHeader
        intro={pageSettings?.introText ?? defaults.introText}
        resources={getEnabledResources(availability)}
        title={defaults.title}
      />
      <TypeFoundriesContent
        enabledViews={resourceAvailability.enabledViews}
        foundries={foundries}
        searchEnabled={resourceAvailability.searchEnabled}
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
