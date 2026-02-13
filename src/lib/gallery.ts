export function getGalleryRatio(orientation?: string | null): number {
  return orientation === "portrait" ? 3 / 4 : 4 / 3;
}
