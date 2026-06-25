import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const journalPage = defineType({
  name: "journalPage",
  title: "Journal Page",
  type: "document",
  icon: DocumentTextIcon,
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
      name: "featuredArticle",
      title: "Featured Article",
      type: "reference",
      to: [{ type: "journal" }],
      group: "content",
      description:
        "Select an article to feature prominently at the top of the page",
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
