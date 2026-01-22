import { defineField, defineType } from "sanity";

export const xCard = defineType({
  name: "xCard",
  title: "X (Twitter) Card",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "X Title",
      type: "string",
      description:
        "Title for X/Twitter sharing (fallbacks to OG title if empty).",
    }),
    defineField({
      name: "description",
      title: "X Description",
      type: "text",
      rows: 3,
      description:
        "Description for X/Twitter sharing (fallbacks to OG description if empty).",
    }),
  ],
});
