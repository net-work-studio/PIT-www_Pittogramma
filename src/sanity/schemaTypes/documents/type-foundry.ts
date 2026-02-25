import { TextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { FetchWebsiteDataButton } from "@/sanity/components/fetch-website-data-button";
import { groups } from "@/sanity/utils/groups";

export const typeFoundry = defineType({
  type: "document",
  name: "typeFoundry",
  title: "Type Foundry",
  groups,
  icon: TextIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      group: "content",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "socialLinks",
      name: "socialLinks",
      title: "Social Links",
      group: "content",
    }),
    defineField({
      type: "string",
      name: "fetchWebsiteData",
      title: "Fetch Website Data",
      description: "Fetches OG metadata from the Website URL in Social Links",
      group: "content",
      components: {
        input: FetchWebsiteDataButton,
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
      subtitle: "fetchWebsiteData",
      media: "cover.image",
    },
  },
});
