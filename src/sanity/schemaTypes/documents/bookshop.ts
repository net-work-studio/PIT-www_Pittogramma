import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const bookshop = defineType({
  type: "document",
  name: "bookshop",
  title: "Bookshop",
  icon: HomeIcon,
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
      type: "string",
      name: "address",
      title: "Address",
    }),
    defineField({
      type: "socialLinks",
      name: "socialLinks",
      title: "Social Links",
    }),
  ],
});
