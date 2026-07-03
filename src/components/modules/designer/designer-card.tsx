"use client";

import type { ComponentProps, Ref } from "react";

import SanityImage from "@/components/modules/shared/sanity-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { DESIGNERS_QUERY_RESULT } from "@/sanity/types";

type Designer = DESIGNERS_QUERY_RESULT[number];

interface DesignerCardProps extends Omit<ComponentProps<"button">, "children"> {
  designer: Designer;
  ref?: Ref<HTMLButtonElement>;
}

export default function DesignerCard({
  designer,
  ref,
  ...props
}: DesignerCardProps) {
  const hasImage = Boolean(designer.portrait?.image?.asset);

  const locationParts = [designer.place?.city, designer.place?.country].filter(
    Boolean
  );

  return (
    <button
      {...props}
      className="span-col-1 group col-span-1 flex h-fit w-full cursor-pointer flex-col items-start justify-center gap-2.5 rounded-card text-left"
      ref={ref}
      type="button"
    >
      <AspectRatio
        className="relative overflow-hidden rounded-xl"
        ratio={4 / 3}
      >
        {hasImage ? (
          <SanityImage
            alt={designer.name ?? ""}
            className="h-full w-full rounded-xl transition-transform duration-300 group-hover:scale-105"
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            source={designer.portrait}
          />
        ) : (
          <div className="h-full w-full rounded-xl bg-neutral-200" />
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
