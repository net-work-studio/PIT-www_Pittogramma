import { defineField, defineType } from "sanity";

export const event = defineType({
  type: "document",
  name: "event",
  title: "Event",
  fields: [
    defineField({
      type: "titleSlug",
      name: "titleslug",
      title: "TitleSlug",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "string",
      name: "type",
      title: "Type",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "mainImage",
      name: "cover",
      title: "Cover",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "date",
      name: "dateStart",
      title: "Date Start",
      validation: (e) => e.required(),
    }),
    defineField({ type: "date", name: "dateEnd", title: "Date End" }),
    defineField({
      type: "string",
      name: "locationName",
      title: "Location Name",
    }),
    defineField({
      type: "string",
      name: "locationAddress",
      title: "Location Address",
    }),
    defineField({ type: "text", name: "description", title: "Description" }),
    defineField({
      type: "reference",
      name: "sponsor",
      title: "Sponsor",
      to: [{ type: "contributor" }],
    }),
    defineField({
      type: "reference",
      name: "partner",
      title: "Partner",
      to: [{ type: "contributor" }],
    }),
  ],
});
