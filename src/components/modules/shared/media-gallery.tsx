import SanityImage from "@/components/modules/shared/sanity-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getGalleryRatio } from "@/lib/gallery";
import { cn } from "@/lib/utils";

type MediaImageInput = {
  image?: unknown;
  alt?: string | null;
} | null | undefined;

type SingleBlockData = {
  _type: "singleMediaBlock";
  _key: string;
  orientation?: string | null;
  media: MediaImageInput;
};

type SideBySideBlockData = {
  _type: "sideBySideMediaBlock";
  _key: string;
  orientation?: string | null;
  left: MediaImageInput;
  right: MediaImageInput;
};

type ThreeSideBySideBlockData = {
  _type: "threeSideBySideMediaBlock";
  _key: string;
  orientation?: string | null;
  left: MediaImageInput;
  center: MediaImageInput;
  right: MediaImageInput;
};

type GridFourBlockData = {
  _type: "gridFourMediaBlock";
  _key: string;
  orientation?: string | null;
  topLeft: MediaImageInput;
  topRight: MediaImageInput;
  bottomLeft: MediaImageInput;
  bottomRight: MediaImageInput;
};

export type MediaGalleryBlock =
  | SingleBlockData
  | SideBySideBlockData
  | ThreeSideBySideBlockData
  | GridFourBlockData;

interface MediaGalleryProps {
  gallery: MediaGalleryBlock[] | null | undefined;
}

function MediaImage({
  media,
  className,
  priority,
  sizes = "100vw",
}: {
  media: MediaImageInput;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (!media?.image) {
    return null;
  }
  return (
    <SanityImage
      className={cn("rounded-xl", className)}
      fill
      priority={priority}
      sizes={sizes}
      source={{ image: media.image, alt: media.alt }}
    />
  );
}

function SingleBlock({
  block,
  priority,
}: {
  block: SingleBlockData;
  priority?: boolean;
}) {
  const ratio = getGalleryRatio(block.orientation);
  return (
    <AspectRatio className="relative overflow-hidden rounded-3xl" ratio={ratio}>
      <MediaImage
        className="rounded-3xl"
        media={block.media}
        priority={priority}
      />
    </AspectRatio>
  );
}

function SideBySideBlock({ block }: { block: SideBySideBlockData }) {
  const ratio = getGalleryRatio(block.orientation);
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row">
      <div className="flex-1">
        <AspectRatio
          className="relative overflow-hidden rounded-xl"
          ratio={ratio}
        >
          <MediaImage
            media={block.left}
            sizes="(min-width: 640px) 50vw, 100vw"
          />
        </AspectRatio>
      </div>
      <div className="flex-1">
        <AspectRatio
          className="relative overflow-hidden rounded-xl"
          ratio={ratio}
        >
          <MediaImage
            media={block.right}
            sizes="(min-width: 640px) 50vw, 100vw"
          />
        </AspectRatio>
      </div>
    </div>
  );
}

function ThreeSideBySideBlock({ block }: { block: ThreeSideBySideBlockData }) {
  const ratio = getGalleryRatio(block.orientation);
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row">
      <div className="flex-1">
        <AspectRatio
          className="relative overflow-hidden rounded-xl"
          ratio={ratio}
        >
          <MediaImage
            media={block.left}
            sizes="(min-width: 640px) 33vw, 100vw"
          />
        </AspectRatio>
      </div>
      <div className="flex-1">
        <AspectRatio
          className="relative overflow-hidden rounded-xl"
          ratio={ratio}
        >
          <MediaImage
            media={block.center}
            sizes="(min-width: 640px) 33vw, 100vw"
          />
        </AspectRatio>
      </div>
      <div className="flex-1">
        <AspectRatio
          className="relative overflow-hidden rounded-xl"
          ratio={ratio}
        >
          <MediaImage
            media={block.right}
            sizes="(min-width: 640px) 33vw, 100vw"
          />
        </AspectRatio>
      </div>
    </div>
  );
}

function GridFourBlock({ block }: { block: GridFourBlockData }) {
  const ratio = getGalleryRatio(block.orientation);
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <AspectRatio
        className="relative overflow-hidden rounded-xl"
        ratio={ratio}
      >
        <MediaImage media={block.topLeft} sizes="50vw" />
      </AspectRatio>
      <AspectRatio
        className="relative overflow-hidden rounded-xl"
        ratio={ratio}
      >
        <MediaImage media={block.topRight} sizes="50vw" />
      </AspectRatio>
      <AspectRatio
        className="relative overflow-hidden rounded-xl"
        ratio={ratio}
      >
        <MediaImage media={block.bottomLeft} sizes="50vw" />
      </AspectRatio>
      <AspectRatio
        className="relative overflow-hidden rounded-xl"
        ratio={ratio}
      >
        <MediaImage media={block.bottomRight} sizes="50vw" />
      </AspectRatio>
    </div>
  );
}

export default function MediaGallery({ gallery }: MediaGalleryProps) {
  if (!gallery?.length) {
    return null;
  }

  return (
    <div className="mt-2.5 flex flex-col gap-2.5">
      {gallery.map((block, index) => {
        if (block._type === "singleMediaBlock") {
          return (
            <SingleBlock
              block={block}
              key={block._key}
              priority={index === 0}
            />
          );
        }
        if (block._type === "sideBySideMediaBlock") {
          return <SideBySideBlock block={block} key={block._key} />;
        }
        if (block._type === "threeSideBySideMediaBlock") {
          return <ThreeSideBySideBlock block={block} key={block._key} />;
        }
        if (block._type === "gridFourMediaBlock") {
          return <GridFourBlock block={block} key={block._key} />;
        }
        return null;
      })}
    </div>
  );
}
