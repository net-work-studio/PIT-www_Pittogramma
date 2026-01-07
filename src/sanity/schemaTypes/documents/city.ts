import { defineField, defineType } from "sanity";

export const city = defineType({
  type: "document",
  name: "city",
  title: "City",
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
  ],
});
