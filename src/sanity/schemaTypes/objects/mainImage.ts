import { defineField, defineType } from "sanity";

export const mainImage = defineType({
  type: "object",
  name: "mainImage",
  title: "Main Image",
  fields: [
    defineField({ type: "image", name: "image", title: "Image" }),
    defineField({
      type: "string",
      name: "caption",
      title: "Caption / Copyright",
    }),
    defineField({ type: "string", name: "alt", title: "Alt" }),
  ],
});
