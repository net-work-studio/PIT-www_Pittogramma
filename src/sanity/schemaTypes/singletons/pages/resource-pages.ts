import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineField, defineType } from "sanity";

import { RESOURCE_PAGE_DEFAULTS } from "@/lib/resource-page";

function defineResourcePage({
  introText,
  title,
  type,
}: (typeof RESOURCE_PAGE_DEFAULTS)[keyof typeof RESOURCE_PAGE_DEFAULTS]) {
  return defineType({
    __experimental_omnisearch_visibility: false,
    fields: [
      defineField({
        group: "content",
        initialValue: title,
        name: "title",
        readOnly: true,
        title: "Title",
        type: "string",
      }),
      defineField({
        group: "content",
        initialValue: introText,
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
    icon: DocumentTextIcon,
    name: type,
    title: `${title} Page`,
    type: "document",
  });
}

export const bibliographyPage = defineResourcePage(
  RESOURCE_PAGE_DEFAULTS.bibliography
);
export const bookshopsPage = defineResourcePage(
  RESOURCE_PAGE_DEFAULTS.bookshops
);
export const glossaryPage = defineResourcePage(RESOURCE_PAGE_DEFAULTS.glossary);
export const institutesPage = defineResourcePage(
  RESOURCE_PAGE_DEFAULTS.institutes
);
export const studiosAgenciesPage = defineResourcePage(
  RESOURCE_PAGE_DEFAULTS.studiosAgencies
);
export const typeFoundriesPage = defineResourcePage(
  RESOURCE_PAGE_DEFAULTS.typeFoundries
);
export const websitesPage = defineResourcePage(RESOURCE_PAGE_DEFAULTS.websites);
