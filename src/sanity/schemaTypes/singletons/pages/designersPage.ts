import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const designersPage = defineType({
  name: "designersPage",
  title: "Designers Page",
  type: "document",
  icon: UserIcon,
  __experimental_omnisearch_visibility: false,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      hidden: true,
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
