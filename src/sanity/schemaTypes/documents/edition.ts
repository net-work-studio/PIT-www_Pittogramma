import { DocumentsIcon } from "@sanity/icons/Documents";
import { defineArrayMember, defineField, defineType } from "sanity";
import { groups } from "@/sanity/utils/groups";
import { httpUrlValidation } from "@/sanity/utils/validation";

export const edition = defineType({
  fields: [
    defineField({
      group: "metadata",
      name: "title",
      title: "Title",
      type: "string",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "metadata",
      name: "slug",
      options: {
        source: "title",
      },
      title: "Slug",
      type: "slug",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "metadata",
      name: "publishingDate",
      title: "Publishing Date",
      type: "publishingDate",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "content",
      name: "cover",
      title: "Cover",
      type: "coverMedia",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "content",
      name: "authors",
      of: [
        defineArrayMember({
          options: {
            filter: '"author" in roles',
          },
          to: [{ type: "person" }],
          type: "reference",
        }),
      ],
      title: "Authors",
      type: "array",
      validation: (e) =>
        e
          .required()
          .min(1)
          .unique()
          .error("You cannot add the same author twice"),
    }),
    defineField({
      group: "content",
      name: "designers",
      of: [
        defineArrayMember({
          options: {
            filter: '"designer" in roles || "professional" in roles',
          },
          to: [{ type: "person" }],
          type: "reference",
        }),
      ],
      title: "Designers",
      type: "array",
      validation: (e) =>
        e
          .required()
          .min(1)
          .unique()
          .error("You cannot add the same designer twice"),
    }),
    defineField({
      group: "content",
      name: "supporters",
      of: [
        defineArrayMember({
          to: [{ type: "contributor" }],
          type: "reference",
        }),
      ],
      title: "Supporters",
      type: "array",
      validation: (e) =>
        e.unique().error("You cannot add the same supporter twice"),
    }),
    defineField({
      group: "content",
      name: "description",
      title: "Description",
      type: "text",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "content",
      name: "buyUrl",
      title: "Buy URL",
      type: "url",
      validation: httpUrlValidation,
    }),
    defineField({
      group: "content",
      name: "gallery",
      of: [
        defineArrayMember({ type: "singleMediaBlock" }),
        defineArrayMember({ type: "sideBySideMediaBlock" }),
      ],
      title: "Gallery",
      type: "array",
    }),
    defineField({
      group: "seo",
      name: "seo",
      title: "SEO",
      type: "seoModule",
    }),
  ],
  groups,
  icon: DocumentsIcon,
  name: "edition",
  preview: {
    prepare({ title, media, date }) {
      return {
        media,
        subtitle: date,
        title,
      };
    },
    select: {
      date: "publishingDate.date",
      media: "cover.image",
      title: "title",
    },
  },
  title: "Edition",
  type: "document",
});
