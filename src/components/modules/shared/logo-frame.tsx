import SanityImage from "@/components/modules/shared/sanity-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface SanityImageField {
  asset?: { _id?: string; url?: string; metadata?: unknown } | null;
  crop?: unknown;
  hotspot?: unknown;
}

export interface LogoFields {
  alt: string | null;
  logoDark: SanityImageField | null;
  logoLight: SanityImageField | null;
}

interface LogoFrameProps {
  className?: string;
  logo: LogoFields | null;
  name?: string | null;
  sizes?: string;
}

export default function LogoFrame({
  className,
  logo,
  name,
  sizes = "(min-width: 1280px) 20vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw",
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
    <AspectRatio
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900",
        className
      )}
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
              sizes={sizes}
              source={{ image: dark, alt }}
            />
          </div>
        ) : null}
      </div>
    </AspectRatio>
  );
}
