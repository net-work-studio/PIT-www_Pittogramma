import { BoltIcon } from "@sanity/icons/Bolt";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineField, defineType } from "sanity";
import { TIER_CAPS } from "@/lib/adv-config";
import { buildLocalToday } from "@/lib/date-utils";
import { DurationInput } from "@/sanity/components/duration-input";
import { apiVersion } from "@/sanity/env";
import { getPublishedId } from "@/sanity/lib/document-id";
import type { Adv } from "@/sanity/types";
import { httpUrlValidation } from "@/sanity/utils/validation";

// Subset of Adv fields the document-level validator inspects. Picking from
// the generated `Adv` keeps this in lock-step with the schema; if any of these
// fields are renamed/removed, the cast below breaks at typecheck time. Fields
// other than `_id` are optional because the validator runs on partially-filled
// documents during editing.
type AdvValidationDoc = Pick<Adv, "_id"> &
  Partial<Pick<Adv, "tier" | "dateStart" | "dateEnd">>;

export const adv = defineType({
  fields: [
    defineField({
      description: "Campaign label (e.g. 'Monotype Spring 2026 Banner')",
      group: "content",
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      description: "Landscape image (4:3) — used in the home grid.",
      group: "content",
      name: "cover",
      title: "Cover",
      type: "coverMedia",
      validation: (r) => r.required(),
    }),
    defineField({
      description:
        "Optional portrait image (3:4) for the feed. Falls back to the landscape cover when empty.",
      group: "content",
      name: "coverPortrait",
      options: { hotspot: true },
      title: "Cover Portrait",
      type: "image",
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
      group: "management",
      name: "tier",
      options: {
        layout: "dropdown",
        list: [
          { title: "Bronze", value: "bronze" },
          { title: "Silver", value: "silver" },
          { title: "Gold", value: "gold" },
        ],
      },
      title: "Tier",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      group: "management",
      name: "dateStart",
      title: "Start Date",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({
      components: { input: DurationInput },
      description:
        "Number of days from the start date. The end date is auto-filled and can be manually overridden afterwards.",
      group: "management",
      initialValue: 30,
      name: "duration",
      options: {
        list: [
          { title: "30 days", value: 30 },
          { title: "60 days", value: 60 },
          { title: "90 days", value: 90 },
        ],
      },
      title: "Duration (days)",
      type: "number",
      validation: (r) => r.required().positive(),
    }),
    defineField({
      description:
        "Auto-computed from start date + duration. Override only for irregular extensions.",
      group: "management",
      name: "dateEnd",
      title: "End Date",
      type: "date",
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
      group: "management",
      name: "sponsor",
      title: "Sponsor",
      to: [{ type: "contributor" }],
      type: "reference",
      validation: (r) => r.required(),
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
  icon: BoltIcon,
  name: "adv",
  preview: {
    prepare({ title, tier, media, dateStart, dateEnd }) {
      return {
        description: `${dateStart ?? "?"} → ${dateEnd ?? "?"}`,
        media,
        subtitle: tier?.toUpperCase() ?? "—",
        title,
      };
    },
    select: {
      dateEnd: "dateEnd",
      dateStart: "dateStart",
      media: "cover",
      tier: "tier",
      title: "title",
    },
  },
  title: "ADV",
  type: "document",
  // Document-level soft warnings: tier-window overlap with another active ADV
  // and tier capacity exceeded. Both are non-blocking — the document still
  // publishes when over capacity; the frontend silently drops the surplus.
  validation: (rule) =>
    rule
      .custom(async (doc, context) => {
        const typed = doc as AdvValidationDoc;
        // Fields can still be undefined at validation time while the document
        // is being filled in, so we keep these guards even though _id is always
        // present on a real document.
        if (
          !(
            typed._id &&
            typed.tier &&
            typed.dateStart &&
            typed.dateEnd &&
            typed.tier in TIER_CAPS
          )
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
          { dateEnd, dateStart, draftId, publishedId, tier }
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
      })
      .warning(),
});
