import SanityImage from "@/components/modules/shared/sanity-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import type { SanityImageCrop, SanityImageHotspot } from "@/sanity/types";

interface LogoImageField {
  asset?: { _id?: string; url?: string; metadata?: unknown } | null;
  crop?: SanityImageCrop | null;
  hotspot?: SanityImageHotspot | null;
}

export interface LogoFields {
  alt: string | null;
  logoDark: LogoImageField | null;
  logoLight: LogoImageField | null;
}

interface LogoFrameProps {
  className?: string;
  description?: string | null;
  layout?: "card" | "grid";
  logo: LogoFields | null;
  name?: string | null;
  sizes?: string;
  title?: string;
}

export default function LogoFrame({
  className,
  description,
  layout = "card",
  logo,
  name,
  sizes = "(min-width: 1280px) 20vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw",
  title,
}: LogoFrameProps) {
  const alt = logo?.alt ?? name ?? "";
  const light = logo?.logoLight;
  const dark = logo?.logoDark;
  const hasLight = Boolean(light?.asset);
  const hasDark = Boolean(dark?.asset);
  const hasBoth = hasLight && hasDark;

  if (!(hasLight || hasDark)) {
    return null;
  }

  return (
    <div
      className={cn(
        layout === "card" && "flex w-48 flex-col gap-3 sm:w-56",
        layout === "grid" && "w-full",
        className
      )}
      title={title}
    >
      <AspectRatio
        className="relative w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900"
        ratio={4 / 3}
      >
        <div className="flex h-full w-full items-center justify-center p-6">
          {hasLight ? (
            <div
              className={cn("relative h-full w-full", hasBoth && "dark:hidden")}
            >
              <SanityImage
                alt={alt}
                className="h-full w-full object-contain"
                fill
                respectHotspot={false}
                sizes={sizes}
                source={{ image: light, alt }}
              />
            </div>
          ) : null}
          {hasDark ? (
            <div
              className={cn(
                "relative h-full w-full",
                hasBoth && "hidden dark:block"
              )}
            >
              <SanityImage
                alt={alt}
                className="h-full w-full object-contain"
                fill
                respectHotspot={false}
                sizes={sizes}
                source={{ image: dark, alt }}
              />
            </div>
          ) : null}
        </div>
      </AspectRatio>
      {description ? (
        <p className="text-sm leading-normal">{description}</p>
      ) : null}
    </div>
  );
}
