import { defineQuery } from "next-sanity";

// Reusable image fields fragment with LQIP for blur placeholders
const IMAGE_FIELDS = /* groq */ `
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

// Reusable CTA fields fragment - dereferences the CTA and its internal link
const CTA_FIELDS = `
  endOfPageCta->{
    _id,
    title,
    variant,
    headline,
    image {
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
        ${IMAGE_FIELDS}
      },
      alt,
      caption
    }
  }
`;

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    utmSource,
    utmMedium,
    utmCampaign,
    substackUrl,
    instagramUrl,
    spotifyUrl
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

export const EVENTS_PAGE_QUERY = defineQuery(`
  *[_type == "eventsPage"][0] {
    _id,
    title,
    introText,
    ${CTA_FIELDS},
    ${SEO_FIELDS}
  }
`);

export const DESIGNERS_QUERY = defineQuery(`
  *[_type == "designer"] | order(name asc) {
    _id,
    name,
    slug,
    portrait {
      image { ${IMAGE_FIELDS} },
      alt
    },
    birthYear,
    bio,
    place->{ _id, name, city, country, countryCode, lat, lng }
  }
`);

export const DESIGNER_QUERY = defineQuery(`
  *[_type == "designer" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    portrait {
      _type,
      image {
        _type,
        ${IMAGE_FIELDS}
      },
      alt,
      caption
    },
    birthYear,
    bio,
    education[] {
      _key,
      institute->{ _id, name },
      degree,
      courseName,
      year
    },
    place->{ _id, name, city, country, countryCode, lat, lng },
    socialLinks {
      links[] {
        _key,
        platform,
        url
      }
    },
    "relatedProjects": *[_type == "project" && references(^._id)] | order(_createdAt desc) [0...4] {
      _id,
      cover { image { ${IMAGE_FIELDS} }, alt },
      title,
      slug,
      designers[]{ ...@->{ _id, name }, _key }
    },
    "relatedInterviews": *[_type == "interview" && references(^._id)] | order(publishingDate.date desc) [0...4] {
      _id,
      title,
      slug,
      cover { image { ${IMAGE_FIELDS} }, alt },
      designersAndProfessionals[]{ ...@->{ _id, name }, _key }
    }
  }
`);

export const EVENTS_QUERY = defineQuery(`
  *[_type == "event"] | order(dateStart desc) {
    _id,
    title,
    slug,
    type,
    cover {
      image { ${IMAGE_FIELDS} },
      alt
    },
    dateStart,
    dateEnd,
    locationName,
    description,
    sponsor->{ _id, name },
    partner->{ _id, name },
    tags[]->{ _id, name },
    ${SEO_FIELDS}
  }
`);

export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project"] | order(_createdAt desc) {
    _id,
    cover {
      image { ${IMAGE_FIELDS} },
      alt
    },
    title,
    slug,
    designers[]{ ...@->{ _id, name, slug, portrait }, _key },
    tags[]->{
      _id,
      name
    },
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
        ${IMAGE_FIELDS}
      },
      alt
    },
    title,
    slug,
    designers[]{ ...@->{ _id, name, slug, portrait }, _key },
    tags[]->{
      _id,
      name
    },
    teachers[]{ ...@->{ _id, name }, _key },
    institute->{
      _id,
      name,
    },
    year,
    gallery[] {
      _key,
      _type,
      _type == "singleMediaBlock" => {
        orientation,
        media { type, image { ${IMAGE_FIELDS} }, caption, alt }
      },
      _type == "sideBySideMediaBlock" => {
        orientation,
        left { type, image { ${IMAGE_FIELDS} }, caption, alt },
        right { type, image { ${IMAGE_FIELDS} }, caption, alt }
      },
      _type == "threeSideBySideMediaBlock" => {
        orientation,
        left { type, image { ${IMAGE_FIELDS} }, caption, alt },
        center { type, image { ${IMAGE_FIELDS} }, caption, alt },
        right { type, image { ${IMAGE_FIELDS} }, caption, alt }
      },
      _type == "gridFourMediaBlock" => {
        orientation,
        topLeft { type, image { ${IMAGE_FIELDS} }, caption, alt },
        topRight { type, image { ${IMAGE_FIELDS} }, caption, alt },
        bottomLeft { type, image { ${IMAGE_FIELDS} }, caption, alt },
        bottomRight { type, image { ${IMAGE_FIELDS} }, caption, alt }
      }
    },
    description,
    "relatedProjects": *[
      _type == "project" &&
      slug.current != ^.slug.current &&
      count(tags[@._ref in ^.tags[]._ref]) > 0
    ] | order(_createdAt desc) [0...4] {
      _id,
      cover { image { ${IMAGE_FIELDS} }, alt },
      title,
      slug,
      designers[]{ ...@->{ _id, name }, _key }
    },
    ${SEO_FIELDS}
  }
`);

export const JOURNAL_PAGE_QUERY = defineQuery(`
  *[_type == "journalPage"][0] {
    _id,
    title,
    introText,
    featuredArticle->{
      _id,
      title,
      slug,
      publishingDate,
      excerpt,
      cover { image { ${IMAGE_FIELDS} }, alt },
      authors[]{ ...@->{ _id, name }, _key },
      tags[]->{ _id, name }
    },
    ${CTA_FIELDS},
    ${SEO_FIELDS}
  }
`);

export const JOURNAL_QUERY = defineQuery(`
  *[_type == "journal"] | order(publishingDate.date desc) {
    _id,
    title,
    slug,
    publishingDate,
    cover {
      image { ${IMAGE_FIELDS} },
      alt
    },
    authors[]{ ...@->{ _id, name }, _key },
    excerpt,
    tags[]->{
      _id,
      name
    },
    ${SEO_FIELDS}
  }
`);

export const JOURNAL_ARTICLE_QUERY = defineQuery(`
  *[_type == "journal" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishingDate,
    cover {
      _type,
      image {
        _type,
        ${IMAGE_FIELDS}
      },
      alt
    },
    authors[]{ ...@->{ _id, name }, _key },
    excerpt,
    tags[]->{
      _id,
      name
    },
    content[] { ... },
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
      image { ${IMAGE_FIELDS} },
      alt
    },
    designersAndProfessionals[]{ ...@->{ _id, name }, _key },
    studio->{
      _id,
      name
    },
    place->{ _id, name, city, country, countryCode, lat, lng },
    readingTime,
    tags[]->{
      _id,
      name
    },
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
        ${IMAGE_FIELDS}
      },
      alt
    },
    designersAndProfessionals[]{ ...@->{ _id, name, portrait }, _key },
    studio->{
      _id,
      name
    },
    place->{ _id, name, city, country, countryCode, lat, lng },
    readingTime,
    tags[]->{
      _id,
      name
    },
    introText,
    interview[] {
      ...,
      _type == "imageBlock" => {
        _key,
        _type,
        image {
          image { ${IMAGE_FIELDS} },
          alt,
          caption
        }
      },
      _type == "multipleImageBlock" => {
        _key,
        _type,
        images[] {
          _key,
          image { ${IMAGE_FIELDS} },
          alt,
          caption
        }
      }
    },
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
      image { ${IMAGE_FIELDS} },
      alt
    },
    languages[]{ ...@->{ _id, name }, _key },
    authors[]{ ...@->{ _id, name }, _key },
    publisher->{
      _id,
      name
    },
    tags[]->{
      _id,
      name
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
    tags[]->{
      _id,
      name
    },
    place->{ _id, name, city, country, countryCode, lat, lng },
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
      image { ${IMAGE_FIELDS} },
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
    place->{ _id, name, city, country, countryCode, lat, lng },
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
    description,
    cover {
      image { ${IMAGE_FIELDS} },
      alt
    },
    category->{
      _id,
      name
    },
    tags[]->{
      _id,
      name
    },
    places[]->{ _id, name, city, country, countryCode, lat, lng },
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
    tags[]->{
      _id,
      name
    },
    places[]->{ _id, name, city, country, countryCode, lat, lng },
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
      image { ${IMAGE_FIELDS} },
      alt
    },
    category->{
      _id,
      name
    },
    tags[]->{ _id, name },
    sourceUrl,
    ogTitle,
    ogDescription,
    ogSiteName,
    ogImageUrl
  }
`);

// ==================== MAP QUERIES ====================

export const MAP_PLACES_QUERY = defineQuery(`
  *[_type == "place" && defined(lat) && defined(lng)] {
    _id,
    name,
    city,
    country,
    countryCode,
    lat,
    lng,
    "designers": *[_type == "designer" && place._ref == ^._id] { _id, name, slug },
    "bookshops": *[_type == "bookshop" && place._ref == ^._id] { _id, name },
    "studios": *[_type == "studio" && references(^._id)] { _id, name },
    "institutes": *[_type == "institute" && place._ref == ^._id] { _id, name },
    "typeFoundries": *[_type == "typeFoundry" && references(^._id)] { _id, name }
  }
`);
