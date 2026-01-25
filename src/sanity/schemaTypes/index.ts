import type { SchemaTypeDefinition } from "sanity";
import { author } from "./documents/author";
import { bibliography } from "./documents/bibliography";
import { bookshop } from "./documents/bookshop";
import { category } from "./documents/category";
import { city } from "./documents/city";
import { contributor } from "./documents/contributor";
import { country } from "./documents/country";
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
import { imageWithMetadata } from "./objects/imageWithMetadata";
import { location } from "./objects/location";
import { logo } from "./objects/logo";
import { openGraph } from "./objects/openGraph";
import { publishingDate } from "./objects/publishingDate";
import { seoModule } from "./objects/seoModule";
import { socialLinks } from "./objects/socialLinks";
import { tagSelector } from "./objects/tagSelector";
import { titleSlug } from "./objects/titleSlug";
import { xCard } from "./objects/xCard";
import { siteSettings } from "./singletons/siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    contributor,
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
    titleSlug,
    city,
    country,
    location,
    tag,
    seoModule,
    openGraph,
    xCard,
    siteSettings,
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
