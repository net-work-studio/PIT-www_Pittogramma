import { defineField, defineType } from "sanity";

export const titleSlug = defineType({
  type: "object",
  name: "titleSlug",
  title: "TitleSlug",
  fields: [
    defineField({
      type: "string",
      name: "title",
      title: "Title",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      validation: (e) => e.required(),
    }),
  ],
});
