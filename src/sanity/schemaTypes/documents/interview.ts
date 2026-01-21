import { defineArrayMember, defineField, defineType } from "sanity";

export const interview = defineType({
  type: "document",
  name: "interview",
  title: "Interview",
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
      options: {
        source: "title",
      },
      validation: (e) => e.required(),
    }),
    defineField({
      type: "publishingDate",
      name: "publishingDate",
      title: "Publishing Date",
    }),
    defineField({
      type: "imageWithMetadata",
      name: "cover",
      title: "Cover",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "array",
      name: "interviewTo",
      title: "Interview To",
      of: [
        defineArrayMember({
          type: "reference",
          name: "designer",
          title: "Designer",
          to: [{ type: "designer" }],
        }),
      ],
      validation: (e) => e.required(),
    }),
    defineField({
      type: "text",
      name: "introText",
      title: "Intro Text",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "array",
      name: "interview",
      title: "Interview",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      type: "seoModule",
      name: "seo",
      title: "SEO",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "cover.image",
    },
  },
});
