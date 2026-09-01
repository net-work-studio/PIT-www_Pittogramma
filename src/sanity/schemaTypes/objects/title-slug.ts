import { defineField, defineType } from "sanity";

export const titleSlug = defineType({
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (e) => e.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      validation: (e) => e.required(),
    }),
  ],
  name: "titleSlug",
  title: "TitleSlug",
  type: "object",
});
