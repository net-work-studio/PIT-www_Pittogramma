import type { ReactNode } from "react";

interface ResourceMobileCardProps {
  badge?: ReactNode;
  fields: Array<{
    label: string;
    value: ReactNode;
  }>;
  name: ReactNode;
}

export function ResourceMobileCard({
  badge,
  fields,
  name,
}: ResourceMobileCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <span className="min-w-0 text-2xl leading-none">
          {name}
        </span>
        {badge ? (
          <span className="max-w-[55%] rounded-full border border-foreground px-2 py-0.5 text-right font-mono text-xs leading-tight uppercase">
            {badge}
          </span>
        ) : null}
      </div>
      <dl className="grid grid-cols-3 gap-x-3 gap-y-3">
        {fields.map((field) => (
          <div key={field.label}>
            <dt className="font-mono text-muted-foreground text-xs uppercase">
              {field.label}
            </dt>
            <dd className="text-[12px] leading-tight">{field.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
