interface EducationEntry {
  courseName?: string | null;
  degree?: string | null;
  institute?: { name?: string | null } | null;
  year?: number | null;
}

/** Shared field order: institute, course, degree. */
export function educationTextParts(edu: EducationEntry): string[] {
  return [edu.institute?.name, edu.courseName, edu.degree].filter(
    (part): part is string => Boolean(part)
  );
}

export function formatEducationInline(edu: EducationEntry): string {
  return [...educationTextParts(edu), edu.year]
    .filter((part) => part !== null && part !== undefined && part !== "")
    .join(", ");
}

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
