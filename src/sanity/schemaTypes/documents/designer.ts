import { defineField, defineType } from "sanity";

const minBirthYear = 1900;
const maxBirthYear = 2500;

export const designer = defineType({
  type: "document",
  name: "designer",
  title: "Designer",
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "imageWithMetadata",
      name: "portrait",
      title: "Portrait",
    }),
    defineField({
      type: "number",
      name: "birthYear",
      title: "Birth Year",
      validation: (e) =>
        e
          .required()
          .min(minBirthYear)
          .custom((value) => {
            if (value && (value < minBirthYear || value > maxBirthYear)) {
              return "Birth year must be exactly 4 digits";
            }
            return true;
          }),
    }),
    defineField({ type: "text", name: "bio", title: "Bio" }),
    defineField({
      type: "reference",
      name: "institute",
      title: "Institute",
      to: [{ type: "institute" }],
    }),
    defineField({
      type: "location",
      name: "location",
      title: "Location",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "socialLinks",
      name: "socialLinks",
      title: "Social Links",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "birthYear",
      media: "portrait.image",
    },
  },
});
