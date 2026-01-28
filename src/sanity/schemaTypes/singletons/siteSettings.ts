import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  __experimental_omnisearch_visibility: false,
  groups: [
    { name: "seo", title: "SEO", default: true },
    { name: "tracking", title: "Tracking" },
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
      name: "seo",
      title: "Default SEO",
      type: "seoModule",
      group: "seo",
      description: "Default SEO settings for the site and homepage",
    }),
    defineField({
      name: "utmSource",
      title: "UTM Source",
      type: "string",
      description:
        "The utm_source parameter for outbound links (e.g., 'pittogramma')",
      validation: (Rule) => Rule.required(),
      initialValue: "pittogramma",
      group: "tracking",
    }),
    defineField({
      name: "utmMedium",
      title: "UTM Medium",
      type: "string",
      description: "The utm_medium parameter (e.g., 'website')",
      initialValue: "website",
      group: "tracking",
    }),
    defineField({
      name: "utmCampaign",
      title: "UTM Campaign",
      type: "string",
      description: "The utm_campaign parameter (e.g., 'resources')",
      initialValue: "resources",
      group: "tracking",
    }),
  ],
});
