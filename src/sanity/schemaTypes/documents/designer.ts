import { defineField, defineType } from "sanity";

export const designer = defineType({
  type: "document",
  name: "designer",
  title: "Designer",
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
    defineField({ type: "mainImage", name: "portrait", title: "Portrait" }),
    defineField({
      type: "date",
      name: "birthYear",
      title: "Birth Year",
      validation: (e) => e.required(),
    }),
    defineField({ type: "text", name: "bio", title: "Bio" }),
    defineField({
      type: "reference",
      name: "institute",
      title: "Institute",
      to: [{ type: "institute" }],
    }),
    defineField({ type: "string", name: "country", title: "Country" }),
    defineField({ type: "string", name: "city", title: "City" }),
  ],
});
