import { defineQuery } from "next-sanity";

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
    seo {
      metaTitle,
      metaDescription,
      metaRobots,
      canonicalPath,
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
    seo {
      metaTitle,
      metaDescription,
      metaRobots,
      canonicalPath,
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
  }
`);
