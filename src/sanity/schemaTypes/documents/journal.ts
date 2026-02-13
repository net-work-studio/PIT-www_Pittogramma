import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { groups } from "@/sanity/utils/groups";

export const journal = defineType({
  type: "document",
  name: "journal",
  title: "Journal",
  icon: DocumentTextIcon,
  groups,
  fields: [
    defineField({
      type: "string",
      name: "title",
      title: "Title",
      group: "metadata",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      group: "metadata",
      options: {
        source: "title",
      },
      validation: (e) => e.required(),
    }),
    defineField({
      type: "publishingDate",
      name: "publishingDate",
      title: "Publishing Date",
      group: "metadata",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "imageWithMetadata",
      name: "cover",
      title: "Cover",
      group: "content",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "tagSelector",
      name: "tagSelector",
      title: "Tags",
      group: "content",
    }),
    defineField({
      type: "array",
      name: "authors",
      title: "Authors",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          name: "author",
          title: "Author",
          to: [{ type: "author" }],
        }),
      ],
    }),
    defineField({
      type: "text",
      name: "excerpt",
      title: "Excerpt",
      group: "content",
      description: "A short summary of the article",
    }),
    defineField({
      type: "array",
      name: "content",
      title: "Content",
      group: "content",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      type: "seoModule",
      name: "seo",
      title: "SEO",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "cover.image",
    },
  },
});
