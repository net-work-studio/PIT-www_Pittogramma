import { defineQuery } from "next-sanity";

// Reusable CTA fields fragment - dereferences the CTA and its internal link
const CTA_FIELDS = `
  endOfPageCta->{
    _id,
    title,
    variant,
    headline,
    image,
    buttonText,
    linkType,
    internalLink->{
      _type,
      "slug": slug
    },
    externalUrl
  }
`;

// Reusable SEO fields fragment
const SEO_FIELDS = `
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
        asset,
        hotspot,
        crop
      },
      alt,
      caption
    }
  }
`;

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    homeIntro,
    projectsIntro,
    interviewsIntro,
    designersIntro,
    utmSource,
    utmMedium,
    utmCampaign
  }
`);

// ==================== PAGE QUERIES ====================

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage"][0] {
    _id,
    title,
    introText,
    ${CTA_FIELDS},
    ${SEO_FIELDS}
  }
`);

export const PROJECTS_PAGE_QUERY = defineQuery(`
  *[_type == "projectsPage"][0] {
    _id,
    title,
    introText,
    ${CTA_FIELDS},
    ${SEO_FIELDS}
  }
`);

export const INTERVIEWS_PAGE_QUERY = defineQuery(`
  *[_type == "interviewsPage"][0] {
    _id,
    title,
    introText,
    ${CTA_FIELDS},
    ${SEO_FIELDS}
  }
`);

export const DESIGNERS_PAGE_QUERY = defineQuery(`
  *[_type == "designersPage"][0] {
    _id,
    title,
    introText,
    ${CTA_FIELDS},
    ${SEO_FIELDS}
  }
`);

export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project"] | order(_createdAt desc) {
    _id,
    cover {
      image {
        asset,
        alt,
        hotspot,
        crop
      }
    },
    title,
    slug,
    designer->{
      _id,
      name,
      slug,
      portrait
    },
    tags[]{ _key, ...@->{ _id, name, slug } },
    ${SEO_FIELDS}
  }
`);

export const PROJECT_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    cover {
      _type,
      image {
        _type,
        asset,
        hotspot,
        crop
      },
      alt
    },
    title,
    slug,
    designer->{
      _id,
      name,
      slug,
      portrait
    },
    tags[]{ _key, ...@->{ _id, name, slug } },
    teacher->{
      _id,
      name,
    },
    institute->{
      _id,
      name,
    },
    year,
    gallery,
    description,
    ${SEO_FIELDS}
  }
`);

export const INTERVIEWS_QUERY = defineQuery(`
  *[_type == "interview"] | order(publishingDate.date desc) {
    _id,
    title,
    slug,
    publishingDate,
    cover {
      image {
        asset,
        alt,
        hotspot,
        crop
      }
    },
    interviewTo[]{ _key, ...@->{ _id, name } },
    introText,
    ${SEO_FIELDS}
  }
`);

export const INTERVIEW_QUERY = defineQuery(`
  *[_type == "interview" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishingDate,
    cover {
      _type,
      image {
        _type,
        asset,
        hotspot,
        crop
      },
      alt
    },
    interviewTo[]{ _key, ...@->{ _id, name, portrait } },
    introText,
    interview,
    ${SEO_FIELDS}
  }
`);

// ==================== RESOURCE QUERIES ====================

export const BIBLIOGRAPHY_QUERY = defineQuery(`
  *[_type == "bibliography"] | order(name asc) {
    _id,
    name,
    year,
    cover {
      image { asset, hotspot, crop },
      alt
    },
    languages[]{ _key, ...@->{ _id, name } },
    authors[]{ _key, ...@->{ _id, name } },
    publisher->{
      _id,
      name
    },
    tagSelector {
      tags[]->{
        _id,
        name
      }
    },
    affiliateLink,
    isbn,
    description,
    pageCount,
    categories
  }
`);

export const BOOKSHOPS_QUERY = defineQuery(`
  *[_type == "bookshop"] | order(name asc) {
    _id,
    name,
    tagSelector {
      tags[]->{
        _id,
        name
      }
    },
    location {
      country->{
        _id,
        name
      },
      city->{
        _id,
        name
      }
    },
    address,
    socialLinks {
      links[] {
        _key,
        platform,
        url
      }
    }
  }
`);

export const GLOSSARY_QUERY = defineQuery(`
  *[_type == "glossary"] | order(name asc) {
    _id,
    name,
    description,
    image {
      image { asset, hotspot, crop },
      alt
    }
  }
`);

export const INSTITUTES_QUERY = defineQuery(`
  *[_type == "institute"] | order(name asc) {
    _id,
    name,
    yearFoundation,
    languages[]->{
      _id,
      name
    },
    location {
      country->{
        _id,
        name
      },
      city->{
        _id,
        name
      }
    },
    address,
    socialLinks {
      links[] {
        _key,
        platform,
        url
      }
    }
  }
`);

export const STUDIOS_QUERY = defineQuery(`
  *[_type == "studio"] | order(name asc) {
    _id,
    name,
    category->{
      _id,
      name
    },
    tagSelector {
      tags[]->{
        _id,
        name
      }
    },
    locations[] {
      _key,
      country->{
        _id,
        name
      },
      city->{
        _id,
        name
      }
    },
    socialLinks {
      links[] {
        _key,
        platform,
        url
      }
    }
  }
`);

export const TYPE_FOUNDRIES_QUERY = defineQuery(`
  *[_type == "typeFoundry"] | order(name asc) {
    _id,
    name,
    tagSelector {
      tags[]->{
        _id,
        name
      }
    },
    location {
      country->{
        _id,
        name
      },
      city->{
        _id,
        name
      }
    },
    socialLinks {
      links[] {
        _key,
        platform,
        url
      }
    }
  }
`);

export const WEB_SOURCES_QUERY = defineQuery(`
  *[_type == "webSource"] | order(name asc) {
    _id,
    name,
    description,
    cover {
      image { asset, hotspot, crop },
      alt
    },
    category->{
      _id,
      name
    },
    tagSelector {
      tags[]{ _key, ...@->{ _id, name } }
    },
    sourceUrl,
    ogTitle,
    ogDescription,
    ogSiteName,
    ogImageUrl
  }
`);
