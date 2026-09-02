import { HomeIcon } from "@sanity/icons/Home";
import { defineField, defineType } from "sanity";
import { groups } from "@/sanity/utils/groups";

export const homePage = defineType({
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      group: "content",
      name: "title",
      readOnly: true,
      title: "Title",
      type: "string",
    }),
    defineField({
      group: "content",
      name: "introText",
      rows: 3,
      title: "Intro Text",
      type: "text",
      validation: (Rule) => Rule.required().max(170),
    }),
    defineField({
      description:
        "Select a project, interview, journal article, or event to feature as the hero. If empty, the latest published item is used.",
      group: "content",
      name: "featuredItem",
      title: "Featured Item",
      to: [
        { type: "project" },
        { type: "interview" },
        { type: "journal" },
        { type: "event" },
      ],
      type: "reference",
    }),
    defineField({
      description:
        "CTA displayed between the first and second content sections",
      group: "content",
      name: "midPageCta",
      title: "Mid Page CTA",
      to: [{ type: "cta" }],
      type: "reference",
    }),
    defineField({
      group: "content",
      name: "endOfPageCta",
      title: "End of Page CTA",
      to: [{ type: "cta" }],
      type: "reference",
    }),
    defineField({
      group: "seo",
      name: "seo",
      title: "SEO",
      type: "seoModule",
    }),
  ],
  groups,
  icon: HomeIcon,
  name: "homePage",
  title: "Home Page",
  type: "document",
});
