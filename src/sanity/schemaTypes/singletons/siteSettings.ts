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
    }),
    defineField({
      name: "homeIntro",
      title: "Home Intro",
      type: "text",
      group: "introTexts",
      validation: (Rule) => Rule.required().max(128),
    }),
    defineField({
      name: "projectsIntro",
      title: "Projects Intro",
      type: "text",
      group: "introTexts",
      validation: (Rule) => Rule.required().max(128),
    }),
    defineField({
      name: "interviewsIntro",
      title: "Interviews Intro",
      type: "text",
      group: "introTexts",
      validation: (Rule) => Rule.required().max(128),
    }),
    defineField({
      name: "designersIntro",
      title: "Designers Intro",
      type: "text",
      group: "introTexts",
      validation: (Rule) => Rule.required().max(128),
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
