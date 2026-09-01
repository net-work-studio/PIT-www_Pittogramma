import { TagIcon } from "@sanity/icons/Tag";
import { defineField, defineType } from "sanity";

export const tag = defineType({
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
  icon: TagIcon,
  name: "tag",
  preview: {
    select: {
      subtitle: "slug.current",
      title: "name",
    },
  },
  title: "Tag",
  type: "document",
});
