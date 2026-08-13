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
  type: "object",
  name: "singleMediaBlock",
  title: "Single Media",
  icon: SquareIcon,
  fields: [
    orientationField,
    defineField({
      type: "mediaItem",
      name: "media",
      title: "Media",
      validation: (e) => e.required(),
    }),
  ],
  preview: {
    select: {
      type: "media.type",
      caption: "media.caption",
      image: "media.image",
    },
    prepare({ type, caption, image }) {
      return {
        title: caption || "Single Media",
        subtitle: type === "image" ? "Image" : "Video",
        media: type === "image" ? image : ImageIcon,
      };
    },
  },
});

export const sideBySideMediaBlock = defineType({
  type: "object",
  name: "sideBySideMediaBlock",
  title: "Side by Side",
  icon: InlineIcon,
  components: {
    input: SideBySideInput,
  },
  fields: [
    orientationField,
    defineField({
      type: "mediaItem",
      name: "left",
      title: "Left",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "mediaItem",
      name: "right",
      title: "Right",
      validation: (e) => e.required(),
    }),
  ],
  preview: {
    select: {
      leftCaption: "left.caption",
      rightCaption: "right.caption",
      leftImage: "left.image",
    },
    prepare({ leftCaption, rightCaption, leftImage }) {
      const title =
        [leftCaption, rightCaption].filter(Boolean).join(" | ") ||
        "Side by Side";
      return {
        title,
        subtitle: "2 items",
        media: leftImage || InlineIcon,
      };
    },
  },
});

export const threeSideBySideMediaBlock = defineType({
  type: "object",
  name: "threeSideBySideMediaBlock",
  title: "3 Side by Side",
  icon: BlockElementIcon,
  components: {
    input: ThreeSideBySideInput,
  },
  fields: [
    orientationField,
    defineField({
      type: "mediaItem",
      name: "left",
      title: "Left",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "mediaItem",
      name: "center",
      title: "Center",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "mediaItem",
      name: "right",
      title: "Right",
      validation: (e) => e.required(),
    }),
  ],
  preview: {
    select: {
      leftCaption: "left.caption",
      centerCaption: "center.caption",
      rightCaption: "right.caption",
      leftImage: "left.image",
    },
    prepare({ leftCaption, centerCaption, rightCaption, leftImage }) {
      const title =
        [leftCaption, centerCaption, rightCaption]
          .filter(Boolean)
          .join(" | ") || "3 Side by Side";
      return {
        title,
        subtitle: "3 items",
        media: leftImage || BlockElementIcon,
      };
    },
  },
});

export const gridFourMediaBlock = defineType({
  type: "object",
  name: "gridFourMediaBlock",
  title: "Grid of 4",
  icon: ThLargeIcon,
  components: {
    input: GridFourInput,
  },
  fields: [
    orientationField,
    defineField({
      type: "mediaItem",
      name: "topLeft",
      title: "Top Left",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "mediaItem",
      name: "topRight",
      title: "Top Right",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "mediaItem",
      name: "bottomLeft",
      title: "Bottom Left",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "mediaItem",
      name: "bottomRight",
      title: "Bottom Right",
      validation: (e) => e.required(),
    }),
  ],
  preview: {
    select: {
      topLeftCaption: "topLeft.caption",
      topRightCaption: "topRight.caption",
      bottomLeftCaption: "bottomLeft.caption",
      bottomRightCaption: "bottomRight.caption",
      topLeftImage: "topLeft.image",
    },
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
        title,
        subtitle: "4 items",
        media: topLeftImage || ThLargeIcon,
      };
    },
  },
});
