import { TextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const typeFoundry = defineType({
  type: "document",
  name: "typeFoundry",
  title: "Type Foundry",
  icon: TextIcon,
  fields: [
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
  ],
});
