import { CalendarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { tagsField } from "@/sanity/schemaTypes/objects/tag-selector";
import { groups } from "@/sanity/utils/groups";
import { requiredHttpUrlWhen } from "@/sanity/utils/validation";

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
      type: "string",
      name: "status",
      title: "Status",
      group: "content",
      initialValue: "coming-soon",
      options: {
        list: [
          { title: "Coming soon", value: "coming-soon" },
          { title: "Tickets available", value: "tickets-available" },
          { title: "Free RSVP", value: "free-rsvp" },
          { title: "Free entry", value: "free-entry" },
          { title: "Sold out", value: "sold-out" },
          { title: "Waitlist", value: "waitlist" },
          { title: "Postponed", value: "postponed" },
          { title: "Cancelled", value: "cancelled" },
        ],
        layout: "dropdown",
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          const dateStart = (context.parent as { dateStart?: string })
            ?.dateStart;
          const today = new Date();
          const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
          const isFuture = !dateStart || dateStart >= localToday;
          if (isFuture && !value) {
            return "Status is required for upcoming events";
          }
          return true;
        }),
    }),
    defineField({
      type: "url",
      name: "ctaUrl",
      title: "CTA Link",
      description: "External link for tickets, registration, or waitlist",
      group: "content",
      hidden: ({ parent }) =>
        !["tickets-available", "free-rsvp", "waitlist"].includes(
          parent?.status
        ),
      validation: requiredHttpUrlWhen((context) => {
        const status = (context.parent as { status?: string })?.status;
        return ["tickets-available", "free-rsvp", "waitlist"].includes(
          status ?? ""
        );
      }, "A CTA link is required for this status"),
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
