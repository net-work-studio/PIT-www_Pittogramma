import { BookIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { IsbnInput } from "@/sanity/components/isbn-input";
import { tagsField } from "@/sanity/schemaTypes/objects/tag-selector";
import { groups } from "@/sanity/utils/groups";

export const bibliography = defineType({
  type: "document",
  name: "bibliography",
  title: "Bibliography",
  icon: BookIcon,
  groups,
  fields: [
    // 1. ISBN (with Fetch button)
    defineField({
      type: "string",
      name: "isbn",
      title: "ISBN",
      description:
        "Enter ISBN and click 'Fetch Data' to auto-fill book information",
      group: "content",
      components: {
        input: IsbnInput,
      },
    }),
    // 2. Name (autofilled)
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
      group: "content",
    }),
    // 3. Cover (autofilled)
    defineField({
      type: "imageWithMetadata",
      name: "cover",
      title: "Cover",
      group: "content",
    }),
    // 4. Year (autofilled)
    defineField({
      type: "number",
      name: "year",
      title: "Year",
      description: "Publication year",
      group: "content",
      validation: (e) =>
        e
          .min(1000)
          .max(9999)
          .integer()
          .warning("Please enter a valid 4-digit year"),
    }),
    // 5. Description (autofilled)
    defineField({
      type: "text",
      name: "description",
      title: "Description",
      description: "Book description/summary",
      group: "content",
    }),
    // 6. Page Count (autofilled)
    defineField({
      type: "number",
      name: "pageCount",
      title: "Page Count",
      description: "Number of pages",
      group: "content",
      validation: (e) => e.positive().integer(),
    }),
    // 7. Languages (manual)
    defineField({
      type: "array",
      name: "languages",
      title: "Languages",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          name: "language",
          title: "Language",
          to: [{ type: "language" }],
        }),
      ],
    }),
    // 7b. Fetched Languages (suggestion)
    defineField({
      type: "string",
      name: "fetchedLanguages",
      title: "Fetched Language (from Google Books)",
      description:
        "Language code from Google Books - use this to find/create the correct Language reference above",
      group: "content",
      readOnly: true,
    }),
    // 8. Authors (manual reference)
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
    // 9. Fetched Authors (suggestion)
    defineField({
      type: "string",
      name: "fetchedAuthors",
      title: "Fetched Authors (from Google Books)",
      description:
        "Suggestion from Google Books - use this to find/create the correct Author references above",
      group: "content",
      readOnly: true,
    }),
    // 10. Publisher (manual reference)
    defineField({
      type: "reference",
      name: "publisher",
      title: "Publisher",
      to: [{ type: "publisher" }],
      validation: (e) => e.required(),
      group: "content",
    }),
    // 11. Fetched Publisher (suggestion)
    defineField({
      type: "string",
      name: "fetchedPublisher",
      title: "Fetched Publisher (from Google Books)",
      description:
        "Suggestion from Google Books - use this to find/create the correct Publisher reference above",
      group: "content",
      readOnly: true,
    }),
    // 12. Tags (manual)
    tagsField("content"),
    // 13. Fetched Categories (suggestion - new)
    defineField({
      type: "string",
      name: "fetchedCategories",
      title: "Fetched Categories (from Google Books)",
      description:
        "Category suggestions from Google Books - use these to create/select appropriate tags above",
      group: "content",
      readOnly: true,
    }),
    // 14. Affiliate Link (manual)
    defineField({
      type: "url",
      name: "affiliateLink",
      title: "Affiliate Link",
      group: "content",
    }),
    // 15. Categories (autofilled, in details group)
    defineField({
      type: "array",
      name: "categories",
      title: "Categories",
      description: "Book categories/subjects from Google Books",
      group: "content",
      of: [
        defineArrayMember({
          type: "string",
        }),
      ],
    }),
    // 16. Google Books ID (hidden metadata)
    defineField({
      type: "string",
      name: "googleBooksId",
      title: "Google Books ID",
      description: "Reference ID from Google Books API",
      group: "content",
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "cover.image",
      subtitle: "year",
    },
  },
});
