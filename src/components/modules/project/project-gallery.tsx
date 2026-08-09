"use client";

import { PlayIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import CoverMedia from "@/components/modules/shared/cover-media";
import MediaBlocks, {
  flattenMediaBlocks,
  type MediaBlockShape,
  type MediaItemShape,
} from "@/components/modules/shared/media-blocks";
import MediaSlotButton from "@/components/modules/shared/media-slot-button";
import SanityImage from "@/components/modules/shared/sanity-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getEmbedInfo } from "@/lib/video-embed";
import { getImageDimensions } from "@/sanity/lib/image";
import type { PROJECT_QUERY_RESULT } from "@/sanity/types";

interface ProjectGalleryProps {
  cover: NonNullable<PROJECT_QUERY_RESULT>["cover"];
  gallery: NonNullable<PROJECT_QUERY_RESULT>["gallery"];
}

function getCoverMedia(
  cover: ProjectGalleryProps["cover"]
): MediaItemShape | null {
  if (cover.type === "video" && cover.videoUrl) {
    return {
      alt: cover.alt,
      caption: cover.caption,
      image: cover.image,
      type: "videoUpload",
      videoFileUrl: cover.videoUrl,
    };
  }

  if (cover.image) {
    return {
      alt: cover.alt,
      caption: cover.caption,
      image: cover.image,
      type: "image",
    };
  }

  return null;
}

function ignorePlaybackError() {
  // Playback may be blocked until the visitor interacts with the page.
}

const DEFAULT_MEDIA_ASPECT_RATIO = 16 / 9;
const LIGHTBOX_HORIZONTAL_GUTTER = 32;
const LIGHTBOX_VERTICAL_GUTTER = 80;

function getMediaAspectRatio(media: MediaItemShape) {
  const dimensions = media.image
    ? getImageDimensions({ alt: media.alt, image: media.image })
    : undefined;

  if (!dimensions || dimensions.height === 0) {
    return DEFAULT_MEDIA_ASPECT_RATIO;
  }

  return dimensions.width / dimensions.height;
}

function getLightboxMediaSize(aspectRatio: number) {
  const viewportWidth =
    typeof window === "undefined" ? 1200 : window.innerWidth;
  const viewportHeight =
    typeof window === "undefined" ? 800 : window.innerHeight;
  const maxWidth = viewportWidth - LIGHTBOX_HORIZONTAL_GUTTER;
  const maxHeight = viewportHeight - LIGHTBOX_VERTICAL_GUTTER;
  const width = Math.min(maxWidth, maxHeight * aspectRatio);

  return { height: width / aspectRatio, width };
}

function useLightboxMediaSize(aspectRatio: number) {
  const [size, setSize] = useState(() => getLightboxMediaSize(aspectRatio));

  useEffect(() => {
    const updateSize = () => {
      const nextSize = getLightboxMediaSize(aspectRatio);
      setSize((currentSize) =>
        currentSize.width === nextSize.width &&
        currentSize.height === nextSize.height
          ? currentSize
          : nextSize
      );
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, [aspectRatio]);

  return size;
}

function UploadedVideo({
  active,
  media,
}: {
  active: boolean;
  media: MediaItemShape;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!active) {
      videoRef.current?.pause();
      setPlaying(false);
    }
  }, [active]);

  const handlePause = useCallback(() => setPlaying(false), []);
  const handlePlay = useCallback(() => setPlaying(true), []);
  const handlePlayButtonClick = useCallback(() => {
    videoRef.current?.play().catch(ignorePlaybackError);
  }, []);

  if (!media.videoFileUrl) {
    return null;
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* biome-ignore lint/a11y/useMediaCaption: Project videos do not provide timed caption tracks. */}
      <video
        className="h-full w-full object-contain"
        controls
        onPause={handlePause}
        onPlay={handlePlay}
        playsInline
        preload="metadata"
        ref={videoRef}
        src={media.videoFileUrl}
      />
      {playing ? null : (
        <Button
          aria-label={`Play ${media.alt ?? media.caption ?? "video"}`}
          className="absolute bg-background/90 hover:bg-background"
          onClick={handlePlayButtonClick}
          size="icon"
          type="button"
        >
          <PlayIcon />
        </Button>
      )}
    </div>
  );
}

function EmbeddedVideo({ media }: { media: MediaItemShape }) {
  const [playing, setPlaying] = useState(false);
  const embed = getEmbedInfo(media.videoUrl);
  const handlePlayButtonClick = useCallback(() => setPlaying(true), []);

  if (!embed) {
    return null;
  }

  const src = new URL(embed.src);
  src.searchParams.delete("background");
  src.searchParams.delete("loop");
  src.searchParams.set("autoplay", "1");
  src.searchParams.set("controls", "1");
  src.searchParams.set("muted", "0");

  return playing ? (
    <iframe
      allow="autoplay; encrypted-media; picture-in-picture"
      className="h-full w-full border-0"
      referrerPolicy="strict-origin-when-cross-origin"
      src={src.toString()}
      title={media.alt ?? media.caption ?? "Embedded video"}
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-black">
      <Button
        aria-label={`Play ${media.alt ?? media.caption ?? "video"}`}
        className="bg-background/90 hover:bg-background"
        onClick={handlePlayButtonClick}
        size="icon"
        type="button"
      >
        <PlayIcon />
      </Button>
    </div>
  );
}

function LightboxMedia({
  active,
  media,
}: {
  active: boolean;
  media: MediaItemShape;
}) {
  if (media.type === "videoUpload") {
    return <UploadedVideo active={active} media={media} />;
  }

  if (media.type === "videoEmbed") {
    return <EmbeddedVideo media={media} />;
  }

  if (media.image) {
    return (
      <SanityImage
        fill
        objectFit="contain"
        priority={active}
        respectHotspot={false}
        sizes="100vw"
        source={{ alt: media.alt, image: media.image }}
      />
    );
  }

  return null;
}

export default function ProjectGallery({
  cover,
  gallery,
}: ProjectGalleryProps) {
  const carouselApiRef = useRef<CarouselApi>(undefined);
  const [current, setCurrent] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const coverMedia = getCoverMedia(cover);
  const galleryMediaItems = flattenMediaBlocks(
    gallery as readonly MediaBlockShape[]
  );
  const mediaItems = coverMedia
    ? [coverMedia, ...galleryMediaItems]
    : galleryMediaItems;
  const selectedMedia = mediaItems[selectedIndex ?? 0] ?? mediaItems[0];
  const lightboxMediaSize = useLightboxMediaSize(
    getMediaAspectRatio(selectedMedia)
  );

  const handleCarouselSelect = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) {
      return;
    }

    const nextCurrent = carouselApi.selectedScrollSnap() + 1;
    setCurrent((previousCurrent) =>
      previousCurrent === nextCurrent ? previousCurrent : nextCurrent
    );
  }, []);

  const handleCarouselApi = useCallback(
    (carouselApi: CarouselApi) => {
      if (!carouselApi || carouselApiRef.current === carouselApi) {
        return;
      }

      carouselApiRef.current?.off("select", handleCarouselSelect);
      carouselApiRef.current = carouselApi;
      handleCarouselSelect(carouselApi);
      carouselApi.on("select", handleCarouselSelect);
    },
    [handleCarouselSelect]
  );

  useEffect(
    () => () => {
      carouselApiRef.current?.off("select", handleCarouselSelect);
    },
    [handleCarouselSelect]
  );

  const closeLightbox = useCallback(() => setSelectedIndex(null), []);
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setSelectedIndex(null);
    }
  }, []);

  if (!mediaItems.length) {
    return null;
  }

  const openLightbox = (media: MediaItemShape) => {
    const mediaIndex = mediaItems.indexOf(media);
    if (mediaIndex !== -1) {
      setCurrent(mediaIndex + 1);
      setSelectedIndex(mediaIndex);
    }
  };

  return (
    <>
      {coverMedia ? (
        <MediaSlotButton media={coverMedia} onMediaClick={openLightbox}>
          <AspectRatio
            className="relative overflow-hidden rounded-xl"
            ratio={4 / 3}
          >
            <CoverMedia className="rounded-xl" cover={cover} fill priority />
          </AspectRatio>
        </MediaSlotButton>
      ) : null}
      <MediaBlocks
        blocks={gallery as readonly MediaBlockShape[]}
        className="mt-2.5"
        onMediaClick={openLightbox}
        rounded="xl"
        showCaptions={false}
      />
      <Dialog onOpenChange={handleOpenChange} open={selectedIndex !== null}>
        <DialogContent
          className="w-auto max-w-[calc(100vw-2rem)] gap-0 border-0 bg-transparent p-0 shadow-none sm:max-w-none"
          portalControls={
            <>
              {mediaItems[current - 1]?.caption ? (
                <p className="fixed right-24 bottom-4 left-4 truncate font-mono text-background text-xs uppercase">
                  {mediaItems[current - 1].caption}
                </p>
              ) : null}
              <span className="fixed right-4 bottom-4 font-mono text-background text-xs uppercase">
                {current} / {mediaItems.length}
              </span>
              <Button
                aria-label="Close project gallery"
                className="pointer-events-auto fixed top-4 right-4"
                onClick={closeLightbox}
                size="icon"
                type="button"
                variant="lightbox"
              >
                <XIcon />
              </Button>
            </>
          }
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Project gallery</DialogTitle>
          {selectedIndex === null ? null : (
            <div>
              <Carousel
                aria-label="Project gallery"
                className="[&>[data-slot=carousel-content]]:h-full"
                key={selectedIndex}
                opts={{ startIndex: selectedIndex }}
                setApi={handleCarouselApi}
                style={lightboxMediaSize}
              >
                <CarouselContent className="-ml-0 h-full">
                  {mediaItems.map((media, index) => (
                    <CarouselItem
                      className="h-full pl-0"
                      key={
                        media.videoFileUrl ??
                        media.videoUrl ??
                        JSON.stringify(media.image?.asset) ??
                        media.alt ??
                        media.caption ??
                        media.type ??
                        "media"
                      }
                    >
                      <div className="relative h-full w-full">
                        <LightboxMedia
                          active={current === index + 1}
                          media={media}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="!size-6 left-2 z-10" size="icon" />
                <CarouselNext className="!size-6 right-2 z-10" size="icon" />
              </Carousel>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
