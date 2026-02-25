import { defineField, defineType } from "sanity";

export const publishingDate = defineType({
  type: "object",
  name: "publishingDate",
  title: "Publishing Date",
  fields: [
    defineField({
      type: "date",
      name: "date",
      title: "Date",
      validation: (e) => e.required(),
    }),
  ],
});
