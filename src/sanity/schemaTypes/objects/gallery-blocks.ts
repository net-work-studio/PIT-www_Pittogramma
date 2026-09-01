import { BlockElementIcon } from "@sanity/icons/BlockElement";
import { ImageIcon } from "@sanity/icons/Image";
import { InlineIcon } from "@sanity/icons/Inline";
import { SquareIcon } from "@sanity/icons/Square";
import { ThLargeIcon } from "@sanity/icons/ThLarge";
import { defineField, defineType } from "sanity";
import { GridFourInput } from "@/sanity/components/grid-four-input";
import { OrientationInput } from "@/sanity/components/orientation-input";
import { SideBySideInput } from "@/sanity/components/side-by-side-input";
import { ThreeSideBySideInput } from "@/sanity/components/three-side-by-side-input";

const orientationField = defineField({
  components: {
    input: OrientationInput,
  },
  initialValue: "landscape",
  name: "orientation",
  options: {
    layout: "radio",
    list: [
      { title: "Landscape (4:3)", value: "landscape" },
      { title: "Portrait (3:4)", value: "portrait" },
      { title: "Free Form (Original Proportions)", value: "freeform" },
    ],
  },
  title: "Image Presentation",
  type: "string",
  validation: (rule) =>
    rule.required().custom((value, context) => {
      if (value !== "freeform") {
        return true;
      }

      const document = context.document as { _type?: string } | undefined;
      const parent = context.parent as
        | { media?: { type?: string } }
        | undefined;

      return document?._type === "journal" && parent?.media?.type === "image"
        ? true
        : "Free form is available only for single images in Journal entries.";
    }),
});

export const singleMediaBlock = defineType({
  fields: [
    orientationField,
    defineField({
      name: "media",
      title: "Media",
      type: "mediaItem",
      validation: (e) => e.required(),
    }),
  ],
  icon: SquareIcon,
  name: "singleMediaBlock",
  preview: {
    prepare({ type, caption, image }) {
      return {
        media: type === "image" ? image : ImageIcon,
        subtitle: type === "image" ? "Image" : "Video",
        title: caption || "Single Media",
      };
    },
    select: {
      caption: "media.caption",
      image: "media.image",
      type: "media.type",
    },
  },
  title: "Single Media",
  type: "object",
});

export const sideBySideMediaBlock = defineType({
  components: {
    input: SideBySideInput,
  },
  fields: [
    orientationField,
    defineField({
      name: "left",
      title: "Left",
      type: "mediaItem",
      validation: (e) => e.required(),
    }),
    defineField({
      name: "right",
      title: "Right",
      type: "mediaItem",
      validation: (e) => e.required(),
    }),
  ],
  icon: InlineIcon,
  name: "sideBySideMediaBlock",
  preview: {
    prepare({ leftCaption, rightCaption, leftImage }) {
      const title =
        [leftCaption, rightCaption].filter(Boolean).join(" | ") ||
        "Side by Side";
      return {
        media: leftImage || InlineIcon,
        subtitle: "2 items",
        title,
      };
    },
    select: {
      leftCaption: "left.caption",
      leftImage: "left.image",
      rightCaption: "right.caption",
    },
  },
  title: "Side by Side",
  type: "object",
});

export const threeSideBySideMediaBlock = defineType({
  components: {
    input: ThreeSideBySideInput,
  },
  fields: [
    orientationField,
    defineField({
      name: "left",
      title: "Left",
      type: "mediaItem",
      validation: (e) => e.required(),
    }),
    defineField({
      name: "center",
      title: "Center",
      type: "mediaItem",
      validation: (e) => e.required(),
    }),
    defineField({
      name: "right",
      title: "Right",
      type: "mediaItem",
      validation: (e) => e.required(),
    }),
  ],
  icon: BlockElementIcon,
  name: "threeSideBySideMediaBlock",
  preview: {
    prepare({ leftCaption, centerCaption, rightCaption, leftImage }) {
      const title =
        [leftCaption, centerCaption, rightCaption]
          .filter(Boolean)
          .join(" | ") || "3 Side by Side";
      return {
        media: leftImage || BlockElementIcon,
        subtitle: "3 items",
        title,
      };
    },
    select: {
      centerCaption: "center.caption",
      leftCaption: "left.caption",
      leftImage: "left.image",
      rightCaption: "right.caption",
    },
  },
  title: "3 Side by Side",
  type: "object",
});

export const gridFourMediaBlock = defineType({
  components: {
    input: GridFourInput,
  },
  fields: [
    orientationField,
    defineField({
      name: "topLeft",
      title: "Top Left",
      type: "mediaItem",
      validation: (e) => e.required(),
    }),
    defineField({
      name: "topRight",
      title: "Top Right",
      type: "mediaItem",
      validation: (e) => e.required(),
    }),
    defineField({
      name: "bottomLeft",
      title: "Bottom Left",
      type: "mediaItem",
      validation: (e) => e.required(),
    }),
    defineField({
      name: "bottomRight",
      title: "Bottom Right",
      type: "mediaItem",
      validation: (e) => e.required(),
    }),
  ],
  icon: ThLargeIcon,
  name: "gridFourMediaBlock",
  preview: {
    prepare({
      topLeftCaption,
      topRightCaption,
      bottomLeftCaption,
      bottomRightCaption,
      topLeftImage,
    }) {
      const title =
        [topLeftCaption, topRightCaption, bottomLeftCaption, bottomRightCaption]
          .filter(Boolean)
          .join(" | ") || "Grid of 4";
      return {
        media: topLeftImage || ThLargeIcon,
        subtitle: "4 items",
        title,
      };
    },
    select: {
      bottomLeftCaption: "bottomLeft.caption",
      bottomRightCaption: "bottomRight.caption",
      topLeftCaption: "topLeft.caption",
      topLeftImage: "topLeft.image",
      topRightCaption: "topRight.caption",
    },
  },
  title: "Grid of 4",
  type: "object",
});
