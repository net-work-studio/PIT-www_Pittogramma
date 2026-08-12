import { cn } from "@/lib/utils";

interface ResourceListItemProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  id?: string;
  mobileContent?: React.ReactNode;
}

const rowClassName =
  "grid w-full grid-cols-12 items-start gap-2.5 border-b px-2.5 py-3 text-left transition-colors duration-75 ease-in-out hover:bg-muted";

export function ResourceListItem({
  children,
  className,
  href,
  id,
  mobileContent,
}: ResourceListItemProps) {
  const content = mobileContent ? (
    <>
      <div className="hidden md:contents">{children}</div>
      <div className="md:hidden">{mobileContent}</div>
    </>
  ) : (
    children
  );
  const mobileClassName = mobileContent
    ? "max-md:block max-md:py-[15px]"
    : undefined;

  if (href) {
    return (
      <a
        className={cn(rowClassName, "no-underline", mobileClassName, className)}
        href={href}
        id={id}
        rel="noopener noreferrer"
        target="_blank"
      >
        {content}
      </a>
    );
  }

  return (
    <div className={cn(rowClassName, mobileClassName, className)} id={id}>
      {content}
    </div>
  );
}
