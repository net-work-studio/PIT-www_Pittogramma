import { ProjectsIcon } from "@sanity/icons/Projects";
import { defineArrayMember, defineField, defineType } from "sanity";
import { tagsField } from "@/sanity/schemaTypes/objects/tag-selector";
import { groups } from "@/sanity/utils/groups";

const minYear = 1900;
const maxYear = 2500;

export const project = defineType({
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
      name: "institute",
      title: "Institute",
      to: [{ type: "institute" }],
      type: "reference",
    }),
    defineField({
      group: "content",
      name: "teachers",
      of: [
        defineArrayMember({
          options: {
            filter: '"teacher" in roles',
          },
          to: [{ type: "person" }],
          type: "reference",
        }),
      ],
      title: "Teachers",
      type: "array",
      validation: (rule) =>
        rule.unique().error("You cannot add the same teacher twice"),
    }),
    defineField({
      group: "content",
      name: "year",
      title: "Year",
      type: "number",
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
      group: "content",
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      group: "content",
      name: "gallery",
      of: [
        defineArrayMember({ type: "singleMediaBlock" }),
        defineArrayMember({ type: "sideBySideMediaBlock" }),
        defineArrayMember({ type: "threeSideBySideMediaBlock" }),
        defineArrayMember({ type: "gridFourMediaBlock" }),
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
  icon: ProjectsIcon,
  name: "project",
  orderings: [
    {
      by: [{ direction: "desc", field: "publishingDate.date" }],
      name: "publishingDateDesc",
      title: "Publishing Date, Newest",
    },
    {
      by: [{ direction: "asc", field: "publishingDate.date" }],
      name: "publishingDateAsc",
      title: "Publishing Date, Oldest",
    },
  ],
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
  title: "Project",
  type: "document",
});
