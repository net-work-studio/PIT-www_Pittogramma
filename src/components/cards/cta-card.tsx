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
    <Button asChild>
      {isExternal ? (
        <a href={href} rel="noopener noreferrer" target="_blank">
          {buttonText}
        </a>
      ) : (
        <Link href={href}>{buttonText}</Link>
      )}
    </Button>
  ) : (
    <Button>{buttonText}</Button>
  );

  if (resolvedVariant === "withImage" && image) {
    return (
      <div className="flex w-full flex-col gap-4 overflow-hidden rounded-[10px] bg-secondary p-4 md:flex-row md:p-8">
        <div className="md:w-1/3">
          <SanityImage
            className="h-auto max-h-80 w-full object-contain"
            sizes="(max-width: 768px) 100vw, 400px"
            source={image}
          />
        </div>
        <div className="flex w-full flex-col items-center justify-center md:w-2/3">
          {headline && (
            <h3 className="mb-2 text-balance text-center text-3xl text-foreground">
              {headline}
            </h3>
          )}
          {buttonElement}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start gap-6 text-balance rounded-lg bg-secondary p-5 text-center text-3xl">
      {headline && <h2>{headline}</h2>}
      {buttonElement}
    </div>
  );
}
