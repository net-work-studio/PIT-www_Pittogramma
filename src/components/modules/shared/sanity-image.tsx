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

/**
 * Hotspot handling depends on layout:
 * - `fill` (default): CSS object-position from Sanity hotspot via `respectHotspot` (defaults on).
 * - Fixed width/height with `fit="crop"`: Sanity CDN crops using hotspot/crop metadata in the URL.
 * Set `respectHotspot={false}` for logos and other object-contain layouts.
 */
type Props = {
  fit?: SanityImageFit;
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
  let url: string | undefined;
  if (fill) {
    url = sizedBuilder.width(1920).url();
  } else if (fit === "crop") {
    url = sizedBuilder
      .width(Number(width))
      .height(Number(height))
      .fit("crop")
      .url();
  } else {
    url = sizedBuilder.width(Number(width)).url();
  }

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

  const imageProps = {
    alt: imageAlt,
    ...blurProps,
    className: cn("object-cover", className),
    priority,
    sizes: fill ? (sizes ?? "100vw") : sizes,
    src: url,
    style: imageStyle,
    ...props,
  };

  return fill ? (
    <Image {...imageProps} fill />
  ) : (
    <Image {...imageProps} height={height} width={width} />
  );
}
