import { defineField, defineType } from "sanity";

export const imageWithMetadata = defineType({
  fields: [
    defineField({
      name: "image",
      options: { hotspot: true },
      title: "Image",
      type: "image",
    }),
    defineField({
      name: "caption",
      title: "Caption / Copyright",
      type: "string",
    }),
    defineField({
      name: "alt",
      title: "Alt",
      type: "string",
      validation: (rule) =>
        rule
          .custom((value) =>
            value?.trim() ? true : "Add alt text for accessibility"
          )
          .warning(),
    }),
  ],
  name: "imageWithMetadata",
  title: "Image with Metadata",
  type: "object",
});
