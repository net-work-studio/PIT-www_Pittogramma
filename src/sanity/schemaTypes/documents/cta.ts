import { BlockElementIcon } from "@sanity/icons/BlockElement";
import { defineField, defineType } from "sanity";
import { requiredHttpUrlWhen } from "@/sanity/utils/validation";

export const cta = defineType({
  fields: [
    defineField({
      description: "Internal name for this CTA",
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      initialValue: "simple",
      name: "variant",
      options: {
        layout: "radio",
        list: [
          { title: "Simple", value: "simple" },
          { title: "With Image", value: "withImage" },
        ],
      },
      title: "Type",
      type: "string",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "text",
    }),
    defineField({
      hidden: ({ document }) => document?.variant !== "withImage",
      name: "image",
      title: "Image",
      type: "imageWithMetadata",
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
      initialValue: "internal",
      name: "linkType",
      options: {
        layout: "radio",
        list: [
          { title: "Internal", value: "internal" },
          { title: "External", value: "external" },
        ],
      },
      title: "Link Type",
      type: "string",
    }),
    defineField({
      hidden: ({ document }) => document?.linkType !== "internal",
      name: "internalLink",
      title: "Internal Page",
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
        { type: "bibliographyPage" },
        { type: "bookshopsPage" },
        { type: "glossaryPage" },
        { type: "institutesPage" },
        { type: "studiosAgenciesPage" },
        { type: "typeFoundriesPage" },
        { type: "websitesPage" },
      ],
      type: "reference",
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
      hidden: ({ document }) => document?.linkType !== "external",
      name: "externalUrl",
      title: "External URL",
      type: "url",
      validation: requiredHttpUrlWhen((context) => {
        const document = context.document as { linkType?: string };
        return document?.linkType === "external";
      }, "External URL is required for external CTAs"),
    }),
  ],
  icon: BlockElementIcon,
  name: "cta",
  preview: {
    prepare({ title, subtitle, media }) {
      return {
        media,
        subtitle: subtitle === "withImage" ? "With Image" : "Simple",
        title,
      };
    },
    select: {
      media: "image",
      subtitle: "variant",
      title: "title",
    },
  },
  title: "CTA",
  type: "document",
});
