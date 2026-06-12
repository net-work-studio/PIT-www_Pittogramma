import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  getBlurDataUrl,
  getImageAssetUrl,
  isAnimatedImageAsset,
  urlForImage,
} from "@/sanity/lib/image";
import type { CoverMedia, ImageWithMetadata } from "@/sanity/types";

interface ImageLike {
  _type?: string;
  alt?: string | null;
  image?: {
    _type?: string;
    asset?:
      | {
          _id?: string;
          url?: string;
          metadata?: {
            lqip?: string;
            dimensions?: { width: number; height: number };
          };
        }
      | unknown;
    hotspot?: unknown;
    crop?: unknown;
  } | null;
}

type Props = {
  source: CoverMedia | ImageWithMetadata | ImageLike | null | undefined;
} & Partial<React.ComponentProps<typeof Image>>;

function getHotspotObjectPosition(
  source: CoverMedia | ImageWithMetadata | ImageLike | null | undefined
): string | undefined {
  const hotspot = source?.image?.hotspot;
  if (!(hotspot && typeof hotspot === "object")) {
    return;
  }

  const { x, y } = hotspot as { x?: unknown; y?: unknown };
  return typeof x === "number" && typeof y === "number"
    ? `${x * 100}% ${y * 100}%`
    : undefined;
}

export default function SanityImage({
  source,
  alt,
  width = 800,
  height = 600,
  fill,
  sizes,
  className,
  priority,
  quality = 75,
  style,
  ...props
}: Props) {
  const builder = urlForImage(source);
  if (!builder) {
    return null;
  }

  const imageAlt = source?.alt ?? alt ?? "";

  if (isAnimatedImageAsset(source)) {
    const assetUrl = getImageAssetUrl(source);
    if (!assetUrl) {
      return null;
    }

    const animatedStyle = {
      objectPosition: getHotspotObjectPosition(source),
      ...style,
    };

    return fill ? (
      <Image
        alt={imageAlt}
        className={cn("object-cover", className)}
        fill
        priority={priority}
        sizes={sizes ?? "100vw"}
        src={assetUrl}
        style={animatedStyle}
        unoptimized
        {...props}
      />
    ) : (
      <Image
        alt={imageAlt}
        className={cn("object-cover", className)}
        height={height}
        priority={priority}
        sizes={sizes}
        src={assetUrl}
        style={animatedStyle}
        unoptimized
        width={width}
        {...props}
      />
    );
  }

  const url = fill
    ? builder.width(1920).quality(Number(quality)).auto("format").url()
    : builder
        .width(Number(width))
        .quality(Number(quality))
        .auto("format")
        .url();

  if (!url) {
    return null;
  }

  const blurDataUrl = getBlurDataUrl(source);
  const blurProps = blurDataUrl
    ? { blurDataURL: blurDataUrl, placeholder: "blur" as const }
    : {};

  return fill ? (
    <Image
      alt={imageAlt}
      {...blurProps}
      className={cn("object-cover", className)}
      fill
      priority={priority}
      sizes={sizes ?? "100vw"}
      src={url}
      {...props}
    />
  ) : (
    <Image
      alt={imageAlt}
      {...blurProps}
      className={cn("object-cover", className)}
      height={height}
      priority={priority}
      sizes={sizes}
      src={url}
      width={width}
      {...props}
    />
  );
}
