export const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "A \u2192 Z", value: "a-z" },
  { label: "Z \u2192 A", value: "z-a" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export function isValidSort(value: string | undefined): value is SortOption {
  return SORT_OPTIONS.some((o) => o.value === value);
}
