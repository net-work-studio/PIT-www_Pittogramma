import { cn } from "@/lib/utils";

interface PageHeaderProps {
  className?: string;
  onlySeoTitle?: boolean;
  subtitle?: string;
  title: string;
}

export default function PageHeader({
  title,
  subtitle,
  className,
  onlySeoTitle = false,
}: PageHeaderProps) {
  if (onlySeoTitle) {
    return <h1 className="sr-only">{title}</h1>;
  }

  return (
    <hgroup
      className={cn(
        "flex flex-col items-center justify-center pt-16 pb-24 text-center",
        className
      )}
    >
      <h1 className="text-2xl uppercase">{title}</h1>
      {subtitle ? (
        <p className="max-w-prose text-balance text-2xl">{subtitle}</p>
      ) : null}
    </hgroup>
  );
}
