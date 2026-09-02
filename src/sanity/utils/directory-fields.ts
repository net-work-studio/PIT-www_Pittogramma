import { defineField } from "sanity";
import { tagsField } from "@/sanity/schemaTypes/objects/tag-selector";

export const directoryFields = [
  defineField({
    name: "name",
    title: "Name",
    type: "string",
    validation: (e) => e.required(),
  }),
  tagsField(),
  defineField({
    name: "place",
    title: "Place",
    to: [{ type: "place" }],
    type: "reference",
    validation: (e) => e.required(),
  }),
  defineField({
    name: "socialLinks",
    title: "Social Links",
    type: "socialLinks",
  }),
];
