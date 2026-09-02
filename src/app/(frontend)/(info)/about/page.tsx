import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import AboutContent from "@/components/modules/about/about-content";
import AboutSupporters from "@/components/modules/about/about-supporters";
import { JsonLd } from "@/components/seo/json-ld";
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
import { ABOUT_PAGE_QUERY } from "@/sanity/lib/queries";
import type { ABOUT_PAGE_QUERY_RESULT } from "@/sanity/types";

const DESCRIPTION_FALLBACK_LIMIT = 160;

type AboutContentValue = NonNullable<ABOUT_PAGE_QUERY_RESULT>["content"];

function deriveDescriptionFromContent(
  content: AboutContentValue
): string | undefined {
  if (!content) {
    return;
  }
  for (const item of content) {
    if (item._type === "block") {
      const block = item as {
        children?: Array<{ text?: string | null }> | null;
      };
      const text = block.children?.map((child) => child.text ?? "").join(" ");
      if (text?.trim()) {
        return text.trim().slice(0, DESCRIPTION_FALLBACK_LIMIT);
      }
    }
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const { data: about } = await sanityFetchMetadata({
    perspective,
    query: ABOUT_PAGE_QUERY,
  });

  if (!about) {
    return {};
  }

  return mapSanityToMetadata({
    baseUrl: siteDefaults.baseUrl,
    page: {
      description:
        deriveDescriptionFromContent(about.content) ?? siteDefaults.description,
      seo: about.seo as SeoModule | undefined,
      title: about.title ?? "About",
    },
    path: "/about",
    siteDefaults,
  });
}

export default async function AboutPage() {
  const { isEnabled: isDraftMode } = await draftMode();
  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicAboutPage />
      </Suspense>
    );
  }
  return <CachedAboutPage perspective="published" stega={false} />;
}

async function DynamicAboutPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedAboutPage perspective={perspective} stega={stega} />;
}

async function CachedAboutPage({ perspective, stega }: DynamicFetchOptions) {
  "use cache";
  const { data: about } = await sanityFetch({
    perspective,
    query: ABOUT_PAGE_QUERY,
    stega,
  });

  if (!about) {
    notFound();
  }

  const aboutUrl = `${siteDefaults.baseUrl}/about`;
  const description =
    deriveDescriptionFromContent(about.content) ?? siteDefaults.description;

  return (
    <>
      <JsonLd
        data={{
          description,
          name: about.title ?? "About",
          url: aboutUrl,
        }}
        type="AboutPage"
      />
      <PageHeader title={about.title ?? "About"} />
      <div className="mx-auto w-full max-w-[1100px]">
        <AboutContent content={about.content} />
        <AboutSupporters supporters={about.supporters} />
      </div>
    </>
  );
}
