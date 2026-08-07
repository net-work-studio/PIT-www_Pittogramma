import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Suspense } from "react";

import ResourcesNavigation from "@/components/navigation/resources-navigation";
import { BibliographyContent } from "@/components/resources/bibliography-content";
import PageHeader from "@/components/shared/page-header";
import { getEnabledResources } from "@/lib/feature-flags";
import { utmSettingsFromSiteSettings } from "@/lib/tracked-link";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import { BIBLIOGRAPHY_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  description: "A constantly updated list of books on graphic design",
  title: "Bibliography",
};

export default async function Page() {
  const { isEnabled: isDraftMode } = await draftMode();
  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicBibliographyPage />
      </Suspense>
    );
  }
  return <CachedBibliographyPage perspective="published" stega={false} />;
}

async function DynamicBibliographyPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedBibliographyPage perspective={perspective} stega={stega} />;
}

async function CachedBibliographyPage({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const [{ data: books }, { data: settings }] = await Promise.all([
    sanityFetch({ perspective, query: BIBLIOGRAPHY_QUERY, stega }),
    sanityFetch({ perspective, query: SITE_SETTINGS_QUERY, stega }),
  ]);

  const utmSettings = utmSettingsFromSiteSettings(settings);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-7.5">
        <PageHeader
          className="pb-0"
          subtitle="A constantly updated list of books on graphic design"
          title="Resources"
        />
        <ResourcesNavigation resources={getEnabledResources()} />
      </div>
      <BibliographyContent books={books} utmSettings={utmSettings} />
    </>
  );
}
