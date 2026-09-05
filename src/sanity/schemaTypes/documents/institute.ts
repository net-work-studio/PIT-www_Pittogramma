import { HomeIcon } from "@sanity/icons/Home";
import { defineArrayMember, defineField, defineType } from "sanity";

const minYearFoundation = 1000;
const maxYearFoundation = 2500;

export const institute = defineType({
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (e) => e.required(),
    }),
    defineField({
      name: "yearFoundation",
      title: "Since",
      type: "number",
      validation: (e) =>
        e
          .required()
          .min(minYearFoundation)
          .custom((value) => {
            if (
              value &&
              (value < minYearFoundation || value > maxYearFoundation)
            ) {
              return "Since must be exactly 4 digits";
            }
            return true;
          }),
    }),
    defineField({
      name: "languages",
      of: [
        defineArrayMember({
          name: "language",
          title: "Language",
          to: [{ type: "language" }],
          type: "reference",
        }),
      ],
      title: "Languages",
      type: "array",
    }),
    defineField({
      name: "place",
      title: "Place",
      to: [{ type: "place" }],
      type: "reference",
      validation: (e) => e.required(),
    }),
    defineField({ name: "address", title: "Address", type: "string" }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "socialLinks",
    }),
  ],
  icon: HomeIcon,
  name: "institute",
  preview: {
    select: {
      subtitle: "place.name",
      title: "name",
    },
  },
  title: "Institute",
  type: "document",
});
