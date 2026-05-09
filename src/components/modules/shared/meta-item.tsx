import type { ReactNode } from "react";

interface MetaItemProps {
  label: string;
  children: ReactNode;
}

export default function MetaItem({ label, children }: MetaItemProps) {
  return (
    <div className="flex gap-2">
      <dt className="font-mono w-1/2 text-muted-foreground text-sm uppercase">
        {label}
      </dt>
      <dd className="text-sm w-1/2">{children}</dd>
    </div>
  );
}
