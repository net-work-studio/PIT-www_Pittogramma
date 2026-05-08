import {
  JOURNAL_LABELS,
  type JournalLabel,
} from "@/lib/journal-labels";

export type { JournalLabel };

interface JournalLabelConfig {
  label: string;
  badgeVariant: "article" | "diary" | "baseline";
}

const BADGE_VARIANT: Record<JournalLabel, JournalLabelConfig["badgeVariant"]> = {
  articles: "article",
  diary: "diary",
  baseline: "baseline",
};

const LABEL_CONFIG: Record<JournalLabel, JournalLabelConfig> = Object.fromEntries(
  JOURNAL_LABELS.map((opt) => [
    opt.value,
    { label: opt.title, badgeVariant: BADGE_VARIANT[opt.value] },
  ])
) as Record<JournalLabel, JournalLabelConfig>;

export function getJournalLabelConfig(
  label: string | null | undefined,
): JournalLabelConfig | null {
  if (!label) return null;
  return LABEL_CONFIG[label as JournalLabel] ?? null;
}
