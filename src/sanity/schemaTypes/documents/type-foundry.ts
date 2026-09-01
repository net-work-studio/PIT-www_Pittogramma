import { TextIcon } from "@sanity/icons/Text";
import { defineArrayMember, defineField, defineType } from "sanity";
import { FetchWebsiteDataButton } from "@/sanity/components/fetch-website-data-button";
import { tagsField } from "@/sanity/schemaTypes/objects/tag-selector";
import { groups } from "@/sanity/utils/groups";

export const typeFoundry = defineType({
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
    tagsField("content"),
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
  icon: TextIcon,
  name: "typeFoundry",
  preview: {
    select: {
      media: "cover.image",
      subtitle: "fetchWebsiteData",
      title: "name",
    },
  },
  title: "Type Foundry",
  type: "document",
});
