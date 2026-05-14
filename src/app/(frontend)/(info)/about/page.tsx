import type { Metadata } from "next";

import AboutContent from "@/components/modules/about/about-content";
import AboutSupporters from "@/components/modules/about/about-supporters";
import { JsonLd } from "@/components/seo/json-ld";
import { mapSanityToMetadata } from "@/lib/seo/map-sanity-to-metadata";
import { siteDefaults } from "@/lib/seo/site-defaults";
import type { SeoModule } from "@/lib/types/seo";
import { sanityFetch } from "@/sanity/lib/live";
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
  const { data: about } = await sanityFetch({
    query: ABOUT_PAGE_QUERY,
    stega: false,
  });

  if (!about) {
    return {};
  }

  return mapSanityToMetadata({
    page: {
      title: about.title ?? "About",
      description:
        deriveDescriptionFromContent(about.content) ?? siteDefaults.description,
      seo: about.seo as SeoModule | undefined,
    },
    baseUrl: siteDefaults.baseUrl,
    path: "/about",
    siteDefaults,
  });
}

export default async function AboutPage() {
  const { data: about } = await sanityFetch({ query: ABOUT_PAGE_QUERY });

  if (!about) {
    return null;
  }

  const aboutUrl = `${siteDefaults.baseUrl}/about`;
  const description =
    deriveDescriptionFromContent(about.content) ?? siteDefaults.description;

  return (
    <>
      <JsonLd
        data={{
          name: about.title ?? "About",
          description,
          url: aboutUrl,
        }}
        type="AboutPage"
      />
      <div className="mx-auto w-full max-w-[1100px] pt-6 lg:pt-16">
        <AboutContent content={about.content} />
        <AboutSupporters supporters={about.supporters} />
      </div>
    </>
  );
}
