import { defineField, defineType } from "sanity";

export const openGraph = defineType({
  name: "openGraph",
  title: "Open Graph",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "OG Title",
      type: "string",
      description:
        "Optional override for social sharing. Uses Meta Title by default.",
    }),
    defineField({
      name: "description",
      title: "OG Description",
      type: "text",
      rows: 3,
      description:
        "Optional override for social sharing. Uses Meta Description by default.",
    }),
    defineField({
      name: "url",
      title: "OG URL",
      type: "url",
      description: "URL used for social sharing (usually the canonical URL).",
    }),
  ],
});
