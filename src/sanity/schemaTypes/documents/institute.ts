import { HomeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

const minYearFoundation = 1000;
const maxYearFoundation = 2500;

export const institute = defineType({
  type: "document",
  name: "institute",
  title: "Institute",
  icon: HomeIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "number",
      name: "yearFoundation",
      title: "Year Foundation",
      validation: (e) =>
        e
          .required()
          .min(minYearFoundation)
          .custom((value) => {
            if (
              value &&
              (value < minYearFoundation || value > maxYearFoundation)
            ) {
              return "Year foundation must be exactly 4 digits";
            }
            return true;
          }),
    }),
    defineField({
      type: "array",
      name: "languages",
      title: "Languages",
      of: [
        defineArrayMember({
          type: "reference",
          name: "language",
          title: "Language",
          to: [{ type: "language" }],
        }),
      ],
    }),
    defineField({
      type: "reference",
      name: "place",
      title: "Place",
      to: [{ type: "place" }],
      validation: (e) => e.required(),
    }),
    defineField({ type: "string", name: "address", title: "Address" }),
    defineField({
      type: "socialLinks",
      name: "socialLinks",
      title: "Social Links",
    }),
  ],
});
