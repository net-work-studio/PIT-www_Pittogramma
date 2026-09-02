import { defineField, defineType } from "sanity";

export const xCard = defineType({
  fields: [
    defineField({
      description:
        "Optional override for X/Twitter. Uses Meta Title by default.",
      name: "title",
      title: "X Title",
      type: "string",
    }),
    defineField({
      description:
        "Optional override for X/Twitter. Uses Meta Description by default.",
      name: "description",
      rows: 3,
      title: "X Description",
      type: "text",
    }),
  ],
  name: "xCard",
  title: "X (Twitter) Card",
  type: "object",
});
