import { cn } from "@/lib/utils";

type ResourceListItemProps = {
  children: React.ReactNode;
  className?: string;
};

export function ResourceListItem({
  children,
  className,
}: ResourceListItemProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-12 gap-2.5 rounded-lg bg-secondary p-2.5",
        className
      )}
    >
      {children}
    </ul>
  );
}
