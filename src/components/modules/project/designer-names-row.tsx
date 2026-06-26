"use client";

import DesignerModal from "@/components/modules/designer/designer-modal";
import SanityImage from "@/components/modules/shared/sanity-image";
import type { PROJECT_QUERY_RESULT } from "@/sanity/types";

type Designer = NonNullable<PROJECT_QUERY_RESULT>["designers"][number];

interface DesignerNamesRowProps {
  currentProjectId?: string;
  designers?: Designer[] | null;
}

function hasModalData(d: Designer, currentProjectId?: string): boolean {
  const otherProjects = (d.projects ?? []).filter(
    (p) => p._id !== currentProjectId
  );
  return Boolean(
    d.bio ||
      d.portrait?.image?.asset ||
      d.birthYear ||
      d.socialLinks?.links?.length ||
      d.education?.length ||
      otherProjects.length
  );
}

function DesignerAvatar({ designer }: { designer: Designer }) {
  const hasPortrait = Boolean(designer.portrait?.image?.asset);

  return hasPortrait ? (
    <SanityImage
      className="size-7 shrink-0 rounded-full object-cover"
      fit="crop"
      height={96}
      source={designer.portrait}
      width={96}
    />
  ) : (
    <div className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/5">
      <span className="text-muted-foreground text-xs">
        {designer.name?.slice(0, 1)}
      </span>
    </div>
  );
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
        const interactive = hasModalData(designer, currentProjectId);

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
              <DesignerAvatar designer={designer} />
              {designer.name}
            </button>
          </DesignerModal>
        ) : (
          <span
            className="inline-flex items-center gap-2.5"
            key={designer._id}
          >
            <DesignerAvatar designer={designer} />
            {designer.name}
          </span>
        );
      })}
    </div>
  );
}
