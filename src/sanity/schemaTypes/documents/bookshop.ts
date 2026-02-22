import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { directoryFields } from "@/sanity/utils/directoryFields";

export const bookshop = defineType({
  type: "document",
  name: "bookshop",
  title: "Bookshop",
  icon: HomeIcon,
  fields: [
    ...directoryFields,
    defineField({
      type: "string",
      name: "address",
      title: "Address",
    }),
  ],
});
