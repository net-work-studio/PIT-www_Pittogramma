import { CommentIcon } from "@sanity/icons";
import { createElement } from "react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { tagsField } from "@/sanity/schemaTypes/objects/tag-selector";
import { groups } from "@/sanity/utils/groups";

const QuestionStyle = (props: { children: React.ReactNode }) =>
  createElement(
    "span",
    {
      style: {
        fontWeight: 600,
        color: "#1a1a1a",
        paddingLeft: "0em",
        borderTop: "1px solid #1a1a1a",
        paddingTop: "0.75em",
        display: "block",
      },
    },
    props.children
  );

const AnswerStyle = (props: { children: React.ReactNode }) =>
  createElement(
    "span",
    {
      style: {
        fontWeight: 400,
        color: "#666",
        paddingBottom: "2.5em",
        display: "block",
      },
    },
    props.children
  );

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
      name: "designersAndProfessionals",
      title: "Designers and Professionals",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "designer" }, { type: "professional" }],
        }),
      ],
      validation: (rule) =>
        rule.unique().error("You cannot add the same person twice"),
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
      name: "place",
      title: "Place",
      group: "content",
      to: [{ type: "place" }],
    }),
    defineField({
      type: "number",
      name: "readingTime",
      title: "Reading Time (minutes)",
      group: "content",
      validation: (e) => e.min(1).integer(),
    }),
    tagsField("content"),
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
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Question", value: "normal", component: QuestionStyle },
            { title: "Answer", value: "answer", component: AnswerStyle },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [],
          },
        }),

        defineArrayMember({ type: "singleMediaBlock" }),
        defineArrayMember({ type: "sideBySideMediaBlock" }),
        defineArrayMember({ type: "threeSideBySideMediaBlock" }),
        defineArrayMember({ type: "gridFourMediaBlock" }),
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
