import type { ReactNode } from "react";

interface MetaItemProps {
  children: ReactNode;
  label: string;
}

export default function MetaItem({ label, children }: MetaItemProps) {
  return (
    <div className="flex gap-2">
      <dt className="w-1/2 font-mono text-muted-foreground text-sm uppercase">
        {label}
      </dt>
      <dd className="w-1/2 text-sm">{children}</dd>
    </div>
  );
}
