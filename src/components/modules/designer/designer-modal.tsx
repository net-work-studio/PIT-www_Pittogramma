"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import SanityImage from "@/components/modules/shared/sanity-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
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
  education: Array<{
    _key: string;
    degree: string | null;
    courseName?: string | null;
    year: number | null;
  }> | null;
  name: string | null;
  portrait: {
    image?: {
      asset?: unknown;
      hotspot?: unknown;
      crop?: unknown;
    } | null;
    alt?: string | null;
  } | null;
  projects?: Array<{
    _id: string;
    title: string | null;
    slug: { current: string };
  }> | null;
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
          className="max-h-[85vh] overflow-y-auto p-10 sm:max-w-4xl"
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
  const { name, portrait, bio, birthYear, socialLinks, education, projects } =
    designer;
  const hasPortrait = Boolean(portrait?.image?.asset);
  const links = socialLinks?.links ?? [];
  const filteredProjects = (projects ?? []).filter(
    (p) => p._id !== currentProjectId
  );

  return (
    <div className="flex flex-col gap-10">
      {hasPortrait ? (
        <div className="w-full max-w-sm">
          <AspectRatio
            className="relative overflow-hidden rounded-3xl"
            ratio={3 / 4}
          >
            <SanityImage
              className="rounded-3xl"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              source={portrait}
            />
          </AspectRatio>
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-6">
        {name ? (
          <h2 className="text-[28px] leading-tight md:text-[44px]">{name}</h2>
        ) : null}
        {birthYear ? (
          <p className="text-[28px] leading-tight md:text-[44px]">
            {birthYear}
          </p>
        ) : null}
      </div>

      {bio ? (
        <div className="flex flex-col">
          <p className="text-[20px] text-muted-foreground leading-tight md:text-[32px]">
            Bio
          </p>
          <p className="text-[20px] leading-tight md:text-[32px]">{bio}</p>
        </div>
      ) : null}

      {filteredProjects.length > 0 ||
      (education && education.length > 0) ||
      links.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {filteredProjects.length > 0 ? (
            <section className="flex flex-col">
              <p className="text-[18px] text-muted-foreground leading-tight md:text-[24px]">
                Projects
              </p>
              <ul className="flex flex-col">
                {filteredProjects.map((project) => (
                  <li
                    className="text-[18px] leading-tight md:text-[24px]"
                    key={project._id}
                  >
                    <Link href={`/projects/${project.slug.current}`}>
                      {project.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {education && education.length > 0 ? (
            <section className="flex flex-col">
              <p className="text-[18px] text-muted-foreground leading-tight md:text-[24px]">
                Studies
              </p>
              <ul className="flex flex-col">
                {education.map((edu) => (
                  <li
                    className="text-[18px] leading-tight md:text-[24px]"
                    key={edu._key}
                  >
                    {[edu.degree, edu.year].filter(Boolean).join(", ")}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {links.length > 0 ? (
            <section className="flex flex-col">
              <p className="text-[18px] text-muted-foreground leading-tight md:text-[24px]">
                Contacts
              </p>
              <ul className="flex flex-col">
                {links.map((link) => (
                  <li
                    className="text-[18px] leading-tight md:text-[24px]"
                    key={link._key}
                  >
                    <a
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
  );
}
