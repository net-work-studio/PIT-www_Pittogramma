export type JournalLabel = "articles" | "diary" | "baseline";

export interface JournalLabelOption {
  title: string;
  value: JournalLabel;
}

export const JOURNAL_LABELS: JournalLabelOption[] = [
  { value: "articles", title: "Articles" },
  { value: "diary", title: "Diary" },
  { value: "baseline", title: "Baseline" },
];
