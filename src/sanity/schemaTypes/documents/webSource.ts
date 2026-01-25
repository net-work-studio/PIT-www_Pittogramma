import { LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { UrlInput } from "@/sanity/components/url-input";

export const webSource = defineType({
  type: "document",
  name: "webSource",
  title: "Web Source",
  icon: LinkIcon,
  fields: [
    defineField({
      type: "url",
      name: "sourceUrl",
      title: "Source URL",
      validation: (e) => e.required(),
      description: "The URL of the source website",
      components: {
        input: UrlInput,
      },
    }),
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (e) => e.required(),
      description: "Auto-filled from OG site_name or title",
    }),

    defineField({
      type: "text",
      name: "description",
      title: "Description",
      rows: 3,
      description: "Auto-filled from OG description",
    }),
    defineField({
      type: "imageWithMetadata",
      name: "cover",
      title: "Cover",
      description: "Auto-filled from OG image",
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
    // Read-only OG metadata fields for reference
    defineField({
      type: "string",
      name: "ogTitle",
      title: "OG Title",
      readOnly: true,
      hidden: ({ document }) => !document?.ogTitle,
      description: "Raw OG title from the website",
    }),
    defineField({
      type: "string",
      name: "ogDescription",
      title: "OG Description",
      readOnly: true,
      hidden: ({ document }) => !document?.ogDescription,
      description: "Raw OG description from the website",
    }),
    defineField({
      type: "string",
      name: "ogSiteName",
      title: "OG Site Name",
      readOnly: true,
      hidden: ({ document }) => !document?.ogSiteName,
      description: "Raw OG site name from the website",
    }),
    defineField({
      type: "string",
      name: "ogImageUrl",
      title: "OG Image URL",
      readOnly: true,
      hidden: ({ document }) => !document?.ogImageUrl,
      description: "Original OG image URL",
    }),
  ],
});
