import { PinIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const city = defineType({
  type: "document",
  name: "city",
  title: "City",
  icon: PinIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
  ],
});
