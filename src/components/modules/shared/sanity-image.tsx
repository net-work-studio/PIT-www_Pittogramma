import Image from "next/image";
import {
  getSafeImageWidth,
  shouldBypassImageOptimization,
} from "@/lib/image-width";
import { cn } from "@/lib/utils";
import {
  getBlurDataUrl,
  getHotspotObjectPosition,
  getImageDimensions,
  type ImageLike,
  urlForImage,
  urlForOriginalImage,
} from "@/sanity/lib/image";
import type { CoverMedia, ImageWithMetadata } from "@/sanity/types";

type SanityImageFit = "intrinsic" | "crop";

function buildSizedImageUrl(
  sizedBuilder: ReturnType<
    NonNullable<ReturnType<typeof urlForImage>>["quality"]
  >,
  {
    fill,
    fillWidth,
    sizeMode,
    height,
    width,
  }: {
    fill: boolean | undefined;
    fillWidth: number | undefined;
    sizeMode: SanityImageFit;
    height: number;
    width: number;
  }
): string {
  if (fill) {
    return sizedBuilder.width(fillWidth ?? 1920).url();
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
  fillWidth?: number;
  fit?: SanityImageFit;
  ignoreCrop?: boolean;
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
  fillWidth,
  fit = "intrinsic",
  ignoreCrop = false,
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
  const builder = ignoreCrop
    ? urlForOriginalImage(source)
    : urlForImage(source);
  if (!builder) {
    return null;
  }

  const requestedWidth = fill ? (fillWidth ?? 1920) : Number(width);
  const sourceWidth = getImageDimensions(source)?.width;
  const safeWidth = getSafeImageWidth(requestedWidth, sourceWidth);
  const sizedBuilder = builder.quality(Number(quality));
  const url = buildSizedImageUrl(sizedBuilder, {
    fill,
    fillWidth: fill ? safeWidth : fillWidth,
    height: Number(height),
    sizeMode: fit,
    width: safeWidth,
  });

  const blurDataUrl = getBlurDataUrl(source, ignoreCrop);
  const imageAlt = source?.alt ?? alt ?? "";
  const objectPosition =
    objectPositionProp ??
    (shouldUseCssHotspot(respectHotspot, fill, fit)
      ? getHotspotObjectPosition(source)
      : undefined);
  const blurProps = blurDataUrl
    ? { blurDataURL: blurDataUrl, placeholder: "blur" as const }
    : {};
  const imageStyle: React.CSSProperties = {
    objectFit: objectFit as React.CSSProperties["objectFit"],
    ...style,
  };

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
    style: imageStyle,
    unoptimized:
      preserveAnimation ||
      unoptimizedProp ||
      shouldBypassImageOptimization(requestedWidth, sourceWidth),
    ...props,
  };

  return fill ? (
    <Image {...imageProps} fill />
  ) : (
    <Image {...imageProps} height={height} width={width} />
  );
}
