import { DatabaseIcon } from "@sanity/icons/Database";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { SearchIcon } from "@sanity/icons/Search";

export const groups = [
  {
    icon: DatabaseIcon,
    name: "metadata",
    title: "Metadata",
  },
  {
    default: true,
    icon: DocumentTextIcon,
    name: "content",
    title: "Content",
  },
  {
    icon: InfoOutlineIcon,
    name: "og",
    title: "Open Graph Data",
  },
  {
    icon: SearchIcon,
    name: "seo",
    title: "SEO",
  },
];
