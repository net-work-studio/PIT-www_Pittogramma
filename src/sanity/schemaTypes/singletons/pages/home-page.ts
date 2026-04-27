import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { groups } from "@/sanity/utils/groups";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
  __experimental_omnisearch_visibility: false,
  groups,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      readOnly: true,
    }),
    defineField({
      name: "introText",
      title: "Intro Text",
      type: "text",
      group: "content",
      rows: 3,
      validation: (Rule) => Rule.required().max(170),
    }),
    defineField({
      name: "featuredItem",
      title: "Featured Item",
      type: "reference",
      to: [{ type: "project" }, { type: "interview" }, { type: "journal" }],
      group: "content",
      description:
        "Select a project, interview, or journal article to feature as the hero. If empty, the latest published item is used.",
    }),
    defineField({
      name: "midPageCta",
      title: "Mid Page CTA",
      type: "reference",
      to: [{ type: "cta" }],
      group: "content",
      description:
        "CTA displayed between the first and second content sections",
    }),
    defineField({
      name: "endOfPageCta",
      title: "End of Page CTA",
      type: "reference",
      to: [{ type: "cta" }],
      group: "content",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoModule",
      group: "seo",
    }),
  ],
});
