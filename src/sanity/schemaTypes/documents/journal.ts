import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { JOURNAL_LABELS } from "@/lib/journal-labels";
import { tagsField } from "@/sanity/schemaTypes/objects/tag-selector";
import { groups } from "@/sanity/utils/groups";

export const journal = defineType({
  type: "document",
  name: "journal",
  title: "Journal",
  icon: DocumentTextIcon,
  groups,
  fields: [
    defineField({
      type: "string",
      name: "title",
      title: "Title",
      group: "metadata",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      group: "metadata",
      options: {
        source: "title",
      },
      validation: (e) => e.required(),
    }),
    defineField({
      type: "publishingDate",
      name: "publishingDate",
      title: "Publishing Date",
      group: "metadata",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "string",
      name: "label",
      title: "Label",
      group: "metadata",
      options: {
        list: JOURNAL_LABELS,
        layout: "radio",
      },
      initialValue: "articles",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "imageWithMetadata",
      name: "cover",
      title: "Cover",
      group: "content",
      validation: (e) => e.required(),
    }),
    tagsField("content"),
    defineField({
      type: "array",
      name: "authors",
      title: "Authors",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          name: "author",
          title: "Author",
          to: [{ type: "person" }],
          options: {
            filter: '"author" in roles',
          },
        }),
      ],
    }),
    defineField({
      type: "text",
      name: "excerpt",
      title: "Excerpt",
      group: "content",
      description: "A short summary of the article",
    }),
    defineField({
      type: "array",
      name: "content",
      title: "Content",
      group: "content",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "singleMediaBlock" }),
        defineArrayMember({ type: "sideBySideMediaBlock" }),
        defineArrayMember({ type: "threeSideBySideMediaBlock" }),
        defineArrayMember({ type: "gridFourMediaBlock" }),
      ],
    }),
    defineField({
      type: "seoModule",
      name: "seo",
      title: "SEO",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      label: "label",
      media: "cover.image",
    },
    prepare({ title, label, media }) {
      const labels = Object.fromEntries(
        JOURNAL_LABELS.map((opt) => [opt.value, opt.title])
      );
      return {
        title,
        subtitle: label ? labels[label] ?? label : undefined,
        media,
      };
    },
  },
});
