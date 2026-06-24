import { buildTrackedLink, type UtmSettings } from "@/lib/tracked-link";
import { cn } from "@/lib/utils";

interface ResourceNameLinkProps {
  className?: string;
  name: string | null | undefined;
  resourceType: string;
  url?: string | null;
  utmSettings?: UtmSettings;
}

export function ResourceNameLink({
  name,
  url,
  resourceType,
  utmSettings,
  className,
}: ResourceNameLinkProps) {
  if (!name) {
    return <>-</>;
  }

  if (!url) {
    return <span className={className}>{name}</span>;
  }

  return (
    <a
      className={cn("underline hover:no-underline", className)}
      href={buildTrackedLink(url, resourceType, utmSettings)}
      rel="noopener noreferrer"
      target="_blank"
    >
      {name}
    </a>
  );
}
