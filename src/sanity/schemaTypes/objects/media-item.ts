import { ImageIcon } from "@sanity/icons/Image";
import { LinkIcon } from "@sanity/icons/Link";
import { PlayIcon } from "@sanity/icons/Play";
import { defineField, defineType } from "sanity";
import { videoEmbedUrlValidation } from "@/sanity/utils/validation";

export const mediaItem = defineType({
  fields: [
    defineField({
      initialValue: "image",
      name: "type",
      options: {
        layout: "radio",
        list: [
          { title: "Image", value: "image" },
          { title: "Video (Upload)", value: "videoUpload" },
          { title: "Video (Embed)", value: "videoEmbed" },
        ],
      },
      title: "Type",
      type: "string",
      validation: (e) => e.required(),
    }),
    defineField({
      hidden: ({ parent }) => parent?.type !== "image",
      name: "image",
      options: { hotspot: true },
      title: "Image",
      type: "image",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string };
          if (parent?.type === "image" && !value) {
            return "Image is required";
          }
          return true;
        }),
    }),
    defineField({
      hidden: ({ parent }) => parent?.type !== "videoUpload",
      name: "video",
      options: {
        accept: "video/*",
      },
      title: "Video File",
      type: "file",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string };
          if (parent?.type === "videoUpload" && !value) {
            return "Video file is required";
          }
          return true;
        }),
    }),
    defineField({
      description: "YouTube or Vimeo URL",
      hidden: ({ parent }) => parent?.type !== "videoEmbed",
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      validation: (rule) => [
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string };
          if (parent?.type === "videoEmbed" && !value) {
            return "Video URL is required";
          }
          return true;
        }),
        videoEmbedUrlValidation(rule),
      ],
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      hidden: ({ parent }) => parent?.type !== "image",
      name: "alt",
      title: "Alt Text",
      type: "string",
    }),
  ],
  name: "mediaItem",
  preview: {
    prepare({ type, caption, image }) {
      const typeLabels = {
        image: "Image",
        videoEmbed: "Video (Embed)",
        videoUpload: "Video (Upload)",
      };
      const icons = {
        image: ImageIcon,
        videoEmbed: LinkIcon,
        videoUpload: PlayIcon,
      };
      return {
        media: type === "image" ? image : icons[type as keyof typeof icons],
        subtitle: typeLabels[type as keyof typeof typeLabels],
        title:
          caption || typeLabels[type as keyof typeof typeLabels] || "Media",
      };
    },
    select: {
      caption: "caption",
      image: "image",
      type: "type",
    },
  },
  title: "Media Item",
  type: "object",
});
