import MediaBlocks, {
  type MediaBlockShape,
} from "@/components/modules/shared/media-blocks";
import type { PROJECT_QUERY_RESULT } from "@/sanity/types";

interface ProjectGalleryProps {
  gallery: NonNullable<PROJECT_QUERY_RESULT>["gallery"];
}

export default function ProjectGallery({ gallery }: ProjectGalleryProps) {
  if (!gallery?.length) {
    return null;
  }

  return (
    <MediaBlocks
      blocks={gallery as readonly MediaBlockShape[]}
      className="mt-2.5"
      rounded="xl"
      showCaptions={false}
    />
  );
}
