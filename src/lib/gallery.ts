import { stegaClean } from "next-sanity";

export function getGalleryRatio(orientation?: string | null): number {
  return stegaClean(orientation) === "portrait" ? 3 / 4 : 4 / 3;
}
