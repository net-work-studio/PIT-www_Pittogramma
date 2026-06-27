import { cn } from "@/lib/utils";

interface ResourceListItemProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
}

const rowClassName =
  "grid w-full grid-cols-12 items-start gap-2.5 border-b px-2.5 py-3 text-left transition-colors duration-75 ease-in-out hover:bg-muted";

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

  return <div className={cn(rowClassName, className)}>{children}</div>;
}
