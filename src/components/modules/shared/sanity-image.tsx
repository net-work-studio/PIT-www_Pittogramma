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

type Props = {
  /** Non-fill URL strategy. `crop` requests exact width×height from Sanity CDN. */
  fit?: SanityImageFit;
  /** Apply Sanity hotspot as CSS object-position (fill + object-cover layouts). */
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
  respectHotspot,
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
    : fit === "crop"
      ? sizedBuilder
          .width(Number(width))
          .height(Number(height))
          .fit("crop")
          .url()
      : sizedBuilder.width(Number(width)).url();

  if (!url) {
    return null;
  }

  const blurDataUrl = getBlurDataUrl(source);
  const imageAlt = source?.alt ?? alt ?? "";
  const useHotspot = respectHotspot ?? Boolean(fill);
  const objectPosition = useHotspot
    ? getHotspotObjectPosition(source)
    : undefined;
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
