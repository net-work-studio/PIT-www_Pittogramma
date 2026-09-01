import {
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";

export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    edition: defineLocations({
      resolve: (doc) => ({
        locations: [
          {
            href: `/editions/${doc?.slug}`,
            title: doc?.title || "Untitled",
          },
          { href: "/editions", title: "Editions index" },
        ],
      }),
      select: {
        slug: "slug.current",
        title: "title",
      },
    }),
    event: defineLocations({
      resolve: (doc) => ({
        locations: [
          {
            href: `/events/${doc?.slug}`,
            title: doc?.title || "Untitled",
          },
          { href: "/events", title: "Events index" },
        ],
      }),
      select: {
        slug: "slug.current",
        title: "title",
      },
    }),
    interview: defineLocations({
      resolve: (doc) => ({
        locations: [
          {
            href: `/interviews/${doc?.slug}`,
            title: doc?.title || "Untitled",
          },
          { href: "/interviews", title: "Interviews index" },
        ],
      }),
      select: {
        slug: "slug.current",
        title: "title",
      },
    }),
    journal: defineLocations({
      resolve: (doc) => ({
        locations: [
          {
            href: `/journal/${doc?.slug}`,
            title: doc?.title || "Untitled",
          },
          { href: "/journal", title: "Journal index" },
        ],
      }),
      select: {
        slug: "slug.current",
        title: "title",
      },
    }),
    person: defineLocations({
      resolve: (doc) => ({
        locations: [
          {
            href: `/designers/${doc?.slug}`,
            title: doc?.title || "Untitled",
          },
          { href: "/designers", title: "Designers index" },
        ],
      }),
      select: {
        slug: "slug.current",
        title: "name",
      },
    }),
    project: defineLocations({
      resolve: (doc) => ({
        locations: [
          {
            href: `/projects/${doc?.slug}`,
            title: doc?.title || "Untitled",
          },
          { href: "/projects", title: "Projects index" },
        ],
      }),
      select: {
        slug: "slug.current",
        title: "title",
      },
    }),
  },
};
