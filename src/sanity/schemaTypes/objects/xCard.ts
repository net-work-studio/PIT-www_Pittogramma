import { defineField, defineType } from "sanity";

export const xCard = defineType({
  name: "xCard",
  title: "X (Twitter) Card",
  type: "object",
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: "cardType",
      title: "Card Type",
      type: "string",
      options: {
        list: [
          { title: "Summary", value: "summary" },
          { title: "Summary with Large Image", value: "summary_large_image" },
        ],
        layout: "radio",
      },
      initialValue: "summary_large_image",
    }),
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
    defineField({
      name: "image",
      title: "X Image",
      type: "imageWithMetadata",
      description:
        "Image for X/Twitter sharing (fallbacks to OG image if empty).",
    }),
  ],
});
