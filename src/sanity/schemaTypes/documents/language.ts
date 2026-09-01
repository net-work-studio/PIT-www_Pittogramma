import { TranslateIcon } from "@sanity/icons/Translate";
import { defineField, defineType } from "sanity";

export const language = defineType({
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (e) => e.required(),
    }),
    defineField({
      name: "slug",
      options: { source: "name" },
      title: "Slug",
      type: "slug",
      validation: (e) => e.required(),
    }),
  ],
  icon: TranslateIcon,
  name: "language",
  preview: {
    select: {
      subtitle: "slug.current",
      title: "name",
    },
  },
  title: "Language",
  type: "document",
});
