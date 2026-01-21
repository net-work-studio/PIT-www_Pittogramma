import { defineField, defineType } from "sanity";

export const edition = defineType({
  type: "document",
  name: "edition",
  title: "Edition",
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
    defineField({
      type: "imageWithMetadata",
      name: "cover",
      title: "Cover",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "seoModule",
      name: "seo",
      title: "SEO",
    }),
  ],
});
