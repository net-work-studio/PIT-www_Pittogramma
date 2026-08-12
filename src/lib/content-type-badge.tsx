import { Badge } from "@/components/ui/badge";

export const DETAIL_PAGE_LABELS = {
  project: "Project",
  interview: "Interview",
} as const;

type DetailPageType =
  | keyof typeof DETAIL_PAGE_LABELS
  | "article"
  | "diary"
  | "baseline";
type DetailPageLabel = keyof typeof DETAIL_PAGE_LABELS;

type DetailPageBadgeProps =
  | { label: string; type: Exclude<DetailPageType, DetailPageLabel> }
  | { label?: never; type: DetailPageLabel };

export function DetailPageBadge({ label, type }: DetailPageBadgeProps) {
  const text =
    type === "project" || type === "interview" ? DETAIL_PAGE_LABELS[type] : label;
  return <Badge variant={`detail-${type}`}>{text}</Badge>;
}
