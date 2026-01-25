import { PublishIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const publisher = defineType({
  type: "document",
  name: "publisher",
  title: "Publisher",
  icon: PublishIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
  ],
});
