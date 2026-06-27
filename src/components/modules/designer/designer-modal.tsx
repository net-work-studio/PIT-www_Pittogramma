"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import CoverPosterThumb from "@/components/modules/shared/cover-poster-thumb";
import SanityImage from "@/components/modules/shared/sanity-image";
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
import { sortEducationByYearDesc } from "@/lib/education-utils";
import type { DESIGNERS_QUERY_RESULT } from "@/sanity/types";

type SocialLinkPlatform =
  | "behance"
  | "bluesky"
  | "ig"
  | "linkedin"
  | "linktree"
  | "mastodon"
  | "spotify"
  | "substack"
  | "tiktok"
  | "website"
  | "x";

interface SocialLink {
  _key: string;
  platform: SocialLinkPlatform;
  url: string;
}

export interface DesignerForModal {
  _id?: string;
  bio: string | null;
  birthYear: number | null;
  education: DESIGNERS_QUERY_RESULT[number]["education"];
  name: string | null;
  place?: {
    city?: string | null;
    country?: string | null;
  } | null;
  portrait: {
    image?: {
      asset?: unknown;
      hotspot?: unknown;
      crop?: unknown;
    } | null;
    alt?: string | null;
  } | null;
  projects?: NonNullable<DESIGNERS_QUERY_RESULT[number]["projects"]> | null;
  socialLinks: {
    links?: SocialLink[] | null;
  } | null;
}

const PLATFORM_LABELS: Record<SocialLinkPlatform, string> = {
  behance: "Behance",
  bluesky: "Bluesky",
  ig: "Instagram",
  linkedin: "LinkedIn",
  linktree: "Linktree",
  mastodon: "Mastodon",
  spotify: "Spotify",
  substack: "Substack",
  tiktok: "TikTok",
  website: "Website",
  x: "X",
};

interface DesignerModalProps {
  children: ReactNode;
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
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="max-h-[85vh] overflow-y-auto p-0 sm:max-w-5xl"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogTitle className="sr-only">{titleText}</DialogTitle>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet onOpenChange={handleOpenChange} open={open}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className="max-h-[85vh] overflow-y-auto p-6"
        onCloseAutoFocus={(e) => e.preventDefault()}
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
  const filteredProjects = (projects ?? []).filter(
    (p) => p._id !== currentProjectId
  );
  const sortedEducation = education ? sortEducationByYearDesc(education) : [];

  return (
    <div className="flex w-full flex-col md:flex-row md:items-stretch">
      <div className="aspect-3/4 w-full md:relative md:aspect-auto md:w-2/5 md:shrink-0">
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
                {name?.trim().slice(0, 1) ?? "?"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full space-y-5 p-5 max-md:px-0 max-md:pb-0 md:w-3/5">
        <div className="flex flex-col text-base">
          <hgroup className="flex">
            {name ? <h2>{name}</h2> : null}
            {birthYear ? <p>, {birthYear}</p> : null}
          </hgroup>
          {locationLine ? (
            <p className="col-span-2 text-muted-foreground">{locationLine}</p>
          ) : null}
        </div>

        {bio ? <p>{bio}</p> : null}

        {filteredProjects.length > 0 ||
        sortedEducation.length > 0 ||
        links.length > 0 ? (
          <div className="space-y-5">
            {filteredProjects.length > 0 ? (
              <section className="flex flex-col space-y-1.5">
                <p className="font-mono text-muted-foreground text-xxs uppercase">
                  Projects
                </p>
                <ul className="flex flex-col gap-2">
                  {filteredProjects.map((project) => (
                    <li key={project._id}>
                      <Link
                        className="group/project inline-flex w-fit items-center gap-2"
                        href={`/projects/${project.slug.current}`}
                      >
                        <CoverPosterThumb cover={project.cover} />
                        <span className="line-clamp-1 transition-opacity duration-100 ease-out group-hover/project:opacity-60">
                          {project.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {sortedEducation.length > 0 ? (
              <section className="flex flex-col">
                <p className="space-y-1.5 font-mono text-muted-foreground text-xxs uppercase">
                  Education
                </p>
                <ul className="flex flex-col">
                  {sortedEducation.map((edu) => (
                    <li className="flex" key={edu._key}>
                      <span className="w-12.5">{edu.year}</span>
                      {[edu.institute?.name, edu.courseName, edu.degree]
                        .filter(Boolean)
                        .join(", ")}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {links.length > 0 ? (
              <section className="flex flex-col">
                <p className="space-y-1.5 font-mono text-muted-foreground text-xxs uppercase">
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
                        ↗ {PLATFORM_LABELS[link.platform] ?? link.platform}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
