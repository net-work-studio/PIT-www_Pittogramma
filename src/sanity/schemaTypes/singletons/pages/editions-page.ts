import { BookIcon } from "@sanity/icons/Book";
import { defineField, defineType } from "sanity";

export const editionsPage = defineType({
  name: "editionsPage",
  title: "Editions Page",
  type: "document",
  icon: BookIcon,
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
      group: "content",
      initialValue: "Editions",
      readOnly: true,
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
