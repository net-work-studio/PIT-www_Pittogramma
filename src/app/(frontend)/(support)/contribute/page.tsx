import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Suspense } from "react";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { staticPageMetadata } from "@/lib/seo/static-page-metadata";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export const metadata: Metadata = staticPageMetadata(
  "/contribute",
  "Contribute to the index",
  "Suggest a studio, type foundry, or bibliography entry for Pittogramma’s graphic design index."
);

const contributionForms = [
  { key: "studioAgencyContributionUrl", title: "Studio / Agency" },
  { key: "typeFoundriesContributionUrl", title: "Type Foundries" },
  { key: "bibliographyContributionUrl", title: "Bibliography" },
] as const;

export default async function Page() {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicContributePage />
      </Suspense>
    );
  }

  return <CachedContributePage perspective="published" stega={false} />;
}

async function DynamicContributePage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedContributePage perspective={perspective} stega={stega} />;
}

async function CachedContributePage({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const { data: settings } = await sanityFetch({
    perspective,
    query: SITE_SETTINGS_QUERY,
    stega,
  });
  const forms = contributionForms.flatMap(({ key, title }) => {
    const url = settings?.[key];
    return url ? [{ title, url }] : [];
  });

  return (
    <>
      <PageHeader title="Contribute to the index" />
      <section className="mx-auto w-full max-w-275 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {forms.map(({ title, url }) => (
            <article
              className="flex min-h-fit flex-col justify-between gap-4 rounded-lg bg-secondary p-5"
              key={title}
            >
              <h2 className="text-center text-2xl">{title}</h2>
              <Button
                nativeButton={false}
                render={
                  <a href={url} rel="noopener noreferrer" target="_blank" />
                }
                variant="outline"
              >
                Open form
              </Button>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
