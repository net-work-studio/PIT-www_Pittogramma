import { UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { groups } from "@/sanity/utils/groups";

const minBirthYear = 1900;
const maxBirthYear = 2500;
const PHONE_REGEX = /^[+\d][\d\s\-()]*$/;

const ROLE_OPTIONS = [
  { title: "Designer", value: "designer" },
  { title: "Professional", value: "professional" },
  { title: "Author", value: "author" },
  { title: "Teacher", value: "teacher" },
];

function hasRole(
  document: { roles?: string[] } | undefined,
  ...roles: string[]
): boolean {
  return roles.some((role) => document?.roles?.includes(role));
}

export const person = defineType({
  type: "document",
  name: "person",
  title: "Person",
  icon: UserIcon,
  groups,
  fields: [
    // Metadata
    defineField({
      type: "array",
      name: "roles",
      title: "Roles",
      group: "metadata",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: ROLE_OPTIONS,
      },
      validation: (e) => e.required().min(1).error("At least one role is required"),
    }),
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
      validation: (rule) =>
        rule.custom((slug, context) => {
          const doc = context.document as { roles?: string[] };
          if (hasRole(doc, "designer") && !slug?.current) {
            return "Slug is required for designers";
          }
          return true;
        }),
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
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "designer", "professional"),
      validation: (rule) =>
        rule
          .min(minBirthYear)
          .custom((value, context) => {
            const doc = context.document as { roles?: string[] };
            if (hasRole(doc, "designer") && !value) {
              return "Birth year is required for designers";
            }
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
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "designer", "professional"),
    }),
    defineField({
      type: "array",
      name: "education",
      title: "Education",
      group: "content",
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "designer"),
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
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "designer", "professional"),
      to: [{ type: "place" }],
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document as { roles?: string[] };
          if (hasRole(doc, "designer") && !value) {
            return "Place is required for designers";
          }
          return true;
        }),
    }),
    defineField({
      type: "socialLinks",
      name: "socialLinks",
      title: "Social Links",
      group: "content",
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "designer", "professional"),
    }),
    defineField({
      type: "string",
      name: "email",
      title: "Email",
      group: "content",
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "designer"),
      validation: (e) => e.email(),
    }),
    defineField({
      type: "string",
      name: "phone",
      title: "Phone",
      group: "content",
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "designer"),
      validation: (e) =>
        e.regex(PHONE_REGEX, {
          name: "phone",
          invert: false,
        }),
    }),
    defineField({
      type: "reference",
      name: "teachingAt",
      title: "Teaching at",
      group: "content",
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "teacher", "professional"),
      to: [{ type: "institute" }],
    }),
    defineField({
      type: "reference",
      name: "studio",
      title: "Studio",
      group: "content",
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "professional"),
      to: [{ type: "studio" }],
    }),

    // SEO
    defineField({
      type: "seoModule",
      name: "seo",
      title: "SEO",
      group: "seo",
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "designer"),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "birthYear",
      media: "portrait.image",
      roles: "roles",
    },
    prepare({ title, subtitle, media, roles }) {
      const roleLabels = (roles as string[] | undefined)?.join(", ") ?? "";
      return {
        title,
        subtitle: roleLabels || (subtitle ? String(subtitle) : undefined),
        media,
      };
    },
  },
});
