import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { defineArrayMember, defineField, defineType } from "sanity";
import { groups } from "@/sanity/utils/groups";

export const aboutPage = defineType({
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      group: "content",
      initialValue: "About",
      name: "title",
      readOnly: true,
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      description:
        "The first paragraph acts as the page intro. Mix text and media blocks freely.",
      group: "content",
      name: "content",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "singleMediaBlock" }),
        defineArrayMember({ type: "sideBySideMediaBlock" }),
        defineArrayMember({ type: "threeSideBySideMediaBlock" }),
        defineArrayMember({ type: "gridFourMediaBlock" }),
      ],
      title: "Content",
      type: "array",
    }),
    defineField({
      description: "Logos displayed at the bottom of the About page.",
      group: "content",
      name: "supporters",
      of: [
        defineArrayMember({
          to: [{ type: "contributor" }],
          type: "reference",
        }),
      ],
      title: "Supporters",
      type: "array",
    }),
    defineField({
      group: "seo",
      name: "seo",
      title: "SEO",
      type: "seoModule",
    }),
  ],
  groups,
  icon: InfoOutlineIcon,
  name: "aboutPage",
  title: "About Page",
  type: "document",
});
