"use client";

import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getLqip, urlFor } from "@/sanity/lib/image";
import type { DESIGNERS_QUERY_RESULT } from "@/sanity/types";

type Designer = DESIGNERS_QUERY_RESULT[number];

interface DesignerPreviewDialogProps {
  designer: Designer | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export default function DesignerPreviewDialog({
  designer,
  open,
  onOpenChange,
}: DesignerPreviewDialogProps) {
  if (!designer) {
    return null;
  }

  const image = designer.portrait?.image
    ? urlFor(designer.portrait.image).width(600).height(800).url()
    : "";

  const blurDataURL = getLqip(designer.portrait);

  const locationParts = [designer.place?.city, designer.place?.country].filter(
    Boolean
  );

  const bio = designer.bio ?? "";
  const truncatedBio =
    bio.length > 200 ? `${bio.slice(0, 200).trimEnd()}...` : bio;

  const slug = designer.slug?.current;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        {image ? (
          <AspectRatio className="relative" ratio={3 / 4}>
            <Image
              alt={designer.name ?? ""}
              className="object-cover"
              fill
              quality={75}
              src={image}
              {...(blurDataURL
                ? { placeholder: "blur" as const, blurDataURL }
                : {})}
            />
          </AspectRatio>
        ) : null}
        <div className="flex flex-col gap-4 p-6 pt-0">
          <DialogHeader>
            <DialogTitle>{designer.name}</DialogTitle>
            {locationParts.length > 0 ? (
              <DialogDescription>{locationParts.join(", ")}</DialogDescription>
            ) : null}
          </DialogHeader>
          {truncatedBio ? (
            <p className="text-muted-foreground text-sm">{truncatedBio}</p>
          ) : null}
          {slug ? (
            <Button asChild>
              <Link href={`/designers/${slug}`}>View full profile</Link>
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
