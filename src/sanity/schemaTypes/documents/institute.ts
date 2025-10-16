import { defineField, defineType } from "sanity";

export const institute = defineType({
  type: "document",
  name: "institute",
  title: "Institute",
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "date",
      name: "yearFoundation",
      title: "Year Foundation",
      validation: (e) => e.required(),
    }),
    defineField({ type: "string", name: "url", title: "Url" }),
    defineField({ type: "string", name: "language", title: "Language" }),
    defineField({ type: "string", name: "country", title: "Country" }),
    defineField({ type: "string", name: "city", title: "City" }),
    defineField({ type: "string", name: "address", title: "Address" }),
  ],
});
