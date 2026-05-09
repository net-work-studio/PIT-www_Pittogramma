import { CogIcon, DocumentTextIcon, UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { buildLocalToday } from "@/lib/date-utils";
import { apiVersion } from "@/sanity/env";
import { getPublishedId } from "@/sanity/lib/document-id";
import type { Community } from "@/sanity/types";

// Visible cap for active community items at any moment. Keep in sync with the
// `[0...3]` slice in FEED_COMMUNITY_QUERY in src/sanity/lib/queries.ts.
const COMMUNITY_ACTIVE_CAP = 3;

const COMMUNITY_TYPE_LABELS: Record<string, string> = {
  projectOnSupport: "Project on Support",
  partnership: "Partnership",
};

// Subset of Community fields the document-level validator inspects. Picking
// from the generated `Community` keeps this in lock-step with the schema.
// `dateEnd` is optional in the schema; `dateStart` can still be undefined at
// validation time while the document is being filled in.
type CommunityValidationDoc = Pick<Community, "_id"> &
  Partial<Pick<Community, "dateStart" | "dateEnd">>;

export const community = defineType({
  type: "document",
  name: "community",
  title: "Community",
  icon: UsersIcon,
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
            return dateEnd <= buildLocalToday()
              ? "Already expired — this community item will not display anywhere."
              : true;
          })
          .warning(),
      ],
    }),
  ],
  // Document-level soft warning: more than COMMUNITY_ACTIVE_CAP active items
  // simultaneously. Mirrors the ADV capacity warning but with a single
  // dimension (no tier).
  validation: (rule) =>
    rule.custom(async (doc, context) => {
      const typed = doc as CommunityValidationDoc;
      if (!typed.dateStart) {
        return true;
      }
      const today = buildLocalToday();
      const { dateStart, dateEnd } = typed;
      // Only warn when this doc would itself be active right now — there's no
      // value warning about future overlaps the editor hasn't configured yet.
      const isActive =
        dateStart <= today && (!dateEnd || dateEnd >= today);
      if (!isActive) {
        return true;
      }

      const publishedId = getPublishedId(typed._id);
      const draftId = `drafts.${publishedId}`;
      const client = context.getClient({ apiVersion });
      const activeCount = await client.fetch<number>(
        `count(*[
          _type == "community"
          && _id != $publishedId
          && _id != $draftId
          && dateStart <= $today
          && (!defined(dateEnd) || dateEnd >= $today)
        ])`,
        { publishedId, draftId, today }
      );

      const total = activeCount + 1;
      if (total > COMMUNITY_ACTIVE_CAP) {
        return `This is the ${total}th active community item; cap is ${COMMUNITY_ACTIVE_CAP}. Surplus items won't display until others end.`;
      }
      return true;
    }).warning(),
  preview: {
    select: {
      title: "title",
      type: "type",
      media: "cover",
      dateStart: "dateStart",
      dateEnd: "dateEnd",
    },
    prepare({ title, type, media, dateStart, dateEnd }) {
      const typeLabel = type ? COMMUNITY_TYPE_LABELS[type] ?? type : "—";
      return {
        title,
        subtitle: typeLabel,
        description: `${dateStart ?? "?"} → ${dateEnd ?? "ongoing"}`,
        media,
      };
    },
  },
});
