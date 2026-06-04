import { DocumentsIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { groups } from "@/sanity/utils/groups";
import { httpUrlValidation } from "@/sanity/utils/validation";

export const edition = defineType({
  type: "document",
  name: "edition",
  title: "Edition",
  icon: DocumentsIcon,
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
      type: "coverMedia",
      name: "cover",
      title: "Cover",
      group: "content",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "array",
      name: "authors",
      title: "Authors",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "person" }],
          options: {
            filter: '"author" in roles',
          },
        }),
      ],
      validation: (e) =>
        e
          .required()
          .min(1)
          .unique()
          .error("You cannot add the same author twice"),
    }),
    defineField({
      type: "array",
      name: "designers",
      title: "Designers",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "person" }],
          options: {
            filter: '"designer" in roles || "professional" in roles',
          },
        }),
      ],
      validation: (e) =>
        e
          .required()
          .min(1)
          .unique()
          .error("You cannot add the same designer twice"),
    }),
    defineField({
      type: "array",
      name: "supporters",
      title: "Supporters",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "contributor" }],
        }),
      ],
      validation: (e) =>
        e.unique().error("You cannot add the same supporter twice"),
    }),
    defineField({
      type: "text",
      name: "description",
      title: "Description",
      group: "content",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "url",
      name: "buyUrl",
      title: "Buy URL",
      group: "content",
      validation: httpUrlValidation,
    }),
    defineField({
      type: "array",
      name: "gallery",
      title: "Gallery",
      group: "content",
      of: [
        defineArrayMember({ type: "singleMediaBlock" }),
        defineArrayMember({ type: "sideBySideMediaBlock" }),
      ],
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
      date: "publishingDate.date",
    },
    prepare({ title, media, date }) {
      return {
        title,
        media,
        subtitle: date,
      };
    },
  },
});
