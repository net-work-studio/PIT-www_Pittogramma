import { LinkIcon } from "@sanity/icons/Link";
import { defineField, defineType } from "sanity";
import { UrlInput } from "@/sanity/components/url-input";
import { tagsField } from "@/sanity/schemaTypes/objects/tag-selector";
import { httpUrlValidation } from "@/sanity/utils/validation";

export const webSource = defineType({
  fields: [
    defineField({
      components: {
        input: UrlInput,
      },
      description: "The URL of the source website",
      name: "sourceUrl",
      title: "Source URL",
      type: "url",
      validation: (e) => [e.required(), httpUrlValidation(e)],
    }),
    defineField({
      description: "Auto-filled from OG site_name or title",
      name: "name",
      title: "Name",
      type: "string",
      validation: (e) => e.required(),
    }),

    defineField({
      description: "Auto-filled from OG description",
      name: "description",
      rows: 3,
      title: "Description",
      type: "text",
    }),
    defineField({
      description: "Auto-filled from OG image",
      name: "cover",
      title: "Cover",
      type: "coverMedia",
    }),
    defineField({
      name: "category",
      title: "Category",
      to: [{ type: "category" }],
      type: "reference",
      validation: (e) => e.required(),
    }),
    tagsField(),
    // Read-only OG metadata fields for reference
    defineField({
      description: "Raw OG title from the website",
      hidden: ({ document }) => !document?.ogTitle,
      name: "ogTitle",
      readOnly: true,
      title: "OG Title",
      type: "string",
    }),
    defineField({
      description: "Raw OG description from the website",
      hidden: ({ document }) => !document?.ogDescription,
      name: "ogDescription",
      readOnly: true,
      title: "OG Description",
      type: "string",
    }),
    defineField({
      description: "Raw OG site name from the website",
      hidden: ({ document }) => !document?.ogSiteName,
      name: "ogSiteName",
      readOnly: true,
      title: "OG Site Name",
      type: "string",
    }),
    defineField({
      description: "Original OG image URL",
      hidden: ({ document }) => !document?.ogImageUrl,
      name: "ogImageUrl",
      readOnly: true,
      title: "OG Image URL",
      type: "string",
    }),
  ],
  icon: LinkIcon,
  name: "webSource",
  preview: {
    select: {
      media: "cover.image",
      subtitle: "sourceUrl",
      title: "name",
    },
  },
  title: "Web Source",
  type: "document",
});
