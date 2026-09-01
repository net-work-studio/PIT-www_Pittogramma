import { HomeIcon } from "@sanity/icons/Home";
import { defineField, defineType } from "sanity";
import { directoryFields } from "@/sanity/utils/directory-fields";

export const bookshop = defineType({
  fields: [
    ...directoryFields,
    defineField({
      name: "address",
      title: "Address",
      type: "string",
    }),
  ],
  icon: HomeIcon,
  name: "bookshop",
  title: "Bookshop",
  type: "document",
});
