import Image from "next/image";
import { cn } from "@/lib/utils";
import { getBlurDataUrl, urlForImage } from "@/sanity/lib/image";
import type { ImageWithMetadata } from "@/sanity/types";

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
  source: ImageWithMetadata | ImageLike | null | undefined;
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
  ...props
}: Props) {
  const builder = urlForImage(source);
  if (!builder) {
    return null;
  }

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

  const blurDataUrl = getBlurDataUrl(source);
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
