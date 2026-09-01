import { defineArrayMember, defineField, defineType } from "sanity";
import { httpUrlValidation } from "@/sanity/utils/validation";

export const socialLinks = defineType({
  fields: [
    defineField({
      name: "links",
      of: [
        defineArrayMember({
          fields: [
            defineField({
              name: "platform",
              options: {
                layout: "dropdown",
                list: [
                  { title: "Behance", value: "behance" },
                  { title: "Bluesky", value: "bluesky" },
                  { title: "Instagram", value: "ig" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "Linktree", value: "linktree" },
                  { title: "Mastodon", value: "mastodon" },
                  { title: "Spotify", value: "spotify" },
                  { title: "Substack", value: "substack" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "X (Twitter)", value: "x" },
                  { title: "Website", value: "website" },
                ],
              },
              title: "Platform",
              type: "string",
              validation: (e) => e.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (e) => [e.required(), httpUrlValidation(e)],
            }),
          ],
          name: "socialLink",
          preview: {
            prepare({ platform, url }) {
              const platformNames: Record<string, string> = {
                bluesky: "Bluesky",
                ig: "Instagram",
                linktree: "Linktree",
                mastodon: "Mastodon",
                website: "Website",
                x: "X (Twitter)",
              };
              return {
                subtitle: url,
                title: platformNames[platform] || platform,
              };
            },
            select: {
              platform: "platform",
              url: "url",
            },
          },
          title: "Social Link",
          type: "object",
        }),
      ],
      title: "Links",
      type: "array",
    }),
  ],
  name: "socialLinks",
  title: "Social Links",
  type: "object",
});
