import { TextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const typeFoundry = defineType({
  type: "document",
  name: "typeFoundry",
  title: "Type Foundry",
  icon: TextIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "tagSelector",
      name: "tagSelector",
      title: "Tags",
    }),
    defineField({
      type: "array",
      name: "places",
      title: "Locations",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "place" }],
        }),
      ],
    }),
    defineField({
      type: "socialLinks",
      name: "socialLinks",
      title: "Social Links",
    }),
  ],
});
