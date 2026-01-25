import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  className,
}: PageHeaderProps) {
  return (
    <hgroup
      className={cn(
        "flex flex-col items-center justify-center pt-16 pb-24 text-center",
        className
      )}
    >
      <h1 className="text-2xl uppercase">{title}</h1>
      <p className="max-w-prose text-balance text-2xl">{subtitle}</p>
    </hgroup>
  );
}
