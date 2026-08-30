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
import { SUBMISSION_TERMS_PAGE_QUERY } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Project Submission Terms",
};

export default async function SubmissionTermsPage() {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicSubmissionTermsPage />
      </Suspense>
    );
  }

  return <CachedSubmissionTermsPage perspective="published" stega={false} />;
}

async function DynamicSubmissionTermsPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedSubmissionTermsPage perspective={perspective} stega={stega} />;
}

async function CachedSubmissionTermsPage({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const { data: page } = await sanityFetch({
    perspective,
    query: SUBMISSION_TERMS_PAGE_QUERY,
    stega,
  });

  if (!page?.content?.length) {
    return null;
  }

  return (
    <>
      <PageHeader title={page.title ?? "Project Submission Terms"} />
      <section className="mx-auto w-full max-w-prose pb-16">
        <LegalPageContent content={page.content} />
      </section>
    </>
  );
}
