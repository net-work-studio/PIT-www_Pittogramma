import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  getBlurDataUrl,
  getHotspotObjectPosition,
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

  const sizedBuilder = builder.quality(Number(quality)).auto("format");
  const url = fill
    ? sizedBuilder.width(1920).url()
    : sizedBuilder
        .width(Number(width))
        .height(Number(height))
        .fit("crop")
        .url();

  if (!url) {
    return null;
  }

  const blurDataUrl = getBlurDataUrl(source);
  const imageAlt = source?.alt ?? alt ?? "";
  const objectPosition = getHotspotObjectPosition(source);
  const imageStyle = objectPosition
    ? { objectPosition, ...style }
    : style;
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
      style={imageStyle}
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
      style={imageStyle}
      width={width}
      {...props}
    />
  );
}
