import { ImageIcon, LinkIcon, PlayIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const mediaItem = defineType({
  type: "object",
  name: "mediaItem",
  title: "Media Item",
  fields: [
    defineField({
      type: "string",
      name: "type",
      title: "Type",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video (Upload)", value: "videoUpload" },
          { title: "Video (Embed)", value: "videoEmbed" },
        ],
        layout: "radio",
      },
      initialValue: "image",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "image",
      name: "image",
      title: "Image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.type !== "image",
    }),
    defineField({
      type: "file",
      name: "video",
      title: "Video File",
      options: {
        accept: "video/*",
      },
      hidden: ({ parent }) => parent?.type !== "videoUpload",
    }),
    defineField({
      type: "url",
      name: "videoUrl",
      title: "Video URL",
      description: "YouTube or Vimeo URL",
      hidden: ({ parent }) => parent?.type !== "videoEmbed",
    }),
    defineField({
      type: "string",
      name: "caption",
      title: "Caption",
    }),
    defineField({
      type: "string",
      name: "alt",
      title: "Alt Text",
      hidden: ({ parent }) => parent?.type !== "image",
    }),
  ],
  preview: {
    select: {
      type: "type",
      caption: "caption",
      image: "image",
    },
    prepare({ type, caption, image }) {
      const typeLabels = {
        image: "Image",
        videoUpload: "Video (Upload)",
        videoEmbed: "Video (Embed)",
      };
      const icons = {
        image: ImageIcon,
        videoUpload: PlayIcon,
        videoEmbed: LinkIcon,
      };
      return {
        title:
          caption || typeLabels[type as keyof typeof typeLabels] || "Media",
        subtitle: typeLabels[type as keyof typeof typeLabels],
        media: type === "image" ? image : icons[type as keyof typeof icons],
      };
    },
  },
});
