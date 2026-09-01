import { PublishIcon } from "@sanity/icons/Publish";
import { defineField, defineType } from "sanity";

export const publisher = defineType({
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (e) => e.required(),
    }),
  ],
  icon: PublishIcon,
  name: "publisher",
  title: "Publisher",
  type: "document",
});
