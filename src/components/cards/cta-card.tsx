import Link from "next/link";
import { stegaClean } from "next-sanity";

import SanityImage from "@/components/modules/shared/sanity-image";
import { Button } from "@/components/ui/button";
import { resolveInternalLink } from "@/lib/resolve-link";

interface InternalLinkDoc {
  _type: string;
  slug?: { current: string } | null;
}

interface CtaCardProps {
  buttonText: string;
  externalUrl?: string | null;
  headline?: string | null;
  image?: React.ComponentProps<typeof SanityImage>["source"];
  internalLink?: InternalLinkDoc | null;
  linkType?: "internal" | "external" | null;
  variant?: "simple" | "withImage" | null;
}

export default function CtaCard({
  headline,
  buttonText,
  variant,
  image,
  linkType,
  internalLink,
  externalUrl,
}: CtaCardProps) {
  const resolvedVariant = stegaClean(variant) ?? "simple";
  const resolvedLinkType = stegaClean(linkType) ?? "internal";

  const href =
    resolvedLinkType === "external"
      ? externalUrl
      : resolveInternalLink(internalLink);

  const isExternal = resolvedLinkType === "external" && externalUrl;

  const buttonElement = href ? (
    <Button asChild variant="outline">
      {isExternal ? (
        <a href={href} rel="noopener noreferrer" target="_blank">
          {buttonText}
        </a>
      ) : (
        <Link href={href}>{buttonText}</Link>
      )}
    </Button>
  ) : (
    <Button variant="outline">{buttonText}</Button>
  );

  if (resolvedVariant === "withImage" && image) {
    return (
      <div className="relative overflow-hidden rounded-[10px]">
        <div className="relative aspect-4/3">
          <SanityImage
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            source={image}
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-start justify-end bg-linear-to-t from-black/60 to-transparent p-4">
          {headline && <h3 className="mb-2 text-white">{headline}</h3>}
          {buttonElement}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start gap-6 rounded-lg bg-secondary p-5 text-3xl">
      {headline && <h2>{headline}</h2>}
      {buttonElement}
    </div>
  );
}
