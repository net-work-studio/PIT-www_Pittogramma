import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  type: "document",
  name: "project",
  title: "Project",
  fields: [
    defineField({
      type: "titleSlug",
      name: "titleslug",
      title: "TitleSlug",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "reference",
      name: "designer",
      title: "Designer",
      to: [{ type: "designer" }],
      validation: (e) => e.required(),
    }),
    defineField({
      type: "mainImage",
      name: "cover",
      title: "Cover",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "reference",
      name: "institute",
      title: "Institute",
      to: [{ type: "institute" }],
    }),
    defineField({
      type: "reference",
      name: "teacher",
      title: "Teacher",
      to: [{ type: "teacher" }],
    }),
    defineField({
      type: "date",
      name: "year",
      title: "Year",
      validation: (e) => e.required(),
    }),
    defineField({ type: "string", name: "disciplines", title: "Disciplines" }),
    defineField({
      type: "array",
      name: "gallery",
      title: "Gallery",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({ type: "text", name: "description", title: "Description" }),
  ],
});
