"use client";

import { Fragment } from "react";

import DesignerModal from "@/components/modules/designer/designer-modal";
import type { PROJECT_QUERY_RESULT } from "@/sanity/types";

type Designer = NonNullable<PROJECT_QUERY_RESULT>["designers"][number];

interface DesignerNamesRowProps {
  currentProjectId?: string;
  designers?: Designer[] | null;
  title?: string | null;
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

export default function DesignerNamesRow({
  designers,
  title,
  currentProjectId,
}: DesignerNamesRowProps) {
  const namedDesigners = designers?.filter((d) => d.name) ?? [];
  const hasAnyName = namedDesigners.length > 0;

  return (
    <div className="flex flex-col gap-1">
      {hasAnyName ? (
        <div className="text-3xl text-muted-foreground">
          {namedDesigners.map((designer, index) => {
            const separator = index > 0 ? ", " : null;
            const interactive = hasModalData(designer, currentProjectId);

            return (
              <Fragment key={designer._id}>
                {separator}
                {interactive ? (
                  <DesignerModal
                    currentProjectId={currentProjectId}
                    designer={designer}
                  >
                    <button
                      className="cursor-pointer decoration-1 underline-offset-4 hover:underline"
                      type="button"
                    >
                      {designer.name}
                    </button>
                  </DesignerModal>
                ) : (
                  <span>{designer.name}</span>
                )}
              </Fragment>
            );
          })}
        </div>
      ) : null}
      {title ? <h1 className="text-3xl">{title}</h1> : null}
    </div>
  );
}
