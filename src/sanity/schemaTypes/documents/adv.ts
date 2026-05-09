import { BoltIcon, CogIcon, DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { buildLocalToday } from "@/lib/date-utils";
import { DurationInput } from "@/sanity/components/duration-input";
import { apiVersion } from "@/sanity/env";

// Volume caps enforced as soft warnings only — the document still publishes
// when over-capacity. Frontend silently drops the surplus.
const TIER_CAPS: Record<"gold" | "silver" | "bronze", number> = {
  gold: 1,
  silver: 2,
  bronze: 5,
};

// Strip the `drafts.` prefix so we can compare against both the published
// _id and the draft _id when looking for sibling ADVs.
function getPublishedId(id: string): string {
  return id.startsWith("drafts.") ? id.slice("drafts.".length) : id;
}

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
      validation: (r) => [
        r.required().custom((dateEnd, context) => {
          const dateStart = (context.document as { dateStart?: string })
            ?.dateStart;
          if (dateStart && dateEnd && dateEnd < dateStart) {
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
              ? "Already expired — this ADV will not display anywhere."
              : true;
          })
          .warning(),
      ],
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
  // Document-level soft warnings: tier-window overlap with another active ADV
  // and tier capacity exceeded. Both are non-blocking — the document still
  // publishes when over capacity; the frontend silently drops the surplus.
  validation: (rule) =>
    rule.custom(async (doc, context) => {
      const typed = doc as
        | {
            _id?: string;
            tier?: "gold" | "silver" | "bronze";
            dateStart?: string;
            dateEnd?: string;
          }
        | undefined;
      if (
        !(typed?._id && typed.tier && typed.dateStart && typed.dateEnd) ||
        !(typed.tier in TIER_CAPS)
      ) {
        return true;
      }
      const { tier, dateStart, dateEnd } = typed;
      const publishedId = getPublishedId(typed._id);
      const draftId = `drafts.${publishedId}`;

      const client = context.getClient({ apiVersion });
      const conflicts = await client.fetch<
        Array<{ _id: string; title: string | null; dateEnd: string }>
      >(
        `*[
          _type == "adv"
          && _id != $publishedId
          && _id != $draftId
          && tier == $tier
          && !(dateEnd < $dateStart || dateStart > $dateEnd)
        ] | order(dateStart asc) {
          _id, title, dateEnd
        }`,
        { publishedId, draftId, tier, dateStart, dateEnd }
      );

      if (conflicts.length === 0) {
        return true;
      }

      const cap = TIER_CAPS[tier];
      // Including this doc, total active campaigns at the same tier in the
      // window. Capacity warning fires when this exceeds the cap.
      const activeCount = conflicts.length + 1;
      if (activeCount > cap) {
        return `This is the ${activeCount}th active ${tier} in the booked window; cap is ${cap}. Surplus campaigns won't display until others end.`;
      }

      const first = conflicts[0];
      const conflictTitle = first.title ?? "(untitled)";
      return `Overlaps with "${conflictTitle}" (ends ${first.dateEnd}) at the same tier. Earlier dateStart wins; this campaign won't display in that slot until the other ends.`;
    }).warning(),
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
