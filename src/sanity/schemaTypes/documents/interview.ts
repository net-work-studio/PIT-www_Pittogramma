import { CommentIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { groups } from "@/sanity/utils/groups";

export const interview = defineType({
  type: "document",
  name: "interview",
  title: "Interview",
  icon: CommentIcon,
  groups,
  fields: [
    defineField({
      type: "string",
      name: "title",
      title: "Title",
      group: "metadata",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      group: "metadata",
      options: {
        source: "title",
      },
      validation: (e) => e.required(),
    }),
    defineField({
      type: "publishingDate",
      name: "publishingDate",
      title: "Publishing Date",
      group: "metadata",
    }),
    defineField({
      type: "imageWithMetadata",
      name: "cover",
      title: "Cover",
      validation: (e) => e.required(),
      group: "content",
    }),
    defineField({
      type: "string",
      name: "interviewToType",
      title: "Interview To",
      group: "content",
      options: {
        list: [
          { title: "Designers", value: "designers" },
          { title: "Studio", value: "studio" },
        ],
        layout: "radio",
      },
      initialValue: "designers",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "array",
      name: "designers",
      title: "Designers",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "designer" }],
        }),
      ],
    }),
    defineField({
      type: "reference",
      name: "studio",
      title: "Studio",
      group: "content",
      to: [{ type: "studio" }],
      validation: (e) =>
        e.custom((value, context) => {
          const parent = context.parent as { interviewToType?: string };
          if (parent?.interviewToType === "studio" && !value) {
            return "Studio is required";
          }
          return true;
        }),
    }),
    defineField({
      type: "reference",
      name: "city",
      title: "City",
      group: "content",
      to: [{ type: "city" }],
    }),
    defineField({
      type: "reference",
      name: "country",
      title: "Country",
      group: "content",
      to: [{ type: "country" }],
    }),
    defineField({
      type: "number",
      name: "readingTime",
      title: "Reading Time (minutes)",
      group: "content",
      validation: (e) => e.min(1).integer(),
    }),
    defineField({
      type: "array",
      name: "tags",
      title: "Tags",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "tag" }],
        }),
      ],
    }),
    defineField({
      type: "text",
      name: "introText",
      title: "Intro Text",
      group: "content",
      validation: (e) => e.required(),
    }),
    defineField({
      type: "array",
      name: "interview",
      title: "Interview",
      group: "content",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "object",
          name: "imageBlock",
          title: "Image",
          fields: [
            defineField({
              type: "imageWithMetadata",
              name: "image",
              title: "Image",
              validation: (e) => e.required(),
            }),
          ],
          preview: {
            select: {
              media: "image.image",
              caption: "image.caption",
            },
            prepare({ media, caption }) {
              return {
                title: caption || "Image",
                media,
              };
            },
          },
        }),
        defineArrayMember({
          type: "object",
          name: "multipleImageBlock",
          title: "Multiple Images",
          fields: [
            defineField({
              type: "array",
              name: "images",
              title: "Images",
              of: [defineArrayMember({ type: "imageWithMetadata" })],
              validation: (e) => e.required().min(2),
            }),
          ],
          preview: {
            select: {
              images: "images",
            },
            prepare({ images }) {
              const count = images?.length || 0;
              return {
                title: `${count} Images`,
                media: images?.[0]?.image,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      type: "seoModule",
      name: "seo",
      title: "SEO",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "cover.image",
    },
  },
});
