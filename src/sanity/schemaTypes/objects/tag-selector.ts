import type { ConditionalPropertyCallback } from "@sanity/types";
import { defineArrayMember, defineField } from "sanity";

export const tagsField = (
  group?: string,
  hidden?: ConditionalPropertyCallback
) =>
  defineField({
    name: "tags",
    title: "Tags",
    type: "array",
    ...(group ? { group } : {}),
    ...(hidden ? { hidden } : {}),
    of: [
      defineArrayMember({
        to: [{ type: "tag" }],
        type: "reference",
      }),
    ],
    validation: (rule) =>
      rule.unique().error("You cannot add the same tag twice"),
  });
