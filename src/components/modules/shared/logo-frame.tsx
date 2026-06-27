import SanityImage from "@/components/modules/shared/sanity-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import type { ABOUT_PAGE_QUERY_RESULT } from "@/sanity/types";

export type LogoFields = NonNullable<
  NonNullable<ABOUT_PAGE_QUERY_RESULT>["supporters"]
>[number]["logo"];

type LogoImageSource = NonNullable<LogoFields["logoLight"]>;

interface LogoFrameProps {
  className?: string;
  description?: string | null;
  layout?: "card" | "grid";
  logo: LogoFields | null;
  name?: string | null;
  sizes?: string;
  title?: string;
}

function LogoImage({
  alt,
  image,
  sizes,
  visibilityClass,
}: {
  alt: string;
  image: LogoImageSource;
  sizes: string;
  visibilityClass?: string;
}) {
  return (
    <div className={cn("relative h-full w-full", visibilityClass)}>
      <SanityImage
        alt={alt}
        className="h-full w-full"
        fill
        objectFit="contain"
        respectHotspot={false}
        sizes={sizes}
        source={{ image, alt }}
      />
    </div>
  );
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
      title={title ?? name ?? undefined}
    >
      <AspectRatio
        className="relative w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900"
        ratio={4 / 3}
      >
        <div className="flex h-full w-full items-center justify-center p-6">
          {light ? (
            <LogoImage
              alt={alt}
              image={light}
              sizes={sizes}
              visibilityClass={hasBoth ? "dark:hidden" : undefined}
            />
          ) : null}
          {dark ? (
            <LogoImage
              alt={alt}
              image={dark}
              sizes={sizes}
              visibilityClass={hasBoth ? "hidden dark:block" : undefined}
            />
          ) : null}
        </div>
      </AspectRatio>
      {description ? (
        <p className="text-sm leading-normal">{description}</p>
      ) : null}
    </div>
  );
}
