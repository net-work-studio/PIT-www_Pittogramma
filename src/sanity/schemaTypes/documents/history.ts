import { defineArrayMember, defineField, defineType } from "sanity";

export const history = defineType({
  type: "document",
  name: "history",
  title: "History",
  fields: [
    defineField({
      type: "string",
      name: "title",
      title: "Title",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "array",
      name: "content",
      title: "Content",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      type: "reference",
      name: "supporters",
      title: "Supporters",
      to: [{ type: "contributor" }],
    }),
  ],
});
