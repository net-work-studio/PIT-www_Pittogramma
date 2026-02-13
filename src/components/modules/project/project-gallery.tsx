import SanityImage from "@/components/modules/shared/sanity-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getGalleryRatio } from "@/lib/gallery";
import { cn } from "@/lib/utils";
import type { PROJECT_QUERY_RESULT } from "@/sanity/types";

type GalleryBlock = NonNullable<
  NonNullable<PROJECT_QUERY_RESULT>["gallery"]
>[number];

interface ProjectGalleryProps {
  gallery: NonNullable<PROJECT_QUERY_RESULT>["gallery"];
}

function MediaImage({
  media,
  className,
  priority,
}: {
  media: { image?: unknown; alt?: string | null } | null | undefined;
  className?: string;
  priority?: boolean;
}) {
  if (!media?.image) {
    return null;
  }
  return (
    <SanityImage
      className={cn("rounded-xl", className)}
      fill
      priority={priority}
      source={{ image: media.image, alt: media.alt }}
    />
  );
}

function SingleBlock({
  block,
  priority,
}: {
  block: Extract<GalleryBlock, { _type: "singleMediaBlock" }>;
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

function SideBySideBlock({
  block,
}: {
  block: Extract<GalleryBlock, { _type: "sideBySideMediaBlock" }>;
}) {
  const ratio = getGalleryRatio(block.orientation);
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row">
      <div className="flex-1">
        <AspectRatio
          className="relative overflow-hidden rounded-xl"
          ratio={ratio}
        >
          <MediaImage media={block.left} />
        </AspectRatio>
      </div>
      <div className="flex-1">
        <AspectRatio
          className="relative overflow-hidden rounded-xl"
          ratio={ratio}
        >
          <MediaImage media={block.right} />
        </AspectRatio>
      </div>
    </div>
  );
}

function ThreeSideBySideBlock({
  block,
}: {
  block: Extract<GalleryBlock, { _type: "threeSideBySideMediaBlock" }>;
}) {
  const ratio = getGalleryRatio(block.orientation);
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row">
      <div className="flex-1">
        <AspectRatio
          className="relative overflow-hidden rounded-xl"
          ratio={ratio}
        >
          <MediaImage media={block.left} />
        </AspectRatio>
      </div>
      <div className="flex-1">
        <AspectRatio
          className="relative overflow-hidden rounded-xl"
          ratio={ratio}
        >
          <MediaImage media={block.center} />
        </AspectRatio>
      </div>
      <div className="flex-1">
        <AspectRatio
          className="relative overflow-hidden rounded-xl"
          ratio={ratio}
        >
          <MediaImage media={block.right} />
        </AspectRatio>
      </div>
    </div>
  );
}

function GridFourBlock({
  block,
}: {
  block: Extract<GalleryBlock, { _type: "gridFourMediaBlock" }>;
}) {
  const ratio = getGalleryRatio(block.orientation);
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <AspectRatio
        className="relative overflow-hidden rounded-xl"
        ratio={ratio}
      >
        <MediaImage media={block.topLeft} />
      </AspectRatio>
      <AspectRatio
        className="relative overflow-hidden rounded-xl"
        ratio={ratio}
      >
        <MediaImage media={block.topRight} />
      </AspectRatio>
      <AspectRatio
        className="relative overflow-hidden rounded-xl"
        ratio={ratio}
      >
        <MediaImage media={block.bottomLeft} />
      </AspectRatio>
      <AspectRatio
        className="relative overflow-hidden rounded-xl"
        ratio={ratio}
      >
        <MediaImage media={block.bottomRight} />
      </AspectRatio>
    </div>
  );
}

export default function ProjectGallery({ gallery }: ProjectGalleryProps) {
  if (!gallery?.length) {
    return null;
  }

  return (
    <div className="mt-2.5 flex flex-col gap-2.5">
      {gallery.map((block: GalleryBlock, index: number) => {
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
