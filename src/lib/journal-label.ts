export type JournalLabel = "articles" | "diary" | "baseline";

interface JournalLabelConfig {
  label: string;
  badgeVariant: "article" | "diary" | "baseline";
}

const LABEL_CONFIG: Record<JournalLabel, JournalLabelConfig> = {
  articles: { label: "Articles", badgeVariant: "article" },
  diary: { label: "Diary", badgeVariant: "diary" },
  baseline: { label: "Baseline", badgeVariant: "baseline" },
};

export function getJournalLabelConfig(
  label: string | null | undefined,
): JournalLabelConfig | null {
  if (!label) return null;
  return LABEL_CONFIG[label as JournalLabel] ?? null;
}
