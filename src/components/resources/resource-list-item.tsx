import { cn } from "@/lib/utils";

interface ResourceListItemProps {
  children: React.ReactNode;
  className?: string;
}

export function ResourceListItem({
  children,
  className,
}: ResourceListItemProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-12 gap-2.5 rounded-lg bg-muted p-2.5 transition-colors duration-75 hover:bg-foreground hover:text-background",
        className
      )}
    >
      {children}
    </ul>
  );
}
