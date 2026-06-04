import { CogIcon, DocumentTextIcon, UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { buildLocalToday } from "@/lib/date-utils";
import { httpUrlValidation } from "@/sanity/utils/validation";

const COMMUNITY_TYPE_LABELS: Record<string, string> = {
  projectOnSupport: "Project on Support",
  partnership: "Partnership",
};

export const community = defineType({
  type: "document",
  name: "community",
  title: "Community",
  icon: UsersIcon,
  groups: [
    {
      name: "content",
      title: "Content",
      icon: DocumentTextIcon,
      default: true,
    },
    { name: "management", title: "Management", icon: CogIcon },
  ],
  fields: [
    defineField({
      type: "string",
      name: "title",
      group: "content",
      title: "Title",
      validation: (r) => r.required(),
    }),
    defineField({
      type: "string",
      name: "type",
      group: "content",
      title: "Type",
      options: {
        list: [
          { title: "Project on Support", value: "projectOnSupport" },
          { title: "Partnership", value: "partnership" },
        ],
        layout: "dropdown",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      type: "coverMedia",
      name: "cover",
      title: "Cover",
      description: "Portrait image (3:4 ratio recommended).",
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
                    validation: httpUrlValidation,
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
      validation: (r) => [r.required(), httpUrlValidation(r)],
    }),
    defineField({
      type: "reference",
      name: "partner",
      title: "Partner",
      group: "management",
      description:
        'Optional. When set, the card byline reads "In partnership with [Name]"; otherwise "Community".',
      to: [{ type: "contributor" }],
    }),
    defineField({
      type: "date",
      name: "dateStart",
      title: "Start Date",
      group: "management",
      validation: (r) => r.required(),
    }),
    defineField({
      type: "date",
      name: "dateEnd",
      title: "End Date",
      group: "management",
      description:
        "Optional. Leave empty for evergreen community items (visible until manually unpublished).",
      validation: (r) => [
        r.custom((dateEnd, context) => {
          const dateStart = (context.document as { dateStart?: string })
            ?.dateStart;
          // Optional field: skip the rule entirely when unset.
          if (!dateEnd) {
            return true;
          }
          if (dateStart && dateEnd < dateStart) {
            return "End date must be after start date";
          }
          return true;
        }),
        r
          .custom<string>((dateEnd) => {
            if (!dateEnd) {
              return true;
            }
            return dateEnd < buildLocalToday()
              ? "Already expired — this community item will not display anywhere."
              : true;
          })
          .warning(),
      ],
    }),
  ],
  // Community items are deliberately uncapped — all active items display in
  // the feed (unlike advs which are tier-capped). Date filtering in
  // FEED_COMMUNITY_QUERY handles visibility.
  preview: {
    select: {
      title: "title",
      type: "type",
      media: "cover",
      dateStart: "dateStart",
      dateEnd: "dateEnd",
    },
    prepare({ title, type, media, dateStart, dateEnd }) {
      const typeLabel = type ? (COMMUNITY_TYPE_LABELS[type] ?? type) : "—";
      return {
        title,
        subtitle: typeLabel,
        description: `${dateStart ?? "?"} → ${dateEnd ?? "ongoing"}`,
        media,
      };
    },
  },
});
