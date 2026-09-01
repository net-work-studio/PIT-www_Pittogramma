import { defineField, defineType } from "sanity";
import {
  httpsUrlValidation,
  httpUrlValidation,
} from "@/sanity/utils/validation";

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
      description:
        "Controls what visitors see on the public website. Keep this set to Live unless you are publishing a planned holding page.",
      group: "publicSite",
      initialValue: "live",
      name: "publicSiteMode",
      options: {
        layout: "radio",
        list: [
          { title: "Live", value: "live" },
          { title: "Countdown", value: "countdown" },
          { title: "Maintenance", value: "maintenance" },
        ],
      },
      title: "Public site mode",
      type: "string",
    }),
    defineField({
      description:
        "Shown to visitors while the public site is in Countdown mode. Fill in the launch time before publishing this mode.",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({
          name: "message",
          rows: 3,
          title: "Message",
          type: "text",
        }),
        defineField({
          name: "launchAt",
          title: "Launch date and time",
          type: "datetime",
        }),
      ],
      group: "publicSite",
      hidden: ({ parent }) => parent?.publicSiteMode !== "countdown",
      name: "countdown",
      title: "Countdown message",
      type: "object",
    }),
    defineField({
      description:
        "Shown to visitors while the public site is in Maintenance mode.",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({
          name: "message",
          rows: 3,
          title: "Message",
          type: "text",
        }),
        defineField({
          name: "returnAt",
          title: "Expected return date and time",
          type: "datetime",
        }),
        defineField({
          name: "contactUrl",
          title: "Contact URL",
          type: "url",
          validation: httpUrlValidation,
        }),
      ],
      group: "publicSite",
      hidden: ({ parent }) => parent?.publicSiteMode !== "maintenance",
      name: "maintenance",
      title: "Maintenance message",
      type: "object",
    }),
    defineField({
      description:
        "Control which Indexes are public and the controls available on each one.",
      fields: [
        defineField({
          initialValue: true,
          name: "headerSearchEnabled",
          title: "Header search enabled",
          type: "boolean",
        }),
        defineField({
          fields: [
            defineField({
              initialValue: true,
              name: "published",
              readOnly: true,
              title: "Published",
              type: "boolean",
            }),
            defineField({
              initialValue: ["list", "grid", "map"],
              name: "enabledViews",
              of: [{ type: "string" }],
              options: { layout: "grid", list: ["list", "grid", "map"] },
              title: "Enabled views",
              type: "array",
              validation: (Rule) => Rule.min(1),
            }),
            defineField({
              initialValue: true,
              name: "searchEnabled",
              title: "Search enabled",
              type: "boolean",
            }),
          ],
          initialValue: {
            enabledViews: ["list", "grid", "map"],
            published: true,
            searchEnabled: true,
          },
          name: "studiosAgencies",
          title: "Studios & Agencies",
          type: "object",
        }),
        defineField({
          fields: [
            defineField({
              initialValue: true,
              name: "published",
              title: "Published",
              type: "boolean",
            }),
            defineField({
              initialValue: ["list", "grid", "map"],
              name: "enabledViews",
              of: [{ type: "string" }],
              options: { layout: "grid", list: ["list", "grid", "map"] },
              title: "Enabled views",
              type: "array",
              validation: (Rule) => Rule.min(1),
            }),
            defineField({
              initialValue: true,
              name: "searchEnabled",
              title: "Search enabled",
              type: "boolean",
            }),
          ],
          initialValue: {
            enabledViews: ["list", "grid", "map"],
            published: true,
            searchEnabled: true,
          },
          name: "typeFoundries",
          title: "Type Foundries",
          type: "object",
        }),
        defineField({
          fields: [
            defineField({
              initialValue: true,
              name: "published",
              title: "Published",
              type: "boolean",
            }),
            defineField({
              initialValue: ["list", "grid", "map"],
              name: "enabledViews",
              of: [{ type: "string" }],
              options: { layout: "grid", list: ["list", "grid", "map"] },
              title: "Enabled views",
              type: "array",
              validation: (Rule) => Rule.min(1),
            }),
            defineField({
              initialValue: true,
              name: "searchEnabled",
              title: "Search enabled",
              type: "boolean",
            }),
          ],
          initialValue: {
            enabledViews: ["list", "grid", "map"],
            published: true,
            searchEnabled: true,
          },
          name: "institutes",
          title: "Institutes",
          type: "object",
        }),
        defineField({
          fields: [
            defineField({
              initialValue: true,
              name: "published",
              title: "Published",
              type: "boolean",
            }),
            defineField({
              initialValue: ["list", "grid", "map"],
              name: "enabledViews",
              of: [{ type: "string" }],
              options: { layout: "grid", list: ["list", "grid", "map"] },
              title: "Enabled views",
              type: "array",
              validation: (Rule) => Rule.min(1),
            }),
            defineField({
              initialValue: true,
              name: "searchEnabled",
              title: "Search enabled",
              type: "boolean",
            }),
          ],
          initialValue: {
            enabledViews: ["list", "grid", "map"],
            published: true,
            searchEnabled: true,
          },
          name: "bookshops",
          title: "Bookshops",
          type: "object",
        }),
        defineField({
          fields: [
            defineField({
              initialValue: true,
              name: "published",
              title: "Published",
              type: "boolean",
            }),
            defineField({
              initialValue: ["list", "grid"],
              name: "enabledViews",
              of: [{ type: "string" }],
              options: { layout: "grid", list: ["list", "grid"] },
              title: "Enabled views",
              type: "array",
              validation: (Rule) => Rule.min(1),
            }),
            defineField({
              initialValue: true,
              name: "searchEnabled",
              title: "Search enabled",
              type: "boolean",
            }),
          ],
          initialValue: {
            enabledViews: ["list", "grid"],
            published: true,
            searchEnabled: true,
          },
          name: "websites",
          title: "Websites",
          type: "object",
        }),
        defineField({
          fields: [
            defineField({
              initialValue: true,
              name: "published",
              title: "Published",
              type: "boolean",
            }),
            defineField({
              initialValue: true,
              name: "searchEnabled",
              title: "Search enabled",
              type: "boolean",
            }),
          ],
          initialValue: { published: true, searchEnabled: true },
          name: "glossary",
          title: "Glossary",
          type: "object",
        }),
        defineField({
          fields: [
            defineField({
              initialValue: true,
              name: "published",
              title: "Published",
              type: "boolean",
            }),
          ],
          initialValue: { published: true },
          name: "bibliography",
          title: "Bibliography",
          type: "object",
        }),
      ],
      group: "indexAvailability",
      name: "indexAvailability",
      title: "Index availability",
      type: "object",
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
      description:
        "External Notion form where visitors can report an issue with the platform.",
      group: "footer",
      name: "issueReportFormUrl",
      title: "Issue report form URL",
      type: "url",
      validation: httpsUrlValidation,
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
    { name: "publicSite", title: "Public site" },
    { name: "indexAvailability", title: "Index availability" },
    { name: "footer", title: "Footer" },
    { name: "contributions", title: "Contributions" },
    { name: "tracking", title: "Tracking" },
  ],
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
});
