import type { SchemaTypeDefinition } from "sanity";
import { contributor } from "./documents/contributor";
import { designer } from "./documents/designer";
import { edition } from "./documents/edition";
import { event } from "./documents/event";
import { history } from "./documents/history";
import { institute } from "./documents/institute";
import { interview } from "./documents/interview";
import { project } from "./documents/project";
import { studio } from "./documents/studio";
import { teacher } from "./documents/teacher";
import { logo } from "./objects/logo";
import { mainImage } from "./objects/mainImage";
import { titleSlug } from "./objects/titleSlug";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    contributor,
    designer,
    edition,
    event,
    history,
    institute,
    interview,
    project,
    studio,
    teacher,
    logo,
    mainImage,
    titleSlug,
  ],
};
