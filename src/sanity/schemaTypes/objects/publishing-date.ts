import { defineField, defineType } from "sanity";

export const publishingDate = defineType({
  fields: [
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (e) => e.required(),
    }),
  ],
  name: "publishingDate",
  title: "Publishing Date",
  type: "object",
});
