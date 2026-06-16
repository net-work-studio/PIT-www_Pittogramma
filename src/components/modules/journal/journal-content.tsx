import {
  PortableText,
  type PortableTextComponents,
  stegaClean,
} from "next-sanity";

import SanityImage from "@/components/modules/shared/sanity-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getGalleryRatio } from "@/lib/gallery";
import { resolveInternalLink } from "@/lib/resolve-link";
import type { JOURNAL_ARTICLE_QUERY_RESULT } from "@/sanity/types";

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
  videoFileUrl?: string | null;
  videoUrl?: string;
}

interface JournalReference {
  _id?: string;
  _key?: string;
  _type?: string;
  authors?: Array<{ name?: string | null } | null> | null;
  category?: { name?: string | null } | null;
  description?: string | null;
  name?: string | null;
  publisher?: { name?: string | null } | null;
  slug?: { current?: string | null } | null;
  sourceUrl?: string | null;
  title?: string | null;
  year?: number | null;
}

interface ReferencesBlockProps {
  value: {
    _key: string;
    _type: "referencesBlock" | "referenceBlock" | "references";
    title?: string | null;
    references?: JournalReference[] | null;
  };
}

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

  const {
    type: rawType,
    image,
    video,
    videoFileUrl,
    videoUrl,
    caption,
    alt,
  } = media;
  const type = stegaClean(rawType);

  function renderMedia() {
    if (type === "image" && image) {
      return (
        <AspectRatio className="relative w-full" ratio={ratio}>
          <SanityImage
            className="rounded-xl object-cover"
            fill
            source={{ image, alt }}
          />
        </AspectRatio>
      );
    }
    const uploadedVideoUrl = video?.asset?.url ?? videoFileUrl;
    if (type === "videoUpload" && uploadedVideoUrl) {
      return (
        <AspectRatio className="relative w-full" ratio={16 / 9}>
          {/* biome-ignore lint/a11y/useMediaCaption: captions not available for uploaded videos */}
          <video
            className="absolute inset-0 h-full w-full rounded-xl object-cover"
            controls
            src={uploadedVideoUrl}
          />
        </AspectRatio>
      );
    }
    if (type === "videoEmbed" && videoUrl) {
      const embedSrc = getEmbedUrl(videoUrl);
      if (!embedSrc) {
        return null;
      }
      return (
        <AspectRatio className="relative w-full" ratio={16 / 9}>
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full rounded-xl"
            src={embedSrc}
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
        <figcaption className="mt-1.5 font-mono text-muted-foreground text-xs uppercase">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

const YOUTUBE_REGEX =
  /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
const VIMEO_REGEX = /vimeo\.com\/(\d+)/;

function getEmbedUrl(url: string): string | null {
  const youtubeMatch = url.match(YOUTUBE_REGEX);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  const vimeoMatch = url.match(VIMEO_REGEX);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  return null;
}

function getReferenceTitle(reference: JournalReference): string {
  return reference.name ?? reference.title ?? "Untitled reference";
}

function getReferenceMeta(reference: JournalReference): string | null {
  if (reference._type === "bibliography") {
    const authors = reference.authors
      ?.map((author) => author?.name)
      .filter(Boolean)
      .join(", ");
    return [authors, reference.publisher?.name, reference.year]
      .filter(Boolean)
      .join(" - ");
  }

  return reference.category?.name ?? null;
}

function getReferenceHref(reference: JournalReference): string | null {
  if (reference.sourceUrl) {
    return reference.sourceUrl;
  }
  if (!reference._type) {
    return null;
  }
  return resolveInternalLink({
    _type: reference._type,
    slug: reference.slug?.current
      ? { current: reference.slug.current }
      : undefined,
  });
}

function ReferencesBlock({ value }: ReferencesBlockProps) {
  const references = value.references?.filter(Boolean) ?? [];
  if (references.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto my-10 max-w-[700px] border-t pt-4">
      <h2 className="mb-4 font-mono text-muted-foreground text-xs uppercase">
        {value.title || "References"}
      </h2>
      <ol className="flex list-decimal flex-col gap-3 pl-5">
        {references.map((reference, index) => {
          const title = getReferenceTitle(reference);
          const meta = getReferenceMeta(reference);
          const href = getReferenceHref(reference);
          return (
            <li
              className="pl-1 text-sm leading-relaxed"
              key={reference._key ?? reference._id ?? index}
            >
              {href ? (
                <a
                  className="underline hover:no-underline"
                  href={href}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  target={href.startsWith("http") ? "_blank" : undefined}
                >
                  {title}
                </a>
              ) : (
                <span>{title}</span>
              )}
              {meta ? (
                <span className="text-muted-foreground">, {meta}</span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

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
      <p className="mx-auto mb-4 max-w-[700px] text-base leading-relaxed lg:text-xl">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mx-auto mt-10 mb-4 max-w-[700px] text-xl leading-tight lg:text-2xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mx-auto mt-8 mb-3 max-w-[700px] text-lg leading-tight lg:text-xl">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mx-auto my-8 max-w-[700px] text-2xl leading-tight lg:text-[2.5rem] lg:leading-tight">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) =>
      value?.href ? (
        <a
          className="underline"
          href={value.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {children}
        </a>
      ) : (
        children
      ),
  },
  types: {
    singleMediaBlock: SingleMediaBlock,
    sideBySideMediaBlock: SideBySideMediaBlock,
    threeSideBySideMediaBlock: ThreeSideBySideMediaBlock,
    gridFourMediaBlock: GridFourMediaBlock,
    referencesBlock: ReferencesBlock,
    referenceBlock: ReferencesBlock,
    references: ReferencesBlock,
  },
};

type JournalContentBlocks = NonNullable<
  NonNullable<JOURNAL_ARTICLE_QUERY_RESULT>["content"]
>;

interface JournalContentProps {
  content?: JournalContentBlocks | null;
}

export default function JournalContent({ content }: JournalContentProps) {
  if (!content) {
    return null;
  }

  return (
    <div className="px-2.5">
      <PortableText components={components} value={content} />
    </div>
  );
}
