import {
  BookOpen,
  Briefcase,
  Calendar,
  FileText,
  Globe,
  GraduationCap,
  Home,
  Languages,
  MapPin,
  MessageCircle,
  MousePointerClick,
  Settings,
  Tag,
  User,
  Users,
} from "lucide-react";
import type { StructureResolver } from "sanity/structure";
import { docListItem, group, singleton } from "./helpers";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      /*  ...S.documentTypeListItems().filter(
        (item) => !singletonTypes.has(item.getId() || "")
      ), */

      docListItem(S, "project", "Project", Briefcase),
      docListItem(S, "interview", "Interview", MessageCircle),
      docListItem(S, "journal", "Journal", FileText),

      group(S, "Resources", [
        docListItem(S, "bibliography", "Bibliography"),
        docListItem(S, "bookshop", "Bookshop"),
        docListItem(S, "glossary", "Glossary"),
        docListItem(S, "designer", "Designer", User),
        docListItem(S, "institute", "Institute"),
        docListItem(S, "professional", "Professional", User),
        docListItem(S, "publisher", "Publisher"),
        docListItem(S, "studio", "Studio"),
        docListItem(S, "teacher", "Teacher", GraduationCap),
        docListItem(S, "typeFoundry", "Type Foundry"),
        docListItem(S, "webSource", "Web Source"),
      ]),

      group(S, "Pages", [
        singleton(S, "homePage", "Home", Home),
        singleton(S, "projectsPage", "Projects", Briefcase),
        singleton(S, "interviewsPage", "Interviews", MessageCircle),
        singleton(S, "designersPage", "Designers", User),
        singleton(S, "journalPage", "Journal", FileText),
        singleton(S, "eventsPage", "Events", Calendar),
        S.divider(),
        singleton(S, "history", "History"),
        docListItem(S, "event", "Event", Calendar),
        docListItem(S, "edition", "Edition", BookOpen),
      ]),

      docListItem(S, "cta", "CTAs", MousePointerClick),

      S.divider(),

      group(S, "Metadata", [
        docListItem(S, "city", "City", MapPin),
        docListItem(S, "country", "Country", Globe),
        docListItem(S, "language", "Language", Languages),
        docListItem(S, "tag", "Tag", Tag),
        docListItem(S, "contributor", "Contributor", Users),
        docListItem(S, "category", "Category", Tag),
        docListItem(S, "author", "Author", User),
      ]),

      S.divider(),

      singleton(S, "siteSettings", "Site Settings", Settings),
    ]);
