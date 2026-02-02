import { PortableText, type PortableTextComponents, type PortableTextBlock } from "next-sanity";

import SanityImage from "@/components/modules/shared/sanity-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// MediaItem type for the gallery blocks
interface MediaItemValue {
  type?: "image" | "videoUpload" | "videoEmbed";
  image?: {
    asset?: unknown;
    hotspot?: unknown;
    crop?: unknown;
  };
  video?: {
    asset?: {
      url?: string;
    };
  };
  videoUrl?: string;
  caption?: string | null;
  alt?: string | null;
}

// MediaRenderer component to handle image, video upload, and video embed
function MediaRenderer({ media }: { media?: MediaItemValue }) {
  if (!media) return null;

  const { type, image, video, videoUrl, caption } = media;

  return (
    <figure>
      {type === "image" && image ? (
        <AspectRatio className="relative w-full" ratio={4 / 3}>
          <SanityImage
            className="rounded-lg object-cover"
            fill
            source={{ image, alt: media.alt }}
          />
        </AspectRatio>
      ) : type === "videoUpload" && video?.asset?.url ? (
        <AspectRatio className="relative w-full" ratio={16 / 9}>
          <video
            className="absolute inset-0 h-full w-full rounded-lg object-cover"
            controls
            src={video.asset.url}
          />
        </AspectRatio>
      ) : type === "videoEmbed" && videoUrl ? (
        <AspectRatio className="relative w-full" ratio={16 / 9}>
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full rounded-lg"
            src={getEmbedUrl(videoUrl)}
            title="Video embed"
          />
        </AspectRatio>
      ) : null}
      {caption ? (
        <figcaption className="mt-2 text-center text-gray-500 text-sm">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

// Helper function to convert video URLs to embed URLs
function getEmbedUrl(url: string): string {
  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
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
    media?: MediaItemValue;
  };
}

interface SideBySideMediaBlockProps {
  value: {
    _key: string;
    _type: "sideBySideMediaBlock";
    left?: MediaItemValue;
    right?: MediaItemValue;
  };
}

interface ThreeSideBySideMediaBlockProps {
  value: {
    _key: string;
    _type: "threeSideBySideMediaBlock";
    left?: MediaItemValue;
    center?: MediaItemValue;
    right?: MediaItemValue;
  };
}

interface GridFourMediaBlockProps {
  value: {
    _key: string;
    _type: "gridFourMediaBlock";
    topLeft?: MediaItemValue;
    topRight?: MediaItemValue;
    bottomLeft?: MediaItemValue;
    bottomRight?: MediaItemValue;
  };
}

function SingleMediaBlock({ value }: SingleMediaBlockProps) {
  if (!value.media) return null;

  return (
    <div className="my-8">
      <MediaRenderer media={value.media} />
    </div>
  );
}

function SideBySideMediaBlock({ value }: SideBySideMediaBlockProps) {
  return (
    <div className="my-8 grid grid-cols-2 gap-4">
      <MediaRenderer media={value.left} />
      <MediaRenderer media={value.right} />
    </div>
  );
}

function ThreeSideBySideMediaBlock({ value }: ThreeSideBySideMediaBlockProps) {
  return (
    <div className="my-8 grid grid-cols-3 gap-4">
      <MediaRenderer media={value.left} />
      <MediaRenderer media={value.center} />
      <MediaRenderer media={value.right} />
    </div>
  );
}

function GridFourMediaBlock({ value }: GridFourMediaBlockProps) {
  return (
    <div className="my-8 grid grid-cols-2 gap-4">
      <MediaRenderer media={value.topLeft} />
      <MediaRenderer media={value.topRight} />
      <MediaRenderer media={value.bottomLeft} />
      <MediaRenderer media={value.bottomRight} />
    </div>
  );
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="interview-question">{children}</p>
    ),
    answer: ({ children }) => <p className="interview-answer">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="interview-quote">{children}</blockquote>
    ),
  },
  types: {
    singleMediaBlock: SingleMediaBlock,
    sideBySideMediaBlock: SideBySideMediaBlock,
    threeSideBySideMediaBlock: ThreeSideBySideMediaBlock,
    gridFourMediaBlock: GridFourMediaBlock,
  },
};

interface InterviewContentProps {
  content?: PortableTextBlock[] | null;
}

export default function InterviewContent({ content }: InterviewContentProps) {
  if (!content) return null;

  return (
    <div className="prose prose-lg max-w-none">
      <PortableText components={components} value={content} />
    </div>
  );
}
