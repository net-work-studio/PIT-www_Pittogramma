import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import LegalPageContent from "@/components/modules/legal/legal-page-content";
import PageHeader from "@/components/shared/page-header";
import { staticPageMetadata } from "@/lib/seo/static-page-metadata";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import { COOKIE_POLICY_PAGE_QUERY } from "@/sanity/lib/queries";

export const metadata: Metadata = staticPageMetadata(
  "/cookie-policy",
  "Cookie Policy",
  "How Pittogramma uses cookies and similar technologies."
);

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
