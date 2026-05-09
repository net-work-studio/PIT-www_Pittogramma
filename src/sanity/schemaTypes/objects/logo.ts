import { defineField, defineType } from "sanity";

export const logo = defineType({
  type: "object",
  name: "logo",
  title: "Logo",
  fields: [
    defineField({ type: "image", name: "logoLight", title: "Logo Light", description: "Upload black image, will be used in light mode." }),
    defineField({ type: "image", name: "logoDark", title: "Logo Dark", description: "Upload white image, will be used in dark mode." }),
    defineField({ type: "string", name: "alt", title: "Alt" }),
  ],
});
