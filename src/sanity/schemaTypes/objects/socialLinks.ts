import { defineArrayMember, defineField, defineType } from "sanity";

export const socialLinks = defineType({
  type: "object",
  name: "socialLinks",
  title: "Social Links",
  fields: [
    defineField({
      type: "array",
      name: "links",
      title: "Links",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          title: "Social Link",
          fields: [
            defineField({
              type: "string",
              name: "platform",
              title: "Platform",
              options: {
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
                layout: "dropdown",
              },
              validation: (e) => e.required(),
            }),
            defineField({
              type: "url",
              name: "url",
              title: "URL",
              validation: (e) => e.required(),
            }),
          ],
          preview: {
            select: {
              platform: "platform",
              url: "url",
            },
            prepare({ platform, url }) {
              const platformNames: Record<string, string> = {
                ig: "Instagram",
                x: "X (Twitter)",
                linktree: "Linktree",
                website: "Website",
                bluesky: "Bluesky",
                mastodon: "Mastodon",
              };
              return {
                title: platformNames[platform] || platform,
                subtitle: url,
              };
            },
          },
        }),
      ],
    }),
  ],
});
