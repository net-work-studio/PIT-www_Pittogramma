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
