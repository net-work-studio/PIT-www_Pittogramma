import { DatabaseIcon, DocumentTextIcon, SearchIcon } from "@sanity/icons";

export const groups = [
  {
    name: "metadata",
    title: "Metadata",
    icon: DatabaseIcon,
  },
  {
    name: "content",
    title: "Content",
    default: true,
    icon: DocumentTextIcon,
  },
  {
    name: "seo",
    title: "SEO",
    icon: SearchIcon,
  },
];
