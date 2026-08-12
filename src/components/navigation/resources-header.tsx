import type { ReactNode } from "react";

import { getEnabledResources } from "@/lib/feature-flags";
import ResourcesNavigation from "../navigation/resources-navigation";

interface ResourcesHeaderProps {
  children?: ReactNode;
  intro: string;
  title: string;
}

export default function ResourcesHeader({
  children,
  intro,
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
        <ResourcesNavigation resources={getEnabledResources()} />
        {children}
      </div>
      <div className="flex w-full flex-col items-center pt-15 pb-8 md:hidden">
        <ResourcesNavigation resources={getEnabledResources()} />
        <p className="mt-6 max-w-prose text-balance text-center text-2xl">
          {intro}
        </p>
        {children ? <div className="mt-7.5">{children}</div> : null}
      </div>
    </>
  );
}
