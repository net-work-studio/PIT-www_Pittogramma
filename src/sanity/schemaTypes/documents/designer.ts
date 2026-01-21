import { defineArrayMember, defineField, defineType } from "sanity";

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
      type: "array",
      name: "education",
      title: "Education",
      of: [
        defineArrayMember({
          type: "object",
          name: "instituteEducation",
          title: "Institute Education",
          fields: [
            defineField({
              type: "reference",
              name: "institute",
              title: "Institute",
              to: [{ type: "institute" }],
              validation: (e) => e.required(),
            }),
            defineField({
              type: "string",
              name: "degree",
              title: "Degree",
              options: {
                list: [
                  { title: "Bachelor", value: "Bachelor" },
                  { title: "Master", value: "Master" },
                  { title: "PhD", value: "PhD" },
                  { title: "Other", value: "Other" },
                ],
              },
              validation: (e) => e.required(),
            }),
            defineField({
              type: "number",
              name: "year",
              title: "Year",
              validation: (e) =>
                e.min(minBirthYear).custom((value) => {
                  if (value && (value < minBirthYear || value > maxBirthYear)) {
                    return "Birth year must be exactly 4 digits";
                  }
                  return true;
                }),
            }),
          ],
        }),
      ],
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
    defineField({
      type: "seoModule",
      name: "seo",
      title: "SEO",
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
