import { defineField } from "sanity";
import { tagsField } from "@/sanity/schemaTypes/objects/tag-selector";

export const directoryFields = [
  defineField({
    type: "string",
    name: "name",
    title: "Name",
    validation: (e) => e.required(),
  }),
  tagsField(),
  defineField({
    type: "reference",
    name: "place",
    title: "Place",
    to: [{ type: "place" }],
    validation: (e) => e.required(),
  }),
  defineField({
    type: "socialLinks",
    name: "socialLinks",
    title: "Social Links",
  }),
];
