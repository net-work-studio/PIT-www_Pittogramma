export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "a-z", label: "A \u2192 Z" },
  { value: "z-a", label: "Z \u2192 A" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export function isValidSort(value: string | undefined): value is SortOption {
  return SORT_OPTIONS.some((o) => o.value === value);
}
