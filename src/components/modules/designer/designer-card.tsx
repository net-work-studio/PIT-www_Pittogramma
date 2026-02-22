"use client";

import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getBlurDataUrl, urlFor } from "@/sanity/lib/image";
import type { DESIGNERS_QUERY_RESULT } from "@/sanity/types";

type Designer = DESIGNERS_QUERY_RESULT[number];

interface DesignerCardProps {
  designer: Designer;
  onClick: () => void;
}

export default function DesignerCard({ designer, onClick }: DesignerCardProps) {
  const image = designer.portrait?.image
    ? urlFor(designer.portrait.image).width(800).height(600).url()
    : "";

  const blurDataURL = getBlurDataUrl(designer.portrait);

  const locationParts = [designer.place?.city, designer.place?.country].filter(
    Boolean
  );

  return (
    <button
      className="span-col-1 group col-span-1 flex h-fit w-full cursor-pointer flex-col items-start justify-center gap-2.5 rounded-[1.25rem] text-left"
      onClick={onClick}
      type="button"
    >
      <AspectRatio
        className="relative overflow-hidden rounded-lg"
        ratio={4 / 3}
      >
        {image ? (
          <Image
            alt={designer.name ?? ""}
            className="h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
            fill
            quality={75}
            src={image}
            {...(blurDataURL
              ? { placeholder: "blur" as const, blurDataURL }
              : {})}
          />
        ) : (
          <div className="h-full w-full rounded-lg bg-neutral-200" />
        )}
      </AspectRatio>
      <div className="inline-flex w-full flex-col items-start justify-start gap-3">
        <hgroup className="flex flex-col items-start justify-start gap-2 self-stretch">
          <h3 className="justify-start self-stretch font-normal font-sans text-base text-black">
            {designer.name}
          </h3>
          {locationParts.length > 0 ? (
            <p className="font-normal font-sans text-neutral-400 text-xs">
              {locationParts.join(", ")}
            </p>
          ) : null}
        </hgroup>
      </div>
    </button>
  );
}
