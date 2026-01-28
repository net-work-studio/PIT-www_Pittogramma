import { PortableText, type PortableTextComponents } from "next-sanity";

import SanityImage from "@/components/modules/shared/sanity-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ImageBlockProps {
  value: {
    _key: string;
    _type: "imageBlock";
    image?: {
      image?: {
        asset?: unknown;
        hotspot?: unknown;
        crop?: unknown;
      };
      alt?: string | null;
      caption?: string | null;
    };
  };
}

interface MultipleImageBlockProps {
  value: {
    _key: string;
    _type: "multipleImageBlock";
    images?: Array<{
      _key: string;
      image?: {
        asset?: unknown;
        hotspot?: unknown;
        crop?: unknown;
      };
      alt?: string | null;
      caption?: string | null;
    }>;
  };
}

function ImageBlock({ value }: ImageBlockProps) {
  if (!value.image?.image) return null;

  return (
    <figure className="my-8">
      <AspectRatio className="relative w-full" ratio={16 / 9}>
        <SanityImage
          className="rounded-lg object-cover"
          fill
          source={value.image}
        />
      </AspectRatio>
      {value.image.caption ? (
        <figcaption className="mt-2 text-center text-gray-500 text-sm">
          {value.image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function MultipleImageBlock({ value }: MultipleImageBlockProps) {
  if (!value.images?.length) return null;

  const imageCount = value.images.length;
  const gridCols =
    imageCount === 2
      ? "grid-cols-2"
      : imageCount === 3
        ? "grid-cols-3"
        : "grid-cols-2";

  return (
    <div className={`my-8 grid ${gridCols} gap-4`}>
      {value.images.map((img) => (
        <figure key={img._key}>
          <AspectRatio className="relative w-full" ratio={4 / 3}>
            <SanityImage
              className="rounded-lg object-cover"
              fill
              source={img}
            />
          </AspectRatio>
          {img.caption ? (
            <figcaption className="mt-2 text-center text-gray-500 text-sm">
              {img.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}

const components: PortableTextComponents = {
  types: {
    imageBlock: ImageBlock,
    multipleImageBlock: MultipleImageBlock,
  },
};

interface InterviewContentProps {
  content?: unknown[] | null;
}

export default function InterviewContent({ content }: InterviewContentProps) {
  if (!content) return null;

  return (
    <div className="prose prose-lg max-w-none">
      <PortableText components={components} value={content} />
    </div>
  );
}
