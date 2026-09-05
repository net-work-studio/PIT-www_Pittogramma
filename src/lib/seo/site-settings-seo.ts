import type { SeoModule } from "@/lib/types/seo";
import {
  getDynamicFetchOptions,
  sanityFetchMetadata,
} from "@/sanity/lib/live";

const SITE_SETTINGS_SEO_QUERY = `
  *[_type == "siteSettings"][0] {
    seo {
      metaTitle,
      metaDescription,
      metaRobots,
      canonicalURL,
      openGraph {
        title,
        description,
        url
      },
      xCard {
        title,
        description
      },
      metaImage {
        _type,
        image {
          _type,
          asset->{
            _id,
            url,
            metadata {
              lqip,
              dimensions { width, height }
            }
          },
          hotspot,
          crop
        },
        alt,
        caption
      }
    }
  }
`;

export async function getSiteSettingsSeo(): Promise<SeoModule | undefined> {
  const { perspective } = await getDynamicFetchOptions();
  const { data } = await sanityFetchMetadata({
    perspective,
    query: SITE_SETTINGS_SEO_QUERY,
  });

  return (data as { seo?: SeoModule } | null)?.seo;
}
