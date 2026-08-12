import { describe, expect, test } from "bun:test";

import {
  type ResourceListSortColumn,
  sortResourceListItems,
} from "./resource-list-sort";

interface Item {
  name?: string | null;
  year?: number | null;
}

const columns: ResourceListSortColumn<Item>[] = [
  { getSortValue: (item) => item.name, id: "name" },
  { getSortValue: (item) => item.year, id: "year" },
];

describe("sortResourceListItems", () => {
  test("preserves the original order without an active sort", () => {
    const items = [{ name: "Beta" }, { name: "Alpha" }];

    expect(sortResourceListItems(items, columns, null)).toEqual(items);
  });

  test("sorts text in either direction and always leaves missing values last", () => {
    const items = [{ name: "Beta" }, { name: null }, { name: "Alpha" }];

    expect(
      sortResourceListItems(items, columns, {
        columnId: "name",
        direction: "asc",
      })
    ).toEqual([{ name: "Alpha" }, { name: "Beta" }, { name: null }]);
    expect(
      sortResourceListItems(items, columns, {
        columnId: "name",
        direction: "desc",
      })
    ).toEqual([{ name: "Beta" }, { name: "Alpha" }, { name: null }]);
  });

  test("sorts numeric values numerically", () => {
    const items = [{ year: 1999 }, { year: 2001 }, { year: 1985 }];

    expect(
      sortResourceListItems(items, columns, {
        columnId: "year",
        direction: "asc",
      })
    ).toEqual([{ year: 1985 }, { year: 1999 }, { year: 2001 }]);
  });
});
