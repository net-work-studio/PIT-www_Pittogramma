import { defineArrayMember, defineField, defineType } from "sanity";

export const tagSelector = defineType({
  type: "object",
  name: "tagSelector",
  title: "Tag Selector",
  fields: [
    defineField({
      type: "array",
      name: "tags",
      title: "Tags",
      of: [
        defineArrayMember({
          type: "reference",
          name: "tag",
          title: "Tag",
          to: [{ type: "tag" }],
        }),
      ],
      validation: (rule) =>
        rule.unique().error("You cannot add the same tag twice"),
    }),
  ],
});
