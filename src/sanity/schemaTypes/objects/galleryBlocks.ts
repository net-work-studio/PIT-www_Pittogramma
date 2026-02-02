import { ImageIcon, SquareIcon, InlineIcon, ThLargeIcon, BlockElementIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { SideBySideInput } from "@/sanity/components/side-by-side-input";
import { ThreeSideBySideInput } from "@/sanity/components/three-side-by-side-input";
import { GridFourInput } from "@/sanity/components/grid-four-input";

export const singleMediaBlock = defineType({
  type: "object",
  name: "singleMediaBlock",
  title: "Single Media",
  icon: SquareIcon,
  fields: [
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
      const title = [leftCaption, rightCaption].filter(Boolean).join(" | ") || "Side by Side";
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
      const title = [leftCaption, centerCaption, rightCaption].filter(Boolean).join(" | ") || "3 Side by Side";
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
    prepare({ topLeftCaption, topRightCaption, bottomLeftCaption, bottomRightCaption, topLeftImage }) {
      const title = [topLeftCaption, topRightCaption, bottomLeftCaption, bottomRightCaption].filter(Boolean).join(" | ") || "Grid of 4";
      return {
        title,
        subtitle: "4 items",
        media: topLeftImage || ThLargeIcon,
      };
    },
  },
});
