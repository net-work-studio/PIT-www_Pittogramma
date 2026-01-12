import { defineField, defineType } from "sanity";

export const author = defineType({
  type: "document",
  name: "author",
  title: "Author",
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
  ],
});
