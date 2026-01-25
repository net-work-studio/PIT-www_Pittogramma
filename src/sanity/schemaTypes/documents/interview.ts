import { CommentIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { groups } from "@/sanity/utils/groups";

export const interview = defineType({
  type: "document",
  name: "interview",
  title: "Interview",
  icon: CommentIcon,
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
      title: "Cover",
      validation: (e) => e.required(),
      group: "content",
    }),
    defineField({
      type: "array",
      name: "interviewTo",
      title: "Interview To",
      group: "content",
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
      group: "content",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "array",
      name: "interview",
      title: "Interview",
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
