import { CogIcon } from "@sanity/icons/Cog";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { UsersIcon } from "@sanity/icons/Users";
import { defineField, defineType } from "sanity";
import { buildLocalToday } from "@/lib/date-utils";
import { httpUrlValidation } from "@/sanity/utils/validation";

const COMMUNITY_TYPE_LABELS: Record<string, string> = {
  partnership: "Partnership",
  projectOnSupport: "Project on Support",
};

export const community = defineType({
  fields: [
    defineField({
      group: "content",
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      group: "content",
      name: "type",
      options: {
        layout: "dropdown",
        list: [
          { title: "Project on Support", value: "projectOnSupport" },
          { title: "Partnership", value: "partnership" },
        ],
      },
      title: "Type",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      description: "Portrait image (3:4 ratio recommended).",
      group: "content",
      name: "cover",
      title: "Cover",
      type: "coverMedia",
      validation: (r) => r.required(),
    }),
    defineField({
      group: "content",
      name: "description",
      of: [
        {
          lists: [],
          marks: {
            annotations: [
              {
                fields: [
                  {
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: httpUrlValidation,
                  },
                ],
                name: "link",
                title: "Link",
                type: "object",
              },
            ],
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Underline", value: "underline" },
            ],
          },
          styles: [{ title: "Normal", value: "normal" }],
          type: "block",
        },
      ],
      title: "Description",
      type: "array",
    }),
    defineField({
      group: "content",
      name: "externalUrl",
      title: "External URL",
      type: "url",
      validation: (r) => [r.required(), httpUrlValidation(r)],
    }),
    defineField({
      description:
        'Optional. When set, the card byline reads "In partnership with [Name]"; otherwise "Community".',
      group: "management",
      name: "partner",
      title: "Partner",
      to: [{ type: "contributor" }],
      type: "reference",
    }),
    defineField({
      group: "management",
      name: "dateStart",
      title: "Start Date",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({
      description:
        "Optional. Leave empty for evergreen community items (visible until manually unpublished).",
      group: "management",
      name: "dateEnd",
      title: "End Date",
      type: "date",
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
  groups: [
    {
      default: true,
      icon: DocumentTextIcon,
      name: "content",
      title: "Content",
    },
    { icon: CogIcon, name: "management", title: "Management" },
  ],
  icon: UsersIcon,
  name: "community",
  // Community items are deliberately uncapped — all active items display in
  // the feed (unlike advs which are tier-capped). Date filtering in
  // FEED_COMMUNITY_QUERY handles visibility.
  preview: {
    prepare({ title, type, media, dateStart, dateEnd }) {
      const typeLabel = type ? (COMMUNITY_TYPE_LABELS[type] ?? type) : "—";
      return {
        description: `${dateStart ?? "?"} → ${dateEnd ?? "ongoing"}`,
        media,
        subtitle: typeLabel,
        title,
      };
    },
    select: {
      dateEnd: "dateEnd",
      dateStart: "dateStart",
      media: "cover",
      title: "title",
      type: "type",
    },
  },
  title: "Community",
  type: "document",
});
