import { PlayIcon } from "@sanity/icons/Play";
import { defineField, defineType } from "sanity";

export const coverMedia = defineType({
  fields: [
    defineField({
      initialValue: "image",
      name: "type",
      options: {
        layout: "radio",
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
      },
      title: "Type",
      type: "string",
    }),
    defineField({
      description:
        "Cover image. When type is Video, used as the poster in listings and before playback.",
      name: "image",
      options: { hotspot: true },
      title: "Image",
      type: "image",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string };
          const type = parent?.type ?? "image";

          if (type === "image" && !value) {
            return "Image is required";
          }

          if (type === "video" && !value) {
            return "Poster image is required for video covers";
          }

          return true;
        }),
    }),
    defineField({
      description:
        "Enable only for animated GIF or WebP covers that do not play. This bypasses Next.js image optimization while retaining the Sanity crop and hotspot.",
      hidden: ({ parent }) => parent?.type === "video",
      initialValue: false,
      name: "preserveAnimation",
      title: "Preserve animation",
      type: "boolean",
    }),
    defineField({
      hidden: ({ parent }) => parent?.type !== "video",
      name: "video",
      options: { accept: "video/*" },
      title: "Video File",
      type: "file",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string };
          if (parent?.type === "video" && !value) {
            return "Video file is required";
          }
          return true;
        }),
    }),
    defineField({
      name: "caption",
      title: "Caption / Copyright",
      type: "string",
    }),
    defineField({
      name: "alt",
      title: "Alt",
      type: "string",
      validation: (rule) =>
        rule
          .custom((value) =>
            value?.trim() ? true : "Add alt text for accessibility"
          )
          .warning(),
    }),
  ],
  name: "coverMedia",
  preview: {
    prepare({ type, caption, image }) {
      const isVideo = type === "video";
      return {
        media: isVideo ? PlayIcon : image,
        subtitle: isVideo ? "Video" : "Image",
        title: caption || (isVideo ? "Video" : "Image"),
      };
    },
    select: {
      caption: "caption",
      image: "image",
      type: "type",
    },
  },
  title: "Cover Media",
  type: "object",
});
