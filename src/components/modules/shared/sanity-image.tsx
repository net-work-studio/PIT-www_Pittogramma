import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  getBlurDataUrl,
  getHotspotObjectPosition,
  type ImageLike,
  urlForImage,
} from "@/sanity/lib/image";
import type { CoverMedia, ImageWithMetadata } from "@/sanity/types";

type SanityImageFit = "intrinsic" | "crop";

function buildSizedImageUrl(
  sizedBuilder: ReturnType<
    NonNullable<ReturnType<typeof urlForImage>>["quality"]
  >,
  {
    fill,
    sizeMode,
    height,
    width,
  }: {
    fill: boolean | undefined;
    sizeMode: SanityImageFit;
    height: number;
    width: number;
  }
): string {
  if (fill) {
    return sizedBuilder.width(1920).url();
  }
  switch (sizeMode) {
    case "crop":
      return (
        sizedBuilder
          .width(width)
          .height(height)
          // biome-ignore lint/suspicious/noFocusedTests: Sanity CDN fit mode, not Jest
          .fit("crop")
          .url()
      );
    case "intrinsic":
      return sizedBuilder.width(width).url();
    default: {
      const _exhaustive: never = sizeMode;
      return _exhaustive;
    }
  }
}

function shouldUseCssHotspot(
  respectHotspot: boolean | undefined,
  fill: boolean | undefined,
  sizeMode: SanityImageFit
): boolean {
  if (respectHotspot === false) {
    return false;
  }
  switch (sizeMode) {
    case "crop":
      return false;
    case "intrinsic":
      return Boolean(fill) || respectHotspot === true;
    default: {
      const _exhaustive: never = sizeMode;
      return _exhaustive;
    }
  }
}

/**
 * Hotspot handling depends on layout:
 * - `fill` (default): CSS object-position from Sanity hotspot via `respectHotspot` (defaults on).
 * - Fixed width/height with `fit="crop"`: Sanity CDN crops using hotspot/crop metadata in the URL.
 * Set `respectHotspot={false}` for logos and other object-contain layouts.
 */
type Props = {
  fit?: SanityImageFit;
  preserveAnimation?: boolean;
  respectHotspot?: boolean;
  source: CoverMedia | ImageWithMetadata | ImageLike | null | undefined;
} & Partial<React.ComponentProps<typeof Image>>;

export default function SanityImage({
  source,
  alt,
  width = 800,
  height = 600,
  fill,
  fit = "intrinsic",
  sizes,
  className,
  priority,
  quality = 75,
  preserveAnimation = false,
  respectHotspot,
  objectFit = "cover",
  objectPosition: objectPositionProp,
  style,
  unoptimized: unoptimizedProp,
  ...props
}: Props) {
  const builder = urlForImage(source);
  if (!builder) {
    return null;
  }

  const sizedBuilder = builder.quality(Number(quality)).auto("format");
  const url = buildSizedImageUrl(sizedBuilder, {
    fill,
    height: Number(height),
    sizeMode: fit,
    width: Number(width),
  });

  const blurDataUrl = getBlurDataUrl(source);
  const imageAlt = source?.alt ?? alt ?? "";
  const objectPosition =
    objectPositionProp ??
    (shouldUseCssHotspot(respectHotspot, fill, fit)
      ? getHotspotObjectPosition(source)
      : undefined);
  const blurProps = blurDataUrl
    ? { blurDataURL: blurDataUrl, placeholder: "blur" as const }
    : {};

  const imageProps = {
    alt: imageAlt,
    ...blurProps,
    className: cn(
      objectFit === "contain" ? "object-contain" : "object-cover",
      className
    ),
    ...(objectPosition ? { objectPosition } : {}),
    priority,
    sizes: fill ? (sizes ?? "100vw") : sizes,
    src: url,
    style,
    unoptimized: preserveAnimation || unoptimizedProp,
    ...props,
  };

  return fill ? (
    <Image {...imageProps} fill />
  ) : (
    <Image {...imageProps} height={height} width={width} />
  );
}
