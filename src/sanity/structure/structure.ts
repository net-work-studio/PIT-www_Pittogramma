import {
  BookOpen,
  Briefcase,
  Calendar,
  FileText,
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

      group(S, "People", [
        docListItem(S, "person", "All People", User),
        S.listItem()
          .title("Journal Authors")
          .icon(User)
          .child(
            S.documentList()
              .title("Journal Authors")
              .filter(
                '_type == "person" && _id in *[_type == "journal"].authors[]._ref'
              )
          ),
        S.listItem()
          .title("Project Designers")
          .icon(User)
          .child(
            S.documentList()
              .title("Project Designers")
              .filter(
                '_type == "person" && _id in *[_type == "project"].designers[]._ref'
              )
          ),
        S.listItem()
          .title("Interview People")
          .icon(User)
          .child(
            S.documentList()
              .title("Interview People")
              .filter(
                '_type == "person" && _id in *[_type == "interview"].designersAndProfessionals[]._ref'
              )
          ),
        S.listItem()
          .title("Bibliography Authors")
          .icon(User)
          .child(
            S.documentList()
              .title("Bibliography Authors")
              .filter(
                '_type == "person" && _id in *[_type == "bibliography"].authors[]._ref'
              )
          ),
      ]),

      group(S, "Resources", [
        docListItem(S, "bibliography", "Bibliography"),
        docListItem(S, "bookshop", "Bookshop"),
        docListItem(S, "glossary", "Glossary"),
        docListItem(S, "institute", "Institute"),
        docListItem(S, "publisher", "Publisher"),
        docListItem(S, "studio", "Studio"),
        docListItem(S, "typeFoundry", "Type Foundry"),
        docListItem(S, "webSource", "Web Source"),
      ]),

      group(S, "Pages", [
        singleton(S, "homePage", "Home", Home),
        singleton(S, "projectsPage", "Projects", Briefcase),
        singleton(S, "interviewsPage", "Interviews", MessageCircle),
        singleton(S, "designersPage", "Designers", User),
        singleton(S, "journalPage", "Journal Page", FileText),
        singleton(S, "eventsPage", "Events Page", Calendar),
        singleton(S, "history", "History"),
        S.divider(),
        docListItem(S, "journal", "Journals Items", FileText),
        docListItem(S, "event", "Events Items", Calendar),
        docListItem(S, "edition", "Editions Items", BookOpen),
      ]),

      S.divider(),
      docListItem(S, "cta", "CTAs", MousePointerClick),

      group(S, "Metadata", [
        docListItem(S, "place", "Place", MapPin),
        docListItem(S, "language", "Language", Languages),
        docListItem(S, "tag", "Tag", Tag),
        docListItem(S, "contributor", "Contributor", Users),
        docListItem(S, "category", "Category", Tag),
      ]),

      S.divider(),

      singleton(S, "siteSettings", "Site Settings", Settings),
    ]);
