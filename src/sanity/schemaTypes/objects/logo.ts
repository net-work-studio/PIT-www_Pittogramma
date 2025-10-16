import { defineField, defineType } from "sanity";

export const logo = defineType({
  type: "object",
  name: "logo",
  title: "Logo",
  fields: [
    defineField({ type: "image", name: "logoLight", title: "Logo Light" }),
    defineField({ type: "image", name: "logoDark", title: "Logo Dark" }),
    defineField({ type: "string", name: "alt", title: "Alt" }),
  ],
});
