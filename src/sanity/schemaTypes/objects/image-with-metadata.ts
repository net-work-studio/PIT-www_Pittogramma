import { defineField, defineType } from "sanity";

export const imageWithMetadata = defineType({
  type: "object",
  name: "imageWithMetadata",
  title: "Image with Metadata",
  fields: [
    defineField({
      type: "image",
      name: "image",
      title: "Image",
      options: { hotspot: true },
    }),
    defineField({
      type: "string",
      name: "caption",
      title: "Caption / Copyright",
    }),
    defineField({ type: "string", name: "alt", title: "Alt" }),
  ],
});
