// Reusable image fields fragment with LQIP for blur placeholders
export const IMAGE_FIELDS = /* groq */ `
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
`;

// Reusable CTA projection (inner fields only, no field name)
export const CTA_PROJECTION = `{
    _id,
    title,
    variant,
    headline,
    image {
      _type,
      image { ${IMAGE_FIELDS} },
      alt,
      caption
    },
    buttonText,
    linkType,
    internalLink->{
      _type,
      "slug": slug
    },
    externalUrl
  }`;

// Reusable CTA fields fragment - dereferences the CTA and its internal link
export const CTA_FIELDS = `endOfPageCta->${CTA_PROJECTION}`;

// Reusable SEO fields fragment
export const SEO_FIELDS = `
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
        ${IMAGE_FIELDS}
      },
      alt,
      caption
    }
  }
`;
