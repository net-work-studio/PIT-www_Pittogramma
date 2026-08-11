export type ResourceListSortDirection = "asc" | "desc";

export interface ResourceListSortState {
  columnId: string;
  direction: ResourceListSortDirection;
}

export type ResourceListSortValue = number | string | null | undefined;

export interface ResourceListSortColumn<T> {
  getSortValue: (item: T) => ResourceListSortValue;
  id: string;
}

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

function isMissing(value: ResourceListSortValue) {
  return value === null || value === undefined || value === "";
}

export function sortResourceListItems<T>(
  items: T[],
  columns: ResourceListSortColumn<T>[],
  sort: ResourceListSortState | null
): T[] {
  if (!sort) {
    return items;
  }

  const column = columns.find((candidate) => candidate.id === sort.columnId);

  if (!column) {
    return items;
  }

  return items.toSorted((firstItem, secondItem) => {
    const firstValue = column.getSortValue(firstItem);
    const secondValue = column.getSortValue(secondItem);
    const firstIsMissing = isMissing(firstValue);
    const secondIsMissing = isMissing(secondValue);

    if (firstIsMissing && secondIsMissing) {
      return 0;
    }

    if (firstIsMissing) {
      return 1;
    }

    if (secondIsMissing) {
      return -1;
    }

    const comparison =
      typeof firstValue === "number" && typeof secondValue === "number"
        ? firstValue - secondValue
        : collator.compare(String(firstValue), String(secondValue));

    return sort.direction === "asc" ? comparison : -comparison;
  });
}
