import { defineField, defineType } from "sanity";

export const tag = defineType({
  type: "document",
  name: "tag",
  title: "Tag",
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
  ],
});
