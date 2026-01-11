import { defineField, defineType } from "sanity";

export const publisher = defineType({
  type: "document",
  name: "publisher",
  title: "Publisher",
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
  ],
});
