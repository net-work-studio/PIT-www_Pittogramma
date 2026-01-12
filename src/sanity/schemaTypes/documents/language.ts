import { defineField, defineType } from "sanity";

export const language = defineType({
  type: "document",
  name: "language",
  title: "Language",
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
  ],
});
