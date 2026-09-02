import { UserIcon } from "@sanity/icons/User";
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
  fields: [
    // Metadata
    defineField({
      group: "metadata",
      name: "roles",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: ROLE_OPTIONS,
      },
      title: "Roles",
      type: "array",
      validation: (e) =>
        e.required().min(1).error("At least one role is required"),
    }),
    defineField({
      group: "metadata",
      name: "name",
      title: "Name",
      type: "string",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "metadata",
      name: "slug",
      options: {
        source: "name",
      },
      title: "Slug",
      type: "slug",
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
      group: "content",
      name: "portrait",
      title: "Portrait",
      type: "imageWithMetadata",
    }),
    defineField({
      group: "content",
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "designer", "professional"),
      name: "birthYear",
      title: "Birth Year",
      type: "number",
      validation: (rule) =>
        rule.min(minBirthYear).custom((value, context) => {
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
      group: "content",
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "designer", "professional"),
      name: "bio",
      title: "Bio",
      type: "text",
    }),
    defineField({
      group: "content",
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "designer"),
      name: "education",
      of: [
        defineArrayMember({
          fields: [
            defineField({
              name: "institute",
              title: "Institute",
              to: [{ type: "institute" }],
              type: "reference",
              validation: (e) => e.required(),
            }),
            defineField({
              name: "degree",
              options: {
                list: [
                  { title: "Bachelor", value: "Bachelor" },
                  { title: "Master", value: "Master" },
                  { title: "PhD", value: "PhD" },
                  { title: "Erasmus", value: "Erasmus" },
                  { title: "Other", value: "Other" },
                ],
              },
              title: "Degree",
              type: "string",
              validation: (e) => e.required(),
            }),
            defineField({
              name: "courseName",
              title: "Course Name",
              type: "string",
            }),
            defineField({
              name: "year",
              title: "Year",
              type: "number",
              validation: (e) =>
                e.min(minBirthYear).custom((value) => {
                  if (value && (value < minBirthYear || value > maxBirthYear)) {
                    return "Year must be exactly 4 digits";
                  }
                  return true;
                }),
            }),
          ],
          name: "instituteEducation",
          title: "Institute Education",
          type: "object",
        }),
      ],
      title: "Education",
      type: "array",
    }),
    defineField({
      group: "content",
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "designer", "professional"),
      name: "place",
      title: "Place",
      to: [{ type: "place" }],
      type: "reference",
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
      group: "content",
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "designer", "professional"),
      name: "socialLinks",
      title: "Social Links",
      type: "socialLinks",
    }),
    defineField({
      group: "content",
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "designer"),
      name: "email",
      title: "Email",
      type: "string",
      validation: (e) => e.email(),
    }),
    defineField({
      group: "content",
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "designer"),
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (e) =>
        e.regex(PHONE_REGEX, {
          invert: false,
          name: "phone",
        }),
    }),
    defineField({
      group: "content",
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "teacher", "professional"),
      name: "teachingAt",
      title: "Teaching at",
      to: [{ type: "institute" }],
      type: "reference",
    }),
    defineField({
      group: "content",
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "professional"),
      name: "studio",
      title: "Studio",
      to: [{ type: "studio" }],
      type: "reference",
    }),

    // SEO
    defineField({
      group: "seo",
      hidden: ({ document }) =>
        !hasRole(document as { roles?: string[] }, "designer"),
      name: "seo",
      title: "SEO",
      type: "seoModule",
    }),
  ],
  groups,
  icon: UserIcon,
  name: "person",
  preview: {
    prepare({ title, subtitle, media, roles }) {
      const roleLabels = (roles as string[] | undefined)?.join(", ") ?? "";
      return {
        media,
        subtitle: roleLabels || (subtitle ? String(subtitle) : undefined),
        title,
      };
    },
    select: {
      media: "portrait.image",
      roles: "roles",
      subtitle: "birthYear",
      title: "name",
    },
  },
  title: "Person",
  type: "document",
});
