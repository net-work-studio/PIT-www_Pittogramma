import { UsersIcon } from "@sanity/icons/Users";
import { defineField, defineType } from "sanity";

export const contributor = defineType({
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (e) => e.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "logo",
      validation: (e) => e.required(),
    }),
    defineField({ name: "description", title: "Description", type: "text" }),
  ],
  icon: UsersIcon,
  name: "contributor",
  title: "Contributor",
  type: "document",
});
