import type { SeoModule } from "@/lib/types/seo";

export function mergeSeoModules(
  defaultSeo?: SeoModule,
  pageSeo?: SeoModule
): SeoModule | undefined {
  if (!defaultSeo) {
    return pageSeo;
  }

  if (!pageSeo) {
    return defaultSeo;
  }

  return {
    canonicalURL: pageSeo.canonicalURL ?? defaultSeo.canonicalURL,
    metaDescription: pageSeo.metaDescription ?? defaultSeo.metaDescription,
    metaImage: pageSeo.metaImage ?? defaultSeo.metaImage,
    metaRobots: pageSeo.metaRobots ?? defaultSeo.metaRobots,
    metaTitle: pageSeo.metaTitle ?? defaultSeo.metaTitle,
    openGraph: {
      description:
        pageSeo.openGraph?.description ?? defaultSeo.openGraph?.description,
      title: pageSeo.openGraph?.title ?? defaultSeo.openGraph?.title,
      url: pageSeo.openGraph?.url ?? defaultSeo.openGraph?.url,
    },
    xCard: {
      description: pageSeo.xCard?.description ?? defaultSeo.xCard?.description,
      title: pageSeo.xCard?.title ?? defaultSeo.xCard?.title,
    },
  };
}
