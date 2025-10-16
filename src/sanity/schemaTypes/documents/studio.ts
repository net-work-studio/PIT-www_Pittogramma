import { defineField, defineType } from "sanity";

export const studio = defineType({
  type: "document",
  name: "studio",
  title: "Studio",
  fields: [
    defineField({
      type: "text",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
    defineField({ type: "string", name: "type", title: "Type" }),
    defineField({ type: "string", name: "tag", title: "Tag" }),
    defineField({ type: "string", name: "country", title: "Country" }),
    defineField({ type: "string", name: "city", title: "City" }),
  ],
});
