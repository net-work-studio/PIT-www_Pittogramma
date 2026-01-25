import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const teacher = defineType({
  type: "document",
  name: "teacher",
  title: "Teacher",
  icon: UserIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "reference",
      name: "teachingAt",
      title: "Teaching at",
      to: [{ type: "institute" }],
    }),
  ],
});
