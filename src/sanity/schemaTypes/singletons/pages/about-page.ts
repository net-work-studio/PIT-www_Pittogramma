import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { defineArrayMember, defineField, defineType } from "sanity";
import { groups } from "@/sanity/utils/groups";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  icon: InfoOutlineIcon,
  __experimental_omnisearch_visibility: false,
  groups,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      readOnly: true,
      initialValue: "About",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      group: "content",
      description:
        "The first paragraph acts as the page intro. Mix text and media blocks freely.",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "singleMediaBlock" }),
        defineArrayMember({ type: "sideBySideMediaBlock" }),
        defineArrayMember({ type: "threeSideBySideMediaBlock" }),
        defineArrayMember({ type: "gridFourMediaBlock" }),
      ],
    }),
    defineField({
      name: "supporters",
      title: "Supporters",
      type: "array",
      group: "content",
      description: "Logos displayed at the bottom of the About page.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "contributor" }],
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoModule",
      group: "seo",
    }),
  ],
});
