"use client";

import DesignerModal, {
  designerHasModalContent,
} from "@/components/modules/designer/designer-modal";
import DesignerPortraitThumb from "@/components/modules/designer/designer-portrait-thumb";
import type { PROJECT_QUERY_RESULT } from "@/sanity/types";

type Designer = NonNullable<PROJECT_QUERY_RESULT>["designers"][number];

interface DesignerNamesRowProps {
  currentProjectId?: string;
  designers?: Designer[] | null;
}

export default function DesignerNamesRow({
  designers,
  currentProjectId,
}: DesignerNamesRowProps) {
  const namedDesigners = designers?.filter((d) => d.name) ?? [];

  if (!namedDesigners.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-start gap-x-6 gap-y-3 text-muted-foreground text-xl">
      {namedDesigners.map((designer) => {
        const interactive = designerHasModalContent(designer, currentProjectId);

        return interactive ? (
          <DesignerModal
            currentProjectId={currentProjectId}
            designer={designer}
            key={designer._id}
          >
            <button
              className="inline-flex cursor-pointer items-center gap-1.5 decoration-1 underline-offset-4 hover:underline"
              type="button"
            >
              <DesignerPortraitThumb
                name={designer.name}
                portrait={designer.portrait}
              />
              {designer.name}
            </button>
          </DesignerModal>
        ) : (
          <span className="inline-flex items-center gap-2.5" key={designer._id}>
            <DesignerPortraitThumb
              name={designer.name}
              portrait={designer.portrait}
            />
            {designer.name}
          </span>
        );
      })}
    </div>
  );
}
