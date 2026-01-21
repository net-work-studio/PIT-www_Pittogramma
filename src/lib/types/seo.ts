export interface SeoModule {
  metaTitle?: string;
  metaDescription?: string;
  metaRobots?: string;
  canonicalURL?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: any;
    url?: string;
  };
  xCard?: {
    cardType?: string;
    title?: string;
    description?: string;
    image?: any;
  };
  metaImage?: any;
}

export interface PageWithSeo {
  title: string;
  description?: string;
  coverImage?: any;
  seo?: SeoModule;
}
