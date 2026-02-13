import { cn } from "@/lib/utils";
import { only } from "node:test";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  onlySeoTitle?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  className,
  onlySeoTitle = false,
}: PageHeaderProps) {
  return (
    <hgroup
      className={cn(onlySeoTitle ? "pt-0" : "pt-16",
        "flex flex-col items-center justify-center pb-24 text-center",
        className
      )}
    >
      <h1 className={cn(onlySeoTitle ? "sr-only" : "text-2xl uppercase")}>{title}</h1>
      <p className="max-w-prose text-balance text-2xl">{subtitle}</p>
    </hgroup>
  );
}
