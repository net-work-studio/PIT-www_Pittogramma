import { CommentIcon } from "@sanity/icons/Comment";
import { createElement } from "react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { InterviewReadingTimeInput } from "@/sanity/components/interview-reading-time-input";
import { tagsField } from "@/sanity/schemaTypes/objects/tag-selector";
import { groups } from "@/sanity/utils/groups";

const QuestionStyle = (props: { children: React.ReactNode }) =>
  createElement(
    "span",
    {
      style: {
        borderTop: "1px solid #1a1a1a",
        color: "#1a1a1a",
        display: "block",
        fontWeight: 600,
        paddingLeft: "0em",
        paddingTop: "0.75em",
      },
    },
    props.children
  );

const AnswerStyle = (props: { children: React.ReactNode }) =>
  createElement(
    "span",
    {
      style: {
        color: "#666",
        display: "block",
        fontWeight: 400,
        paddingBottom: "2.5em",
      },
    },
    props.children
  );

export const interview = defineType({
  fields: [
    defineField({
      group: "metadata",
      name: "title",
      title: "Title",
      type: "string",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "metadata",
      name: "slug",
      options: {
        source: "title",
      },
      title: "Slug",
      type: "slug",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "metadata",
      name: "publishingDate",
      title: "Publishing Date",
      type: "publishingDate",
    }),
    defineField({
      group: "content",
      name: "cover",
      title: "Cover",
      type: "coverMedia",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "content",
      initialValue: "designers",
      name: "interviewToType",
      options: {
        layout: "radio",
        list: [
          { title: "Designers", value: "designers" },
          { title: "Studio", value: "studio" },
          { title: "Type Foundry", value: "typeFoundry" },
        ],
      },
      title: "Interview To",
      type: "string",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "content",
      name: "designersAndProfessionals",
      of: [
        defineArrayMember({
          options: {
            filter: '"designer" in roles || "professional" in roles',
          },
          to: [{ type: "person" }],
          type: "reference",
        }),
      ],
      title: "Designers and Professionals",
      type: "array",
      validation: (rule) =>
        rule.unique().error("You cannot add the same person twice"),
    }),
    defineField({
      group: "content",
      hidden: ({ parent }) => parent?.interviewToType !== "studio",
      name: "studio",
      title: "Studio",
      to: [{ type: "studio" }],
      type: "reference",
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
      group: "content",
      hidden: ({ parent }) => parent?.interviewToType !== "typeFoundry",
      name: "typeFoundry",
      title: "Type Foundry",
      to: [{ type: "typeFoundry" }],
      type: "reference",
      validation: (e) =>
        e.custom((value, context) => {
          const parent = context.parent as { interviewToType?: string };
          if (parent?.interviewToType === "typeFoundry" && !value) {
            return "Type Foundry is required";
          }
          return true;
        }),
    }),
    defineField({
      group: "content",
      name: "place",
      title: "Place",
      to: [{ type: "place" }],
      type: "reference",
    }),
    defineField({
      components: { input: InterviewReadingTimeInput },
      description:
        "Calculated live from the intro, interview text, quotes, and media captions at 200 words per minute.",
      group: "content",
      name: "readingTime",
      title: "Reading Time",
      type: "number",
      validation: (e) => e.min(1).integer(),
    }),
    tagsField("content"),
    defineField({
      group: "content",
      name: "introText",
      title: "Intro Text",
      type: "text",
      validation: (e) => e.required(),
    }),
    defineField({
      group: "content",
      name: "interview",
      of: [
        defineArrayMember({
          lists: [{ title: "Bullet", value: "bullet" }],
          marks: {
            annotations: [],
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
          },
          styles: [
            { component: QuestionStyle, title: "Question", value: "normal" },
            { component: AnswerStyle, title: "Answer", value: "answer" },
            { title: "Quote", value: "blockquote" },
          ],
          type: "block",
        }),

        defineArrayMember({ type: "singleMediaBlock" }),
        defineArrayMember({ type: "sideBySideMediaBlock" }),
        defineArrayMember({ type: "threeSideBySideMediaBlock" }),
        defineArrayMember({ type: "gridFourMediaBlock" }),
      ],
      title: "Interview",
      type: "array",
    }),
    defineField({
      group: "seo",
      name: "seo",
      title: "SEO",
      type: "seoModule",
    }),
  ],
  groups,
  icon: CommentIcon,
  name: "interview",
  orderings: [
    {
      by: [{ direction: "desc", field: "publishingDate.date" }],
      name: "publishingDateDesc",
      title: "Publishing Date, Newest",
    },
    {
      by: [{ direction: "asc", field: "publishingDate.date" }],
      name: "publishingDateAsc",
      title: "Publishing Date, Oldest",
    },
  ],
  preview: {
    prepare({ title, media, date }) {
      return {
        media,
        subtitle: date,
        title,
      };
    },
    select: {
      date: "publishingDate.date",
      media: "cover.image",
      title: "title",
    },
  },
  title: "Interview",
  type: "document",
});
