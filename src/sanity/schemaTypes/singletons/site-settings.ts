import { defineField, defineType } from "sanity";
import { httpUrlValidation } from "@/sanity/utils/validation";

export const siteSettings = defineType({
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      hidden: true,
      name: "title",
      readOnly: true,
      title: "Title",
      type: "string",
    }),
    defineField({
      description: "Default SEO settings for the site and homepage",
      group: "seo",
      name: "seo",
      title: "Default SEO",
      type: "seoModule",
    }),
    defineField({
      group: "footer",
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      validation: httpUrlValidation,
    }),
    defineField({
      group: "footer",
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
      validation: httpUrlValidation,
    }),
    defineField({
      group: "contributions",
      initialValue:
        "https://app.notion.com/p/3b97f12bcce680279120ebe629e655bf?pvs=106",
      name: "studioAgencyContributionUrl",
      title: "Studio / Agency form URL",
      type: "url",
      validation: httpUrlValidation,
    }),
    defineField({
      group: "contributions",
      initialValue:
        "https://app.notion.com/p/a8a7f12bcce683f5b15401c2e5428e7e?pvs=106",
      name: "typeFoundriesContributionUrl",
      title: "Type Foundries form URL",
      type: "url",
      validation: httpUrlValidation,
    }),
    defineField({
      group: "contributions",
      initialValue:
        "https://app.notion.com/p/f867f12bcce68299a95281a9676b9c37?pvs=106",
      name: "bibliographyContributionUrl",
      title: "Bibliography form URL",
      type: "url",
      validation: httpUrlValidation,
    }),
    defineField({
      description:
        "The utm_source parameter for outbound links (e.g., 'pittogramma')",
      group: "tracking",
      initialValue: "pittogramma",
      name: "utmSource",
      title: "UTM Source",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      description: "The utm_medium parameter (e.g., 'website')",
      group: "tracking",
      initialValue: "website",
      name: "utmMedium",
      title: "UTM Medium",
      type: "string",
    }),
    defineField({
      description: "The utm_campaign parameter (e.g., 'resources')",
      group: "tracking",
      initialValue: "resources",
      name: "utmCampaign",
      title: "UTM Campaign",
      type: "string",
    }),
  ],
  groups: [
    { default: true, name: "seo", title: "SEO" },
    { name: "footer", title: "Footer" },
    { name: "contributions", title: "Contributions" },
    { name: "tracking", title: "Tracking" },
  ],
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
});
