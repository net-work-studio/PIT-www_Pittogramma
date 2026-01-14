import { defineArrayMember, defineField, defineType } from "sanity";

export const studio = defineType({
  type: "document",
  name: "studio",
  title: "Studio",
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "reference",
      name: "category",
      title: "Category",
      to: [{ type: "category" }],
      validation: (e) => e.required(),
    }),
    defineField({
      type: "tagSelector",
      name: "tagSelector",
      title: "Tags",
    }),
    defineField({
      type: "array",
      name: "locations",
      title: "Locations",
      of: [
        defineArrayMember({
          type: "location",
        }),
      ],
    }),
    defineField({
      type: "socialLinks",
      name: "socialLinks",
      title: "Social Links",
    }),
  ],
});
