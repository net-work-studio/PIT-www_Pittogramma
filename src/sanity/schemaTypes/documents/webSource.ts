import { LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const webSource = defineType({
  type: "document",
  name: "webSource",
  title: "Web Source",
  icon: LinkIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "imageWithMetadata",
      name: "cover",
      title: "Cover",
    }),
    defineField({
      type: "reference",
      name: "category",
      title: "Category",
      to: [{ type: "category" }],
      validation: (e) => e.required(),
    }),
    defineField({
      type: "tagSelector",
      name: "tagSelector",
      title: "Tags",
    }),
    defineField({
      type: "url",
      name: "affiliateLink",
      title: "Affiliate Link",
    }),
  ],
});
