import { HomeIcon } from "@sanity/icons/Home";
import { defineField, defineType } from "sanity";
import { directoryFields } from "@/sanity/utils/directory-fields";

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
