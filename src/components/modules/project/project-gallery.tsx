import MediaGallery, {
  type MediaGalleryBlock,
} from "@/components/modules/shared/media-gallery";
import type { PROJECT_QUERY_RESULT } from "@/sanity/types";

interface ProjectGalleryProps {
  gallery: NonNullable<PROJECT_QUERY_RESULT>["gallery"];
}

export default function ProjectGallery({ gallery }: ProjectGalleryProps) {
  return (
    <MediaGallery
      gallery={gallery as MediaGalleryBlock[] | null | undefined}
    />
  );
}
