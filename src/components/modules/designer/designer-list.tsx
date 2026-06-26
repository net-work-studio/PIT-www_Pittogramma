"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type Ref, useCallback, useEffect, useRef, useState } from "react";

import SanityImage from "@/components/modules/shared/sanity-image";
import type { DESIGNERS_QUERY_RESULT } from "@/sanity/types";
import DesignerModal from "./designer-modal";

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
  const hasPortrait = Boolean(designer.portrait?.image?.asset);

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
            {hasPortrait ? (
              <SanityImage
                className="size-7 shrink-0 rounded-full object-cover"
                fit="crop"
                height={112}
                source={designer.portrait}
                width={112}
              />
            ) : (
              <div className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/5">
                <span className="text-muted-foreground text-xs">
                  {designer.name.slice(0, 1)}
                </span>
              </div>
            )}
            <span className="max-md:font-medium">{designer.name}</span>
          </button>
        </DesignerModal>
      </div>

      <div className="col-span-4 max-md:col-span-1 max-md:pl-9 max-md:text-muted-foreground max-md:text-sm">
        {designer.projects && designer.projects.length > 0 ? (
          <div className="flex flex-col gap-2">
            {designer.projects.map((project) => (
              <Link
                className="group/project flex w-fit items-center gap-2"
                href={`/projects/${project.slug.current}`}
                key={project._id}
              >
                {project.cover?.image?.asset ? (
                  <SanityImage
                    className="aspect-4/3 h-7 w-auto shrink-0 rounded-sm object-cover transition-opacity duration-100 ease-out group-hover/project:opacity-80"
                    fit="crop"
                    height={80}
                    source={project.cover}
                    width={112}
                  />
                ) : (
                  <div className="aspect-4/3 h-7 w-auto shrink-0 rounded-sm bg-primary/5" />
                )}
                <span className="line-clamp-1 transition-opacity duration-100 ease-out group-hover/project:opacity-60">
                  {project.title}
                </span>
              </Link>
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
        <span className="col-span-1">Birth Year</span>
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
