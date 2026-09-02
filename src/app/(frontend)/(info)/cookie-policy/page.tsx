import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
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
import { COOKIE_POLICY_PAGE_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const { data: page } = await sanityFetchMetadata({
    perspective,
    query: COOKIE_POLICY_PAGE_QUERY,
  });

  return mapSanityToMetadata({
    baseUrl: siteDefaults.baseUrl,
    page: {
      description: "How Pittogramma uses cookies and similar technologies.",
      seo: page?.seo as SeoModule | undefined,
      title: page?.title ?? "Cookie Policy",
    },
    path: "/cookie-policy",
    siteDefaults,
  });
}

export default async function CookiePolicyPage() {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicCookiePolicyPage />
      </Suspense>
    );
  }

  return <CachedCookiePolicyPage perspective="published" stega={false} />;
}

async function DynamicCookiePolicyPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedCookiePolicyPage perspective={perspective} stega={stega} />;
}

async function CachedCookiePolicyPage({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const { data: page } = await sanityFetch({
    perspective,
    query: COOKIE_POLICY_PAGE_QUERY,
    stega,
  });

  if (!page?.content?.length) {
    notFound();
  }

  return (
    <>
      <PageHeader title={page.title ?? "Cookie Policy"} />
      <section className="mx-auto w-full max-w-prose pb-16">
        <LegalPageContent content={page.content} />
      </section>
    </>
  );
}
