import { ProjectsIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { tagsField } from "@/sanity/schemaTypes/objects/tag-selector";
import { groups } from "@/sanity/utils/groups";

const minYear = 1900;
const maxYear = 2500;

export const project = defineType({
  type: "document",
  name: "project",
  title: "Project",
  icon: ProjectsIcon,
  groups,
  orderings: [
    {
      title: "Publishing Date, Newest",
      name: "publishingDateDesc",
      by: [{ field: "publishingDate.date", direction: "desc" }],
    },
    {
      title: "Publishing Date, Oldest",
      name: "publishingDateAsc",
      by: [{ field: "publishingDate.date", direction: "asc" }],
    },
  ],
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
      group: "content",
      title: "Cover",
      validation: (e) => e.required(),
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
      type: "reference",
      name: "institute",
      title: "Institute",
      group: "content",
      to: [{ type: "institute" }],
    }),
    defineField({
      type: "array",
      name: "teachers",
      title: "Teachers",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "person" }],
          options: {
            filter: '"teacher" in roles',
          },
        }),
      ],
      validation: (rule) =>
        rule.unique().error("You cannot add the same teacher twice"),
    }),
    defineField({
      type: "number",
      name: "year",
      title: "Year",
      group: "content",
      validation: (e) =>
        e
          .required()
          .min(minYear)
          .custom((value) => {
            if (value && (value < minYear || value > maxYear)) {
              return "Project year must be exactly 4 digits";
            }
            return true;
          }),
    }),
    tagsField("content"),
    defineField({
      type: "text",
      name: "description",
      title: "Description",
      group: "content",
    }),
    defineField({
      type: "array",
      name: "gallery",
      title: "Gallery",
      group: "content",
      of: [
        defineArrayMember({ type: "singleMediaBlock" }),
        defineArrayMember({ type: "sideBySideMediaBlock" }),
        defineArrayMember({ type: "threeSideBySideMediaBlock" }),
        defineArrayMember({ type: "gridFourMediaBlock" }),
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
