import { defineQuery } from "next-sanity";

import {
  CTA_FIELDS,
  CTA_PROJECTION,
  IMAGE_FIELDS,
  SEO_FIELDS,
} from "./fragments";

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
    featuredItem->{
      _id,
      _type,
      title,
      slug,
      publishingDate,
      cover { image { ${IMAGE_FIELDS} }, alt },
      _type == "project" => {
        "people": designers[]{ ...@->{ _id, name }, _key },
      },
      _type == "interview" => {
        "people": designersAndProfessionals[]{ ...@->{ _id, name }, _key },
        interviewToType,
        "studio": studio->name,
        "typeFoundry": typeFoundry->name,
        introText,
      },
      _type == "journal" => {
        "people": authors[]{ ...@->{ _id, name }, _key },
        label,
        excerpt,
      },
      tags[]->{ _id, name }
    },
    midPageCta->${CTA_PROJECTION},
    ${CTA_FIELDS},
    ${SEO_FIELDS}
  }
`);

export const HOME_FEED_QUERY = defineQuery(`
  *[
    _type in ["project", "interview", "journal"]
    && defined(publishingDate.date)
    && publishingDate.date <= $today
  ] | order(publishingDate.date desc) [0...29] {
    _id,
    _type,
    title,
    slug,
    publishingDate,
    cover {
      image { ${IMAGE_FIELDS} },
      alt
    },
    _type == "project" => {
      "people": designers[]{ ...@->{ _id, name }, _key },
    },
    _type == "interview" => {
      "people": designersAndProfessionals[]{ ...@->{ _id, name }, _key },
      interviewToType,
      "studio": studio->name,
      "typeFoundry": typeFoundry->name,
      introText,
      readingTime,
    },
    _type == "journal" => {
      "people": authors[]{ ...@->{ _id, name }, _key },
      label,
      excerpt,
    },
    tags[]->{ _id, name }
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
  *[_type == "person" && "designer" in roles] | order(name asc) {
    _id,
    name,
    slug,
    portrait {
      image { ${IMAGE_FIELDS} },
      alt
    },
    birthYear,
    bio,
    place->{ _id, name, city, country, countryCode, lat, lng },
    socialLinks {
      links[] {
        _key,
        platform,
        url
      }
    },
    education[] {
      _key,
      institute->{ _id, name },
      degree,
      courseName,
      year
    },
    "projects": *[_type == "project" && references(^._id)] | order(_createdAt desc) {
      _id,
      title,
      slug
    }
  }
`);

export const DESIGNER_QUERY = defineQuery(`
  *[_type == "person" && "designer" in roles && slug.current == $slug][0] {
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

const EVENT_FIELDS = `
    _id,
    title,
    slug,
    type,
    status,
    ctaUrl,
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
`;

export const FUTURE_EVENTS_QUERY = defineQuery(`
  *[_type == "event" && defined(slug.current) && dateStart >= $today] | order(dateStart asc) {
    ${EVENT_FIELDS}
  }
`);

export const PAST_EVENTS_QUERY = defineQuery(`
  *[_type == "event" && defined(slug.current) && dateStart < $today] | order(dateStart desc) [$start...$end] {
    ${EVENT_FIELDS}
  }
`);

export const PAST_EVENTS_COUNT_QUERY = defineQuery(`
  count(*[_type == "event" && defined(slug.current) && dateStart < $today])
`);

export const EVENT_QUERY = defineQuery(`
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    type,
    status,
    ctaUrl,
    cover {
      image { ${IMAGE_FIELDS} },
      alt
    },
    dateStart,
    dateEnd,
    locationName,
    locationAddress,
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
      name,
      "slug": slug.current
    },
    ${SEO_FIELDS}
  }
`);

export const PROJECTS_FILTERED_QUERY = defineQuery(`
  *[_type == "project"
    && defined(slug.current)
    && ($hasTags == false || count(tags[@->slug.current in $tags]) > 0)
  ] | order(publishingDate.date desc) [$start...$end] {
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
      name,
      "slug": slug.current
    },
    ${SEO_FIELDS}
  }
`);

export const PROJECTS_COUNT_QUERY = defineQuery(`
  count(*[_type == "project"
    && defined(slug.current)
    && ($hasTags == false || count(tags[@->slug.current in $tags]) > 0)
  ])
`);

export const PROJECTS_TAGS_QUERY = defineQuery(`
  array::unique(*[_type == "project" && defined(tags)].tags[]->{ _id, name, "slug": slug.current })
`);

// ==================== SORT UTILITIES ====================

const SORT_ORDER_MAP: Record<string, string> = {
  newest: "publishingDate.date desc",
  oldest: "publishingDate.date asc",
  "a-z": "title asc",
  "z-a": "title desc",
};

function getSortOrder(sort: string): string {
  return SORT_ORDER_MAP[sort] || SORT_ORDER_MAP.newest;
}

export function getProjectsFilteredQuery(sort: string): string {
  return `
  *[_type == "project"
    && defined(slug.current)
    && ($hasTags == false || count(tags[@->slug.current in $tags]) > 0)
  ] | order(${getSortOrder(sort)}) [$start...$end] {
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
      name,
      "slug": slug.current
    },
    ${SEO_FIELDS}
  }`;
}

export function getJournalFilteredQuery(sort: string): string {
  return `
  *[_type == "journal"
    && defined(slug.current)
    && ($hasTags == false || label in $tags)
  ] | order(${getSortOrder(sort)}) [$start...$end] {
    _id,
    title,
    slug,
    label,
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
  }`;
}

export function getInterviewsFilteredQuery(sort: string): string {
  return `
  *[_type == "interview"
    && defined(slug.current)
    && ($hasTags == false || count(tags[@->slug.current in $tags]) > 0)
  ] | order(${getSortOrder(sort)}) [$start...$end] {
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
    typeFoundry->{
      _id,
      name
    },
    place->{ _id, name, city, country, countryCode, lat, lng },
    readingTime,
    tags[]->{
      _id,
      name,
      "slug": slug.current
    },
    introText,
    ${SEO_FIELDS}
  }`;
}

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
    designers[]{
      ...@->{
        _id,
        name,
        slug,
        portrait,
        bio,
        birthYear,
        place->{ city, country },
        socialLinks,
        education[] {
          _key,
          institute->{ _id, name },
          degree,
          courseName,
          year
        },
        "projects": *[_type == "project" && references(^._id)] | order(_createdAt desc) {
          _id,
          title,
          slug
        }
      },
      _key
    },
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
      label,
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
    label,
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

export const JOURNAL_COUNT_QUERY = defineQuery(`
  count(*[_type == "journal"
    && defined(slug.current)
    && ($hasTags == false || label in $tags)
  ])
`);

export const JOURNAL_ARTICLE_QUERY = defineQuery(`
  *[_type == "journal" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    label,
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
    typeFoundry->{
      _id,
      name
    },
    place->{ _id, name, city, country, countryCode, lat, lng },
    readingTime,
    tags[]->{
      _id,
      name,
      "slug": slug.current
    },
    introText,
    ${SEO_FIELDS}
  }
`);

export const INTERVIEWS_FILTERED_QUERY = defineQuery(`
  *[_type == "interview"
    && defined(slug.current)
    && ($hasTags == false || count(tags[@->slug.current in $tags]) > 0)
  ] | order(publishingDate.date desc) [$start...$end] {
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
    typeFoundry->{
      _id,
      name
    },
    place->{ _id, name, city, country, countryCode, lat, lng },
    readingTime,
    tags[]->{
      _id,
      name,
      "slug": slug.current
    },
    introText,
    ${SEO_FIELDS}
  }
`);

export const INTERVIEWS_COUNT_QUERY = defineQuery(`
  count(*[_type == "interview"
    && defined(slug.current)
    && ($hasTags == false || count(tags[@->slug.current in $tags]) > 0)
  ])
`);

export const INTERVIEWS_TAGS_QUERY = defineQuery(`
  array::unique(*[_type == "interview" && defined(tags)].tags[]->{ _id, name, "slug": slug.current })
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
    interviewToType,
    studio->{
      _id,
      name
    },
    typeFoundry->{
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

// ==================== ADV QUERIES ====================

export const ADVS_QUERY = defineQuery(`
  *[_type == "adv" && dateStart <= now() && dateEnd >= now()] | order(tier asc) {
    _id,
    title,
    cover {
      image { ${IMAGE_FIELDS} },
      alt
    },
    description,
    externalUrl,
    tier,
    dateStart,
    dateEnd,
    sponsor->{ _id, name }
  }
`);

// /feed query — Phase 2: gold + silver + bronze.
// Active window: dateStart <= today <= dateEnd. Sorted by tier priority
// (gold → silver → bronze), then dateStart asc (first-booked-first-served),
// tie-break on _createdAt asc. The hard cap of 16 is a safety net well above
// the visible cap budget (1 + 2 + 5 = 8) so legitimate inventory survives any
// short-term overflow while still bounding worst-case payload size.
// Per-tier visible caps are enforced by the page, not the query.
// Tier priority below must match `TIER_ORDER` in src/lib/adv-config.ts.
export const FEED_QUERY = defineQuery(`
  *[
    _type == "adv"
    && tier in ["gold", "silver", "bronze"]
    && dateStart <= $today
    && dateEnd >= $today
  ] | order(
    select(tier == "gold" => 0, tier == "silver" => 1, tier == "bronze" => 2, 99) asc,
    dateStart asc,
    _createdAt asc
  ) [0...16] {
    _id,
    title,
    cover {
      image { ${IMAGE_FIELDS} },
      alt
    },
    description,
    externalUrl,
    tier,
    dateStart,
    dateEnd,
    sponsor->{ _id, name }
  }
`);

// ==================== RECENT UPDATES QUERY ====================

export const RECENT_UPDATES_QUERY = defineQuery(`
  *[_type in ["person", "studio", "typeFoundry", "glossary", "bibliography", "bookshop", "institute", "webSource"]]
  | order(_createdAt desc) [0...16] {
    _id,
    _type,
    _createdAt,
    name
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
    "designers": *[_type == "person" && "designer" in roles && place._ref == ^._id] { _id, name, slug },
    "bookshops": *[_type == "bookshop" && place._ref == ^._id] { _id, name },
    "studios": *[_type == "studio" && references(^._id)] { _id, name },
    "institutes": *[_type == "institute" && place._ref == ^._id] { _id, name },
    "typeFoundries": *[_type == "typeFoundry" && references(^._id)] { _id, name }
  }
`);
