import type { LucideIcon } from "lucide-react";
import type { ListItemBuilder, StructureBuilder } from "sanity/structure";

export const singleton = (
  S: StructureBuilder,
  typeName: string,
  title?: string,
  icon?: LucideIcon
) =>
  S.listItem()
    .title(title || typeName)
    .id(typeName)
    .icon(icon)
    .child(
      S.document()
        .schemaType(typeName)
        .documentId(typeName) // fixed ID
    );

export const group = (
  S: StructureBuilder,
  title: string,
  items: ListItemBuilder[],
  id?: string,
  icon?: LucideIcon
) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .id(id || title.toLowerCase())
    .child(S.list().title(title).items(items));

export const docListItem = (
  S: StructureBuilder,
  typeName: string,
  title?: string,
  icon?: LucideIcon
) =>
  S.documentTypeListItem(typeName)
    .icon(icon)
    .title(title || typeName);
