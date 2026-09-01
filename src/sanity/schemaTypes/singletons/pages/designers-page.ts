import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";

export const designersPage = defineType({
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
  groups: [
    { default: true, name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
  ],
  icon: UserIcon,
  name: "designersPage",
  title: "Designers Page",
  type: "document",
});
