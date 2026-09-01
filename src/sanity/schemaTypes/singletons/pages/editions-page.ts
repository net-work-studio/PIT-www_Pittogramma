import { BookIcon } from "@sanity/icons/Book";
import { defineField, defineType } from "sanity";

export const editionsPage = defineType({
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      group: "content",
      initialValue: "Editions",
      name: "title",
      readOnly: true,
      title: "Title",
      type: "string",
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
  icon: BookIcon,
  name: "editionsPage",
  title: "Editions Page",
  type: "document",
});
