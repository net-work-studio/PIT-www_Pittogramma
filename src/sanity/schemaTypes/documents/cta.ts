import { BlockElementIcon } from "@sanity/icons/BlockElement";
import { defineField, defineType } from "sanity";
import { requiredHttpUrlWhen } from "@/sanity/utils/validation";

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
      validation: (rule) =>
        rule.custom((value, context) => {
          const document = context.document as { variant?: string };
          if (document?.variant === "withImage" && !value) {
            return "Image is required for CTAs with images";
          }
          return true;
        }),
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
        { type: "person" },
        { type: "event" },
        { type: "edition" },
        { type: "homePage" },
        { type: "projectsPage" },
        { type: "interviewsPage" },
        { type: "designersPage" },
      ],
      hidden: ({ document }) => document?.linkType !== "internal",
      validation: (rule) =>
        rule.custom((value, context) => {
          const document = context.document as { linkType?: string };
          if (document?.linkType === "internal" && !value) {
            return "Internal page is required for internal CTAs";
          }
          return true;
        }),
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      hidden: ({ document }) => document?.linkType !== "external",
      validation: requiredHttpUrlWhen((context) => {
        const document = context.document as { linkType?: string };
        return document?.linkType === "external";
      }, "External URL is required for external CTAs"),
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
