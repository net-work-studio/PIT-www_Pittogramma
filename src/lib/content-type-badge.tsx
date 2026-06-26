import { Badge } from "@/components/ui/badge";

export const DETAIL_PAGE_BADGE_VARIANT = "detail" as const;

export const DETAIL_PAGE_LABELS = {
  project: "Project",
  interview: "Interview",
} as const;

export function DetailPageBadge({ label }: { label: string }) {
  return <Badge variant={DETAIL_PAGE_BADGE_VARIANT}>{label}</Badge>;
}
