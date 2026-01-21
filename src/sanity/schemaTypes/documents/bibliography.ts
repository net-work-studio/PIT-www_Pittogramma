import { defineArrayMember, defineField, defineType } from "sanity";

export const bibliography = defineType({
  type: "document",
  name: "bibliography",
  title: "Bibliography",
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "imageWithMetadata",
      name: "cover",
      title: "Cover",
    }),
    defineField({
      type: "array",
      name: "languages",
      title: "Languages",
      of: [
        defineArrayMember({
          type: "reference",
          name: "language",
          title: "Language",
          to: [{ type: "language" }],
        }),
      ],
    }),
    defineField({
      type: "array",
      name: "authors",
      title: "Authors",
      of: [
        defineArrayMember({
          type: "reference",
          name: "author",
          title: "Tag",
          to: [{ type: "author" }],
        }),
      ],
    }),
    defineField({
      type: "reference",
      name: "publisher",
      title: "Publisher",
      to: [{ type: "publisher" }],
      validation: (e) => e.required(),
    }),
    defineField({
      type: "tagSelector",
      name: "tagSelector",
      title: "Tags",
    }),
    defineField({
      type: "number",
      name: "year",
      title: "Year",
      description: "Publication year",
      validation: (e) =>
        e
          .min(1000)
          .max(9999)
          .integer()
          .warning("Please enter a valid 4-digit year"),
    }),
    defineField({
      type: "url",
      name: "affiliateLink",
      title: "Affiliate Link",
    }),
  ],
});
