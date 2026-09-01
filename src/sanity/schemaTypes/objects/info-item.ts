import { defineField, defineType } from "sanity";

export const infoItem = defineType({
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (e) => e.required(),
    }),
    defineField({
      name: "content",
      rows: 4,
      title: "Content",
      type: "text",
      validation: (e) => e.required(),
    }),
  ],
  name: "infoItem",
  preview: {
    prepare({ title, content }) {
      return {
        subtitle: content?.split("\n")[0],
        title,
      };
    },
    select: { content: "content", title: "title" },
  },
  title: "Info Item",
  type: "object",
});
