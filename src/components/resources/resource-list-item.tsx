import { cn } from "@/lib/utils";

interface ResourceListItemProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
}

const rowClassName =
  "grid grid-cols-12 gap-2.5 rounded-lg bg-muted p-2.5 transition-colors duration-75 hover:bg-foreground hover:text-background";

export function ResourceListItem({
  children,
  className,
  href,
}: ResourceListItemProps) {
  if (href) {
    return (
      <a
        className={cn(rowClassName, "no-underline", className)}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
    );
  }

  return <ul className={cn(rowClassName, className)}>{children}</ul>;
}
