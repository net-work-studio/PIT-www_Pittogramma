"use client";

import type { ComponentProps, Ref } from "react";

import type { DESIGNERS_QUERY_RESULT } from "@/sanity/types";
import DesignerModal from "./designer-modal";

type Designer = DESIGNERS_QUERY_RESULT[number];

function getPlace(place: Designer["place"]) {
  if (!place) return "-";
  const parts = [place.country, place.city].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "-";
}

interface DesignerListItemProps extends Omit<ComponentProps<"button">, "children"> {
  designer: Designer;
  ref?: Ref<HTMLButtonElement>;
}

function DesignerListItem({ designer, ref, ...props }: DesignerListItemProps) {
  return (
    <button
      {...props}
      className="grid w-full grid-cols-12 gap-2.5 border-b px-2.5 py-3 text-left transition-colors hover:bg-muted max-md:grid-cols-1 max-md:gap-1"
      ref={ref}
      type="button"
    >
      <span className="col-span-6 max-md:col-span-1 max-md:font-medium">
        {designer.name}
      </span>
      <span className="col-span-3 max-md:hidden">{designer.birthYear ?? "-"}</span>
      <span className="col-span-3 max-md:col-span-1 max-md:text-muted-foreground max-md:text-sm">
        {getPlace(designer.place)}
      </span>
    </button>
  );
}

interface DesignerListProps {
  designers: DESIGNERS_QUERY_RESULT;
}

export default function DesignerList({ designers }: DesignerListProps) {
  return (
    <section>
      <div className="grid grid-cols-12 gap-2.5 border-b px-2.5 pb-2 font-mono text-xs uppercase max-md:hidden">
        <span className="col-span-6">Designer</span>
        <span className="col-span-3">Birth year</span>
        <span className="col-span-3">Based in</span>
      </div>
      <div>
        {designers.map((designer) => (
          <DesignerModal designer={designer} key={designer._id}>
            <DesignerListItem designer={designer} />
          </DesignerModal>
        ))}
      </div>
    </section>
  );
}
