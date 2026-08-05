import { CalendarIcon } from "@sanity/icons/Calendar";
import { defineField, defineType } from "sanity";
import { tagsField } from "@/sanity/schemaTypes/objects/tag-selector";
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
      options: {
        list: [
          { title: "Talk", value: "talk" },
          { title: "Workshop", value: "workshop" },
          { title: "5+1", value: "5+1" },
          { title: "Event", value: "event" },
        ],
        layout: "dropdown",
      },
      initialValue: "event",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "coverMedia",
      name: "cover",
      title: "Cover",
      description: "Portrait image (3:4 ratio recommended).",
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
      name: "attendanceMode",
      title: "Attendance",
      group: "content",
      options: {
        list: [
          { title: "In person", value: "offline" },
          { title: "Online", value: "online" },
        ],
        layout: "radio",
      },
      initialValue: "offline",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "string",
      name: "locationName",
      title: "Location Name",
      group: "content",
      hidden: ({ parent }) => parent?.attendanceMode === "online",
    }),
    defineField({
      type: "string",
      name: "locationAddress",
      title: "Location Address",
      group: "content",
      hidden: ({ parent }) => parent?.attendanceMode === "online",
    }),
    defineField({
      type: "text",
      name: "description",
      title: "Description",
      group: "content",
    }),
    defineField({
      type: "array",
      name: "sponsors",
      title: "Sponsors",
      group: "content",
      of: [{ type: "reference", to: [{ type: "contributor" }] }],
    }),
    defineField({
      type: "array",
      name: "partners",
      title: "Partners",
      group: "content",
      of: [{ type: "reference", to: [{ type: "contributor" }] }],
    }),
    defineField({
      type: "array",
      name: "info",
      title: "Info",
      group: "content",
      of: [{ type: "infoItem" }],
    }),
    tagsField("content"),
    defineField({
      type: "seoModule",
      name: "seo",
      title: "SEO",
      group: "seo",
    }),
  ],
  orderings: [
    {
      title: "Event Date, Newest",
      name: "dateStartDesc",
      by: [{ field: "dateStart", direction: "desc" }],
    },
    {
      title: "Event Date, Oldest",
      name: "dateStartAsc",
      by: [{ field: "dateStart", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "cover.image",
      dateStart: "dateStart",
    },
    prepare({ title, media, dateStart }) {
      return {
        title,
        subtitle: dateStart,
        media,
      };
    },
  },
});
