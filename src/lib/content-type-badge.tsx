import { Badge } from "@/components/ui/badge";

export const DETAIL_PAGE_LABELS = {
  project: "Project",
  interview: "Interview",
} as const;

type DetailPageLabel = keyof typeof DETAIL_PAGE_LABELS;

type DetailPageBadgeProps =
  | { label: string; type?: never }
  | { label?: never; type: DetailPageLabel };

export function DetailPageBadge({ label, type }: DetailPageBadgeProps) {
  const text = type ? DETAIL_PAGE_LABELS[type] : label;
  return <Badge variant="detail">{text}</Badge>;
}
