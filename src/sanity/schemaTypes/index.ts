import type { SchemaTypeDefinition } from "sanity";
import { author } from "./documents/author";
import { bibliography } from "./documents/bibliography";
import { bookshop } from "./documents/bookshop";
import { category } from "./documents/category";
import { contributor } from "./documents/contributor";
import { cta } from "./documents/cta";
import { designer } from "./documents/designer";
import { edition } from "./documents/edition";
import { event } from "./documents/event";
import { glossary } from "./documents/glossary";
import { history } from "./documents/history";
import { institute } from "./documents/institute";
import { interview } from "./documents/interview";
import { journal } from "./documents/journal";
import { language } from "./documents/language";
import { place } from "./documents/place";
import { professional } from "./documents/professional";
import { project } from "./documents/project";
import { publisher } from "./documents/publisher";
import { studio } from "./documents/studio";
import { tag } from "./documents/tag";
import { teacher } from "./documents/teacher";
import { typeFoundry } from "./documents/type-foundry";
import { webSource } from "./documents/web-source";
import {
  gridFourMediaBlock,
  sideBySideMediaBlock,
  singleMediaBlock,
  threeSideBySideMediaBlock,
} from "./objects/gallery-blocks";
import { imageWithMetadata } from "./objects/image-with-metadata";
import { logo } from "./objects/logo";
import { mediaItem } from "./objects/media-item";
import { openGraph } from "./objects/open-graph";
import { publishingDate } from "./objects/publishing-date";
import { seoModule } from "./objects/seo-module";
import { socialLinks } from "./objects/social-links";
import { titleSlug } from "./objects/title-slug";
import { xCard } from "./objects/x-card";
import { designersPage } from "./singletons/pages/designers-page";
import { eventsPage } from "./singletons/pages/events-page";
import { homePage } from "./singletons/pages/home-page";
import { interviewsPage } from "./singletons/pages/interviews-page";
import { journalPage } from "./singletons/pages/journal-page";
import { projectsPage } from "./singletons/pages/projects-page";
import { siteSettings } from "./singletons/site-settings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    contributor,
    cta,
    designer,
    edition,
    event,
    history,
    institute,
    interview,
    journal,
    language,
    project,
    studio,
    teacher,
    logo,
    imageWithMetadata,
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
    homePage,
    projectsPage,
    interviewsPage,
    journalPage,
    designersPage,
    eventsPage,
    socialLinks,
    professional,
    publishingDate,
    category,
    typeFoundry,
    bookshop,
    glossary,
    author,
    publisher,
    webSource,
    bibliography,
  ],
};
