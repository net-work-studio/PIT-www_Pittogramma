import { defineArrayMember, defineField, defineType } from "sanity";

const minYear = 1900;
const maxYear = 2500;

export const project = defineType({
  type: "document",
  name: "project",
  title: "Project",
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
      type: "reference",
      name: "designer",
      title: "Designer",
      to: [{ type: "designer" }],
      validation: (e) => e.required(),
    }),
    defineField({
      type: "imageWithMetadata",
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
      type: "number",
      name: "year",
      title: "Year",
      validation: (e) =>
        e
          .required()
          .min(minYear)
          .custom((value) => {
            if (value && (value < minYear || value > maxYear)) {
              return "Birth year must be exactly 4 digits";
            }
            return true;
          }),
    }),
    defineField({
      type: "array",
      name: "tags",
      title: "Tags",
      of: [
        defineArrayMember({
          type: "reference",
          name: "tag",
          title: "Tag",
          to: [{ type: "tag" }],
        }),
      ],
    }),
    defineField({
      type: "array",
      name: "gallery",
      title: "Gallery",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({ type: "text", name: "description", title: "Description" }),
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
