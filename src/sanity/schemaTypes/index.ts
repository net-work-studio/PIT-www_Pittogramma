import type { SchemaTypeDefinition } from "sanity";
import { city } from "./documents/city";
import { contributor } from "./documents/contributor";
import { country } from "./documents/country";
import { designer } from "./documents/designer";
import { edition } from "./documents/edition";
import { event } from "./documents/event";
import { history } from "./documents/history";
import { institute } from "./documents/institute";
import { interview } from "./documents/interview";
import { language } from "./documents/language";
import { professional } from "./documents/professional";
import { project } from "./documents/project";
import { studio } from "./documents/studio";
import { tag } from "./documents/tag";
import { teacher } from "./documents/teacher";
import { imageWithMetadata } from "./objects/imageWithMetadata";
import { location } from "./objects/location";
import { logo } from "./objects/logo";
import { openGraph } from "./objects/openGraph";
import { publishingDate } from "./objects/publishingDate";
import { seoModule } from "./objects/seoModule";
import { socialLinks } from "./objects/socialLinks";
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
  ],
};
