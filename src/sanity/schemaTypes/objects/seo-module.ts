// schemas/objects/seoModuleType.ts
import { defineField, defineType } from "sanity";

const CANONICAL_PATH_REGEX = /^\/[a-z0-9\-/]*$/i;

export const seoModule = defineType({
  fields: [
    defineField({
      description:
        "Title shown in search results and browser tabs. Aim for ~60 characters. Falls back to site settings if empty.",
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      validation: (rule) =>
        rule
          .max(65)
          .warning("Titles longer than ~60–65 chars may be truncated"),
    }),
    defineField({
      description:
        "Short summary for search results. Aim for ~155–160 characters. Falls back to site settings if empty.",
      name: "metaDescription",
      rows: 3,
      title: "Meta Description",
      type: "text",
      validation: (rule) =>
        rule
          .max(160)
          .warning("Descriptions longer than ~155–160 chars may be truncated"),
    }),
    defineField({
      description: "Default image representing this page in search or shares.",
      name: "metaImage",
      title: "Meta Image",
      type: "imageWithMetadata",
    }),
    defineField({
      description:
        "Controls if search engines index this page and follow its links.",
      name: "metaRobots",
      options: {
        list: [
          { title: "Index, Follow", value: "index, follow" },
          { title: "No Index, Follow", value: "noindex, follow" },
          { title: "Index, No Follow", value: "index, nofollow" },
          { title: "No Index, No Follow", value: "noindex, nofollow" },
        ],
      },
      title: "Meta Robots",
      type: "string",
    }),
    defineField({
      description:
        "Path only (e.g., /blog/hello-world). Leave empty to use current page path.",
      name: "canonicalURL",
      title: "Canonical URL",
      type: "string",
      validation: (rule) =>
        rule
          .regex(CANONICAL_PATH_REGEX)
          .warning("Must start with / and use valid path characters"),
    }),
    defineField({
      name: "openGraph",
      title: "Open Graph",
      type: "openGraph",
    }),
    defineField({
      name: "xCard",
      title: "X (Twitter) Card",
      type: "xCard",
    }),
  ],
  name: "seoModule",
  title: "SEO",
  type: "object",
});
