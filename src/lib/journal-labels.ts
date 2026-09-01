export type JournalLabel = "articles" | "diary" | "baseline";

export interface JournalLabelOption {
  title: string;
  value: JournalLabel;
}

export const JOURNAL_LABELS: JournalLabelOption[] = [
  { title: "Articles", value: "articles" },
  { title: "Diary", value: "diary" },
  { title: "Baseline", value: "baseline" },
];
