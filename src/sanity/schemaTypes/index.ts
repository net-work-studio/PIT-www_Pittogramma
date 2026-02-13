import type { SchemaTypeDefinition } from "sanity";
import { author } from "./documents/author";
import { bibliography } from "./documents/bibliography";
import { bookshop } from "./documents/bookshop";
import { category } from "./documents/category";
import { city } from "./documents/city";
import { contributor } from "./documents/contributor";
import { country } from "./documents/country";
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
import { professional } from "./documents/professional";
import { project } from "./documents/project";
import { publisher } from "./documents/publisher";
import { studio } from "./documents/studio";
import { tag } from "./documents/tag";
import { teacher } from "./documents/teacher";
import { typeFoundry } from "./documents/typeFoundry";
import { webSource } from "./documents/webSource";
import {
  gridFourMediaBlock,
  sideBySideMediaBlock,
  singleMediaBlock,
  threeSideBySideMediaBlock,
} from "./objects/galleryBlocks";
import { imageWithMetadata } from "./objects/imageWithMetadata";
import { location } from "./objects/location";
import { logo } from "./objects/logo";
import { mediaItem } from "./objects/mediaItem";
import { openGraph } from "./objects/openGraph";
import { publishingDate } from "./objects/publishingDate";
import { seoModule } from "./objects/seoModule";
import { socialLinks } from "./objects/socialLinks";
import { tagSelector } from "./objects/tagSelector";
import { titleSlug } from "./objects/titleSlug";
import { xCard } from "./objects/xCard";
import { designersPage } from "./singletons/pages/designersPage";
import { eventsPage } from "./singletons/pages/eventsPage";
import { homePage } from "./singletons/pages/homePage";
import { interviewsPage } from "./singletons/pages/interviewsPage";
import { journalPage } from "./singletons/pages/journalPage";
import { projectsPage } from "./singletons/pages/projectsPage";
import { siteSettings } from "./singletons/siteSettings";

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
    city,
    country,
    location,
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
    tagSelector,
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
