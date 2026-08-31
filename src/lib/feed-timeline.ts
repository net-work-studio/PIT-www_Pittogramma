export interface FeedTimelineEntry {
  _createdAt: string;
  dateStart: string;
}

export function sortFeedTimelineItems<T>(
  items: T[],
  getTimelineEntry: (item: T) => FeedTimelineEntry
): T[] {
  return items.toSorted((firstItem, secondItem) => {
    const firstEntry = getTimelineEntry(firstItem);
    const secondEntry = getTimelineEntry(secondItem);

    return (
      secondEntry.dateStart.localeCompare(firstEntry.dateStart) ||
      secondEntry._createdAt.localeCompare(firstEntry._createdAt)
    );
  });
}
