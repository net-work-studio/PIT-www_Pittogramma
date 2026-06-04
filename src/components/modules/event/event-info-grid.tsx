interface InfoItem {
  _key: string;
  title: string | null;
  content: string | null;
}

interface EventInfoGridProps {
  info: InfoItem[] | null;
}

export default function EventInfoGrid({ info }: EventInfoGridProps) {
  const items = info?.filter((i) => i.title && i.content);
  if (!items?.length) return null;

  const mid = Math.ceil(items.length / 2);
  const left = items.slice(0, mid);
  const right = items.slice(mid);

  return (
    <section className="border-foreground border-t-[0.5px] px-2.5 pt-6">
      <h2 className="font-mono text-muted-foreground text-xs uppercase lg:text-2xl">
        Info
      </h2>
      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:gap-0">
        <Column items={left} />
        {right.length > 0 && <Column items={right} />}
      </div>
    </section>
  );
}

function Column({ items }: { items: InfoItem[] }) {
  return (
    <dl className="flex flex-1 flex-col">
      {items.map((item) => (
        <div
          className="flex gap-x-8 border-foreground/10 border-t py-3 first:border-t-0 lg:first:border-t"
          key={item._key}
        >
          <dt className="w-[138px] shrink-0 font-mono text-sm uppercase lg:w-[200px]">
            {item.title}
          </dt>
          <dd className="whitespace-pre-line text-sm text-muted-foreground">
            {item.content}
          </dd>
        </div>
      ))}
    </dl>
  );
}
