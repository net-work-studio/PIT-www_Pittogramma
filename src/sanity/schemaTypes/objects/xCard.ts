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
        "Optional override for X/Twitter. Uses Meta Title by default.",
    }),
    defineField({
      name: "description",
      title: "X Description",
      type: "text",
      rows: 3,
      description:
        "Optional override for X/Twitter. Uses Meta Description by default.",
    }),
  ],
});
