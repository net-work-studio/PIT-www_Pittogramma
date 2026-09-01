import { BlockquoteIcon } from "@sanity/icons/Blockquote";
import { defineField, defineType } from "sanity";

export const glossary = defineType({
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (e) => e.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (e) => e.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithMetadata",
    }),
  ],
  icon: BlockquoteIcon,
  name: "glossary",
  title: "Glossary",
  type: "document",
});
