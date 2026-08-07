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

// Reusable portrait projection for person headshots
export const PORTRAIT_FIELDS = /* groq */ `
  portrait {
    _type,
    image {
      _type,
      ${IMAGE_FIELDS}
    },
    alt,
    caption
  }
`;

// Reusable cover media fields fragment (image + optional video)
export const COVER_MEDIA_FIELDS = /* groq */ `
  type,
  image { ${IMAGE_FIELDS} },
  preserveAnimation,
  "videoUrl": video.asset->url,
  caption,
  alt
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

// Reusable media blocks projection (single, sideBySide, threeSideBySide, gridFour).
// `videoFileUrl` resolves the uploaded file asset URL; `videoUrl` is the embed URL on the schema.
export const MEDIA_BLOCKS_FIELDS = /* groq */ `
  _key,
  _type,
  _type == "singleMediaBlock" => {
    orientation,
    media {
      type,
      image { ${IMAGE_FIELDS} },
      "videoFileUrl": video.asset->url,
      videoUrl,
      caption,
      alt
    }
  },
  _type == "sideBySideMediaBlock" => {
    orientation,
    left {
      type,
      image { ${IMAGE_FIELDS} },
      "videoFileUrl": video.asset->url,
      videoUrl,
      caption,
      alt
    },
    right {
      type,
      image { ${IMAGE_FIELDS} },
      "videoFileUrl": video.asset->url,
      videoUrl,
      caption,
      alt
    }
  },
  _type == "threeSideBySideMediaBlock" => {
    orientation,
    left {
      type,
      image { ${IMAGE_FIELDS} },
      "videoFileUrl": video.asset->url,
      videoUrl,
      caption,
      alt
    },
    center {
      type,
      image { ${IMAGE_FIELDS} },
      "videoFileUrl": video.asset->url,
      videoUrl,
      caption,
      alt
    },
    right {
      type,
      image { ${IMAGE_FIELDS} },
      "videoFileUrl": video.asset->url,
      videoUrl,
      caption,
      alt
    }
  },
  _type == "gridFourMediaBlock" => {
    orientation,
    topLeft {
      type,
      image { ${IMAGE_FIELDS} },
      "videoFileUrl": video.asset->url,
      videoUrl,
      caption,
      alt
    },
    topRight {
      type,
      image { ${IMAGE_FIELDS} },
      "videoFileUrl": video.asset->url,
      videoUrl,
      caption,
      alt
    },
    bottomLeft {
      type,
      image { ${IMAGE_FIELDS} },
      "videoFileUrl": video.asset->url,
      videoUrl,
      caption,
      alt
    },
    bottomRight {
      type,
      image { ${IMAGE_FIELDS} },
      "videoFileUrl": video.asset->url,
      videoUrl,
      caption,
      alt
    }
  }
`;

export const JOURNAL_REFERENCE_BLOCK_FIELDS = /* groq */ `
  _type in ["referencesBlock", "referenceBlock", "references"] => {
    title,
    references[]{
      ...@->{
        _id,
        _type,
        name,
        title,
        slug,
        sourceUrl,
        year,
        description,
        authors[]{ ...@->{ _id, name }, _key },
        publisher->{ _id, name },
        category->{ _id, name }
      },
      _key
    }
  }
`;

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
