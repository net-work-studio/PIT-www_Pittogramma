import { BoltIcon, CogIcon, DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { DurationInput } from "@/sanity/components/duration-input";

export const adv = defineType({
  type: "document",
  name: "adv",
  title: "ADV",
  icon: BoltIcon,
  groups: [
    { name: "content", title: "Content", icon: DocumentTextIcon, default: true },
    { name: "management", title: "Management", icon: CogIcon },
  ],
  fields: [
    defineField({
      type: "string",
      name: "title",
      group: "content",
      title: "Title",
      description: "Campaign label (e.g. 'Monotype Spring 2026 Banner')",
      validation: (r) => r.required(),
    }),
    defineField({
      type: "imageWithMetadata",
      name: "cover",
      title: "Cover",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      type: "array",
      name: "description",
      title: "Description",
      group: "content",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Underline", value: "underline" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      type: "url",
      name: "externalUrl",
      title: "External URL",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      type: "string",
      name: "tier",
      title: "Tier",
      group: "management",
      options: {
        list: [
          { title: "Bronze", value: "bronze" },
          { title: "Silver", value: "silver" },
          { title: "Gold", value: "gold" },
        ],
        layout: "dropdown",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      type: "date",
      name: "dateStart",
      title: "Start Date",
      group: "management",
      validation: (r) => r.required(),
    }),
    defineField({
      type: "number",
      name: "duration",
      title: "Duration (days)",
      group: "management",
      description:
        "Number of days from the start date. The end date is auto-filled and can be manually overridden afterwards.",
      initialValue: 30,
      options: {
        list: [
          { title: "30 days", value: 30 },
          { title: "60 days", value: 60 },
          { title: "90 days", value: 90 },
        ],
      },
      components: { input: DurationInput },
      validation: (r) => r.required().positive(),
    }),
    defineField({
      type: "date",
      name: "dateEnd",
      title: "End Date",
      group: "management",
      description:
        "Auto-computed from start date + duration. Override only for irregular extensions.",
      validation: (r) =>
        r.required().custom((dateEnd, context) => {
          const dateStart = (context.document as { dateStart?: string })
            ?.dateStart;
          if (dateStart && dateEnd && dateEnd < dateStart) {
            return "End date must be after start date";
          }
          return true;
        }),
    }),
    defineField({
      type: "reference",
      name: "sponsor",
      title: "Sponsor",
      group: "management",
      to: [{ type: "contributor" }],
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      tier: "tier",
      media: "cover",
      dateStart: "dateStart",
      dateEnd: "dateEnd",
    },
    prepare({ title, tier, media, dateStart, dateEnd }) {
      return {
        title,
        subtitle: tier?.toUpperCase() ?? "—",
        description: `${dateStart ?? "?"} → ${dateEnd ?? "?"}`,
        media,
      };
    },
  },
});
