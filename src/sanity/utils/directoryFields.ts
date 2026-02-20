import { defineField } from "sanity";

export const directoryFields = [
  defineField({
    type: "string",
    name: "name",
    title: "Name",
    validation: (e) => e.required(),
  }),
  defineField({
    type: "tagSelector",
    name: "tagSelector",
    title: "Tags",
  }),
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
];
