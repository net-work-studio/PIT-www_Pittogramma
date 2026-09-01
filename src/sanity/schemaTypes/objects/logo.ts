import { defineField, defineType } from "sanity";

export const logo = defineType({
  fields: [
    defineField({
      description: "Upload black image, will be used in light mode.",
      name: "logoLight",
      title: "Logo Light",
      type: "image",
    }),
    defineField({
      description: "Upload white image, will be used in dark mode.",
      name: "logoDark",
      title: "Logo Dark",
      type: "image",
    }),
    defineField({ name: "alt", title: "Alt", type: "string" }),
  ],
  name: "logo",
  title: "Logo",
  type: "object",
});
