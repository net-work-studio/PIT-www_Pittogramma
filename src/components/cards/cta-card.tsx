import Link from "next/link";
import { stegaClean } from "next-sanity";

import SanityImage from "@/components/modules/shared/sanity-image";
import { MultilineText } from "@/components/shared/multiline-text";
import { Button } from "@/components/ui/button";
import { resolveInternalLink } from "@/lib/resolve-link";

interface InternalLinkDoc {
  _type: string;
  slug?: { current: string } | null;
}

type CtaImageSource = React.ComponentProps<typeof SanityImage>["source"];

interface CtaCardProps {
  buttonText: string;
  externalUrl?: string | null;
  headline?: string | null;
  imgDark?: CtaImageSource;
  imgLight?: CtaImageSource;
  internalLink?: InternalLinkDoc | null;
  linkType?: "internal" | "external" | null;
  variant?: "simple" | "withImage" | null;
}

function CtaImages({
  imgDark,
  imgLight,
}: {
  imgDark?: CtaImageSource;
  imgLight?: CtaImageSource;
}) {
  const hasBothImages = Boolean(
    imgLight?.image?.asset && imgDark?.image?.asset
  );

  return (
    <div className="md:w-1/3">
      {imgLight ? (
        <SanityImage
          className={
            hasBothImages
              ? "h-auto max-h-80 w-full object-contain dark:hidden"
              : "h-auto max-h-80 w-full object-contain"
          }
          sizes="(max-width: 768px) 100vw, 400px"
          source={imgLight}
        />
      ) : null}
      {imgDark ? (
        <SanityImage
          className={
            hasBothImages
              ? "hidden h-auto max-h-80 w-full object-contain dark:block"
              : "h-auto max-h-80 w-full object-contain"
          }
          sizes="(max-width: 768px) 100vw, 400px"
          source={imgDark}
        />
      ) : null}
    </div>
  );
}

export default function CtaCard({
  headline,
  buttonText,
  variant,
  imgDark,
  imgLight,
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
    <Button
      nativeButton={false}
      render={
        isExternal ? (
          // Base UI injects the Button children into this render element.
          // biome-ignore lint/a11y/useAnchorContent: The anchor has the stable aria-label below.
          <a
            aria-label={buttonText}
            href={href}
            rel="noopener noreferrer"
            target="_blank"
          />
        ) : (
          <Link href={href} />
        )
      }
      variant="mono"
    >
      {buttonText}
    </Button>
  ) : (
    <Button>{buttonText}</Button>
  );

  if (resolvedVariant === "withImage" && (imgLight || imgDark)) {
    return (
      <div className="w-full overflow-hidden rounded-xl bg-secondary">
        <div className="mx-auto flex max-w-375 flex-col gap-4 p-4 md:flex-row md:p-8">
          <CtaImages imgDark={imgDark} imgLight={imgLight} />
          <div className="flex w-full flex-col items-center justify-center gap-4 md:w-2/3">
            {headline ? (
              <h3 className="mb-2 max-w-prose text-pretty text-center text-3xl text-foreground">
                <MultilineText text={headline} />
              </h3>
            ) : null}
            {buttonElement}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start gap-4 text-balance rounded-lg bg-secondary p-5 text-center text-3xl">
      {headline ? (
        <h2 className="max-w-prose text-balance">
          <MultilineText text={headline} />
        </h2>
      ) : null}
      {buttonElement}
    </div>
  );
}
