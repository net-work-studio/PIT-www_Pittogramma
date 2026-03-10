import {
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";

export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    project: defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `/projects/${doc?.slug}`,
          },
          { title: "Projects index", href: "/projects" },
        ],
      }),
    }),
    interview: defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `/interviews/${doc?.slug}`,
          },
          { title: "Interviews index", href: "/interviews" },
        ],
      }),
    }),
    person: defineLocations({
      select: {
        title: "name",
        slug: "slug.current",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `/designers/${doc?.slug}`,
          },
          { title: "Designers index", href: "/designers" },
        ],
      }),
    }),
    journal: defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `/journal/${doc?.slug}`,
          },
          { title: "Journal index", href: "/journal" },
        ],
      }),
    }),
    event: defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `/events/${doc?.slug}`,
          },
          { title: "Events index", href: "/events" },
        ],
      }),
    }),
  },
};
