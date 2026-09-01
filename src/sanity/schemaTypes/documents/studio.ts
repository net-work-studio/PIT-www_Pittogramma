import { DesktopIcon } from "@sanity/icons/Desktop";
import { defineArrayMember, defineField, defineType } from "sanity";
import { FetchWebsiteDataButton } from "@/sanity/components/fetch-website-data-button";
import { tagsField } from "@/sanity/schemaTypes/objects/tag-selector";
import { groups } from "@/sanity/utils/groups";

export const studio = defineType({
  fields: [
    defineField({
      group: "content",
      name: "name",
      title: "Name",
      type: "string",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "content",
      name: "socialLinks",
      title: "Social Links",
      type: "socialLinks",
    }),
    defineField({
      description: "Point of contact (CRM only, not shown on frontend)",
      group: "content",
      name: "email",
      title: "Email",
      type: "string",
      validation: (e) => e.email(),
    }),
    defineField({
      components: {
        input: FetchWebsiteDataButton,
      },
      description: "Fetches OG metadata from the Website URL in Social Links",
      group: "content",
      name: "fetchWebsiteData",
      title: "Fetch Website Data",
      type: "string",
    }),
    defineField({
      description: "Auto-filled from OG description",
      group: "content",
      name: "description",
      rows: 3,
      title: "Description",
      type: "text",
    }),
    defineField({
      description: "Auto-filled from OG image",
      group: "content",
      name: "cover",
      title: "Cover",
      type: "coverMedia",
    }),
    defineField({
      group: "content",
      name: "places",
      of: [
        defineArrayMember({
          to: [{ type: "place" }],
          type: "reference",
        }),
      ],
      title: "Locations",
      type: "array",
    }),
    defineField({
      group: "content",
      name: "category",
      title: "Category",
      to: [{ type: "category" }],
      type: "reference",
      validation: (e) => e.required(),
    }),
    tagsField("content"),
    // Read-only OG metadata fields for reference
    defineField({
      description: "Raw OG title from the website",
      group: "og",
      hidden: ({ document }) => !document?.ogTitle,
      name: "ogTitle",
      readOnly: true,
      title: "OG Title",
      type: "string",
    }),
    defineField({
      description: "Raw OG description from the website",
      group: "og",
      hidden: ({ document }) => !document?.ogDescription,
      name: "ogDescription",
      readOnly: true,
      title: "OG Description",
      type: "string",
    }),
    defineField({
      description: "Raw OG site name from the website",
      group: "og",
      hidden: ({ document }) => !document?.ogSiteName,
      name: "ogSiteName",
      readOnly: true,
      title: "OG Site Name",
      type: "string",
    }),
    defineField({
      description: "Original OG image URL",
      group: "og",
      hidden: ({ document }) => !document?.ogImageUrl,
      name: "ogImageUrl",
      readOnly: true,
      title: "OG Image URL",
      type: "string",
    }),
  ],
  groups,
  icon: DesktopIcon,
  name: "studio",
  preview: {
    select: {
      media: "cover.image",
      subtitle: "description",
      title: "name",
    },
  },
  title: "Studio",
  type: "document",
});
