import SanityImage from "@/components/modules/shared/sanity-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface SanityImageField {
  asset?: { _id?: string; url?: string; metadata?: unknown } | null;
  crop?: unknown;
  hotspot?: unknown;
}

export interface ContributorWithLogo {
  _id: string;
  description: string | null;
  logo: {
    logoLight: SanityImageField | null;
    logoDark: SanityImageField | null;
    alt: string | null;
  } | null;
  name: string | null;
}

interface ContributorCardProps {
  contributor: ContributorWithLogo;
}

export default function ContributorCard({ contributor }: ContributorCardProps) {
  const alt = contributor.logo?.alt ?? contributor.name ?? "";
  const light = contributor.logo?.logoLight;
  const dark = contributor.logo?.logoDark;
  const hasLight = Boolean(light?.asset);
  const hasDark = Boolean(dark?.asset);
  const hasBoth = hasLight && hasDark;

  return (
    <div className="flex w-48 flex-col gap-3 sm:w-56">
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
                sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
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
                sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                source={{ image: dark, alt }}
              />
            </div>
          ) : null}
        </div>
      </AspectRatio>
      {contributor.description ? (
        <p className="text-sm leading-normal">{contributor.description}</p>
      ) : null}
    </div>
  );
}
