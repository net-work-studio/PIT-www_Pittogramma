import SanityImage from "@/components/modules/shared/sanity-image";
import VideoPlayer from "@/components/modules/shared/video-player";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getGalleryRatio } from "@/lib/gallery";
import { cn } from "@/lib/utils";
import { getEmbedInfo } from "@/lib/video-embed";

export interface MediaItemShape {
  alt?: string | null;
  caption?: string | null;
  image?: { asset?: unknown; hotspot?: unknown; crop?: unknown } | null;
  type?: "image" | "videoUpload" | "videoEmbed" | string | null;
  videoFileUrl?: string | null;
  videoUrl?: string | null;
}

export interface MediaBlockShape {
  _key?: string | null;
  _type?: string | null;
  bottomLeft?: MediaItemShape | null;
  bottomRight?: MediaItemShape | null;
  center?: MediaItemShape | null;
  left?: MediaItemShape | null;
  media?: MediaItemShape | null;
  orientation?: string | null;
  right?: MediaItemShape | null;
  topLeft?: MediaItemShape | null;
  topRight?: MediaItemShape | null;
}

const ROUNDED_CLASS = {
  lg: "rounded-lg",
  xl: "rounded-xl",
  "3xl": "rounded-3xl",
} as const;

type RoundedKey = keyof typeof ROUNDED_CLASS;

export interface RoundedConfig {
  multi: RoundedKey;
  single: RoundedKey;
}

const DEFAULT_ROUNDED: RoundedConfig = { single: "xl", multi: "xl" };

interface MediaBlocksProps {
  blocks: readonly MediaBlockShape[] | null | undefined;
  className?: string;
  priorityFirst?: boolean;
  rounded?: RoundedKey | RoundedConfig;
  showCaptions?: boolean;
}

function resolveRounded(
  rounded: RoundedKey | RoundedConfig | undefined
): RoundedConfig {
  if (!rounded) {
    return DEFAULT_ROUNDED;
  }
  if (typeof rounded === "string") {
    return { single: rounded, multi: rounded };
  }
  return rounded;
}

function MediaContent({
  media,
  rounded,
  priority,
  sizes = "100vw",
}: {
  media: MediaItemShape | null | undefined;
  rounded: RoundedKey;
  priority?: boolean;
  sizes?: string;
}) {
  if (!media) {
    return null;
  }

  const radius = ROUNDED_CLASS[rounded];

  if (media.type === "videoUpload" && media.videoFileUrl) {
    return <VideoPlayer className={radius} src={media.videoFileUrl} />;
  }

  if (media.type === "videoEmbed") {
    const embed = getEmbedInfo(media.videoUrl);
    if (!embed) {
      return null;
    }
    return (
      <iframe
        allow="autoplay; encrypted-media; picture-in-picture"
        className={cn("h-full w-full border-0", radius)}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        src={embed.src}
        title={media.alt ?? media.caption ?? "Embedded video"}
      />
    );
  }

  if (media.image) {
    return (
      <SanityImage
        className={radius}
        fill
        priority={priority}
        sizes={sizes}
        source={{ image: media.image, alt: media.alt }}
      />
    );
  }

  return null;
}

function Caption({ text }: { text: string }) {
  return (
    <p className="mt-1.5 font-mono text-muted-foreground text-xs uppercase">
      {text}
    </p>
  );
}

function MediaSlot({
  media,
  ratio,
  rounded,
  sizes,
  priority,
  showCaptions,
  className,
}: {
  media: MediaItemShape | null | undefined;
  ratio: number;
  rounded: RoundedKey;
  sizes: string;
  priority?: boolean;
  showCaptions: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <AspectRatio
        className={cn("relative overflow-hidden", ROUNDED_CLASS[rounded])}
        ratio={ratio}
      >
        <MediaContent
          media={media}
          priority={priority}
          rounded={rounded}
          sizes={sizes}
        />
      </AspectRatio>
      {showCaptions && media?.caption ? <Caption text={media.caption} /> : null}
    </div>
  );
}

function SingleBlock({
  block,
  showCaptions,
  rounded,
  priority,
}: {
  block: MediaBlockShape;
  showCaptions: boolean;
  rounded: RoundedKey;
  priority?: boolean;
}) {
  const ratio = getGalleryRatio(block.orientation);
  return (
    <MediaSlot
      media={block.media}
      priority={priority}
      ratio={ratio}
      rounded={rounded}
      showCaptions={showCaptions}
      sizes="100vw"
    />
  );
}

function SideBySideBlock({
  block,
  showCaptions,
  rounded,
}: {
  block: MediaBlockShape;
  showCaptions: boolean;
  rounded: RoundedKey;
}) {
  const ratio = getGalleryRatio(block.orientation);
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row">
      <MediaSlot
        className="flex-1"
        media={block.left}
        ratio={ratio}
        rounded={rounded}
        showCaptions={showCaptions}
        sizes="(min-width: 640px) 50vw, 100vw"
      />
      <MediaSlot
        className="flex-1"
        media={block.right}
        ratio={ratio}
        rounded={rounded}
        showCaptions={showCaptions}
        sizes="(min-width: 640px) 50vw, 100vw"
      />
    </div>
  );
}

function ThreeSideBySideBlock({
  block,
  showCaptions,
  rounded,
}: {
  block: MediaBlockShape;
  showCaptions: boolean;
  rounded: RoundedKey;
}) {
  const ratio = getGalleryRatio(block.orientation);
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row">
      <MediaSlot
        className="flex-1"
        media={block.left}
        ratio={ratio}
        rounded={rounded}
        showCaptions={showCaptions}
        sizes="(min-width: 640px) 33vw, 100vw"
      />
      <MediaSlot
        className="flex-1"
        media={block.center}
        ratio={ratio}
        rounded={rounded}
        showCaptions={showCaptions}
        sizes="(min-width: 640px) 33vw, 100vw"
      />
      <MediaSlot
        className="flex-1"
        media={block.right}
        ratio={ratio}
        rounded={rounded}
        showCaptions={showCaptions}
        sizes="(min-width: 640px) 33vw, 100vw"
      />
    </div>
  );
}

function GridFourBlock({
  block,
  showCaptions,
  rounded,
}: {
  block: MediaBlockShape;
  showCaptions: boolean;
  rounded: RoundedKey;
}) {
  const ratio = getGalleryRatio(block.orientation);
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <MediaSlot
        media={block.topLeft}
        ratio={ratio}
        rounded={rounded}
        showCaptions={showCaptions}
        sizes="50vw"
      />
      <MediaSlot
        media={block.topRight}
        ratio={ratio}
        rounded={rounded}
        showCaptions={showCaptions}
        sizes="50vw"
      />
      <MediaSlot
        media={block.bottomLeft}
        ratio={ratio}
        rounded={rounded}
        showCaptions={showCaptions}
        sizes="50vw"
      />
      <MediaSlot
        media={block.bottomRight}
        ratio={ratio}
        rounded={rounded}
        showCaptions={showCaptions}
        sizes="50vw"
      />
    </div>
  );
}

export function MediaBlock({
  block,
  showCaptions = false,
  rounded,
  priority = false,
}: {
  block: MediaBlockShape;
  showCaptions?: boolean;
  rounded?: RoundedKey | RoundedConfig;
  priority?: boolean;
}) {
  const radii = resolveRounded(rounded);
  switch (block._type) {
    case "singleMediaBlock":
      return (
        <SingleBlock
          block={block}
          priority={priority}
          rounded={radii.single}
          showCaptions={showCaptions}
        />
      );
    case "sideBySideMediaBlock":
      return (
        <SideBySideBlock
          block={block}
          rounded={radii.multi}
          showCaptions={showCaptions}
        />
      );
    case "threeSideBySideMediaBlock":
      return (
        <ThreeSideBySideBlock
          block={block}
          rounded={radii.multi}
          showCaptions={showCaptions}
        />
      );
    case "gridFourMediaBlock":
      return (
        <GridFourBlock
          block={block}
          rounded={radii.multi}
          showCaptions={showCaptions}
        />
      );
    default:
      return null;
  }
}

export default function MediaBlocks({
  blocks,
  showCaptions = false,
  rounded,
  priorityFirst = false,
  className,
}: MediaBlocksProps) {
  if (!blocks?.length) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {blocks.map((block, index) => (
        <MediaBlock
          block={block}
          key={block._key ?? index}
          priority={priorityFirst && index === 0}
          rounded={rounded}
          showCaptions={showCaptions}
        />
      ))}
    </div>
  );
}
