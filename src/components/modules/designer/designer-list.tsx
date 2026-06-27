"use client";

import { useSearchParams } from "next/navigation";
import { type Ref, useCallback, useEffect, useRef, useState } from "react";

import type { DESIGNERS_QUERY_RESULT } from "@/sanity/types";
import DesignerModal from "./designer-modal";
import DesignerPortraitThumb from "./designer-portrait-thumb";
import DesignerProjectLink from "./designer-project-link";

type Designer = DESIGNERS_QUERY_RESULT[number];

function DesignerListItem({
  designer,
  defaultOpen,
  onOpenChange,
  ref,
}: {
  designer: Designer;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      className="grid w-full grid-cols-12 items-start gap-2.5 border-b px-2.5 py-3 text-left transition-colors duration-75 ease-in-out hover:bg-muted max-md:grid-cols-1 max-md:gap-1"
      ref={ref}
    >
      <div className="col-span-3 max-md:col-span-1">
        <DesignerModal
          defaultOpen={defaultOpen}
          designer={designer}
          onOpenChange={onOpenChange}
        >
          <button
            className="inline-flex items-center gap-2 transition-colors hover:text-muted-foreground"
            type="button"
          >
            <DesignerPortraitThumb
              name={designer.name}
              portrait={designer.portrait}
            />
            <span className="max-md:font-medium">{designer.name}</span>
          </button>
        </DesignerModal>
      </div>

      <div className="col-span-4 max-md:col-span-1 max-md:pl-9 max-md:text-muted-foreground max-md:text-sm">
        {designer.projects && designer.projects.length > 0 ? (
          <div className="flex flex-col gap-2">
            {designer.projects.map((project) => (
              <DesignerProjectLink key={project._id} project={project} />
            ))}
          </div>
        ) : (
          "-"
        )}
      </div>

      <span className="col-span-2 max-md:hidden">
        {designer.place?.city || "-"}
      </span>
      <span className="col-span-2 max-md:hidden">
        {designer.place?.country || "-"}
      </span>
      <span className="col-span-1 max-md:hidden">
        {designer.birthYear || "-"}
      </span>
    </div>
  );
}

interface DesignerListProps {
  designers: DESIGNERS_QUERY_RESULT;
}

export default function DesignerList({ designers }: DesignerListProps) {
  const searchParams = useSearchParams();
  const urlSlug = searchParams.get("designer");
  const [openSlug, setOpenSlug] = useState<string | null>(urlSlug);
  const activeRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpenSlug(urlSlug);
  }, [urlSlug]);

  useEffect(() => {
    if (urlSlug && !designers.some((d) => d.slug?.current === urlSlug)) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("designer");
      const qs = params.toString();
      window.history.replaceState(null, "", `/designers${qs ? `?${qs}` : ""}`);
      setOpenSlug(null);
    }
  }, [urlSlug, designers, searchParams]);

  useEffect(() => {
    if (openSlug) {
      activeRowRef.current?.scrollIntoView({
        behavior: "instant",
        block: "center",
      });
    }
  }, [openSlug]);

  const handleModalClose = useCallback(() => {
    setOpenSlug(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("designer");
    const qs = params.toString();
    window.history.replaceState(null, "", `/designers${qs ? `?${qs}` : ""}`);
  }, [searchParams]);

  return (
    <section>
      <div className="grid grid-cols-12 gap-2.5 border-b px-2.5 pb-2 font-mono text-xs uppercase max-md:hidden">
        <span className="col-span-3">Designer</span>
        <span className="col-span-4">Projects</span>
        <span className="col-span-2">City</span>
        <span className="col-span-2">Country</span>
        <span className="col-span-1">Year</span>
      </div>
      <div>
        {designers.map((designer) => {
          const isActive = designer.slug?.current === openSlug;
          return (
            <DesignerListItem
              defaultOpen={isActive}
              designer={designer}
              key={designer._id}
              onOpenChange={
                isActive
                  ? (open) => {
                      if (!open) {
                        handleModalClose();
                      }
                    }
                  : undefined
              }
              ref={isActive ? activeRowRef : undefined}
            />
          );
        })}
      </div>
    </section>
  );
}
