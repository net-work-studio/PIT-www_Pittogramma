/** Most recent graduation year first; entries without a year sink to the bottom. */
export function sortEducationByYearDesc<T extends { year: number | null }>(
  education: readonly T[]
): T[] {
  return [...education].sort((a, b) => {
    if (a.year === null && b.year === null) {
      return 0;
    }
    if (a.year === null) {
      return 1;
    }
    if (b.year === null) {
      return -1;
    }
    return b.year - a.year;
  });
}
