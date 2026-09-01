import { CalendarIcon } from "@sanity/icons/Calendar";
import { defineField, defineType } from "sanity";
import { LocationNameInput } from "@/sanity/components/location-name-input";
import { tagsField } from "@/sanity/schemaTypes/objects/tag-selector";
import { groups } from "@/sanity/utils/groups";
import { requiredHttpsUrlWhen } from "@/sanity/utils/validation";

export const event = defineType({
  fields: [
    defineField({
      group: "content",
      name: "title",
      title: "Title",
      type: "string",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "content",
      name: "slug",
      options: {
        source: "title",
      },
      title: "Slug",
      type: "slug",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "content",
      name: "publishingDate",
      title: "Publishing Date",
      type: "publishingDate",
      validation: (e) => e.required(),
    }),
    defineField({
      description: "Choose where the event card sends visitors.",
      group: "content",
      initialValue: "internal",
      name: "cardDestination",
      options: {
        layout: "radio",
        list: [
          {
            title: "Pittogramma event page",
            value: "internal",
          },
          { title: "External page", value: "external" },
        ],
      },
      title: "Card Destination",
      type: "string",
    }),
    defineField({
      description:
        "The event's branded Pittogramma URL will permanently redirect here.",
      group: "content",
      hidden: ({ document }) => document?.cardDestination !== "external",
      name: "externalUrl",
      title: "External URL",
      type: "url",
      validation: requiredHttpsUrlWhen(
        ({ document }) => document?.cardDestination === "external",
        "External URL is required when the card destination is an external page"
      ),
    }),
    defineField({
      group: "content",
      initialValue: "event",
      name: "type",
      options: {
        layout: "dropdown",
        list: [
          { title: "Talk", value: "talk" },
          { title: "Workshop", value: "workshop" },
          { title: "5+1", value: "5+1" },
          { title: "Event", value: "event" },
        ],
      },
      title: "Type",
      type: "string",
      validation: (e) => e.required(),
    }),
    defineField({
      description: "Portrait image (3:4 ratio recommended).",
      group: "content",
      name: "cover",
      title: "Cover",
      type: "coverMedia",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "content",
      name: "dateStart",
      title: "Date Start",
      type: "date",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "content",
      name: "dateEnd",
      title: "Date End",
      type: "date",
    }),
    defineField({
      group: "content",
      hidden: ({ document }) => document?.cardDestination === "external",
      initialValue: "offline",
      name: "attendanceMode",
      options: {
        layout: "radio",
        list: [
          { title: "In person", value: "offline" },
          { title: "Online", value: "online" },
        ],
      },
      title: "Attendance",
      type: "string",
      validation: (rule) =>
        rule.custom((value, { document }) =>
          document?.cardDestination === "external" || value
            ? true
            : "Attendance is required"
        ),
    }),
    defineField({
      components: { input: LocationNameInput },
      group: "content",
      hidden: ({ document, parent }) =>
        document?.cardDestination !== "external" &&
        parent?.attendanceMode === "online",
      name: "locationName",
      title: "Location Name",
      type: "string",
    }),
    defineField({
      group: "content",
      hidden: ({ document, parent }) =>
        document?.cardDestination === "external" ||
        parent?.attendanceMode === "online",
      name: "locationAddress",
      title: "Location Address",
      type: "string",
    }),
    defineField({
      group: "content",
      hidden: ({ document }) => document?.cardDestination === "external",
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      group: "content",
      hidden: ({ document }) => document?.cardDestination === "external",
      name: "sponsors",
      of: [{ to: [{ type: "contributor" }], type: "reference" }],
      title: "Sponsors",
      type: "array",
    }),
    defineField({
      group: "content",
      hidden: ({ document }) => document?.cardDestination === "external",
      name: "partners",
      of: [{ to: [{ type: "contributor" }], type: "reference" }],
      title: "Partners",
      type: "array",
    }),
    defineField({
      group: "content",
      hidden: ({ document }) => document?.cardDestination === "external",
      name: "info",
      of: [{ type: "infoItem" }],
      title: "Info",
      type: "array",
    }),
    tagsField(
      "content",
      ({ document }) => document?.cardDestination === "external"
    ),
    defineField({
      group: "seo",
      hidden: ({ document }) => document?.cardDestination === "external",
      name: "seo",
      title: "SEO",
      type: "seoModule",
    }),
  ],
  groups,
  icon: CalendarIcon,
  name: "event",
  orderings: [
    {
      by: [{ direction: "desc", field: "publishingDate.date" }],
      name: "publishingDateDesc",
      title: "Publishing Date, Newest",
    },
    {
      by: [{ direction: "asc", field: "publishingDate.date" }],
      name: "publishingDateAsc",
      title: "Publishing Date, Oldest",
    },
    {
      by: [{ direction: "desc", field: "dateStart" }],
      name: "dateStartDesc",
      title: "Event Date, Newest",
    },
    {
      by: [{ direction: "asc", field: "dateStart" }],
      name: "dateStartAsc",
      title: "Event Date, Oldest",
    },
  ],
  preview: {
    prepare({ title, media, dateStart }) {
      return {
        media,
        subtitle: dateStart,
        title,
      };
    },
    select: {
      dateStart: "dateStart",
      media: "cover.image",
      title: "title",
    },
  },
  title: "Event",
  type: "document",
});
