import { TranslateIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const language = defineType({
  type: "document",
  name: "language",
  title: "Language",
  icon: TranslateIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      options: { source: "name" },
      validation: (e) => e.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "slug.current",
    },
  },
});
