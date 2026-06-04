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
      type: "coverMedia",
      name: "cover",
      title: "Cover",
      group: "content",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "coverMedia",
      name: "featuredCover",
      title: "Featured Cover",
      group: "content",
      description:
        "Optional cover used when this article appears as a featured hero. Falls back to the regular cover if empty.",
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
  orderings: [
    {
      title: "Publishing Date, Newest",
      name: "publishingDateDesc",
      by: [{ field: "publishingDate.date", direction: "desc" }],
    },
    {
      title: "Publishing Date, Oldest",
      name: "publishingDateAsc",
      by: [{ field: "publishingDate.date", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      label: "label",
      date: "publishingDate.date",
      media: "cover.image",
    },
    prepare({ title, label, date, media }) {
      const labels = Object.fromEntries(
        JOURNAL_LABELS.map((opt) => [opt.value, opt.title])
      );
      const labelText = label ? (labels[label] ?? label) : undefined;
      const parts = [date, labelText].filter(Boolean);
      return {
        title,
        subtitle: parts.length ? parts.join(" – ") : undefined,
        media,
      };
    },
  },
});
