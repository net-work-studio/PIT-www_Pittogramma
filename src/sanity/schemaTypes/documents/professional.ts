import { defineField, defineType } from "sanity";

const minBirthYear = 1900;
const maxBirthYear = 2500;

export const professional = defineType({
  type: "document",
  name: "professional",
  title: "Professional",
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
        e.min(minBirthYear).custom((value) => {
          if (value && (value < minBirthYear || value > maxBirthYear)) {
            return "Birth year must be exactly 4 digits";
          }
          return true;
        }),
    }),
    defineField({ type: "text", name: "bio", title: "Bio" }),
    defineField({
      type: "reference",
      name: "teachingAt",
      title: "Teaching at",
      to: [{ type: "institute" }],
    }),
    defineField({
      type: "reference",
      name: "studio",
      title: "Studio",
      to: [{ type: "studio" }],
    }),
    defineField({
      type: "location",
      name: "location",
      title: "Location",
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
