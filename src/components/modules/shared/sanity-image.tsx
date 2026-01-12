import Image from "next/image";
import { cn } from "@/lib/utils";
import { urlForImage } from "@/sanity/lib/image";
import type { ImageWithMetadata } from "@/sanity/types";

type ImageLike = {
  _type?: string;
  image?: {
    _type?: string;
    asset?: unknown;
    hotspot?: unknown;
    crop?: unknown;
  } | null;
  alt?: string | null;
};

type Props = {
  source: ImageWithMetadata | ImageLike | null | undefined;
  blurQuality?: number;
  blurWidth?: number;
  blurHeight?: number;
} & Partial<React.ComponentProps<typeof Image>>;

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
  blurQuality = 5,
  blurWidth = 24,
  blurHeight = 24,
  ...props
}: Props) {
  const builder = urlForImage(source);
  if (!builder) {
    return null;
  }

  // For fill: only width (preserves aspect ratio, CSS handles display)
  // For fixed: both dimensions
  const url = fill
    ? builder.width(1920).quality(Number(quality)).auto("format").url()
    : builder
        .width(Number(width))
        .height(Number(height))
        .quality(Number(quality))
        .auto("format")
        .url();

  if (!url) {
    return null;
  }

  let blurDataUrl: string | undefined;
  try {
    const blurBuilder = urlForImage(source);
    if (blurBuilder) {
      blurDataUrl = blurBuilder
        .width(Number(blurWidth))
        .height(Number(blurHeight))
        .quality(Number(blurQuality))
        .auto("format")
        .url();
    }
  } catch {
    blurDataUrl = undefined;
  }

  const imageAlt = source?.alt ?? alt ?? "";
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
