import { defineQuery } from "next-sanity";

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
      image,
      url
    },
    xCard {
      cardType,
      title,
      description,
      image
    },
    metaImage
  }
`;

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    homeIntro,
    projectsIntro,
    interviewsIntro,
    designersIntro,
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
    tags[]->{
      _id,
      name,
      slug
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
    tags[]->{
      _id,
      name,
      slug
    },
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
    interviewTo[]->{
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
        asset,
        hotspot,
        crop
      },
      alt
    },
    interviewTo[]->{
      _id,
      name,
      portrait
    },
    introText,
    interview,
    ${SEO_FIELDS}
  }
`);
