import { defineQuery } from "next-sanity";

import {
  COVER_MEDIA_FIELDS,
  CTA_FIELDS,
  CTA_PROJECTION,
  IMAGE_FIELDS,
  JOURNAL_REFERENCE_BLOCK_FIELDS,
  MEDIA_BLOCKS_FIELDS,
  PORTRAIT_FIELDS,
  SEO_FIELDS,
} from "./fragments";

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    utmSource,
    utmMedium,
    utmCampaign,
    instagramUrl,
    linkedinUrl,
    studioAgencyContributionUrl,
    typeFoundriesContributionUrl,
    bibliographyContributionUrl,
    indexAvailability {
      headerSearchEnabled,
      studiosAgencies { published, enabledViews, searchEnabled },
      typeFoundries { published, enabledViews, searchEnabled },
      institutes { published, enabledViews, searchEnabled },
      bookshops { published, enabledViews, searchEnabled },
      websites { published, enabledViews, searchEnabled },
      glossary { published, searchEnabled },
      bibliography { published }
    }
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
      cover { ${COVER_MEDIA_FIELDS} },
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
        featuredCover { ${COVER_MEDIA_FIELDS} },
      },
      _type == "event" => {
        type,
        dateStart,
        dateEnd,
        attendanceMode,
        locationName,
        cardDestination,
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
    _type in ["project", "interview", "journal", "event"]
    && defined(publishingDate.date)
    && publishingDate.date <= $today
    && (_type != "event" || coalesce(dateEnd, dateStart) >= $today)
  ] | order(publishingDate.date desc) [0...32] {
    _id,
    _type,
    title,
    slug,
    publishingDate,
    cover { ${COVER_MEDIA_FIELDS} },
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
      featuredCover { ${COVER_MEDIA_FIELDS} },
    },
    _type == "event" => {
      type,
      dateStart,
      dateEnd,
      attendanceMode,
      locationName,
      cardDestination,
    },
    tags[]->{ _id, name }
  }
`);

export const NEWSLETTER_PREVIEW_QUERY = defineQuery(`
  *[
    _type in ["project", "journal"]
    && defined(publishingDate.date)
    && publishingDate.date <= $today
  ] | order(publishingDate.date desc) [0...$limit] {
    _id,
    _type,
    title,
    slug,
    publishingDate,
    cover { ${COVER_MEDIA_FIELDS} },
    _type == "project" => {
      description,
      "people": designers[]{ ...@->{ _id, name }, _key },
    },
    _type == "journal" => {
      excerpt,
      featuredCover { ${COVER_MEDIA_FIELDS} },
      "people": authors[]{ ...@->{ _id, name }, _key },
      label,
    },
  }
`);

export const ABOUT_PAGE_QUERY = defineQuery(`
  *[_type == "aboutPage"][0] {
    _id,
    title,
    content[] {
      _key,
      _type,
      _type == "block" => @,
      ${MEDIA_BLOCKS_FIELDS}
    },
    supporters[]->{
      _id,
      name,
      logo {
        logoLight { ${IMAGE_FIELDS} },
        logoDark { ${IMAGE_FIELDS} },
        alt
      }
    },
    ${SEO_FIELDS}
  }
`);

export const IMPRESSUM_PAGE_QUERY = defineQuery(`
  *[_type == "impressumPage"][0] {
    _id,
    title,
    content[] {
      _key,
      _type,
      _type == "block" => @
    },
    ${SEO_FIELDS}
  }
`);

export const PRIVACY_POLICY_PAGE_QUERY = defineQuery(`
  *[_type == "privacyPolicyPage"][0] {
    _id,
    title,
    content[] {
      _key,
      _type,
      _type == "block" => @
    },
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

const RESOURCE_PAGE_SETTINGS_FIELDS = `
  _id,
  title,
  introText,
  ${CTA_FIELDS},
  ${SEO_FIELDS}
`;

export const BIBLIOGRAPHY_PAGE_QUERY = defineQuery(`
  *[_type == "bibliographyPage"][0] {
    ${RESOURCE_PAGE_SETTINGS_FIELDS}
  }
`);

export const BOOKSHOPS_PAGE_QUERY = defineQuery(`
  *[_type == "bookshopsPage"][0] {
    ${RESOURCE_PAGE_SETTINGS_FIELDS}
  }
`);

export const GLOSSARY_PAGE_QUERY = defineQuery(`
  *[_type == "glossaryPage"][0] {
    ${RESOURCE_PAGE_SETTINGS_FIELDS}
  }
`);

export const INSTITUTES_PAGE_QUERY = defineQuery(`
  *[_type == "institutesPage"][0] {
    ${RESOURCE_PAGE_SETTINGS_FIELDS}
  }
`);

export const STUDIOS_AGENCIES_PAGE_QUERY = defineQuery(`
  *[_type == "studiosAgenciesPage"][0] {
    ${RESOURCE_PAGE_SETTINGS_FIELDS}
  }
`);

export const TYPE_FOUNDRIES_PAGE_QUERY = defineQuery(`
  *[_type == "typeFoundriesPage"][0] {
    ${RESOURCE_PAGE_SETTINGS_FIELDS}
  }
`);

export const WEBSITES_PAGE_QUERY = defineQuery(`
  *[_type == "websitesPage"][0] {
    ${RESOURCE_PAGE_SETTINGS_FIELDS}
  }
`);

export const DESIGNERS_QUERY = defineQuery(`
  *[_type == "person" && "designer" in roles] | order(name asc) {
    _id,
    name,
    slug,
    ${PORTRAIT_FIELDS},
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
      slug,
      cover { ${COVER_MEDIA_FIELDS} }
    }
  }
`);

export const DESIGNER_QUERY = defineQuery(`
  *[_type == "person" && "designer" in roles && slug.current == $slug][0] {
    _id,
    name,
    slug,
    ${PORTRAIT_FIELDS},
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
      cover { ${COVER_MEDIA_FIELDS} },
      title,
      slug,
      designers[]{ ...@->{ _id, name }, _key }
    },
    "relatedInterviews": *[_type == "interview" && references(^._id)] | order(publishingDate.date desc) [0...4] {
      _id,
      title,
      slug,
      cover { ${COVER_MEDIA_FIELDS} },
      designersAndProfessionals[]{ ...@->{ _id, name }, _key }
    }
  }
`);

const EVENT_FIELDS = `
    _id,
    title,
    slug,
    cardDestination,
    externalUrl,
    type,
    cover { ${COVER_MEDIA_FIELDS} },
    dateStart,
    dateEnd,
    attendanceMode,
    locationName,
    description,
    sponsors[]->{ _id, name },
    partners[]->{ _id, name },
    tags[]->{ _id, name },
    ${SEO_FIELDS}
`;

// Upcoming/past split uses effective end date: coalesce(dateEnd, dateStart).
export const FUTURE_EVENTS_QUERY = defineQuery(`
  *[_type == "event" && defined(slug.current) && coalesce(dateEnd, dateStart) >= $today] | order(dateStart asc) {
    ${EVENT_FIELDS}
  }
`);

export const PAST_EVENTS_QUERY = defineQuery(`
  *[_type == "event" && defined(slug.current) && coalesce(dateEnd, dateStart) < $today] | order(dateStart desc) [$start...$end] {
    ${EVENT_FIELDS}
  }
`);

export const PAST_EVENTS_COUNT_QUERY = defineQuery(`
  count(*[_type == "event" && defined(slug.current) && coalesce(dateEnd, dateStart) < $today])
`);

export const EVENT_QUERY = defineQuery(`
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    cardDestination,
    externalUrl,
    type,
    cover { ${COVER_MEDIA_FIELDS} },
    dateStart,
    dateEnd,
    attendanceMode,
    locationName,
    locationAddress,
    description,
    sponsors[]->{
      _id,
      name,
      description,
      logo {
        logoLight { ${IMAGE_FIELDS} },
        logoDark { ${IMAGE_FIELDS} },
        alt
      }
    },
    partners[]->{
      _id,
      name,
      description,
      logo {
        logoLight { ${IMAGE_FIELDS} },
        logoDark { ${IMAGE_FIELDS} },
        alt
      }
    },
    info[] { _key, title, content },
    tags[]->{ _id, name },
    ${SEO_FIELDS}
  }
`);

export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project"] | order(_createdAt desc) {
    _id,
    cover { ${COVER_MEDIA_FIELDS} },
    title,
    slug,
    designers[]{ ...@->{ _id, name, slug, ${PORTRAIT_FIELDS} }, _key },
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
    && ($hasTags == false || count(tags[_ref in $tagIds]) > 0)
  ] | order(publishingDate.date desc) [$start...$end] {
    _id,
    cover { ${COVER_MEDIA_FIELDS} },
    title,
    slug,
    designers[]{ ...@->{ _id, name, slug, ${PORTRAIT_FIELDS} }, _key },
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
    && ($hasTags == false || count(tags[_ref in $tagIds]) > 0)
  ])
`);

export const PROJECTS_TAGS_QUERY = defineQuery(`
  array::unique(*[_type == "project" && defined(tags)].tags[]->{ _id, name, "slug": slug.current })
`);

export const TAG_IDS_BY_SLUGS_QUERY = defineQuery(`
  *[_type == "tag" && slug.current in $slugs]._id
`);

// ==================== SORT UTILITIES ====================

const SORT_KEYS = ["newest", "oldest", "a-z", "z-a"] as const;
type SortKey = (typeof SORT_KEYS)[number];

function getSortKey(sort: string): SortKey {
  return SORT_KEYS.includes(sort as SortKey) ? (sort as SortKey) : "newest";
}

const PROJECTS_FILTERED_OLDEST_QUERY = defineQuery(`
  *[_type == "project"
    && defined(slug.current)
    && ($hasTags == false || count(tags[_ref in $tagIds]) > 0)
  ] | order(publishingDate.date asc) [$start...$end] {
    _id,
    cover { ${COVER_MEDIA_FIELDS} },
    title,
    slug,
    designers[]{ ...@->{ _id, name, slug, ${PORTRAIT_FIELDS} }, _key },
    tags[]->{
      _id,
      name,
      "slug": slug.current
    },
    ${SEO_FIELDS}
  }
`);

const PROJECTS_FILTERED_AZ_QUERY = defineQuery(`
  *[_type == "project"
    && defined(slug.current)
    && ($hasTags == false || count(tags[_ref in $tagIds]) > 0)
  ] | order(title asc) [$start...$end] {
    _id,
    cover { ${COVER_MEDIA_FIELDS} },
    title,
    slug,
    designers[]{ ...@->{ _id, name, slug, ${PORTRAIT_FIELDS} }, _key },
    tags[]->{
      _id,
      name,
      "slug": slug.current
    },
    ${SEO_FIELDS}
  }
`);

const PROJECTS_FILTERED_ZA_QUERY = defineQuery(`
  *[_type == "project"
    && defined(slug.current)
    && ($hasTags == false || count(tags[_ref in $tagIds]) > 0)
  ] | order(title desc) [$start...$end] {
    _id,
    cover { ${COVER_MEDIA_FIELDS} },
    title,
    slug,
    designers[]{ ...@->{ _id, name, slug, ${PORTRAIT_FIELDS} }, _key },
    tags[]->{
      _id,
      name,
      "slug": slug.current
    },
    ${SEO_FIELDS}
  }
`);

const JOURNAL_FILTERED_NEWEST_QUERY = defineQuery(`
  *[_type == "journal"
    && defined(slug.current)
    && ($hasTags == false || label in $tags)
  ] | order(publishingDate.date desc) [$start...$end] {
    _id,
    title,
    slug,
    label,
    publishingDate,
    cover { ${COVER_MEDIA_FIELDS} },
    featuredCover { ${COVER_MEDIA_FIELDS} },
    authors[]{ ...@->{ _id, name }, _key },
    excerpt,
    tags[]->{
      _id,
      name
    },
    ${SEO_FIELDS}
  }
`);

const JOURNAL_FILTERED_OLDEST_QUERY = defineQuery(`
  *[_type == "journal"
    && defined(slug.current)
    && ($hasTags == false || label in $tags)
  ] | order(publishingDate.date asc) [$start...$end] {
    _id,
    title,
    slug,
    label,
    publishingDate,
    cover { ${COVER_MEDIA_FIELDS} },
    featuredCover { ${COVER_MEDIA_FIELDS} },
    authors[]{ ...@->{ _id, name }, _key },
    excerpt,
    tags[]->{
      _id,
      name
    },
    ${SEO_FIELDS}
  }
`);

const JOURNAL_FILTERED_AZ_QUERY = defineQuery(`
  *[_type == "journal"
    && defined(slug.current)
    && ($hasTags == false || label in $tags)
  ] | order(title asc) [$start...$end] {
    _id,
    title,
    slug,
    label,
    publishingDate,
    cover { ${COVER_MEDIA_FIELDS} },
    featuredCover { ${COVER_MEDIA_FIELDS} },
    authors[]{ ...@->{ _id, name }, _key },
    excerpt,
    tags[]->{
      _id,
      name
    },
    ${SEO_FIELDS}
  }
`);

const JOURNAL_FILTERED_ZA_QUERY = defineQuery(`
  *[_type == "journal"
    && defined(slug.current)
    && ($hasTags == false || label in $tags)
  ] | order(title desc) [$start...$end] {
    _id,
    title,
    slug,
    label,
    publishingDate,
    cover { ${COVER_MEDIA_FIELDS} },
    featuredCover { ${COVER_MEDIA_FIELDS} },
    authors[]{ ...@->{ _id, name }, _key },
    excerpt,
    tags[]->{
      _id,
      name
    },
    ${SEO_FIELDS}
  }
`);

const INTERVIEWS_FILTERED_NEWEST_QUERY = defineQuery(`
  *[_type == "interview"
    && defined(slug.current)
    && ($hasTags == false || count(tags[_ref in $tagIds]) > 0)
  ] | order(publishingDate.date desc) [$start...$end] {
    _id,
    title,
    slug,
    publishingDate,
    cover { ${COVER_MEDIA_FIELDS} },
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

const INTERVIEWS_FILTERED_OLDEST_QUERY = defineQuery(`
  *[_type == "interview"
    && defined(slug.current)
    && ($hasTags == false || count(tags[_ref in $tagIds]) > 0)
  ] | order(publishingDate.date asc) [$start...$end] {
    _id,
    title,
    slug,
    publishingDate,
    cover { ${COVER_MEDIA_FIELDS} },
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

const INTERVIEWS_FILTERED_AZ_QUERY = defineQuery(`
  *[_type == "interview"
    && defined(slug.current)
    && ($hasTags == false || count(tags[_ref in $tagIds]) > 0)
  ] | order(title asc) [$start...$end] {
    _id,
    title,
    slug,
    publishingDate,
    cover { ${COVER_MEDIA_FIELDS} },
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

const INTERVIEWS_FILTERED_ZA_QUERY = defineQuery(`
  *[_type == "interview"
    && defined(slug.current)
    && ($hasTags == false || count(tags[_ref in $tagIds]) > 0)
  ] | order(title desc) [$start...$end] {
    _id,
    title,
    slug,
    publishingDate,
    cover { ${COVER_MEDIA_FIELDS} },
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

const PROJECTS_SORT_QUERY_MAP = {
  "a-z": PROJECTS_FILTERED_AZ_QUERY,
  newest: PROJECTS_FILTERED_QUERY,
  oldest: PROJECTS_FILTERED_OLDEST_QUERY,
  "z-a": PROJECTS_FILTERED_ZA_QUERY,
} as const satisfies Record<SortKey, string>;

const JOURNAL_SORT_QUERY_MAP = {
  "a-z": JOURNAL_FILTERED_AZ_QUERY,
  newest: JOURNAL_FILTERED_NEWEST_QUERY,
  oldest: JOURNAL_FILTERED_OLDEST_QUERY,
  "z-a": JOURNAL_FILTERED_ZA_QUERY,
} as const satisfies Record<SortKey, string>;

const INTERVIEWS_SORT_QUERY_MAP = {
  "a-z": INTERVIEWS_FILTERED_AZ_QUERY,
  newest: INTERVIEWS_FILTERED_NEWEST_QUERY,
  oldest: INTERVIEWS_FILTERED_OLDEST_QUERY,
  "z-a": INTERVIEWS_FILTERED_ZA_QUERY,
} as const satisfies Record<SortKey, string>;

export function getProjectsFilteredQuery(sort: string): string {
  return PROJECTS_SORT_QUERY_MAP[getSortKey(sort)];
}

export function getJournalFilteredQuery(sort: string): string {
  return JOURNAL_SORT_QUERY_MAP[getSortKey(sort)];
}

export function getInterviewsFilteredQuery(sort: string): string {
  return INTERVIEWS_SORT_QUERY_MAP[getSortKey(sort)];
}

export const PROJECT_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    cover { ${COVER_MEDIA_FIELDS} },
    title,
    slug,
    designers[]{
      ...@->{
        _id,
        name,
        slug,
        ${PORTRAIT_FIELDS},
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
          slug,
          cover { ${COVER_MEDIA_FIELDS} }
        }
      },
      _key
    },
    tags[]->{
      _id,
      name,
      "slug": slug.current
    },
    teachers[]{ ...@->{ _id, name }, _key },
    institute->{
      _id,
      name,
    },
    year,
    gallery[] {
      ${MEDIA_BLOCKS_FIELDS}
    },
    description,
    "relatedProjects": *[
      _type == "project" &&
      slug.current != ^.slug.current &&
      count(tags[@._ref in ^.tags[]._ref]) > 0
    ] | order(_createdAt desc) [0...4] {
      _id,
      cover { ${COVER_MEDIA_FIELDS} },
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
      cover { ${COVER_MEDIA_FIELDS} },
      featuredCover { ${COVER_MEDIA_FIELDS} },
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
    cover { ${COVER_MEDIA_FIELDS} },
    featuredCover { ${COVER_MEDIA_FIELDS} },
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
    cover { ${COVER_MEDIA_FIELDS} },
    authors[]{ ...@->{ _id, name }, _key },
    excerpt,
    tags[]->{
      _id,
      name
    },
    content[] {
      ...,
      ${MEDIA_BLOCKS_FIELDS},
      ${JOURNAL_REFERENCE_BLOCK_FIELDS}
    },
    ${SEO_FIELDS}
  }
`);

export const INTERVIEWS_QUERY = defineQuery(`
  *[_type == "interview"] | order(publishingDate.date desc) {
    _id,
    title,
    slug,
    publishingDate,
    cover { ${COVER_MEDIA_FIELDS} },
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
    && ($hasTags == false || count(tags[_ref in $tagIds]) > 0)
  ] | order(publishingDate.date desc) [$start...$end] {
    _id,
    title,
    slug,
    publishingDate,
    cover { ${COVER_MEDIA_FIELDS} },
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
    && ($hasTags == false || count(tags[_ref in $tagIds]) > 0)
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
    cover { ${COVER_MEDIA_FIELDS} },
    designersAndProfessionals[]{ ...@->{ _id, name, ${PORTRAIT_FIELDS} }, _key },
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
    "relatedInterviews": *[
      _type == "interview" &&
      _id != ^._id &&
      defined(slug.current) &&
      count(tags[@._ref in ^.tags[]._ref]) > 0
    ] | order(_createdAt desc) [0...4] {
      _id,
      title,
      slug,
      cover { ${COVER_MEDIA_FIELDS} },
      designersAndProfessionals[]{ ...@->{ _id, name }, _key }
    },
    "fallbackInterviews": *[
      _type == "interview" &&
      _id != ^._id &&
      defined(slug.current) &&
      count(tags[@._ref in ^.tags[]._ref]) == 0
    ] | order(_createdAt desc) [0...4] {
      _id,
      title,
      slug,
      cover { ${COVER_MEDIA_FIELDS} },
      designersAndProfessionals[]{ ...@->{ _id, name }, _key }
    },
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
    cover { ${COVER_MEDIA_FIELDS} },
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
    "websiteUrl": socialLinks.links[platform == "website"][0].url,
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
    "websiteUrl": socialLinks.links[platform == "website"][0].url,
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
    "websiteUrl": socialLinks.links[platform == "website"][0].url,
    description,
    cover { ${COVER_MEDIA_FIELDS} },
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
    "websiteUrl": socialLinks.links[platform == "website"][0].url,
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
    cover { ${COVER_MEDIA_FIELDS} },
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
    cover { ${COVER_MEDIA_FIELDS} },
    description,
    externalUrl,
    tier,
    dateStart,
    dateEnd,
    sponsor->{ _id, name }
  }
`);

// Feed query — gold + silver + bronze.
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
    cover { ${COVER_MEDIA_FIELDS} },
    coverPortrait { ${IMAGE_FIELDS} },
    description,
    externalUrl,
    tier,
    dateStart,
    dateEnd,
    sponsor->{ _id, name }
  }
`);

// Home page ADV query — Phase 4. Gold + silver only (bronze is not surfaced
// on home). Active window: dateStart <= today <= dateEnd. Sorted by tier
// priority (gold → silver), then dateStart asc (first-booked-first-served),
// tie-break on _createdAt asc. Cap [0...3] matches the home visible budget
// (1 gold + 2 silver). Tier priority below must match `TIER_ORDER` in
// src/lib/adv-config.ts.
export const HOME_ADV_QUERY = defineQuery(`
  *[
    _type == "adv"
    && tier in ["gold", "silver"]
    && dateStart <= $today
    && dateEnd >= $today
  ] | order(
    select(tier == "gold" => 0, tier == "silver" => 1, 99) asc,
    dateStart asc,
    _createdAt asc
  ) [0...3] {
    _id,
    title,
    cover { ${COVER_MEDIA_FIELDS} },
    description,
    externalUrl,
    tier,
    dateStart,
    dateEnd,
    sponsor->{ _id, name }
  }
`);

// Index pages ADV query — Phase 5. Single active gold for /interviews and
// /projects index pages. Active window: dateStart <= today <= dateEnd.
// Sorted by dateStart asc (first-booked-first-served), tie-break on
// _createdAt asc. Cap [0...1] matches the gold tier visible budget.
export const INDEX_GOLD_QUERY = defineQuery(`
  *[
    _type == "adv"
    && tier == "gold"
    && dateStart <= $today
    && dateEnd >= $today
  ] | order(dateStart asc, _createdAt asc) [0...1] {
    _id,
    title,
    cover { ${COVER_MEDIA_FIELDS} },
    description,
    externalUrl,
    tier,
    dateStart,
    dateEnd,
    sponsor->{ _id, name }
  }
`);

// Feed community query — all active community items, deliberately uncapped.
// Active window: dateStart <= today AND (no dateEnd, OR dateEnd >= today).
// Sorted by dateStart asc (first-booked-first-served), tie-break on
// _createdAt asc.
export const FEED_COMMUNITY_QUERY = defineQuery(`
  *[
    _type == "community"
    && dateStart <= $today
    && (!defined(dateEnd) || dateEnd >= $today)
  ] | order(dateStart asc, _createdAt asc) {
    _id,
    title,
    type,
    cover { ${COVER_MEDIA_FIELDS} },
    description,
    externalUrl,
    dateStart,
    dateEnd,
    partner->{ _id, name }
  }
`);

// ==================== RECENT UPDATES QUERY ====================

export const RECENT_UPDATES_QUERY = defineQuery(`
  *[(_type == "person" && "designer" in roles) || _type in ["studio", "typeFoundry", "glossary", "bibliography", "bookshop", "institute", "webSource"]]
  | order(_createdAt desc) [0...16] {
    _id,
    _type,
    _createdAt,
    name,
    _type == "person" => { "slug": slug.current }
  }
`);

// ==================== EDITION QUERIES ====================

export const EDITIONS_PAGE_QUERY = defineQuery(`
  *[_type == "editionsPage"][0] {
    _id,
    title,
    ${CTA_FIELDS},
    ${SEO_FIELDS}
  }
`);

export const EDITIONS_LIST_QUERY = defineQuery(`
  *[_type == "edition" && defined(slug.current)] | order(publishingDate.date desc) {
    _id,
    title,
    slug,
    publishingDate,
    cover { ${COVER_MEDIA_FIELDS} }
  }
`);

export const EDITION_QUERY = defineQuery(`
  *[_type == "edition" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishingDate,
    cover { ${COVER_MEDIA_FIELDS} },
    authors[]{ ...@->{ _id, name }, _key },
    designers[]{ ...@->{ _id, name }, _key },
    supporters[]{ ...@->{ _id, name }, _key },
    description,
    buyUrl,
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
      }
    },
    ${SEO_FIELDS}
  }
`);

// ==================== MAP QUERIES ====================

export const MAP_DATA_QUERY = defineQuery(`
  {
    "places": *[_type == "place" && defined(lat) && defined(lng)] {
      _id,
      name,
      city,
      country,
      countryCode,
      lat,
      lng
    },
    "designers": *[_type == "person" && "designer" in roles && defined(place._ref)] {
      _id,
      name,
      slug,
      "placeId": place._ref
    },
    "bookshops": *[_type == "bookshop" && defined(place._ref)] {
      _id,
      name,
      "placeId": place._ref
    },
    "studios": *[_type == "studio" && count(places[]._ref) > 0] {
      _id,
      name,
      "placeIds": places[]._ref
    },
    "institutes": *[_type == "institute" && defined(place._ref)] {
      _id,
      name,
      "placeId": place._ref
    },
    "typeFoundries": *[_type == "typeFoundry" && count(places[]._ref) > 0] {
      _id,
      name,
      "placeIds": places[]._ref
    }
  }
`);
