import { TextIcon } from "@sanity/icons";
import { defineType } from "sanity";
import { directoryFields } from "@/sanity/utils/directoryFields";

export const typeFoundry = defineType({
  type: "document",
  name: "typeFoundry",
  title: "Type Foundry",
  icon: TextIcon,
  fields: [...directoryFields],
});
