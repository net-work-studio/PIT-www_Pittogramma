import { DesktopIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { UrlInput } from "@/sanity/components/url-input";
import { groups } from "@/sanity/utils/groups";

export const studio = defineType({
  type: "document",
  name: "studio",
  title: "Studio",
  groups,
  icon: DesktopIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      group: "content",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "url",
      name: "websiteUrl",
      title: "Website URL",
      description: "The URL of the studio website",
      group: "content",
      options: {
        autoFillName: false,
      } as Record<string, unknown>,
      components: {
        input: UrlInput,
      },
    }),
    defineField({
      type: "text",
      name: "description",
      title: "Description",
      rows: 3,
      group: "content",
      description: "Auto-filled from OG description",
    }),
    defineField({
      type: "imageWithMetadata",
      name: "cover",
      title: "Cover",
      description: "Auto-filled from OG image",
      group: "content",
    }),
    defineField({
      type: "reference",
      name: "category",
      title: "Category",
      to: [{ type: "category" }],
      group: "content",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "tagSelector",
      name: "tagSelector",
      title: "Tags",
      group: "content",
    }),
    defineField({
      type: "array",
      name: "places",
      title: "Locations",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "place" }],
        }),
      ],
    }),
    defineField({
      type: "socialLinks",
      name: "socialLinks",
      title: "Social Links",
      group: "content",
    }),
    // Read-only OG metadata fields for reference
    defineField({
      type: "string",
      name: "ogTitle",
      title: "OG Title",
      group: "og",
      readOnly: true,
      hidden: ({ document }) => !document?.ogTitle,
      description: "Raw OG title from the website",
    }),
    defineField({
      type: "string",
      name: "ogDescription",
      title: "OG Description",
      group: "og",
      readOnly: true,
      hidden: ({ document }) => !document?.ogDescription,
      description: "Raw OG description from the website",
    }),
    defineField({
      type: "string",
      name: "ogSiteName",
      title: "OG Site Name",
      group: "og",
      readOnly: true,
      hidden: ({ document }) => !document?.ogSiteName,
      description: "Raw OG site name from the website",
    }),
    defineField({
      type: "string",
      name: "ogImageUrl",
      title: "OG Image URL",
      group: "og",
      readOnly: true,
      hidden: ({ document }) => !document?.ogImageUrl,
      description: "Original OG image URL",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "cover.image",
    },
  },
});
