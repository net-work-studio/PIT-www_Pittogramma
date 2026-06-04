import { ImageIcon, PlayIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const coverMedia = defineType({
  type: "object",
  name: "coverMedia",
  title: "Cover Media",
  fields: [
    defineField({
      type: "string",
      name: "type",
      title: "Type",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "image",
    }),
    defineField({
      type: "image",
      name: "image",
      title: "Image",
      description: "Cover image. When type is Video, used as poster thumbnail.",
      options: { hotspot: true },
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string };
          if ((!parent?.type || parent.type === "image") && !value) {
            return "Image is required";
          }
          return true;
        }),
    }),
    defineField({
      type: "file",
      name: "video",
      title: "Video File",
      options: { accept: "video/*" },
      hidden: ({ parent }) => parent?.type !== "video",
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
      type: "string",
      name: "caption",
      title: "Caption / Copyright",
    }),
    defineField({
      type: "string",
      name: "alt",
      title: "Alt",
      validation: (rule) =>
        rule
          .custom((value) =>
            value?.trim() ? true : "Add alt text for accessibility"
          )
          .warning(),
    }),
  ],
  preview: {
    select: {
      type: "type",
      caption: "caption",
      image: "image",
    },
    prepare({ type, caption, image }) {
      const isVideo = type === "video";
      return {
        title: caption || (isVideo ? "Video" : "Image"),
        subtitle: isVideo ? "Video" : "Image",
        media: isVideo ? PlayIcon : image,
      };
    },
  },
});
