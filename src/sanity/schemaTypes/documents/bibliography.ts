import { BookIcon } from "@sanity/icons/Book";
import { defineArrayMember, defineField, defineType } from "sanity";
import { IsbnInput } from "@/sanity/components/isbn-input";
import { tagsField } from "@/sanity/schemaTypes/objects/tag-selector";
import { groups } from "@/sanity/utils/groups";
import { httpUrlValidation } from "@/sanity/utils/validation";

export const bibliography = defineType({
  fields: [
    // 1. ISBN (with Fetch button)
    defineField({
      components: {
        input: IsbnInput,
      },
      description:
        "Enter ISBN and click 'Fetch Data' to auto-fill book information",
      group: "content",
      name: "isbn",
      title: "ISBN",
      type: "string",
    }),
    // 2. Name (autofilled)
    defineField({
      group: "content",
      name: "name",
      title: "Name",
      type: "string",
      validation: (e) => e.required(),
    }),
    // 3. Cover (autofilled)
    defineField({
      group: "content",
      name: "cover",
      title: "Cover",
      type: "coverMedia",
    }),
    // 4. Year (autofilled)
    defineField({
      description: "Publication year",
      group: "content",
      name: "year",
      title: "Year",
      type: "number",
      validation: (e) =>
        e
          .min(1000)
          .max(9999)
          .integer()
          .warning("Please enter a valid 4-digit year"),
    }),
    // 5. Description (autofilled)
    defineField({
      description: "Book description/summary",
      group: "content",
      name: "description",
      title: "Description",
      type: "text",
    }),
    // 6. Page Count (autofilled)
    defineField({
      description: "Number of pages",
      group: "content",
      name: "pageCount",
      title: "Page Count",
      type: "number",
      validation: (e) => e.positive().integer(),
    }),
    // 7. Languages (manual)
    defineField({
      group: "content",
      name: "languages",
      of: [
        defineArrayMember({
          name: "language",
          title: "Language",
          to: [{ type: "language" }],
          type: "reference",
        }),
      ],
      title: "Languages",
      type: "array",
    }),
    // 7b. Fetched Languages (suggestion)
    defineField({
      description:
        "Language code from Google Books - use this to find/create the correct Language reference above",
      group: "content",
      name: "fetchedLanguages",
      readOnly: true,
      title: "Fetched Language (from Google Books)",
      type: "string",
    }),
    // 8. Authors (manual reference)
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
    // 9. Fetched Authors (suggestion)
    defineField({
      description:
        "Suggestion from Google Books - use this to find/create the correct Author references above",
      group: "content",
      name: "fetchedAuthors",
      readOnly: true,
      title: "Fetched Authors (from Google Books)",
      type: "string",
    }),
    // 10. Publisher (manual reference)
    defineField({
      group: "content",
      name: "publisher",
      title: "Publisher",
      to: [{ type: "publisher" }],
      type: "reference",
      validation: (e) => e.required(),
    }),
    // 11. Fetched Publisher (suggestion)
    defineField({
      description:
        "Suggestion from Google Books - use this to find/create the correct Publisher reference above",
      group: "content",
      name: "fetchedPublisher",
      readOnly: true,
      title: "Fetched Publisher (from Google Books)",
      type: "string",
    }),
    // 12. Tags (manual)
    tagsField("content"),
    // 13. Fetched Categories (suggestion - new)
    defineField({
      description:
        "Category suggestions from Google Books - use these to create/select appropriate tags above",
      group: "content",
      name: "fetchedCategories",
      readOnly: true,
      title: "Fetched Categories (from Google Books)",
      type: "string",
    }),
    // 14. Affiliate Link (manual)
    defineField({
      group: "content",
      name: "affiliateLink",
      title: "Affiliate Link",
      type: "url",
      validation: httpUrlValidation,
    }),
    // 15. Categories (autofilled, in details group)
    defineField({
      description: "Book categories/subjects from Google Books",
      group: "content",
      name: "categories",
      of: [
        defineArrayMember({
          type: "string",
        }),
      ],
      title: "Categories",
      type: "array",
    }),
    // 16. Google Books ID (hidden metadata)
    defineField({
      description: "Reference ID from Google Books API",
      group: "content",
      hidden: true,
      name: "googleBooksId",
      readOnly: true,
      title: "Google Books ID",
      type: "string",
    }),
  ],
  groups,
  icon: BookIcon,
  name: "bibliography",
  preview: {
    select: {
      media: "cover.image",
      subtitle: "year",
      title: "name",
    },
  },
  title: "Bibliography",
  type: "document",
});
