import { defineArrayMember, defineField, defineType } from "sanity";

export const interview = defineType({
  type: "document",
  name: "interview",
  title: "Interview",
  fields: [
    defineField({
      type: "titleSlug",
      name: "titleslug",
      title: "TitleSlug",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "mainImage",
      name: "cover",
      title: "Cover",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "text",
      name: "shortDescription",
      title: "Short Description",
      validation: (e) => e.required(),
    }),
    defineField({ type: "text", name: "bio", title: "Bio" }),
    defineField({
      type: "array",
      name: "interview",
      title: "Interview",
      of: [defineArrayMember({ type: "block" })],
    }),
  ],
});
