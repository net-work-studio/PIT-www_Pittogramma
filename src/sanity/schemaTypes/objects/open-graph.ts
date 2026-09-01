import { defineField, defineType } from "sanity";
import { httpUrlValidation } from "@/sanity/utils/validation";

export const openGraph = defineType({
  fields: [
    defineField({
      description:
        "Optional override for social sharing. Uses Meta Title by default.",
      name: "title",
      title: "OG Title",
      type: "string",
    }),
    defineField({
      description:
        "Optional override for social sharing. Uses Meta Description by default.",
      name: "description",
      rows: 3,
      title: "OG Description",
      type: "text",
    }),
    defineField({
      description: "URL used for social sharing (usually the canonical URL).",
      name: "url",
      title: "OG URL",
      type: "url",
      validation: httpUrlValidation,
    }),
  ],
  name: "openGraph",
  title: "Open Graph",
  type: "object",
});
