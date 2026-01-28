import { BlockElementIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const cta = defineType({
  name: "cta",
  title: "CTA",
  type: "document",
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Internal name for this CTA",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "variant",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Simple", value: "simple" },
          { title: "With Image", value: "withImage" },
        ],
        layout: "radio",
      },
      initialValue: "simple",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "text",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithMetadata",
      hidden: ({ document }) => document?.variant !== "withImage",
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "linkType",
      title: "Link Type",
      type: "string",
      options: {
        list: [
          { title: "Internal", value: "internal" },
          { title: "External", value: "external" },
        ],
        layout: "radio",
      },
      initialValue: "internal",
    }),
    defineField({
      name: "internalLink",
      title: "Internal Page",
      type: "reference",
      to: [
        { type: "project" },
        { type: "interview" },
        { type: "journal" },
        { type: "designer" },
        { type: "event" },
        { type: "edition" },
        { type: "homePage" },
        { type: "projectsPage" },
        { type: "interviewsPage" },
        { type: "designersPage" },
      ],
      hidden: ({ document }) => document?.linkType !== "internal",
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      hidden: ({ document }) => document?.linkType !== "external",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "variant",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle === "withImage" ? "With Image" : "Simple",
        media,
      };
    },
  },
});
