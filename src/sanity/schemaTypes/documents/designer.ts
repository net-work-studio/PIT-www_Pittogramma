import { UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { groups } from "@/sanity/utils/groups";

const minBirthYear = 1900;
const maxBirthYear = 2500;

export const designer = defineType({
  type: "document",
  name: "designer",
  title: "Designer",
  icon: UserIcon,
  groups,
  fields: [
    // Metadata
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      group: "metadata",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      group: "metadata",
      options: {
        source: "name",
      },
      validation: (e) => e.required(),
    }),

    // Content
    defineField({
      type: "imageWithMetadata",
      name: "portrait",
      title: "Portrait",
      group: "content",
    }),
    defineField({
      type: "number",
      name: "birthYear",
      title: "Birth Year",
      group: "content",
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
    defineField({
      type: "text",
      name: "bio",
      title: "Bio",
      group: "content",
    }),
    defineField({
      type: "array",
      name: "education",
      title: "Education",
      group: "content",
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
                  { title: "Erasmus", value: "Erasmus" },
                  { title: "Other", value: "Other" },
                ],
              },
              validation: (e) => e.required(),
            }),
            defineField({
              type: "string",
              name: "courseName",
              title: "Course Name",
            }),
            defineField({
              type: "number",
              name: "year",
              title: "Year",
              validation: (e) =>
                e.min(minBirthYear).custom((value) => {
                  if (value && (value < minBirthYear || value > maxBirthYear)) {
                    return "Year must be exactly 4 digits";
                  }
                  return true;
                }),
            }),
          ],
        }),
      ],
    }),
    defineField({
      type: "reference",
      name: "place",
      title: "Place",
      group: "content",
      to: [{ type: "place" }],
      validation: (e) => e.required(),
    }),
    defineField({
      type: "socialLinks",
      name: "socialLinks",
      title: "Social Links",
      group: "content",
    }),
    defineField({
      type: "string",
      name: "email",
      title: "Email",
      group: "content",
      validation: (e) => e.email(),
    }),
    defineField({
      type: "string",
      name: "phone",
      title: "Phone",
      group: "content",
      validation: (e) =>
        e.regex(/^[+\d][\d\s\-()]*$/, {
          name: "phone",
          invert: false,
        }),
    }),

    // SEO
    defineField({
      type: "seoModule",
      name: "seo",
      title: "SEO",
      group: "seo",
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
