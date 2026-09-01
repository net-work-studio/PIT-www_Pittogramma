import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineField, defineType } from "sanity";

export const journalPage = defineType({
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
        "Select an article to feature prominently at the top of the page",
      group: "content",
      name: "featuredArticle",
      title: "Featured Article",
      to: [{ type: "journal" }],
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
  groups: [
    { default: true, name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
  ],
  icon: DocumentTextIcon,
  name: "journalPage",
  title: "Journal Page",
  type: "document",
});
