import type { SchemaTypeDefinition } from "sanity";
import { adv } from "./documents/adv";
import { bibliography } from "./documents/bibliography";
import { bookshop } from "./documents/bookshop";
import { category } from "./documents/category";
import { community } from "./documents/community";
import { contributor } from "./documents/contributor";
import { cta } from "./documents/cta";
import { edition } from "./documents/edition";
import { event } from "./documents/event";
import { glossary } from "./documents/glossary";
import { institute } from "./documents/institute";
import { interview } from "./documents/interview";
import { journal } from "./documents/journal";
import { language } from "./documents/language";
import { person } from "./documents/person";
import { place } from "./documents/place";
import { project } from "./documents/project";
import { publisher } from "./documents/publisher";
import { studio } from "./documents/studio";
import { tag } from "./documents/tag";
import { typeFoundry } from "./documents/type-foundry";
import { webSource } from "./documents/web-source";
import {
  gridFourMediaBlock,
  sideBySideMediaBlock,
  singleMediaBlock,
  threeSideBySideMediaBlock,
} from "./objects/gallery-blocks";
import { imageWithMetadata } from "./objects/image-with-metadata";
import { infoItem } from "./objects/info-item";
import { logo } from "./objects/logo";
import { mediaItem } from "./objects/media-item";
import { openGraph } from "./objects/open-graph";
import { publishingDate } from "./objects/publishing-date";
import { seoModule } from "./objects/seo-module";
import { socialLinks } from "./objects/social-links";
import { titleSlug } from "./objects/title-slug";
import { xCard } from "./objects/x-card";
import { aboutPage } from "./singletons/pages/about-page";
import { designersPage } from "./singletons/pages/designers-page";
import { editionsPage } from "./singletons/pages/editions-page";
import { eventsPage } from "./singletons/pages/events-page";
import { homePage } from "./singletons/pages/home-page";
import { interviewsPage } from "./singletons/pages/interviews-page";
import { journalPage } from "./singletons/pages/journal-page";
import { projectsPage } from "./singletons/pages/projects-page";
import { siteSettings } from "./singletons/site-settings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    adv,
    community,
    contributor,
    cta,
    edition,
    person,
    event,
    institute,
    interview,
    journal,
    language,
    project,
    studio,
    logo,
    imageWithMetadata,
    infoItem,
    mediaItem,
    singleMediaBlock,
    sideBySideMediaBlock,
    threeSideBySideMediaBlock,
    gridFourMediaBlock,
    titleSlug,
    place,
    tag,
    seoModule,
    openGraph,
    xCard,
    siteSettings,
    aboutPage,
    homePage,
    projectsPage,
    interviewsPage,
    journalPage,
    designersPage,
    eventsPage,
    editionsPage,
    socialLinks,
    publishingDate,
    category,
    typeFoundry,
    bookshop,
    glossary,
    publisher,
    webSource,
    bibliography,
  ],
};
