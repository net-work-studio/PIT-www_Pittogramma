import { EarthGlobeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const country = defineType({
  type: "document",
  name: "country",
  title: "Country",
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
  ],
});
