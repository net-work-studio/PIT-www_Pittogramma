import type { ReactNode } from "react";

import type { Resource } from "@/components/navigation/resources-navigation.data";
import ResourcesNavigation from "../navigation/resources-navigation";

interface ResourcesHeaderProps {
  children?: ReactNode;
  intro: string;
  resources: Resource[];
  title: string;
}

export default function ResourcesHeader({
  children,
  intro,
  resources,
  title,
}: ResourcesHeaderProps) {
  return (
    <>
      <div className="hidden flex-col items-center justify-center gap-7.5 md:flex">
        <hgroup className="flex flex-col items-center justify-center pt-16 text-center">
          <h1 className="text-2xl uppercase">{title}</h1>
          <p className="h-16 max-w-prose text-balance text-2xl lg:h-auto">
            {intro}
          </p>
        </hgroup>
        <ResourcesNavigation resources={resources} />
        {children}
      </div>
      <div className="flex w-full flex-col items-center pt-10 pb-8 md:hidden">
        <h1 className="mb-6 text-2xl uppercase">{title}</h1>
        <div className="-mx-5 w-[calc(100%+2.5rem)]">
          <ResourcesNavigation resources={resources} />
        </div>
        <p className="mt-6 max-w-prose text-balance text-center text-2xl">
          {intro}
        </p>
        {children ? <div className="mt-7.5">{children}</div> : null}
      </div>
    </>
  );
}
