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
    defineField({
      type: "location",
      name: "location",
      title: "Location",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "socialLinks",
      name: "socialLinks",
      title: "Social Links",
    }),
  ],
});
