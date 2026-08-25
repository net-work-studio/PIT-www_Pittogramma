import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Suspense } from "react";
import LegalPageContent from "@/components/modules/legal/legal-page-content";
import PageHeader from "@/components/shared/page-header";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import { PRIVACY_POLICY_PAGE_QUERY } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default async function PrivacyPolicyPage() {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicPrivacyPolicyPage />
      </Suspense>
    );
  }

  return <CachedPrivacyPolicyPage perspective="published" stega={false} />;
}

async function DynamicPrivacyPolicyPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedPrivacyPolicyPage perspective={perspective} stega={stega} />;
}

async function CachedPrivacyPolicyPage({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const { data: page } = await sanityFetch({
    perspective,
    query: PRIVACY_POLICY_PAGE_QUERY,
    stega,
  });

  return (
    <>
      <PageHeader title={page?.title ?? "Privacy Policy"} />
      <section className="mx-auto w-full max-w-prose pb-16">
        {page?.content?.length ? (
          <LegalPageContent content={page.content} />
        ) : (
          <p className="text-muted-foreground">
            Pittogramma&apos;s privacy policy is being prepared and will be
            published here soon.
          </p>
        )}
      </section>
    </>
  );
}
