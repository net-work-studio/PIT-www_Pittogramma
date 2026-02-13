import {
  DatabaseIcon,
  DocumentTextIcon,
  InfoOutlineIcon,
  SearchIcon,
} from "@sanity/icons";

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
    name: "og",
    title: "Open Graph Data",
    icon: InfoOutlineIcon,
  },
  {
    name: "seo",
    title: "SEO",
    icon: SearchIcon,
  },
];
