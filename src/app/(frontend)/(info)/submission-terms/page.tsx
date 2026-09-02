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
import { SUBMISSION_TERMS_PAGE_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const { data: page } = await sanityFetchMetadata({
    perspective,
    query: SUBMISSION_TERMS_PAGE_QUERY,
  });

  return mapSanityToMetadata({
    baseUrl: siteDefaults.baseUrl,
    page: {
      description: "Terms that apply when submitting a project to Pittogramma.",
      seo: page?.seo as SeoModule | undefined,
      title: page?.title ?? "Project Submission Terms",
    },
    path: "/submission-terms",
    siteDefaults,
  });
}

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
    notFound();
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
