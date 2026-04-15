import type { ReactNode } from "react";

interface ProjectMetaItemProps {
  label: string;
  children: ReactNode;
}

export default function ProjectMetaItem({
  label,
  children,
}: ProjectMetaItemProps) {
  return (
    <div className="flex gap-2">
      <dt className="font-mono w-1/2 text-muted-foreground text-sm uppercase">
        {label}
      </dt>
      <dd className="text-sm w-1/2">{children}</dd>
    </div>
  );
}
