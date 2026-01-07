import { defineField, defineType } from "sanity";

export const openGraph = defineType({
  name: "openGraph",
  title: "Open Graph",
  type: "object",
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: "title",
      title: "OG Title",
      type: "string",
      description: "Title used when sharing on social platforms.",
    }),
    defineField({
      name: "description",
      title: "OG Description",
      type: "text",
      rows: 3,
      description: "Description used when sharing on social platforms.",
    }),
    defineField({
      name: "image",
      title: "OG Image",
      type: "imageWithMetadata",
      description: "Image used for link previews on social platforms.",
    }),
    defineField({
      name: "url",
      title: "OG URL",
      type: "url",
      description: "URL used for social sharing (usually the canonical URL).",
    }),
  ],
});
