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
  fields: [
    defineField({
      group: "metadata",
      name: "title",
      title: "Title",
      type: "string",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "metadata",
      name: "slug",
      options: {
        source: "title",
      },
      title: "Slug",
      type: "slug",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "metadata",
      name: "publishingDate",
      title: "Publishing Date",
      type: "publishingDate",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "metadata",
      initialValue: "articles",
      name: "label",
      options: {
        layout: "radio",
        list: JOURNAL_LABELS,
      },
      title: "Label",
      type: "string",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "content",
      name: "cover",
      title: "Cover",
      type: "coverMedia",
      validation: (e) => e.required(),
    }),
    defineField({
      description:
        "Optional cover used when this article appears as a featured hero. Falls back to the regular cover if empty.",
      group: "content",
      name: "featuredCover",
      title: "Featured Cover",
      type: "coverMedia",
    }),
    tagsField("content"),
    defineField({
      group: "content",
      name: "authors",
      of: [
        defineArrayMember({
          name: "author",
          options: {
            filter: '"author" in roles',
          },
          title: "Author",
          to: [{ type: "person" }],
          type: "reference",
        }),
      ],
      title: "Authors",
      type: "array",
    }),
    defineField({
      description: "A short summary of the article",
      group: "content",
      name: "excerpt",
      title: "Excerpt",
      type: "text",
    }),
    defineField({
      group: "content",
      name: "content",
      of: [
        defineArrayMember({
          marks: {
            annotations: [
              {
                fields: [
                  {
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: httpUrlValidation,
                  },
                ],
                name: "link",
                title: "Link",
                type: "object",
              },
              {
                fields: [
                  {
                    name: "note",
                    rows: 4,
                    title: "Note",
                    type: "text",
                    validation: (rule) => rule.required(),
                  },
                  {
                    name: "url",
                    title: "URL",
                    type: "url",
                    validation: httpUrlValidation,
                  },
                ],
                name: "footnote",
                title: "Footnote",
                type: "object",
              },
            ],
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
              { title: "Underline", value: "underline" },
              { title: "Strike", value: "strike-through" },
            ],
          },
          type: "block",
        }),
        defineArrayMember({ type: "singleMediaBlock" }),
        defineArrayMember({ type: "sideBySideMediaBlock" }),
        defineArrayMember({ type: "threeSideBySideMediaBlock" }),
        defineArrayMember({ type: "gridFourMediaBlock" }),
        defineArrayMember({
          fields: [
            defineField({
              description: "Spacing and line breaks are preserved on the site.",
              name: "code",
              rows: 5,
              title: "Text",
              type: "text",
              validation: (rule) => rule.required(),
            }),
          ],
          name: "codeBlock",
          preview: {
            prepare({ code }) {
              const text = typeof code === "string" ? code : "";
              return {
                subtitle: text.replace(/\s+/g, " ").slice(0, 100),
                title: "Code block",
              };
            },
            select: { code: "code" },
          },
          title: "Code block",
          type: "object",
        }),
        defineArrayMember({
          fields: [
            defineField({
              initialValue: "References",
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "references",
              of: [
                defineArrayMember({
                  name: "reference",
                  title: "Reference",
                  to: journalReferenceTargets,
                  type: "reference",
                }),
              ],
              title: "References",
              type: "array",
              validation: (rule) => rule.required().min(1).unique(),
            }),
          ],
          icon: LinkIcon,
          name: "referencesBlock",
          preview: {
            prepare({ title, references }) {
              const count = Array.isArray(references) ? references.length : 0;
              return {
                subtitle: count === 1 ? "1 reference" : `${count} references`,
                title: title || "References",
              };
            },
            select: {
              references: "references",
              title: "title",
            },
          },
          title: "References",
          type: "object",
        }),
      ],
      title: "Content",
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
  icon: DocumentTextIcon,
  name: "journal",
  orderings: [
    {
      by: [{ direction: "desc", field: "publishingDate.date" }],
      name: "publishingDateDesc",
      title: "Publishing Date, Newest",
    },
    {
      by: [{ direction: "asc", field: "publishingDate.date" }],
      name: "publishingDateAsc",
      title: "Publishing Date, Oldest",
    },
  ],
  preview: {
    prepare({ title, label, date, media }) {
      const labels = Object.fromEntries(
        JOURNAL_LABELS.map((opt) => [opt.value, opt.title])
      );
      const labelText = label ? (labels[label] ?? label) : undefined;
      const parts = [date, labelText].filter(Boolean);
      return {
        media,
        subtitle: parts.length ? parts.join(" – ") : undefined,
        title,
      };
    },
    select: {
      date: "publishingDate.date",
      label: "label",
      media: "cover.image",
      title: "title",
    },
  },
  title: "Journal",
  type: "document",
});
