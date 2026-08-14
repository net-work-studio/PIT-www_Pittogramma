import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { LinkIcon } from "@sanity/icons/Link";
import { defineArrayMember, defineField, defineType } from "sanity";
import { JOURNAL_LABELS } from "@/lib/journal-labels";
import { tagsField } from "@/sanity/schemaTypes/objects/tag-selector";
import { groups } from "@/sanity/utils/groups";
import { httpUrlValidation } from "@/sanity/utils/validation";

const journalReferenceTargets = [
  { type: "bibliography" },
  { type: "webSource" },
  { type: "glossary" },
  { type: "person" },
  { type: "studio" },
  { type: "typeFoundry" },
  { type: "institute" },
  { type: "bookshop" },
  { type: "project" },
  { type: "interview" },
  { type: "journal" },
];

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
        defineArrayMember({
          type: "block",
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
              { title: "Underline", value: "underline" },
              { title: "Strike", value: "strike-through" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: httpUrlValidation,
                  },
                ],
              },
              {
                name: "footnote",
                type: "object",
                title: "Footnote",
                fields: [
                  {
                    name: "note",
                    type: "text",
                    title: "Note",
                    rows: 4,
                    validation: (rule) => rule.required(),
                  },
                  {
                    name: "url",
                    type: "url",
                    title: "URL",
                    validation: httpUrlValidation,
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({ type: "singleMediaBlock" }),
        defineArrayMember({ type: "sideBySideMediaBlock" }),
        defineArrayMember({ type: "threeSideBySideMediaBlock" }),
        defineArrayMember({ type: "gridFourMediaBlock" }),
        defineArrayMember({
          type: "object",
          name: "codeBlock",
          title: "Code block",
          fields: [
            defineField({
              type: "text",
              name: "code",
              title: "Text",
              rows: 5,
              description: "Spacing and line breaks are preserved on the site.",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { code: "code" },
            prepare({ code }) {
              const text = typeof code === "string" ? code : "";
              return {
                title: "Code block",
                subtitle: text.replace(/\s+/g, " ").slice(0, 100),
              };
            },
          },
        }),
        defineArrayMember({
          type: "object",
          name: "referencesBlock",
          title: "References",
          icon: LinkIcon,
          fields: [
            defineField({
              type: "string",
              name: "title",
              title: "Title",
              initialValue: "References",
            }),
            defineField({
              type: "array",
              name: "references",
              title: "References",
              of: [
                defineArrayMember({
                  type: "reference",
                  name: "reference",
                  title: "Reference",
                  to: journalReferenceTargets,
                }),
              ],
              validation: (rule) => rule.required().min(1).unique(),
            }),
          ],
          preview: {
            select: {
              title: "title",
              references: "references",
            },
            prepare({ title, references }) {
              const count = Array.isArray(references) ? references.length : 0;
              return {
                title: title || "References",
                subtitle: count === 1 ? "1 reference" : `${count} references`,
              };
            },
          },
        }),
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
