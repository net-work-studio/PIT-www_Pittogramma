import {
  BookOpen,
  Briefcase,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarX,
  FileText,
  GraduationCap,
  Handshake,
  Home,
  Languages,
  List,
  MapPin,
  Megaphone,
  MessageCircle,
  MousePointerClick,
  Settings,
  Tag,
  User,
  Users,
} from "lucide-react";
import type { StructureResolver } from "sanity/structure";
import { buildLocalToday } from "@/lib/date-utils";
import { apiVersion } from "@/sanity/env";
import { docListItem, group, singleton } from "./helpers";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      singleton(S, "homePage", "Home", Home),

      group(
        S,
        "Projects",
        [
          singleton(S, "projectsPage", "Projects Page", Briefcase),
          S.divider(),
          docListItem(S, "project", "Project", Briefcase),
        ],
        "projects",
        Briefcase
      ),

      group(
        S,
        "Interviews",
        [
          singleton(S, "interviewsPage", "Interviews Page", MessageCircle),
          S.divider(),
          docListItem(S, "interview", "Interview", MessageCircle),
        ],
        "interviews",
        MessageCircle
      ),

      group(
        S,
        "People",
        [
          singleton(S, "designersPage", "Designers Page", User),
          S.divider(),
          docListItem(S, "person", "All People", User),
          S.listItem()
            .title("Journal Authors")
            .icon(User)
            .child(
              S.documentList()
                .title("Journal Authors")
                .apiVersion(apiVersion)
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
                .apiVersion(apiVersion)
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
                .apiVersion(apiVersion)
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
                .apiVersion(apiVersion)
                .filter(
                  '_type == "person" && _id in *[_type == "bibliography"].authors[]._ref'
                )
            ),
        ],
        "people",
        Users
      ),

      S.divider(),

      group(
        S,
        "Resources",
        [
          docListItem(S, "bibliography", "Bibliography"),
          docListItem(S, "bookshop", "Bookshop"),
          docListItem(S, "glossary", "Glossary"),
          docListItem(S, "institute", "Institute", GraduationCap),
          docListItem(S, "publisher", "Publisher"),
          docListItem(S, "studio", "Studio"),
          docListItem(S, "typeFoundry", "Type Foundry"),
          docListItem(S, "webSource", "Web Source"),
        ],
        "resources"
      ),

      S.divider(),

      group(
        S,
        "Journal",
        [
          singleton(S, "journalPage", "Journal Page", FileText),
          S.divider(),
          docListItem(S, "journal", "Journal", FileText),
        ],
        "journal",
        FileText
      ),

      group(
        S,
        "Events",
        [
          singleton(S, "eventsPage", "Events Page", Calendar),
          S.divider(),
          docListItem(S, "event", "Event", Calendar),
        ],
        "events",
        Calendar
      ),

      S.divider(),

      group(
        S,
        "Editions",
        [
          singleton(S, "editionsPage", "Editions Page", BookOpen),
          S.divider(),
          docListItem(S, "edition", "Edition", BookOpen),
        ],
        "editions",
        BookOpen
      ),

      S.divider(),

      group(
        S,
        "ADVs",
        [
          S.listItem()
            .title("Active")
            .icon(CalendarCheck)
            .child(() =>
              S.documentList()
                .id("adv-active")
                .title("Active ADVs")
                .apiVersion(apiVersion)
                .filter(
                  '_type == "adv" && dateStart <= $today && dateEnd >= $today'
                )
                .params({ today: buildLocalToday() })
                .defaultOrdering([{ field: "dateStart", direction: "asc" }])
            ),
          S.listItem()
            .title("Upcoming")
            .icon(CalendarClock)
            .child(() =>
              S.documentList()
                .id("adv-upcoming")
                .title("Upcoming ADVs")
                .apiVersion(apiVersion)
                .filter('_type == "adv" && dateStart > $today')
                .params({ today: buildLocalToday() })
                .defaultOrdering([{ field: "dateStart", direction: "asc" }])
            ),
          S.listItem()
            .title("Expired")
            .icon(CalendarX)
            .child(() =>
              S.documentList()
                .id("adv-expired")
                .title("Expired ADVs")
                .apiVersion(apiVersion)
                .filter('_type == "adv" && dateEnd < $today')
                .params({ today: buildLocalToday() })
                .defaultOrdering([{ field: "dateEnd", direction: "desc" }])
            ),
          S.divider(),
          S.listItem()
            .title("All")
            .icon(List)
            .child(S.documentTypeList("adv").title("All ADVs")),
        ],
        "advs",
        Megaphone
      ),

      group(
        S,
        "Community",
        [
          S.listItem()
            .title("Active")
            .icon(CalendarCheck)
            .child(() =>
              S.documentList()
                .id("community-active")
                .title("Active Community")
                .apiVersion(apiVersion)
                // Active includes evergreen items (no dateEnd set).
                .filter(
                  '_type == "community" && dateStart <= $today && (!defined(dateEnd) || dateEnd >= $today)'
                )
                .params({ today: buildLocalToday() })
                .defaultOrdering([{ field: "dateStart", direction: "asc" }])
            ),
          S.listItem()
            .title("Upcoming")
            .icon(CalendarClock)
            .child(() =>
              S.documentList()
                .id("community-upcoming")
                .title("Upcoming Community")
                .apiVersion(apiVersion)
                .filter('_type == "community" && dateStart > $today')
                .params({ today: buildLocalToday() })
                .defaultOrdering([{ field: "dateStart", direction: "asc" }])
            ),
          S.listItem()
            .title("Expired")
            .icon(CalendarX)
            .child(() =>
              S.documentList()
                .id("community-expired")
                .title("Expired Community")
                .apiVersion(apiVersion)
                // Evergreen items (no dateEnd) can't expire — exclude them.
                .filter(
                  '_type == "community" && defined(dateEnd) && dateEnd < $today'
                )
                .params({ today: buildLocalToday() })
                .defaultOrdering([{ field: "dateEnd", direction: "desc" }])
            ),
          S.divider(),
          S.listItem()
            .title("All")
            .icon(List)
            .child(S.documentTypeList("community").title("All Community")),
        ],
        "community",
        Handshake
      ),
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
