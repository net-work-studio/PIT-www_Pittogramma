import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const category = defineType({
  type: "document",
  name: "category",
  title: "Category",
  icon: TagIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
  ],
});
