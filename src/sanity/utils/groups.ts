import { DatabaseIcon } from "@sanity/icons/Database";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { SearchIcon } from "@sanity/icons/Search";

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
