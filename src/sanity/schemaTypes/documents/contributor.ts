import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const contributor = defineType({
  type: "document",
  name: "contributor",
  title: "Contributor",
  icon: UsersIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "logo",
      name: "logo",
      title: "Logo",
      validation: (e) => e.required(),
    }),
    defineField({ type: "text", name: "description", title: "Description" }),
  ],
});
