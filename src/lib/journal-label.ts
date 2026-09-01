import type { JournalLabel as JournalLabelValue } from "@/lib/journal-labels";
import { JOURNAL_LABELS } from "@/lib/journal-labels";

export type { JournalLabel } from "@/lib/journal-labels";

interface JournalLabelConfig {
  badgeVariant: "article" | "diary" | "baseline";
  label: string;
}

const BADGE_VARIANT: Record<
  JournalLabelValue,
  JournalLabelConfig["badgeVariant"]
> = {
  articles: "article",
  baseline: "baseline",
  diary: "diary",
};

const LABEL_CONFIG: Record<JournalLabelValue, JournalLabelConfig> =
  Object.fromEntries(
    JOURNAL_LABELS.map((opt) => [
      opt.value,
      { badgeVariant: BADGE_VARIANT[opt.value], label: opt.title },
    ])
  ) as Record<JournalLabelValue, JournalLabelConfig>;

export function getJournalLabelConfig(
  label: string | null | undefined
): JournalLabelConfig | null {
  if (!label) {
    return null;
  }
  return LABEL_CONFIG[label as JournalLabelValue] ?? null;
}
