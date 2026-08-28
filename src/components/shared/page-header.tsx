import { MultilineText } from "@/components/shared/multiline-text";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  className?: string;
  subtitle?: string;
  title: string;
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
      {subtitle ? (
        <p className="min-h-16 max-w-prose text-balance text-2xl lg:min-h-0">
          <MultilineText text={subtitle} />
        </p>
      ) : null}
    </hgroup>
  );
}
