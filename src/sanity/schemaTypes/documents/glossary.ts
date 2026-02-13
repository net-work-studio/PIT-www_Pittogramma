import { BlockquoteIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const glossary = defineType({
  type: "document",
  name: "glossary",
  title: "Glossary",
  icon: BlockquoteIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "text",
      name: "description",
      title: "Description",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "imageWithMetadata",
      name: "image",
      title: "Image",
    }),
  ],
});
