import {
  PortableText,
  type PortableTextComponents,
  stegaClean,
} from "next-sanity";

import SanityImage from "@/components/modules/shared/sanity-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getGalleryRatio } from "@/lib/gallery";
import type { INTERVIEW_QUERY_RESULT } from "@/sanity/types";

// MediaItem type for the gallery blocks
interface MediaItemValue {
  alt?: string | null;
  caption?: string | null;
  image?: {
    asset?: unknown;
    hotspot?: unknown;
    crop?: unknown;
  };
  type?: "image" | "videoUpload" | "videoEmbed";
  video?: {
    asset?: {
      url?: string;
    };
  };
  videoUrl?: string;
}

// MediaRenderer component to handle image, video upload, and video embed
function MediaRenderer({
  media,
  ratio = 4 / 3,
}: {
  media?: MediaItemValue;
  ratio?: number;
}) {
  if (!media) {
    return null;
  }

  const { type: rawType, image, video, videoUrl, caption, alt } = media;
  const type = stegaClean(rawType);

  function renderMedia() {
    if (type === "image" && image) {
      return (
        <AspectRatio className="relative w-full" ratio={ratio}>
          <SanityImage
            className="rounded-lg object-cover"
            fill
            source={{ image, alt }}
          />
        </AspectRatio>
      );
    }
    if (type === "videoUpload" && video?.asset?.url) {
      return (
        <AspectRatio className="relative w-full" ratio={16 / 9}>
          {/* biome-ignore lint/a11y/useMediaCaption: captions not available for uploaded videos */}
          <video
            className="absolute inset-0 h-full w-full rounded-lg object-cover"
            controls
            src={video.asset.url}
          />
        </AspectRatio>
      );
    }
    if (type === "videoEmbed" && videoUrl) {
      return (
        <AspectRatio className="relative w-full" ratio={16 / 9}>
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full rounded-lg"
            src={getEmbedUrl(videoUrl)}
            title="Video embed"
          />
        </AspectRatio>
      );
    }
    return null;
  }

  return (
    <figure>
      {renderMedia()}
      {caption ? (
        <figcaption className="mt-1.5 font-mono text-[0.5rem] text-muted-foreground uppercase">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

// Regex patterns for video URL parsing (top-level for performance)
const YOUTUBE_REGEX =
  /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
const VIMEO_REGEX = /vimeo\.com\/(\d+)/;

// Helper function to convert video URLs to embed URLs
function getEmbedUrl(url: string): string {
  const youtubeMatch = url.match(YOUTUBE_REGEX);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  const vimeoMatch = url.match(VIMEO_REGEX);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return url;
}

// Block type interfaces
interface SingleMediaBlockProps {
  value: {
    _key: string;
    _type: "singleMediaBlock";
    orientation?: string;
    media?: MediaItemValue;
  };
}

interface SideBySideMediaBlockProps {
  value: {
    _key: string;
    _type: "sideBySideMediaBlock";
    orientation?: string;
    left?: MediaItemValue;
    right?: MediaItemValue;
  };
}

interface ThreeSideBySideMediaBlockProps {
  value: {
    _key: string;
    _type: "threeSideBySideMediaBlock";
    orientation?: string;
    left?: MediaItemValue;
    center?: MediaItemValue;
    right?: MediaItemValue;
  };
}

interface GridFourMediaBlockProps {
  value: {
    _key: string;
    _type: "gridFourMediaBlock";
    orientation?: string;
    topLeft?: MediaItemValue;
    topRight?: MediaItemValue;
    bottomLeft?: MediaItemValue;
    bottomRight?: MediaItemValue;
  };
}

function SingleMediaBlock({ value }: SingleMediaBlockProps) {
  if (!value.media) {
    return null;
  }

  const ratio = getGalleryRatio(value.orientation);
  return (
    <div className="my-10 lg:mx-auto lg:max-w-[65%]">
      <MediaRenderer media={value.media} ratio={ratio} />
    </div>
  );
}

function SideBySideMediaBlock({ value }: SideBySideMediaBlockProps) {
  const ratio = getGalleryRatio(value.orientation);
  return (
    <div className="my-10 grid grid-cols-1 gap-2.5 px-2.5 lg:grid-cols-2">
      <MediaRenderer media={value.left} ratio={ratio} />
      <MediaRenderer media={value.right} ratio={ratio} />
    </div>
  );
}

function ThreeSideBySideMediaBlock({ value }: ThreeSideBySideMediaBlockProps) {
  const ratio = getGalleryRatio(value.orientation);
  return (
    <div className="my-10 grid grid-cols-1 gap-2.5 px-2.5 lg:grid-cols-3">
      <MediaRenderer media={value.left} ratio={ratio} />
      <MediaRenderer media={value.center} ratio={ratio} />
      <MediaRenderer media={value.right} ratio={ratio} />
    </div>
  );
}

function GridFourMediaBlock({ value }: GridFourMediaBlockProps) {
  const ratio = getGalleryRatio(value.orientation);
  return (
    <div className="my-10 grid grid-cols-1 gap-2.5 lg:mx-auto lg:max-w-[65%] lg:grid-cols-2">
      <MediaRenderer media={value.topLeft} ratio={ratio} />
      <MediaRenderer media={value.topRight} ratio={ratio} />
      <MediaRenderer media={value.bottomLeft} ratio={ratio} />
      <MediaRenderer media={value.bottomRight} ratio={ratio} />
    </div>
  );
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mx-auto mb-2 max-w-[700px] text-muted-foreground text-xl lg:text-2xl">
        {children}
      </p>
    ),
    answer: ({ children }) => (
      <p className="mx-auto mb-6 max-w-[700px] font-serif text-xl lg:text-2xl">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mx-auto my-8 max-w-[700px] text-2xl leading-tight lg:text-[2.5rem]">
        {children}
      </blockquote>
    ),
  },
  types: {
    singleMediaBlock: SingleMediaBlock,
    sideBySideMediaBlock: SideBySideMediaBlock,
    threeSideBySideMediaBlock: ThreeSideBySideMediaBlock,
    gridFourMediaBlock: GridFourMediaBlock,
  },
};

type InterviewContent = NonNullable<
  NonNullable<INTERVIEW_QUERY_RESULT>["interview"]
>;

interface InterviewContentProps {
  content?: InterviewContent | null;
}

export default function InterviewContent({ content }: InterviewContentProps) {
  if (!content) {
    return null;
  }

  return (
    <div>
      <PortableText components={components} value={content} />
    </div>
  );
}
