import { defineField, defineType } from "sanity";

export const infoItem = defineType({
  type: "object",
  name: "infoItem",
  title: "Info Item",
  fields: [
    defineField({
      type: "string",
      name: "title",
      title: "Title",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "text",
      name: "content",
      title: "Content",
      rows: 4,
      validation: (e) => e.required(),
    }),
  ],
  preview: {
    select: { title: "title", content: "content" },
    prepare({ title, content }) {
      return {
        title,
        subtitle: content?.split("\n")[0],
      };
    },
  },
});
