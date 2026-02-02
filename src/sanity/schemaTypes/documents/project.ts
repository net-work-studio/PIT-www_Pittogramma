import { ProjectsIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { groups } from "@/sanity/utils/groups";

const minYear = 1900;
const maxYear = 2500;

export const project = defineType({
  type: "document",
  name: "project",
  title: "Project",
  icon: ProjectsIcon,
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
          to: [{ type: "designer" }],
        }),
      ],
      validation: (e) => e.required().min(1),
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
          to: [{ type: "teacher" }],
        }),
      ],
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
    defineField({
      type: "array",
      name: "tags",
      title: "Tags",
      group: "content",
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
    },
  },
});
