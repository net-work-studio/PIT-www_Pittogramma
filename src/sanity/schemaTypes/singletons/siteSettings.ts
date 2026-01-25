// schemas/singletons/pageSettings.ts
import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Hide from search and prevent multiple instances
  __experimental_omnisearch_visibility: false,
  groups: [
    {
      name: "introTexts",
      title: "Intro Texts",
      default: true,
    },
    {
      name: "tracking",
      title: "Tracking & Analytics",
    },
  ],
  fieldsets: [
    {
      name: "collectionPages",
      title: "Collection Pages",
      options: { collapsible: true, collapsed: false },
    },
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
      name: "homeIntro",
      title: "Home Intro",
      type: "text",
      group: "introTexts",
      validation: (Rule) => Rule.required().max(170),
    }),
    defineField({
      name: "projectsIntro",
      title: "Projects Intro",
      type: "text",
      group: "introTexts",
      validation: (Rule) => Rule.required().max(170),
    }),
    defineField({
      name: "interviewsIntro",
      title: "Interviews Intro",
      type: "text",
      group: "introTexts",
      validation: (Rule) => Rule.required().max(170),
    }),
    defineField({
      name: "designersIntro",
      title: "Designers Intro",
      type: "text",
      group: "introTexts",
      validation: (Rule) => Rule.required().max(170),
    }),

    // UTM Tracking Settings
    defineField({
      name: "utmSource",
      title: "UTM Source",
      type: "string",
      group: "tracking",
      description:
        "The utm_source parameter for outbound links (e.g., 'pittogramma')",
      validation: (Rule) => Rule.required(),
      initialValue: "pittogramma",
    }),
    defineField({
      name: "utmMedium",
      title: "UTM Medium",
      type: "string",
      group: "tracking",
      description: "The utm_medium parameter (e.g., 'website')",
      initialValue: "website",
    }),
    defineField({
      name: "utmCampaign",
      title: "UTM Campaign",
      type: "string",
      group: "tracking",
      description: "The utm_campaign parameter (e.g., 'resources')",
      initialValue: "resources",
    }),

    defineField({
      name: "projectsPage",
      title: "Projects Page",
      type: "object",
      fieldset: "collectionPages",
      fields: [
        defineField({
          name: "seo",
          title: "SEO",
          type: "seoModule",
        }),
      ],
    }),
    // Add other collection pages as needed
    defineField({
      name: "blogPage",
      title: "Blog Page",
      type: "object",
      fieldset: "collectionPages",
      fields: [
        defineField({
          name: "seo",
          title: "SEO",
          type: "seoModule",
        }),
      ],
    }),
  ],
});
