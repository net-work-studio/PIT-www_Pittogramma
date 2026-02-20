import { CalendarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { groups } from "@/sanity/utils/groups";

export const event = defineType({
  type: "document",
  name: "event",
  title: "Event",
  icon: CalendarIcon,
  groups,
  fields: [
    defineField({
      type: "string",
      name: "title",
      title: "Title",
      group: "content",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      group: "content",
      options: {
        source: "title",
      },
      validation: (e) => e.required(),
    }),
    defineField({
      type: "string",
      name: "type",
      title: "Type",
      group: "content",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "imageWithMetadata",
      name: "cover",
      title: "Cover",
      group: "content",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "date",
      name: "dateStart",
      title: "Date Start",
      group: "content",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "date",
      name: "dateEnd",
      title: "Date End",
      group: "content",
    }),
    defineField({
      type: "string",
      name: "locationName",
      title: "Location Name",
      group: "content",
    }),
    defineField({
      type: "string",
      name: "locationAddress",
      title: "Location Address",
      group: "content",
    }),
    defineField({
      type: "text",
      name: "description",
      title: "Description",
      group: "content",
    }),
    defineField({
      type: "reference",
      name: "sponsor",
      title: "Sponsor",
      group: "content",
      to: [{ type: "contributor" }],
    }),
    defineField({
      type: "reference",
      name: "partner",
      title: "Partner",
      group: "content",
      to: [{ type: "contributor" }],
    }),
    defineField({
      type: "tagSelector",
      name: "tagSelector",
      title: "Tags",
      group: "content",
    }),
    defineField({
      type: "seoModule",
      name: "seo",
      title: "SEO",
      group: "seo",
    }),
  ],
});
