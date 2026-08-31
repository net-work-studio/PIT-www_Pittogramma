"use client";

import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { designerInitial } from "@/components/modules/designer/designer-portrait-thumb";
import DesignerProjectLink from "@/components/modules/designer/designer-project-link";
import SanityImage from "@/components/modules/shared/sanity-image";
import { MultilineText } from "@/components/shared/multiline-text";
import { ScrollFade } from "@/components/shared/scroll-fade";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  educationTextParts,
  sortEducationByYearDesc,
} from "@/lib/education-utils";
import { SOCIAL_LINK_LABELS } from "@/lib/social-link-labels";
import type {
  DESIGNERS_QUERY_RESULT,
  PROJECT_QUERY_RESULT,
} from "@/sanity/types";

export type DesignerForModal =
  | DESIGNERS_QUERY_RESULT[number]
  | NonNullable<PROJECT_QUERY_RESULT>["designers"][number];

export function filterDesignerProjects(
  projects: DesignerForModal["projects"],
  currentProjectId?: string
) {
  return (projects ?? []).filter((p) => p._id !== currentProjectId);
}

export function designerHasModalContent(
  designer: DesignerForModal,
  currentProjectId?: string
): boolean {
  return Boolean(
    designer.bio ||
      designer.portrait?.image?.asset ||
      designer.birthYear ||
      designer.socialLinks?.links?.length ||
      designer.education?.length ||
      filterDesignerProjects(designer.projects, currentProjectId).length
  );
}

interface DesignerModalProps {
  children: ReactElement;
  currentProjectId?: string;
  defaultOpen?: boolean;
  designer: DesignerForModal;
  onOpenChange?: (open: boolean) => void;
}

export default function DesignerModal({
  designer,
  children,
  currentProjectId,
  defaultOpen,
  onOpenChange,
}: DesignerModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (defaultOpen !== undefined) {
      setOpen(defaultOpen);
    }
  }, [defaultOpen]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  const content = (
    <DesignerModalContent
      currentProjectId={currentProjectId}
      designer={designer}
    />
  );

  const titleText = designer.name ?? "Designer";

  if (isDesktop) {
    return (
      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogTrigger render={children} />
        <DialogContent
          className="h-[min(85vh,calc(53.333vw-1.06667rem),42.6667rem)] w-[calc(100%-2rem)] max-w-7xl overflow-hidden p-0 sm:max-w-7xl!"
          finalFocus={false}
        >
          <DialogTitle className="sr-only">{titleText}</DialogTitle>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet onOpenChange={handleOpenChange} open={open}>
      <SheetTrigger render={children} />
      <SheetContent
        className="flex h-[85vh] max-h-[85vh] flex-col overflow-hidden p-6"
        finalFocus={false}
        side="bottom"
      >
        <SheetTitle className="sr-only">{titleText}</SheetTitle>
        {content}
      </SheetContent>
    </Sheet>
  );
}

function DesignerModalContent({
  designer,
  currentProjectId,
}: {
  designer: DesignerForModal;
  currentProjectId?: string;
}) {
  const {
    name,
    portrait,
    bio,
    birthYear,
    place,
    socialLinks,
    education,
    projects,
  } = designer;
  const hasPortrait = Boolean(portrait?.image?.asset);
  const links = socialLinks?.links ?? [];
  const locationLine = [place?.city, place?.country].filter(Boolean).join(", ");
  const filteredProjects = filterDesignerProjects(projects, currentProjectId);
  const sortedEducation = education ? sortEducationByYearDesc(education) : [];

  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      <div className="aspect-3/4 w-full shrink-0 md:relative md:h-full md:w-auto">
        <div className="relative h-full w-full overflow-hidden rounded-xl md:absolute md:inset-0 md:rounded-none md:rounded-l-xl">
          {hasPortrait ? (
            <SanityImage
              className="rounded-xl md:rounded-none md:rounded-l-xl"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              source={portrait}
            />
          ) : (
            <div
              aria-hidden
              className="absolute inset-0 grid place-items-center rounded-xl bg-primary/5 md:rounded-none md:rounded-l-xl"
            >
              <span className="text-5xl text-muted-foreground uppercase">
                {designerInitial(name)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
        <div className="shrink-0 px-5 pt-5 pb-2.5 max-md:px-0">
          <div className="flex flex-col text-base">
            <hgroup className="flex">
              {name ? <h2>{name}</h2> : null}
              {birthYear ? <p>, {birthYear}</p> : null}
            </hgroup>
            {locationLine ? (
              <p className="text-muted-foreground">{locationLine}</p>
            ) : null}
          </div>
        </div>

        <ScrollFade className="min-h-0 flex-1" key={designer._id}>
          <div className="space-y-5 px-5 pt-5 pb-24 max-md:px-0">
            {bio ? (
              <p>
                <MultilineText text={bio} />
              </p>
            ) : null}

            {filteredProjects.length > 0 ? (
              <section className="flex flex-col space-y-1.5">
                <p className="font-mono text-muted-foreground text-xxs uppercase">
                  Projects
                </p>
                <ul className="flex flex-col gap-2">
                  {filteredProjects.map((project) => (
                    <li key={project._id}>
                      <DesignerProjectLink project={project} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {sortedEducation.length > 0 ? (
              <section className="flex flex-col">
                <p className="font-mono text-muted-foreground text-xxs uppercase">
                  Education
                </p>
                <ul className="flex flex-col">
                  {sortedEducation.map((edu) => (
                    <li className="flex" key={edu._key}>
                      <span className="w-12.5">{edu.year}</span>
                      {educationTextParts(edu).join(", ")}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {links.length > 0 ? (
              <section className="flex flex-col">
                <p className="font-mono text-muted-foreground text-xxs uppercase">
                  Links
                </p>
                <ul className="flex flex-col">
                  {links.map((link) => (
                    <li key={link._key}>
                      <a
                        className="hover:text-muted-foreground"
                        href={link.url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        ↗ {SOCIAL_LINK_LABELS[link.platform] ?? link.platform}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </ScrollFade>
      </div>
    </div>
  );
}
