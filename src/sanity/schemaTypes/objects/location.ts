import { defineField, defineType } from "sanity";

export const location = defineType({
  type: "object",
  name: "location",
  title: "Location",
  fields: [
    defineField({
      type: "reference",
      name: "country",
      title: "Country",
      to: [{ type: "country" }],
      options: {
        disableNew: false,
      },
      validation: (e) => e.required(),
    }),
    defineField({
      type: "reference",
      name: "city",
      title: "City",
      to: [{ type: "city" }],
      options: {
        disableNew: false,
      },
      validation: (e) => e.required(),
    }),
  ],
  preview: {
    select: {
      countryName: "country.name",
      cityName: "city.name",
    },
    prepare({ countryName, cityName }) {
      const parts = [cityName, countryName].filter(Boolean);
      return {
        title: parts.join(", ") || "Location",
      };
    },
  },
});
