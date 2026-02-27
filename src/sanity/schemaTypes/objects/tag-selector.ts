import { defineArrayMember, defineField } from "sanity";

export const tagsField = (group?: string) =>
  defineField({
    type: "array",
    name: "tags",
    title: "Tags",
    ...(group ? { group } : {}),
    of: [
      defineArrayMember({
        type: "reference",
        to: [{ type: "tag" }],
      }),
    ],
    validation: (rule) =>
      rule.unique().error("You cannot add the same tag twice"),
  });
